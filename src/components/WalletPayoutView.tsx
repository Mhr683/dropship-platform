import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  DollarSign,
  Building,
  CreditCard,
  Plus,
  ShieldCheck,
  Send,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PayoutRequest } from '../types';

export const WalletPayoutView: React.FC = () => {
  const {
    activeRole,
    masterWalletBalancePKR,
    resellerAvailableBalancePKR,
    resellerPendingBalancePKR,
    payoutRequests,
    requestPayout,
    approvePayout,
    rejectPayout
  } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [bankMethod, setBankMethod] = useState<'BANK' | 'JAZZCASH' | 'EASYPAISA'>('BANK');
  const [accountTitle, setAccountTitle] = useState('Shahmeer Khan');
  const [accountNumber, setAccountNumber] = useState('PK92MEZN000123456789');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > resellerAvailableBalancePKR) {
      alert('Withdrawal amount must be less than or equal to available balance.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq: PayoutRequest = {
        id: `payout-${Date.now()}`,
        userId: 'usr-reseller-1',
        userName: 'Prime Dropshippers PK',
        userRole: 'RESELLER',
        amountPKR: withdrawAmount,
        paymentMethod: bankMethod,
        accountDetails: `${bankMethod}: ${accountTitle} (${accountNumber})`,
        status: 'REQUESTED',
        createdAt: new Date().toISOString()
      };

      requestPayout(newReq);
      setIsSubmitting(false);
      setSuccessMsg(`Payout request for PKR ${withdrawAmount.toLocaleString()} submitted successfully!`);
      setTimeout(() => setSuccessMsg(null), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Wallet className="w-3.5 h-3.5" /> PKR Financial Ledger
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Wallet & Payout Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic COD remittance processing, reseller profit margin realization, and direct bank/JazzCash payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-xl">
            T+1 Rapid Settlement Enabled
          </span>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {successMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* WALLET METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold uppercase text-emerald-300">Available For Withdrawal</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            PKR {resellerAvailableBalancePKR.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold">
            Cleared from delivered COD orders
          </p>
        </div>

        {/* Pending Clearance (In Transit) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Clearance</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400">
            PKR {resellerPendingBalancePKR.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            Locked in active in-transit parcels
          </p>
        </div>

        {/* Master Wallet Platform 2% Take (Visible to Admins / Info) */}
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase text-indigo-300">Master Platform Take (2%)</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-300">
            PKR {masterWalletBalancePKR.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            Platform processing commission reserve
          </p>
        </div>
      </div>

      {/* WITHDRAWAL REQUEST FORM & PAYOUT LEDGER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Payout Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base">Request Profit Payout</h3>
            <p className="text-xs text-slate-400">Withdraw cleared profit into your Pakistani bank account</p>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Payout Amount (PKR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">PKR</span>
                <input
                  type="number"
                  required
                  min="1000"
                  max={resellerAvailableBalancePKR}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Min. withdrawal: PKR 1,000</span>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Transfer Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['BANK', 'JAZZCASH', 'EASYPAISA'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setBankMethod(m)}
                    className={`py-2 rounded-xl font-bold text-xs border transition ${
                      bankMethod === m
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Account Title</label>
              <input
                type="text"
                required
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">IBAN / Account / Phone Number</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || resellerAvailableBalancePKR <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Payout Request'}</span>
            </button>
          </form>
        </div>

        {/* Payout History Ledger */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-white text-base">Payout Request Ledger</h3>
              <p className="text-xs text-slate-400">Withdrawal history and audit status</p>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Request ID & Date</th>
                  <th className="p-4">Partner</th>
                  <th className="p-4">Amount (PKR)</th>
                  <th className="p-4">Destination Account</th>
                  <th className="p-4">Status</th>
                  {(activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN' || activeRole === 'FINANCE_STAFF') && (
                    <th className="p-4 text-right">Admin Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {payoutRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <span className="font-mono font-bold text-white block">{req.id}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">{req.userName}</p>
                      <span className="text-[10px] text-slate-400">{req.userRole}</span>
                    </td>

                    <td className="p-4 font-mono font-extrabold text-emerald-400 text-sm">
                      PKR {req.amountPKR.toLocaleString()}
                    </td>

                    <td className="p-4 text-[11px] text-slate-300 font-mono">
                      {req.accountDetails}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          req.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : req.status === 'UNDER_REVIEW'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : req.status === 'REQUESTED'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {(activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN' || activeRole === 'FINANCE_STAFF') && (
                      <td className="p-4 text-right">
                        {req.status === 'REQUESTED' || req.status === 'UNDER_REVIEW' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approvePayout(req.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition"
                            >
                              Approve & Pay
                            </button>
                            <button
                              onClick={() => rejectPayout(req.id)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] px-2 py-1 rounded-lg border border-red-500/20 transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold">Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
