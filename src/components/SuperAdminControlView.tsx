import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  DollarSign,
  Users,
  Building,
  Key,
  Database,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Wallet
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SuperAdminControlView: React.FC = () => {
  const {
    masterWalletBalancePKR,
    orders,
    products,
    suppliers,
    payoutRequests,
    approvePayout,
    rejectPayout
  } = useApp();

  const [platformTakeRate, setPlatformTakeRate] = useState<number>(2.0);
  const [minPayoutThreshold, setMinPayoutThreshold] = useState<number>(1000);
  const [autoApproveVerified, setAutoApproveVerified] = useState<boolean>(true);

  const pendingPayouts = payoutRequests.filter(p => p.status === 'REQUESTED' || p.status === 'UNDER_REVIEW');
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const totalPlatformFeesCollected = deliveredOrders.reduce((sum, o) => sum + o.platformFeePKR, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
              <Lock className="w-3.5 h-3.5" /> Confidential Super Admin HQ
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Platform <span className="text-indigo-400">Control Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Global oversight of Master Wallet balances, 2% platform transaction revenue, wholesale supplier margins, and reseller payout clearance.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4 text-center">
            <p className="text-xs uppercase font-bold text-slate-400">Master Platform Take (2%)</p>
            <p className="text-2xl font-black text-indigo-400 mt-0.5">PKR {masterWalletBalancePKR.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* EXECUTIVE KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Gross Platform Volume</span>
          <p className="text-xl font-black text-white mt-1">
            PKR {orders.reduce((sum, o) => sum + o.sellingPricePKR, 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">{orders.length} total customer bookings</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Realized 2% Revenue</span>
          <p className="text-xl font-black text-emerald-400 mt-1">
            PKR {totalPlatformFeesCollected.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">From completed deliveries</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Payout Batch</span>
          <p className="text-xl font-black text-amber-400 mt-1">{pendingPayouts.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            PKR {pendingPayouts.reduce((sum, p) => sum + p.amountPKR, 0).toLocaleString()} total
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Wholesale Vendors</span>
          <p className="text-xl font-black text-indigo-400 mt-1">{suppliers.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">100% verified settlement accounts</p>
        </div>
      </div>

      {/* GLOBAL POLICY CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-white text-base">Platform Revenue & Payout Policies</h3>
          <span className="text-xs text-emerald-400 font-bold">Auto-Enforcing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 mb-1 block">Default Platform Take Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={platformTakeRate}
              onChange={(e) => setPlatformTakeRate(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">Minimum Reseller Withdrawal (PKR)</label>
            <input
              type="number"
              value={minPayoutThreshold}
              onChange={(e) => setMinPayoutThreshold(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-bold text-slate-300">Auto-Approve Bank Payouts</span>
            <input
              type="checkbox"
              checked={autoApproveVerified}
              onChange={(e) => setAutoApproveVerified(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
            />
          </div>
        </div>
      </div>

      {/* PENDING PAYOUT APPROVALS LEDGER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-white text-base">Pending Reseller & Vendor Payout Approvals</h3>
            <p className="text-xs text-slate-400">1-click direct remittance clearance</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Partner Name</th>
                <th className="p-4">Amount (PKR)</th>
                <th className="p-4">Payout Destination</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Approve / Reject</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {pendingPayouts.length > 0 ? (
                pendingPayouts.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white">{req.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{req.userName}</p>
                      <span className="text-[10px] text-slate-400">{req.userRole}</span>
                    </td>
                    <td className="p-4 font-mono font-extrabold text-emerald-400 text-sm">
                      PKR {req.amountPKR.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-[11px]">{req.accountDetails}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => approvePayout(req.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition"
                        >
                          Approve Payout
                        </button>
                        <button
                          onClick={() => rejectPayout(req.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-red-500/20 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No pending payout approvals in queue. All cleared!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
