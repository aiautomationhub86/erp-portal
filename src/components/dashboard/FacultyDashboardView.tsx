'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  Clock,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function FacultyDashboardView() {
  const { user, activeRole } = useAuth();
  const isHOD = activeRole === 'HOD';

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20"
            />
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700/60 text-emerald-100 text-xs font-semibold mb-1">
                {isHOD ? 'Head of Department' : 'Faculty Member'}
              </span>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-emerald-200 text-xs sm:text-sm">
                Department of Computer Science & Engineering • ID: {user?.teacherProfile?.employeeId || 'FAC-CSE-014'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/attendance"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" /> Mark Class Attendance
            </Link>
            <Link
              href="/leaves"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" /> Apply Leave
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Assigned Subjects</span>
          <div className="text-2xl font-bold text-slate-800 mt-2">2 Courses</div>
          <p className="text-xs text-slate-500 mt-1">CS501 (DBMS) &amp; CS505 (Lab)</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Weekly Lecture Hours</span>
          <div className="text-2xl font-bold text-slate-800 mt-2">14 Hours/Wk</div>
          <p className="text-xs text-emerald-600 mt-1">Within optimal workload</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Classes Today</span>
          <div className="text-2xl font-bold text-slate-800 mt-2">2 Lectures</div>
          <p className="text-xs text-blue-600 mt-1">Next: 09:00 AM (Room 204)</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Leave Balance</span>
          <div className="text-2xl font-bold text-slate-800 mt-2">12 Days</div>
          <p className="text-xs text-slate-500 mt-1">Casual &amp; Medical Leaves</p>
        </div>
      </div>

      {/* Today's Schedule & Assigned Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Today&apos;s Teaching Schedule
            </h2>
            <Link href="/timetable" className="text-xs text-blue-600 font-semibold hover:underline">
              Full Schedule
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-800">09:00 - 10:00 AM</span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">Database Management Systems</h3>
                <p className="text-xs text-slate-500">Semester 5 • Section A • Room 204</p>
              </div>
              <Link
                href="/attendance"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Mark Attendance
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-700">14:00 - 16:00 PM</span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">DBMS &amp; SQL Laboratory</h3>
                <p className="text-xs text-slate-500">Semester 5 • Section A • Lab 3</p>
              </div>
              <span className="text-xs font-bold text-slate-400">Upcoming</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" /> Pending Tasks &amp; Marks Entry
            </h2>
            <Link href="/examinations" className="text-xs text-blue-600 font-semibold hover:underline">
              Enter Marks
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800">MST-1 Marks Submission</h3>
                <p className="text-[11px] text-slate-500">CS501 (DBMS) — Section A</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                Completed
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Lab Continuous Evaluation (Internal)</h3>
                <p className="text-[11px] text-slate-500">CS505 (DBMS Lab) — 60 students pending</p>
              </div>
              <Link
                href="/examinations"
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
              >
                Upload Marks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
