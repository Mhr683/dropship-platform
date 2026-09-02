import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  RotateCcw,
  Wallet,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Plus,
  Search,
  Building,
  MapPin,
  Flame,
  Sliders,
  Store,
  Settings,
  User,
  ExternalLink,
  ShoppingBag,
  Calculator,
  Tag,
  Boxes,
  Zap,
  Star,
  Check,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';

export const DashboardView: React.FC = () => {
  const {
    orders,
    products,
    payoutRequests,
    resellerAvailableBalancePKR,
    currentUser,
    setIsProfileSettingsOpen,
    setActiveTab,
    setIsOrderModalOpen,
    setIsAddProductModalOpen,
    setIsProfitCalcModalOpen,
    setIsProductDetailModalOpen,
    setSelectedProductForModal,
    setSelectedOrderForModal,
    setIsCodModalOpen,
    advanceOrderStatus,
    addToCart,
    cart,
    setIsCartOpen
  } = useApp();

  // Filters for Products on Home Screen
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterBadge, setFilterBadge] = useState<'ALL' | 'TRENDING' | 'BEST_SELLER' | 'FAST_SHIPPING' | 'HIGH_MARGIN'>('ALL');
  const [sourcingSource, setSourcingSource] = useState<'ALL' | 'SUPPLIER' | 'RESELLER'>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'MARGIN' | 'PRICE_LOW' | 'PRICE_HIGH'>('POPULAR');

  // Compute Core Metrics
  const nonReturnedOrders = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'RETURNED');
  const totalSalesPKR = nonReturnedOrders.reduce((sum, o) => sum + o.sellingPricePKR, 0);
  const totalResellerProfitPKR = nonReturnedOrders.reduce((sum, o) => sum + o.resellerMarginPKR, 0);
  const pendingConfirmationOrders = orders.filter(o => o.status === 'AWAITING_CONFIRMATION');
  const inTransitOrders = orders.filter(o => o.status === 'IN_TRANSIT' || o.status === 'DISPATCHED');
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const returnedOrders = orders.filter(o => o.status === 'RETURNED');
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold || p.status === 'LOW_STOCK');

  // Categories list
  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter and Sort Products for Home Screen
  const filteredProducts = products.filter((p) => {
    // Sourcing source filter
    if (sourcingSource !== 'ALL' && (p.ownerRole || 'SUPPLIER') !== sourcingSource) return false;

    // Category filter
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

    // Badge Highlights
    if (filterBadge === 'TRENDING' && !p.isTrending) return false;
    if (filterBadge === 'BEST_SELLER' && !p.isBestSeller) return false;
    if (filterBadge === 'FAST_SHIPPING' && !p.fastShipping) return false;
    if (filterBadge === 'HIGH_MARGIN') {
      const marginPct = ((p.recSellingPricePKR - p.supplierCostPKR) / p.recSellingPricePKR) * 100;
      if (marginPct < 35) return false;
    }

    // Search query
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchSupplier = p.supplierName.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchSupplier && !matchCategory) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'MARGIN') {
      const marginA = a.recSellingPricePKR - a.supplierCostPKR;
      const marginB = b.recSellingPricePKR - b.supplierCostPKR;
      return marginB - marginA;
    }
    if (sortBy === 'PRICE_LOW') {
      return a.supplierCostPKR - b.supplierCostPKR;
    }
    if (sortBy === 'PRICE_HIGH') {
      return b.supplierCostPKR - a.supplierCostPKR;
    }
    // Default popular: salesPotentialScore
    return (b.salesPotentialScore || 80) - (a.salesPotentialScore || 80);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Partner Store Profile Banner (Dropshipper / Supplier Brand Logo & CNIC) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Store / Business Logo */}
            <div className="relative group shrink-0">
              <img
                src={currentUser.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80'}
                alt={currentUser.companyName || currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-lg bg-slate-950"
              />
              <div
                onClick={() => setIsProfileSettingsOpen(true)}
                className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center cursor-pointer transition"
                title="Change Store Logo"
              >
                <Settings className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-1 shadow">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile & Business Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {currentUser.companyName || currentUser.name}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  currentUser.role === 'SUPPLIER'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : currentUser.role === 'RESELLER'
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {currentUser.role === 'SUPPLIER' ? 'Wholesale Manufacturer' : currentUser.role === 'RESELLER' ? 'Verified Dropshipper' : 'Super Admin'}
                </span>
                {currentUser.isVerified && (
                  <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> CNIC Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> Legal Name: {currentUser.name}
                </span>
                {currentUser.cnicNumber && (
                  <span className="text-slate-400 font-mono text-[11px]">
                    CNIC: {currentUser.cnicNumber}
                  </span>
                )}
                {currentUser.city && (
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {currentUser.city}, {currentUser.province || 'Pakistan'}
                  </span>
                )}
              </p>

              {currentUser.storeUrl && (
                <a
                  href={currentUser.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 font-medium pt-0.5"
                >
                  <ExternalLink className="w-3 h-3" /> {currentUser.storeUrl}
                </a>
              )}
            </div>
          </div>

          {/* Quick Profile Settings Action */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <button
              onClick={() => setIsProfileSettingsOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-2 shadow-sm hover:border-emerald-500/50"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Store & Profile Settings (سیٹنگز)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Core Operational Metrics (4 High-Value KPI Summary Cards) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Today's Revenue */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition shadow-sm group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            PKR {totalSalesPKR.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1.5">
            <ArrowUpRight className="w-3 h-3" /> {nonReturnedOrders.length} customer bookings
          </div>
        </div>

        {/* 2. Net Reseller Profit */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 transition shadow-sm group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider">Net Profit (منافع)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">
            PKR {totalResellerProfitPKR.toLocaleString()}
          </p>
          <div className="text-[10px] text-emerald-300/80 font-bold mt-1.5">
            Avg Margin: {Math.round((totalResellerProfitPKR / (totalSalesPKR || 1)) * 100)}% per parcel
          </div>
        </div>

        {/* 3. Pending COD Confirmation */}
        <div
          onClick={() => setActiveTab('orders')}
          className="bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-4 transition shadow-sm cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Pending COD</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {pendingConfirmationOrders.length} Orders
          </p>
          <div className="text-[10px] text-amber-400 font-bold mt-1.5 flex items-center gap-1">
            WhatsApp Verify Needed <ChevronRight className="w-3 h-3 inline" />
          </div>
        </div>

        {/* 4. Available Wallet Balance */}
        <div
          onClick={() => setActiveTab('wallet')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition shadow-sm cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            PKR {resellerAvailableBalancePKR.toLocaleString()}
          </p>
          <div className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
            1Link Ready to Withdraw <ChevronRight className="w-3 h-3 inline" />
          </div>
        </div>
      </section>

      {/* 3. High-Priority Urgent Action Alert Hub (If pending COD or low stock exists) */}
      {(pendingConfirmationOrders.length > 0 || lowStockProducts.length > 0) && (
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-white text-sm">Urgent Seller Action Center</h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              {pendingConfirmationOrders.length + lowStockProducts.length} pending tasks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {pendingConfirmationOrders.length > 0 && (
              <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="bg-amber-500/20 text-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                    COD Confirmation ({pendingConfirmationOrders.length})
                  </span>
                  <p className="text-xs text-slate-200 font-semibold truncate mt-1">
                    {pendingConfirmationOrders[0].customerName} ({pendingConfirmationOrders[0].customerCity}) • PKR {pendingConfirmationOrders[0].sellingPricePKR.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrderForModal(pendingConfirmationOrders[0]);
                    setIsCodModalOpen(true);
                  }}
                  className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" /> Verify
                </button>
              </div>
            )}

            {lowStockProducts.length > 0 && (
              <div className="bg-slate-950/70 border border-red-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="bg-red-500/20 text-red-300 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                    Low Stock Alert
                  </span>
                  <p className="text-xs text-slate-200 font-semibold truncate mt-1">
                    {lowStockProducts[0].name} ({lowStockProducts[0].stock} units left)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="shrink-0 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Boxes className="w-4 h-4 text-emerald-400" /> Restock
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. MAIN HOME SCREEN HIGHLIGHT: ALL PRODUCTS & WHOLESALE CATALOG (تمام مصنوعات) */}
      <section className="space-y-6">
        {/* Section Header & Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <Package className="w-3.5 h-3.5" /> Verified Wholesale Inventory
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>All Wholesale Products (تمام مصنوعات)</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  {filteredProducts.length} Items Available
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Wholesale base prices, guaranteed stock in Pakistani fulfillment warehouses, 30%+ profit margins, and 1-click Add to Cart.
              </p>
            </div>

            {/* Quick Actions Header Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" /> Add Wholesale Item
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" /> View Cart ({cart.length})
              </button>
            </div>
          </div>

          {/* Search & Sourcing Source Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name, SKU, or supplier..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sourcing Tabs & Sort By */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              {/* Sourcing Type */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                <button
                  onClick={() => setSourcingSource('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    sourcingSource === 'ALL'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  onClick={() => setSourcingSource('SUPPLIER')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    sourcingSource === 'SUPPLIER'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Factory Direct
                </button>
                <button
                  onClick={() => setSourcingSource('RESELLER')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    sourcingSource === 'RESELLER'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Reseller Offers
                </button>
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="POPULAR">Sort: Most Popular</option>
                <option value="MARGIN">Sort: Highest Profit Margin</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick Highlight Badges Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" /> Filters:
            </span>
            {[
              { id: 'ALL', label: 'All Items', icon: Package },
              { id: 'TRENDING', label: 'Trending Hot 🔥', icon: Flame },
              { id: 'BEST_SELLER', label: 'Top Best Sellers 🏆', icon: Star },
              { id: 'FAST_SHIPPING', label: 'Fast Shipping ⚡ (2-3 Days)', icon: Zap },
              { id: 'HIGH_MARGIN', label: 'High Profit (>35%) 💰', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterBadge(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1.5 ${
                  filterBadge === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60 text-xs overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition whitespace-nowrap ${
                  selectedCategory === c
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950/40'
                }`}
              >
                {c === 'ALL' ? '🏷️ All Categories' : c}
              </button>
            ))}
          </div>
        </div>

        {/* ALL PRODUCTS GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const margin = product.recSellingPricePKR - product.supplierCostPKR;
              const marginPct = Math.round((margin / product.recSellingPricePKR) * 100);
              const isInCart = cart.some(item => item.product.id === product.id);
              const cartItem = cart.find(item => item.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:shadow-2xl hover:shadow-emerald-950/20"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        {product.isTrending && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Trending
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                            <Star className="w-3 h-3" /> Best Seller
                          </span>
                        )}
                        {product.fastShipping && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> 2-Day Dispatch
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-xs font-extrabold ${
                          product.stock <= product.lowStockThreshold ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </div>

                    {/* Image & Product Header */}
                    <div className="flex gap-3.5 mb-3">
                      <div className="relative shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-800 bg-slate-950 group-hover:scale-105 transition transform duration-300"
                        />
                        <span className="absolute -top-1.5 -left-1.5 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                          +{marginPct}%
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4
                          onClick={() => {
                            setSelectedProductForModal(product);
                            setIsProductDetailModalOpen(true);
                          }}
                          className="font-extrabold text-sm text-white hover:text-emerald-400 cursor-pointer line-clamp-2 transition leading-snug"
                        >
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <span className="font-mono text-slate-300">{product.sku}</span>
                          <span>•</span>
                          <span className="text-slate-400">{product.category}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                          <Building className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{product.supplierName}</span>
                        </p>
                      </div>
                    </div>

                    {/* Financial Economics Box */}
                    <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Wholesale Rate (سپلائر قیمت):</span>
                        <span className="font-bold text-white">PKR {product.supplierCostPKR.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Suggested Selling Price:</span>
                        <span className="font-bold text-slate-300">PKR {product.recSellingPricePKR.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800/80 pt-1.5 font-bold">
                        <span className="text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Your Profit (آپ کا منافع):
                        </span>
                        <span className="text-emerald-400 font-extrabold text-sm">
                          +PKR {margin.toLocaleString()} ({marginPct}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Add to Cart & Book Order */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    {/* ADD TO CART BUTTON */}
                    <button
                      onClick={() => addToCart(product, 1)}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md ${
                        isInCart
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600 hover:text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {isInCart ? `In Cart (${cartItem?.quantity}) • Add More` : 'Add to Cart (کارٹ میں شامل کریں)'}
                      </span>
                    </button>

                    {/* Quick Booking & Details */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProductForModal(product);
                          setIsOrderModalOpen(true);
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Direct Book Order</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProductForModal(product);
                          setIsProfitCalcModalOpen(true);
                        }}
                        className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl border border-slate-700 transition"
                        title="Profit Calculator"
                      >
                        <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProductForModal(product);
                          setIsProductDetailModalOpen(true);
                        }}
                        className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl border border-slate-700 transition"
                        title="Product Specifications & Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs space-y-3">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-sm">No products matched your search or filter.</p>
            <p className="text-slate-400">Try changing the category or clear your search keyword.</p>
            <button
              onClick={() => {
                setProductSearch('');
                setSelectedCategory('ALL');
                setFilterBadge('ALL');
                setSourcingSource('ALL');
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. Navigation Hint for Deep Management Tools (in the Three Lines Menu / Sidebar) */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-sm text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white text-xs">Looking for Daraz Fee Calculator, Couriers, or Financial Reports?</p>
            <p className="text-[11px] text-slate-400">
              تمام ایڈوانس فیچرز (Daraz Calculator 2.25%, Courier Dispatch, Multi-Store Sync, Pricing Rules, Return Pipeline) بائیں جانب تھری لائنز مینیو (Sidebar) میں دستیاب ہیں۔
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('calculator')}
          className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5 shrink-0"
        >
          <span>Daraz Calculator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
