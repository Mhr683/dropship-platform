import React from 'react';
import { ShoppingBag, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartFloatingWidget: React.FC = () => {
  const {
    cart,
    cartTotalCount,
    cartTotalProfitPKR,
    isCartOpen,
    setIsCartOpen,
    cartToast,
    setCartToast
  } = useApp();

  return (
    <>
      {/* Toast Notification when adding items to cart */}
      {cartToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-bounce max-w-sm w-full">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 text-white backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white truncate">{cartToast.message}</p>
                {cartToast.subtext && (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {cartToast.subtext}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setCartToast(null);
                  setIsCartOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition shadow-sm"
              >
                View Cart
              </button>
              <button
                onClick={() => setCartToast(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button (when cart has items & drawer is closed) */}
      {!isCartOpen && cartTotalCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fadeIn">
          <button
            onClick={() => setIsCartOpen(true)}
            className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white p-3 sm:px-4 sm:py-3 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 transition transform hover:scale-105"
            title="Open Dropshipping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:rotate-6 transition" />
              <span className="absolute -top-2 -right-2 bg-white text-emerald-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartTotalCount}
              </span>
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider leading-none">
                Cart Ready ({cartTotalCount})
              </div>
              <div className="text-xs font-black text-white leading-tight">
                Profit: PKR {cartTotalProfitPKR.toLocaleString()}
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-emerald-200 hidden sm:inline group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      )}
    </>
  );
};
