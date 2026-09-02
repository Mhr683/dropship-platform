import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Package,
  Clock,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Supplier } from '../types';

export const MultiSupplierView: React.FC = () => {
  const { suppliers, addSupplier, products } = useApp();

  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierCity, setNewSupplierCity] = useState('Karachi');
  const [newSupplierPhone, setNewSupplierPhone] = useState('+92 300 1234567');
  const [newSupplierEmail, setNewSupplierEmail] = useState('vendor@yourmart.pk');

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName) return;

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupplierName,
      contactPerson: 'Operations Lead',
      phone: newSupplierPhone,
      email: newSupplierEmail,
      city: newSupplierCity,
      address: `Wholesale Market Hub, ${newSupplierCity}`,
      rating: 4.8,
      totalProducts: 0,
      fulfilledOrdersCount: 0,
      isVerified: true,
      returnRate: 2.1,
      bankDetails: {
        bankName: 'Meezan Bank',
        accountTitle: newSupplierName,
        accountNumber: 'PK92MEZN000123456789'
      }
    };

    addSupplier(newSup);
    setIsAddSupplierModalOpen(false);
    setNewSupplierName('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Direct Vendor Partnerships
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Wholesale Supplier Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-vetted Pakistan wholesalers in Karachi (Bolton Market, Shershah), Lahore (Shah Alam Market), and Rawalpindi.
          </p>
        </div>

        <button
          onClick={() => setIsAddSupplierModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Supplier</span>
        </button>
      </div>

      {/* SUPPLIERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => {
          const supplierProducts = products.filter(p => p.supplierId === supplier.id);

          return (
            <div
              key={supplier.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4 transition flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {supplier.logo ? (
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/30 bg-slate-950 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/20">
                        {supplier.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition">
                        {supplier.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {supplier.city}, Pakistan
                      </p>
                    </div>
                  </div>

                  {supplier.isVerified && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                {/* Rating & Stats */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 rounded-2xl p-3 border border-slate-800 text-center text-xs mb-3">
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase font-bold block">Rating</span>
                    <span className="font-black text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {supplier.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase font-bold block">Catalog</span>
                    <span className="font-black text-white mt-0.5 block">{supplierProducts.length} SKUs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase font-bold block">Return Rate</span>
                    <span className="font-black text-emerald-400 mt-0.5 block">{supplier.returnRate}%</span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono">{supplier.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{supplier.email}</span>
                  </p>
                </div>
              </div>

              {/* Settlement Bank Details */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="text-slate-500 font-bold block mb-0.5 uppercase text-[9px]">Verified Payout Account:</span>
                <span className="text-slate-300 font-mono">{supplier.bankDetails.bankName} • {supplier.bankDetails.accountTitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ONBOARD SUPPLIER */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Onboard Wholesale Vendor</h3>
            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 mb-1 block">Supplier Business Name</label>
                <input
                  type="text"
                  required
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder="e.g. Al-Madina Traders"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">Warehouse City</label>
                <select
                  value={newSupplierCity}
                  onChange={(e) => setNewSupplierCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Karachi">Karachi (Bolton / Shershah)</option>
                  <option value="Lahore">Lahore (Shah Alam / Hall Road)</option>
                  <option value="Rawalpindi">Rawalpindi (Raja Bazaar)</option>
                  <option value="Faisalabad">Faisalabad (Textile Hub)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">Contact Phone (WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={newSupplierPhone}
                  onChange={(e) => setNewSupplierPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl"
                >
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
