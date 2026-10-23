'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Users,
  GraduationCap,
  Building,
  Layers,
  Calendar,
  Settings,
  FileText,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  Key,
  School,
  Download,
  Printer,
  Upload,
  UserCheck
} from 'lucide-react';

export function SchoolAdminDashboardView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'CLASSES' | 'TEACHERS' | 'ACADEMIC_YEAR' | 'USERS' | 'SETTINGS' | 'DOCUMENTS' | 'COMMUNICATION'>('STUDENTS');
  const [selectedCampus, setSelectedCampus] = useState<'DPS-CENTRAL' | 'DPS-NORTH' | 'DPS-SOUTH'>('DPS-CENTRAL');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // TC / Document generator modal state
  const [isTcModalOpen, setIsTcModalOpen] = useState(false);
  const [tcStudentName, setTcStudentName] = useState('Rahul Kumar');
  const [tcRoll, setTcRoll] = useState('10024');
  const [tcReason, setTcReason] = useState('Parent Relocation to Bangalore');
  const [generatedTc, setGeneratedTc] = useState<any | null>(null);

  const campusProfiles = {
    'DPS-CENTRAL': {
      name: 'Delhi Public International School — Main Central Campus',
      location: 'Vasant Kunj, New Delhi',
      affiliation: 'CBSE Affiliation No: 2130842 • School Code: 08421',
      students: '1,120',
      classes: '22 Classes / Sections',
      teachers: '78 Staff',
      capacityPct: '94% filled',
    },
    'DPS-NORTH': {
      name: 'Delhi Public International School — North Campus',
      location: 'Sector 14, Rohini, New Delhi',
      affiliation: 'CBSE Affiliation No: 2130985 • School Code: 09852',
      students: '432',
      classes: '10 Classes / Sections',
      teachers: '30 Staff',
      capacityPct: '88% filled',
    },
    'DPS-SOUTH': {
      name: 'Delhi Public International School — South Campus',
      location: 'Saket Institutional Area, New Delhi',
      affiliation: 'CBSE Affiliation No: 2131044 • School Code: 10443',
      students: '290',
      classes: '6 Classes / Sections',
      teachers: '18 Staff',
      capacityPct: '82% filled',
    },
  };

  const activeProfile = campusProfiles[selectedCampus];

  const stats = [
    { label: 'Enrolled in this Campus', value: activeProfile.students, sub: 'Isolated Campus Roster', icon: GraduationCap, color: 'text-blue-600 bg-blue-50' },
    { label: 'Classes in this Branch', value: activeProfile.classes, sub: activeProfile.capacityPct, icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Campus Faculty Staff', value: activeProfile.teachers, sub: 'All Biometrics Active', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Current Session', value: '2026-2027', sub: 'Term 1 in Progress', icon: Calendar, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const adminModules = [
    { id: 'STUDENTS', title: '1. Student Management', desc: `Admissions, roll numbers & student bio strictly for ${selectedCampus}`, link: `/students?branchCode=${selectedCampus}`, count: `${activeProfile.students} Profiles` },
    { id: 'CLASSES', title: '2. Classes & Sections', desc: `Curriculum structure, room allocation & teachers in ${selectedCampus}`, link: '/academics', count: activeProfile.classes },
    { id: 'TEACHERS', title: '3. Teacher Directory', desc: `Faculty profiles, employee IDs & subject workload for this campus`, link: '/faculty', count: activeProfile.teachers },
    { id: 'ACADEMIC_YEAR', title: '4. Academic Year & Calendar', desc: 'Session 2026-27, Term 1/2 timelines, holidays & exam schedules', link: '/timetable', count: '2 Terms' },
    { id: 'USERS', title: '5. Users & RBAC Permissions', desc: 'User accounts, role assignments & system security audit logs', link: '/settings', count: 'Campus RBAC' },
    { id: 'SETTINGS', title: '6. School Settings', desc: 'School affiliation, branding, branch configs & SMS gateway API', link: '/settings', count: 'Active Config' },
    { id: 'DOCUMENTS', title: '7. Document Generation', desc: `Official Transfer Certificates (TC), Bonafide & Character letters for ${selectedCampus}`, link: '#', count: 'Official Issuance' },
    { id: 'COMMUNICATION', title: '8. Communication & SMS', desc: 'Broadcast circulars, automated parent SMS & WhatsApp templates', link: '/notices', count: 'Multi-Channel' },
  ];

  const handleGenerateTC = (e: React.FormEvent) => {
    e.preventDefault();
    const tcNo = `TC-${selectedCampus}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTc({
      tcNumber: tcNo,
      campusName: activeProfile.name,
      affiliation: activeProfile.affiliation,
      studentName: tcStudentName,
      roll: tcRoll,
      class: 'Class 10-A (CBSE)',
      reason: tcReason,
      conduct: 'Exemplary',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    });
    setIsTcModalOpen(false);
    setStatusNotice(`Transfer Certificate ${tcNo} issued for ${activeProfile.name}! Ready for official print.`);
    setTimeout(() => setStatusNotice(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner for School Administrator with Campus Scope Control */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" /> Level 3 — School Administrator
              </span>
              <span className="text-xs text-slate-300">Operations, Master Data &amp; Scoped Controls</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              School Administration Console
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Active Scope: <strong className="text-white">{activeProfile.name}</strong> ({activeProfile.location}). All admissions, modifications and student data strictly affect this campus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Campus Selector Pill */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-200 pl-2 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Branch:
              </span>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value as any)}
                className="bg-slate-900/90 text-white font-bold text-xs border border-white/20 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400"
              >
                <option value="DPS-CENTRAL">DPS Main Central Campus (1,120)</option>
                <option value="DPS-NORTH">DPS North Campus (432)</option>
                <option value="DPS-SOUTH">DPS South Campus (290)</option>
              </select>
            </div>

            <button
              onClick={() => setIsTcModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Issue Campus TC
            </button>
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 4 Core Admin KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const IconC = st.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase">{st.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${st.color}`}>
                  <IconC className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{st.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{st.sub}</div>
            </div>
          );
        })}
      </div>

      {/* 8 Administrator Management Spheres */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Administrator Management Matrix (8 Spheres)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Direct administrative management shortcuts and data tables</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminModules.map((mod) => (
            <div
              key={mod.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {mod.count}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition">{mod.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{mod.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {mod.id === 'DOCUMENTS' ? (
                  <button
                    onClick={() => setIsTcModalOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Issue Document <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href={mod.link}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Manage Module <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated TC Preview Card */}
      {generatedTc && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Official Transfer Certificate Generated ({generatedTc.tcNumber})</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{generatedTc.campusName} • {generatedTc.affiliation}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" /> Print Official Stamped TC
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Student Name</span>
              <span className="font-bold text-slate-900">{generatedTc.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Roll &amp; Class</span>
              <span className="font-medium text-slate-800">{generatedTc.class} (#{generatedTc.roll})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Reason for Leaving</span>
              <span className="font-medium text-slate-800">{generatedTc.reason}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Issue Date</span>
              <span className="font-medium text-slate-800">{generatedTc.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Issue Transfer Certificate (TC) */}
      {isTcModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Issue Official Transfer Certificate (TC)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Generates a verified, digitally stamped school leaving certificate for the student.
            </p>

            <form onSubmit={handleGenerateTC} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={tcStudentName}
                  onChange={(e) => setTcStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={tcRoll}
                    onChange={(e) => setTcRoll(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class / Section</label>
                  <input
                    type="text"
                    defaultValue="Class 10-A (CBSE)"
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:outline-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Leaving</label>
                <input
                  type="text"
                  required
                  value={tcReason}
                  onChange={(e) => setTcReason(e.target.value)}
                  placeholder="Parent Job Relocation / Completed Secondary Course"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Academic &amp; Conduct Remarks</label>
                <input
                  type="text"
                  defaultValue="Exemplary conduct with all school library and lab dues cleared."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTcModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-sm"
                >
                  Generate Stamped TC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
