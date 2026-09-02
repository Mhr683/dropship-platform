import React, { useState } from 'react';
import {
  Store,
  Plus,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Boxes,
  Sliders,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoreIntegration } from '../types';

export const MultiStoreSyncView: React.FC = () => {
  const { stores, addStore, syncStoreOrders } = useApp();

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storePlatform, setStorePlatform] = useState<'SHOPIFY' | 'WOOCOMMERCE' | 'DARAZ' | 'CUSTOM_API'>('SHOPIFY');
  const [storeUrl, setStoreUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null);

  const handleConnectStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeUrl) return;

    const newStore: StoreIntegration = {
      id: `store-${Date.now()}`,
      name: storeName,
      platform: storePlatform,
      url: storeUrl,
      apiKey: apiKey || 'shpat_live_demo_key_9938',
      isActive: true,
      lastSyncedAt: new Date().toISOString(),
      syncedProductsCount: 12,
      syncedOrdersCount: 24,
      autoSyncInventory: true,
      autoPushOrders: true
    };

    addStore(newStore);
    setIsConnectModalOpen(false);
    setStoreName('');
    setStoreUrl('');
  };

  const handleSyncNow = (storeId: string) => {
    setSyncingStoreId(storeId);
    setTimeout(() => {
      syncStoreOrders(storeId);
      setSyncingStoreId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" /> Omnichannel E-Commerce Sync
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Multi-Store Integration Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect your Shopify, WooCommerce, and Daraz stores to automatically fetch customer COD orders and synchronize wholesale warehouse inventory.
          </p>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Store</span>
        </button>
      </div>

      {/* CONNECTED STORES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-5 transition flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-500/20">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition">
                      {store.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3 text-slate-500" /> {store.url}
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {store.platform} Active
                </span>
              </div>

              {/* Sync Stats */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 text-xs mb-3">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Imported Orders:</span>
                  <p className="font-black text-white text-sm mt-0.5">{store.syncedOrdersCount} Orders</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Published SKUs:</span>
                  <p className="font-black text-emerald-400 text-sm mt-0.5">{store.syncedProductsCount} Products</p>
                </div>
              </div>

              {/* Status Row */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Inventory Auto-Delist:</span>
                  <span className="text-emerald-400 font-bold">Enabled (Zero Stock Safeguard)</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Automated Sync:</span>
                  <span className="text-slate-300 font-mono">
                    {new Date(store.lastSyncedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => handleSyncNow(store.id)}
                disabled={syncingStoreId === store.id}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingStoreId === store.id ? 'animate-spin' : ''}`} />
                <span>{syncingStoreId === store.id ? 'Fetching New Orders...' : 'Sync Orders & Inventory'}</span>
              </button>

              <a
                href={`https://${store.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                title="Visit Live Store"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* CONNECT STORE MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Connect Online Store</h3>
            <form onSubmit={handleConnectStore} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 mb-1 block">Store Display Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. TrendyTrends PK"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">Platform</label>
                <select
                  value={storePlatform}
                  onChange={(e) => setStorePlatform(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="SHOPIFY">Shopify Store</option>
                  <option value="WOOCOMMERCE">WooCommerce (WordPress)</option>
                  <option value="DARAZ">Daraz Seller Center</option>
                  <option value="CUSTOM_API">Custom Webhook / REST API</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">Store Domain / URL</label>
                <input
                  type="text"
                  required
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="e.g. myshopify.com or brand.pk"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 block">API Access Token / Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="shpat_••••••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl"
                >
                  Connect & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
