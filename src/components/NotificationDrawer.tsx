import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Truck,
  Wallet,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Activity Notifications</h3>
              <p className="text-[11px] text-slate-400">Order, dispatch & wallet updates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs ${
                  n.isRead
                    ? 'bg-slate-950/50 border-slate-800/80 opacity-75'
                    : 'bg-slate-800/80 border-emerald-500/30 shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-white">{n.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No notifications yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={clearAllNotifications}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition"
          >
            Clear All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
