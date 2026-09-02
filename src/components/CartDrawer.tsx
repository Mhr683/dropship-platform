import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ArrowRight,
  DollarSign,
  Truck,
  Building,
  CheckCircle2,
  Package,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    updateCartSellingPrice,
    clearCart,
    cartTotalCount,
    cartTotalSupplierCostPKR,
    cartTotalSellingPricePKR,
    cartTotalProfitPKR,
    setIsOrderModalOpen,
    setSelectedProductForModal,
    setActiveTab
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<'ITEMS' | 'ORDER_FORM'>('ITEMS');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Lahore');
  const [customerAddress, setCustomerAddress] = useState('');
  const [courierName, setCourierName] = useState('PostEx COD (Recommended)');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successOrderIds, setSuccessOrderIds] = useState<string[]>([]);

  const { placeOrder } = useApp();

  if (!isCartOpen) return null;

  const handleCheckoutAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    const generatedIds: string[] = [];
    cart.forEach(item => {
      const res = placeOrder({
        productId: item.product.id,
        customerName,
        customerPhone,
        customerCity,
        customerAddress,
        sellingPricePKR: item.targetSellingPricePKR * item.quantity,
        courierName
      });
      if (res.orderId) {
        generatedIds.push(res.orderId);
      }
    });

    setSuccessOrderIds(generatedIds);
    setIsSuccess(true);
    clearCart();

    setTimeout(() => {
      setIsSuccess(false);
      setIsCartOpen(false);
      setCheckoutStep('ITEMS');
      setActiveTab('orders');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-1.5">
                  Dropshipping Cart (کارٹ)
                </h3>
                <p className="text-[11px] text-slate-400">
                  {cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'} selected for ordering
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {cart.length > 0 && checkoutStep === 'ITEMS' && (
                <button
                  onClick={clearCart}
                  className="text-[11px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded-lg transition"
                  title="Clear all cart items"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep('ITEMS');
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Success Overlay */}
          {isSuccess && (
            <div className="p-6 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white">Orders Booked Successfully!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {successOrderIds.length} {successOrderIds.length === 1 ? 'order' : 'orders'} generated and routed to supplier warehouse for packing.
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-emerald-300 font-mono">
                {successOrderIds.join(', ')}
              </div>
              <p className="text-[11px] text-slate-500">Redirecting to Orders Pipeline...</p>
            </div>
          )}

          {/* Body Content */}
          {!isSuccess && (
            <>
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h4 className="font-extrabold text-white text-base">Your Cart is Empty</h4>
                    <p className="text-xs text-slate-400">
                      ہوم اسکرین پر موجود مصنوعات میں سے جو پروڈکٹ بیچنا چاہتے ہیں اسے "Add to Cart" کر کے شامل کریں۔
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab('dashboard');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Package className="w-4 h-4" />
                    <span>Browse Wholesale Catalog (مصنوعات دیکھیں)</span>
                  </button>
                </div>
              ) : checkoutStep === 'ITEMS' ? (
                /* Step 1: Cart Items Review */
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {cart.map((item) => {
                    const itemTotalSupplierCost = item.product.supplierCostPKR * item.quantity;
                    const itemTotalSellingPrice = item.targetSellingPricePKR * item.quantity;
                    const itemTotalProfit = itemTotalSellingPrice - itemTotalSupplierCost;

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-sm hover:border-slate-700 transition"
                      >
                        <div className="flex gap-3 items-start">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-bold text-xs text-white line-clamp-1 leading-tight">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition shrink-0"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-500" />
                              <span className="truncate">{item.product.supplierName}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-300">{item.product.sku}</span>
                            </p>

                            <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                              <span className="text-slate-400">
                                Wholesale: <strong className="text-white">PKR {item.product.supplierCostPKR.toLocaleString()}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Selling Price & Profit Control */}
                        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <label className="text-[11px] font-semibold text-slate-300">
                              Customer Selling Price (PKR):
                            </label>
                            <input
                              type="number"
                              min={item.product.supplierCostPKR}
                              step={50}
                              value={item.targetSellingPricePKR}
                              onChange={(e) => updateCartSellingPrice(item.id, Math.max(item.product.supplierCostPKR, Number(e.target.value) || 0))}
                              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right font-extrabold text-emerald-400 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {/* Unit Profit */}
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-400" /> Reseller Profit / Unit:
                            </span>
                            <span className="font-bold text-emerald-400">
                              +PKR {(item.targetSellingPricePKR - item.product.supplierCostPKR).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper & Subtotal */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-extrabold text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-extrabold text-white">
                              PKR {itemTotalSellingPrice.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-bold">
                              Profit: PKR {itemTotalProfit.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Step 2: Fast Dropship Checkout Form */
                <form onSubmit={handleCheckoutAll} className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Customer details for COD shipping & parcel delivery.</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">
                        Customer Full Name (کسٹمر کا نام) *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Usman Ali"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">
                        Customer WhatsApp / Phone (موبائل نمبر) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-300 mb-1 block">City (شہر) *</label>
                        <select
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Karachi">Karachi</option>
                          <option value="Lahore">Lahore</option>
                          <option value="Islamabad">Islamabad</option>
                          <option value="Rawalpindi">Rawalpindi</option>
                          <option value="Faisalabad">Faisalabad</option>
                          <option value="Multan">Multan</option>
                          <option value="Peshawar">Peshawar</option>
                          <option value="Quetta">Quetta</option>
                          <option value="Sialkot">Sialkot</option>
                          <option value="Gujranwala">Gujranwala</option>
                          <option value="Hyderabad">Hyderabad</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 mb-1 block">Courier Service</label>
                        <select
                          value={courierName}
                          onChange={(e) => setCourierName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="PostEx COD (Recommended)">PostEx COD (98% SBP)</option>
                          <option value="Trax Logistics">Trax Express</option>
                          <option value="TCS Express">TCS COD</option>
                          <option value="Call Courier">Call Courier</option>
                          <option value="Leopards COD">Leopards COD</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">
                        Complete Delivery Address (مکمل پتہ) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="House / Shop #, Street, Near landmark, Sector/Area..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 space-y-2 text-xs">
                    <p className="font-bold text-slate-300">Items in this dispatch ({cart.length}):</p>
                    <div className="space-y-1 text-slate-400 text-[11px]">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate max-w-[200px]">{item.product.name} (x{item.quantity})</span>
                          <span className="text-white font-bold">PKR {(item.targetSellingPricePKR * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* Footer Summary & Action Bar */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 space-y-3.5">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Wholesale Cost (سپلائر رقم):</span>
                      <span className="text-slate-200 font-bold">PKR {cartTotalSupplierCostPKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Total Customer Value (کل کسٹمر قیمت):</span>
                      <span className="text-white font-extrabold">PKR {cartTotalSellingPricePKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 mt-2">
                      <span className="font-extrabold text-emerald-300 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Your Net Profit (آپ کا خالص منافع):</span>
                      </span>
                      <span className="text-base font-black text-emerald-400">
                        PKR {cartTotalProfitPKR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {checkoutStep === 'ITEMS' ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setCheckoutStep('ORDER_FORM')}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                      >
                        <span>Proceed to Book Dropship Order (آرڈر بک کریں)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setActiveTab('dashboard');
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs transition"
                      >
                        Continue Browsing Products
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('ITEMS')}
                        className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-2xl text-xs transition"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCheckoutAll}
                        disabled={!customerName || !customerPhone || !customerAddress}
                        className="w-2/3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Dispatch COD</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
