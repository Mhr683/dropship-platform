import React, { useState } from 'react';
import {
  Search,
  Plus,
  UserPlus,
  Wallet,
  Bell,
  Layers,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
  Store,
  HelpCircle,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Server,
  Calculator,
  Settings,
  User,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar, onToggleMobileSidebar, onOpenNotifications }) => {
  const handleToggleSidebar = onOpenMobileSidebar || onToggleMobileSidebar || (() => {});
  const {
    activeRole,
    setActiveRole,
    currentUser,
    masterWalletBalancePKR,
    resellerAvailableBalancePKR,
    notifications,
    setIsRegisterModalOpen,
    setIsAddProductModalOpen,
    setIsGlobalSearchOpen,
    setIsTrustPolicyModalOpen,
    setIsProfileSettingsOpen,
    isApiExplorerOpen,
    setIsApiExplorerOpen,
    activeTab,
    setActiveTab,
    cartTotalCount,
    setIsCartOpen
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    SUPER_ADMIN: { label: 'Super Admin Portal', badge: 'Full Platform Access', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    ADMIN: { label: 'Admin Ops', badge: 'Operations Desk', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    RESELLER: { label: 'Reseller Portal View', badge: 'E-Com Dropshipper', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    SUPPLIER: { label: 'Vendor / Supplier Hub', badge: 'Wholesale Inventory', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    FINANCE_STAFF: { label: 'Finance & Payouts', badge: 'Ledger Audit', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    SUPPORT_STAFF: { label: 'Support & Verification', badge: 'COD Customer Care', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-950/80 px-4 sm:px-6 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>YourMart Engine Active</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> Automated COD & Profit Guard Active
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            PKR Currency Settlement
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* API Service Layer Explorer */}
          <button
            onClick={() => setIsApiExplorerOpen(true)}
            className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
          >
            <Server className="w-3 h-3 text-emerald-400" /> API Services
          </button>

          <span className="text-slate-700">|</span>

          {/* Daraz Calculator Quick Action */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded transition flex items-center gap-1 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 border border-orange-500/20'
            }`}
          >
            <Calculator className="w-3 h-3 text-orange-400" /> Daraz Calculator (2.25%)
          </button>

          <span className="text-slate-700">|</span>

          {/* Quick Landing Page link */}
          <button
            onClick={() => setActiveTab('landing')}
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded transition flex items-center gap-1 ${
              activeTab === 'landing'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ExternalLink className="w-3 h-3" /> Public SaaS Landing
          </button>

          <span className="text-slate-700">|</span>

          {/* Trust Policies */}
          <button
            onClick={() => setIsTrustPolicyModalOpen(true)}
            className="text-[11px] text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Trust & Policies
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-3">
        {/* Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-emerald-600/25 group-hover:scale-105 transition transform">
              YM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
                  YOURMART <span className="text-emerald-400">GLOBAL</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5 hidden xs:block">
                Wholesale & Reseller Automation
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-400 text-xs rounded-xl px-3.5 py-2 flex items-center justify-between transition group shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
              <span>Search products, orders, tracking, users...</span>
            </span>
            <kbd className="hidden lg:inline-flex bg-slate-900 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="md:hidden p-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Role Switcher for dynamic testing */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition shadow-sm ${
                roleLabels[activeRole]?.color || 'bg-slate-800 text-white border-slate-700'
              }`}
            >
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-slate-400 uppercase font-semibold leading-none">Perspective</div>
                <div className="text-xs font-bold leading-tight">{roleLabels[activeRole]?.label}</div>
              </div>
              <span className="sm:hidden text-xs font-bold">{activeRole}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-75" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 divide-y divide-slate-700/60">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400">
                  Switch Active Role View
                </div>
                <div className="py-1 space-y-0.5">
                  {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setActiveRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                        activeRole === role
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-200 hover:bg-slate-700/70'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{roleLabels[role].label}</div>
                        <div className="text-[10px] opacity-75">{roleLabels[role].badge}</div>
                      </div>
                      {activeRole === role && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action: Register Partner Account */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Register Partner</span>
          </button>

          {/* Quick Action: Add Product */}
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* Wallet Balance Widget */}
          <div
            onClick={() => setActiveTab('wallet')}
            className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center gap-2.5 group"
            title="Click to view Master / Reseller Wallet & Payout Ledger"
          >
            <div className="text-right">
              <p className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-emerald-400 tracking-wider">
                {activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN' ? 'Master (2% Cut)' : 'Available Balance'}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-400">
                PKR{' '}
                {activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN'
                  ? masterWalletBalancePKR.toLocaleString()
                  : resellerAvailableBalancePKR.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          {/* Dropshipping Cart Quick Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition group shadow-sm"
            title="Open Dropshipping Cart (کارٹ کھولیں)"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition transform" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden md:inline">
              Cart
            </span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User & Store Brand Logo Profile Trigger */}
          <button
            onClick={() => setIsProfileSettingsOpen(true)}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 px-2 sm:px-2.5 py-1.5 rounded-xl transition group shadow-sm"
            title="Open Store Logo & CNIC Profile Settings"
          >
            <div className="relative">
              <img
                src={currentUser.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.companyName || currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-emerald-500/50 group-hover:scale-105 transition"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900"></div>
            </div>
            <div className="text-left hidden lg:block max-w-[130px]">
              <div className="text-xs font-extrabold text-white truncate group-hover:text-emerald-300 transition">
                {currentUser.companyName || currentUser.name}
              </div>
              <div className="text-[9px] text-slate-400 truncate flex items-center gap-0.5">
                <Settings className="w-2.5 h-2.5 text-emerald-400" />
                <span>Store Profile</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
