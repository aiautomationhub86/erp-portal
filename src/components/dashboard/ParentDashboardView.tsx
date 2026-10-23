'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  User,
  GraduationCap,
  CalendarCheck2,
  BookOpen,
  IndianRupee,
  Award,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Send,
  Printer
} from 'lucide-react';

export function ParentDashboardView() {
  const { user } = useAuth();
  const [paySuccess, setPaySuccess] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const ward = {
    name: 'Aarav Sharma',
    class: 'Class 10-A (CBSE)',
    roll: '10024',
    admissionNo: 'ADM-2026-10024',
    attendance: 94.2,
    presentDays: 23,
    totalDays: 25,
    cgpa: 9.4,
    rank: 'Rank 1 in Section',
    pendingFee: 8500,
    paidFee: 24000,
  };

  const homeworkList = [
    { id: '1', title: 'Chapter 4: Quadratic Equations', subject: 'Mathematics', teacher: 'Rajesh Sharma', status: 'EVALUATED', grade: 'A+', feedback: 'Flawless working & clear graphs!' },
    { id: '2', title: 'Optics Lab: Ray Diagrams Worksheet', subject: 'Science (Physics)', teacher: 'Rajesh Sharma', status: 'PENDING_SUBMISSION', dueDate: 'In 4 Days' },
    { id: '3', title: 'Formal Letter to Editor: Climate Action', subject: 'English', teacher: 'Ananya Sen', status: 'PENDING_SUBMISSION', dueDate: 'In 3 Days' },
  ];

  const handlePayFee = () => {
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Ward Header */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold">
              ??
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Parent Portal
                </span>
                <span className="text-xs text-blue-200">DPIS Central Campus</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ward: {ward.name}
              </h1>
              <p className="text-xs text-blue-100/80 mt-0.5">
                {ward.class} � Roll No: #{ward.roll} � Parent: {user?.name || 'Mr. Sanjay Sharma'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReceiptOpen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download Paid Receipt
            </button>
            <button
              onClick={handlePayFee}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
            >
              <IndianRupee className="w-4 h-4" /> Pay Dues (?8,500)
            </button>
          </div>
        </div>
      </div>

      {paySuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Payment of ?8,500 via UPI received successfully! Stamped receipt REC-2026-10025 generated.</span>
        </div>
      )}

      {/* 4 Ward Vital Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Attendance Rate</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{ward.attendance}%</div>
          <div className="text-xs text-slate-500 mt-1">{ward.presentDays} of {ward.totalDays} Days Present</div>
        </div>

        {/* Academic GPA */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Academic Standing</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{ward.cgpa} CGPA</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">{ward.rank}</div>
        </div>

        {/* Fee Due */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Pending Fee</span>
          <div className="text-2xl font-bold text-amber-600 mt-2">?{ward.pendingFee.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-500 mt-1">Smart Lab & STEM Fee</div>
        </div>

        {/* Teacher Remark */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Class Teacher</span>
          <div className="text-base font-bold text-slate-900 mt-2">Mr. Rajesh Sharma</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Exemplary Performance</div>
        </div>
      </div>

      {/* Main Grid: Homework & Assignments & Fee Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Homework Status */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Aarav's Homework & Assignment Tracker
            </h2>
            <span className="text-xs text-slate-500">Class 10-A Daily Feed</span>
          </div>

          <div className="space-y-3">
            {homeworkList.map((hw) => (
              <div
                key={hw.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-700">
                        {hw.subject}
                      </span>
                      <span className="text-xs text-slate-500">Teacher: {hw.teacher}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1.5">{hw.title}</h3>
                    {hw.feedback && (
                      <p className="text-xs text-emerald-700 mt-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        ?? Teacher Feedback: <em>"{hw.feedback}"</em>
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    {hw.status === 'EVALUATED' ? (
                      <div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                          Grade {hw.grade}
                        </span>
                        <span className="block text-[10px] text-emerald-600 font-medium mt-1">Submitted & Checked</span>
                      </div>
                    ) : (
                      <div>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                          Due {hw.dueDate}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">In Progress</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Ledger & Stamped Receipt Quick Download */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> Fee Ledger Summary
            </h2>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Q1 Tuition Fee (Class 10)</span>
                  <span className="text-emerald-600">?24,000 (PAID)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Receipt: REC-2026-10024</span>
                  <button onClick={() => setIsReceiptOpen(true)} className="text-blue-600 hover:underline font-semibold">View Stamp</button>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Annual STEM Robotics & Lab Fee</span>
                  <span className="text-amber-700">?8,500 (DUE)</span>
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  Due by: September 30, 2026
                </div>
                <button
                  onClick={handlePayFee}
                  className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition"
                >
                  Pay ?8,500 via UPI / Card
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block">Need help with fee receipts or queries?</span>
            <Link href="/communication" className="text-xs text-blue-600 hover:underline font-semibold">
              Contact School Accounts Desk
            </Link>
          </div>
        </div>
      </div>

      {/* Official Stamped Receipt Modal */}
      {isReceiptOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="border-b-2 border-slate-800 pb-3 text-center">
              <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                Delhi Public International School
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">Affiliation #DPS-2026 � Official Fee Receipt</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-900">REC-2026-10024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">Aarav Sharma</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class & Roll:</span>
                <span className="font-medium text-slate-800">Class 10-A (#10024)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee Category:</span>
                <span className="font-medium text-slate-800">Quarterly Tuition & Academic Fee</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-medium text-slate-800">UPI (UPI/HDFC/2026/8892193)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-900">Amount Paid:</span>
                <span className="text-emerald-700">?24,000.00</span>
              </div>
            </div>

            {/* Official Digital Stamp */}
            <div className="my-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-emerald-600 border-dashed flex items-center justify-center text-[8px] font-bold text-emerald-700 uppercase tracking-tighter mx-auto">
                  DPIS PAID<br />STAMP
                </div>
                <span className="text-[8px] text-slate-400 block mt-0.5">Verified Digital Stamp</span>
              </div>
              <div className="text-right">
                <div className="font-serif italic text-xs text-slate-700">Rakesh Gupta</div>
                <div className="text-[9px] text-slate-500">Senior Accounts Officer</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsReceiptOpen(false);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
