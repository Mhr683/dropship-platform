import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  DollarSign,
  Truck,
  RotateCcw,
  Building2,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrustPolicyModal: React.FC = () => {
  const { isTrustPolicyModalOpen, setIsTrustPolicyModalOpen } = useApp();

  if (!isTrustPolicyModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">Trust, Security & Settlement Policies</h3>
              <p className="text-xs text-slate-400">Guaranteed wholesale commerce protocols in Pakistan</p>
            </div>
          </div>
          <button
            onClick={() => setIsTrustPolicyModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Highlights */}
        <div className="space-y-4 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Wholesaler Verification (KYB)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Every supplier warehouse listed in YourMart undergoes physical spot-checks in Bolton Market Karachi, Shah Alam Lahore, and Raja Bazaar Rawalpindi before stock goes live.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-extrabold">
              <DollarSign className="w-4 h-4" />
              <span>T+1 Cash on Delivery Remittance</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Upon successful rider delivery confirmation from PostEx/TCS, your reseller profit margin is immediately unlocked in PKR with instant bank or JazzCash payouts.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold">
              <RotateCcw className="w-4 h-4" />
              <span>7-Day Return & Restocking Protection</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Defective or incorrect items returned during doorstep courier delivery are absorbed via YourMart Return Reserve with 0 loss to verified resellers.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold">
              <Lock className="w-4 h-4" />
              <span>Role-Based Data Privacy (RBAC)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Reseller profit margins, customer phone numbers, and supplier base rates are cryptographically guarded. Suppliers cannot bypass resellers to contact end consumers.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsTrustPolicyModalOpen(false)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
};
