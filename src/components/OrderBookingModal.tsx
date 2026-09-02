import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  ShoppingBag,
  DollarSign,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';

export const OrderBookingModal: React.FC = () => {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    selectedProductForModal,
    products,
    couriers,
    placeOrder
  } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('03001234567');
  const [customerAddress, setCustomerAddress] = useState('House 42, Street 7, Phase 5 DHA');
  const [customerCity, setCustomerCity] = useState('Karachi');
  const [sellingPrice, setSellingPrice] = useState<number>(2499);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('cour-postex');
  const [internalNotes, setInternalNotes] = useState('Call customer before dispatch.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  useEffect(() => {
    if (selectedProductForModal) {
      setSelectedProductId(selectedProductForModal.id);
      setSellingPrice(selectedProductForModal.recSellingPricePKR);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      setSellingPrice(products[0].recSellingPricePKR);
    }
  }, [selectedProductForModal, products]);

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleProductChange = (pId: string) => {
    setSelectedProductId(pId);
    const prod = products.find(p => p.id === pId);
    if (prod) {
      setSellingPrice(prod.recSellingPricePKR);
    }
  };

  if (!isOrderModalOpen) return null;

  const supplierCost = activeProduct ? activeProduct.supplierCostPKR : 1000;
  const platformFeePKR = (sellingPrice * 2) / 100;
  const resellerMarginPKR = Math.max(0, sellingPrice - supplierCost - platformFeePKR);
  const marginPct = sellingPrice > 0 ? Math.round((resellerMarginPKR / sellingPrice) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !customerName || !customerPhone) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderData: Partial<Order> = {
        productId: activeProduct.id,
        productName: activeProduct.name,
        productSku: activeProduct.sku,
        productImage: activeProduct.image,
        supplierId: activeProduct.supplierId,
        supplierName: activeProduct.supplierName,
        customerName,
        customerPhone,
        customerAddress,
        customerCity,
        sellingPricePKR: sellingPrice,
        supplierPayoutPKR: supplierCost,
        platformFeePKR,
        resellerMarginPKR,
        courierName: couriers.find(c => c.id === selectedCourierId)?.name || 'PostEx Express',
        paymentMethod: 'COD',
        internalNotes
      };

      placeOrder(orderData);
      setIsSubmitting(false);
      setBookedSuccess(true);

      setTimeout(() => {
        setBookedSuccess(false);
        setIsOrderModalOpen(false);
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">Book Direct Customer COD Order</h3>
              <p className="text-xs text-slate-400">Direct courier dispatch from wholesale supplier warehouse</p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Product Selection */}
          <div>
            <label className="font-bold text-slate-300 mb-1 block">Select Wholesale Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Wholesale: PKR {p.supplierCostPKR})
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800">
            <div>
              <label className="font-bold text-slate-400 block mb-1">Your Selling Price to Customer (PKR)</label>
              <input
                type="number"
                required
                min={supplierCost}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <span className="font-bold text-emerald-400 block mb-1">Your Net Reseller Profit (PKR)</span>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-emerald-400 font-extrabold text-sm flex items-center justify-between">
                <span>PKR {resellerMarginPKR.toLocaleString()}</span>
                <span className="text-xs">({marginPct}%)</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-extrabold text-white text-xs">Customer Delivery Information</h4>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 mb-1 block">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">Destination City</label>
                <select
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Complete Street Address</label>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="House #, Street #, Sector/Area, Landmark"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Courier Partner</label>
              <select
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {couriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.avgDeliveryDays} Days • PKR {c.baseRatePKR} shipping • {c.successRate}% Success)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {bookedSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Order booked! Routing to supplier warehouse for packaging.</span>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isSubmitting ? 'Booking Order...' : 'Confirm & Book Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
