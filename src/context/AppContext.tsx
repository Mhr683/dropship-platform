import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Product,
  Order,
  OrderStatus,
  Supplier,
  Courier,
  PricingRule,
  ConnectedStore,
  ReturnRequest,
  CustomerProfile,
  PayoutRequest,
  WalletTransaction,
  SupportTicket,
  AppNotification,
  CouponPromotion,
  ReferralStat,
  AuditLogEntry,
  InventorySyncLog,
  CartItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_COURIERS,
  INITIAL_ORDERS,
  INITIAL_PRICING_RULES,
  INITIAL_CONNECTED_STORES,
  INITIAL_RETURN_REQUESTS,
  INITIAL_CUSTOMERS,
  INITIAL_PAYOUT_REQUESTS,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COUPONS,
  INITIAL_REFERRAL,
  INITIAL_AUDIT_LOGS,
  INITIAL_INVENTORY_LOGS,
  INITIAL_SUPPORT_TICKETS
} from '../data/mockData';
import { mockDataStore, productsService, ordersService, apiService, productsApi, ordersApi } from '../services';

export type NavigationTab =
  | 'dashboard'
  | 'finder'
  | 'products'
  | 'orders'
  | 'calculator'
  | 'pricing-rules'
  | 'inventory'
  | 'suppliers'
  | 'cod-automation'
  | 'couriers'
  | 'returns'
  | 'customers'
  | 'wallet'
  | 'admin-control'
  | 'multi-store'
  | 'bulk-import'
  | 'analytics'
  | 'knowledge'
  | 'support'
  | 'coupons'
  | 'referrals'
  | 'landing';

interface AppContextType {
  // Navigation & Role
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  usersList: UserProfile[];
  
  // Data entities
  products: Product[];
  orders: Order[];
  suppliers: Supplier[];
  couriers: Courier[];
  pricingRules: PricingRule[];
  stores: ConnectedStore[];
  returns: ReturnRequest[];
  customers: CustomerProfile[];
  payoutRequests: PayoutRequest[];
  walletTransactions: WalletTransaction[];
  supportTickets: SupportTicket[];
  notifications: AppNotification[];
  coupons: CouponPromotion[];
  referralStat: ReferralStat;
  auditLogs: AuditLogEntry[];
  inventoryLogs: InventorySyncLog[];

  // Master Wallet & Reseller Wallet Calculations
  masterWalletBalancePKR: number;
  resellerAvailableBalancePKR: number;
  resellerPendingBalancePKR: number;
  resellerProcessingBalancePKR: number;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  placeOrder: (orderData: {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerCity: string;
    customerAddress: string;
    sellingPricePKR: number;
    storeId?: string;
    storeName?: string;
    courierName?: string;
  }) => { success: boolean; orderId?: string; reason?: string };

  advanceOrderStatus: (orderId: string) => void;
  setOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  verifyOrderCod: (orderId: string, isCustomerConfirmed: boolean, note?: string) => void;
  markOrderPaid: (orderId: string, type: 'invoice' | 'profit' | 'charges') => void;
  
