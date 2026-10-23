'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  FileText,
  Users,
  Award,
  Sparkles,
  ArrowUpRight,
  Send,
  XCircle,
  TrendingDown,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Printer,
  Download,
  School,
  FileSpreadsheet
} from 'lucide-react';

export function PrincipalDashboardView() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([
    { id: '1', teacher: 'Mrs. Ananya Sen', role: 'TGT English & SST', dates: 'Sep 22 - Sep 24 (3 Days)', reason: 'Medical Specialist Consultation', status: 'PENDING' },
    { id: '2', teacher: 'Dr. Arvind Swamy', role: 'HOD Science', dates: 'Sep 28 (1 Day)', reason: 'CBSE Regional Science Conclave Duty', status: 'PENDING' },
  ]);

  const [alerts, setAlerts] = useState([
    { id: '1', type: 'ACADEMIC', title: 'Class 9-B Mathematics PA-1 Average: 54.2%', desc: 'Class median is 18% lower than standard. Remedial session required.', priority: 'HIGH' },
    { id: '2', type: 'TRANSPORT', title: 'Route 12 GPS Tracking: 12 min Delay', desc: 'Sardar Gurdeep Singh reported heavy traffic at Janakpuri. Parents notified via SMS.', priority: 'MEDIUM' },
    { id: '3', type: 'ATTENDANCE', title: '3 Staff Unexcused Absence', desc: 'Biometric punch missing for 3 auxiliary lab staff members.', priority: 'LOW' },
  ]);

  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleLeaveAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    setActionNotice(`Leave request ${action.toLowerCase()} successfully.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Principal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" /> Level 2 — Principal Operational Desk
              </span>
              <span className="text-xs text-slate-300">DPS Main Central Campus</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Good Morning, {user?.name || 'Mrs. Shailaja Mehra'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Daily Operational Briefing: <strong>121/126 Staff on Duty</strong> • <strong>93.4% Student Attendance</strong> • <strong>2 Pending Approvals</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Operational Reports
            </button>
            <Link
              href="/notices"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Issue Circular
            </Link>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 4 Principal Pulse Counters covering Attendance, Staff, Approvals & Alerts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Teacher Attendance & Staff */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Teacher Attendance</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">121 <span className="text-sm font-normal text-slate-500">/ 126</span></div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">96.0% On-Time Biometric Punch</div>
        </div>

        {/* 2. Student Attendance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Student Attendance</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">1,720 <span className="text-sm font-normal text-slate-500">/ 1,842</span></div>
          <div className="text-xs text-blue-600 mt-1 font-medium">93.4% Daily Punch Rate</div>
        </div>

        {/* 3. Approvals */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">2 Requests</div>
          <div className="text-xs text-amber-700 mt-1 font-medium">Teacher Leaves &amp; Duties</div>
        </div>

        {/* 4. Discipline & Alerts */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Discipline &amp; Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{alerts.length} Active</div>
          <div className="text-xs text-rose-700 mt-1 font-medium">1 Academic Remedial</div>
        </div>
      </div>

      {/* Main Grid: Priority Attention Alerts & Leave Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Attention Alerts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> What Needs Your Attention Today (Discipline &amp; Alerts)
            </h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {alerts.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        alert.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.priority === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.type}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900">{alert.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600">{alert.desc}</p>
                  </div>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-slate-400 hover:text-slate-600 text-xs shrink-0"
                    title="Acknowledge &amp; Dismiss"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Leave & Duty Approvals */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" /> Faculty Leave &amp; Duty Approvals
            </h2>
            <span className="text-xs text-slate-500">2 Pending Review</span>
          </div>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{req.teacher}</h3>
                    <span className="text-[11px] text-slate-500">{req.role}</span>
                    <div className="text-xs text-slate-700 mt-2 font-medium">
                      📅 {req.dates}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Reason: {req.reason}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleLeaveAction(req.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveAction(req.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Performance & Exams Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" /> Academic Performance &amp; Exams Oversight
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Term 1 Periodic Assessment (PA-1) &amp; Syllabus Pacing</p>
            </div>
            <Link
              href="/examinations"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Full Marksheet <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Class 10-A (Secondary)</span>
                <span className="text-slate-500">Subject: Mathematics (Standard 041) • Teacher: Rajesh Sharma</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-600 font-bold text-sm block">91.4% Class Average</span>
                <span className="text-[10px] text-slate-400">Syllabus Paced: 100% On Schedule</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Class 10-A (Secondary)</span>
                <span className="text-slate-500">Subject: Science &amp; Physics (086) • Teacher: Rajesh Sharma</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-600 font-bold text-sm block">88.6% Class Average</span>
                <span className="text-[10px] text-slate-400">Syllabus Paced: 95% On Schedule</span>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-rose-900 block">Class 9-B (Preparatory)</span>
                <span className="text-rose-700">Subject: Mathematics • Remedial Assigned for 18 Students</span>
              </div>
              <div className="text-right">
                <span className="text-rose-600 font-bold text-sm block">54.2% Class Average</span>
                <span className="text-[10px] text-rose-500 font-semibold">Remedial Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff & Subject Workload */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" /> Staff &amp; Workload Monitoring
          </h2>
          <div className="space-y-2">
            <Link
              href="/faculty"
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition"
            >
              <span>Faculty Workload &amp; Subjects</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/timetable"
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition"
            >
              <span>Teacher Substitution Matrix</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/attendance/faculty"
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition"
            >
              <span>Biometric Late Arrival Tracker</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/notices"
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left text-xs font-semibold text-slate-800 flex items-center justify-between transition"
            >
              <span>School Circular Broadcast</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Operational Reports Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Principal Daily Operational Summary Report</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
              <div className="font-bold text-slate-900">DAILY PRINCIPAL LOG — {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className="border-t border-slate-200 pt-2 space-y-1 font-sans">
                <div className="flex justify-between"><span>Total Student Attendance:</span><strong className="text-emerald-700">93.4% (1,720 / 1,842)</strong></div>
                <div className="flex justify-between"><span>Teaching Staff on Duty:</span><strong className="text-emerald-700">96.0% (121 / 126)</strong></div>
                <div className="flex justify-between"><span>Approved Faculty Leaves:</span><strong>5 Staff Members</strong></div>
                <div className="flex justify-between"><span>Class 9-B Remedial Action:</span><strong className="text-rose-600">Active (18 Students)</strong></div>
                <div className="flex justify-between"><span>Discipline &amp; Transport Alerts:</span><strong className="text-amber-600">3 Logged &amp; Addressed</strong></div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  window.print();
                  setIsReportModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Daily Operational Sheet
              </button>
              <button
                onClick={() => {
                  setActionNotice('Principal Daily Report downloaded successfully!');
                  setIsReportModalOpen(false);
                  setTimeout(() => setActionNotice(null), 4000);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Export Summary (.pdf)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
