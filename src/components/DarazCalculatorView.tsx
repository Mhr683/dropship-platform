import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Percent,
  TrendingUp,
  ShieldCheck,
  Building2,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  Info,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Zap,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export interface ProvinceVatConfig {
  id: 'punjab' | 'sindh' | 'kpk' | 'balochistan' | 'islamabad';
  name: string;
  vatRate: number; // percentage, e.g., 16 for 16%
  authority: string;
  badgeColor: string;
}

export const PROVINCES: ProvinceVatConfig[] = [
  { id: 'punjab', name: 'Punjab', vatRate: 16, authority: 'PRA (Punjab Revenue Authority)', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'sindh', name: 'Sindh', vatRate: 15, authority: 'SRB (Sindh Revenue Board)', badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { id: 'kpk', name: 'Khyber Pakhtunkhwa (KPK)', vatRate: 15, authority: 'KPRA (KPK Revenue Authority)', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'balochistan', name: 'Balochistan', vatRate: 15, authority: 'BRA (Balochistan Revenue Authority)', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'islamabad', name: 'Islamabad (ICT)', vatRate: 16, authority: 'FBR / ICT Sales Tax', badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20' }
];

export interface DarazCategoryCommission {
  name: string;
  defaultRate: number; // percentage
  icon?: string;
}

export const DARAZ_CATEGORIES: DarazCategoryCommission[] = [
  { name: 'Mobile Accessories & Gadgets', defaultRate: 13.5 },
  { name: 'Fashion & Apparel', defaultRate: 13.0 },
  { name: 'Watches, Sunglasses & Jewelry', defaultRate: 15.0 },
  { name: 'Health & Beauty / Cosmetics', defaultRate: 11.5 },
  { name: 'Home & Living / Kitchen', defaultRate: 12.0 },
  { name: 'Consumer Electronics & Audio', defaultRate: 6.5 },
  { name: 'Mobiles & Tablets', defaultRate: 4.0 },
  { name: 'Computers & Laptops', defaultRate: 4.5 },
  { name: 'Motors & Automotive', defaultRate: 9.5 },
  { name: 'Sports & Outdoor', defaultRate: 11.0 },
  { name: 'Groceries & Pets', defaultRate: 7.5 },
  { name: 'Custom / Other Category', defaultRate: 10.0 }
];

export const DarazCalculatorView: React.FC = () => {
  const { products } = useApp();

  // Selected State
  const [selectedProvinceId, setSelectedProvinceId] = useState<'punjab' | 'sindh' | 'kpk' | 'balochistan' | 'islamabad'>('punjab');
  const [itemUnitPrice, setItemUnitPrice] = useState<number>(2500);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(DARAZ_CATEGORIES[0].name);
  const [commissionRate, setCommissionRate] = useState<number>(DARAZ_CATEGORIES[0].defaultRate);
  
  // Cost inputs
  const [sourcingCostPerUnit, setSourcingCostPerUnit] = useState<number>(1200);
  const [packagingCost, setPackagingCost] = useState<number>(50); // Flyer, bubble wrap, label
  const [sellerShippingSubsidy, setSellerShippingSubsidy] = useState<number>(0); // 0 if buyer pays shipping
  const [otherOperatingCost, setOtherOperatingCost] = useState<number>(30); // Misc expenses
  const [returnRatePct, setReturnRatePct] = useState<number>(6); // Expected return/RTO rate %
  const [returnLossPerReturn, setReturnLossPerReturn] = useState<number>(180); // Two-way handling loss

  // Reverse Pricing Goal (What selling price needed for desired profit?)
  const [targetProfitPKR, setTargetProfitPKR] = useState<number>(500);

  // Copied state
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Auto-fill from catalog
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState<string>('');

  const currentProvince = useMemo(() => {
    return PROVINCES.find(p => p.id === selectedProvinceId) || PROVINCES[0];
  }, [selectedProvinceId]);

  // When category changes, update default commission
  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    const cat = DARAZ_CATEGORIES.find(c => c.name === catName);
    if (cat) {
      setCommissionRate(cat.defaultRate);
    }
  };

  // When picking from catalog
  const handleSelectCatalogProduct = (prodId: string) => {
    setSelectedCatalogProduct(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setItemUnitPrice(prod.recSellingPricePKR);
      setSourcingCostPerUnit(prod.supplierCostPKR);
      setPackagingCost(50);
    }
  };

  // ============================================================
  // MATHEMATICAL ENGINE (Official Daraz Pakistan Formulas)
  // ============================================================
  // 1. Transaction Value = Unit Price * Quantity
  const totalTransactionValue = itemUnitPrice * quantity;
  const totalSourcingCost = sourcingCostPerUnit * quantity;

  // 2. Standard Payment Fee = 2.25% of Transaction Value
  const PAYMENT_FEE_RATE = 2.25; // 2.25%
  const basePaymentFee = (totalTransactionValue * PAYMENT_FEE_RATE) / 100;
  const paymentFeeVat = (basePaymentFee * currentProvince.vatRate) / 100;
  const totalPaymentFeeWithVat = basePaymentFee + paymentFeeVat;

  // 3. Daraz Commission Fee
  const baseCommissionFee = (totalTransactionValue * commissionRate) / 100;
  const commissionVat = (baseCommissionFee * currentProvince.vatRate) / 100;
  const totalCommissionWithVat = baseCommissionFee + commissionVat;

  // 4. Fulfillment & Shipping Deductions
  const totalPackagingCost = packagingCost * quantity;
  const totalShippingSubsidy = sellerShippingSubsidy * quantity;
  const totalOtherCosts = otherOperatingCost * quantity;

  // 5. Estimated Return / RTO Reserve
  // Return cost per delivered item = (Return Rate % * returnLossPerReturn)
  const returnReserveLoss = (totalTransactionValue * (returnRatePct / 100) * (returnLossPerReturn / Math.max(1, itemUnitPrice))) || ((returnRatePct / 100) * returnLossPerReturn * quantity);

  // 6. Total Daraz Marketplace Deductions
  const totalDarazDeductions = totalPaymentFeeWithVat + totalCommissionWithVat + totalShippingSubsidy;

  // 7. Net Payout from Daraz to Seller Bank Account
  const darazNetBankPayout = totalTransactionValue - totalDarazDeductions;

  // 8. Total Expenses & Net Profit
  const totalSellerExpenses = totalSourcingCost + totalPackagingCost + totalOtherCosts + returnReserveLoss + totalDarazDeductions;
  const netSellerProfit = totalTransactionValue - totalSellerExpenses;
  const netMarginPct = totalTransactionValue > 0 ? (netSellerProfit / totalTransactionValue) * 100 : 0;
  const roiPct = (totalSourcingCost + totalPackagingCost + totalOtherCosts) > 0 
    ? (netSellerProfit / (totalSourcingCost + totalPackagingCost + totalOtherCosts)) * 100 
    : 0;

  // 9. Break-Even Price Calculation for 1 unit:
  // SellingPrice = SourcingCost + Packaging + Other + ReturnLoss + (SellingPrice * (2.25 * (1 + VAT%) + Comm * (1 + VAT%)) / 100)
  // SP * (1 - TotalDeductionRate) = FixedCosts
  const totalDeductionMultiplier = ((PAYMENT_FEE_RATE * (1 + currentProvince.vatRate / 100)) + (commissionRate * (1 + currentProvince.vatRate / 100))) / 100;
  const unitFixedCosts = sourcingCostPerUnit + packagingCost + otherOperatingCost + sellerShippingSubsidy + ((returnRatePct / 100) * returnLossPerReturn);
  const breakEvenUnitPrice = totalDeductionMultiplier < 1 ? unitFixedCosts / (1 - totalDeductionMultiplier) : 0;

  // 10. Required Selling Price for Target Profit
  const requiredUnitPriceForTargetProfit = totalDeductionMultiplier < 1 
    ? (unitFixedCosts + targetProfitPKR) / (1 - totalDeductionMultiplier)
    : 0;

  // Copy full breakdown to clipboard
  const handleCopyBreakdown = () => {
    const report = `=== DARAZ PAKISTAN PROFIT & FEE BREAKDOWN ===
Province: ${currentProvince.name} (VAT: ${currentProvince.vatRate}%)
Category: ${selectedCategory} (Commission: ${commissionRate}%)
Item Unit Price: PKR ${itemUnitPrice.toLocaleString()} (Qty: ${quantity})
Total Transaction Value: PKR ${totalTransactionValue.toLocaleString()}

--- DARAZ DEDUCTIONS ---
• Base Payment Fee (2.25%): PKR ${basePaymentFee.toFixed(2)}
• Payment Fee VAT (${currentProvince.vatRate}%): PKR ${paymentFeeVat.toFixed(2)}
• Total Payment Fee with VAT: PKR ${totalPaymentFeeWithVat.toFixed(2)}
• Daraz Category Commission (${commissionRate}%): PKR ${baseCommissionFee.toFixed(2)}
• Commission VAT (${currentProvince.vatRate}%): PKR ${commissionVat.toFixed(2)}
• Total Commission with VAT: PKR ${totalCommissionWithVat.toFixed(2)}
• Shipping Subsidy / Promotion: PKR ${totalShippingSubsidy.toFixed(2)}
Total Daraz Deductions: PKR ${totalDarazDeductions.toFixed(2)}

--- SELLER PAYOUT & PROFIT ---
• Daraz Bank Transfer Payout: PKR ${darazNetBankPayout.toFixed(2)}
• Sourcing Cost (COGS): PKR ${totalSourcingCost.toLocaleString()}
• Packaging & Operations: PKR ${(totalPackagingCost + totalOtherCosts).toFixed(2)}
• Return/RTO Reserve: PKR ${returnReserveLoss.toFixed(2)}
=========================================
NET SELLER PROFIT: PKR ${netSellerProfit.toFixed(2)}
NET PROFIT MARGIN: ${netMarginPct.toFixed(2)}%
RETURN ON INVESTMENT (ROI): ${roiPct.toFixed(2)}%
BREAK-EVEN SELLING PRICE: PKR ${Math.ceil(breakEvenUnitPrice).toLocaleString()}
=========================================`;

    navigator.clipboard.writeText(report);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" /> Daraz Pakistan Seller Economics Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Daraz Fee & Profit Calculator</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-orange-600 text-white rounded-lg uppercase tracking-wider">
              2.25% Payment Fee + Province VAT
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Accurate real-time fee calculation with province-specific Service VAT (Sindh 15%, Punjab 16%, Balochistan 15%, KPK 15%), Daraz marketplace commissions, bank transfer deductions, and seller net margin.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleCopyBreakdown}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Statement</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PROVINCE SELECTOR BAR (Highlighting 15% vs 16% VAT) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-400" /> Select Seller Registration Province (VAT on Services):
          </label>
          <span className="text-xs text-slate-400 font-medium">
            VAT is legally deducted on Daraz Payment Fee & Commission by provincial revenue authorities
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROVINCES.map((prov) => {
            const isSelected = selectedProvinceId === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => setSelectedProvinceId(prov.id)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {prov.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{prov.authority.split(' ')[0]}</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                    prov.vatRate === 16 ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    {prov.vatRate}% VAT
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Inputs & Pricing Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Catalog Autofill */}
          {products.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" /> Auto-Load From Wholesale Catalog
                </span>
                <span className="text-[10px] text-slate-400">1-click test with real inventory</span>
              </div>
              <select
                value={selectedCatalogProduct}
                onChange={(e) => handleSelectCatalogProduct(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Choose a catalog product to test --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Wholesale: PKR {p.supplierCostPKR} | Rec: PKR {p.recSellingPricePKR})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Core Selling & Pricing Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Package className="w-4 h-4 text-orange-400" /> 1. Product Pricing & Order Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Item Selling Price */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Customer Selling Price on Daraz</span>
                  <span className="text-[10px] text-orange-400">Item Unit Price</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    min="1"
                    value={itemUnitPrice}
                    onChange={(e) => setItemUnitPrice(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-2.5 text-sm font-black text-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                  Order Quantity (Delivered Items)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Category & Commission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                  Daraz Product Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  {DARAZ_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.defaultRate}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Category Commission Rate</span>
                  <span className="text-[10px] text-slate-400">Customizable %</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-orange-500 transition"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing & Operational Costs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-emerald-400" /> 2. Sourcing, Packaging & Logistics Costs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 mb-1.5 block">
                  Wholesale Sourcing Cost (Per Unit)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    min="0"
                    value={sourcingCostPerUnit}
                    onChange={(e) => setSourcingCostPerUnit(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1.5 block">
                  Daraz Flyer / Packaging Material Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    min="0"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1.5 block">
                  Seller Shipping Subsidy (0 if Buyer Pays)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    min="0"
                    value={sellerShippingSubsidy}
                    onChange={(e) => setSellerShippingSubsidy(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1.5 block">
                  Other Operational Overhead (Per Unit)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    min="0"
                    value={otherOperatingCost}
                    onChange={(e) => setOtherOperatingCost(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Return / RTO Safety Provision */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-400" /> Return / RTO Risk Allowance (COD Buffer)
                </span>
                <span className="text-[10px] text-slate-400">Est. reserve: PKR {returnReserveLoss.toFixed(1)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Expected Return Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={returnRatePct}
                    onChange={(e) => setReturnRatePct(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Loss Per Return (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={returnLossPerReturn}
                    onChange={(e) => setReturnLossPerReturn(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reverse Pricing Target Calculator */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" /> Target Profit to Required Selling Price
              </h4>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                Reverse Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Enter the exact net profit you want to make per item, and the engine calculates the required Daraz listing price including all fees & province VAT.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Desired Net Profit Per Unit (PKR):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    value={targetProfitPKR}
                    onChange={(e) => setTargetProfitPKR(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-3 text-center">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">List On Daraz At</span>
                <span className="text-xl font-black text-indigo-400 mt-0.5">
                  PKR {Math.ceil(requiredUnitPriceForTargetProfit).toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Includes {currentProvince.name} {currentProvince.vatRate}% VAT & {commissionRate}% Comm</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Official Daraz Calculation Statement & Province Matrix (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* NET OUTCOME HERO CARD */}
          <div className={`border rounded-3xl p-6 shadow-2xl space-y-5 transition ${
            netSellerProfit > 0 
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/40' 
              : 'bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/30 border-red-500/40'
          }`}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-400" /> Financial Outcome ({currentProvince.name})
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                netSellerProfit > 0 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-300 border-red-500/30'
              }`}>
                {netSellerProfit > 0 ? 'PROFITABLE SALE' : 'UNPROFITABLE WARNING'}
              </span>
            </div>

            {/* Big Stat Box */}
            <div className="text-center py-2">
              <p className="text-xs uppercase font-bold text-slate-400">Estimated Net Seller Profit</p>
              <p className={`text-3.5xl sm:text-4xl font-black tracking-tight mt-1 ${
                netSellerProfit > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                PKR {netSellerProfit.toFixed(1)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Net Margin: <strong className="text-white">{netMarginPct.toFixed(1)}%</strong> | ROI: <strong className="text-teal-300">{roiPct.toFixed(1)}%</strong>
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Daraz Bank Payout</p>
                <p className="text-base font-black text-sky-400 mt-0.5">PKR {darazNetBankPayout.toFixed(1)}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">After all Daraz fees</p>
              </div>

              <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Break-Even Price</p>
                <p className="text-base font-black text-amber-400 mt-0.5">PKR {Math.ceil(breakEvenUnitPrice).toLocaleString()}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Minimum 0-loss price</p>
              </div>
            </div>
          </div>

          {/* DETAILED DARAZ DEDUCTIONS BREAKDOWN */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-orange-400" /> Itemized Daraz Fee Statement
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Gross: PKR {totalTransactionValue.toLocaleString()}</span>
            </h3>

            {/* Fee item list */}
            <div className="space-y-3 text-xs">
              {/* PAYMENT FEE (Highlighted as per user prompt) */}
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-orange-400" /> Payment Fee (2.25% Standard)
                  </span>
                  <span className="font-mono font-bold text-orange-200">
                    PKR {basePaymentFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pl-5 text-[11px]">
                  <span>+ {currentProvince.name} VAT on Payment Fee ({currentProvince.vatRate}%)</span>
                  <span className="font-mono">PKR {paymentFeeVat.toFixed(2)}</span>
                </div>
                <div className="border-t border-orange-500/20 pt-1.5 flex justify-between items-center font-bold text-orange-400 text-xs">
                  <span>Total Payment Fee with VAT:</span>
                  <span className="font-mono">PKR {totalPaymentFeeWithVat.toFixed(2)}</span>
                </div>
              </div>

              {/* DARAZ COMMISSION FEE */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">
                    Marketplace Commission ({commissionRate}%)
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    PKR {baseCommissionFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pl-4 text-[11px]">
                  <span>+ {currentProvince.name} VAT on Commission ({currentProvince.vatRate}%)</span>
                  <span className="font-mono">PKR {commissionVat.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-1.5 flex justify-between items-center font-bold text-slate-300 text-xs">
                  <span>Total Commission with VAT:</span>
                  <span className="font-mono">PKR {totalCommissionWithVat.toFixed(2)}</span>
                </div>
              </div>

              {/* OTHER DEDUCTIONS */}
              {totalShippingSubsidy > 0 && (
                <div className="flex justify-between items-center py-1 px-3 text-slate-400 bg-slate-950/50 rounded-xl">
                  <span>Seller Shipping Promotion:</span>
                  <span className="font-mono text-slate-300">PKR {totalShippingSubsidy.toFixed(2)}</span>
                </div>
              )}

              {/* TOTAL DARAZ CHARGES */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex justify-between items-center font-extrabold text-xs">
                <span className="text-slate-300">Total Daraz Fee Deductions:</span>
                <span className="text-orange-400 font-mono text-sm">PKR {totalDarazDeductions.toFixed(2)}</span>
              </div>

              {/* NON-DARAZ COSTS */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Wholesale Sourcing (COGS):</span>
                  <span className="font-mono text-slate-300">PKR {totalSourcingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging & Handling:</span>
                  <span className="font-mono text-slate-300">PKR {totalPackagingCost.toFixed(2)}</span>
                </div>
                {returnReserveLoss > 0 && (
                  <div className="flex justify-between">
                    <span>Return / RTO Loss Buffer:</span>
                    <span className="font-mono text-slate-300">PKR {returnReserveLoss.toFixed(2)}</span>
                  </div>
                )}
                {totalOtherCosts > 0 && (
                  <div className="flex justify-between">
                    <span>Other Operating Costs:</span>
                    <span className="font-mono text-slate-300">PKR {totalOtherCosts.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ALL-PROVINCES SIDE-BY-SIDE MATRIX */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-orange-400" /> Province VAT Comparison Matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 font-bold">Province</th>
                    <th className="py-2 font-bold text-center">VAT %</th>
                    <th className="py-2 font-bold text-right">Payment Fee+VAT</th>
                    <th className="py-2 font-bold text-right">Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {PROVINCES.map((prov) => {
                    const pVat = prov.vatRate;
                    const pPayFeeVat = basePaymentFee * (pVat / 100);
                    const pTotalPayFee = basePaymentFee + pPayFeeVat;
                    const pCommVat = baseCommissionFee * (pVat / 100);
                    const pTotalComm = baseCommissionFee + pCommVat;
                    const pTotalDaraz = pTotalPayFee + pTotalComm + totalShippingSubsidy;
                    const pProfit = totalTransactionValue - (totalSourcingCost + totalPackagingCost + totalOtherCosts + returnReserveLoss + pTotalDaraz);
                    const isSelected = selectedProvinceId === prov.id;

                    return (
                      <tr
                        key={prov.id}
                        onClick={() => setSelectedProvinceId(prov.id)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-orange-500/10 text-white font-bold' : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <td className="py-2 flex items-center gap-1.5">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>}
                          {prov.name}
                        </td>
                        <td className="py-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            pVat === 16 ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                          }`}>
                            {pVat}%
                          </span>
                        </td>
                        <td className="py-2 text-right font-mono">
                          PKR {pTotalPayFee.toFixed(1)}
                        </td>
                        <td className={`py-2 text-right font-mono font-bold ${
                          pProfit > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          PKR {pProfit.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* EDUCATIONAL POLICY & FORMULA ACCORDION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-extrabold text-white text-base flex items-center gap-2">
          <Info className="w-5 h-5 text-orange-400" /> Daraz Pakistan Fee Structure & Rules Guide
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-orange-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-400" /> 1. Payment Fee (2.25%)
            </h4>
            <p className="leading-relaxed text-slate-400">
              Payment fee har delivered item par transaction value ka <strong>2.25%</strong> ke hisaab se charge ki jati hai. Yeh fee sellers se tamam delivered orders (prepaid aur cash on delivery dono) ke liye bank transfer fee ke taur par deduct ki jati hai.
            </p>
            <div className="font-mono text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              Payment Fee = Item Unit Price × 2.25%<br />
              VAT = Payment Fee × VAT (Province-wise %)<br />
              Payment Fee with VAT = Payment Fee + VAT
            </div>
          </div>

          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-orange-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-orange-400" /> 2. Province-wise VAT Charges
            </h4>
            <p className="leading-relaxed text-slate-400">
              Under Pakistan tax laws, services rendered by marketplaces are subject to Provincial Sales Tax on Services (PST):
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                <span>Punjab:</span>
                <span className="text-amber-300">16% (PRA)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                <span>Sindh:</span>
                <span className="text-sky-300">15% (SRB)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                <span>KPK:</span>
                <span className="text-emerald-300">15% (KPRA)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                <span>Balochistan:</span>
                <span className="text-purple-300">15% (BRA)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
