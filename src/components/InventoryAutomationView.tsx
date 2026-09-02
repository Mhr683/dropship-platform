import React, { useState } from 'react';
import {
  Boxes,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Package,
  TrendingDown,
  Building2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InventoryAutomationView: React.FC = () => {
  const { products, updateProductStock, updateProductCost, suppliers } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold || p.status === 'LOW_STOCK');

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncMessage('Connecting to Karachi & Lahore warehouse EDI feeds...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('Sync complete! All 6 supplier warehouses updated. 0 critical stock breaks.');
      setTimeout(() => setSyncMessage(null), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Boxes className="w-3.5 h-3.5" /> Automated Warehouse Sync
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Inventory & Stock Automation</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time warehouse stock counts, auto-delist zero-stock items on connected Shopify stores, and track wholesale price changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Feeds...' : 'Sync Supplier Feeds Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Tracked SKUs</span>
          <p className="text-2xl font-black text-white mt-1">{products.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1">100% automated stock sync</p>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-amber-300 uppercase">Low Stock Alerts</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{lowStockItems.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Below safety reorder threshold</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Connected Warehouses</span>
          <p className="text-2xl font-black text-white mt-1">{suppliers.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Karachi, Lahore & Rawalpindi</p>
        </div>
      </div>

      {/* Stock Management Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-white text-base">Warehouse Stock & Rate Ledger</h3>
            <p className="text-xs text-slate-400">Live quantity adjustments and wholesale base rates</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Auto-Sync 5m Interval
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Product & SKU</th>
                <th className="p-4">Supplier Warehouse</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Wholesale Cost (PKR)</th>
                <th className="p-4">Suggested Retail</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {products.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs line-clamp-1">{p.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-200">{p.supplierName}</p>
                      <span className="text-[10px] text-slate-500">Warehouse Hub</span>
                    </td>

                    <td className="p-4">
                      <span className={`font-mono text-sm font-extrabold ${isLow ? 'text-red-400' : 'text-white'}`}>
                        {p.stock} units
                      </span>
                      <span className="text-[10px] text-slate-500 block">Threshold: {p.lowStockThreshold}</span>
                    </td>

                    <td className="p-4 font-mono font-bold text-white">
                      PKR {p.supplierCostPKR.toLocaleString()}
                    </td>

                    <td className="p-4 font-mono font-bold text-emerald-400">
                      PKR {p.recSellingPricePKR.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          isLow
                            ? 'bg-red-500/10 text-red-300 border-red-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {isLow ? 'LOW STOCK' : 'HEALTHY'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 50)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
                          title="Restock 50 units"
                        >
                          +50 Stock
                        </button>
                        <button
                          onClick={() => {
                            const newRate = prompt(`Enter new wholesale cost for ${p.name}:`, String(p.supplierCostPKR));
                            if (newRate && !isNaN(Number(newRate))) {
                              updateProductCost(p.id, Number(newRate));
                            }
                          }}
                          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-emerald-500/30 transition"
                        >
                          Update Rate
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
