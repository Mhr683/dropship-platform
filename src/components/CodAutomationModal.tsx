import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  User,
  MapPin,
  DollarSign,
  Copy,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CodAutomationModal: React.FC = () => {
  const {
    isCodModalOpen,
    setIsCodModalOpen,
    selectedOrderForModal,
    verifyOrderCod,
    advanceOrderStatus
  } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  if (!isCodModalOpen || !selectedOrderForModal) return null;

  const order = selectedOrderForModal;

  // WhatsApp Message Template
  const whatsAppMessage = `Assalam-o-Alaikum ${order.customerName}! 📦\n\nYour order #${order.orderId} for "${order.productName}" (Total: PKR ${order.sellingPricePKR.toLocaleString()} via Cash on Delivery) has been received on YourMart Global.\n\nPlease confirm your delivery address:\n${order.customerAddress}, ${order.customerCity}.\n\nReply 'YES' or enter OTP: 5829 to confirm dispatch immediately!`;

  const handleSendWhatsApp = () => {
    setIsSendingWhatsApp(true);
    setTimeout(() => {
      setIsSendingWhatsApp(false);
      setWhatsAppSent(true);
    }, 1000);
  };

  const handleConfirmVerification = () => {
    verifyOrderCod(order.orderId);
    setVerificationSuccess(true);
    setTimeout(() => {
      setVerificationSuccess(false);
      setIsCodModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">Automated COD Order Verification</h3>
              <p className="text-xs text-slate-400">Order #{order.orderId} • {order.customerName}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCodModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Risk Matrix */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Customer Risk Score:</span>
            <span
              className={`font-black px-2.5 py-0.5 rounded-full border ${
                order.codRisk === 'LOW'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {order.codRiskScore}/100 • {order.codRisk} RISK
            </span>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Risk Analysis: {order.codRiskReason}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Customer Phone:</span>
              <p className="text-white font-mono font-bold mt-0.5">{order.customerPhone}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Delivery City:</span>
              <p className="text-white font-bold mt-0.5">{order.customerCity}</p>
            </div>
          </div>
        </div>

        {/* Automated WhatsApp Message Box */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <MessageSquare className="w-4 h-4" /> 1-Click WhatsApp Verification Template
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(whatsAppMessage);
                alert('WhatsApp message copied to clipboard!');
              }}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy Text
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
            {whatsAppMessage}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSendWhatsApp}
              disabled={isSendingWhatsApp}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>{isSendingWhatsApp ? 'Sending WhatsApp...' : whatsAppSent ? 'WhatsApp Sent ✓' : 'Send WhatsApp Message'}</span>
            </button>

            <a
              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              Direct Chat
            </a>
          </div>
        </div>

        {/* OTP Input Confirmation */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
          <label className="font-bold text-slate-300 block">Customer Verification OTP (Demo: 5829)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter 4-digit code..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-center font-bold tracking-widest focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleConfirmVerification}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Verify</span>
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {verificationSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Order confirmed successfully! Ready for warehouse dispatch.</span>
          </div>
        )}
      </div>
    </div>
  );
};
