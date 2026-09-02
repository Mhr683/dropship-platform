import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  DollarSign,
  Package,
  Building,
  ShieldCheck,
  Info,
  ChevronDown,
  ShoppingBag,
  Layers,
  FileText,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { Product } from '../types';

interface DarazCalculatorProps {
  products?: Product[];
  onSelectProductForOrder?: (product: Product, sellingPrice: number) => void;
  onClose?: () => void;
}

type ProvinceKey = 'PUNJAB' | 'SINDH' | 'BALOCHISTAN' | 'KPK' | 'ISLAMABAD';

interface ProvinceVatOption {
  key: ProvinceKey;
  name: string;
  vatRate: number; // e.g. 0.16 for 16%
  vatDisplay: string;
  desc: string;
}

const PROVINCE_VAT_DATA: ProvinceVatOption[] = [
  {
    key: 'PUNJAB',
    name: 'Punjab',
    vatRate: 0.16,
    vatDisplay: '16% PRA VAT',
    desc: 'Punjab Revenue Authority (16%)',
  },
  {
    key: 'SINDH',
    name: 'Sindh',
    vatRate: 0.15,
    vatDisplay: '15% SRB VAT',
    desc: 'Sindh Revenue Board (15%)',
  },
  {
    key: 'BALOCHISTAN',
    name: 'Balochistan',
    vatRate: 0.15,
    vatDisplay: '15% BRA VAT',
    desc: 'Balochistan Revenue Authority (15%)',
  },
  {
    key: 'KPK',
    name: 'Khyber Pakhtunkhwa (KPK)',
    vatRate: 0.15,
    vatDisplay: '15% KPRA VAT',
    desc: 'KPK Revenue Authority (15%)',
  },
  {
    key: 'ISLAMABAD',
    name: 'Islamabad / Federal (ICT)',
    vatRate: 0.16,
    vatDisplay: '16% FBR/ICT VAT',
    desc: 'Federal Capital Territory (16%)',
  },
];

interface DarazCategoryPreset {
  name: string;
  commissionPct: number;
}

const DARAZ_CATEGORY_PRESETS: DarazCategoryPreset[] = [
  { name: 'Mobile Accessories & Gadgets', commissionPct: 8.5 },
  { name: 'Consumer Electronics & Smart Devices', commissionPct: 7.0 },
  { name: 'Fashion, Apparel & Footwear', commissionPct: 12.0 },
  { name: 'Health, Beauty & Personal Care', commissionPct: 10.0 },
  { name: 'Home, Kitchen & Living', commissionPct: 9.0 },
  { name: 'Watches, Bags & Jewelry', commissionPct: 11.5 },
  { name: 'Toys, Kids & Baby Products', commissionPct: 8.0 },
  { name: 'Tools, Automotive & Hardware', commissionPct: 7.5 },
  { name: 'Custom Category Commission', commissionPct: 8.0 },
];

