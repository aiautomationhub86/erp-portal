'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  IndianRupee,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Download,
  CreditCard,
  Building,
  CheckCircle2,
  Printer,
  Search,
  Filter
} from 'lucide-react';

export function AccountantDashboardView() {
  const { user } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [filterClass, setFilterClass] = useState('ALL');

  const todayTransactions = [
    { id: '1', receiptNo: 'REC-2026-10024', student: 'Aarav Sharma', roll: '10024', class: 'Class 10-A', amount: 24000, mode: 'UPI', date: 'Today, 10:14 AM', category: 'Quarterly Tuition' },
    { id: '2', receiptNo: 'REC-2026-10045', student: 'Ananya Roy', roll: '10045', class: 'Class 10-B', amount: 24000, mode: 'ONLINE', date: 'Today, 09:42 AM', category: 'Quarterly Tuition' },
    { id: '3', receiptNo: 'REC-2026-09018', student: 'Kabir Verma', roll: '9018', class: 'Class 9-A', amount: 8500, mode: 'CASH', date: 'Today, 09:15 AM', category: 'STEM Robotics & Lab' },
    { id: '4', receiptNo: 'REC-2026-11002', student: 'Ishaan Gupta', roll: '11002', class: 'Class 11-SCI', amount: 32000, mode: 'CHEQUE', date: 'Today, 08:50 AM', category: 'Term 1 Composite Fee' },
  ];

  const topDefaulters = [
    { id: '1', student: 'Rohan Mehta', roll: '10025', class: 'Class 10-A', pendingAmount: 24000, daysOverdue: 68, parentPhone: '+91 9822334455' },
    { id: '2', student: 'Simran Kaur', roll: '10026', class: 'Class 10-A', pendingAmount: 8500, daysOverdue: 62, parentPhone: '+91 9833445566' },
    { id: '3', student: 'Tanmay Saxena', roll: '9045', class: 'Class 9-B', pendingAmount: 16500, daysOverdue: 75, parentPhone: '+91 9811009988' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" /> Finance & Billing Desk
              </span>
              <span className="text-xs text-emerald-200">Daily Accounts & Fee Reconciliation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name || 'Mr. Rakesh Gupta'}
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-2xl">
              Today's Collections: ?88,500 across 4 receipts � Overall Term Fee Collection at 87% (?83.0L / ?95.4L).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/fees"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" /> Collect Fee (POS)
            </Link>
            <Link
              href="/accounts"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Daybook Vouchers
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Finance Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Today's Inflow</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">?88,500</div>
          <div className="text-xs text-slate-500 mt-1">4 Cleared Receipts</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Term Collection</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">?83.0 Lakhs</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">87.0% Collection Rate</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Outstanding</span>
          <div className="text-2xl font-bold text-amber-600 mt-2">?12.4 Lakhs</div>
          <div className="text-xs text-amber-700 mt-1 font-medium">134 Defaulters Pending</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Monthly Payroll Dues</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">?7.80 Lakhs</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">126 Staff Disbursed</div>
        </div>
      </div>

      {/* Main Grid: Today's Fee Receipts & Defaulter Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Stamped Receipts */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" /> Recent Stamped Fee Receipts
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Click any receipt to generate official stamped print copy</p>
            </div>
            <Link href="/fees" className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
              All Receipts <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Student & Class</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {tx.receiptNo}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{tx.student}</div>
                      <div className="text-[10px] text-slate-400">{tx.class} (#{tx.roll})</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{tx.category}</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      ?{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                        {tx.mode}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedReceipt(tx)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                        title="Print Stamped Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Defaulter List */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Top Pending Dues
            </h2>
            <span className="text-xs text-amber-800 bg-amber-100 font-semibold px-2 py-0.5 rounded-full">
              134 Overdue
            </span>
          </div>

          <div className="space-y-3">
            {topDefaulters.map((d) => (
              <div key={d.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{d.student}</span>
                    <span className="text-slate-500 text-[11px]">{d.class} (Roll: {d.roll})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-700 block">?{d.pendingAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-rose-600 font-medium">{d.daysOverdue} days overdue</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Parent: {d.parentPhone}</span>
                  <button className="text-blue-600 hover:underline font-semibold">Send SMS Reminder</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Printable Stamped Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="border-b-2 border-slate-800 pb-4 text-center">
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                Delhi Public International School
              </h2>
              <p className="text-xs text-slate-600">Plot 14, Institutional Area, Vasant Kunj, New Delhi - 110070</p>
              <p className="text-[11px] text-slate-500 font-mono">Affiliation No: CBSE/10294 � Official Fee Receipt</p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.student}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class & Roll:</span>
                <span className="font-medium text-slate-800">{selectedReceipt.class} (Roll #{selectedReceipt.roll})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee Category:</span>
                <span className="font-medium text-slate-800">{selectedReceipt.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-medium text-slate-800">{selectedReceipt.mode}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-900">Total Amount Paid:</span>
                <span className="text-emerald-700">?{selectedReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Official Stamp & Signature Simulation */}
            <div className="my-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-600 border-dashed flex items-center justify-center text-[9px] font-bold text-emerald-700 uppercase tracking-tighter mx-auto">
                  DPIS PAID<br />STAMP
                </div>
                <span className="text-[9px] text-slate-400 block mt-1">Verified Digital Stamp</span>
              </div>
              <div className="text-right">
                <div className="font-serif italic text-sm text-slate-700">Rakesh Gupta</div>
                <div className="text-[10px] text-slate-500">Authorized Accounts Officer</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
