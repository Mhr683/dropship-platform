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

/**
 * Service Contract for Orders Module
 * Replicates future production REST endpoints:
 * - GET /api/v1/orders
 * - GET /api/v1/orders/:orderId
 * - POST /api/v1/orders
 * - PUT /api/v1/orders/:orderId
 * - PATCH /api/v1/orders/:orderId/status
 * - POST /api/v1/orders/:orderId/verify-cod
 * - POST /api/v1/orders/:orderId/dispatch
 * - POST /api/v1/orders/:orderId/cancel
 * - DELETE /api/v1/orders/:orderId
 * - POST /api/v1/orders/bulk-status
 * - GET /api/v1/orders/metrics
 * - PATCH /api/v1/orders/:orderId/mark-paid
 */
export interface IOrdersService {
  getOrders(params?: OrderFilterParams): Promise<PaginatedResponse<Order>>;
  getOrderById(orderId: string): Promise<ApiResponse<Order>>;
  createOrder(dto: CreateOrderDTO): Promise<ApiResponse<Order>>;
  updateOrder(orderId: string, dto: UpdateOrderDTO): Promise<ApiResponse<Order>>;
  updateOrderStatus(orderId: string, dto: OrderStatusUpdateDTO): Promise<ApiResponse<Order>>;
  verifyCodOrder(orderId: string, dto: CodVerificationDTO): Promise<ApiResponse<Order>>;
  dispatchOrder(orderId: string, dto: CourierDispatchDTO): Promise<ApiResponse<Order>>;
  cancelOrder(orderId: string, reason: string): Promise<ApiResponse<Order>>;
  deleteOrder(orderId: string): Promise<ApiResponse<{ deleted: boolean; orderId: string }>>;
  bulkUpdateStatus(orderIds: string[], status: OrderStatus, reason?: string): Promise<ApiResponse<{ updatedCount: number }>>;
  getOrderMetrics(): Promise<ApiResponse<OrderMetricsSummary>>;
  markOrderPaid(orderId: string, type: 'invoice' | 'profit' | 'charges'): Promise<ApiResponse<Order>>;
}
