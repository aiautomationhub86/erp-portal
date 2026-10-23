'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  School,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Layers,
  BookOpen,
  IndianRupee,
  Bus,
  Library,
  Calendar,
  FileSpreadsheet,
  Boxes,
  MessageSquare,
  Award,
  Zap,
  Check
} from 'lucide-react';

export default function SchoolWebsitePage() {
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSchool, setDemoSchool] = useState('');
  const [activeSegment, setActiveSegment] = useState<'CBSE' | 'PRIVATE' | 'INTERNATIONAL'>('CBSE');

  const segments = {
    CBSE: {
      title: 'CBSE & ICSE Affiliated Schools',
      badge: 'Board Compliant',
      desc: 'Built specifically for Class 1-12 curriculum, Continuous and Comprehensive Evaluation (CCE), internal assessments, board registrations, and official report cards.',
      features: ['Automated CBSE LOC generation', 'Term 1 & Term 2 assessment schemes', 'Internal & practical lab marks', 'Board examination schedule manager']
    },
    PRIVATE: {
      title: 'Private & Small Schools',
      badge: 'Rapid 1-Day Setup',
      desc: 'Zero-configuration cloud setup with intuitive fee collection via UPI, automated SMS alerts to parents, and daily biometric attendance.',
      features: ['1-Click fee collection & receipts', 'SMS alerts to parents', 'Biometric staff attendance', 'Zero server maintenance']
    },
    INTERNATIONAL: {
      title: 'International Schools & Multi-Branch Chains',
      badge: 'Multi-Branch & IB/Cambridge',
      desc: 'Centralized governance across multiple campuses with multi-currency fee ledgers, bus GPS tracking, and executive Director KPI dashboards.',
      features: ['Multi-branch unified reporting', 'Live GPS transport tracking', 'Double-entry accounting daybook', 'Role-based RBAC security']
    }
  };

  const modules = [
    { name: 'Student Management', icon: GraduationCap, desc: 'Admissions, profiles, parent linkages & KYC' },
    { name: 'Academic & Wings', icon: Layers, desc: 'Primary, Middle, Secondary & Sr. Secondary wings' },
    { name: 'Homework & Assignments', icon: BookOpen, desc: 'Daily assignments, submissions & grading' },
    { name: 'Student & Staff Attendance', icon: CheckCircle2, desc: 'Daily punch, biometric & shortage warning' },
    { name: 'Examinations & Marks', icon: Award, desc: 'Unit tests, midterms, report cards & grades' },
    { name: 'Fee Billing & Receipts', icon: IndianRupee, desc: 'Online UPI/Card gateway & stamped receipts' },
    { name: 'HR & Staff Payroll', icon: Users, desc: 'Biometric logs, salary slips & allowances' },
    { name: 'Accounting & Daybook', icon: FileSpreadsheet, desc: 'Double-entry ledgers, vouchers & cashflows' },
    { name: 'Inventory & Campus Assets', icon: Boxes, desc: 'Lab equipment, sports gear & IT hardware' },
    { name: 'Parent-Teacher Communication', icon: MessageSquare, desc: 'SMS circulars, notices & chat feeds' },
    { name: 'Transport & Fleet GPS', icon: Bus, desc: 'Live bus routes, driver details & bus passes' },
    { name: 'Library Automation', icon: Library, desc: 'Book catalog, barcodes, issue & return logs' },
    { name: 'Timetable Scheduling', icon: Calendar, desc: 'Conflict-free classroom & period generator' },
    { name: 'AI Early Warning & Remedial', icon: Sparkles, desc: '31 at-risk student predictor & smart helper' },
  ];

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white pb-20">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">DPIS EduCore</span>
              <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase block -mt-1">School ERP System</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#segments" className="hover:text-white transition">School Segments</a>
            <a href="#modules" className="hover:text-white transition">18 Core Modules</a>
            <a href="#roles" className="hover:text-white transition">Role Dashboards</a>
            <a href="#demo" className="hover:text-white transition">Request Demo</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              Launch ERP Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation AI-Powered School ERP
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Empower Your School With <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Complete Operational Intelligence</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Unite Owners, Principals, Teachers, Accountants, Parents, and Students on a single cohesive platform. 
            From <strong>Admissions &amp; Timetables</strong> to <strong>Homework, Fees, Payroll, and AI Early Warning Diagnostics</strong>.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 transition flex items-center gap-2"
            >
              Enter Live ERP Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition"
            >
              Book 30-Min Demo
            </a>
          </div>

          {/* Key School Metrics Pill Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-white">1,842</div>
              <div className="text-xs text-slate-400 mt-0.5">Enrolled Students</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-emerald-400">93.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Daily Attendance</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-indigo-400">87%</div>
              <div className="text-xs text-slate-400 mt-0.5">Fee Collection Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-purple-400">126</div>
              <div className="text-xs text-slate-400 mt-0.5">Faculty &amp; Staff</div>
            </div>
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section id="segments" className="py-20 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Tailored School Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">Built For Every Institution Segment</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Customized modules for national boards, regional academies, and global school networks.</p>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveSegment('CBSE')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeSegment === 'CBSE' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              CBSE &amp; ICSE Schools
            </button>
            <button
              onClick={() => setActiveSegment('PRIVATE')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeSegment === 'PRIVATE' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Private &amp; Small Schools
            </button>
            <button
              onClick={() => setActiveSegment('INTERNATIONAL')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeSegment === 'INTERNATIONAL' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              International &amp; School Chains
            </button>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-3xl p-8 border border-slate-800 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold">
                  {segments[activeSegment].badge}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">{segments[activeSegment].title}</h3>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {segments[activeSegment].desc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {segments[activeSegment].features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 18 Core Modules Catalog */}
      <section id="modules" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Complete Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">18 Integrated Business Modules</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Zero third-party fragmentation. Everything works seamlessly in real-time.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod, i) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">{mod.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{mod.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section id="demo" className="py-20 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-blue-950/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Experience EduCore Live</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">Ready to Modernize Your School?</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-8">
            Schedule a customized product walkthrough with an educational technology specialist.
          </p>

          {demoSubmitted ? (
            <div className="p-8 bg-emerald-950/40 border border-emerald-800 text-emerald-200 rounded-3xl animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Demo Request Confirmed!</h3>
              <p className="text-xs text-emerald-300 mt-1">
                Our implementation team will connect with <strong>{demoSchool || 'your institution'}</strong> within 2 hours.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Explore Live Demo Sandbox Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl text-left space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="Dr. Singhania"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="director@school.edu"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs focus:outline-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">School Name &amp; Affiliation</label>
                <input
                  type="text"
                  required
                  value={demoSchool}
                  onChange={(e) => setDemoSchool(e.target.value)}
                  placeholder="Delhi Public International School (CBSE)"
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs focus:outline-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                Schedule Live Walkthrough <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
