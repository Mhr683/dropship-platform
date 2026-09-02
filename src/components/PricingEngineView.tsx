import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Zap,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PricingRule } from '../types';

export const PricingEngineView: React.FC = () => {
  const { pricingRules, updatePricingRule, calculateSmartSellingPrice } = useApp();

  const [testCostPKR, setTestCostPKR] = useState<number>(1200);

  // Computed test price
  const computedPreview = calculateSmartSellingPrice(testCostPKR, 'CAT-ELEC');
  const computedMarginPKR = computedPreview - testCostPKR;
  const computedMarginPct = Math.round((computedMarginPKR / computedPreview) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Sliders className="w-3.5 h-3.5" /> Automated Margin Automation
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Smart Pricing & Profit Guard Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure algorithmic markup rules, psychological .99 price endings, and fail-safe loss protection across all wholesale listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Profit Guard 100% Active
          </span>
        </div>
      </div>

      {/* LIVE SIMULATION PREVIEW BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Live Algorithmic Price Simulator
          </h3>
          <span className="text-xs text-slate-400">Tests active rules & psychological rounding in real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1 block">Enter Test Supplier Wholesale Cost:</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">PKR</span>
              <input
                type="number"
                value={testCostPKR}
                onChange={(e) => setTestCostPKR(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Algorithmic Retail Price</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">PKR {computedPreview.toLocaleString()}</p>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Protected Net Margin</p>
            <p className="text-xl font-black text-white mt-0.5">
              +PKR {computedMarginPKR.toLocaleString()} ({computedMarginPct}%)
            </p>
          </div>
        </div>
      </div>

      {/* PRICING RULES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingRules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-slate-900 border rounded-3xl p-6 shadow-xl space-y-5 transition ${
              rule.isActive ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
            }`}
          >
            {/* Rule Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {rule.targetCategory} Category Rule
                </span>
                <h4 className="font-extrabold text-white text-base mt-1.5">{rule.name}</h4>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.isActive}
                  onChange={(e) => updatePricingRule(rule.id, { isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Rule Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Strategy Type */}
              <div>
                <label className="text-slate-400 font-bold mb-1 block">Markup Strategy</label>
                <select
                  value={rule.strategy}
                  onChange={(e) => updatePricingRule(rule.id, { strategy: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="PERCENTAGE_MARGIN">Percentage Margin (%)</option>
                  <option value="FIXED_MARKUP">Fixed Cash Markup (PKR)</option>
                  <option value="COMPETITOR_BASED">Dynamic Competitor Matching</option>
                  <option value="TIERED_COST">Tiered Cost Brackets</option>
                </select>
              </div>

              {/* Strategy Value */}
              <div>
                <label className="text-slate-400 font-bold mb-1 block">
                  {rule.strategy === 'PERCENTAGE_MARGIN' ? 'Percentage Margin Rate (%)' : 'Markup Amount (PKR)'}
                </label>
                <input
                  type="number"
                  value={rule.strategy === 'PERCENTAGE_MARGIN' ? rule.marginPercentage : rule.fixedMarkupPKR}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (rule.strategy === 'PERCENTAGE_MARGIN') {
                      updatePricingRule(rule.id, { marginPercentage: val });
                    } else {
                      updatePricingRule(rule.id, { fixedMarkupPKR: val });
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Minimum Profit Guard */}
              <div>
                <label className="text-slate-400 font-bold mb-1 block">Minimum Profit Floor (PKR)</label>
                <input
                  type="number"
                  value={rule.minProfitPKR}
                  onChange={(e) => updatePricingRule(rule.id, { minProfitPKR: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Rounding Rule */}
              <div>
                <label className="text-slate-400 font-bold mb-1 block">Price Rounding</label>
                <select
                  value={rule.roundToNearest}
                  onChange={(e) => updatePricingRule(rule.id, { roundToNearest: Number(e.target.value) as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value={10}>Round to Nearest 10</option>
                  <option value={50}>Round to Nearest 50</option>
                  <option value={100}>Round to Nearest 100</option>
                </select>
              </div>
            </div>

            {/* Toggles: Psychological Pricing & Profit Guard */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Psychological .99 Price Ending (e.g. 2,499 vs 2,500)</span>
                </div>
                <input
                  type="checkbox"
                  checked={rule.usePsychologicalPricing}
                  onChange={(e) => updatePricingRule(rule.id, { usePsychologicalPricing: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Profit Guard Loss Protection (Never sell below base + platform fee)</span>
                </div>
                <input
                  type="checkbox"
                  checked={rule.profitGuardActive}
                  onChange={(e) => updatePricingRule(rule.id, { profitGuardActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
