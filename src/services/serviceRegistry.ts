import { HttpClient } from './client/HttpClient';
import { IProductsService } from './products/IProductsService';
import { ProductsMockService } from './products/ProductsMockService';
import { ProductsApiService } from './products/ProductsApiService';
import { IOrdersService } from './orders/IOrdersService';
import { OrdersMockService } from './orders/OrdersMockService';
import { OrdersApiService } from './orders/OrdersApiService';

export interface ServiceContainerConfig {
  useMock: boolean;
  baseUrl?: string;
  mockLatencyMs?: number;
  simulateErrors?: boolean;
}

/**
 * Service Factory & Dependency Injection Container
 * Allows switching between Mock Services and Real Backend Endpoints seamlessly
 */
export class ServiceRegistry {
  private httpClient: HttpClient;
  private useMock: boolean = true;
  private productsServiceInstance!: IProductsService;
  private ordersServiceInstance!: IOrdersService;
  private listeners: Set<() => void> = new Set();

  constructor(config?: Partial<ServiceContainerConfig>) {
    this.useMock = config?.useMock ?? true;
    this.httpClient = new HttpClient({
      baseUrl: config?.baseUrl || '/api/v1',
      mockLatencyMs: config?.mockLatencyMs ?? 150,
      simulateErrors: config?.simulateErrors ?? false
    });
    this.initServices();
  }

  private initServices(): void {
    if (this.useMock) {
      this.productsServiceInstance = new ProductsMockService(this.httpClient);
      this.ordersServiceInstance = new OrdersMockService(this.httpClient);
    } else {
      this.productsServiceInstance = new ProductsApiService(this.httpClient);
      this.ordersServiceInstance = new OrdersApiService(this.httpClient);
    }
  }

  public getProductsService(): IProductsService {
    return this.productsServiceInstance;
  }

  public getOrdersService(): IOrdersService {
    return this.ordersServiceInstance;
  }

  public getHttpClient(): HttpClient {
    return this.httpClient;
  }

  public isUsingMock(): boolean {
    return this.useMock;
  }

  public setUseMock(useMock: boolean): void {
    if (this.useMock !== useMock) {
      this.useMock = useMock;
      this.initServices();
      this.notifyListeners();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => l());
  }
}

// Global Singleton Registry
export const serviceRegistry = new ServiceRegistry({
  useMock: true,
  mockLatencyMs: 200
});

// Primary Service Proxies that delegate to active instance
export const productsService: IProductsService = {
  getProducts: (params) => serviceRegistry.getProductsService().getProducts(params),
  getProductById: (id) => serviceRegistry.getProductsService().getProductById(id),
  getProductBySku: (sku) => serviceRegistry.getProductsService().getProductBySku(sku),
  createProduct: (dto) => serviceRegistry.getProductsService().createProduct(dto),
  updateProduct: (id, dto) => serviceRegistry.getProductsService().updateProduct(id, dto),
  deleteProduct: (id) => serviceRegistry.getProductsService().deleteProduct(id),
  adjustStock: (id, dto) => serviceRegistry.getProductsService().adjustStock(id, dto),
  bulkImportProducts: (prods) => serviceRegistry.getProductsService().bulkImportProducts(prods),
  getCategories: () => serviceRegistry.getProductsService().getCategories(),
  getTrendingProducts: (limit) => serviceRegistry.getProductsService().getTrendingProducts(limit),
  getBestSellers: (limit) => serviceRegistry.getProductsService().getBestSellers(limit)
};

export const ordersService: IOrdersService = {
  getOrders: (params) => serviceRegistry.getOrdersService().getOrders(params),
  getOrderById: (orderId) => serviceRegistry.getOrdersService().getOrderById(orderId),
  createOrder: (dto) => serviceRegistry.getOrdersService().createOrder(dto),
  updateOrder: (orderId, dto) => serviceRegistry.getOrdersService().updateOrder(orderId, dto),
  updateOrderStatus: (orderId, dto) => serviceRegistry.getOrdersService().updateOrderStatus(orderId, dto),
  verifyCodOrder: (orderId, dto) => serviceRegistry.getOrdersService().verifyCodOrder(orderId, dto),
  dispatchOrder: (orderId, dto) => serviceRegistry.getOrdersService().dispatchOrder(orderId, dto),
  cancelOrder: (orderId, reason) => serviceRegistry.getOrdersService().cancelOrder(orderId, reason),
  deleteOrder: (orderId) => serviceRegistry.getOrdersService().deleteOrder(orderId),
  bulkUpdateStatus: (orderIds, status, reason) => serviceRegistry.getOrdersService().bulkUpdateStatus(orderIds, status, reason),
  getOrderMetrics: () => serviceRegistry.getOrdersService().getOrderMetrics(),
  markOrderPaid: (orderId, type) => serviceRegistry.getOrdersService().markOrderPaid(orderId, type)
};
