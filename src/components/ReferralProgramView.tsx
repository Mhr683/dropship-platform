import React, { useState } from 'react';
import {
  Users,
  Copy,
  CheckCircle2,
  DollarSign,
  Share2,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

export const ReferralProgramView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://yourmart.pk/register?ref=YM-PRIME-99';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" /> Affiliate & Partner Growth
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Reseller Referral Program</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Invite fellow e-commerce resellers and earn a recurring 0.5% commission on all their fulfilled wholesale orders.
          </p>
        </div>
      </div>

      {/* REFERRAL LINK CARD */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/50 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase text-emerald-300">Your Exclusive Invitation Link</span>
          <h3 className="text-xl font-extrabold text-white mt-1">
            Share YourMart with Dropshippers & Wholesale Buyers
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            When your referred store signs up and books COD orders, commission is credited to your master wallet automatically on delivery.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-mono text-xs flex items-center justify-between">
            <span className="truncate">{referralLink}</span>
          </div>

          <button
            onClick={handleCopy}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Invite Link'}</span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Referred Merchants</span>
            <p className="text-2xl font-black text-white mt-0.5">18 Stores</p>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Orders Dispatched</span>
            <p className="text-2xl font-black text-white mt-0.5">432 Delivered</p>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Lifetime Affiliate Bonus</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">PKR 34,560</p>
          </div>
        </div>
      </div>
    </div>
  );
};