  createReturnRequest: (returnData: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReturnStatus: (id: string, status: ReturnRequest['status'], notes?: string) => void;

  requestPayout: (amountPKR: number, bankDetails: { bankName: string; accountTitle: string; accountNumber: string }) => boolean;
  updatePayoutStatus: (payoutId: string, status: PayoutRequest['status'], adminNote?: string) => void;

  addPricingRule: (rule: Omit<PricingRule, 'id' | 'createdAt'>) => void;
  togglePricingRule: (id: string) => void;
  deletePricingRule: (id: string) => void;

  connectStore: (platform: ConnectedStore['platform'], storeName: string, domain: string, apiKey: string) => void;
  disconnectStore: (id: string) => void;
  triggerStoreSync: (id: string) => void;

  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => void;
  replyToTicket: (ticketId: string, message: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  createCoupon: (coupon: Omit<CouponPromotion, 'id' | 'usageCount' | 'revenueGeneratedPKR' | 'totalDiscountGivenPKR'>) => void;
  toggleCoupon: (id: string) => void;

  registerUser: (userData: Omit<UserProfile, 'id' | 'registeredAt' | 'walletBalancePKR' | 'totalEarnedPKR'>) => UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  logAudit: (action: string, oldValue?: string, newValue?: string) => void;

  // Modals & Active Selections
  isProfileSettingsOpen: boolean;
  setIsProfileSettingsOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  isProfitCalcModalOpen: boolean;
  setIsProfitCalcModalOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  isProductDetailModalOpen: boolean;
  setIsProductDetailModalOpen: (open: boolean) => void;
  isCodModalOpen: boolean;
  setIsCodModalOpen: (open: boolean) => void;
  isPayoutModalOpen: boolean;
  setIsPayoutModalOpen: (open: boolean) => void;
  isTrustPolicyModalOpen: boolean;
  setIsTrustPolicyModalOpen: (open: boolean) => void;
  isApiExplorerOpen: boolean;
  setIsApiExplorerOpen: (open: boolean) => void;

  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  selectedOrderForModal: Order | null;
  setSelectedOrderForModal: (order: Order | null) => void;

  // Filter & Search helper
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Cart Management
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, targetSellingPrice?: number, variantId?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  updateCartSellingPrice: (cartItemId: string, targetPrice: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartTotalSupplierCostPKR: number;
  cartTotalSellingPricePKR: number;
  cartTotalProfitPKR: number;
  cartToast: { message: string; subtext?: string } | null;
  setCartToast: (toast: { message: string; subtext?: string } | null) => void;

  // Quick Actions & Services
  calculateSmartSellingPrice: (supplierCost: number, category: string) => { sellingPrice: number; marginPKR: number; marginPct: number };
  productsService: typeof productsService;
  ordersService: typeof ordersService;
  apiService: typeof apiService;
  productsApi: typeof productsApi;
  ordersApi: typeof ordersApi;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [activeRole, setActiveRole] = useState<UserRole>('SUPER_ADMIN');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ym_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Entities with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ym_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ym_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [couriers, setCouriers] = useState<Courier[]>(INITIAL_COURIERS);

  const [pricingRules, setPricingRules] = useState<PricingRule[]>(() => {
    const saved = localStorage.getItem('ym_pricing_rules');
    return saved ? JSON.parse(saved) : INITIAL_PRICING_RULES;
  });

  const [stores, setStores] = useState<ConnectedStore[]>(() => {
    const saved = localStorage.getItem('ym_stores');
    return saved ? JSON.parse(saved) : INITIAL_CONNECTED_STORES;
  });

  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem('ym_returns');
    return saved ? JSON.parse(saved) : INITIAL_RETURN_REQUESTS;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('ym_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem('ym_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUT_REQUESTS;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('ym_txns');
    return saved ? JSON.parse(saved) : INITIAL_WALLET_TRANSACTIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ym_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [coupons, setCoupons] = useState<CouponPromotion[]>(INITIAL_COUPONS);
  const [referralStat, setReferralStat] = useState<ReferralStat>(INITIAL_REFERRAL);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [inventoryLogs, setInventoryLogs] = useState<InventorySyncLog[]>(INITIAL_INVENTORY_LOGS);

  // Modals state
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isProfitCalcModalOpen, setIsProfitCalcModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [isCodModalOpen, setIsCodModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isTrustPolicyModalOpen, setIsTrustPolicyModalOpen] = useState(false);
  const [isApiExplorerOpen, setIsApiExplorerOpen] = useState(false);

  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State with LocalStorage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ym_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState<{ message: string; subtext?: string } | null>(null);

  // Subscribe to reactive MockDataStore for live SOA synchronization
  useEffect(() => {
    const unsubProds = mockDataStore.subscribeProducts(latestProds => {
      setProducts(latestProds);
    });
    const unsubOrders = mockDataStore.subscribeOrders(latestOrders => {
      setOrders(latestOrders);
    });
    return () => {
      unsubProds();
      unsubOrders();
    };
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('ym_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ym_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ym_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('ym_pricing_rules', JSON.stringify(pricingRules));
  }, [pricingRules]);

  useEffect(() => {
    localStorage.setItem('ym_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('ym_returns', JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem('ym_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ym_payouts', JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  useEffect(() => {
    localStorage.setItem('ym_txns', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  useEffect(() => {
    localStorage.setItem('ym_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ym_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Totals Calculation
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalSupplierCostPKR = cart.reduce((sum, item) => sum + (item.product.supplierCostPKR * item.quantity), 0);
  const cartTotalSellingPricePKR = cart.reduce((sum, item) => sum + (item.targetSellingPricePKR * item.quantity), 0);
  const cartTotalProfitPKR = cartTotalSellingPricePKR - cartTotalSupplierCostPKR;

  // Cart Actions
  const addToCart = (product: Product, quantity = 1, targetSellingPrice?: number, variantId?: string) => {
    const defaultSellingPrice = targetSellingPrice || product.recSellingPricePKR;
    const unitMargin = Math.max(0, defaultSellingPrice - product.supplierCostPKR);
    const cartItemId = variantId ? `${product.id}-${variantId}` : product.id;

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          quantity,
          selectedVariantId: variantId,
          targetSellingPricePKR: defaultSellingPrice,
          customerMarginPKR: unitMargin
        };
        return [...prevCart, newItem];
      }
    });

    const totalEstProfit = unitMargin * quantity;
    setCartToast({
      message: `"${product.name}" کارٹ میں شامل کر دیا گیا!`,
      subtext: `Estimated Reseller Margin: +PKR ${totalEstProfit.toLocaleString()}`
    });

    setTimeout(() => {
      setCartToast(null);
    }, 3200);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const updateCartSellingPrice = (cartItemId: string, targetPrice: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const unitMargin = Math.max(0, targetPrice - item.product.supplierCostPKR);
        return {
          ...item,
          targetSellingPricePKR: targetPrice,
          customerMarginPKR: unitMargin
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Sync role change with user
  const handleSetRole = (role: UserRole) => {
    setActiveRole(role);
    const matched = usersList.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    } else {
      const fallback = usersList[0];
      setCurrentUser({ ...fallback, role });
    }
  };

  // Calculations
  const masterWalletBalancePKR = orders.reduce((sum, o) => {
    if (o.status !== 'CANCELLED' && o.status !== 'RETURNED') {
      return sum + o.masterCommissionPKR;
    }
    return sum;
  }, 45200);

  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const inTransitOrders = orders.filter(o => o.status === 'IN_TRANSIT' || o.status === 'PROCESSING' || o.status === 'DISPATCHED' || o.status === 'CONFIRMED');

  const resellerAvailableBalancePKR = deliveredOrders.reduce((sum, o) => {
    return sum + (o.profitPaid ? 0 : o.resellerMarginPKR);
  }, 64850);

  const resellerPendingBalancePKR = inTransitOrders.reduce((sum, o) => sum + o.resellerMarginPKR, 0);

  const resellerProcessingBalancePKR = payoutRequests
    .filter(p => p.status === 'PROCESSING' || p.status === 'UNDER_REVIEW' || p.status === 'REQUESTED')
    .reduce((sum, p) => sum + p.amountPKR, 0);

  // Audit logging helper
  const logAudit = (action: string, oldValue?: string, newValue?: string) => {
    const newEntry: AuditLogEntry = {
      id: 'log-' + Date.now(),
      user: currentUser.name,
      userRole: activeRole,
      action,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      ip: '182.180.14.99',
      oldValue,
      newValue
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Smart Selling Price Calculation using Active Rules
  const calculateSmartSellingPrice = (supplierCost: number, category: string) => {
    const applicableRule = pricingRules.find(r => r.isActive && (r.targetCategory === category || r.targetCategory === 'ALL'));
    
    let calculated = supplierCost * 1.4; // default 40%
    let minProfit = 500;

    if (applicableRule) {
      minProfit = applicableRule.minProfitPKR;
      if (applicableRule.marginType === 'PERCENT') {
        calculated = supplierCost * (1 + applicableRule.marginValue / 100);
      } else {
        calculated = supplierCost + applicableRule.marginValue;
      }

      // Profit Guard: ensure at least min profit
      if (calculated - supplierCost < minProfit) {
        calculated = supplierCost + minProfit;
      }

      // Rounding
      if (applicableRule.roundNearest === 50) {
        calculated = Math.round(calculated / 50) * 50;
      } else if (applicableRule.roundNearest === 100) {
        calculated = Math.round(calculated / 100) * 100;
      }

      // Psychological ending (e.g., 2499)
      if (applicableRule.psychologicalEnding === 99) {
        calculated = Math.floor(calculated / 100) * 100 + 99;
      } else if (applicableRule.psychologicalEnding === 49) {
        calculated = Math.floor(calculated / 100) * 100 + 49;
      }
    }

    const marginPKR = calculated - supplierCost;
    const marginPct = (marginPKR / calculated) * 100;

    return {
      sellingPrice: Math.round(calculated),
      marginPKR: Math.round(marginPKR),
      marginPct: Math.round(marginPct * 10) / 10
    };
  };

  // Actions
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProd, ...prev]);
    logAudit(`Added new product: ${newProd.name} (SKU: ${newProd.sku})`);
    
    // Notification
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'New Product Added',
      message: `${newProd.name} is now available in wholesale catalog.`,
      type: 'STOCK',
      isRead: false,
      timestamp: 'Just now',
      targetTab: 'products'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        if (updates.supplierCostPKR && updates.supplierCostPKR !== p.supplierCostPKR) {
          // Log price sync
          const logItem: InventorySyncLog = {
            id: 'inv-' + Date.now(),
            timestamp: new Date().toLocaleString(),
            productId: p.id,
            productName: p.name,
            changeType: 'PRICE_SYNC',
            oldValue: `PKR ${p.supplierCostPKR}`,
            newValue: `PKR ${updates.supplierCostPKR}`,
            supplierName: p.supplierName,
            triggeredAction: 'Auto-recalculated suggested reseller margin.'
          };
          setInventoryLogs(l => [logItem, ...l]);
        }
        return updated;
      }
      return p;
    }));
    logAudit(`Updated product ${id}`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (target) {
      logAudit(`Deleted product: ${target.name} (SKU: ${target.sku})`);
    }
  };

  const placeOrder = (orderData: {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerCity: string;
    customerAddress: string;
    sellingPricePKR: number;
    storeId?: string;
    storeName?: string;
    courierName?: string;
  }) => {
    const product = products.find(p => p.id === orderData.productId);
    if (!product) return { success: false, reason: 'Product not found.' };

    const salePrice = Number(orderData.sellingPricePKR);
    const supplierPayout = product.supplierCostPKR;
    const masterCommission = salePrice * 0.02; // 2% fee
    const shipping = product.estShippingCostPKR || 220;
    const resellerMargin = salePrice - supplierPayout - masterCommission;

    // Profit Guard Check
    if (resellerMargin < 100) {
      return {
        success: false,
        reason: `Profit Guard Block: Reseller margin (PKR ${resellerMargin.toFixed(0)}) is too low. Suggested retail price is PKR ${product.recSellingPricePKR}.`
      };
    }

    // COD Risk Analysis Algorithm
    let riskScore = 15;
    let riskReason = 'Standard phone and residential address detected.';
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    const existingCustomer = customers.find(c => c.phone === orderData.customerPhone);
    const isRepeat = !!existingCustomer;

    if (isRepeat) {
      if (existingCustomer.returnedOrders > 1) {
        riskScore = 82;
        riskLevel = 'HIGH';
        riskReason = `Repeat customer with ${existingCustomer.returnedOrders} previous returned orders. High COD cancellation risk.`;
      } else if (existingCustomer.deliveredOrders >= 2) {
        riskScore = 5;
        riskLevel = 'LOW';
        riskReason = `Trusted VIP customer with ${existingCustomer.deliveredOrders} 100% delivered orders.`;
      }
    } else {
      if (salePrice > 5000) {
        riskScore = 65;
        riskLevel = 'HIGH';
        riskReason = 'High value first-time COD order. Voice call verification recommended.';
      } else {
        riskScore = 25;
        riskLevel = 'LOW';
      }
    }

    const assignedCourier = orderData.courierName || 'PostEx Express COD';
    const trackingCode = `PEX-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      storeId: orderData.storeId || 'store-1',
      storeName: orderData.storeName || 'PakTrendy Shopify',
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      productSku: product.sku,
      quantity: 1,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      customerCity: orderData.customerCity,
      customerAddress: orderData.customerAddress,
      sellingPricePKR: salePrice,
      supplierPayoutPKR: supplierPayout,
      masterCommissionPKR: Math.round(masterCommission * 100) / 100,
      resellerMarginPKR: Math.round(resellerMargin * 100) / 100,
      shippingCostPKR: shipping,
      courierName: assignedCourier,
      trackingNumber: trackingCode,
      status: 'AWAITING_CONFIRMATION',
      codRisk: riskLevel,
      codRiskScore: riskScore,
      codRiskReason: riskReason,
      isCustomerVerified: false,
      isPhoneVerified: false,
      duplicateOrderDetected: false,
      repeatCustomer: isRepeat,
      internalNotes: `Auto-assigned to ${assignedCourier}.`,
      invoicePaid: false,
      profitPaid: false,
      chargesPaid: false,
      adjustmentPending: false,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: 't-' + Date.now(),
          status: 'NEW',
          title: 'Order Booked via Platform',
          description: `Customer booked for PKR ${salePrice.toLocaleString()}. Wholesale cost: PKR ${supplierPayout.toLocaleString()}.`,
          timestamp: new Date().toISOString(),
          actor: currentUser.name
        }
      ]
    };

    // Update stock
    updateProduct(product.id, { stock: Math.max(0, product.stock - 1) });

    // Update orders
    setOrders(prev => [newOrder, ...prev]);

    // Update / Create customer in CRM
    if (existingCustomer) {
      setCustomers(prev => prev.map(c => c.id === existingCustomer.id ? {
        ...c,
        totalOrders: c.totalOrders + 1,
        totalSpendingPKR: c.totalSpendingPKR + salePrice,
        lastOrderDate: new Date().toISOString()
      } : c));
    } else {
      const newCust: CustomerProfile = {
        id: 'cust-' + Date.now(),
        name: orderData.customerName,
        phone: orderData.customerPhone,
        email: orderData.customerEmail || `${orderData.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        city: orderData.customerCity,
        address: orderData.customerAddress,
        totalOrders: 1,
        deliveredOrders: 0,
        cancelledOrders: 0,
        returnedOrders: 0,
        totalSpendingPKR: salePrice,
        lastOrderDate: new Date().toISOString(),
        status: 'NEW',
        trustScore: 70
      };
      setCustomers(prev => [newCust, ...prev]);
    }

    logAudit(`Booked Order #${newOrder.orderId} for customer ${orderData.customerName} (PKR ${salePrice})`);

    // Notification
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'New COD Order Booked',
      message: `Order #${newOrder.orderId} for ${orderData.customerName} (${orderData.customerCity}) is awaiting phone confirmation.`,
      type: 'ORDER',
      isRead: false,
      timestamp: 'Just now',
      targetTab: 'orders'
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, orderId: newOrder.orderId };
  };

  const advanceOrderStatus = (orderId: string) => {
    const pipeline: OrderStatus[] = [
      'NEW',
      'AWAITING_CONFIRMATION',
      'CONFIRMED',
      'PROCESSING',
      'PACKED',
      'DISPATCHED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];

    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        const curIdx = pipeline.indexOf(o.status);
        if (curIdx >= 0 && curIdx < pipeline.length - 1) {
          const nextStatus = pipeline[curIdx + 1];
          const newTimelineEvent = {
            id: 't-' + Date.now(),
            status: nextStatus,
            title: `Status updated to ${nextStatus.replace(/_/g, ' ')}`,
            description: `Moved stage by ${currentUser.name} (${activeRole})`,
            timestamp: new Date().toISOString(),
            actor: currentUser.name
          };

          const isDelivered = nextStatus === 'DELIVERED';
          if (isDelivered) {
            // Realize master commission
            logAudit(`Order #${o.orderId} marked Delivered. Reseller profit PKR ${o.resellerMarginPKR} credited.`);
            
            // Add wallet transaction for Reseller
            const profitTxn: WalletTransaction = {
              id: 'txn-' + Date.now(),
              type: 'ORDER_PROFIT',
              amountPKR: o.resellerMarginPKR,
              description: `Profit margin for Delivered Order #${o.orderId} (${o.productName})`,
              timestamp: new Date().toISOString(),
              status: 'COMPLETED',
              balanceAfterPKR: resellerAvailableBalancePKR + o.resellerMarginPKR,
              orderId: o.orderId
            };
            setWalletTransactions(t => [profitTxn, ...t]);

            // Update customer delivered count
            setCustomers(cList => cList.map(c => c.phone === o.customerPhone ? {
              ...c,
              deliveredOrders: c.deliveredOrders + 1,
              status: c.deliveredOrders + 1 > 2 ? 'HIGH_VALUE' : 'RETURNING',
              trustScore: Math.min(100, c.trustScore + 10)
            } : c));
          }

          return {
            ...o,
            status: nextStatus,
            deliveredAt: isDelivered ? new Date().toISOString() : o.deliveredAt,
            dispatchedAt: nextStatus === 'DISPATCHED' ? new Date().toISOString() : o.dispatchedAt,
            timeline: [newTimelineEvent, ...o.timeline]
          };
        }
      }
      return o;
    }));
  };

  const setOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        const newTimelineEvent = {
          id: 't-' + Date.now(),
          status,
          title: `Status set to ${status.replace(/_/g, ' ')}`,
          description: reason || `Updated by ${currentUser.name}`,
          timestamp: new Date().toISOString(),
          actor: currentUser.name
        };

        if (status === 'RETURNED') {
          // Re-add stock
          const prod = products.find(p => p.id === o.productId);
          if (prod) {
            updateProduct(prod.id, { stock: prod.stock + 1 });
          }

          // Update customer return count
          setCustomers(cList => cList.map(c => c.phone === o.customerPhone ? {
            ...c,
            returnedOrders: c.returnedOrders + 1,
            status: 'HIGH_RETURN_RISK',
            trustScore: Math.max(10, c.trustScore - 25)
          } : c));

          // Log return request
          const newRet: ReturnRequest = {
            id: 'ret-' + Date.now(),
            orderId: o.orderId,
            productName: o.productName,
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            reason: reason || 'Customer delivery refused / unable to contact.',
            status: 'RECEIVED',
            refundAmountPKR: 0,
            replacementRequested: false,
            courierName: o.courierName,
            returnTrackingNumber: `${o.courierName.substring(0, 3).toUpperCase()}-RET-${o.orderId.substring(4)}`,
            inspectionNotes: 'Auto-logged from order status change. Stock restored to warehouse.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setReturns(r => [newRet, ...r]);
        }

        return {
          ...o,
          status,
          timeline: [newTimelineEvent, ...o.timeline]
        };
      }
      return o;
    }));
    logAudit(`Changed Order #${orderId} status to ${status}`);
  };

  const verifyOrderCod = (orderId: string, isCustomerConfirmed: boolean, note?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        const nextStatus: OrderStatus = isCustomerConfirmed ? 'CONFIRMED' : 'CANCELLED';
        const newTimelineEvent = {
          id: 't-' + Date.now(),
          status: nextStatus,
          title: isCustomerConfirmed ? 'COD Customer Verified & Confirmed' : 'COD Order Cancelled by Customer',
          description: note || (isCustomerConfirmed ? 'Customer completed WhatsApp confirmation flow.' : 'Customer declined order over call.'),
          timestamp: new Date().toISOString(),
          actor: 'COD Automation Engine'
        };

        return {
          ...o,
          status: nextStatus,
          isCustomerVerified: isCustomerConfirmed,
          isPhoneVerified: isCustomerConfirmed,
          codRisk: isCustomerConfirmed ? 'LOW' : o.codRisk,
          internalNotes: note ? `${o.internalNotes} | ${note}` : o.internalNotes,
          timeline: [newTimelineEvent, ...o.timeline]
        };
      }
      return o;
    }));
    logAudit(`COD Verification on Order #${orderId}: ${isCustomerConfirmed ? 'CONFIRMED' : 'CANCELLED'}`);
  };

  const markOrderPaid = (orderId: string, type: 'invoice' | 'profit' | 'charges') => {
    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          invoicePaid: type === 'invoice' ? true : o.invoicePaid,
          profitPaid: type === 'profit' ? true : o.profitPaid,
          chargesPaid: type === 'charges' ? true : o.chargesPaid
        };
      }
      return o;
    }));
    logAudit(`Marked ${type} as PAID for Order #${orderId}`);
  };

  const createReturnRequest = (returnData: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRet: ReturnRequest = {
      ...returnData,
      id: 'ret-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReturns(prev => [newRet, ...prev]);
    logAudit(`Logged Return Request for Order #${newRet.orderId}`);
  };

  const updateReturnStatus = (id: string, status: ReturnRequest['status'], notes?: string) => {
    setReturns(prev => prev.map(r => r.id === id ? {
      ...r,
      status,
      inspectionNotes: notes || r.inspectionNotes,
      updatedAt: new Date().toISOString()
    } : r));
    logAudit(`Updated Return Request ${id} status to ${status}`);
  };

  const requestPayout = (amountPKR: number, bankDetails: { bankName: string; accountTitle: string; accountNumber: string }) => {
    if (amountPKR <= 0 || amountPKR > resellerAvailableBalancePKR) return false;

    const newReq: PayoutRequest = {
      id: 'pay-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: activeRole,
      bankName: bankDetails.bankName,
      accountTitle: bankDetails.accountTitle,
      accountNumber: bankDetails.accountNumber,
      amountPKR,
      status: 'REQUESTED',
      requestedAt: new Date().toISOString(),
      adminNote: 'Awaiting scheduled payment clearance.'
    };

    setPayoutRequests(prev => [newReq, ...prev]);

    // Add pending transaction
    const txn: WalletTransaction = {
      id: 'txn-' + Date.now(),
      type: 'PAYOUT',
      amountPKR: -amountPKR,
      description: `Payout withdrawal request to ${bankDetails.bankName} (${bankDetails.accountTitle})`,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      balanceAfterPKR: resellerAvailableBalancePKR - amountPKR,
      referenceId: newReq.id
    };
    setWalletTransactions(prev => [txn, ...prev]);

    logAudit(`Requested Payout of PKR ${amountPKR.toLocaleString()} to ${bankDetails.bankName}`);

    return true;
  };

  const updatePayoutStatus = (payoutId: string, status: PayoutRequest['status'], adminNote?: string) => {
    setPayoutRequests(prev => prev.map(p => {
      if (p.id === payoutId) {
        return {
          ...p,
          status,
          processedAt: status === 'PAID' ? new Date().toISOString() : p.processedAt,
          adminNote: adminNote || p.adminNote,
          transactionRef: status === 'PAID' ? `RAAST-IBFT-${Math.floor(1000000 + Math.random() * 9000000)}` : p.transactionRef
        };
      }
      return p;
    }));

    if (status === 'PAID') {
      // Mark transaction completed
      setWalletTransactions(prev => prev.map(t => t.referenceId === payoutId ? { ...t, status: 'COMPLETED' } : t));
    }
    logAudit(`Updated Payout #${payoutId} status to ${status}`);
  };

  const addPricingRule = (rule: Omit<PricingRule, 'id' | 'createdAt'>) => {
    const newRule: PricingRule = {
      ...rule,
      id: 'pr-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setPricingRules(prev => [newRule, ...prev]);
    logAudit(`Added Pricing Rule: ${newRule.name}`);
  };

  const togglePricingRule = (id: string) => {
    setPricingRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    logAudit(`Toggled Pricing Rule #${id}`);
  };

  const deletePricingRule = (id: string) => {
    setPricingRules(prev => prev.filter(r => r.id !== id));
    logAudit(`Deleted Pricing Rule #${id}`);
  };

  const connectStore = (platform: ConnectedStore['platform'], storeName: string, domain: string, apiKey: string) => {
    const newStore: ConnectedStore = {
      id: 'store-' + Date.now(),
      platform,
      storeName,
      domain,
      status: 'CONNECTED',
      lastSyncTime: 'Just now',
      productCount: 12,
      orderCount: 4,
      apiKeyMasked: `${apiKey.substring(0, 6)}••••••••${apiKey.substring(apiKey.length - 4)}`,
      autoSyncInventory: true,
      autoSyncPrice: true,
      autoSyncOrders: true
    };
    setStores(prev => [newStore, ...prev]);
    logAudit(`Connected ${platform} store: ${storeName} (${domain})`);
  };

  const disconnectStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: 'DISCONNECTED' } : s));
    logAudit(`Disconnected store #${id}`);
  };

  const triggerStoreSync = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: 'SYNCING' } : s));
    setTimeout(() => {
      setStores(prev => prev.map(s => s.id === id ? {
        ...s,
        status: 'CONNECTED',
        lastSyncTime: 'Just now',
        productCount: s.productCount + 2
      } : s));
    }, 1500);
    logAudit(`Triggered manual 2-way sync for store #${id}`);
  };

  const createSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: 'tkt-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-' + Date.now(),
          sender: currentUser.name,
          senderRole: activeRole,
          message: initialMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    logAudit(`Created Support Ticket #${newTicket.id} (${newTicket.subject})`);
  };

  const replyToTicket = (ticketId: string, message: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          status: activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN' ? 'RESOLVED' : 'IN_PROGRESS',
          messages: [
            ...t.messages,
            {
              id: 'msg-' + Date.now(),
              sender: currentUser.name,
              senderRole: activeRole,
              message,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const createCoupon = (couponData: Omit<CouponPromotion, 'id' | 'usageCount' | 'revenueGeneratedPKR' | 'totalDiscountGivenPKR'>) => {
    const newCoupon: CouponPromotion = {
      ...couponData,
      id: 'cpn-' + Date.now(),
      usageCount: 0,
      revenueGeneratedPKR: 0,
      totalDiscountGivenPKR: 0
    };
    setCoupons(prev => [newCoupon, ...prev]);
    logAudit(`Created Coupon Code: ${newCoupon.code}`);
  };

  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const registerUser = (userData: Omit<UserProfile, 'id' | 'registeredAt' | 'walletBalancePKR' | 'totalEarnedPKR'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: 'usr-' + Date.now(),
      registeredAt: new Date().toISOString(),
      walletBalancePKR: 0,
      totalEarnedPKR: 0
    };
    
    setUsersList(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveRole(newUser.role);

    // If registered as supplier, ensure they also show in suppliers catalog
    if (newUser.role === 'SUPPLIER') {
      const newSupplierEntry: Supplier = {
        id: 'sup-' + Date.now(),
        name: newUser.companyName || newUser.name,
        companyName: newUser.companyName,
        logo: newUser.logo || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
        categories: newUser.categories && newUser.categories.length > 0 ? newUser.categories : ['General Merchandise', 'Health & Beauty'],
        productCount: 0,
        city: newUser.city || 'Karachi',
        address: newUser.fullAddress,
        phone: newUser.phone,
        email: newUser.email,
        isVerified: true,
        status: 'ACTIVE'
      };
      setSuppliers(prev => [newSupplierEntry, ...prev]);
    }

    logAudit(`New Partner Registered: ${newUser.name} (${newUser.companyName}) [${newUser.role}]`);
    return newUser;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      setUsersList(uList => uList.map(u => u.id === updated.id ? updated : u));
      
      // Also update matching supplier if company/logo updated
      if (updated.role === 'SUPPLIER' && (updates.companyName || updates.logo)) {
        setSuppliers(sList => sList.map(s => {
          if (s.email === updated.email || s.name === prev.companyName || s.companyName === prev.companyName) {
            return {
              ...s,
              name: updates.companyName || s.name,
              companyName: updates.companyName || s.companyName,
              logo: updates.logo || s.logo,
              phone: updates.phone || s.phone,
              city: updates.city || s.city,
              address: updates.fullAddress || s.address
            };
          }
          return s;
        }));
      }

      logAudit(`Profile Updated for ${updated.name} (${updated.companyName})`);
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeRole,
        setActiveRole: handleSetRole,
        currentUser,
        setCurrentUser,
        usersList,

        products,
        orders,
        suppliers,
        couriers,
        pricingRules,
        stores,
        returns,
        customers,
        payoutRequests,
        walletTransactions,
        supportTickets,
        notifications,
        coupons,
        referralStat,
        auditLogs,
        inventoryLogs,

        masterWalletBalancePKR,
        resellerAvailableBalancePKR,
        resellerPendingBalancePKR,
        resellerProcessingBalancePKR,

        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        advanceOrderStatus,
        setOrderStatus,
        verifyOrderCod,
        markOrderPaid,
        createReturnRequest,
        updateReturnStatus,
        requestPayout,
        updatePayoutStatus,
        addPricingRule,
        togglePricingRule,
        deletePricingRule,
        connectStore,
        disconnectStore,
        triggerStoreSync,
        createSupportTicket,
        replyToTicket,
        markNotificationRead,
        markAllNotificationsRead,
        createCoupon,
        toggleCoupon,
        registerUser,
        updateUserProfile,
        logAudit,

        isProfileSettingsOpen,
        setIsProfileSettingsOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        isOrderModalOpen,
        setIsOrderModalOpen,
        isProfitCalcModalOpen,
        setIsProfitCalcModalOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        isProductDetailModalOpen,
        setIsProductDetailModalOpen,
        isCodModalOpen,
        setIsCodModalOpen,
        isPayoutModalOpen,
        setIsPayoutModalOpen,
        isTrustPolicyModalOpen,
        setIsTrustPolicyModalOpen,
        isApiExplorerOpen,
        setIsApiExplorerOpen,

        selectedProductForModal,
        setSelectedProductForModal,
        selectedOrderForModal,
        setSelectedOrderForModal,

        // Cart Management
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartSellingPrice,
        clearCart,
        cartTotalCount,
        cartTotalSupplierCostPKR,
        cartTotalSellingPricePKR,
        cartTotalProfitPKR,
        cartToast,
        setCartToast,

        searchQuery,
        setSearchQuery,
        calculateSmartSellingPrice,
        productsService,
        ordersService,
        apiService,
        productsApi,
        ordersApi
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
