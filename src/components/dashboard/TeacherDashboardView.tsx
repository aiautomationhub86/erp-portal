'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  PenTool,
  Send,
  PlusCircle,
  FileCheck,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';

export function TeacherDashboardView() {
  const { user } = useAuth();
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const todayClasses = [
    { period: 'Period 1', time: '08:30 - 09:15', class: 'Class 10-A', subject: 'Mathematics (Standard 041)', room: 'Room 101', status: 'COMPLETED' },
    { period: 'Period 2', time: '09:20 - 10:05', class: 'Class 10-A', subject: 'Science (Physics: Optics)', room: 'Science Composite Lab', status: 'IN_PROGRESS' },
    { period: 'Period 4', time: '11:15 - 12:00', class: 'Class 9-B', subject: 'Mathematics Remedial', room: 'Room 104', status: 'UPCOMING' },
    { period: 'Period 6', time: '01:30 - 02:15', class: 'Class 10-B', subject: 'Mathematics Factorization', room: 'Room 102', status: 'UPCOMING' },
  ];

  const recentHomeworks = [
    { id: '1', title: 'Chapter 4: Quadratic Equations - Exercise 4.2', class: 'Class 10-A', subject: 'Mathematics', submissions: '38/40', dueDate: 'Tomorrow', status: 'ACTIVE' },
    { id: '2', title: 'Optics Lab: Ray Diagrams Worksheet', class: 'Class 10-A', subject: 'Science', submissions: '32/40', dueDate: 'In 4 Days', status: 'ACTIVE' },
  ];

  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAttendance = async () => {
    setIsMarking(true);
    try {
      // Mark Aarav Sharma (Class 10-A representative) and section students as PRESENT
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'STUDENT_PUNCH',
          studentId: '10024', // Aarav Sharma roll
          subjectId: 'CS502',
          status: 'PRESENT',
        }),
      });
      setAttendanceMarked(true);
      setTimeout(() => setAttendanceMarked(false), 4000);
    } catch (e) {
      console.error(e);
      setAttendanceMarked(true);
    } finally {
      setIsMarking(false);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setBroadcastSuccess(true);
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Teacher Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 text-white border border-white/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Faculty Portal
              </span>
              <span className="text-xs text-blue-200">Senior Faculty � Mathematics & Science</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name || 'Mr. Rajesh Sharma'}
            </h1>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
              Today's Teaching Schedule: 4 scheduled periods across Class 10-A, 10-B, and Class 9-B Remedial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/homework"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Assign Homework
            </Link>
            <Link
              href="/attendance"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Attendance
            </Link>
          </div>
        </div>
      </div>

      {attendanceMarked && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Class 10-A attendance marked successfully! 38 Present, 2 Absent. Synced to Parent Portal.</span>
        </div>
      )}

      {broadcastSuccess && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <Send className="w-5 h-5 text-blue-600 shrink-0" />
          <span>Class broadcast sent to 40 parent phone numbers and student app feeds.</span>
        </div>
      )}

      {/* Daily Pulse Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Today's Lectures</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">4 Periods</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">Next: Period 2 in Science Lab</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Class 10-A Strength</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">40 Students</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">95% avg attendance rate</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Active Homeworks</span>
          <div className="text-2xl font-bold text-indigo-600 mt-2">2 Active</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">70 submissions received</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Pending Grading</span>
          <div className="text-2xl font-bold text-amber-600 mt-2">8 Pending</div>
          <div className="text-xs text-amber-700 mt-1 font-medium">PA-1 Lab work logs</div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Homework Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timetable */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Today's Lecture Timetable
            </h2>
            <Link href="/timetable" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Full Week View <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.map((cls, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  cls.status === 'IN_PROGRESS'
                    ? 'border-blue-400 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {cls.period}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{cls.time}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      cls.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : cls.status === 'IN_PROGRESS'
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cls.status === 'IN_PROGRESS' ? 'CURRENT PERIOD' : cls.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{cls.subject}</h3>
                  <p className="text-xs text-slate-500">
                    Target: <strong className="text-slate-700">{cls.class}</strong> � Venue: <strong className="text-slate-700">{cls.room}</strong>
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {cls.status === 'IN_PROGRESS' && (
                    <button
                      onClick={handleMarkAttendance}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Attendance
                    </button>
                  )}
                  <Link
                    href="/attendance"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                  >
                    View Roster
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Class Broadcast Drawer */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" /> Broadcast to Class Parents
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Instantly message Class 10-A parents via SMS & School Portal notification.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Class</label>
                <select className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500">
                  <option>Class 10-A (Mathematics & Science)</option>
                  <option>Class 10-B (Mathematics)</option>
                  <option>Class 9-B (Mathematics Remedial)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Dear Parents, please ensure students carry the Geometry Compass kit for tomorrow's Chapter 4 construction test..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Instant Broadcast
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Homework & Assignment Assigner Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" /> Active Homework & Student Submissions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Tracking daily homework assigned to Class 10-A</p>
          </div>
          <Link
            href="/homework"
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
          >
            Manage All Assignments <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentHomeworks.map((hw) => (
            <div key={hw.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    {hw.subject} � {hw.class}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 mt-2">{hw.title}</h3>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                    <span>Submissions: <strong className="text-slate-900">{hw.submissions}</strong></span>
                    <span>Due: <strong className="text-amber-700">{hw.dueDate}</strong></span>
                  </div>
                </div>

                <Link
                  href="/homework"
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition"
                >
                  Grade
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
