import { Order, OrderStatus, TimelineEvent, CodRiskLevel } from '../../types';
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
import { HttpClient, ApiException } from '../client/HttpClient';
import { mockDataStore } from '../mock/mockStore';

export class OrdersMockService implements IOrdersService {
  constructor(private client: HttpClient) {}

  public async getOrders(params: OrderFilterParams = {}): Promise<PaginatedResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    let allOrders = mockDataStore.getOrders();

    // 1. Text Search Filter (Order ID, Customer Name, Phone, City, Product Name, SKU, Tracking Number)
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      allOrders = allOrders.filter(
        o =>
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.customerCity.toLowerCase().includes(q) ||
          o.productName.toLowerCase().includes(q) ||
          o.productSku.toLowerCase().includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    // 2. Status Filter (single or array)
    if (params.status) {
      if (Array.isArray(params.status)) {
        allOrders = allOrders.filter(o => (params.status as OrderStatus[]).includes(o.status));
      } else {
        allOrders = allOrders.filter(o => o.status === params.status);
      }
    }

    // 3. COD Risk Level Filter
    if (params.codRisk) {
      allOrders = allOrders.filter(o => o.codRisk === params.codRisk);
    }

    // 4. Courier Name Filter
    if (params.courierName && params.courierName !== 'ALL') {
      allOrders = allOrders.filter(
        o => o.courierName.toLowerCase() === params.courierName!.toLowerCase()
      );
    }

    // 5. Store Filter
    if (params.storeId) {
      allOrders = allOrders.filter(o => o.storeId === params.storeId);
    }

    // 6. Product Filter
    if (params.productId) {
      allOrders = allOrders.filter(o => o.productId === params.productId);
    }

    // 7. Phone/Customer Verification Filter
    if (params.isCustomerVerified !== undefined) {
      allOrders = allOrders.filter(o => o.isCustomerVerified === params.isCustomerVerified);
    }
    if (params.isPhoneVerified !== undefined) {
      allOrders = allOrders.filter(o => o.isPhoneVerified === params.isPhoneVerified);
    }

    // 8. Amount Range Filter
    if (params.minAmount !== undefined) {
      allOrders = allOrders.filter(o => o.sellingPricePKR >= params.minAmount!);
    }
    if (params.maxAmount !== undefined) {
      allOrders = allOrders.filter(o => o.sellingPricePKR <= params.maxAmount!);
    }

    // 9. Date Range Filter
    if (params.dateFrom) {
      const fromTime = new Date(params.dateFrom).getTime();
      allOrders = allOrders.filter(o => new Date(o.createdAt).getTime() >= fromTime);
    }
    if (params.dateTo) {
      const toTime = new Date(params.dateTo).getTime();
      allOrders = allOrders.filter(o => new Date(o.createdAt).getTime() <= toTime);
    }

    // 10. Sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    allOrders.sort((a, b) => {
      let valA: any = (a as any)[sortBy] ?? '';
      let valB: any = (b as any)[sortBy] ?? '';

      if (sortBy === 'createdAt') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    // 11. Pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const total = allOrders.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = allOrders.slice(startIndex, startIndex + limit);

    const response: PaginatedResponse<Order> = {
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      message: `Retrieved ${paginatedItems.length} orders successfully.`,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      filtersApplied: params
    };

    this.client.recordMockTelemetry(
      'GET',
      '/api/v1/orders',
      params,
      null,
      200,
      response,
      Date.now() - startTime
    );

    return response;
  }

