import React from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Building2,
  DollarSign,
  Calculator,
  Plus,
  TrendingUp,
  Award,
  CheckCircle2,
  Boxes,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    isProductDetailModalOpen,
    setIsProductDetailModalOpen,
    selectedProductForModal,
    setIsOrderModalOpen,
    setIsProfitCalcModalOpen
  } = useApp();

  if (!isProductDetailModalOpen || !selectedProductForModal) return null;

  const product = selectedProductForModal;
  const margin = product.recSellingPricePKR - product.supplierCostPKR;
  const marginPct = Math.round((margin / product.recSellingPricePKR) * 100);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
              {product.category}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs font-mono text-slate-400">SKU: {product.sku}</span>
          </div>

          <button
            onClick={() => setIsProductDetailModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Visual & Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.isTrending && (
              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-md uppercase">
                Trending Winner
              </span>
            )}
          </div>

          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-500">({product.reviewsCount} verified reviews)</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Warehouse & Supplier Box */}
            <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Supplier:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {product.supplierName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Available Stock:</span>
                <span className="font-bold text-emerald-400">{product.stock} units in warehouse</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Dispatch Time:</span>
                <span className="text-slate-200 font-bold">{product.estDeliveryDays} Days (Fast Track)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Unit Economics Matrix */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Unit Economics & Margin
            </span>
            <span className="text-emerald-400 font-bold font-mono">Platform Fee: 2% Only</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Wholesale Base</span>
              <p className="text-base font-black text-white mt-0.5">PKR {product.supplierCostPKR.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Rec. Retail</span>
              <p className="text-base font-black text-slate-200 mt-0.5">PKR {product.recSellingPricePKR.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Net Margin</span>
              <p className="text-base font-black text-emerald-400 mt-0.5">
                +PKR {margin.toLocaleString()} ({marginPct}%)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              setIsProductDetailModalOpen(false);
              setIsOrderModalOpen(true);
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Book Direct Customer Order
          </button>

          <button
            onClick={() => {
              setIsProductDetailModalOpen(false);
              setIsProfitCalcModalOpen(true);
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4 text-emerald-400" /> Open Full Financial Profit Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
