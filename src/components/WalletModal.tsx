import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Building,
  CheckCircle,
  CreditCard,
  Clock,
} from 'lucide-react';
import { User, WalletTransaction } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  transactions: WalletTransaction[];
  onAddFunds: (amount: number) => void;
  onWithdrawFunds: (amount: number, bankDetails: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  transactions,
  onAddFunds,
  onWithdrawFunds,
}) => {
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'WITHDRAW' | 'DEPOSIT'>('LEDGER');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [bankName, setBankName] = useState('Meezan Bank Ltd');
  const [accountNumber, setAccountNumber] = useState('PK88MEZN000192837465');
  const [accountTitle, setAccountTitle] = useState(currentUser.name);
  const [depositAmount, setDepositAmount] = useState<number>(10000);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const userTransactions = transactions.filter(
    (t) => t.userId === currentUser.id || currentUser.role === 'ADMIN'
  );

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > currentUser.walletBalancePKR) {
      alert('Insufficient wallet balance');
      return;
    }

    onWithdrawFunds(withdrawAmount, `${bankName} - ${accountNumber} (${accountTitle})`);
    setNotification(`Withdrawal request of PKR ${withdrawAmount.toLocaleString()} submitted to ${bankName}!`);
    setTimeout(() => {
      setNotification(null);
      setActiveTab('LEDGER');
    }, 2500);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFunds(depositAmount);
    setNotification(`Successfully credited PKR ${depositAmount.toLocaleString()} to wallet!`);
    setTimeout(() => {
      setNotification(null);
      setActiveTab('LEDGER');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Wallet & Settlement Vault</h2>
              <p className="text-xs text-slate-400">
                {currentUser.name} • {currentUser.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Current Balance Card */}
        <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Available Withdrawable Balance
            </span>
            <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-bold font-mono text-emerald-300 border border-emerald-800">
              PKR CURRENCY
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-emerald-400">
            PKR {currentUser.walletBalancePKR.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Escrow payouts released automatically on courier delivery confirmation.
          </div>
        </div>

        {/* Action Tabs */}
        <div className="mt-5 flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'LEDGER'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            Transaction Ledger
          </button>
          <button
            onClick={() => setActiveTab('WITHDRAW')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'WITHDRAW'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            Request Bank Withdrawal
          </button>
          <button
            onClick={() => setActiveTab('DEPOSIT')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'DEPOSIT'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            Top-up Working Capital
          </button>
        </div>

        {notification && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-950/80 border border-emerald-800 px-4 py-2.5 text-xs font-bold text-emerald-300">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab 1: Ledger */}
        {activeTab === 'LEDGER' && (
          <div className="mt-4 space-y-3">
            {userTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No wallet transactions recorded yet.
              </div>
            ) : (
              userTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        tx.type === 'CREDIT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {tx.type === 'CREDIT' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{tx.description}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{tx.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'CREDIT' ? '+' : '-'} PKR {tx.amountPKR.toLocaleString()}
                    </span>
                    <div className="text-[9px] text-slate-500 font-semibold">{tx.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Withdraw */}
        {activeTab === 'WITHDRAW' && (
          <form onSubmit={handleWithdraw} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300">Withdrawal Amount (PKR)</label>
              <input
                type="number"
                min="500"
                max={currentUser.walletBalancePKR}
                step="100"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-0.5 text-[10px] text-slate-500">
                Max available: PKR {currentUser.walletBalancePKR.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300">Bank / Microfinance</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Meezan Bank Ltd">Meezan Bank</option>
                  <option value="Habib Bank Limited (HBL)">HBL</option>
                  <option value="Bank Alfalah">Bank Alfalah</option>
                  <option value="SadaPay Commercial">SadaPay</option>
                  <option value="NayaPay Microfinance">NayaPay</option>
                  <option value="JazzCash Merchant">JazzCash</option>
                  <option value="EasyPaisa Business">EasyPaisa</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Account Title</label>
                <input
                  type="text"
                  required
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300">IBAN / Account Number</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow transition"
              >
                Submit Instant 1-Link Raast Payout
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Deposit */}
        {activeTab === 'DEPOSIT' && (
          <form onSubmit={handleDeposit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300">Top-up Amount (PKR)</label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono font-bold text-purple-300 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-purple-900/50 bg-purple-950/20 p-3 text-[11px] text-purple-300">
              Top-up your wallet balance to pre-fund wholesale volume orders or cover operational reserves.
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white shadow transition"
            >
              Simulate Deposit of PKR {depositAmount.toLocaleString()}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
