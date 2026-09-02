import React, { useState } from 'react';
import {
  RefreshCw,
  Truck,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  PhoneCall,
  MessageSquare,
  Search,
  Filter,
  Package,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  UserCheck,
  Send,
  MessageCircle,
  Eye,
  Check,
} from 'lucide-react';
import { Order, OrderStatus, User, ChatMessage } from '../types';

interface OrdersManagerProps {
  currentUser: User;
  orders: Order[];
  onVerifyCod: (orderId: string) => void;
  onDispatchOrder: (orderId: string, courierName: string) => void;
  onDeliverOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onSendMessage?: (orderId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  currentUser,
  orders,
  onVerifyCod,
  onDispatchOrder,
  onDeliverOrder,
  onCancelOrder,
  onSendMessage,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);

  // Active Chat State
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState('');

  // Filter orders based on user role for strict isolation
  const roleFilteredOrders = orders.filter((o) => {
    if (currentUser.role === 'ADMIN') return true;
    if (currentUser.role === 'SUPPLIER') return o.supplierId === currentUser.id;
    if (currentUser.role === 'RESELLER') return o.resellerId === currentUser.id;
    return true;
  });

  const displayOrders = roleFilteredOrders.filter((o) => {
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.customerCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeChatOrder = orders.find((o) => o.id === activeChatOrderId);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_VERIFICATION':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'COD_CONFIRMED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'DISPATCHED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'DELIVERED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'RETURNED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'CANCELLED':
        return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  const handleSimulateCallVerification = (orderId: string) => {
    setVerifyingOrderId(orderId);
    setTimeout(() => {
      onVerifyCod(orderId);
      setVerifyingOrderId(null);
    }, 1000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() || !activeChatOrderId || !onSendMessage) return;

    onSendMessage(activeChatOrderId, {
      senderRole: currentUser.role,
      senderName: currentUser.name,
      text: chatInputText.trim(),
    });

    setChatInputText('');
  };

  const handleSendQuickReply = (text: string) => {
    if (!activeChatOrderId || !onSendMessage) return;
    onSendMessage(activeChatOrderId, {
      senderRole: currentUser.role,
      senderName: currentUser.name,
      text,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                COD ORDER PIPELINE & CUSTOMER CHAT
              </span>
              <span className="text-xs text-slate-400">Isolated Role Access</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              {currentUser.role === 'SUPPLIER'
                ? 'Warehouse Dispatch & Packaging Orders'
                : currentUser.role === 'RESELLER'
                ? 'My Customer Orders & Live Chat Center'
                : 'Platform Master Orders & Fee Audit'}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {currentUser.role === 'SUPPLIER'
                ? 'Fulfill verified wholesale orders and generate courier dispatch labels.'
                : 'Communicate directly with your customers, monitor COD delivery status, and receive net profits.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Viewing As:</span>
            <span className="rounded-lg bg-slate-800 px-2.5 py-1 font-bold text-emerald-400 border border-slate-700">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search order ID, customer name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {['ALL', 'PENDING_VERIFICATION', 'COD_CONFIRMED', 'DISPATCHED', 'DELIVERED', 'RETURNED'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center text-slate-400">
            <Package className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm font-semibold text-slate-300">No orders found in this view</p>
            <p className="text-xs text-slate-500">
              Place a new customer order from the Wholesale Catalog to see it live here.
            </p>
          </div>
        ) : (
          displayOrders.map((ord) => {
            const hasMessages = ord.messages && ord.messages.length > 0;
            const isSupplier = currentUser.role === 'SUPPLIER';

            return (
              <div
                key={ord.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl hover:border-slate-700 transition"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-white">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                    {ord.syncedStore && (
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-slate-700">
                        via {ord.syncedStore}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Chat Action Button */}
                    <button
                      onClick={() => setActiveChatOrderId(ord.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 border border-slate-700 transition"
                    >
                      <MessageCircle className="h-4 w-4 text-emerald-400" />
                      <span>Customer Chat</span>
                      {hasMessages && (
                        <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                          {ord.messages?.length}
                        </span>
                      )}
                    </button>

                    <span className="text-slate-500 font-mono text-[11px]">
                      {new Date(ord.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Order Main Content */}
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {/* Items & Customer / Fulfillment Info */}
                  <div className="space-y-3 lg:col-span-2">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-100">{item.name}</div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-mono">
                            <span>
                              SKU: <b className="text-amber-400">{item.sku}</b>
                            </span>
                            <span>
                              Qty: <b className="text-white">{item.qty}</b>
                            </span>
                            {!isSupplier && (
                              <span>
                                Retail: <b className="text-emerald-400">PKR {item.sellingPricePKR}</b>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Customer Info (Privacy-filtered for Supplier) */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3.5 text-xs text-slate-300 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                          {ord.customerName}
                        </span>
                        {!isSupplier && (
                          <span className="font-mono text-emerald-400">{ord.customerPhone}</span>
                        )}
                      </div>
                      <div className="text-slate-400 flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>
                          {ord.customerAddress} ({ord.customerCity})
                        </span>
                      </div>
                      {ord.trackingNumber && (
                        <div className="pt-1 flex items-center gap-2 font-mono text-[11px] text-cyan-300">
                          <Truck className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Courier Tracking AWB: <b>{ord.trackingNumber}</b></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Ledger & Actions */}
                  <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                    {/* Financial details */}
                    <div className="space-y-2 text-xs">
                      {isSupplier ? (
                        /* Supplier View: Only sees wholesale amount to be paid */
                        <div className="space-y-2">
                          <div className="flex justify-between text-slate-400">
                            <span>Wholesale Amount (Your Payout):</span>
                            <span className="font-mono font-bold text-amber-300 text-sm">
                              PKR {ord.supplierCostPKR.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Dispatched from your warehouse. Credited directly to your wallet upon courier delivery.
                          </div>
                        </div>
                      ) : (
                        /* Reseller & Admin View: Exact calculation formula */
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-slate-400">
                            <span>Customer COD Price:</span>
                            <span className="font-mono font-bold text-white">
                              PKR {ord.sellingPricePKR.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>- Supplier Base Cost:</span>
                            <span className="font-mono text-amber-300">
                              PKR {ord.supplierCostPKR.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>- Flat Processing Fee:</span>
                            <span className="font-mono text-slate-300">
                              PKR {ord.processingFeePKR ?? 30}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>- Courier Delivery:</span>
                            <span className="font-mono text-slate-300">
                              PKR {ord.shippingCostPKR}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>- 2% Platform Fee:</span>
                            <span className="font-mono text-slate-300">
                              PKR {ord.platformFeePKR ?? Math.round(ord.sellingPricePKR * 0.02)}
                            </span>
                          </div>

                          <div className="border-t border-slate-800 pt-2 flex justify-between font-bold">
                            <span className="text-emerald-400">Your Net Profit:</span>
                            <span className="font-mono text-sm text-emerald-400">
                              PKR {ord.resellerCommissionPKR.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dynamic State Actions */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      {ord.status === 'PENDING_VERIFICATION' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSimulateCallVerification(ord.id)}
                            disabled={verifyingOrderId === ord.id}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white shadow transition disabled:opacity-50"
                          >
                            {verifyingOrderId === ord.id ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                <span>Verifying OTP...</span>
                              </>
                            ) : (
                              <>
                                <PhoneCall className="h-3.5 w-3.5" />
                                <span>Verify Customer OTP</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onCancelOrder(ord.id)}
                            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-400 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {ord.status === 'COD_CONFIRMED' && (
                        <button
                          onClick={() => onDispatchOrder(ord.id, 'TCS Express')}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 py-2 text-xs font-bold text-white shadow transition"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          <span>Dispatch via TCS Express</span>
                        </button>
                      )}

                      {ord.status === 'DISPATCHED' && (
                        <button
                          onClick={() => onDeliverOrder(ord.id)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white shadow transition"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Mark Delivered (Disburse Payouts)</span>
                        </button>
                      )}

                      {ord.status === 'DELIVERED' && (
                        <div className="rounded-xl bg-emerald-950/40 p-2.5 text-center text-xs font-bold text-emerald-400 border border-emerald-900/50">
                          ✓ Delivered & Net Profit Credited to Wallet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer & Reseller Order Chat Modal */}
      {activeChatOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
            {/* Chat Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Chat: {activeChatOrder.customerName}</span>
                    <span className="font-mono text-[11px] text-amber-400">
                      ({activeChatOrder.orderNumber})
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Order Status: <b className="text-emerald-400">{activeChatOrder.status}</b>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatOrderId(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {(!activeChatOrder.messages || activeChatOrder.messages.length === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                  <span>No chat messages yet for this order.</span>
                  <span className="text-[11px] text-slate-600 mt-1">
                    Send a message to update the customer or ask for delivery confirmation.
                  </span>
                </div>
              ) : (
                activeChatOrder.messages.map((msg) => {
                  const isMe = msg.senderRole === currentUser.role;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-300">{msg.senderName}</span>
                        <span>•</span>
                        <span className="rounded bg-slate-800 px-1 py-0.2 font-mono text-[9px] text-slate-400">
                          {msg.senderRole}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Preset Buttons */}
            <div className="border-t border-slate-800 pt-2 pb-1">
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
                <span className="text-slate-500 text-[10px] whitespace-nowrap">Quick:</span>
                <button
                  onClick={() => handleSendQuickReply('Aapka order verify ho chuka hai aur packing mein hai!')}
                  className="rounded-full bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 text-slate-300 whitespace-nowrap border border-slate-700 text-[10px]"
                >
                  Order Verified
                </button>
                <button
                  onClick={() => handleSendQuickReply('Aapka parcel TCS se dispatch ho chuka hai.')}
                  className="rounded-full bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 text-slate-300 whitespace-nowrap border border-slate-700 text-[10px]"
                >
                  TCS Dispatched
                </button>
                <button
                  onClick={() => handleSendQuickReply('Rider delivery ke liye phonchne wala hai, please cash ready rakhen.')}
                  className="rounded-full bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 text-slate-300 whitespace-nowrap border border-slate-700 text-[10px]"
                >
                  Cash on Delivery Ready
                </button>
              </div>
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendChatMessage} className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Type your message to the customer..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
