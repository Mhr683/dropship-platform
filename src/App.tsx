import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { SupplierPortal } from './components/SupplierPortal';
import { ResellerPortal } from './components/ResellerPortal';
import { OrdersManager } from './components/OrdersManager';
import { ProfitGuardModal } from './components/ProfitGuardModal';
import { StoreSyncModal } from './components/StoreSyncModal';
import { CustomerCheckoutView } from './components/CustomerCheckoutView';
import { WalletModal } from './components/WalletModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { HelplinesModal } from './components/HelplinesModal';
import { DarazCalculator } from './components/DarazCalculator';
import {
  initialProfitGuardConfig,
  initialUsers,
  initialProducts,
  initialOrders,
  initialStoreIntegrations,
  initialTransactions,
  initialBankTransferDetails,
  initialAdminSecurityConfig,
  initialAdminAuditLogs,
  initialPlatformHelplinesConfig,
} from './data/initialData';
import {
  User,
  Product,
  Order,
  ProfitGuardConfig,
  StoreIntegration,
  WalletTransaction,
  ChatMessage,
  BankTransferDetails,
  AdminSecurityConfig,
  AdminAuditLog,
  PlatformHelplinesConfig,
} from './types';
import { evaluateOrderFinancials } from './utils/profitGuard';

