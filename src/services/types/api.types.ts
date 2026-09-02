import { Product, Order, OrderStatus, CodRiskLevel, TimelineEvent, ProductVariant } from '../../types';

/**
 * Standard API Response Envelope
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  statusCode: number;
  meta?: Record<string, any>;
}

/**
 * Standard Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Standard Paginated Response Envelope
 */
export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
  timestamp: string;
  statusCode: number;
  filtersApplied?: Record<string, any>;
}

/**
 * Standard API Error Response Envelope
 */
export interface ApiErrorResponse {
  success: false;
  errorCode: string;
  message: string;
  details?: any;
  statusCode: number;
  timestamp: string;
}

/**
 * Common Query & Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product Query Filter Parameters
 */
export interface ProductFilterParams extends PaginationParams {
  search?: string;
  category?: string;
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PRICE_CHANGED' | 'UNAVAILABLE' | 'ACTIVE';
  minPrice?: number;
  maxPrice?: number;
  supplierId?: string;
  isTrending?: boolean;
  isBestSeller?: boolean;
  competitionLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  minStock?: number;
}

/**
 * DTO for Creating a Product
 */
export interface CreateProductDTO {
  name: string;
  sku?: string;
  category: string;
  supplierId: string;
  supplierName: string;
  supplierCostPKR: number;
  recSellingPricePKR: number;
  stock: number;
  image: string;
  description: string;
  ownerRole?: 'SUPPLIER' | 'RESELLER' | 'ADMIN';
  fastShipping?: boolean;
  estDeliveryDays?: number;
  estShippingCostPKR?: number;
  variants?: ProductVariant[];
  lowStockThreshold?: number;
  competitionLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  isTrending?: boolean;
  isBestSeller?: boolean;
}

/**
 * DTO for Updating a Product
 */
export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  rating?: number;
  salesPotentialScore?: number;
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PRICE_CHANGED' | 'UNAVAILABLE' | 'ACTIVE';
}

/**
 * DTO for Stock Adjustment
 */
export interface ProductStockUpdateDTO {
  stockChange: number;
  operation: 'SET' | 'INCREMENT' | 'DECREMENT';
  reason?: string;
}

/**
 * Order Query Filter Parameters
 */
export interface OrderFilterParams extends PaginationParams {
  search?: string;
  status?: OrderStatus | OrderStatus[];
  codRisk?: CodRiskLevel;
  courierName?: string;
  storeId?: string;
  productId?: string;
  supplierId?: string;
  dateFrom?: string;
  dateTo?: string;
  isCustomerVerified?: boolean;
  isPhoneVerified?: boolean;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * DTO for Creating an Order
 */
export interface CreateOrderDTO {
  productId: string;
  quantity?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  sellingPricePKR: number;
  storeId?: string;
  storeName?: string;
  courierName?: string;
  internalNotes?: string;
  paymentMethod?: string;
}

/**
 * DTO for Updating an Order
 */
export interface UpdateOrderDTO {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCity?: string;
  customerAddress?: string;
  sellingPricePKR?: number;
  courierName?: string;
  trackingNumber?: string;
  internalNotes?: string;
  invoicePaid?: boolean;
  profitPaid?: boolean;
  chargesPaid?: boolean;
}

/**
 * DTO for Updating Order Status
 */
export interface OrderStatusUpdateDTO {
  status: OrderStatus;
  reason?: string;
  actor?: string;
  notes?: string;
}

/**
 * DTO for COD Verification
 */
export interface CodVerificationDTO {
  isConfirmed: boolean;
  verificationMethod: 'WHATSAPP_OTP' | 'IVR_VOICE_CALL' | 'MANUAL_AGENT' | 'SMS_LINK';
  otpCode?: string;
  customerNotes?: string;
}

/**
 * DTO for Courier Dispatch
 */
export interface CourierDispatchDTO {
  courierId: string;
  courierName: string;
  serviceType?: 'STANDARD_COD' | 'EXPRESS_COD' | 'OVERNIGHT';
  packageWeightKg?: number;
  pickupAddress?: string;
  specialInstructions?: string;
}

/**
 * Summary Metrics for Orders
 */
export interface OrderMetricsSummary {
  totalOrders: number;
  pendingConfirmationCount: number;
  inTransitCount: number;
  deliveredCount: number;
  returnedCount: number;
  cancelledCount: number;
  totalRevenuePKR: number;
  totalResellerMarginPKR: number;
  totalPlatformCommissionPKR: number;
  avgOrderValuePKR: number;
  deliverySuccessRatePct: number;
  returnRatePct: number;
}

/**
 * Request Log entry for observability and debugging
 */
export interface ApiRequestLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  queryParams?: Record<string, any>;
  requestBody?: any;
  responseStatus: number;
  responseBody?: any;
  durationMs: number;
  isMock: boolean;
}
