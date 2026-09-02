import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  DollarSign,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  MapPin,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourierPartner } from '../types';

export const CourierDispatchView: React.FC = () => {
  const { couriers, orders, advanceOrderStatus } = useApp();
  const [selectedCourierId, setSelectedCourierId] = useState<string>('ALL');

  const readyToDispatchOrders = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PACKED');
  const activeShipments = orders.filter(o => o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT' || o.status === 'OUT_FOR_DELIVERY');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" /> Automated Courier Routing
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Courier & Logistics Center</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrated with PostEx, TCS, Trax, Leopard, and Call Courier with automated airway bill (AWB) generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Smart Lowest-Cost Route Optimization
          </span>
        </div>
      </div>

      {/* COURIER PARTNERS PERFORMANCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {couriers.map((courier) => (
          <div
            key={courier.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4 transition group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black text-sm border border-sky-500/20">
                  {courier.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">{courier.name}</h4>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    API Connected
                  </span>
                </div>
              </div>

              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                {courier.successRate}% Success
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Base Rate (1kg):</span>
                <p className="text-white font-mono font-bold mt-0.5">PKR {courier.baseRatePKR}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Avg Delivery:</span>
                <p className="text-white font-bold mt-0.5">{courier.avgDeliveryDays} Days</p>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Coverage Zones:</span>
                <span className="text-slate-200 font-bold">{courier.coverageZones.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span>COD Remittance Cycle:</span>
                <span className="text-emerald-400 font-bold">Daily / T+1 Direct</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* READY FOR DISPATCH ORDERS QUEUE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-white text-base">Warehouse Dispatch Queue</h3>
            <p className="text-xs text-slate-400">Orders verified and ready for courier rider pickup</p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {readyToDispatchOrders.length} Ready to Pack/Dispatch
          </span>
        </div>

        <div className="p-4">
          {readyToDispatchOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readyToDispatchOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-mono font-bold text-emerald-400">{order.orderId}</span>
                      <p className="font-bold text-white text-sm mt-0.5">{order.productName}</p>
                    </div>
                    <span className="text-xs font-black text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                      PKR {order.sellingPricePKR.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.customerName}, {order.customerAddress}, {order.customerCity}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Assigned Courier: <strong className="text-slate-300">{order.courierName}</strong> • Tracking: <span className="font-mono text-emerald-400">{order.trackingNumber}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => advanceOrderStatus(order.orderId)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Handover to Rider & Mark Dispatched</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No orders pending dispatch right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
