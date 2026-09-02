export type UserRole = 'ADMIN' | 'SUPPLIER' | 'RESELLER' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
  avatar: string;
  walletBalancePKR: number;
  phone: string;
  city: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  supplierId: string;
  supplierName: string;
  supplierCostPKR: number;
  recSellingPricePKR: number;
  stock: number;
  image: string;
  images: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  isActive: boolean;
  brand?: string;
  warranty?: string;
  highlights?: string[];
  whatsInTheBox?: string;
  weightKg: number;
  description: string;
  rating: number;
  salesCount: number;
  isTrending: boolean;
  tags: string[];
  moq: number;
  colorVariants?: string[];
}

export interface BankTransferDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  instructions: string;
  isActive?: boolean;
}

export interface HelplineContact {
  phone: string;
  whatsapp?: string;
  email: string;
  timings?: string;
  description?: string;
}

export interface PlatformHelplinesConfig {
  buyersHelpline: HelplineContact;
  resellersHelpline: HelplineContact;
  manufacturersHelpline: HelplineContact;
}

export interface AdminSecurityConfig {
  adminKey: string;
  pin: string;
  twoFactorEnabled: boolean;
  autoLockMinutes: number;
  emergencyFreezeMode: boolean;
  ipWhitelist: string[];
}

export interface AdminAuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  adminUser: string;
}

export interface ProfitGuardConfig {
  minProfitAmountPKR: number;
  minProfitMarginPct: number;
  fxRiskBufferPct: number;
  defaultShippingCostPKR: number;
  processingFeePKR: number; // Flat Rs. 30
  platformFeePct: number; // 2% Platform fee
  defaultGatewayFeePKR: number;
  enforceLock: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  image: string;
  qty: number;
  supplierCostPKR: number;
  sellingPricePKR: number;
}

export type OrderStatus =
  | 'PENDING_VERIFICATION'
  | 'COD_CONFIRMED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

export type CodRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ChatMessage {
  id: string;
  senderRole: 'RESELLER' | 'CUSTOMER' | 'SUPPLIER' | 'PLATFORM' | 'ADMIN';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  items: OrderItem[];
  sellingPricePKR: number;
  supplierCostPKR: number;
  processingFeePKR: number; // Rs. 30 flat processing fee
  shippingCostPKR: number; // e.g. Rs. 250 delivery fee
  platformFeePKR: number; // 2% platform fee
  resellerCommissionPKR: number; // Net profit payout to reseller after deductions
  gatewayFeePKR: number;
  netProfitPKR: number;
  profitMarginPct: number;
  status: OrderStatus;
  codRisk: CodRiskLevel;
  codOtpVerified: boolean;
  profitGuardApproved: boolean;
  profitGuardReason: string;
  createdAt: string;
  trackingNumber?: string;
  courierName?: string;
  resellerId: string;
  resellerName: string;
  supplierId: string;
  supplierName: string;
  syncedStore?: 'Shopify' | 'Daraz PK' | 'WooCommerce' | 'TikTok Shop' | 'Direct Link' | 'Direct Reseller Order';
  isInternational?: boolean;
  messages: ChatMessage[];
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  amountPKR: number;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING';
  refOrderId?: string;
}

export interface StoreIntegration {
  id: string;
  platform: 'Shopify' | 'Daraz PK' | 'WooCommerce' | 'TikTok Shop';
  storeName: string;
  connected: boolean;
  lastSync: string;
  activeProductsCount: number;
  autoSyncOrders: boolean;
  webhookStatus: 'ACTIVE' | 'PAUSED';
}
