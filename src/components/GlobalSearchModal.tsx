import React, { useState } from 'react';
import {
  Search,
  X,
  Package,
  ShoppingBag,
  Users,
  Building,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    products,
    orders,
    customers,
    suppliers,
    setSelectedProductForModal,
    setIsProductDetailModalOpen,
    setSelectedOrderForModal,
    setActiveTab
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isGlobalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedProducts = q ? products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedOrders = q ? orders.filter(o => o.orderId.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.trackingNumber.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedCustomers = q ? customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)).slice(0, 3) : [];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center p-4 pt-20 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-emerald-400 absolute left-4 top-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, tracking #, customers, suppliers..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        {q ? (
          <div className="space-y-4 text-xs pt-2">
            {/* Products */}
            {matchedProducts.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Wholesale Products</p>
                <div className="space-y-1.5">
                  {matchedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProductForModal(p);
                        setIsProductDetailModalOpen(true);
                        setIsGlobalSearchOpen(false);
                      }}
                      className="p-3 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="font-bold text-white">{p.name}</p>
                          <span className="text-[10px] text-slate-400">SKU: {p.sku} • Wholesale: PKR {p.supplierCostPKR}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders */}
            {matchedOrders.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Orders & Dispatches</p>
                <div className="space-y-1.5">
                  {matchedOrders.map((o) => (
                    <div
                      key={o.orderId}
                      onClick={() => {
                        setSelectedOrderForModal(o);
                        setActiveTab('orders');
                        setIsGlobalSearchOpen(false);
                      }}
                      className="p-3 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-sky-400" />
                        <div>
                          <p className="font-bold text-white">Order #{o.orderId} • {o.customerName}</p>
                          <span className="text-[10px] text-slate-400">{o.productName} • Status: {o.status}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customers */}
            {matchedCustomers.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Customers CRM</p>
                <div className="space-y-1.5">
                  {matchedCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveTab('customers');
                        setIsGlobalSearchOpen(false);
                      }}
                      className="p-3 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="font-bold text-white">{c.name} ({c.city})</p>
                          <span className="text-[10px] text-slate-400">Phone: {c.phone} • Trust: {c.trustScore}/100</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchedProducts.length === 0 && matchedOrders.length === 0 && matchedCustomers.length === 0 && (
              <p className="text-center py-6 text-slate-500">No matching items found for "{query}".</p>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            Start typing to search products, orders, tracking numbers, or customers...
          </div>
        )}
      </div>
    </div>
  );
};
