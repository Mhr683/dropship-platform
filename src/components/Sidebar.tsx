import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Package,
  ShoppingBag,
  Calculator,
  Sliders,
  Boxes,
  Truck,
  Building,
  RotateCcw,
  Users,
  Wallet,
  Store,
  FileSpreadsheet,
  BarChart3,
  BookOpen,
  LifeBuoy,
  Tag,
  Share2,
  ShieldAlert,
  Globe,
  X,
  ChevronRight,
  Lock,
  FileText,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  adminOnly?: boolean;
  resellerOnly?: boolean;
  isNew?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    activeRole,
    currentUser,
    setIsProfileSettingsOpen,
    orders,
    products,
    returns,
    payoutRequests
  } = useApp();

  const pendingConfirmationCount = orders.filter(o => o.status === 'AWAITING_CONFIRMATION').length;
  const lowStockCount = products.filter(p => p.status === 'LOW_STOCK' || p.stock <= p.lowStockThreshold).length;
  const pendingReturnCount = returns.filter(r => r.status === 'REQUESTED' || r.status === 'IN_TRANSIT').length;
  const pendingPayoutCount = payoutRequests.filter(p => p.status === 'REQUESTED' || p.status === 'UNDER_REVIEW').length;

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'Core Engine',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'finder', label: 'Product Research', icon: Sparkles, isNew: true },
        { id: 'products', label: 'Wholesale Catalog', icon: Package, badge: products.length, badgeColor: 'bg-slate-700 text-slate-300' },
        {
          id: 'orders',
          label: 'Orders Pipeline',
          icon: ShoppingBag,
          badge: pendingConfirmationCount > 0 ? pendingConfirmationCount : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-extrabold'
        }
      ]
    },
    {
      groupTitle: 'Automation & Pricing',
      items: [
        {
          id: 'calculator',
          label: 'Daraz Calculator',
          icon: Calculator,
          badge: '2.25%',
          badgeColor: 'bg-orange-500 text-slate-950 font-extrabold'
        },
        { id: 'pricing-rules', label: 'Smart Pricing Rules', icon: Sliders },
        {
          id: 'inventory',
          label: 'Inventory Sync',
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
          badgeColor: 'bg-red-500 text-white'
        },
        {
          id: 'cod-automation',
          label: 'COD Verification',
          icon: ShieldAlert,
          badge: pendingConfirmationCount > 0 ? 'Action' : undefined,
          badgeColor: 'bg-emerald-500 text-slate-950 font-bold'
        },
        { id: 'couriers', label: 'Courier & Dispatch', icon: Truck }
      ]
    },
    {
      groupTitle: 'Operations & Finance',
      items: [
        { id: 'suppliers', label: 'Supplier Hub', icon: Building },
        {
          id: 'returns',
          label: 'Returns & Refunds',
          icon: RotateCcw,
          badge: pendingReturnCount > 0 ? pendingReturnCount : undefined,
          badgeColor: 'bg-indigo-500 text-white'
        },
        { id: 'customers', label: 'Customer CRM', icon: Users },
        {
          id: 'wallet',
          label: 'Wallet & Payouts',
          icon: Wallet,
          badge: pendingPayoutCount > 0 ? `${pendingPayoutCount} Req` : undefined,
          badgeColor: 'bg-emerald-500 text-slate-950'
        },
        { id: 'multi-store', label: 'Multi-Store Sync', icon: Store }
      ]
    },
    {
      groupTitle: 'Tools & Growth',
      items: [
        { id: 'bulk-import', label: 'Bulk CSV / Excel', icon: FileSpreadsheet },
        { id: 'analytics', label: 'Analytics Reports', icon: BarChart3 },
        { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
        { id: 'referrals', label: 'Referral Program', icon: Share2 },
        { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
        { id: 'support', label: 'Support Center', icon: LifeBuoy }
      ]
    }
  ];

  // Super Admin view item
  const adminControlItem: NavItem = {
    id: 'admin-control',
    label: 'Super Admin HQ',
    icon: Lock,
    badge: 'Confidential',
    badgeColor: 'bg-indigo-600 text-white font-bold',
    adminOnly: true
  };

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-30 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              YM
            </div>
            <span className="font-extrabold text-white">YOURMART GLOBAL</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Value Proposition Badge */}
        <div className="p-4 border-b border-slate-800/60 hidden lg:block">
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-800/60 to-slate-800/40 border border-emerald-500/20 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-1">
              <Globe className="w-3.5 h-3.5" /> Dropship & Reseller OS
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Find → Import → Sell → Automate → Track → Profit
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Admin Control Center Link if Admin role */}
          {(activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN') && (
            <div>
              <div className="px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center justify-between">
                <span>Executive Management</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              </div>
              <button
                onClick={() => handleNavClick(adminControlItem.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition border ${
                  activeTab === adminControlItem.id
                    ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-lg shadow-indigo-600/10'
                    : 'text-indigo-300/80 hover:bg-slate-800/80 border-indigo-900/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <adminControlItem.icon className="w-4 h-4 text-indigo-400" />
                  <span>{adminControlItem.label}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${adminControlItem.badgeColor}`}>
                  {adminControlItem.badge}
                </span>
              </button>
            </div>
          )}

          {/* Grouped Nav Items */}
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {group.groupTitle}
              </div>
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition group ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-emerald-400'
                        }`}
                      />
                      <span>{item.label}</span>
                      {item.isNew && (
                        <span className="bg-emerald-400/20 text-emerald-300 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase border border-emerald-400/30">
                          AI
                        </span>
                      )}
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Profile / Store Brand Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 space-y-2">
          {/* Active Partner Store Card */}
          <div
            onClick={() => {
              setIsProfileSettingsOpen(true);
              onCloseMobile();
            }}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentUser.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.companyName || currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-emerald-500/50 shadow"
                />
                <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-slate-950 rounded-full p-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white group-hover:text-emerald-300 truncate">
                  {currentUser.companyName || currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span>{currentUser.role === 'SUPPLIER' ? 'Wholesale Vendor' : currentUser.role === 'RESELLER' ? 'Pro Dropshipper' : 'Super Admin'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Settings</span>
                </p>
              </div>
            </div>
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:rotate-45 transition transform shrink-0" />
          </div>

          <div
            onClick={() => handleNavClick('knowledge')}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 cursor-pointer transition flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-3 h-3" />
              </div>
              <span className="font-medium text-[10px]">Seller Scaling Playbooks</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
          </div>
        </div>
      </aside>
    </>
  );
};
