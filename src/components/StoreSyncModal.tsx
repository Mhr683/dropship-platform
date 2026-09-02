import React, { useState } from 'react';
import {
  Store,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';
import { StoreIntegration } from '../types';

interface StoreSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreIntegration[];
  onToggleStoreConnection: (storeId: string) => void;
  onSyncNow: (storeId: string) => void;
}

export const StoreSyncModal: React.FC<StoreSyncModalProps> = ({
  isOpen,
  onClose,
  stores,
  onToggleStoreConnection,
  onSyncNow,
}) => {
  const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = (storeId: string) => {
    setSyncingStoreId(storeId);
    setTimeout(() => {
      onSyncNow(storeId);
      setSyncingStoreId(null);
    }, 1500);
  };

  const getPlatformIconColor = (platform: string) => {
    switch (platform) {
      case 'Shopify':
        return 'text-emerald-400 bg-emerald-950 border-emerald-800';
      case 'Daraz PK':
        return 'text-amber-400 bg-amber-950 border-amber-800';
      case 'TikTok Shop':
        return 'text-rose-400 bg-rose-950 border-rose-800';
      case 'WooCommerce':
        return 'text-purple-400 bg-purple-950 border-purple-800';
      default:
        return 'text-cyan-400 bg-cyan-950 border-cyan-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Multi-Store Omnichannel Sync</h2>
              <p className="text-xs text-slate-400">
                Synchronize wholesale products, live stock, and automated COD orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {stores.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border font-bold text-sm ${getPlatformIconColor(
                    s.platform
                  )}`}
                >
                  {s.platform[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{s.storeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({s.platform})</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span>
                      Active SKUs: <b className="text-white">{s.activeProductsCount}</b>
                    </span>
                    <span>•</span>
                    <span>Last Sync: {s.lastSync}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {s.connected ? (
                  <>
                    <button
                      onClick={() => handleSync(s.id)}
                      disabled={syncingStoreId === s.id}
                      className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-slate-300 font-semibold border border-slate-700 transition disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 text-cyan-400 ${
                          syncingStoreId === s.id ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Sync</span>
                    </button>
                    <button
                      onClick={() => onToggleStoreConnection(s.id)}
                      className="rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 font-bold hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 transition"
                    >
                      Connected
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onToggleStoreConnection(s.id)}
                    className="rounded-lg bg-slate-800 text-slate-400 border border-slate-700 px-3.5 py-1.5 font-semibold hover:bg-cyan-600 hover:text-white transition"
                  >
                    Connect Store
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-900/50 bg-cyan-950/20 p-4 text-xs text-slate-300 flex items-start gap-3">
          <Zap className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-cyan-300">Automated Webhook Order Ingestion</div>
            <p className="mt-0.5 text-[11px] text-slate-400">
              When a buyer places an order on your connected Shopify or Daraz store, YourMart Global instantly ingests it, runs Profit Guard margin checks, and dispatches via partner logistics.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
