'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  FileSpreadsheet,
  IndianRupee,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Building,
  Receipt,
  Search,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AccountsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState('EXPENSE');
  const [category, setCategory] = useState('INFRASTRUCTURE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          category,
          amount,
          description,
          paymentMode,
        })
      });

      if (res.ok) {
        setStatusMsg('New voucher logged in double-entry daybook ledger!');
        setIsVoucherModalOpen(false);
        setAmount('');
        setDescription('');
        fetchTransactions();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" /> Double-Entry Daybook Ledger
              </span>
              <span className="text-xs text-emerald-200">Financial Year 2026-27</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Accounting, Vouchers &amp; Daybook
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-2xl">
              Track multi-campus institutional revenue inflows, staff payroll disbursements, maintenance bills, and audit vouchers.
            </p>
          </div>

          <button
            onClick={() => setIsVoucherModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Create Voucher
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* 4 Financial Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Recorded Inflows</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            ?{(totalIncome / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-slate-500 mt-1">Tuition Fees &amp; Grants</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Recorded Expenses</span>
          <div className="text-2xl font-bold text-rose-600 mt-2">
            ?{(totalExpense / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-slate-500 mt-1">Salaries, Infrastructure, Fuel</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Net Operating Cashflow</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ?{((totalIncome - totalExpense) / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Positive Surplus</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Audit Status</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">Compliant</div>
          <div className="text-xs text-blue-700 mt-1 font-medium">CBSE Audit Reconciled</div>
        </div>
      </div>

      {/* Daybook Voucher Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Daybook Voucher Entries
          </h2>
          <span className="text-xs text-slate-500">{transactions.length} Verified Vouchers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Voucher No</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {tx.voucherNo}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{tx.category}</td>
                  <td className="py-3 px-3 text-slate-600 max-w-sm">{tx.description}</td>
                  <td className={`py-3 px-3 font-bold ${
                    tx.type === 'INCOME' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {tx.type === 'INCOME' ? '+' : '-'}?{tx.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                      {tx.paymentMode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" /> Log Daybook Voucher
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter official income or operational expenditure entry.
            </p>

            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Transaction Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                  >
                    <option value="EXPENSE">Expense (Debit)</option>
                    <option value="INCOME">Income (Credit)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Accounting Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                  >
                    <option value="FEE_COLLECTION">Fee Collections</option>
                    <option value="SALARIES">Staff Salaries</option>
                    <option value="INFRASTRUCTURE">Campus Infrastructure &amp; Labs</option>
                    <option value="TRANSPORT_FUEL">Bus Transport &amp; Fuel</option>
                    <option value="UTILITIES">Electricity &amp; Internet Utilities</option>
                    <option value="SPORTS_EVENTS">Sports &amp; Annual Function</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount (?)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Particulars</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. High-speed Campus Fiber Lease line payment Q2"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                >
                  <option value="BANK_TRANSFER">NEFT / RTGS Bank Transfer</option>
                  <option value="UPI">UPI / Net Banking</option>
                  <option value="CHEQUE">Cheque Clearance</option>
                  <option value="CASH">Petty Cash Counter</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-sm"
                >
                  Record Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
