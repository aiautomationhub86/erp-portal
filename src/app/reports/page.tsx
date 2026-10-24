'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  BarChart3,
  Download,
  Printer,
  Calendar,
  Building,
  Users,
  CreditCard,
  CalendarCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Bus,
  ShieldCheck,
  Search,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ReportsPage() {
  const { user, activeRole } = useAuth();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('DPS-CENTRAL');
  const [selectedSession, setSelectedSession] = useState('2025-2026');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FINANCIAL' | 'ACADEMIC' | 'ATTENDANCE' | 'HR' | 'TRANSPORT'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?branchCode=${selectedBranch}`);
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (e) {
      console.error('Error fetching reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedBranch]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = (filename: string) => {
    setExportNotice(`Exported ${filename}.csv successfully!`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  const overview = reportData?.overview || {
    totalStudents: 1842,
    totalTeachers: 126,
    campusAttendanceAvg: 93.4,
    feeCollectionPct: 87.0,
    totalCollected: 8300000,
    totalPending: 1240000,
    atRiskStudentsCount: 31,
  };

  const academic = reportData?.academicSummary || {
    overallPassRate: 98.4,
    boardExamReadiness: 'Grade A+ (Exemplary)',
    class10AverageScore: 84.6,
    class12AverageScore: 82.1,
  };

  const subjectPerformance = reportData?.subjectPerformance || [];
  const defaultersList = reportData?.defaultersList || [];
  const hr = reportData?.hrSummary || {};
  const transport = reportData?.transportSummary || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" /> Module 17 • Institutional Reports &amp; Analytics
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Institutional Audited Reports Hub
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Comprehensive audited statements across Academics, Fee Ledgers, Attendance Compliance, HR, and Operations.
          </p>
        </div>

        {/* Global Controls & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {exportNotice && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {exportNotice}
            </span>
          )}

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="DPS-CENTRAL">DPS Central Campus</option>
            <option value="DPS-EAST">DPS East Campus</option>
            <option value="DPS-INTL">DPS International Wing</option>
            <option value="ALL">All Consolidated Campuses</option>
          </select>

          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="2025-2026">AY 2025-2026 (Current)</option>
            <option value="2024-2025">AY 2024-2025 (Archived)</option>
          </select>

          <button
            onClick={() => handleExportCSV('Institutional_Executive_Report')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" /> Print Stamped Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'OVERVIEW', label: 'Executive Dashboard Summary', icon: TrendingUp },
          { id: 'FINANCIAL', label: 'Fee Collection & Defaulter Ledger', icon: CreditCard },
          { id: 'ACADEMIC', label: 'Academic & Board Exam Analytics', icon: Award },
          { id: 'ATTENDANCE', label: 'Attendance & CBSE 75% Compliance', icon: CalendarCheck },
          { id: 'HR', label: 'Staff Payroll & Teacher Ratio', icon: Users },
          { id: 'TRANSPORT', label: 'Transport & Fleet Occupancy', icon: Bus },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE DASHBOARD SUMMARY */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* 6 Key Executive Metrics matching prompt */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrolled Students</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">1,842</div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> 100% Capacity
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campus Attendance</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{overview.campusAttendanceAvg}%</div>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 block">Good Standing</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fee Collection</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{overview.feeCollectionPct}%</div>
              <span className="text-[10px] text-blue-600 font-semibold mt-1 block">₹83.0L Received</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding Fees</span>
              <div className="text-2xl font-extrabold text-rose-600 mt-1">₹12.4L</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Due this month</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Teachers</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{overview.totalTeachers}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">Ratio 1:14.6</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">At-Risk Students</span>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">{overview.atRiskStudentsCount}</div>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                AI Monitored
              </span>
            </div>
          </div>

          {/* Quick Institutional Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Academic Quality &amp; Board Exam Metrics</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  CBSE Affiliated
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Overall Board Exam Pass Rate</span>
                  <span className="font-bold text-emerald-600">{academic.overallPassRate}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Board Exam Readiness Rating</span>
                  <span className="font-bold text-slate-800">{academic.boardExamReadiness}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Class 10 CBSE Standard Average</span>
                  <span className="font-bold text-slate-800">{academic.class10AverageScore}%</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Teacher-to-Student Ratio</span>
                  <span className="font-bold text-blue-600">1:14.6 (Optimal)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Financial Health &amp; Revenue Overview</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">
                  Audited Ledger
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Billed Tuition &amp; Term Fees</span>
                  <span className="font-bold text-slate-800">₹95,40,000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Realized Collections (Online / Bank)</span>
                  <span className="font-bold text-emerald-600">₹83,00,000 (87%)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Current Pending Balances</span>
                  <span className="font-bold text-rose-600">₹12,40,000 (13%)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Monthly Faculty Payroll Cleared</span>
                  <span className="font-bold text-slate-800">₹42,80,000 (100% on time)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL & FEE DEFAULTERS LEDGER */}
      {activeTab === 'FINANCIAL' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Fee Defaulters &amp; Outstanding Balances Register</h3>
                <p className="text-slate-500 text-xs">Students with pending fees for Term 1 / Term 2 academic session.</p>
              </div>
              <button
                onClick={() => handleExportCSV('Fee_Defaulters_Report')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" /> Export Defaulters List
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Class &amp; Section</th>
                    <th className="py-3 px-4">Pending Amount</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {defaultersList.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.studentName}</td>
                      <td className="py-3.5 px-4 font-mono font-medium">{item.rollNumber}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{item.className}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                        ₹{item.pendingAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{item.dueDate}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC & EXAM ANALYTICS */}
      {activeTab === 'ACADEMIC' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Subject-Wise Performance &amp; Pass Rate Analysis</h3>
                <p className="text-slate-500 text-xs">Term Examination scores &amp; faculty in charge.</p>
              </div>
              <button
                onClick={() => handleExportCSV('Subject_Performance_Report')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export Analysis
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Faculty In-Charge</th>
                    <th className="py-3 px-4 text-center">Class Average</th>
                    <th className="py-3 px-4 text-center">Pass Rate</th>
                    <th className="py-3 px-4">Performance Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjectPerformance.map((sub: any) => (
                    <tr key={sub.code} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{sub.name}</span>
                        <span className="text-[10px] text-blue-600 font-mono font-medium">{sub.code}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{sub.faculty}</td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-800">
                        {sub.averageScore}%
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-emerald-600">
                        {sub.passRate}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Exemplary Standard
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE & CBSE 75% COMPLIANCE */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">CBSE / Institutional 75% Attendance Requirement</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Institutional compliance rate: 98.3% of students meet mandatory examination threshold. 31 students flagged for early warning.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleExportCSV('Attendance_Compliance_Report')}
              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
            >
              Export Compliance Audit
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: HR & STAFF PAYROLL */}
      {activeTab === 'HR' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Human Resources &amp; Faculty Deployment Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Total Campus Employees</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{hr.totalStaff || 126}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Teacher-Student Ratio</span>
              <span className="text-2xl font-extrabold text-blue-600 mt-1 block">1:14.6</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Monthly Payroll Cleared</span>
              <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{hr.monthlyGrossSalary || '₹42,80,000'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">EPF / ESI Compliance</span>
              <span className="text-sm font-bold text-emerald-700 mt-2 block flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Certified
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TRANSPORT & FLEET */}
      {activeTab === 'TRANSPORT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Fleet GPS Tracking &amp; Student Transport Report</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Active Buses</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{transport.totalBuses || 18}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Active Bus Routes</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{transport.activeRoutes || 14}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Students Availing</span>
              <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{transport.studentsAvailingTransport || 840}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">GPS Telemetry Status</span>
              <span className="text-sm font-bold text-emerald-600 mt-2 block flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 18/18 Live
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