export const DarazCalculator: React.FC<DarazCalculatorProps> = ({
  products = [],
  onSelectProductForOrder,
  onClose,
}) => {
  // Mode: 'DESIRED_MARGIN' (Target profit to required selling price) OR 'DIRECT_PRICE' (Selling price to profit)
  const [calculationMode, setCalculationMode] = useState<'DESIRED_MARGIN' | 'DIRECT_PRICE'>(
    'DESIRED_MARGIN'
  );

  // Selected Catalog Product (Optional)
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Form Inputs
  const [productTitle, setProductTitle] = useState('Custom Product');
  const [sourcingCostPKR, setSourcingCostPKR] = useState<number>(1000);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    DARAZ_CATEGORY_PRESETS[0].name
  );
  const [commissionRatePct, setCommissionRatePct] = useState<number>(8.5);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceKey>('PUNJAB');
  const [packagingShippingCostPKR, setPackagingShippingCostPKR] = useState<number>(0);

  // Margin Inputs
  const [marginInputType, setMarginInputType] = useState<'AMOUNT' | 'PERCENTAGE'>('AMOUNT');
  const [desiredMarginAmountPKR, setDesiredMarginAmountPKR] = useState<number>(500);
  const [desiredMarginPct, setDesiredMarginPct] = useState<number>(35);

  // Direct Selling Price Input (for DIRECT_PRICE mode)
  const [directSellingPricePKR, setDirectSellingPricePKR] = useState<number>(1850);

  // Copy Status
  const [isCopied, setIsCopied] = useState(false);

  // Handle Catalog Selection
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) return;
    const found = products.find((p) => p.id === prodId);
    if (found) {
      setProductTitle(found.name);
      setSourcingCostPKR(found.supplierCostPKR);
      setDirectSellingPricePKR(found.recSellingPricePKR);
      setDesiredMarginAmountPKR(
        Math.max(200, Math.round(found.recSellingPricePKR - found.supplierCostPKR - 250))
      );
    }
  };

  // Province VAT Configuration
  const currentProvinceData = useMemo(() => {
    return (
      PROVINCE_VAT_DATA.find((p) => p.key === selectedProvince) || PROVINCE_VAT_DATA[0]
    );
  }, [selectedProvince]);

  const vatRate = currentProvinceData.vatRate; // e.g. 0.16
  const paymentFeeRate = 0.0225; // Standard 2.25%
  const commissionRate = commissionRatePct / 100; // e.g. 0.085

  // Calculations
  const calculatedResults = useMemo(() => {
    let finalSellingPrice = 0;
    let desiredProfit = 0;

    const sourcing = Math.max(0, Number(sourcingCostPKR) || 0);
    const packaging = Math.max(0, Number(packagingShippingCostPKR) || 0);

    // Total Daraz fee multiplier on Selling Price (Commission + Payment Fee + VAT on both)
    // Total Fee = (Commission + Payment Fee) * (1 + VAT)
    const feeMultiplier = (commissionRate + paymentFeeRate) * (1 + vatRate);

    if (calculationMode === 'DESIRED_MARGIN') {
      if (marginInputType === 'AMOUNT') {
        desiredProfit = Math.max(0, Number(desiredMarginAmountPKR) || 0);
      } else {
        // Percentage based on sourcing cost
        desiredProfit = Math.round((sourcing * (Number(desiredMarginPct) || 0)) / 100);
      }

      // Formula: Selling Price = (Sourcing + Packaging + Desired Profit) / (1 - feeMultiplier)
      if (feeMultiplier < 0.95) {
        finalSellingPrice = Math.round((sourcing + packaging + desiredProfit) / (1 - feeMultiplier));
      } else {
        finalSellingPrice = sourcing + packaging + desiredProfit;
      }
    } else {
      // Direct Selling Price Mode
      finalSellingPrice = Math.max(10, Number(directSellingPricePKR) || 0);
    }

    // Step-by-step Breakdown using exact Daraz rules:
    // 1. Payment Fee = Item Unit Price * 2.25%
    const paymentFeeBase = finalSellingPrice * paymentFeeRate;
    // 2. VAT on Payment Fee = Payment Fee * VAT %
    const paymentFeeVat = paymentFeeBase * vatRate;
    // 3. Payment Fee with VAT = Payment Fee + VAT
    const paymentFeeWithVat = paymentFeeBase + paymentFeeVat;

    // 4. Category Commission = Item Unit Price * Commission %
    const categoryCommissionBase = finalSellingPrice * commissionRate;
    // 5. VAT on Commission = Commission * VAT %
    const categoryCommissionVat = categoryCommissionBase * vatRate;
    // 6. Commission with VAT
    const categoryCommissionWithVat = categoryCommissionBase + categoryCommissionVat;

    // Total Daraz Deductions
    const totalDarazFees = paymentFeeWithVat + categoryCommissionWithVat;
    const totalAllDeductions = totalDarazFees + packaging;

    // Net Payout transferred by Daraz into Seller's Bank Account
    const netBankPayout = Math.max(0, finalSellingPrice - totalDarazFees - packaging);

    // Pure Net Profit in Pocket (Bank Payout - Wholesale Sourcing Cost)
    const netProfitInPocket = netBankPayout - sourcing;
    const netProfitMarginPct =
      finalSellingPrice > 0 ? (netProfitInPocket / finalSellingPrice) * 100 : 0;
    const roiPct = sourcing > 0 ? (netProfitInPocket / sourcing) * 100 : 0;

    return {
      sellingPrice: finalSellingPrice,
      sourcingCost: sourcing,
      packagingCost: packaging,
      paymentFeeBase,
      paymentFeeVat,
      paymentFeeWithVat,
      categoryCommissionBase,
      categoryCommissionVat,
      categoryCommissionWithVat,
      totalDarazFees,
      totalAllDeductions,
      netBankPayout,
      netProfitInPocket,
      netProfitMarginPct,
      roiPct,
      isProfitable: netProfitInPocket > 0,
      feeMultiplierPct: (feeMultiplier * 100).toFixed(2),
    };
  }, [
    calculationMode,
    marginInputType,
    desiredMarginAmountPKR,
    desiredMarginPct,
    directSellingPricePKR,
    sourcingCostPKR,
    packagingShippingCostPKR,
    commissionRate,
    paymentFeeRate,
    vatRate,
  ]);

  const handleCopySummary = () => {
    const text = `
🛒 DARAZ PK PROFIT & TAX BREAKDOWN 🛒
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Product: ${productTitle}
💰 Daraz Selling Price: PKR ${calculatedResults.sellingPrice.toLocaleString()}
🏭 Wholesale Sourcing Cost: PKR ${calculatedResults.sourcingCost.toLocaleString()}
📍 Seller Province: ${currentProvinceData.name} (${currentProvinceData.vatDisplay})

⚖️ DARAZ TAXES & FEES BREAKDOWN:
• Payment Fee (2.25%): PKR ${calculatedResults.paymentFeeBase.toFixed(2)}
• Payment Fee VAT (${(vatRate * 100)}%): PKR ${calculatedResults.paymentFeeVat.toFixed(2)}
  ↳ Total Payment Fee (with VAT): PKR ${calculatedResults.paymentFeeWithVat.toFixed(2)}

• Daraz Commission (${commissionRatePct}%): PKR ${calculatedResults.categoryCommissionBase.toFixed(2)}
• Commission VAT (${(vatRate * 100)}%): PKR ${calculatedResults.categoryCommissionVat.toFixed(2)}
  ↳ Total Commission (with VAT): PKR ${calculatedResults.categoryCommissionWithVat.toFixed(2)}

• Packaging/Shipping: PKR ${calculatedResults.packagingCost.toLocaleString()}
• Total Daraz Deductions: PKR ${calculatedResults.totalAllDeductions.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏦 NET BANK PAYOUT: PKR ${calculatedResults.netBankPayout.toFixed(2)}
💵 PURE NET PROFIT: PKR ${calculatedResults.netProfitInPocket.toFixed(2)}
📈 PROFIT MARGIN: ${calculatedResults.netProfitMarginPct.toFixed(1)}% | ROI: ${calculatedResults.roiPct.toFixed(1)}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via YourMart Global Daraz Profit Engine
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const resetCalculator = () => {
    setSelectedProductId('');
    setProductTitle('Custom Product');
    setSourcingCostPKR(1000);
    setSelectedCategory(DARAZ_CATEGORY_PRESETS[0].name);
    setCommissionRatePct(8.5);
    setSelectedProvince('PUNJAB');
    setPackagingShippingCostPKR(0);
    setMarginInputType('AMOUNT');
    setDesiredMarginAmountPKR(500);
    setDesiredMarginPct(35);
    setDirectSellingPricePKR(1850);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
                <Calculator className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-orange-600/30 px-3 py-0.5 text-xs font-bold text-orange-400 border border-orange-500/40 uppercase tracking-wider">
                Daraz.pk Official Fee & VAT Calculator
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl font-sans">
              Daraz Profit & Commission Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automatic calculation with <b>2.25% standard payment fee</b> and province-wise VAT (Punjab 16%, Sindh 15%, KPK 15%, Balochistan 15%). Enter your product cost and choose your exact desired margin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetCalculator}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition shadow"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 text-xs font-bold transition shadow-lg shadow-orange-950"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  <span>Breakdown Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mode Toggle Switch */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Calculation Mode:
          </span>
          <button
            onClick={() => setCalculationMode('DESIRED_MARGIN')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              calculationMode === 'DESIRED_MARGIN'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Target Profit Mode (Calculate Required Selling Price)</span>
          </button>
          <button
            onClick={() => setCalculationMode('DIRECT_PRICE')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              calculationMode === 'DIRECT_PRICE'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <Percent className="h-3.5 w-3.5" />
            <span>Price Evaluation Mode (Input Selling Price & Get Net Profit)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================================
            LEFT COLUMN: INPUT CONTROLS (7 COLS)
        ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Quick Catalog Sourcing Preset (Optional) */}
          {products.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-orange-400" />
                  <span>Auto-fill from Wholesale Sourcing Catalog</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">Optional</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
              >
                <option value="">-- Choose a Product to Load Wholesale Cost --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Wholesale: PKR {p.supplierCostPKR.toLocaleString()} | Retail: PKR{' '}
                    {p.recSellingPricePKR.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* STEP 1: Product & Sourcing Details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold text-xs">
                1
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Product & Sourcing Cost
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Product Title / Item Name</label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  placeholder="e.g. Wireless Bluetooth Earbuds"
                />
              </div>

              {/* Wholesale Cost */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-orange-400 flex items-center justify-between">
                  <span>Wholesale Sourcing Cost (PKR)</span>
                  <span className="text-[10px] text-slate-400">Buying Price</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={sourcingCostPKR || ''}
                    onChange={(e) => setSourcingCostPKR(Number(e.target.value))}
                    className="w-full rounded-xl border border-orange-500/40 bg-slate-950 pl-10 pr-3.5 py-2 text-sm font-mono font-bold text-white focus:border-orange-500 focus:outline-none"
                    placeholder="1000"
                  />
                </div>
              </div>

              {/* Packaging / Extra Handling Cost */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Packaging & Flyer Cost (PKR)</span>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={packagingShippingCostPKR}
                    onChange={(e) => setPackagingShippingCostPKR(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2 text-sm font-mono text-white focus:border-orange-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Province & Daraz Category Taxes */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold text-xs">
                2
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Province VAT & Category Commission
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Province Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Seller Warehouse Province</span>
                  <span className="text-[10px] text-amber-400 font-mono font-semibold">
                    {currentProvinceData.vatDisplay}
                  </span>
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value as ProvinceKey)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  {PROVINCE_VAT_DATA.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.name} ({p.vatDisplay})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Applied on Payment Fee (2.25%) & Commission.
                </p>
              </div>

              {/* Category Commission Preset */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Category Marketplace Commission</span>
                  <span className="text-[10px] text-orange-400 font-mono font-bold">
                    {commissionRatePct}%
                  </span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCategory(val);
                    const found = DARAZ_CATEGORY_PRESETS.find((c) => c.name === val);
                    if (found) setCommissionRatePct(found.commissionPct);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  {DARAZ_CATEGORY_PRESETS.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.commissionPct}%)
                    </option>
                  ))}
                </select>

                {/* Custom Commission Slider/Number */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min="3"
                    max="20"
                    step="0.5"
                    value={commissionRatePct}
                    onChange={(e) => setCommissionRatePct(Number(e.target.value))}
                    className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-white whitespace-nowrap">
                    {commissionRatePct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Standard Payment Fee Notice Banner */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-3 flex items-start gap-2.5 text-xs text-blue-200">
              <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-blue-300">Standard Payment Fee: </span>
                Daraz charges <b>2.25%</b> on item transaction value on all delivered orders (Prepaid & COD) plus <b>{currentProvinceData.vatDisplay}</b>.
              </div>
            </div>
          </div>

          {/* STEP 3: Profit Margin Selection OR Direct Price Input */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                3
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {calculationMode === 'DESIRED_MARGIN'
                  ? 'Your Desired Profit Margin'
                  : 'Customer Selling Price on Daraz'}
              </h2>
            </div>

            {calculationMode === 'DESIRED_MARGIN' ? (
              <div className="space-y-4">
                {/* Margin Type Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMarginInputType('AMOUNT')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition ${
                      marginInputType === 'AMOUNT'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Fixed Profit Amount (PKR)
                  </button>
                  <button
                    onClick={() => setMarginInputType('PERCENTAGE')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition ${
                      marginInputType === 'PERCENTAGE'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Percentage Margin (%)
                  </button>
                </div>

                {marginInputType === 'AMOUNT' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                      <span>Target Net Profit In Your Pocket (PKR)</span>
                      <span className="font-mono text-white text-sm">
                        Rs. {desiredMarginAmountPKR.toLocaleString()}
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={desiredMarginAmountPKR || ''}
                        onChange={(e) => setDesiredMarginAmountPKR(Number(e.target.value))}
                        className="w-full rounded-xl border border-emerald-500/50 bg-slate-950 pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="500"
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[250, 400, 500, 750, 1000, 1500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDesiredMarginAmountPKR(amt)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition border ${
                            desiredMarginAmountPKR === amt
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          +Rs. {amt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                      <span>Desired Markup on Sourcing Cost</span>
                      <span className="font-mono text-white text-sm">{desiredMarginPct}%</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="150"
                        step="5"
                        value={desiredMarginPct}
                        onChange={(e) => setDesiredMarginPct(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="font-mono font-bold text-white text-sm w-12 text-right">
                        {desiredMarginPct}%
                      </span>
                    </div>

                    {/* Quick Percentage Presets */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[20, 30, 40, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDesiredMarginPct(pct)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition border ${
                            desiredMarginPct === pct
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* DIRECT SELLING PRICE INPUT */
              <div className="space-y-2">
                <label className="text-xs font-bold text-orange-400 flex items-center justify-between">
                  <span>Listing Price on Daraz.pk (PKR)</span>
                  <span className="text-[10px] text-slate-400">Customer checkout total</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={directSellingPricePKR || ''}
                    onChange={(e) => setDirectSellingPricePKR(Number(e.target.value))}
                    className="w-full rounded-xl border border-orange-500/50 bg-slate-950 pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-white focus:border-orange-500 focus:outline-none"
                    placeholder="1850"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: RESULTS & DETAILED RECEIPT BREAKDOWN (5 COLS)
        ========================================================================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Key Results Card */}
          <div className="rounded-3xl border border-orange-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
            {/* Top Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-emerald-500 to-teal-400" />

            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border border-orange-500/30">
                Official Daraz Calculation
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentProvinceData.name} ({currentProvinceData.vatDisplay})
              </span>
            </div>

            {/* Big Primary Metric: Selling Price */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 mb-4 text-center">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                {calculationMode === 'DESIRED_MARGIN'
                  ? 'Recommended Daraz Selling / Listing Price'
                  : 'Customer Retail Listing Price'}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                PKR {calculatedResults.sellingPrice.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                ✓ All 2.25% Payment fee, Category commission & VAT covered
              </span>
            </div>

            {/* Secondary Highlights: Net Payout & Pure Profit */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl bg-blue-950/30 border border-blue-500/30 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                  Bank Transfer Payout
                </span>
                <span className="text-lg font-bold font-mono text-blue-200 block">
                  PKR {calculatedResults.netBankPayout.toFixed(0)}
                </span>
                <span className="text-[9px] text-blue-300/80">From Daraz to Bank</span>
              </div>

              <div
                className={`rounded-xl p-3 border ${
                  calculatedResults.isProfitable
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                    calculatedResults.isProfitable ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  Pure Net Profit
                </span>
                <span className="text-lg font-bold font-mono block">
                  PKR {calculatedResults.netProfitInPocket.toFixed(0)}
                </span>
                <span className="text-[9px] opacity-80">
                  Margin: {calculatedResults.netProfitMarginPct.toFixed(1)}% | ROI:{' '}
                  {calculatedResults.roiPct.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Itemized Detailed Receipt */}
            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Itemized Fee & Tax Statement
              </h3>

              {/* Sourcing Cost */}
              <div className="flex items-center justify-between text-slate-300">
                <span>Wholesale Product Cost:</span>
                <span className="font-mono font-semibold">
                  PKR {calculatedResults.sourcingCost.toLocaleString()}
                </span>
              </div>

              {/* Packaging */}
              {calculatedResults.packagingCost > 0 && (
                <div className="flex items-center justify-between text-slate-300">
                  <span>Packaging & Flyer:</span>
                  <span className="font-mono">
                    PKR {calculatedResults.packagingCost.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Payment Fee Breakdown (2.25% + Province VAT) */}
              <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span>Payment Processing Fee (2.25%):</span>
                  </span>
                  <span className="font-mono">
                    PKR {calculatedResults.paymentFeeBase.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] pl-2.5">
                  <span>
                    + {currentProvinceData.name} VAT ({(vatRate * 100)}%):
                  </span>
                  <span className="font-mono text-slate-300">
                    PKR {calculatedResults.paymentFeeVat.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-blue-300 text-[11px] font-bold border-t border-slate-800/60 pt-1 pl-2.5">
                  <span>Total Payment Fee (with VAT):</span>
                  <span className="font-mono">
                    PKR {calculatedResults.paymentFeeWithVat.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Category Commission Breakdown */}
              <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    <span>Daraz Commission ({commissionRatePct}%):</span>
                  </span>
                  <span className="font-mono">
                    PKR {calculatedResults.categoryCommissionBase.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] pl-2.5">
                  <span>
                    + {currentProvinceData.name} VAT ({(vatRate * 100)}%):
                  </span>
                  <span className="font-mono text-slate-300">
                    PKR {calculatedResults.categoryCommissionVat.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-orange-300 text-[11px] font-bold border-t border-slate-800/60 pt-1 pl-2.5">
                  <span>Total Commission (with VAT):</span>
                  <span className="font-mono">
                    PKR {calculatedResults.categoryCommissionWithVat.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Deductions */}
              <div className="flex items-center justify-between text-rose-300 font-bold border-t border-slate-800 pt-2 text-xs">
                <span>Total Daraz Deductions & Taxes:</span>
                <span className="font-mono">
                  - PKR {calculatedResults.totalAllDeductions.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white py-3 px-4 text-xs font-bold transition shadow-lg shadow-orange-950"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Pricing Receipt Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Full Pricing Breakdown</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick FAQ / Formula Guide */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified Daraz Calculation Formula</span>
            </h4>
            <p className="leading-relaxed font-mono text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              Payment Fee = Price × 2.25%<br />
              VAT = Payment Fee × {currentProvinceData.vatDisplay}<br />
              Payment Fee with VAT = Payment Fee + VAT<br />
              Net Payout = Price - (Fees + Commission + All VAT)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
