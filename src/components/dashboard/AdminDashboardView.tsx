'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Users,
  GraduationCap,
  Building,
  Layers,
  CalendarCheck2,
  IndianRupee,
  BellRing,
  Activity,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const attendanceTrend = [
  { day: 'Mon', students: 92, teachers: 98 },
  { day: 'Tue', students: 95, teachers: 96 },
  { day: 'Wed', students: 89, teachers: 94 },
  { day: 'Thu', students: 94, teachers: 100 },
  { day: 'Fri', students: 96, teachers: 97 },
  { day: 'Sat', students: 88, teachers: 92 },
];

const deptDistribution = [
  { name: 'CSE', students: 480, color: '#3b82f6' },
  { name: 'ECE', students: 340, color: '#6366f1' },
  { name: 'MECH', students: 260, color: '#10b981' },
  { name: 'CIVIL', students: 180, color: '#f59e0b' },
  { name: 'MBA', students: 160, color: '#ec4899' },
];

const recentActivities = [
  {
    id: '1',
    user: 'Prof. Alok Verma',
    action: 'Approved semester examination schedule for B.Tech',
    time: '12 mins ago',
    badge: 'Exam',
  },
  {
    id: '2',
    user: 'Rajesh Verma (Accountant)',
    action: 'Generated fee receipt #REC-2026-9042 for Rahul Kumar',
    time: '45 mins ago',
    badge: 'Fees',
  },
  {
    id: '3',
    user: 'Dr. Arvind Sharma (HOD)',
    action: 'Marked Section 5-A DBMS attendance (92% present)',
    time: '1 hour ago',
    badge: 'Attendance',
  },
  {
    id: '4',
    user: 'Vikram Malhotra',
    action: 'Posted new placement drive: Google India (28.5 LPA)',
    time: '3 hours ago',
    badge: 'Placement',
  },
];

export default function AdminDashboardView() {
  const { user, activeRole } = useAuth();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Executive Administration
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {activeRole === 'SUPER_ADMIN' ? 'Super Admin Control Center' : 'College Admin Overview'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              Comprehensive operational status for Academic Year 2026-27
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/students"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Student
            </Link>
            <Link
              href="/academics"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Building className="w-3.5 h-3.5" /> Manage Batches
            </Link>
            <Link
              href="/notices"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <BellRing className="w-3.5 h-3.5" /> Broadcast Notice
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards (All from User Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Students</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-2">1,420</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +140 this year
          </p>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Faculty</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-2">128</div>
          <p className="text-[10px] text-slate-500 mt-1">1:11 Ratio</p>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Departments</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-2">6</div>
          <p className="text-[10px] text-slate-500 mt-1">24 Programs</p>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Attendance</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">94.2%</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">1,338 Present</p>
        </div>

        {/* Pending Fees */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Fee Dues</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">₹14.8L</div>
          <p className="text-[10px] text-amber-600 font-medium mt-1">92% Collected</p>
        </div>

        {/* Active Notices */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Notices</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-600 mt-2">8</div>
          <p className="text-[10px] text-slate-500 mt-1">2 Urgent pinned</p>
        </div>
      </div>

      {/* Analytics Charts & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trends Bar/Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Weekly Attendance Overview (%)</h2>
              <p className="text-xs text-slate-500">Student vs Faculty Daily Presence</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Students
              </span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Faculty
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="teachers" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Enrollment Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Department Enrollment</h2>
            <p className="text-xs text-slate-500 mb-4">Total 1,420 Enrolled Students</p>

            <div className="space-y-3">
              {deptDistribution.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{d.name}</span>
                    <span>{d.students} students ({Math.round((d.students / 1420) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${(d.students / 1420) * 100}%`,
                        backgroundColor: d.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Highest enrolled:</span>
            <span className="font-bold text-blue-600">CSE Department (34%)</span>
          </div>
        </div>
      </div>

      {/* Quick Access Grid for Admin & Live System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Quick Nav */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Management Modules
            </h2>
            <span className="text-xs text-slate-400">All 15 System Services</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/students"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group"
            >
              <Users className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">Students</div>
              <div className="text-[11px] text-slate-400">Admissions & Profiles</div>
            </Link>

            <Link
              href="/faculty"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left group"
            >
              <GraduationCap className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">Faculty</div>
              <div className="text-[11px] text-slate-400">Staff & Workload</div>
            </Link>

            <Link
              href="/attendance"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group"
            >
              <CalendarCheck2 className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">Attendance</div>
              <div className="text-[11px] text-slate-400">Shortage & Reports</div>
            </Link>

            <Link
              href="/academics"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all text-left group"
            >
              <Building className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">Academics</div>
              <div className="text-[11px] text-slate-400">Depts & Subjects</div>
            </Link>

            <Link
              href="/timetable"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition-all text-left group"
            >
              <Layers className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">Timetable</div>
              <div className="text-[11px] text-slate-400">Conflict Detection</div>
            </Link>

            <Link
              href="/examinations"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition-all text-left group"
            >
              <FileSpreadsheet className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">Exams & Marks</div>
              <div className="text-[11px] text-slate-400">GPA & Results</div>
            </Link>

            <Link
              href="/fees"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/40 transition-all text-left group"
            >
              <IndianRupee className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">Fees & Ledger</div>
              <div className="text-[11px] text-slate-400">Online Receipts</div>
            </Link>

            <Link
              href="/settings"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-500 hover:bg-slate-50 transition-all text-left group"
            >
              <Activity className="w-5 h-5 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800">System Logs</div>
              <div className="text-[11px] text-slate-400">Audit & Backups</div>
            </Link>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800">Recent Activity</h2>
            </div>
            <Link href="/settings" className="text-xs text-blue-600 hover:underline">
              Audit Logs
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">{act.user}</span>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-snug">{act.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
