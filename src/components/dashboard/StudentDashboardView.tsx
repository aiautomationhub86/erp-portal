'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  CalendarCheck2,
  Award,
  IndianRupee,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  FileText,
  CreditCard,
  BellRing,
  BookOpen,
  ArrowRight,
  Sparkles,
  Building,
  Bus,
  Briefcase,
  AlertCircle,
  Fingerprint,
} from 'lucide-react';

export default function StudentDashboardView() {
  const { user } = useAuth();
  const sp = user?.studentProfile;

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner matching prompt */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Rahul Kumar'}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold tracking-wide uppercase mb-1">
                <Sparkles className="w-3 h-3" /> Student Portal
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome, {user?.name || 'Rahul Kumar'}
              </h1>
              <p className="text-blue-200 text-xs sm:text-sm mt-0.5 font-medium flex flex-wrap items-center gap-2">
                <span>{sp?.departmentCode || 'CSE'}</span>
                <span>•</span>
                <span>Semester {sp?.semesterNum || 5}</span>
                <span>•</span>
                <span className="font-mono bg-blue-800/60 px-2 py-0.5 rounded text-white text-xs">
                  Roll No: {sp?.rollNumber || '23CSE1023'}
                </span>
                <span>•</span>
                <span className="text-blue-300 text-xs">Sec: {sp?.sectionName || 'A'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              href="/examinations"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" /> Grade Card
            </Link>
            <Link
              href="/fees"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" /> Pay Due Fees
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Core Highlight Cards: Attendance, CGPA, Pending Fees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Attendance Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {sp?.attendancePercent || 87.5}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${sp?.attendancePercent || 87.5}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Minimum required: 75.0% (Eligible for exams)
            </p>
          </div>
        </div>

        {/* CGPA Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative CGPA</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {sp?.cgpa || 8.42}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((sp?.cgpa || 8.42) / 10) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-2 flex items-center gap-1">
              <span>🌟 Top 5% in CSE Department • 96 Credits</span>
            </p>
          </div>
        </div>

        {/* Pending Fees Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Fees</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-600 tracking-tight">
              ₹{(sp?.pendingFee || 12500).toLocaleString('en-IN')}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: '85%' }}
              />
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Due on 29th Sep (Semester Exam Fee)
            </p>
          </div>
        </div>
      </div>

      {/* Today's Classes & Recent Notices Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes Section (Matching prompt) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800">Today&apos;s Classes &amp; Schedule</h2>
            </div>
            <Link href="/timetable" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              Full Timetable <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* Slot 1 */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-xs font-mono font-bold text-slate-700">
                  09:00 - 10:00
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">DBMS (Database Management Systems)</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> Room 204 • Prof. Sneha Gupta
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Marked: Present
                </span>
                <Link
                  href="/attendance"
                  className="text-[11px] font-bold text-blue-600 hover:underline px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs"
                >
                  Change
                </Link>
              </div>
            </div>

            {/* Slot 2 */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-xs font-mono font-bold text-slate-700">
                  10:00 - 11:00
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Computer Networks</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> Room 301 • Dr. Arvind Sharma (HOD)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Marked: Present
                </span>
                <Link
                  href="/attendance"
                  className="text-[11px] font-bold text-blue-600 hover:underline px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs"
                >
                  Change
                </Link>
              </div>
            </div>

            {/* Slot 3 */}
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-blue-200 text-xs font-mono font-bold text-slate-700">
                  12:00 - 13:00
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Operating Systems</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> Room 205 • Prof. Neha Kapoor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/attendance"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow transition-all"
                >
                  <Fingerprint className="w-3.5 h-3.5" /> Punch / Mark Attendance
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notices (Matching prompt) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-800">Recent Notices</h2>
              </div>
              <Link href="/notices" className="text-xs text-blue-600 font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 transition-colors">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase mb-1">
                  Examination
                </span>
                <h3 className="text-xs font-bold text-slate-800">MST examination schedule released</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Mid semester examination for 5th semester starting next Monday.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 transition-colors">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase mb-1">
                  General
                </span>
                <h3 className="text-xs font-bold text-slate-800">Holiday announcement</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Campus closed on Friday for National Heritage Day.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 transition-colors">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase mb-1">
                  Placement
                </span>
                <h3 className="text-xs font-bold text-slate-800">Placement drive by XYZ Ltd.</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Full-stack engineering recruitment drive. Eligible: CGPA ≥ 7.0.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Tiles (Matching prompt) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Quick Access Modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link
            href="/attendance"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Attendance</span>
            <span className="text-[10px] text-slate-400 mt-0.5">87.5% Track</span>
          </Link>

          <Link
            href="/examinations"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Results</span>
            <span className="text-[10px] text-slate-400 mt-0.5">CGPA 8.42</span>
          </Link>

          <Link
            href="/fees"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Fees</span>
            <span className="text-[10px] text-slate-400 mt-0.5">₹12,500 Due</span>
          </Link>

          <Link
            href="/timetable"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Timetable</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Weekly Matrix</span>
          </Link>

          <Link
            href="/notices"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BellRing className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Notices</span>
            <span className="text-[10px] text-slate-400 mt-0.5">3 Unread</span>
          </Link>

          <Link
            href="/library"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Library</span>
            <span className="text-[10px] text-slate-400 mt-0.5">2 Books Loaned</span>
          </Link>
        </div>
      </div>

      {/* Campus Life Status: Hostel, Bus Pass & Placement Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Hostel Allocation</span>
            <h3 className="text-sm font-bold text-slate-800">Tagore Bhawan (Room 204)</h3>
            <p className="text-[11px] text-emerald-600 font-medium">Bed #1 • Status: Active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Transport Pass</span>
            <h3 className="text-sm font-bold text-slate-800">Route #12 (Downtown Express)</h3>
            <p className="text-[11px] text-slate-500">Bus: DL-01-AB-1234 • Valid</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Placement Status</span>
            <h3 className="text-sm font-bold text-slate-800">XYZ Ltd. (Shortlisted)</h3>
            <p className="text-[11px] text-emerald-600 font-medium">Technical Round Scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
