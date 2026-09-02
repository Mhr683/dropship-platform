import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ProfitGuardConfig } from '../types';
import { evaluateOrderFinancials } from '../utils/profitGuard';

interface ProfitGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProfitGuardConfig;
}

export const ProfitGuardModal: React.FC<ProfitGuardModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  if (!isOpen) return null;

  // Simulator inputs
  const [sellingPrice, setSellingPrice] = useState<number>(2000);
  const [supplierCost, setSupplierCost] = useState<number>(1200);
  const [shippingCost, setShippingCost] = useState<number>(config.defaultShippingCostPKR || 250);
  const [processingFee, setProcessingFee] = useState<number>(config.processingFeePKR || 30);
  const [platformFeePct, setPlatformFeePct] = useState<number>(config.platformFeePct || 2.0);

  // Evaluate using the strict financial formula:
  // Selling Price - (Supplier Cost + 30 Rs Processing + Delivery Fee + 2% Platform Fee)
  const result = evaluateOrderFinancials(
    {
      sellingPricePKR: sellingPrice,
      supplierCostPKR: supplierCost,
      shippingCostPKR: shippingCost,
      processingFeePKR: processingFee,
      platformFeePct: platformFeePct,
    },
    config
  );

  const { financials } = result;

  const costBreakdownItems = [
    { label: 'Supplier Cost', amount: financials.supplierCostPKR, color: 'bg-amber-400' },
    { label: 'Rs. 30 Processing', amount: financials.processingFeePKR, color: 'bg-amber-600' },
    { label: 'Courier Delivery', amount: financials.shippingCostPKR, color: 'bg-blue-400' },
    { label: '2% Platform Fee', amount: financials.platformFeePKR, color: 'bg-purple-400' },
    {
      label: 'Reseller Net Profit',
      amount: Math.max(0, financials.resellerNetProfitPKR),
      color: financials.resellerNetProfitPKR > 0 ? 'bg-emerald-400' : 'bg-rose-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-950">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Profit Guard™ Risk Engine Sandbox</h2>
              <p className="text-xs text-slate-400">
                Automated loss prevention formula: Retail − (Supplier Cost + Rs. 30 + Courier + 2% Platform)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Live Safety Evaluation Verdict Card */}
        <div className="mt-5">
          <div
            className={`rounded-2xl p-5 border shadow-lg transition-all ${
              result.approved
                ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900'
                : 'border-rose-500/60 bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    result.approved
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {result.approved ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <XCircle className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        result.approved
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {result.approved ? 'MARGIN APPROVED' : 'MARGIN BLOCKED'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Net Profit: PKR {financials.resellerNetProfitPKR.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 font-medium">{result.reason}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  Net Profit Margin
                </div>
                <div
                  className={`text-2xl font-bold font-mono ${
                    result.approved ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {financials.profitMarginPct.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Visual Margin Stack Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400">
                Deductions Breakdown:
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-950 ring-1 ring-slate-800">
                {costBreakdownItems.map((item, idx) => {
                  const widthPct =
                    financials.sellingPricePKR > 0
                      ? Math.min(100, (item.amount / financials.sellingPricePKR) * 100)
                      : 0;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${widthPct}%` }}
                      className={`${item.color} h-full transition-all`}
                      title={`${item.label}: PKR ${item.amount.toFixed(0)} (${widthPct.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-400">
                {costBreakdownItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span>{item.label}: PKR {item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls Form */}
        <div className="mt-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Selling Price */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300">Customer Selling Price (PKR)</label>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  PKR {sellingPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="50"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Supplier Wholesale Cost */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300">Supplier Wholesale Cost (PKR)</label>
                <span className="font-mono text-xs font-bold text-amber-300">
                  PKR {supplierCost.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="8000"
                step="50"
                value={supplierCost}
                onChange={(e) => setSupplierCost(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <input
                type="number"
                value={supplierCost}
                onChange={(e) => setSupplierCost(Number(e.target.value))}
                className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-mono font-bold text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Flat Processing Fee */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300">Flat Processing Fee (PKR)</label>
                <span className="font-mono text-xs font-bold text-amber-400">
                  PKR {processingFee}
                </span>
              </div>
              <input
                type="number"
                value={processingFee}
                onChange={(e) => setProcessingFee(Number(e.target.value))}
                className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-mono font-bold text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Courier Delivery Fee */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300">Courier Delivery Fee (PKR)</label>
                <span className="font-mono text-xs text-blue-300">
                  PKR {shippingCost}
                </span>
              </div>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2% Platform Fee slider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-200">Platform Commission Rate (%)</div>
              <div className="text-[11px] text-slate-400">
                Calculated on Selling Price: PKR {financials.platformFeePKR.toLocaleString()} ({platformFeePct}%)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={platformFeePct}
                onChange={(e) => setPlatformFeePct(Number(e.target.value))}
                className="w-24 accent-purple-500"
              />
              <span className="font-mono font-bold text-purple-300">{platformFeePct}%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-[11px] text-slate-500">
            Formula: Net Profit = Selling Price − (Supplier Cost + Rs. 30 + Delivery + 2% Platform)
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
