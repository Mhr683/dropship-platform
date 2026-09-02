import { Product, Order, OrderStatus } from '../types';
import {
  ApiResponse,
  PaginatedResponse,
  ProductFilterParams,
  CreateProductDTO,
  UpdateProductDTO,
  ProductStockUpdateDTO,
  OrderFilterParams,
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderStatusUpdateDTO,
  CodVerificationDTO,
  CourierDispatchDTO,
  OrderMetricsSummary
} from './types/api.types';
import { productsService, ordersService, serviceRegistry } from './serviceRegistry';

/**
 * Modular API Service exporting mock fetch functions for 'products' and 'orders'
 * Suitable for standalone import or global injection via AppContext.
 */

// ==========================================
// 1. PRODUCTS MOCK FETCH FUNCTIONS
// ==========================================

export const fetchProducts = async (
  params?: ProductFilterParams
): Promise<PaginatedResponse<Product>> => {
  return productsService.getProducts(params);
};

export const fetchProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  return productsService.getProductById(id);
};

export const fetchProductBySku = async (
  sku: string
): Promise<ApiResponse<Product>> => {
  return productsService.getProductBySku(sku);
};

export const createProduct = async (
  dto: CreateProductDTO
): Promise<ApiResponse<Product>> => {
  return productsService.createProduct(dto);
};

export const updateProduct = async (
  id: string,
  dto: UpdateProductDTO
): Promise<ApiResponse<Product>> => {
  return productsService.updateProduct(id, dto);
};

export const deleteProduct = async (
  id: string
): Promise<ApiResponse<{ deleted: boolean; id: string }>> => {
  return productsService.deleteProduct(id);
};

export const adjustProductStock = async (
  id: string,
  dto: ProductStockUpdateDTO
): Promise<ApiResponse<Product>> => {
  return productsService.adjustStock(id, dto);
};

export const fetchCategories = async (): Promise<ApiResponse<string[]>> => {
  return productsService.getCategories();
};

export const fetchTrendingProducts = async (
  limit?: number
): Promise<ApiResponse<Product[]>> => {
  return productsService.getTrendingProducts(limit);
};

export const fetchBestSellers = async (
  limit?: number
): Promise<ApiResponse<Product[]>> => {
  return productsService.getBestSellers(limit);
};

// ==========================================
// 2. ORDERS MOCK FETCH FUNCTIONS
// ==========================================

export const fetchOrders = async (
  params?: OrderFilterParams
): Promise<PaginatedResponse<Order>> => {
  return ordersService.getOrders(params);
};

export const fetchOrderById = async (
  orderId: string
): Promise<ApiResponse<Order>> => {
  return ordersService.getOrderById(orderId);
};

export const createOrder = async (
  dto: CreateOrderDTO
): Promise<ApiResponse<Order>> => {
  return ordersService.createOrder(dto);
};

export const updateOrder = async (
  orderId: string,
  dto: UpdateOrderDTO
): Promise<ApiResponse<Order>> => {
  return ordersService.updateOrder(orderId, dto);
};

export const updateOrderStatus = async (
  orderId: string,
  dto: OrderStatusUpdateDTO
): Promise<ApiResponse<Order>> => {
  return ordersService.updateOrderStatus(orderId, dto);
};

export const verifyCodOrder = async (
  orderId: string,
  dto: CodVerificationDTO
): Promise<ApiResponse<Order>> => {
  return ordersService.verifyCodOrder(orderId, dto);
};

export const dispatchOrder = async (
  orderId: string,
  dto: CourierDispatchDTO
): Promise<ApiResponse<Order>> => {
  return ordersService.dispatchOrder(orderId, dto);
};

export const cancelOrder = async (
  orderId: string,
  reason: string
): Promise<ApiResponse<Order>> => {
  return ordersService.cancelOrder(orderId, reason);
};

export const deleteOrder = async (
  orderId: string
): Promise<ApiResponse<{ deleted: boolean; orderId: string }>> => {
  return ordersService.deleteOrder(orderId);
};

export const bulkUpdateOrderStatus = async (
  orderIds: string[],
  status: OrderStatus,
  reason?: string
): Promise<ApiResponse<{ updatedCount: number }>> => {
  return ordersService.bulkUpdateStatus(orderIds, status, reason);
};

export const fetchOrderMetrics = async (): Promise<ApiResponse<OrderMetricsSummary>> => {
  return ordersService.getOrderMetrics();
};

export const markOrderPaid = async (
  orderId: string,
  type: 'invoice' | 'profit' | 'charges'
): Promise<ApiResponse<Order>> => {
  return ordersService.markOrderPaid(orderId, type);
};

// ==========================================
// 3. GROUPED MODULAR EXPORTS
// ==========================================

export const productsApi = {
  fetchProducts,
  fetchProductById,
  fetchProductBySku,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock,
  fetchCategories,
  fetchTrendingProducts,
  fetchBestSellers
};

export const ordersApi = {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  verifyCodOrder,
  dispatchOrder,
  cancelOrder,
  deleteOrder,
  bulkUpdateOrderStatus,
  fetchOrderMetrics,
  markOrderPaid
};

export const apiService = {
  products: productsApi,
  orders: ordersApi,
  registry: serviceRegistry
};

export default apiService;
