'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Users,
  IndianRupee,
  FileSpreadsheet,
  Download,
  PlusCircle,
  CheckCircle2,
  Printer,
  Calendar,
  Building,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

export default function PayrollPage() {
  const { activeRole, user } = useAuth();
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [month, setMonth] = useState('September 2026');
  const [basic, setBasic] = useState('55000');
  const [allowances, setAllowances] = useState('18000');
  const [deductions, setDeductions] = useState('5000');

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payroll');
      if (res.ok) {
        const data = await res.json();
        setPayrolls(data.payrolls || []);
        setTeachers(data.teachers || []);
        if (data.teachers?.length > 0) {
          setSelectedTeacherId(data.teachers[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleCreatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedTeacherId,
          month,
          basicSalary: basic,
          allowances,
          deductions,
        })
      });

      if (res.ok) {
        setStatusMsg('Monthly payslip generated and disbursement scheduled!');
        setIsGenerateModalOpen(false);
        fetchPayroll();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalMonthlyPayroll = payrolls.reduce((acc, p) => acc + (p.netSalary || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Human Resources &amp; Payroll
              </span>
              <span className="text-xs text-slate-300">126 Total Teaching &amp; Administrative Staff</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Faculty &amp; Staff Payroll Management
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Automated salary slip generation, allowances, tax deductions, and official printable payslip disbursements.
            </p>
          </div>

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Generate Payslip
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Summary Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Faculty &amp; Staff</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">126</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">100% Biometric Active</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">August Payroll Disbursed</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">?7.80 Lakhs</div>
          <div className="text-xs text-slate-500 mt-1">126 Net Direct Transfers</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Average Faculty Salary</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">?63,200</div>
          <div className="text-xs text-blue-700 mt-1 font-medium">7th Pay Commission Scale</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Allowances (DA/HRA)</span>
          <div className="text-2xl font-bold text-indigo-600 mt-2">?1.85 Lakhs</div>
          <div className="text-xs text-slate-500 mt-1">Medical + Transport</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Recent Payslip Records
          </h2>
          <span className="text-xs text-slate-500">{payrolls.length} Payslips</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Payslip No</th>
                <th className="py-2.5 px-3">Teacher / Staff</th>
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Basic Pay</th>
                <th className="py-2.5 px-3">Allowances</th>
                <th className="py-2.5 px-3">Deductions</th>
                <th className="py-2.5 px-3">Net Salary</th>
                <th className="py-2.5 px-3">Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrolls.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {p.payslipNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{p.teacher?.user?.name || 'Faculty Member'}</div>
                    <div className="text-[10px] text-slate-400">{p.teacher?.designation || 'Senior Faculty'} ({p.teacher?.employeeId || 'EMP-101'})</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{p.month}</td>
                  <td className="py-3 px-3">?{p.basicSalary?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-emerald-600">+?{p.allowances?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-rose-600">-?{p.deductions?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ?{p.netSalary?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => setSelectedPayslip(p)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                      title="View &amp; Print Payslip"
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

      {/* Generate Payslip Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" /> Generate Staff Payslip
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Disburses salary and logs official payroll transaction in the school accounting ledger.
            </p>

            <form onSubmit={handleCreatePayroll} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Faculty Member</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.user?.name} ({t.employeeId} - {t.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payroll Month</label>
                <input
                  type="text"
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="September 2026"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Basic Salary (?)</label>
                  <input
                    type="number"
                    required
                    value={basic}
                    onChange={(e) => setBasic(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Allowances (?)</label>
                  <input
                    type="number"
                    value={allowances}
                    onChange={(e) => setAllowances(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Deductions (?)</label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between font-bold text-sm">
                <span>Calculated Net Salary:</span>
                <span className="text-emerald-700">
                  ?{((parseFloat(basic) || 0) + (parseFloat(allowances) || 0) - (parseFloat(deductions) || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-sm"
                >
                  Generate &amp; Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="border-b-2 border-slate-800 pb-3 text-center">
              <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                Delhi Public International School
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">Monthly Salary Payslip � {selectedPayslip.month}</p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Payslip No:</span>
                <span className="font-mono font-bold text-slate-900">{selectedPayslip.payslipNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employee:</span>
                <span className="font-bold text-slate-900">{selectedPayslip.teacher?.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designation:</span>
                <span className="font-medium text-slate-800">{selectedPayslip.teacher?.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Basic Pay:</span>
                <span className="font-medium text-slate-800">?{selectedPayslip.basicSalary?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allowances:</span>
                <span className="text-emerald-600 font-medium">+?{selectedPayslip.allowances?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deductions (TDS/PF):</span>
                <span className="text-rose-600 font-medium">-?{selectedPayslip.deductions?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-900">Net Disbursed Salary:</span>
                <span className="text-emerald-700">?{selectedPayslip.netSalary?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="my-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-emerald-600 border-dashed flex items-center justify-center text-[8px] font-bold text-emerald-700 uppercase tracking-tighter mx-auto">
                  DPIS HR<br />VERIFIED
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif italic text-xs text-slate-700">Shailaja Mehra</div>
                <div className="text-[9px] text-slate-500">Principal &amp; Signatory</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedPayslip(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setSelectedPayslip(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
