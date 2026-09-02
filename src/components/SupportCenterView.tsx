import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

export const SupportCenterView: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('LOGISTICS');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> 24/7 Dedicated Support
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Merchant & Reseller Support Center</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect directly with YourMart logistics coordinators, supplier managers, and billing officers.
          </p>
        </div>

        <a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Instant WhatsApp Helpline</span>
        </a>
      </div>

      {/* SUCCESS BANNER */}
      {isSubmitted && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Your support ticket has been dispatched! An ops specialist will contact you within 15 minutes.</span>
        </div>
      )}

      {/* QUICK CONTACT CHANNELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-white text-base">Priority WhatsApp Hotline</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time tracking disputes, rider delays, and urgent order cancellations.
          </p>
          <p className="text-emerald-400 font-mono font-bold text-xs">+92 300 1234567</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-white text-base">Billing & Remittances</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Daily T+1 settlement reconciliations, bank transfer receipts, and platform invoices.
          </p>
          <p className="text-indigo-400 font-mono font-bold text-xs">billing@yourmart.pk</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-white text-base">Wholesale Sourcing Desk</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Looking for a specific item not in catalog? Our Bolton Market agents will procure it.
          </p>
          <p className="text-amber-400 font-mono font-bold text-xs">sourcing@yourmart.pk</p>
        </div>
      </div>

      {/* TICKET FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="font-extrabold text-white text-base">Submit Support & Operations Ticket</h3>

        <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Ticket Subject</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Courier rider delayed for Order #YM-8402"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 mb-1 block">Department</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="LOGISTICS">Courier & Delivery Operations</option>
                <option value="FINANCE">Payouts, Wallet & Invoices</option>
                <option value="SOURCING">Wholesale Supplier & Restocking</option>
                <option value="INTEGRATION">Shopify & Technical APIs</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">Detailed Message & Tracking Numbers</label>
            <textarea
              required
              rows={4}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Provide order numbers, customer phone numbers, or details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Ticket</span>
          </button>
        </form>
      </div>
    </div>
  );
};
