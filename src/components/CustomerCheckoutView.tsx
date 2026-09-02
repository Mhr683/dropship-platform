import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  CreditCard,
  Sparkles,
  ArrowRight,
  Package,
} from 'lucide-react';
import { Product, Order } from '../types';

interface CustomerCheckoutViewProps {
  products: Product[];
  onPlaceOrder: (orderData: {
    product: Product;
    sellingPrice: number;
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerAddress: string;
  }) => void;
}

const PK_CITIES = [
  'Lahore (DHA / Gulberg / Cantt)',
  'Karachi (Clifton / Gulshan / DHA)',
  'Islamabad (F-Sector / Bahria)',
  'Rawalpindi (Saddar / Satellite Town)',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
];

export const CustomerCheckoutView: React.FC<CustomerCheckoutViewProps> = ({
  products,
  onPlaceOrder,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0] || null);
  const [customerName, setCustomerName] = useState('Hamza Tariq');
  const [customerPhone, setCustomerPhone] = useState('+92 301 8844221');
  const [customerCity, setCustomerCity] = useState(PK_CITIES[0]);
  const [customerAddress, setCustomerAddress] = useState('House 88, Street 14, Block Y, DHA Phase 3');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<boolean>(false);
  const [lastOrderNum, setLastOrderNum] = useState<string>('');

  const shippingCostPKR = 250;
  const totalPrice = selectedProduct ? selectedProduct.recSellingPricePKR + shippingCostPKR : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const generatedOrderNum = `YM-${Math.floor(10000 + Math.random() * 90000)}`;
    setLastOrderNum(generatedOrderNum);

    onPlaceOrder({
      product: selectedProduct,
      sellingPrice: selectedProduct.recSellingPricePKR,
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
    });

    setOrderPlacedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
                CUSTOMER STOREFRONT PREVIEW
              </span>
              <span className="text-xs text-slate-400">White-Label Dropship Checkout</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              End-Buyer Cash On Delivery (COD) Checkout
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Test the exact customer journey: place a Cash On Delivery order and observe the automated COD verification and Profit Guard audit in real time.
            </p>
          </div>
        </div>
      </div>

      {orderPlacedSuccess ? (
        <div className="rounded-3xl border border-emerald-500/50 bg-slate-900 p-8 text-center max-w-xl mx-auto shadow-2xl space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto ring-4 ring-emerald-500/10">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Order Confirmed & Ingested
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Thank You, {customerName}!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Your order <b className="font-mono text-emerald-400">{lastOrderNum}</b> has been received and queued for OTP confirmation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-left space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Item:</span>
              <span className="font-bold text-white">{selectedProduct?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="text-slate-300 text-right">{customerAddress}, {customerCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-bold text-amber-300">Cash on Delivery (COD)</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
              <span className="text-slate-200">Total COD Amount:</span>
              <span className="font-mono text-emerald-400">PKR {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setOrderPlacedSuccess(false)}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
          >
            Place Another Test Order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left 2 Cols: Checkout Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 lg:col-span-2 shadow-lg">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="h-4 w-4 text-blue-400" />
              <span>Customer Delivery Information (Pakistan COD)</span>
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              {/* Product Selector */}
              <div>
                <label className="font-semibold text-slate-300">Select Product to Purchase</label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {products.map((p) => {
                    const isSelected = selectedProduct?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/50'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-100 truncate text-xs">{p.name}</div>
                          <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">
                            PKR {p.recSellingPricePKR.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">WhatsApp / Phone Number</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-slate-300">Destination City</label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                  >
                    {PK_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Payment Option</label>
                  <div className="mt-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-amber-300 font-semibold flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-400" />
                    <span>Cash on Delivery (Pay upon delivery)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Complete Delivery Address</label>
                <textarea
                  rows={2}
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-sm font-bold text-white shadow-xl transition"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Confirm COD Order (PKR {totalPrice.toLocaleString()})</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 1 Col: Order Summary & Guarantee */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Order Total Summary
              </h3>

              {selectedProduct && (
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Item Price:</span>
                    <span className="font-mono text-slate-200">
                      PKR {selectedProduct.recSellingPricePKR.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Express Domestic Shipping:</span>
                    <span className="font-mono text-slate-200">PKR {shippingCostPKR}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>COD Handling Fee:</span>
                    <span className="font-mono text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-sm">
                    <span className="text-white">Total Payable (COD):</span>
                    <span className="font-mono text-emerald-400 text-base">
                      PKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3 space-y-1.5 text-[11px] text-slate-300">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>YourMart Buyer Protection</span>
                </div>
                <p className="text-slate-400 text-[10px]">
                  7-day return guarantee if the package is broken or items do not match description. Inspect parcel before payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
