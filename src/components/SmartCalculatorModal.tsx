import React, { useState, useEffect } from 'react';
import {
  X,
  Calculator,
  DollarSign,
  TrendingUp,
  Percent,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Package,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartCalculatorModal: React.FC = () => {
  const {
    isProfitCalcModalOpen,
    setIsProfitCalcModalOpen,
    selectedProductForModal
  } = useApp();

  const [activeMode, setActiveMode] = useState<'daraz' | 'general'>('daraz');

  // Common Inputs
  const [sellingPrice, setSellingPrice] = useState<number>(2499);
  const [supplierCost, setSupplierCost] = useState<number>(1000);
  const [shippingCost, setShippingCost] = useState<number>(250);

  // Daraz Mode Specific Inputs
  const [darazProvince, setDarazProvince] = useState<'punjab' | 'sindh' | 'kpk' | 'balochistan'>('punjab');
  const [darazCommissionRate, setDarazCommissionRate] = useState<number>(13.0); // 13% average category commission
  const [packagingCost, setPackagingCost] = useState<number>(50); // Daraz flyer / bubble wrap
  const [darazReturnRate, setDarazReturnRate] = useState<number>(6); // 6% RTO/Return reserve

  // General Mode Specific Inputs
  const [platformFeeRate, setPlatformFeeRate] = useState<number>(2); // 2%
  const [paymentGatewayFee, setPaymentGatewayFee] = useState<number>(50);
  const [adCostCAC, setAdCostCAC] = useState<number>(350);
  const [returnAllowanceRate, setReturnAllowanceRate] = useState<number>(5); // 5% of order
  const [otherCosts, setOtherCosts] = useState<number>(50);

  const vatRates = {
    punjab: 16,
    sindh: 15,
    kpk: 15,
    balochistan: 15
  };

  const currentVatRate = vatRates[darazProvince];

  useEffect(() => {
    if (selectedProductForModal) {
      setSupplierCost(selectedProductForModal.supplierCostPKR);
      setSellingPrice(selectedProductForModal.recSellingPricePKR);
      setShippingCost(selectedProductForModal.estShippingCostPKR || 220);
    }
  }, [selectedProductForModal]);

  if (!isProfitCalcModalOpen) return null;

  // ===============================================
  // 1. DARAZ PAKISTAN FORMULAS
  // ===============================================
  // Payment Fee = Item Unit Price * 2.25%
  const baseDarazPaymentFee = (sellingPrice * 2.25) / 100;
  // VAT on Payment Fee = Payment Fee * Province VAT %
  const darazPaymentFeeVat = (baseDarazPaymentFee * currentVatRate) / 100;
  // Payment Fee with VAT = Payment Fee + VAT
  const totalDarazPaymentFeeWithVat = baseDarazPaymentFee + darazPaymentFeeVat;

  // Commission Fee & VAT
  const baseDarazCommission = (sellingPrice * darazCommissionRate) / 100;
  const darazCommissionVat = (baseDarazCommission * currentVatRate) / 100;
  const totalDarazCommissionWithVat = baseDarazCommission + darazCommissionVat;

  // Total Daraz deductions
  const totalDarazDeductions = totalDarazPaymentFeeWithVat + totalDarazCommissionWithVat;
  const darazNetBankPayout = sellingPrice - totalDarazDeductions;
  
  // Sourcing + packaging + return reserve
  const darazReturnReservePKR = (darazReturnRate / 100) * 180;
  const totalDarazCost = supplierCost + packagingCost + totalDarazDeductions + darazReturnReservePKR;
  const netDarazProfit = sellingPrice - totalDarazCost;
  const darazProfitMarginPct = sellingPrice > 0 ? (netDarazProfit / sellingPrice) * 100 : 0;
  const darazRoiPct = (supplierCost + packagingCost) > 0 ? (netDarazProfit / (supplierCost + packagingCost)) * 100 : 0;

  // ===============================================
  // 2. GENERAL E-COMMERCE FORMULAS
  // ===============================================
  const generalPlatformFeePKR = (sellingPrice * platformFeeRate) / 100;
  const generalReturnReservePKR = (sellingPrice * returnAllowanceRate) / 100;
  const totalGeneralCostPKR = supplierCost + shippingCost + generalPlatformFeePKR + paymentGatewayFee + adCostCAC + generalReturnReservePKR + otherCosts;
  const netGeneralProfitPKR = sellingPrice - totalGeneralCostPKR;
  const generalProfitMarginPct = sellingPrice > 0 ? (netGeneralProfitPKR / sellingPrice) * 100 : 0;
  const generalRoiPct = totalGeneralCostPKR > 0 ? (netGeneralProfitPKR / totalGeneralCostPKR) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl">Unit Economics & Profit Calculator</h3>
              <p className="text-xs text-slate-400">
                {selectedProductForModal ? selectedProductForModal.name : 'Calculate Daraz fee deductions & net seller payout'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfitCalcModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveMode('daraz')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMode === 'daraz'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Daraz Pakistan (2.25% + VAT)
          </button>
          <button
            onClick={() => setActiveMode('general')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeMode === 'general'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Direct Store / Shopify
          </button>
        </div>

        {/* DARAZ MODE INPUTS */}
        {activeMode === 'daraz' ? (
          <div className="space-y-4 text-xs">
            {/* Province Selection */}
            <div>
              <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-orange-400" /> Seller Registration Province:</span>
                <span className="text-[11px] text-orange-400 font-bold">{currentVatRate}% VAT on Services</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'punjab', name: 'Punjab (16% PRA)', rate: 16 },
                  { id: 'sindh', name: 'Sindh (15% SRB)', rate: 15 },
                  { id: 'kpk', name: 'KPK (15% KPRA)', rate: 15 },
                  { id: 'balochistan', name: 'Balochistan (15%)', rate: 15 }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDarazProvince(p.id as any)}
                    className={`py-2 px-2 text-center rounded-xl border text-[11px] font-bold transition ${
                      darazProvince === p.id
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.name.split(' ')[0]} ({p.rate}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Core Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-300 mb-1 block">Daraz Customer Price (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">Wholesale Sourcing Cost (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    value={supplierCost}
                    onChange={(e) => setSupplierCost(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-300 mb-1 block">Daraz Category Commission (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={darazCommissionRate}
                    onChange={(e) => setDarazCommissionRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">Flyer & Packaging Cost (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                  <input
                    type="number"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Live Daraz Deductions Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex justify-between items-center text-orange-300 font-bold">
                <span>• Payment Fee (2.25% + {currentVatRate}% VAT):</span>
                <span className="font-mono">PKR {totalDarazPaymentFeeWithVat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>• Commission ({darazCommissionRate}% + {currentVatRate}% VAT):</span>
                <span className="font-mono">PKR {totalDarazCommissionWithVat.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-slate-200 font-bold">
                <span>Total Daraz Marketplace Deductions:</span>
                <span className="font-mono text-orange-400 font-extrabold">PKR {totalDarazDeductions.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          /* GENERAL ECOMMERCE INPUTS */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Customer Selling Price (PKR)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Wholesale Supplier Cost (PKR)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                <input
                  type="number"
                  value={supplierCost}
                  onChange={(e) => setSupplierCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Courier Shipping (PKR)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Ad Cost / Estimated CAC (PKR)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">PKR</span>
                <input
                  type="number"
                  value={adCostCAC}
                  onChange={(e) => setAdCostCAC(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Visual Calculation Results Cards */}
        <div className={`bg-gradient-to-br border rounded-3xl p-6 space-y-4 ${
          activeMode === 'daraz'
            ? 'from-orange-950/30 via-slate-950 to-slate-950 border-orange-500/30'
            : 'from-emerald-950/40 via-slate-950 to-slate-950 border-emerald-500/30'
        }`}>
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" /> 
              {activeMode === 'daraz' ? `Daraz Pakistan Summary (${darazProvince.toUpperCase()})` : 'Unit Economics Summary'}
            </span>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                (activeMode === 'daraz' ? netDarazProfit : netGeneralProfitPKR) > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border-red-500/30'
              }`}
            >
              {(activeMode === 'daraz' ? netDarazProfit : netGeneralProfitPKR) > 0 ? 'PROFITABLE SALE' : 'LOSS WARNING'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Net Profit</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">
                PKR {(activeMode === 'daraz' ? netDarazProfit : netGeneralProfitPKR).toFixed(0)}
              </p>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Net Margin</p>
              <p className="text-lg font-black text-white mt-0.5">
                {(activeMode === 'daraz' ? darazProfitMarginPct : generalProfitMarginPct).toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">ROI %</p>
              <p className="text-lg font-black text-teal-400 mt-0.5">
                {(activeMode === 'daraz' ? darazRoiPct : generalRoiPct).toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {activeMode === 'daraz' ? 'Bank Payout' : 'Break-Even'}
              </p>
              <p className="text-lg font-black text-sky-400 mt-0.5">
                PKR {(activeMode === 'daraz' ? darazNetBankPayout : (supplierCost + shippingCost + paymentGatewayFee + adCostCAC)).toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsProfitCalcModalOpen(false)}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl transition border border-slate-700"
        >
          Close Calculator
        </button>
      </div>
    </div>
  );
};
