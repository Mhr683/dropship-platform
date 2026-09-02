import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Truck,
  RotateCcw,
  Boxes,
  TrendingUp,
  Building2,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPublicView: React.FC = () => {
  const { setActiveTab, setIsRegisterModalOpen, products } = useApp();

  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">
          <Sparkles className="w-4 h-4" /> PAKISTAN'S #1 WHOLESALE & RESELLER ENGINE
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Find. Import. Sell. <span className="text-emerald-400">Automate.</span> Profit.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The automated e-commerce backbone connecting verified Karachi & Lahore wholesale suppliers with Shopify, Daraz, and social commerce resellers across Pakistan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('product_finder')}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm px-8 py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30"
          >
            <span>Explore Winning Products</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-8 py-4 rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <span>Register Free Partner Account</span>
          </button>
        </div>

        {/* TRUST BADGES BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-xs text-slate-400 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Verified Wholesalers</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Automated COD Dispatch</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">T+1 Rapid Settlement</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">7-Day Return Reserve</span>
          </div>
        </div>
      </div>

      {/* 6-STEP ENGINE PIPELINE */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-emerald-400">The Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How YourMart Powers E-Com Brands</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Find Winning Products', desc: 'AI-analyzed sales velocity, real supplier prices in Karachi & Lahore, and verified profit margins.' },
            { step: '02', title: '1-Click Multi-Store Import', desc: 'Push products directly into your Shopify or WooCommerce store with auto-translated Urdu descriptions.' },
            { step: '03', title: 'Sell Across Pakistan', desc: 'Run TikTok and Meta ads. When a customer orders via COD, the order automatically flows into YourMart.' },
            { step: '04', title: 'Automated COD & WhatsApp OTP', desc: 'Eliminate 80% of fake orders with automated WhatsApp confirmation and courier doorstep verification.' },
            { step: '05', title: 'Automated Warehouse Dispatch', desc: 'Suppliers receive packing slips, pack the parcels, and hand over to PostEx, TCS, Trax, or CallCourier.' },
            { step: '06', title: 'Track & Instant Profit Payout', desc: 'Once delivered, the customer cash is collected, supplier is paid, and your profit is remitted in PKR.' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 relative group hover:border-emerald-500/50 transition">
              <span className="font-mono text-3xl font-black text-slate-800 group-hover:text-emerald-500/40 transition">
                {item.step}
              </span>
              <h3 className="font-extrabold text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED TRENDING PRODUCTS PREVIEW */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-black uppercase text-emerald-400">Live Wholesale Catalog</span>
            <h2 className="text-2xl font-extrabold text-white">Top Trending Pakistani Wholesale SKUs</h2>
          </div>

          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveTab('products')}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-4 space-y-3 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950">
                <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{p.category}</span>
                <h4 className="font-bold text-white text-xs truncate mt-0.5">{p.name}</h4>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-slate-400 font-mono">Wholesale: PKR {p.supplierCostPKR}</span>
                  <span className="text-emerald-400 font-bold font-mono">Retail: PKR {p.recSellingPricePKR}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
