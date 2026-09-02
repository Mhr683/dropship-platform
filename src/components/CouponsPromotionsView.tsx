import React, { useState } from 'react';
import {
  Tag,
  Plus,
  CheckCircle2,
  Percent,
  Calendar,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

export const CouponsPromotionsView: React.FC = () => {
  const [promos, setPromos] = useState<PromoCode[]>([
    { id: '1', code: 'EIDSPECIAL10', discountType: 'PERCENT', discountValue: 10, minOrderValue: 2000, usageCount: 142, maxUsage: 500, isActive: true },
    { id: '2', code: 'FREESHIPPK', discountType: 'FIXED', discountValue: 220, minOrderValue: 3000, usageCount: 89, maxUsage: 200, isActive: true },
    { id: '3', code: 'RESELLERVIP', discountType: 'PERCENT', discountValue: 15, minOrderValue: 5000, usageCount: 34, maxUsage: 100, isActive: true }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState(10);
  const [newType, setNewType] = useState<'PERCENT' | 'FIXED'>('PERCENT');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    setPromos([
      {
        id: Date.now().toString(),
        code: newCode.toUpperCase(),
        discountType: newType,
        discountValue: newValue,
        minOrderValue: 1500,
        usageCount: 0,
        maxUsage: 100,
        isActive: true
      },
      ...promos
    ]);

    setIsModalOpen(false);
    setNewCode('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Tag className="w-3.5 h-3.5" /> Promotion & Discount Engine
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Coupons & Reseller Incentives</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create custom coupon vouchers to incentivize bulk dropshipping orders and store flash sales.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo Voucher</span>
        </button>
      </div>

      {/* PROMOS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {p.discountType === 'PERCENT' ? `${p.discountValue}% OFF` : `PKR ${p.discountValue} OFF`}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 border border-dashed border-slate-800 text-center my-3">
                <span className="font-mono text-lg font-black text-white tracking-wider">
                  {p.code}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Min. Order Threshold:</span>
                  <span className="text-slate-200 font-bold">PKR {p.minOrderValue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Usage Redemption:</span>
                  <span className="text-emerald-400 font-bold">{p.usageCount} / {p.maxUsage} used</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(p.usageCount / p.maxUsage) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create Promo Code</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 mb-1 block">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MEGA2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 mb-1 block">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Flat PKR (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 mb-1 block">Value</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