export default function App() {
  // Global Application State
  const [profitGuardConfig, setProfitGuardConfig] = useState<ProfitGuardConfig>(initialProfitGuardConfig);
  const [bankTransferDetails, setBankTransferDetails] = useState<BankTransferDetails>(() => {
    const saved = localStorage.getItem('ym_bank_transfer_details');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialBankTransferDetails;
  });

  const [helplinesConfig, setHelplinesConfig] = useState<PlatformHelplinesConfig>(() => {
    const saved = localStorage.getItem('ym_helplines_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialPlatformHelplinesConfig;
  });

  // Security & Admin Session Management
  const [securityConfig, setSecurityConfig] = useState<AdminSecurityConfig>(() => {
    const saved = localStorage.getItem('ym_admin_security_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialAdminSecurityConfig;
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('ym_admin_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialAdminAuditLogs;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ym_admin_auth') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  // Users & Sourcing State - Default to Reseller (Ali Raza / Zainab) so Admin is isolated
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return isAdminAuthenticated ? initialUsers[0] : initialUsers[2];
  });
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [stores, setStores] = useState<StoreIntegration[]>(initialStoreIntegrations);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);

  // Navigation State - Default to wholesale sourcing catalog
  const [activeTab, setActiveTab] = useState<string>(() => {
    return isAdminAuthenticated ? 'admin-hq' : 'catalog';
  });

  // Modals
  const [isProfitGuardModalOpen, setIsProfitGuardModalOpen] = useState(false);
  const [isStoreSyncModalOpen, setIsStoreSyncModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isHelplinesModalOpen, setIsHelplinesModalOpen] = useState(false);

  // Global Keyboard shortcut listener for Software Creator Admin access (Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminAuthModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audit Logger Helper
  const handleLogAudit = (
    action: string,
    details: string,
    status: 'SUCCESS' | 'WARNING' | 'FAILED'
  ) => {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ip: '110.39.42.18 (Lahore PK)',
      status,
      adminUser: currentUser.role === 'ADMIN' ? currentUser.name : 'Master Administrator',
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      localStorage.setItem('ym_admin_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Admin Authentication Success
  const handleAuthenticateAdminSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('ym_admin_auth', 'true');
    const adminUser = users.find((u) => u.role === 'ADMIN') || users[0];
    setCurrentUser(adminUser);
    setActiveTab('admin-hq');
    setIsAdminAuthModalOpen(false);
  };

  // Admin Lock / Logout
  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('ym_admin_auth');
    const resellerUser = users.find((u) => u.role === 'RESELLER') || users[2];
    setCurrentUser(resellerUser);
    setActiveTab('catalog');
    handleLogAudit('ADMIN_CONSOLE_LOCKED', 'Master Admin session closed and locked', 'SUCCESS');
  };

  // Update Security Config
  const handleUpdateSecurityConfig = (newSec: AdminSecurityConfig) => {
    setSecurityConfig(newSec);
    localStorage.setItem('ym_admin_security_config', JSON.stringify(newSec));
  };

  // Update Helplines Config (Buyers, Resellers, Manufacturers)
  const handleUpdateHelplinesConfig = (newHelplines: PlatformHelplinesConfig) => {
    setHelplinesConfig(newHelplines);
    localStorage.setItem('ym_helplines_config', JSON.stringify(newHelplines));
  };

  // Global Handlers
  const handleSelectUser = (user: User) => {
    if (user.role === 'ADMIN' && !isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
      return;
    }

    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setActiveTab('admin-hq');
    } else if (user.role === 'SUPPLIER') {
      setActiveTab('supplier-hub');
    } else if (user.role === 'RESELLER') {
      setActiveTab('catalog');
    }
  };

  // Handle Tab Selection with Protected Route Guard
  const handleSelectTab = (tab: string) => {
    if (tab === 'admin-hq' && !isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Direct Wallet Balance Adjustment by Admin
  const handleAdjustUserBalance = (userId: string, amountChange: number, reason: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, walletBalancePKR: Math.max(0, u.walletBalancePKR + amountChange) }
          : u
      )
    );

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        userId,
        type: amountChange >= 0 ? 'CREDIT' : 'DEBIT',
        amountPKR: Math.abs(amountChange),
        description: `Admin Adjustment: ${reason}`,
        timestamp: now,
        status: 'COMPLETED',
      },
      ...prev,
    ]);
  };

  // Add Product from Supplier (Daraz-style multi-image, video, active status)
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    handleLogAudit(
      'PRODUCT_ADDED',
      `New product "${newProduct.name}" (SKU: ${newProduct.sku}) added to catalog. Wholesale: PKR ${newProduct.supplierCostPKR}`,
      'SUCCESS'
    );
  };

  // Full Product Update by Admin or Supplier
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    handleLogAudit(
      'PRODUCT_EDITED',
      `Product "${updatedProduct.name}" (SKU: ${updatedProduct.sku}) updated. Wholesale: PKR ${updatedProduct.supplierCostPKR}, Stock: ${updatedProduct.stock}, Active: ${updatedProduct.isActive ? 'Yes' : 'No'}`,
      'SUCCESS'
    );
  };

  // Delete Product from Catalog
  const handleDeleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    handleLogAudit(
      'PRODUCT_DELETED',
      `Product "${prod?.name || productId}" removed from catalog.`,
      'WARNING'
    );
  };

  // Full Order Update by Admin
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    handleLogAudit(
      'ORDER_EDITED',
      `Order #${updatedOrder.orderNumber} edited by Admin. Status: ${updatedOrder.status}, Customer: ${updatedOrder.customerName}, Tracking: ${updatedOrder.trackingNumber || 'N/A'}`,
      'SUCCESS'
    );
  };

  // Full User Account Update by Admin
  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    handleLogAudit(
      'USER_ACCOUNT_EDITED',
      `User ${updatedUser.name} (${updatedUser.email}, Role: ${updatedUser.role}) profile updated.`,
      'SUCCESS'
    );
  };

  // Toggle Product Active / Inactive Status
  const handleToggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Update Stock
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  // Update Supplier Cost
  const handleUpdateCost = (productId: string, newCost: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, supplierCostPKR: newCost } : p))
    );
  };

  // Place Reseller Customer Order with Exact Deductions (30 Rs processing + delivery + 2% platform)
  const handlePlaceOrder = ({
    product,
    sellingPrice,
    customerName,
    customerPhone,
    customerCity,
    customerAddress,
  }: {
    product: Product;
    sellingPrice: number;
    customerName: string;
    customerPhone?: string;
    customerCity?: string;
    customerAddress?: string;
  }) => {
    const shippingCost = profitGuardConfig.defaultShippingCostPKR;
    const processingFee = profitGuardConfig.processingFeePKR ?? 30;
    const platformFeePct = profitGuardConfig.platformFeePct ?? 2.0;

    // Evaluate with Profit Guard
    const evaluation = evaluateOrderFinancials(
      {
        sellingPricePKR: sellingPrice,
        supplierCostPKR: product.supplierCostPKR,
        shippingCostPKR: shippingCost,
        processingFeePKR: processingFee,
        platformFeePct: platformFeePct,
      },
      profitGuardConfig
    );

    const platformFee = evaluation.financials.platformFeePKR;
    const resellerCommission = evaluation.financials.resellerNetProfitPKR;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `YM-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: customerName || 'Direct Reseller Customer',
      customerPhone: customerPhone || '+92 301 5566778',
      customerCity: customerCity || 'Lahore',
      customerAddress: customerAddress || 'Gulberg III, Main Boulevard, Lahore, Pakistan',
      items: [
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          image: product.image,
          qty: 1,
          supplierCostPKR: product.supplierCostPKR,
          sellingPricePKR: sellingPrice,
        },
      ],
      sellingPricePKR: sellingPrice,
      supplierCostPKR: product.supplierCostPKR,
      shippingCostPKR: shippingCost,
      processingFeePKR: processingFee,
      gatewayFeePKR: 0,
      resellerCommissionPKR: resellerCommission,
      platformFeePKR: platformFee,
      netProfitPKR: resellerCommission,
      profitMarginPct: evaluation.financials.profitMarginPct,
      status: 'PENDING_VERIFICATION',
      codRisk: 'LOW',
      codOtpVerified: false,
      profitGuardApproved: evaluation.approved,
      profitGuardReason: evaluation.reason,
      createdAt: new Date().toISOString(),
      resellerId: currentUser.role === 'RESELLER' ? currentUser.id : 'usr-2',
      resellerName: currentUser.role === 'RESELLER' ? currentUser.name : 'Pro Reseller',
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      syncedStore: 'Direct Reseller Order',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'PLATFORM',
          senderName: 'Profit Guard™ Engine',
          text: `Order registered with selling price PKR ${sellingPrice.toLocaleString()}. Supplier Cost: PKR ${product.supplierCostPKR.toLocaleString()}, Processing: PKR ${processingFee}, Courier: PKR ${shippingCost}, Platform Take (2%): PKR ${platformFee}. Reseller Payout: PKR ${resellerCommission.toLocaleString()}. Status: ${
            evaluation.approved ? 'APPROVED & READY FOR VERIFICATION' : 'BLOCKED DUE TO DEFICIT'
          }`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Debit Flat 30 Rs Processing Fee & Escrow from Reseller Wallet or track
    if (evaluation.approved) {
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          userId: currentUser.id,
          type: 'DEBIT',
          amountPKR: processingFee,
          description: `Flat Processing Fee for Order ${newOrder.orderNumber}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'COMPLETED',
          refOrderId: newOrder.id,
        },
        ...prev,
      ]);
    }
  };

  // Order Lifecycle Handlers
  const handleVerifyCod = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'COD_CONFIRMED',
              codOtpVerified: true,
              messages: [
                ...o.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderRole: 'PLATFORM',
                  senderName: 'System Verification',
                  text: 'Customer OTP verified successfully. Order confirmed for warehouse dispatch.',
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : o
      )
    );
  };

  const handleDispatchOrder = (orderId: string, courierName: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'DISPATCHED',
              courierName,
              trackingNumber,
              messages: [
                ...o.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderRole: 'SUPPLIER',
                  senderName: 'Warehouse Fulfilled',
                  text: `Order packed & dispatched via ${courierName}. Tracking #${trackingNumber}.`,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : o
      )
    );
  };

  const handleDeliverOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'DELIVERED',
              messages: [
                ...o.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderRole: 'PLATFORM',
                  senderName: 'Courier Payout Clearance',
                  text: `COD collected successfully. Supplier escrow (PKR ${o.supplierCostPKR.toLocaleString()}) and Reseller profit (PKR ${o.resellerCommissionPKR.toLocaleString()}) credited to respective wallets.`,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : o
      )
    );

    // Credit Reseller Wallet with exact net commission
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetOrder.resellerId) {
          return {
            ...u,
            walletBalancePKR: u.walletBalancePKR + targetOrder.resellerCommissionPKR,
          };
        }
        if (u.id === targetOrder.supplierId) {
          return {
            ...u,
            walletBalancePKR: u.walletBalancePKR + targetOrder.supplierCostPKR,
          };
        }
        return u;
      })
    );

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}-res`,
        userId: targetOrder.resellerId,
        type: 'CREDIT',
        amountPKR: targetOrder.resellerCommissionPKR,
        description: `Net Profit Commission for Order ${targetOrder.orderNumber}`,
        timestamp: now,
        status: 'COMPLETED',
        refOrderId: targetOrder.id,
      },
      {
        id: `tx-${Date.now()}-sup`,
        userId: targetOrder.supplierId,
        type: 'CREDIT',
        amountPKR: targetOrder.supplierCostPKR,
        description: `Supplier Wholesale Escrow Release for Order ${targetOrder.orderNumber}`,
        timestamp: now,
        status: 'COMPLETED',
        refOrderId: targetOrder.id,
      },
      ...prev,
    ]);
  };

  const handleCancelOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'CANCELLED',
              messages: [
                ...o.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderRole: currentUser.role as any,
                  senderName: currentUser.name,
                  text: `Order Cancelled: ${reason}`,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : o
      )
    );
  };

  const handleSendMessage = (orderId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: currentUser.role,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toISOString(),
    };

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, messages: [...o.messages, newMessage] } : o))
    );
  };

  const handlePushToStore = (product: Product, storePlatform: string, markupPrice: number) => {
    alert(
      `Product "${product.name}" successfully pushed to your ${storePlatform} store at PKR ${markupPrice.toLocaleString()}!`
    );
  };

  const handleAddFunds = (amount: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, walletBalancePKR: u.walletBalancePKR + amount } : u
      )
    );
    setCurrentUser((prev) => ({ ...prev, walletBalancePKR: prev.walletBalancePKR + amount }));
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        type: 'CREDIT',
        amountPKR: amount,
        description: 'Instant EasyPaisa / JazzCash Top-up',
        timestamp: now,
        status: 'COMPLETED',
      },
      ...prev,
    ]);
  };

  const handleWithdrawFunds = (amount: number, bankDetails: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, walletBalancePKR: u.walletBalancePKR - amount } : u
      )
    );
    setCurrentUser((prev) => ({ ...prev, walletBalancePKR: prev.walletBalancePKR - amount }));
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        type: 'DEBIT',
        amountPKR: amount,
        description: `Bank Withdrawal Payout to ${bankDetails}`,
        timestamp: now,
        status: 'COMPLETED',
      },
      ...prev,
    ]);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={handleSelectUser}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        profitGuardConfig={profitGuardConfig}
        onOpenProfitGuardModal={() => setIsProfitGuardModalOpen(true)}
        onOpenStoreSyncModal={() => setIsStoreSyncModalOpen(true)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenHelplinesModal={() => setIsHelplinesModalOpen(true)}
        stores={stores}
        pendingOrdersCount={pendingOrdersCount}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
        onLockAdmin={handleLockAdmin}
      />

      {/* Main App Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'catalog' && (
          <ResellerPortal
            currentUser={currentUser}
            products={products}
            profitGuardConfig={profitGuardConfig}
            bankTransferDetails={bankTransferDetails}
            stores={stores}
            onPlaceSampleOrder={(p, price, customerDetails) =>
              handlePlaceOrder({
                product: p,
                sellingPrice: price,
                customerName: customerDetails.customerName,
                customerPhone: customerDetails.customerPhone,
                customerCity: customerDetails.customerCity,
                customerAddress: customerDetails.customerAddress,
              })
            }
            onPushToStore={handlePushToStore}
            onOpenStoreSyncModal={() => setIsStoreSyncModalOpen(true)}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersManager
            currentUser={currentUser}
            orders={orders}
            onVerifyCod={handleVerifyCod}
            onDispatchOrder={handleDispatchOrder}
            onDeliverOrder={handleDeliverOrder}
            onCancelOrder={handleCancelOrder}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'admin-hq' && (
          <AdminDashboard
            profitGuardConfig={profitGuardConfig}
            onUpdateConfig={setProfitGuardConfig}
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
            products={products}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            users={users}
            onUpdateUser={handleUpdateUser}
            transactions={transactions}
            onOpenProfitGuardModal={() => setIsProfitGuardModalOpen(true)}
            bankTransferDetails={bankTransferDetails}
            onUpdateBankDetails={(newDetails) => {
              setBankTransferDetails(newDetails);
              localStorage.setItem('ym_bank_transfer_details', JSON.stringify(newDetails));
            }}
            securityConfig={securityConfig}
            onUpdateSecurityConfig={handleUpdateSecurityConfig}
            auditLogs={auditLogs}
            onLogAudit={handleLogAudit}
            onLockAdmin={handleLockAdmin}
            onAdjustUserBalance={handleAdjustUserBalance}
            helplinesConfig={helplinesConfig}
            onUpdateHelplinesConfig={handleUpdateHelplinesConfig}
          />
        )}

        {activeTab === 'supplier-hub' && (
          <SupplierPortal
            currentUser={currentUser}
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateStock={handleUpdateStock}
            onUpdateCost={handleUpdateCost}
            onToggleActive={handleToggleProductActive}
          />
        )}

        {activeTab === 'checkout-demo' && (
          <CustomerCheckoutView
            products={products}
            onPlaceOrder={(orderData) =>
              handlePlaceOrder({
                product: orderData.product,
                sellingPrice: orderData.sellingPrice,
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
                customerCity: orderData.customerCity,
                customerAddress: orderData.customerAddress,
              })
            }
          />
        )}
      </main>

      {/* Admin Security Authentication Gateway Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        securityConfig={securityConfig}
        onAuthenticateSuccess={handleAuthenticateAdminSuccess}
        onLogAudit={handleLogAudit}
      />

      {/* Global Modals */}
      <ProfitGuardModal
        isOpen={isProfitGuardModalOpen}
        onClose={() => setIsProfitGuardModalOpen(false)}
        config={profitGuardConfig}
      />

      <StoreSyncModal
        isOpen={isStoreSyncModalOpen}
        onClose={() => setIsStoreSyncModalOpen(false)}
        stores={stores}
        onToggleStoreConnection={(id) =>
          setStores((prev) =>
            prev.map((s) => (s.id === id ? { ...s, connected: !s.connected } : s))
          )
        }
        onSyncNow={(id) =>
          setStores((prev) =>
            prev.map((s) => (s.id === id ? { ...s, lastSync: 'Just now' } : s))
          )
        }
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        currentUser={currentUser}
        transactions={transactions}
        onAddFunds={handleAddFunds}
        onWithdrawFunds={handleWithdrawFunds}
      />

      {/* Helplines (Buyers, Resellers, Manufacturers) Support Modal */}
      <HelplinesModal
        isOpen={isHelplinesModalOpen}
        onClose={() => setIsHelplinesModalOpen(false)}
        helplinesConfig={helplinesConfig}
        onUpdateHelplinesConfig={handleUpdateHelplinesConfig}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
        onLogAudit={handleLogAudit}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-xs text-slate-500 text-center">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>YourMart Global • Wholesale B2B, Reseller Sourcing & COD Payout Engine</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHelplinesModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline flex items-center gap-1 transition"
            >
              <span>📞 Helplines & Support Desks</span>
            </button>
            <span className="font-mono text-[11px] text-slate-400">
              Automated Profit Guard™ • Rs. 30 Processing • 2% Platform Clearance
            </span>
            {/* Discreet Creator Access Link */}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  handleSelectTab('admin-hq');
                } else {
                  setIsAdminAuthModalOpen(true);
                }
              }}
              className="text-slate-600 hover:text-slate-400 transition ml-1"
              title="Software Creator Access (Alt+A)"
            >
              🔒
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
