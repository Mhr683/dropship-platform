import React, { useState } from 'react';
import {
  Heart,
  Share2,
  Star,
  ShoppingBag,
  ShoppingCart,
  Zap,
  Download,
  Check,
  MapPin,
  Banknote,
  CreditCard,
  ChevronRight,
  ArrowLeft,
  X,
  Copy,
  ExternalLink,
  ShieldCheck,
  Truck,
  Video,
  Eye,
  Clock,
  RotateCcw,
  Award,
} from 'lucide-react';
import { Product, ProfitGuardConfig, User, StoreIntegration, BankTransferDetails } from '../types';
import { evaluateOrderFinancials } from '../utils/profitGuard';
import { BuyNowCheckoutView } from './BuyNowCheckoutView';

interface ProductOverviewProps {
  product: Product;
  allProducts: Product[];
  currentUser: User;
  profitGuardConfig: ProfitGuardConfig;
  bankTransferDetails?: BankTransferDetails;
  stores: StoreIntegration[];
  onBackToProducts: () => void;
  onSelectProduct: (product: Product) => void;
  onPlaceSampleOrder: (
    product: Product,
    sellingPrice: number,
    customerDetails: {
      customerName: string;
      customerPhone?: string;
      customerCity?: string;
      customerAddress?: string;
    }
  ) => void;
  onPushToStore: (product: Product, storePlatform: string, sellingPrice: number) => void;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  allProducts,
  currentUser,
  profitGuardConfig,
  bankTransferDetails,
  stores,
  onBackToProducts,
  onSelectProduct,
  onPlaceSampleOrder,
  onPushToStore,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.colorVariants?.[0] || 'RED SMALL'
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalMode, setModalMode] = useState<'order' | 'profit' | 'sync'>('order');
  const [customPrice, setCustomPrice] = useState(product.recSellingPricePKR);
  const [showCheckoutView, setShowCheckoutView] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customer COD Order Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Lahore');
  const [customerAddress, setCustomerAddress] = useState('');

  const displayOriginalPrice = Math.round(product.recSellingPricePKR * 1.2);
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const secondaryImage = productImages[1] || product.image;

  // Filter suggested products
  const suggestedProducts = allProducts
    .filter((p) => p.id !== product.id && p.isActive !== false)
    .slice(0, 3);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadAll = () => {
    const allLinks = productImages.join('\n');
    const textData = `Product: ${product.name}\nSKU: ${product.sku}\nPrice: PKR ${product.recSellingPricePKR}\nImages:\n${allLinks}\n${product.videoUrl ? `Video: ${product.videoUrl}` : ''}\n\nDescription:\n${product.description || ''}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(textData);
    showToast(`✅ All ${productImages.length} HD Media assets & descriptions copied to clipboard!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Wholesale Sourcing Hub for PKR ${product.recSellingPricePKR}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Product link copied to clipboard!');
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceSampleOrder(product, customPrice, {
      customerName: customerName || 'Direct Customer',
      customerPhone: customerPhone || '+92 300 1234567',
      customerCity: customerCity || 'Lahore',
      customerAddress: customerAddress || 'Pakistan Shipping Address',
    });
    setShowOrderModal(false);
    showToast('🎉 Customer COD Order placed successfully!');
  };

  // Live Financial Calculation
  const evaluation = evaluateOrderFinancials(
    {
      sellingPricePKR: customPrice,
      supplierCostPKR: product.supplierCostPKR,
      shippingCostPKR: profitGuardConfig.defaultShippingCostPKR,
      processingFeePKR: profitGuardConfig.processingFeePKR ?? 30,
      platformFeePct: profitGuardConfig.platformFeePct ?? 2.0,
    },
    profitGuardConfig
  );

  const { resellerNetProfitPKR, processingFeePKR, platformFeePKR, shippingCostPKR } = evaluation.financials;

  if (showCheckoutView) {
    return (
      <BuyNowCheckoutView
        product={product}
        quantity={quantity}
        selectedVariant={selectedVariant}
        profitGuardConfig={profitGuardConfig}
        bankTransferDetails={bankTransferDetails}
        onBack={() => setShowCheckoutView(false)}
        onOrderPlaced={(data) => {
          onPlaceSampleOrder(data.product, data.sellingPrice, {
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerCity: data.customerCity,
            customerAddress: data.customerAddress,
          });
          showToast('🎉 Customer COD Order dispatched successfully!');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-3 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-700 px-5 py-3.5 text-xs font-bold text-white shadow-2xl animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToProducts}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Product Overview
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button
            onClick={onBackToProducts}
            className="hover:text-orange-600 transition"
          >
            Products
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Product Overview</span>
        </div>
      </div>

      {/* Main 3-Column / Grid Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT COLUMN: Product Gallery Card (4 Cols) ================= */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm relative flex flex-col justify-between">
          {/* Top Left Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            <span className="bg-[#eb5e1f] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm inline-block w-max">
              New
            </span>
            <span className="bg-[#0284c7] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm inline-block w-max">
              -20%
            </span>
          </div>

          {/* Top Right Action Buttons (Heart & Share) */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="Wishlist"
              className="h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
            </button>

            <button
              onClick={handleShare}
              aria-label="Share"
              className="h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Main Top Image */}
          <div className="w-full aspect-[4/3] sm:aspect-square flex items-center justify-center p-3 pt-6">
            <img
              src={productImages[activeImageIdx] || product.image}
              alt={product.name}
              className="max-h-64 w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Lower Angle / Box Image */}
          <div className="w-full border-t border-slate-100 pt-3 mt-2 flex items-center justify-center">
            <img
              src={secondaryImage}
              alt={`${product.name} Angle`}
              onClick={() => setActiveImageIdx(1 % productImages.length)}
              className="max-h-36 sm:max-h-44 w-full object-contain mix-blend-multiply cursor-pointer hover:opacity-90 transition"
            />
          </div>

          {/* Small Thumbnails Carousel if multiple images exist */}
          {productImages.length > 2 && (
            <div className="flex items-center justify-center gap-2 pt-3 overflow-x-auto">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-12 w-12 rounded-lg border p-1 bg-slate-50 transition ${
                    activeImageIdx === idx
                      ? 'border-orange-500 ring-2 ring-orange-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="h-full w-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= MIDDLE COLUMN: Product Details & Purchase Card (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
              {product.name}
            </h2>

            {/* Rating, Sold, Weight, SKU */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.8}</span>
                <span className="text-slate-400">({product.salesCount || 973})</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-slate-600">
                <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />
                <span>{product.salesCount ? `${product.salesCount} sold` : '3 sold'}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span>Weight: {product.weightKg ? `${product.weightKg}kg` : '0.3kg'}</span>
              <span className="text-slate-400 font-mono text-[11px]">{product.sku}</span>
            </div>

            {/* Price Line */}
            <div className="flex flex-wrap items-baseline gap-2.5 pt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#e35614] tracking-tight">
                PKR {product.recSellingPricePKR.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-slate-400 line-through">
                PKR {displayOriginalPrice.toLocaleString()}
              </span>
              <span className="bg-[#ebfaef] text-[#16a34a] border border-[#d1fae5] text-[11px] font-bold px-2 py-0.5 rounded-md">
                20% OFF
              </span>
              <span className="ml-auto bg-[#e6f8f5] text-[#0f766e] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e]"></span>
                <span>{product.stock || 97} in stock</span>
              </span>
            </div>

            {/* Variant Selector */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-700">Grams</span>
              <div className="flex flex-wrap gap-2">
                {(product.colorVariants && product.colorVariants.length > 0
                  ? product.colorVariants
                  : ['RED SMALL']
                ).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border transition tracking-wide ${
                      selectedVariant === variant
                        ? 'border-[#eb5e1f] text-[#eb5e1f] bg-orange-50/60 shadow-sm'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition"
                >
                  −
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900 bg-white min-w-[36px] text-center border-x border-slate-200">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowCheckoutView(true)}
                className="w-full bg-[#e35614] hover:bg-[#cf4a0e] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm transition"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCheckoutView(true)}
                className="w-full bg-[#1e293b] hover:bg-[#0f172a] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm transition"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* 3 Service Feature Cards below Middle Card */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Cash On Delivery */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 text-center shadow-sm flex flex-col items-center justify-center space-y-1.5">
              <span className="text-xl">💰</span>
              <div className="text-[11px] sm:text-xs font-extrabold text-slate-800 leading-tight">
                CASH ON DELIVERY
              </div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Available</span>
              </div>
            </div>

            {/* Advance Payment */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 text-center shadow-sm flex flex-col items-center justify-center space-y-1.5">
              <span className="text-xl">💳</span>
              <div className="text-[11px] sm:text-xs font-extrabold text-slate-800 leading-tight">
                ADVANCE PAYMENT
              </div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Available</span>
              </div>
            </div>

            {/* Self Pickup */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 text-center shadow-sm flex flex-col items-center justify-center space-y-1.5">
              <MapPin className="h-5 w-5 text-slate-700 stroke-[2.5]" />
              <div className="text-[11px] sm:text-xs font-extrabold text-slate-800 leading-tight">
                SELF PICKUP
              </div>
              <div className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                <span>Not Available</span>
              </div>
            </div>
          </div>

          {/* 3 Performance Metric Cards matching Screenshot */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Ontime Delivery */}
            <div className="bg-[#fff7f0] rounded-2xl border border-orange-200/70 p-3 sm:p-4 text-center shadow-sm flex flex-col items-center justify-center space-y-1">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-[#ea580c]">
                <Clock className="h-5 w-5 stroke-[2.3]" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                90%
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600">
                Ontime Delivery
              </div>
            </div>

            {/* Cancellation */}
            <div className="bg-[#f0fcf9] rounded-2xl border border-teal-200/70 p-3 sm:p-4 text-center shadow-sm flex flex-col items-center justify-center space-y-1">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-[#0d9488]">
                <RotateCcw className="h-5 w-5 stroke-[2.3]" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                0%
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600">
                Cancellation
              </div>
            </div>

            {/* Quality Score */}
            <div className="bg-[#f0f9ff] rounded-2xl border border-sky-200/70 p-3 sm:p-4 text-center shadow-sm flex flex-col items-center justify-center space-y-1">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-[#0284c7]">
                <Award className="h-5 w-5 stroke-[2.3]" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                90%
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600">
                Quality Score
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Download Assets & Suggested Products (3 Cols) ================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Download Assets Card */}
          <div className="bg-[#fff7f2] rounded-2xl border border-orange-200/80 p-5 text-center shadow-sm space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-orange-100 text-[#e35614] flex items-center justify-center">
              <Download className="h-6 w-6 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Download Assets</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Get all product images, videos,description
              </p>
            </div>

            <button
              onClick={handleDownloadAll}
              className="w-full bg-[#e35614] hover:bg-[#cf4a0e] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition"
            >
              Download All
            </button>
          </div>

          {/* Suggested for you Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Suggested for you
            </h3>

            <div className="space-y-2.5">
              {suggestedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition group"
                >
                  <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200/70 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition">
                      {item.name}
                    </h4>
                    <div className="text-xs font-bold text-[#e35614] font-sans mt-0.5">
                      PKR {item.recSellingPricePKR.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: Profit Calculator & Customer COD Order ================= */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 text-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-orange-400 bg-orange-950/70 px-2.5 py-0.5 rounded-full border border-orange-800/60">
                  Reseller Profit & Delivery Engine
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{product.name}</h3>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profit Calculation Summary Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Wholesale vs Customer COD Price</div>
                  <div className="text-[11px] text-slate-400">
                    Supplier Cost: PKR {product.supplierCostPKR.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Your Selling Price</div>
                  <div className="text-base font-bold font-mono text-emerald-400">
                    PKR {customPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={product.supplierCostPKR}
                  max={product.supplierCostPKR * 3}
                  step="50"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Deductions Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">Wholesale</span>
                  <span className="text-amber-400 font-bold">Rs. {product.supplierCostPKR}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">Flat Fee</span>
                  <span className="text-slate-300 font-bold">Rs. {processingFeePKR}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">Delivery</span>
                  <span className="text-blue-300 font-bold">Rs. {shippingCostPKR}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">2% Platform</span>
                  <span className="text-purple-300 font-bold">Rs. {platformFeePKR}</span>
                </div>
              </div>

              {/* Exact Urdu Profit Notice */}
              <div
                className={`rounded-xl p-3 text-center text-xs sm:text-sm font-bold border ${
                  resellerNetProfitPKR > 0
                    ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-600/70 text-rose-300'
                }`}
              >
                {resellerNetProfitPKR > 0
                  ? `🎉 Order complete hone ke baad aapko PKR ${resellerNetProfitPKR.toLocaleString()} net profit milega`
                  : `⚠️ Loss Warning: Is price par PKR ${Math.abs(resellerNetProfitPKR)} ka nuqsan hoga`}
              </div>
            </div>

            {/* Direct COD Order Form */}
            <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-400" />
                <span>Customer Shipping & Cash On Delivery Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Usama Khan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    City (TCS / Leopards Network)
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
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

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Complete Shipping Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House/Shop #, Street, Area"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Dispatch via Cash on Delivery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