  public async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const order = mockDataStore.getOrders().find(o => o.orderId === orderId);
    if (!order) {
      const notFound = {
        success: false as const,
        errorCode: 'ORDER_NOT_FOUND',
        message: `Order #${orderId} was not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('GET', `/api/v1/orders/${orderId}`, undefined, null, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
      message: `Order #${orderId} retrieved successfully.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('GET', `/api/v1/orders/${orderId}`, undefined, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async createOrder(dto: CreateOrderDTO): Promise<ApiResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    // Validation
    if (!dto.productId || !dto.customerName || !dto.customerPhone || !dto.sellingPricePKR) {
      const badReq = {
        success: false as const,
        errorCode: 'VALIDATION_ERROR',
        message: 'Product, customer name, customer phone, and selling price are required.',
        statusCode: 400,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('POST', '/api/v1/orders', undefined, dto, 400, badReq, Date.now() - startTime);
      throw new ApiException(badReq);
    }

    const product = mockDataStore.getProducts().find(p => p.id === dto.productId);
    if (!product) {
      const notFound = {
        success: false as const,
        errorCode: 'PRODUCT_NOT_FOUND',
        message: `Product with ID "${dto.productId}" does not exist.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('POST', '/api/v1/orders', undefined, dto, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const salePrice = Number(dto.sellingPricePKR);
    const supplierPayout = product.supplierCostPKR;
    const masterCommission = Math.round(salePrice * 0.02 * 100) / 100; // 2% platform fee
    const shipping = product.estShippingCostPKR || 220;
    const resellerMargin = Math.round((salePrice - supplierPayout - masterCommission) * 100) / 100;

    // Profit Guard Check
    if (resellerMargin < 100) {
      const marginErr = {
        success: false as const,
        errorCode: 'PROFIT_GUARD_VIOLATION',
        message: `Profit Guard Block: Reseller margin (PKR ${resellerMargin.toFixed(0)}) is too low. Suggested retail price is PKR ${product.recSellingPricePKR}.`,
        statusCode: 422,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('POST', '/api/v1/orders', undefined, dto, 422, marginErr, Date.now() - startTime);
      throw new ApiException(marginErr);
    }

    // COD Risk Assessment
    let codRisk: CodRiskLevel = 'LOW';
    let codRiskScore = 20;
    let codRiskReason = 'Standard urban residential destination.';

    if (salePrice > 6000) {
      codRisk = 'HIGH';
      codRiskScore = 75;
      codRiskReason = 'High value cash-on-delivery item. Verification recommended.';
    } else if (dto.customerCity.toLowerCase().includes('rural') || dto.customerAddress.length < 15) {
      codRisk = 'MEDIUM';
      codRiskScore = 55;
      codRiskReason = 'Short address detected. Confirm doorstep accessibility.';
    }

    const assignedCourier = dto.courierName || 'PostEx Express COD';
    const trackingCode = `PEX-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const initialTimeline: TimelineEvent = {
      id: 't-' + Date.now(),
      status: 'AWAITING_CONFIRMATION',
      title: 'Order Created via API',
      description: `Order booked for PKR ${salePrice.toLocaleString()}. Wholesale cost: PKR ${supplierPayout.toLocaleString()}.`,
      timestamp: new Date().toISOString(),
      actor: 'Order Service'
    };

    const newOrder: Order = {
      orderId: newOrderId,
      storeId: dto.storeId || 'store-1',
      storeName: dto.storeName || 'PakTrendy Shopify',
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      productSku: product.sku,
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      quantity: dto.quantity || 1,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail || `${dto.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      customerCity: dto.customerCity,
      customerAddress: dto.customerAddress,
      sellingPricePKR: salePrice,
      supplierPayoutPKR: supplierPayout,
      masterCommissionPKR: masterCommission,
      platformFeePKR: masterCommission,
      resellerMarginPKR: resellerMargin,
      shippingCostPKR: shipping,
      courierName: assignedCourier,
      trackingNumber: trackingCode,
      paymentMethod: dto.paymentMethod || 'Cash on Delivery (COD)',
      status: 'AWAITING_CONFIRMATION',
      codRisk,
      codRiskScore,
      codRiskReason,
      isCustomerVerified: false,
      isPhoneVerified: false,
      duplicateOrderDetected: false,
      repeatCustomer: false,
      internalNotes: dto.internalNotes || `Auto-assigned to ${assignedCourier}.`,
      invoicePaid: false,
      profitPaid: false,
      chargesPaid: false,
      adjustmentPending: false,
      createdAt: new Date().toISOString(),
      timeline: [initialTimeline]
    };

    // Decrement stock in store
    mockDataStore.updateProduct(product.id, {
      stock: Math.max(0, product.stock - 1)
    });

    // Add order to store
    mockDataStore.addOrder(newOrder);

    const response: ApiResponse<Order> = {
      success: true,
      data: newOrder,
      message: `Order #${newOrder.orderId} booked successfully.`,
      statusCode: 201,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('POST', '/api/v1/orders', undefined, dto, 201, response, Date.now() - startTime);
    return response;
  }

  public async updateOrder(orderId: string, dto: UpdateOrderDTO): Promise<ApiResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const existing = mockDataStore.getOrders().find(o => o.orderId === orderId);
    if (!existing) {
      const notFound = {
        success: false as const,
        errorCode: 'ORDER_NOT_FOUND',
        message: `Order #${orderId} was not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('PUT', `/api/v1/orders/${orderId}`, undefined, dto, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const updated = mockDataStore.updateOrder(orderId, dto as Partial<Order>);

    const response: ApiResponse<Order> = {
      success: true,
      data: updated!,
      message: `Order #${orderId} details updated successfully.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('PUT', `/api/v1/orders/${orderId}`, undefined, dto, 200, response, Date.now() - startTime);
    return response;
  }

  public async updateOrderStatus(orderId: string, dto: OrderStatusUpdateDTO): Promise<ApiResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const existing = mockDataStore.getOrders().find(o => o.orderId === orderId);
    if (!existing) {
      const notFound = {
        success: false as const,
        errorCode: 'ORDER_NOT_FOUND',
        message: `Order #${orderId} does not exist.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('PATCH', `/api/v1/orders/${orderId}/status`, undefined, dto, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const newTimelineEvent: TimelineEvent = {
      id: 't-' + Date.now(),
      status: dto.status,
      title: `Status set to ${dto.status.replace(/_/g, ' ')}`,
      description: dto.reason || dto.notes || `Updated to ${dto.status}`,
      timestamp: new Date().toISOString(),
      actor: dto.actor || 'Order Engine'
    };

    // If order was returned or cancelled, restore product stock
    if ((dto.status === 'RETURNED' || dto.status === 'CANCELLED') && existing.status !== 'RETURNED' && existing.status !== 'CANCELLED') {
      const prod = mockDataStore.getProducts().find(p => p.id === existing.productId);
      if (prod) {
        mockDataStore.updateProduct(prod.id, { stock: prod.stock + (existing.quantity || 1) });
      }
    }

    const isDelivered = dto.status === 'DELIVERED';
    const isDispatched = dto.status === 'DISPATCHED';

    const updated = mockDataStore.updateOrder(orderId, {
      status: dto.status,
      deliveredAt: isDelivered ? new Date().toISOString() : existing.deliveredAt,
      dispatchedAt: isDispatched ? new Date().toISOString() : existing.dispatchedAt,
      timeline: [newTimelineEvent, ...existing.timeline]
    });

    const response: ApiResponse<Order> = {
      success: true,
      data: updated!,
      message: `Order #${orderId} status transitioned to ${dto.status}.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('PATCH', `/api/v1/orders/${orderId}/status`, undefined, dto, 200, response, Date.now() - startTime);
    return response;
  }

  public async verifyCodOrder(orderId: string, dto: CodVerificationDTO): Promise<ApiResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const existing = mockDataStore.getOrders().find(o => o.orderId === orderId);
    if (!existing) {
      const notFound = {
        success: false as const,
        errorCode: 'ORDER_NOT_FOUND',
        message: `Order #${orderId} was not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('POST', `/api/v1/orders/${orderId}/verify-cod`, undefined, dto, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const nextStatus: OrderStatus = dto.isConfirmed ? 'CONFIRMED' : 'CANCELLED';
    const timelineEvent: TimelineEvent = {
      id: 't-' + Date.now(),
      status: nextStatus,
      title: dto.isConfirmed ? `COD Verified via ${dto.verificationMethod.replace(/_/g, ' ')}` : 'COD Rejected / Cancelled',
      description: dto.customerNotes || (dto.isConfirmed ? 'Customer confirmed purchase & delivery address.' : 'Customer declined order confirmation.'),
      timestamp: new Date().toISOString(),
      actor: 'COD Verification Engine'
    };

    if (!dto.isConfirmed && existing.status !== 'CANCELLED') {
      const prod = mockDataStore.getProducts().find(p => p.id === existing.productId);
      if (prod) {
        mockDataStore.updateProduct(prod.id, { stock: prod.stock + (existing.quantity || 1) });
      }
    }

    const updated = mockDataStore.updateOrder(orderId, {
      status: nextStatus,
      isCustomerVerified: dto.isConfirmed,
      isPhoneVerified: dto.isConfirmed,
      codRisk: dto.isConfirmed ? 'LOW' : existing.codRisk,
      internalNotes: dto.customerNotes ? `${existing.internalNotes} | ${dto.customerNotes}` : existing.internalNotes,
      timeline: [timelineEvent, ...existing.timeline]
    });

    const response: ApiResponse<Order> = {
      success: true,
      data: updated!,
      message: dto.isConfirmed ? `Order #${orderId} verified and confirmed.` : `Order #${orderId} cancelled per customer request.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('POST', `/api/v1/orders/${orderId}/verify-cod`, undefined, dto, 200, response, Date.now() - startTime);
    return response;
  }

  public async dispatchOrder(orderId: string, dto: CourierDispatchDTO): Promise<ApiResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const existing = mockDataStore.getOrders().find(o => o.orderId === orderId);
    if (!existing) {
      const notFound = {
        success: false as const,
        errorCode: 'ORDER_NOT_FOUND',
        message: `Order #${orderId} does not exist.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('POST', `/api/v1/orders/${orderId}/dispatch`, undefined, dto, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const courierCode = dto.courierName.substring(0, 3).toUpperCase();
    const trackingNumber = `${courierCode}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const timelineEvent: TimelineEvent = {
      id: 't-' + Date.now(),
      status: 'DISPATCHED',
      title: `Dispatched with ${dto.courierName}`,
      description: `Airway Bill Tracking #${trackingNumber}. Service: ${dto.serviceType || 'Standard COD'}.`,
      timestamp: new Date().toISOString(),
      actor: 'Courier Dispatch Center'
    };

    const updated = mockDataStore.updateOrder(orderId, {
      status: 'DISPATCHED',
      courierName: dto.courierName,
      trackingNumber,
      dispatchedAt: new Date().toISOString(),
      timeline: [timelineEvent, ...existing.timeline]
    });

    const response: ApiResponse<Order> = {
      success: true,
      data: updated!,
      message: `Order #${orderId} booked with ${dto.courierName}. Tracking: ${trackingNumber}`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('POST', `/api/v1/orders/${orderId}/dispatch`, undefined, dto, 200, response, Date.now() - startTime);
    return response;
  }

  public async cancelOrder(orderId: string, reason: string): Promise<ApiResponse<Order>> {
    return this.updateOrderStatus(orderId, {
      status: 'CANCELLED',
      reason: reason || 'Cancelled by admin / user',
      actor: 'User'
    });
  }

  public async deleteOrder(orderId: string): Promise<ApiResponse<{ deleted: boolean; orderId: string }>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const success = mockDataStore.deleteOrder(orderId);
    if (!success) {
      const notFound = {
        success: false as const,
        errorCode: 'ORDER_NOT_FOUND',
        message: `Order #${orderId} was not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('DELETE', `/api/v1/orders/${orderId}`, undefined, null, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const response: ApiResponse<{ deleted: boolean; orderId: string }> = {
      success: true,
      data: { deleted: true, orderId },
      message: `Order #${orderId} deleted.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('DELETE', `/api/v1/orders/${orderId}`, undefined, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async bulkUpdateStatus(orderIds: string[], status: OrderStatus, reason?: string): Promise<ApiResponse<{ updatedCount: number }>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    let count = 0;
    orderIds.forEach(id => {
      const existing = mockDataStore.getOrders().find(o => o.orderId === id);
      if (existing) {
        const timelineEvent: TimelineEvent = {
          id: 't-' + Date.now() + '-' + count,
          status,
          title: `Bulk status update: ${status.replace(/_/g, ' ')}`,
          description: reason || 'Updated via bulk actions',
          timestamp: new Date().toISOString(),
          actor: 'Bulk Action Manager'
        };

        mockDataStore.updateOrder(id, {
          status,
          timeline: [timelineEvent, ...existing.timeline]
        });
        count++;
      }
    });

    const response: ApiResponse<{ updatedCount: number }> = {
      success: true,
      data: { updatedCount: count },
      message: `Updated status for ${count} orders.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('POST', '/api/v1/orders/bulk-status', undefined, { orderIds, status }, 200, response, Date.now() - startTime);
    return response;
  }

  public async getOrderMetrics(): Promise<ApiResponse<OrderMetricsSummary>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const orders = mockDataStore.getOrders();
    const totalOrders = orders.length;
    const delivered = orders.filter(o => o.status === 'DELIVERED');
    const returned = orders.filter(o => o.status === 'RETURNED');
    const cancelled = orders.filter(o => o.status === 'CANCELLED');
    const inTransit = orders.filter(o => ['PROCESSING', 'PACKED', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.status));
    const awaiting = orders.filter(o => o.status === 'AWAITING_CONFIRMATION' || o.status === 'NEW');

    const totalRevenuePKR = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.sellingPricePKR : 0), 0);
    const totalResellerMarginPKR = orders.reduce((sum, o) => sum + (o.status === 'DELIVERED' ? o.resellerMarginPKR : 0), 0);
    const totalPlatformCommissionPKR = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' && o.status !== 'RETURNED' ? o.masterCommissionPKR : 0), 0);

    const nonCancelledCount = totalOrders - cancelled.length;
    const deliverySuccessRatePct = nonCancelledCount > 0 ? Math.round((delivered.length / nonCancelledCount) * 1000) / 10 : 0;
    const returnRatePct = nonCancelledCount > 0 ? Math.round((returned.length / nonCancelledCount) * 1000) / 10 : 0;

    const summary: OrderMetricsSummary = {
      totalOrders,
      pendingConfirmationCount: awaiting.length,
      inTransitCount: inTransit.length,
      deliveredCount: delivered.length,
      returnedCount: returned.length,
      cancelledCount: cancelled.length,
      totalRevenuePKR,
      totalResellerMarginPKR,
      totalPlatformCommissionPKR,
      avgOrderValuePKR: totalOrders > 0 ? Math.round(totalRevenuePKR / totalOrders) : 0,
      deliverySuccessRatePct,
      returnRatePct
    };

    const response: ApiResponse<OrderMetricsSummary> = {
      success: true,
      data: summary,
      message: 'Order pipeline metrics calculated.',
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('GET', '/api/v1/orders/metrics', undefined, null, 200, response, Date.now() - startTime);
    return response;
  }

  public async markOrderPaid(orderId: string, type: 'invoice' | 'profit' | 'charges'): Promise<ApiResponse<Order>> {
    const startTime = Date.now();
    await this.client.simulateNetworkLatency();

    const existing = mockDataStore.getOrders().find(o => o.orderId === orderId);
    if (!existing) {
      const notFound = {
        success: false as const,
        errorCode: 'ORDER_NOT_FOUND',
        message: `Order #${orderId} was not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString()
      };
      this.client.recordMockTelemetry('PATCH', `/api/v1/orders/${orderId}/mark-paid`, undefined, { type }, 404, notFound, Date.now() - startTime);
      throw new ApiException(notFound);
    }

    const updated = mockDataStore.updateOrder(orderId, {
      invoicePaid: type === 'invoice' ? true : existing.invoicePaid,
      profitPaid: type === 'profit' ? true : existing.profitPaid,
      chargesPaid: type === 'charges' ? true : existing.chargesPaid
    });

    const response: ApiResponse<Order> = {
      success: true,
      data: updated!,
      message: `Marked ${type} as PAID on Order #${orderId}.`,
      statusCode: 200,
      timestamp: new Date().toISOString()
    };

    this.client.recordMockTelemetry('PATCH', `/api/v1/orders/${orderId}/mark-paid`, undefined, { type }, 200, response, Date.now() - startTime);
    return response;
  }
}
