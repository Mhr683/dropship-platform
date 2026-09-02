import { Order, OrderStatus } from '../../types';
import {
  ApiResponse,
  PaginatedResponse,
  OrderFilterParams,
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderStatusUpdateDTO,
  CodVerificationDTO,
  CourierDispatchDTO,
  OrderMetricsSummary
} from '../types/api.types';
import { IOrdersService } from './IOrdersService';
import { HttpClient } from '../client/HttpClient';

/**
 * Production REST HTTP Client Implementation for Orders
 * Communicates with backend endpoints: /api/v1/orders
 */
export class OrdersApiService implements IOrdersService {
  constructor(private client: HttpClient) {}

  public async getOrders(params?: OrderFilterParams): Promise<PaginatedResponse<Order>> {
    const res = await this.client.get<any>('/orders', params);
    return res as unknown as PaginatedResponse<Order>;
  }

  public async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return this.client.get<Order>(`/orders/${orderId}`);
  }

  public async createOrder(dto: CreateOrderDTO): Promise<ApiResponse<Order>> {
    return this.client.post<Order>('/orders', dto);
  }

  public async updateOrder(orderId: string, dto: UpdateOrderDTO): Promise<ApiResponse<Order>> {
    return this.client.put<Order>(`/orders/${orderId}`, dto);
  }

  public async updateOrderStatus(orderId: string, dto: OrderStatusUpdateDTO): Promise<ApiResponse<Order>> {
    return this.client.patch<Order>(`/orders/${orderId}/status`, dto);
  }

  public async verifyCodOrder(orderId: string, dto: CodVerificationDTO): Promise<ApiResponse<Order>> {
    return this.client.post<Order>(`/orders/${orderId}/verify-cod`, dto);
  }

  public async dispatchOrder(orderId: string, dto: CourierDispatchDTO): Promise<ApiResponse<Order>> {
    return this.client.post<Order>(`/orders/${orderId}/dispatch`, dto);
  }

  public async cancelOrder(orderId: string, reason: string): Promise<ApiResponse<Order>> {
    return this.client.post<Order>(`/orders/${orderId}/cancel`, { reason });
  }

  public async deleteOrder(orderId: string): Promise<ApiResponse<{ deleted: boolean; orderId: string }>> {
    return this.client.delete<{ deleted: boolean; orderId: string }>(`/orders/${orderId}`);
  }

  public async bulkUpdateStatus(orderIds: string[], status: OrderStatus, reason?: string): Promise<ApiResponse<{ updatedCount: number }>> {
    return this.client.post<{ updatedCount: number }>('/orders/bulk-status', { orderIds, status, reason });
  }

  public async getOrderMetrics(): Promise<ApiResponse<OrderMetricsSummary>> {
    return this.client.get<OrderMetricsSummary>('/orders/metrics');
  }

  public async markOrderPaid(orderId: string, type: 'invoice' | 'profit' | 'charges'): Promise<ApiResponse<Order>> {
    return this.client.patch<Order>(`/orders/${orderId}/mark-paid`, { type });
  }
}
