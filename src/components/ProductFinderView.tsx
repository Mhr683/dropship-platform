import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  Truck,
  DollarSign,
  Plus,
  ArrowRight,
  Calculator,
  Layers,
  Store,
  SlidersHorizontal,
  ChevronRight,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductFinderView: React.FC = () => {
  const {
    products,
    suppliers,
    setIsOrderModalOpen,
    setSelectedProductForModal,
    setIsProfitCalcModalOpen,
    setIsProductDetailModalOpen,
    stores
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('ALL');
  const [activeSpecialFilter, setActiveSpecialFilter] = useState<'ALL' | 'TRENDING' | 'BEST_SELLER' | 'HIGH_MARGIN' | 'LOW_COMP' | 'FAST_SHIPPING'>('ALL');
  const [maxSupplierCost, setMaxSupplierCost] = useState<number>(5000);
  const [minProfitMargin, setMinProfitMargin] = useState<number>(0);
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(true);

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesSupplier = p.supplierName.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesSupplier) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

      // Supplier
      if (selectedSupplier !== 'ALL' && p.supplierId !== selectedSupplier) return false;

      // Cost & Profit Filters
      if (p.supplierCostPKR > maxSupplierCost) return false;
      
      const margin = p.recSellingPricePKR - p.supplierCostPKR;
      const marginPct = (margin / p.recSellingPricePKR) * 100;
      if (marginPct < minProfitMargin) return false;

      // In stock
      if (showInStockOnly && p.stock <= 0) return false;

      // Special Filter Badges
      if (activeSpecialFilter === 'TRENDING' && !p.isTrending) return false;
      if (activeSpecialFilter === 'BEST_SELLER' && !p.isBestSeller) return false;
      if (activeSpecialFilter === 'HIGH_MARGIN' && marginPct < 45) return false;
      if (activeSpecialFilter === 'LOW_COMP' && p.competitionLevel !== 'LOW') return false;
      if (activeSpecialFilter === 'FAST_SHIPPING' && !p.fastShipping) return false;

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSupplier,
    activeSpecialFilter,
    maxSupplierCost,
    minProfitMargin,
    showInStockOnly
  ]);

  const handleOpenOrder = (product: Product) => {
    setSelectedProductForModal(product);
    setIsOrderModalOpen(true);
  };

  const handleOpenCalc = (product: Product) => {
    setSelectedProductForModal(product);
    setIsProfitCalcModalOpen(true);
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProductForModal(product);
    setIsProductDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> High-Margin Wholesale Discovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Product Research & <span className="text-emerald-400">Winner Finder</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Scan pre-vetted Pakistani wholesale suppliers with guaranteed stock, fast 1-2 day city dispatch, and high profit potential.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-xl font-black text-emerald-400">{filteredProducts.length}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Winning Products Found</p>
            </div>
          </div>
        </div>

        {/* Special Filter Badges Row */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
          {[
            { id: 'ALL', label: 'All Catalog', icon: Layers },
            { id: 'TRENDING', label: 'Trending Viral', icon: TrendingUp, color: 'text-amber-400' },
            { id: 'BEST_SELLER', label: 'Best Sellers', icon: Award, color: 'text-emerald-400' },
            { id: 'HIGH_MARGIN', label: 'High Margin (45%+)', icon: DollarSign, color: 'text-teal-400' },
            { id: 'LOW_COMP', label: 'Low Competition', icon: Zap, color: 'text-indigo-400' },
            { id: 'FAST_SHIPPING', label: 'Fast 1-2 Day Shipping', icon: Truck, color: 'text-sky-400' }
          ].map((pill) => {
            const Icon = pill.icon;
            const isSelected = activeSpecialFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveSpecialFilter(pill.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${pill.color || ''}`} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH & REFINEMENT TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, SKU or supplier..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Wholesale Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Toggle: Stock Only */}
          <div className="md:col-span-2 flex items-center justify-center">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800 focus:ring-emerald-500"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </div>

        {/* Sliders for Price & Profit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60 text-xs">
          <div>
            <div className="flex justify-between text-slate-400 font-semibold mb-1">
              <span>Max Wholesale Cost:</span>
              <span className="text-white font-bold">PKR {maxSupplierCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxSupplierCost}
              onChange={(e) => setMaxSupplierCost(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 font-semibold mb-1">
              <span>Min Profit Margin %:</span>
              <span className="text-emerald-400 font-bold">{minProfitMargin}%+</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="5"
              value={minProfitMargin}
              onChange={(e) => setMinProfitMargin(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS RESEARCH CARDS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const marginPKR = product.recSellingPricePKR - product.supplierCostPKR;
            const marginPct = Math.round((marginPKR / product.recSellingPricePKR) * 100);

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isTrending && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-md uppercase flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Trending
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-md uppercase flex items-center gap-1">
                        <Award className="w-3 h-3" /> Top Winner
                      </span>
                    )}
                  </div>

                  {/* Sales Potential Score Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl text-right shadow-lg">
                    <p className="text-[9px] uppercase font-bold text-slate-400">Score</p>
                    <p className="text-xs font-black text-emerald-400">{product.salesPotentialScore}/100</p>
                  </div>

                  {/* Fast Shipping Tag */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-sky-300 border border-sky-500/30 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-sky-400" />
                    <span>{product.estDeliveryDays} Day Dispatch</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5">
                      <span className="font-semibold text-slate-400">{product.category}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> {product.rating}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => handleOpenDetails(product)}
                      className="font-bold text-sm text-white hover:text-emerald-400 cursor-pointer line-clamp-2 transition leading-snug mb-1"
                    >
                      {product.name}
                    </h3>

                    {/* Supplier Name */}
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" /> {product.supplierName}
                    </p>
                  </div>

                  {/* Financial Breakdown Matrix (The Core SaaS Value) */}
                  <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Wholesale Base:</span>
                      <span className="font-bold text-white">PKR {product.supplierCostPKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Rec. Retail Price:</span>
                      <span className="font-bold text-slate-200">PKR {product.recSellingPricePKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-800/80">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Net Profit:
                      </span>
                      <span className="font-black text-emerald-400 text-sm">
                        PKR {marginPKR.toLocaleString()} ({marginPct}%)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => handleOpenOrder(product)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Book Order For Customer
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenCalc(product)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1"
                        title="Open instant visual margin calculator"
                      >
                        <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Calculate
                      </button>

                      <button
                        onClick={() => handleOpenDetails(product)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">No Products Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No products match your current search and filter settings. Try clearing active filters or adjusting the price range.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedSupplier('ALL');
              setActiveSpecialFilter('ALL');
              setMaxSupplierCost(10000);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl border border-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
