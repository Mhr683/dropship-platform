import { ApiResponse, ApiErrorResponse, ApiRequestLog } from '../types/api.types';

export interface HttpClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  mockLatencyMs?: number;
  simulateErrors?: boolean;
  headers?: Record<string, string>;
  authToken?: string;
}

export type RequestInterceptor = (config: RequestInit & { url: string }) => Promise<RequestInit & { url: string }> | (RequestInit & { url: string });
export type ResponseInterceptor = (response: ApiResponse<any>) => Promise<ApiResponse<any>> | ApiResponse<any>;
export type ErrorInterceptor = (error: ApiErrorResponse) => Promise<any> | any;

export class ApiException extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: any;
  public timestamp: string;

  constructor(errorResponse: ApiErrorResponse) {
    super(errorResponse.message);
    this.name = 'ApiException';
    this.statusCode = errorResponse.statusCode;
    this.errorCode = errorResponse.errorCode;
    this.details = errorResponse.details;
    this.timestamp = errorResponse.timestamp;
  }
}

/**
 * Modular HTTP & Mock-aware Client with Observability & Interceptors
 */
export class HttpClient {
  private config: HttpClientConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private static logs: ApiRequestLog[] = [];
  private static logListeners: Array<(logs: ApiRequestLog[]) => void> = [];

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api/v1',
      timeoutMs: config.timeoutMs || 10000,
      mockLatencyMs: config.mockLatencyMs ?? 250,
      simulateErrors: config.simulateErrors ?? false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(config.headers || {})
      },
      authToken: config.authToken
    };
  }

  public setAuthToken(token: string | undefined): void {
    this.config.authToken = token;
  }

  public setMockLatency(latencyMs: number): void {
    this.config.mockLatencyMs = latencyMs;
  }

  public setSimulateErrors(simulate: boolean): void {
    this.config.simulateErrors = simulate;
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  public addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  public static subscribeToLogs(listener: (logs: ApiRequestLog[]) => void): () => void {
    HttpClient.logListeners.push(listener);
    listener([...HttpClient.logs]);
    return () => {
      HttpClient.logListeners = HttpClient.logListeners.filter(l => l !== listener);
    };
  }

  public static getLogs(): ApiRequestLog[] {
    return [...HttpClient.logs];
  }

  public static clearLogs(): void {
    HttpClient.logs = [];
    HttpClient.notifyLogListeners();
  }

  private static logRequest(log: ApiRequestLog): void {
    HttpClient.logs = [log, ...HttpClient.logs].slice(0, 100); // keep last 100 logs
    HttpClient.notifyLogListeners();
  }

  private static notifyLogListeners(): void {
    HttpClient.logListeners.forEach(listener => listener([...HttpClient.logs]));
  }

  /**
   * Helper to simulate network latency for mock calls
   */
  public async simulateNetworkLatency(): Promise<void> {
    const latency = this.config.mockLatencyMs ?? 200;
    if (latency > 0) {
      await new Promise(resolve => setTimeout(resolve, latency));
    }
  }

  /**
   * Records a mock service execution in the centralized telemetry logs
   */
  public recordMockTelemetry<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    queryParams: Record<string, any> | undefined,
    requestBody: any,
    statusCode: number,
    responseBody: T,
    durationMs: number
  ): void {
    HttpClient.logRequest({
      id: 'req-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      queryParams,
      requestBody,
      responseStatus: statusCode,
      responseBody,
      durationMs,
      isMock: true
    });
  }

  /**
   * Standard Production HTTP Fetch Dispatcher
   */
  public async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options: {
      params?: Record<string, any>;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    let url = `${this.config.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: Record<string, string> = {
      ...this.config.headers,
      ...(this.config.authToken ? { Authorization: `Bearer ${this.config.authToken}` } : {}),
      ...(options.headers || {})
    };

    let requestInit: RequestInit & { url: string } = {
      url,
      method,
      headers,
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    };

    for (const interceptor of this.requestInterceptors) {
      requestInit = await interceptor(requestInit);
    }

    try {
      const response = await fetch(requestInit.url, requestInit);
      const data = await response.json();
      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        const errorResp: ApiErrorResponse = {
          success: false,
          errorCode: data?.errorCode || `HTTP_${response.status}`,
          message: data?.message || response.statusText || 'API Request Failed',
          details: data?.details,
          statusCode: response.status,
          timestamp: new Date().toISOString()
        };

        HttpClient.logRequest({
          id: 'req-' + Date.now(),
          timestamp: new Date().toISOString(),
          method,
          endpoint: path,
          queryParams: options.params,
          requestBody: options.body,
          responseStatus: response.status,
          responseBody: errorResp,
          durationMs,
          isMock: false
        });

        for (const errInterceptor of this.errorInterceptors) {
          await errInterceptor(errorResp);
        }

        throw new ApiException(errorResp);
      }

      let apiResponse: ApiResponse<T> = {
        success: true,
        data: data.data !== undefined ? data.data : data,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        statusCode: response.status,
        meta: data.meta
      };

      for (const resInterceptor of this.responseInterceptors) {
        apiResponse = await resInterceptor(apiResponse);
      }

      HttpClient.logRequest({
        id: 'req-' + Date.now(),
        timestamp: new Date().toISOString(),
        method,
        endpoint: path,
        queryParams: options.params,
        requestBody: options.body,
        responseStatus: response.status,
        responseBody: apiResponse,
        durationMs,
        isMock: false
      });

      return apiResponse;
    } catch (err: any) {
      if (err instanceof ApiException) {
        throw err;
      }

      const errorResp: ApiErrorResponse = {
        success: false,
        errorCode: 'NETWORK_ERROR',
        message: err.message || 'Network request failed or server unreachable.',
        statusCode: 0,
        timestamp: new Date().toISOString()
      };

      HttpClient.logRequest({
        id: 'req-' + Date.now(),
        timestamp: new Date().toISOString(),
        method,
        endpoint: path,
        queryParams: options.params,
        requestBody: options.body,
        responseStatus: 0,
        responseBody: errorResp,
        durationMs: Date.now() - startTime,
        isMock: false
      });

      throw new ApiException(errorResp);
    }
  }

  public get<T = any>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, { params });
  }

  public post<T = any>(path: string, body?: any, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, { body, params });
  }

  public put<T = any>(path: string, body?: any, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, { body, params });
  }

  public patch<T = any>(path: string, body?: any, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, { body, params });
  }

  public delete<T = any>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, { params });
  }
}

export const defaultHttpClient = new HttpClient();
