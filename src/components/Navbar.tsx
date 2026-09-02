import React from 'react';
import {
  ShieldCheck,
  Wallet,
  Store,
  Sliders,
  RefreshCw,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Shield,
  LogOut,
  Sparkles,
  KeyRound,
  History,
  Headphones,
  PhoneCall,
  Calculator,
} from 'lucide-react';
import { User, UserRole, ProfitGuardConfig, StoreIntegration } from '../types';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  profitGuardConfig: ProfitGuardConfig;
  onOpenProfitGuardModal: () => void;
  onOpenStoreSyncModal: () => void;
  onOpenWalletModal: () => void;
  onOpenHelplinesModal: () => void;
  stores: StoreIntegration[];
  pendingOrdersCount: number;
  isAdminAuthenticated: boolean;
  onOpenAdminAuth: () => void;
  onLockAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeTab,
  onSelectTab,
  profitGuardConfig,
  onOpenProfitGuardModal,
  onOpenStoreSyncModal,
  onOpenWalletModal,
  onOpenHelplinesModal,
  stores,
  pendingOrdersCount,
  isAdminAuthenticated,
  onOpenAdminAuth,
  onLockAdmin,
}) => {
  const connectedStoresCount = stores.filter((s) => s.connected).length;

  // Filter regular personas (Exclude admin from casual click list)
  const regularUsers = allUsers.filter((u) => u.role !== 'ADMIN');

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'SUPPLIER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'RESELLER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'CUSTOMER':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      {/* Top Banner: Status & Quick Controls */}
      <div className="border-b border-slate-800/80 bg-slate-950/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>B2B CORE ENGINE ONLINE</span>
            </div>
            <span className="hidden text-slate-600 sm:inline">|</span>
            <button
              onClick={onOpenProfitGuardModal}
              className="flex items-center gap-1.5 rounded bg-slate-800/80 px-2 py-0.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Profit Guard:</span>
              <span className="font-semibold text-emerald-400">
                Active (Min PKR {profitGuardConfig.minProfitAmountPKR})
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenStoreSyncModal}
              className="flex items-center gap-1.5 text-slate-300 transition hover:text-white"
            >
              <Store className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Multi-Store Sync:</span>
              <span className="rounded-full bg-cyan-950 px-1.5 py-0.2 font-semibold text-cyan-300 border border-cyan-800">
                {connectedStoresCount} Live
              </span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Currency: <b className="text-slate-200">PKR (Rs.)</b>
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 font-bold text-white shadow-lg shadow-emerald-950">
            <span className="text-lg font-black tracking-tight font-mono">YM</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                YourMart<span className="text-emerald-400">Global</span>
              </span>
              <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 border border-emerald-800/60">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Wholesale, Reseller & COD Payout Engine</p>
          </div>
        </div>

        {/* Regular Role Switching Selector */}
        <div className="hidden lg:flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-1">
          <span className="px-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Active Persona:
          </span>
          {regularUsers.map((u) => {
            const isSelected = currentUser.id === u.id && !isAdminAuthenticated;
            return (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-700"
                />
                <span className="max-w-[100px] truncate">{u.name.split(' ')[0]}</span>
                <span
                  className={`rounded px-1 py-0.2 text-[9px] font-bold uppercase border ${getRoleBadge(
                    u.role
                  )}`}
                >
                  {u.role}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Action Items & Dedicated Secure Admin Gateway */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Helplines Quick Access Button */}
          <button
            onClick={onOpenHelplinesModal}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900/90 hover:bg-emerald-950/40 px-3 py-1.5 transition-colors text-emerald-400 group cursor-pointer"
            title="Helplines for Buyers, Resellers & Manufacturers"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition">
              <Headphones className="h-3.5 w-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Helplines</div>
              <div className="text-xs font-bold text-emerald-300">
                3 Helplines
              </div>
            </div>
          </button>

          {/* Wallet Balance Pill */}
          {currentUser.role !== 'CUSTOMER' && (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1.5 transition-colors hover:border-emerald-500/50 hover:bg-slate-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Wallet className="h-3.5 w-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Wallet</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  PKR {currentUser.walletBalancePKR.toLocaleString()}
                </div>
              </div>
            </button>
          )}

          {/* =========================================================
              ADMIN GATEWAY: ONLY SHOWN WHEN AUTHENTICATED OR DISCREET
          ========================================================= */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-purple-500/50 bg-purple-950/40 p-1">
              <button
                onClick={() => onSelectTab('admin-hq')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow ${
                  activeTab === 'admin-hq'
                    ? 'bg-purple-600 text-white shadow-purple-900/50'
                    : 'text-purple-300 hover:bg-purple-900/40'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-purple-300" />
                <span>Admin HQ Active</span>
              </button>
              <button
                onClick={onLockAdmin}
                className="rounded-lg bg-purple-900/60 hover:bg-rose-600 hover:text-white p-1.5 text-purple-300 transition"
                title="Lock Admin Session"
              >
                <Lock className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* Subtle, discreet trigger for developer only */
            <button
              onClick={onOpenAdminAuth}
              className="p-1.5 text-slate-600 hover:text-slate-400 transition rounded-lg"
              title="System Gateway"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Quick Simulation Menu on Mobile (Excluding Admin) */}
          <div className="lg:hidden">
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = regularUsers.find((u) => u.id === e.target.value);
                if (found) onSelectUser(found);
              }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200"
            >
              {regularUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.role}: {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-t border-slate-800 bg-slate-900/60 px-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {/* If Admin is Authenticated, provide admin shortcuts */}
          {isAdminAuthenticated && (
            <>
              <button
                onClick={() => onSelectTab('admin-hq')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'admin-hq'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-purple-300 hover:bg-purple-950/50 hover:text-white'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Platform Admin HQ & Bank Gateway</span>
              </button>
            </>
          )}

          {/* Supplier Tab */}
          {currentUser.role === 'SUPPLIER' && (
            <>
              <button
                onClick={() => onSelectTab('supplier-hub')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'supplier-hub'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Store className="h-3.5 w-3.5" />
                <span>My Wholesale Inventory (Daraz-Style Listing)</span>
              </button>
            </>
          )}

          {/* Sourcing Catalog for Resellers & Admin */}
          {(currentUser.role === 'RESELLER' || currentUser.role === 'ADMIN') && (
            <button
              onClick={() => onSelectTab('catalog')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'catalog'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Wholesale Sourcing & Daraz Media Downloads</span>
            </button>
          )}

          {/* Daraz Fee & Profit Calculator */}
          <button
            onClick={() => onSelectTab('daraz-calculator')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'daraz-calculator'
                ? 'bg-orange-600 text-white shadow'
                : 'text-orange-400/90 hover:bg-orange-950/40 hover:text-orange-300'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Daraz Fee & Tax Calculator</span>
          </button>

          {/* Orders Manager */}
          <button
            onClick={() => onSelectTab('orders')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Orders & Verification Hub</span>
            {pendingOrdersCount > 0 && (
              <span className="rounded-full bg-amber-500/30 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-500/50">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Customer / Storefront Buyer View */}
          <button
            onClick={() => onSelectTab('checkout-demo')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'checkout-demo'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Storefront Buyer View (COD Simulation)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
