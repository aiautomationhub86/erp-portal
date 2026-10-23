'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  IndianRupee,
  Receipt,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  X,
  School,
  QrCode,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function FeesPage() {
  const { activeRole } = useAuth();
  const [data, setData] = useState<any>({ categories: [], studentFees: [], recentTransactions: [] });
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFeeForPay, setSelectedFeeForPay] = useState<any | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fees');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentFeeId: selectedFeeForPay.id,
          amountPaid: payAmount,
          paymentMode: payMode,
        }),
      });
      if (res.ok) {
        setShowPayModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" /> Module 9 • Fee Structure, Billing &amp; Receipts
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Fees &amp; Financial Ledger</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Manage semester fee heads, record payments, and generate official stamped fee receipts.
          </p>
        </div>

        <button
          onClick={() => {
            const firstDue = data.studentFees?.find((f: any) => f.dueAmount > 0);
            if (firstDue) {
              setSelectedFeeForPay(firstDue);
              setPayAmount(firstDue.dueAmount.toString());
              setShowPayModal(true);
            }
          }}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 transition-all"
        >
          <IndianRupee className="w-4 h-4" /> Record / Pay Fee
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 no-print">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Fee Billed</span>
          <div className="text-2xl font-extrabold text-slate-800 mt-2">₹105,500</div>
          <p className="text-xs text-slate-500 mt-1">Tuition + Hostel + Exam Heads</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Collected</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">₹93,000</div>
          <p className="text-xs text-emerald-600 mt-1">88.2% Realized</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Due Balance</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">₹12,500</div>
          <p className="text-xs text-amber-700 mt-1">Examination Fee (Due 29-Sep)</p>
        </div>
      </div>

      {/* Student Fee Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="p-4 bg-slate-50 border-b font-bold text-xs text-slate-700">
          Student Fee Ledger &amp; Due Dates
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Fee Head</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Due Balance</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.studentFees?.map((fee: any) => (
                <tr key={fee.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {fee.student?.user?.name || 'Rahul Kumar'}
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {fee.student?.rollNumber || '23CSE1023'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{fee.feeCategory?.name}</td>
                  <td className="py-3.5 px-4 font-bold">₹{fee.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold">₹{fee.paidAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${fee.dueAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      ₹{fee.dueAmount?.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        fee.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {fee.dueAmount > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedFeeForPay(fee);
                          setPayAmount(fee.dueAmount.toString());
                          setShowPayModal(true);
                        }}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Pay Due
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const txn = fee.transactions?.[0] || {
                            receiptNo: 'REC-2026-9041',
                            amountPaid: fee.paidAmount,
                            paymentDate: new Date(),
                            paymentMode: 'NET_BANKING',
                          };
                          setSelectedReceipt({ fee, txn });
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" /> Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Fee Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-8 animate-in zoom-in-95 printable-area space-y-6">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <School className="w-8 h-8 text-blue-700" />
                <div>
                  <h2 className="text-base font-extrabold uppercase text-slate-900">
                    CAMPUS INSTITUTE OF TECHNOLOGY
                  </h2>
                  <p className="text-xs text-slate-500">Official Fee Payment Receipt</p>
                </div>
              </div>
              <div className="text-right no-print">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Receipt Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedReceipt.txn?.receiptNo || 'REC-2026-9041'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Date</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedReceipt.txn?.paymentDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-bold text-slate-900">
                  {selectedReceipt.fee?.student?.user?.name || 'Rahul Kumar'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll Number</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedReceipt.fee?.student?.rollNumber || '23CSE1023'}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700">
                  <tr>
                    <th className="p-3">Description / Fee Head</th>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">
                      {selectedReceipt.fee?.feeCategory?.name || 'Semester Tuition Fee'}
                    </td>
                    <td className="p-3 font-mono">{selectedReceipt.txn?.paymentMode || 'NET_BANKING'}</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹{(selectedReceipt.txn?.amountPaid || 65000).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <QrCode className="w-10 h-10 text-slate-700" />
                <span className="text-[10px]">Verified Digital Transaction</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-slate-700">Authorized Accounts Officer</span>
                <span className="text-[10px]">Accounts &amp; Finance Desk</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Record Fee Payment</h2>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePay} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fee Item</label>
                <input
                  type="text"
                  disabled
                  value={selectedFeeForPay?.feeCategory?.name || 'Semester Fee'}
                  className="w-full p-2.5 bg-slate-100 border rounded-lg text-slate-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount to Pay (₹)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-bold text-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="CASH">Cash Deposit</option>
                    <option value="CHEQUE">Cheque / DD</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow"
                >
                  Confirm &amp; Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
