import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Building2,
  Tag,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  DollarSign,
  ChevronRight,
  Calculator,
  ExternalLink,
  Edit,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductsCatalogView: React.FC = () => {
  const {
    products,
    activeRole,
    setIsAddProductModalOpen,
    setIsOrderModalOpen,
    setSelectedProductForModal,
    setIsProfitCalcModalOpen,
    setIsProductDetailModalOpen,
    deleteProduct,
    addToCart,
    cart,
    setIsCartOpen
  } = useApp();

  const [catalogFilter, setCatalogFilter] = useState<'ALL' | 'SUPPLIER' | 'RESELLER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredProducts = products.filter((p) => {
    if (catalogFilter !== 'ALL' && (p.ownerRole || 'SUPPLIER') !== catalogFilter) return false;
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.supplierName.toLowerCase().includes(q);
    }
    return true;
  });

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Package className="w-3.5 h-3.5" /> Full Product Inventory
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Wholesale Catalog</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage wholesale inventory listings, wholesale base rates, stock levels, and customer booking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Tab Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Owner Role Tabs: All vs Vendor Wholesale vs Reseller Direct */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setCatalogFilter('ALL')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition ${
                catalogFilter === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Listings ({products.length})
            </button>
            <button
              onClick={() => setCatalogFilter('SUPPLIER')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition ${
                catalogFilter === 'SUPPLIER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vendor Wholesale ({products.filter(p => p.ownerRole === 'SUPPLIER').length})
            </button>
            <button
              onClick={() => setCatalogFilter('RESELLER')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition ${
                catalogFilter === 'RESELLER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reseller Offers ({products.filter(p => p.ownerRole === 'RESELLER').length})
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                selectedCategory === c
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c === 'ALL' ? 'All Categories' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const margin = p.recSellingPricePKR - p.supplierCostPKR;
            const marginPct = Math.round((margin / p.recSellingPricePKR) * 100);

            return (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
                        p.ownerRole === 'RESELLER'
                          ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}
                    >
                      {p.ownerRole === 'RESELLER' ? 'Reseller Direct Listing' : 'Verified Vendor Wholesale'}
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        p.stock <= p.lowStockThreshold ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {p.stock} units in warehouse
                    </span>
                  </div>

                  {/* Image & Title */}
                  <div className="flex gap-3 mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <h4
                        onClick={() => {
                          setSelectedProductForModal(p);
                          setIsProductDetailModalOpen(true);
                        }}
                        className="font-bold text-sm text-white hover:text-emerald-400 cursor-pointer line-clamp-2 transition leading-tight"
                      >
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        SKU: <span className="font-mono text-slate-300">{p.sku}</span> • {p.category}
                      </p>
                    </div>
                  </div>

                  {/* Supplier Hub */}
                  <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{p.supplierName}</span>
                  </p>

                  {/* Financial Grid */}
                  <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Wholesale Base Cost:</span>
                      <span className="font-bold text-white">PKR {p.supplierCostPKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Suggested Retail Price:</span>
                      <span className="font-bold text-emerald-400">PKR {p.recSellingPricePKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800/80 pt-1.5 font-bold">
                      <span className="text-slate-300">Expected Margin:</span>
                      <span className="text-emerald-400">
                        PKR {margin.toLocaleString()} ({marginPct}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  {/* ADD TO CART BUTTON */}
                  <button
                    onClick={() => addToCart(p, 1)}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md ${
                      cart.some(item => item.product.id === p.id)
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600 hover:text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {cart.some(item => item.product.id === p.id)
                        ? `In Cart (${cart.find(item => item.product.id === p.id)?.quantity}) • Add More`
                        : 'Add to Cart (کارٹ میں شامل کریں)'}
                    </span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProductForModal(p);
                        setIsOrderModalOpen(true);
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition border border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <span>Book Order</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProductForModal(p);
                        setIsProfitCalcModalOpen(true);
                      }}
                      className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl border border-slate-700 transition"
                      title="Profit Breakdown"
                    >
                      <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProductForModal(p);
                        setIsProductDetailModalOpen(true);
                      }}
                      className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl border border-slate-700 transition"
                      title="Product Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {(activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN') && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete product ${p.name}?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2 rounded-xl border border-red-500/20 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No products found in this category.
        </div>
      )}
    </div>
  );
};
