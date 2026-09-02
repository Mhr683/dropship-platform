import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Package,
  Boxes,
  DollarSign,
  Clock,
  ShieldCheck,
  Building,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReturnRequest } from '../types';

export const ReturnsRefundsView: React.FC = () => {
  const { returns, approveReturn, rejectReturn } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const filteredReturns = returns.filter((r) => {
    if (selectedStatusFilter !== 'ALL' && r.status !== selectedStatusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <RotateCcw className="w-3.5 h-3.5" /> Reverse Logistics Hub
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Returns, Replacements & Restocking</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Handle customer COD returns, courier doorstep inspections, automated stock replenishment, and reseller margin adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl">
            {returns.length} Total RMA Cases
          </span>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Under Review</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {returns.filter(r => r.status === 'REQUESTED' || r.status === 'IN_TRANSIT').length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Pending parcel inspection</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Approved & Restocked</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {returns.filter(r => r.status === 'APPROVED' || r.status === 'RESTOCKED').length}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Inventory restored automatically</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Refund Volume</span>
          <p className="text-2xl font-black text-white mt-1">
            PKR {returns.reduce((sum, r) => sum + r.refundAmountPKR, 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Safeguarded via Return Reserve</p>
        </div>
      </div>

      {/* Returns Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-white text-base">RMA Return Requests</h3>
            <p className="text-xs text-slate-400">Manage item inspections and stock updates</p>
          </div>

          <div className="flex gap-2">
            {['ALL', 'REQUESTED', 'APPROVED', 'RESTOCKED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedStatusFilter === st
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Return ID & Order</th>
                <th className="p-4">Product</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Refund Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredReturns.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <span className="font-mono font-bold text-white block">{ret.id}</span>
                    <span className="text-[10px] text-emerald-400">Order #{ret.orderId}</span>
                  </td>

                  <td className="p-4 font-bold text-white">{ret.productName}</td>

                  <td className="p-4">
                    <p className="font-bold text-slate-200">{ret.customerName}</p>
                    <span className="text-[10px] text-slate-400">{ret.city}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-amber-300 font-semibold">{ret.reason}</span>
                  </td>

                  <td className="p-4 font-mono font-bold text-white">
                    PKR {ret.refundAmountPKR.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        ret.status === 'RESTOCKED' || ret.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : ret.status === 'REQUESTED'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-red-500/10 text-red-300 border-red-500/30'
                      }`}
                    >
                      {ret.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {ret.status === 'REQUESTED' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => approveReturn(ret.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition"
                        >
                          Approve & Restock (+1)
                        </button>
                        <button
                          onClick={() => rejectReturn(ret.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {(ret.status === 'APPROVED' || ret.status === 'RESTOCKED') && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Restocked to Warehouse
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
