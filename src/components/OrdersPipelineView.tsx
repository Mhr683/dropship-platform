import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Truck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  Building,
  Eye,
  ShieldAlert,
  Sliders,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

export const OrdersPipelineView: React.FC = () => {
  const {
    orders,
    activeRole,
    advanceOrderStatus,
    setOrderStatus,
    markOrderPaid,
    setIsOrderModalOpen,
    setSelectedOrderForModal,
    setIsCodModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');
  const [expandedOrderTimelineId, setExpandedOrderTimelineId] = useState<string | null>(null);

  const statusList: { id: OrderStatus; label: string; color: string }[] = [
    { id: 'NEW', label: 'New', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    { id: 'AWAITING_CONFIRMATION', label: 'Awaiting Confirmation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'CONFIRMED', label: 'Confirmed', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    { id: 'PROCESSING', label: 'Processing', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'PACKED', label: 'Packed', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'DISPATCHED', label: 'Dispatched', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'IN_TRANSIT', label: 'In Transit', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { id: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'CANCELLED', label: 'Cancelled', color: 'bg-slate-700 text-slate-400 border-slate-600' },
    { id: 'RETURNED', label: 'Returned', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { id: 'REFUNDED', label: 'Refunded', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' }
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter !== 'ALL' && o.status !== selectedStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q) ||
        o.customerCity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const match = statusList.find(s => s.id === status);
    return (
      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${match?.color || 'bg-slate-800 text-slate-300'}`}>
        {match?.label || status}
      </span>
    );
  };

  const getNextAction = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
      case 'AWAITING_CONFIRMATION':
        return { label: 'Confirm Order', next: 'CONFIRMED' };
      case 'CONFIRMED':
        return { label: 'Start Pack', next: 'PROCESSING' };
      case 'PROCESSING':
        return { label: 'Mark Packed', next: 'PACKED' };
      case 'PACKED':
        return { label: 'Dispatch', next: 'DISPATCHED' };
      case 'DISPATCHED':
        return { label: 'In Transit', next: 'IN_TRANSIT' };
      case 'IN_TRANSIT':
        return { label: 'Out for Delivery', next: 'OUT_FOR_DELIVERY' };
      case 'OUT_FOR_DELIVERY':
        return { label: 'Mark Delivered', next: 'DELIVERED' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" /> Full Fulfillment Pipeline
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Orders & Dispatch Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of COD customer dispatches, automated OTP verification, courier tracking, and margin clearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'TABLE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'KANBAN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Pipeline Board
            </button>
          </div>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Order</span>
          </button>
        </div>
      </div>

      {/* SEARCH & STAGE FILTERS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="w-full sm:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, phone, customer, tracking #..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-bold">
            Showing <span className="text-white">{filteredOrders.length}</span> of {orders.length} orders
          </div>
        </div>

        {/* Status Horizontal Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          <button
            onClick={() => setSelectedStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
              selectedStatusFilter === 'ALL'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Orders ({orders.length})
          </button>

          {statusList.map((s) => {
            const count = orders.filter(o => o.status === s.id).length;
            const isSelected = selectedStatusFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStatusFilter(s.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{s.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Customer & City</th>
                  <th className="p-4">COD Risk</th>
                  <th className="p-4">Financials (PKR)</th>
                  <th className="p-4">Courier & Tracking</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const nextAction = getNextAction(order.status);
                    const isExpanded = expandedOrderTimelineId === order.orderId;

                    return (
                      <React.Fragment key={order.orderId}>
                        <tr className="hover:bg-slate-800/50 transition">
                          {/* Order ID */}
                          <td className="p-4">
                            <span className="font-mono font-extrabold text-white text-xs block">
                              {order.orderId}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[9px] text-emerald-400 font-bold uppercase">
                              {order.storeName || 'Direct Manual'}
                            </span>
                          </td>

                          {/* Product */}
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              {order.productImage && (
                                <img
                                  src={order.productImage}
                                  alt={order.productName}
                                  referrerPolicy="no-referrer"
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-800 shrink-0"
                                />
                              )}
                              <div>
                                <p className="font-bold text-white text-xs line-clamp-1">{order.productName}</p>
                                <p className="text-[10px] text-slate-400">SKU: {order.productSku}</p>
                              </div>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="p-4">
                            <p className="font-bold text-white">{order.customerName}</p>
                            <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {order.customerPhone}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" /> {order.customerCity}
                            </p>
                          </td>

                          {/* COD Risk Scoring */}
                          <td className="p-4">
                            <div
                              onClick={() => {
                                setSelectedOrderForModal(order);
                                setIsCodModalOpen(true);
                              }}
                              className="cursor-pointer group"
                              title={order.codRiskReason}
                            >
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                                  order.codRisk === 'LOW'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : order.codRisk === 'MEDIUM'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                                }`}
                              >
                                <ShieldCheck className="w-3 h-3" /> {order.codRisk} RISK ({order.codRiskScore})
                              </span>
                              <span className="text-[9px] text-slate-400 group-hover:text-emerald-400 block mt-0.5 line-clamp-1">
                                {order.isPhoneVerified ? 'Phone OTP Verified' : 'Tap to Verify'}
                              </span>
                            </div>
                          </td>

                          {/* Financial Breakdown */}
                          <td className="p-4">
                            <div className="space-y-0.5 text-[11px]">
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-400">Sale:</span>
                                <strong className="text-white font-mono">PKR {order.sellingPricePKR.toLocaleString()}</strong>
                              </div>
                              <div className="flex justify-between gap-2 text-slate-400">
                                <span>Wholesale:</span>
                                <span className="font-mono">PKR {order.supplierPayoutPKR.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between gap-2 text-emerald-400 font-bold border-t border-slate-800 pt-0.5">
                                <span>Reseller Margin:</span>
                                <span className="font-mono">PKR {order.resellerMarginPKR.toLocaleString()}</span>
                              </div>
                            </div>
                          </td>

                          {/* Courier & Tracking */}
                          <td className="p-4">
                            <p className="font-bold text-slate-200">{order.courierName}</p>
                            <span className="font-mono text-[10px] text-slate-400 block">{order.trackingNumber}</span>
                            <span className="text-[9px] text-sky-400 flex items-center gap-1 mt-0.5">
                              <Truck className="w-3 h-3" /> 2-Day Delivery
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4">{getStatusBadge(order.status)}</td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {nextAction && (
                                <button
                                  onClick={() => advanceOrderStatus(order.orderId)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm transition"
                                >
                                  {nextAction.label}
                                </button>
                              )}

                              {order.status === 'AWAITING_CONFIRMATION' && (
                                <button
                                  onClick={() => {
                                    setSelectedOrderForModal(order);
                                    setIsCodModalOpen(true);
                                  }}
                                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1.5 rounded-lg transition"
                                >
                                  WhatsApp Verify
                                </button>
                              )}

                              {order.status !== 'DELIVERED' && order.status !== 'RETURNED' && order.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Mark Order #${order.orderId} as RETURNED? Stock will be restored.`)) {
                                      setOrderStatus(order.orderId, 'RETURNED', 'Marked returned by ops team.');
                                    }
                                  }}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] px-2 py-1.5 rounded-lg border border-red-500/20 transition"
                                  title="Mark Returned"
                                >
                                  Return
                                </button>
                              )}

                              <button
                                onClick={() => setExpandedOrderTimelineId(isExpanded ? null : order.orderId)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                                title="View Timeline & Internal Notes"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Timeline & Details Drawer */}
                        {isExpanded && (
                          <tr className="bg-slate-950/90 border-b border-slate-800">
                            <td colSpan={8} className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Timeline */}
                                <div className="md:col-span-2 space-y-3">
                                  <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Order Tracking & History
                                  </h4>
                                  <div className="relative pl-6 space-y-4 border-l-2 border-slate-800">
                                    {order.timeline.map((event, tIdx) => (
                                      <div key={tIdx} className="relative">
                                        <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-4 border-slate-950" />
                                        <div>
                                          <div className="flex justify-between items-center">
                                            <span className="font-bold text-white text-xs">{event.title}</span>
                                            <span className="text-[10px] text-slate-500">
                                              {new Date(event.timestamp).toLocaleTimeString()} ({new Date(event.timestamp).toLocaleDateString()})
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-400 mt-0.5">{event.description}</p>
                                          <span className="text-[9px] text-slate-500 font-mono">By: {event.actor}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Customer Address & Financials */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                                  <div>
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Delivery Address</span>
                                    <p className="font-bold text-white mt-0.5">{order.customerAddress}</p>
                                    <p className="text-[11px] text-emerald-400 font-semibold">{order.customerCity}, Pakistan</p>
                                  </div>

                                  <div className="border-t border-slate-800 pt-2">
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Internal Notes</span>
                                    <p className="text-slate-300 text-[11px] mt-0.5 italic">{order.internalNotes || 'No notes added.'}</p>
                                  </div>

                                  {/* Settlement Statuses */}
                                  <div className="border-t border-slate-800 pt-2 space-y-1">
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Financial Settlement</span>
                                    <div className="flex justify-between text-[11px]">
                                      <span>Supplier Invoice:</span>
                                      <span className={order.invoicePaid ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                        {order.invoicePaid ? 'Paid' : 'Unpaid'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                      <span>Reseller Profit Margin:</span>
                                      <span className={order.profitPaid ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                        {order.profitPaid ? 'Paid' : 'Unpaid (Auto-clear on delivery)'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No orders match your filter criteria. Place a new order above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {[
            { status: 'AWAITING_CONFIRMATION', title: 'Awaiting Confirm', color: 'border-amber-500/40 bg-amber-500/5' },
            { status: 'CONFIRMED', title: 'Confirmed & Pack', color: 'border-sky-500/40 bg-sky-500/5' },
            { status: 'IN_TRANSIT', title: 'In Transit & Dispatch', color: 'border-indigo-500/40 bg-indigo-500/5' },
            { status: 'DELIVERED', title: 'Delivered (Profit Realized)', color: 'border-emerald-500/40 bg-emerald-500/5' }
          ].map((col) => {
            const colOrders = filteredOrders.filter(o => {
              if (col.status === 'CONFIRMED') return o.status === 'CONFIRMED' || o.status === 'PROCESSING' || o.status === 'PACKED';
              if (col.status === 'IN_TRANSIT') return o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT' || o.status === 'OUT_FOR_DELIVERY';
              return o.status === col.status;
            });

            return (
              <div
                key={col.status}
                className={`border rounded-3xl p-4 flex flex-col space-y-3 min-h-[500px] ${col.color}`}
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h4 className="font-extrabold text-white text-xs">{col.title}</h4>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 shadow-md space-y-2.5 cursor-pointer transition"
                      onClick={() => {
                        setSelectedOrderForModal(order);
                        if (order.status === 'AWAITING_CONFIRMATION') {
                          setIsCodModalOpen(true);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] font-bold text-emerald-400">{order.orderId}</span>
                        {getStatusBadge(order.status)}
                      </div>

                      <p className="font-bold text-xs text-white line-clamp-1">{order.productName}</p>

                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>{order.customerName}</span>
                        <span className="text-emerald-400 font-bold font-mono">PKR {order.sellingPricePKR.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800 pt-1.5">
                        <span>{order.customerCity}</span>
                        <span>Margin: +PKR {order.resellerMarginPKR.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
