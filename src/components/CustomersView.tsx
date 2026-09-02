import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShieldCheck,
  DollarSign,
  MessageSquare,
  ShoppingBag,
  ExternalLink,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomersView: React.FC = () => {
  const { customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" /> Customer Intelligence CRM
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Customer CRM & Trust Scoring</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track COD customer delivery history, verify phone numbers, calculate return risk scores, and prevent fraudulent bookings.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, city..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Customer Name & ID</th>
                <th className="p-4">Phone & City</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Order History</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Return Rate</th>
                <th className="p-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <p className="font-bold text-white text-xs">{c.name}</p>
                    <span className="font-mono text-[10px] text-slate-500">{c.id}</span>
                  </td>

                  <td className="p-4">
                    <p className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {c.phone}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" /> {c.city}, Pakistan
                    </p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                        c.trustScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : c.trustScore >= 50
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" /> {c.trustScore}/100 Trust
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-white">{c.ordersCount} Orders</span>
                    <span className="text-[10px] text-slate-500 block">{c.deliveredOrdersCount} Delivered</span>
                  </td>

                  <td className="p-4 font-mono font-bold text-emerald-400">
                    PKR {c.totalSpentPKR.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className={`font-bold ${c.returnedOrdersCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {c.returnedOrdersCount} Returns
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 inline-flex items-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
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
