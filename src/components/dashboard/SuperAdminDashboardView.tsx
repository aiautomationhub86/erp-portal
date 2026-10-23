'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldAlert,
  Building,
  School,
  Users,
  Key,
  Lock,
  PlusCircle,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Search,
  Eye,
  RefreshCw,
  Copy,
  ExternalLink,
  Sliders,
  Check,
  Award,
  GraduationCap
} from 'lucide-react';

export function SuperAdminDashboardView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'COLLEGES' | 'LICENSES' | 'CREDENTIALS' | 'AUDIT'>('COLLEGES');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // 1. Managed Colleges / Schools List
  const [institutions, setInstitutions] = useState([
    {
      id: '1',
      code: 'DPS-CENTRAL',
      name: 'Delhi Public International School — Main Central Campus',
      type: 'CBSE K-12 + STEM Composite',
      location: 'Vasant Kunj, New Delhi',
      principal: 'Dr. Shailaja Mehra',
      director: 'Dr. Vikramaditya Singhania',
      students: 1120,
      teachers: 78,
      status: 'ACTIVE',
      modulesCount: 10,
    },
    {
      id: '2',
      code: 'DPS-NORTH',
      name: 'Delhi Public International School — North Campus',
      type: 'CBSE Secondary Wing (Classes 6-10)',
      location: 'Sector 14, Rohini, New Delhi',
      principal: 'Mr. Anupam Verma',
      director: 'Dr. Vikramaditya Singhania',
      students: 432,
      teachers: 30,
      status: 'ACTIVE',
      modulesCount: 8,
    },
    {
      id: '3',
      code: 'DPS-SOUTH',
      name: 'Delhi Public International School — South Campus',
      type: 'Primary & Middle Wing (Classes 1-8)',
      location: 'Saket Institutional Area, New Delhi',
      principal: 'Mrs. Radhika Sen',
      director: 'Dr. Vikramaditya Singhania',
      students: 290,
      teachers: 18,
      status: 'ACTIVE',
      modulesCount: 6,
    },
  ]);

  // Add Institution Modal State
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [newCollegeData, setNewCollegeData] = useState({
    name: '',
    code: '',
    type: 'CBSE K-12 School',
    location: '',
    principal: '',
    director: 'Dr. Vikramaditya Singhania',
    capacity: 500,
  });

  // 2. Master Core Module Licensing State (Controlled ONLY by Super Admin)
  const [moduleLicenses, setModuleLicenses] = useState<Record<string, Record<string, boolean>>>({
    'DPS-CENTRAL': {
      aiInsights: true,
      gpsTransport: true,
      feeGateway: true,
      lmsHomework: true,
      biometrics: true,
      hostel: true,
      library: true,
      tcEngine: true,
      smsBroadcast: true,
      hrPayroll: true,
    },
    'DPS-NORTH': {
      aiInsights: true,
      gpsTransport: true,
      feeGateway: true,
      lmsHomework: true,
      biometrics: true,
      hostel: false,
      library: true,
      tcEngine: true,
      smsBroadcast: true,
      hrPayroll: true,
    },
    'DPS-SOUTH': {
      aiInsights: false,
      gpsTransport: true,
      feeGateway: true,
      lmsHomework: true,
      biometrics: true,
      hostel: false,
      library: true,
      tcEngine: true,
      smsBroadcast: true,
      hrPayroll: false,
    },
  });

  const [selectedCampusForLicense, setSelectedCampusForLicense] = useState('DPS-CENTRAL');

  // 3. User Credentials & ID/Password Manager
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Dr. Vikramaditya Singhania', email: 'director@school.edu', role: 'DIRECTOR', branch: 'DPS-CENTRAL', identifier: 'DIR-01', tempPass: 'password123' },
    { id: '2', name: 'Mrs. Shailaja Mehra', email: 'principal@school.edu', role: 'PRINCIPAL', branch: 'DPS-CENTRAL', identifier: 'PRN-01', tempPass: 'password123' },
    { id: '3', name: 'Mr. Rajesh Sharma', email: 'teacher.rajesh@school.edu', role: 'TEACHER', branch: 'DPS-CENTRAL', identifier: 'EMP-TCH-101', tempPass: 'password123' },
    { id: '4', name: 'Aarav Sharma', email: 'aarav.sharma@school.edu', role: 'STUDENT', branch: 'DPS-CENTRAL', identifier: '10024', tempPass: 'password123' },
    { id: '5', name: 'Rohan Mehta', email: 'student.10025@school.edu', role: 'STUDENT', branch: 'DPS-CENTRAL', identifier: '10025', tempPass: 'password123' },
    { id: '6', name: 'Kavya Verma', email: 'student.10088@school.edu', role: 'STUDENT', branch: 'DPS-NORTH', identifier: '10088', tempPass: 'password123' },
    { id: '7', name: 'Mr. Rakesh Gupta', email: 'accountant@school.edu', role: 'ACCOUNTANT', branch: 'DPS-CENTRAL', identifier: 'ACC-01', tempPass: 'password123' },
  ]);

  const [credSearch, setCredSearch] = useState('');
  const [credRoleFilter, setCredRoleFilter] = useState('ALL');
  const [credCampusFilter, setCredCampusFilter] = useState('ALL');

  // Modal: Reset Password / Issue Credentials
  const [selectedUserForCreds, setSelectedUserForCreds] = useState<any | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    branchCode: 'DPS-CENTRAL',
    identifier: '',
    password: 'password123',
  });

  // Handlers
  const handleAddInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeData.name.trim() || !newCollegeData.code.trim()) return;

    const newInst = {
      id: Date.now().toString(),
      code: newCollegeData.code.toUpperCase(),
      name: newCollegeData.name,
      type: newCollegeData.type,
      location: newCollegeData.location || 'New Delhi Campus',
      principal: newCollegeData.principal || 'Appointed Principal',
      director: newCollegeData.director || 'Dr. Vikramaditya Singhania',
      students: 0,
      teachers: 0,
      status: 'ACTIVE',
      modulesCount: 6,
    };

    setInstitutions(prev => [...prev, newInst]);
    setModuleLicenses(prev => ({
      ...prev,
      [newInst.code]: {
        aiInsights: false,
        gpsTransport: true,
        feeGateway: true,
        lmsHomework: true,
        biometrics: true,
        hostel: false,
        library: true,
        tcEngine: true,
        smsBroadcast: true,
        hrPayroll: false,
      }
    }));

    setShowAddCollegeModal(false);
    setNewCollegeData({ name: '', code: '', type: 'CBSE K-12 School', location: '', principal: '', director: 'Dr. Vikramaditya Singhania', capacity: 500 });
    setStatusNotice(`Successfully provisioned new institution: "${newInst.name}" (${newInst.code})!`);
    setTimeout(() => setStatusNotice(null), 5000);
  };

  const toggleCoreModuleLicense = (campusCode: string, moduleKey: string) => {
    setModuleLicenses(prev => ({
      ...prev,
      [campusCode]: {
        ...prev[campusCode],
        [moduleKey]: !prev[campusCode]?.[moduleKey],
      }
    }));
    setStatusNotice(`Super Admin updated core module license for ${campusCode}!`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim() || !selectedUserForCreds) return;

    setUsersList(prev => prev.map(u => {
      if (u.id === selectedUserForCreds.id) {
        return { ...u, tempPass: newPasswordInput };
      }
      return u;
    }));

    setStatusNotice(`Password updated for ${selectedUserForCreds.name} (${selectedUserForCreds.email}) to "${newPasswordInput}"!`);
    setSelectedUserForCreds(null);
    setNewPasswordInput('');
    setTimeout(() => setStatusNotice(null), 5000);
  };

  const handleCreateUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) return;

    const created = {
      id: Date.now().toString(),
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      branch: newUserData.branchCode,
      identifier: newUserData.identifier || `USR-${Date.now().toString().slice(-4)}`,
      tempPass: newUserData.password || 'password123',
    };

    setUsersList(prev => [...prev, created]);
    setShowAddUserModal(false);
    setNewUserData({ name: '', email: '', role: 'STUDENT', branchCode: 'DPS-CENTRAL', identifier: '', password: 'password123' });
    setStatusNotice(`Super Admin created new ${created.role} login for ${created.name} at ${created.branch}!`);
    setTimeout(() => setStatusNotice(null), 5000);
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(credSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(credSearch.toLowerCase()) ||
      u.identifier.toLowerCase().includes(credSearch.toLowerCase());
    const matchesRole = credRoleFilter === 'ALL' || u.role === credRoleFilter;
    const matchesCampus = credCampusFilter === 'ALL' || u.branch === credCampusFilter;
    return matchesSearch && matchesRole && matchesCampus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Super Admin Master Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-red-900/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-red-600/30 text-red-300 border border-red-500/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Master Super Administrator
              </span>
              <span className="text-xs text-red-200/80">Full Multi-College Network Authority</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Super Admin Global Command Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Global institution governance: Provision schools &amp; colleges, control Core Module licenses, and manage ID/password credentials for all users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCollegeModal(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Provision School / College
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
            >
              <Key className="w-4 h-4 text-amber-300" /> Issue User Login
            </button>
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Network Pulse Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Institutions</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Building className="w-6 h-6 text-red-600" /> {institutions.length} Campuses
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">All Network Nodes Active</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</span>
          <div className="text-2xl font-black text-blue-600 mt-1 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" /> 1,842 Students
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Across 3 Central Nodes</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Faculty &amp; Staff</span>
          <div className="text-2xl font-black text-indigo-600 mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> 126 Staff
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Biometric KYC Enrolled</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Logins Issued</span>
          <div className="text-2xl font-black text-purple-600 mt-1 flex items-center gap-2">
            <Key className="w-6 h-6 text-purple-600" /> {usersList.length} Active Accounts
          </div>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">Master RBAC Enforced</span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('COLLEGES')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'COLLEGES'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" /> 1. Schools &amp; Colleges ({institutions.length})
        </button>
        <button
          onClick={() => setActiveTab('LICENSES')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'LICENSES'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4 text-red-500" /> 2. Core Module Licensing (Exclusive)
        </button>
        <button
          onClick={() => setActiveTab('CREDENTIALS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'CREDENTIALS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Key className="w-4 h-4 text-amber-500" /> 3. User ID &amp; Password Manager
        </button>
      </div>

      {/* TAB 1: SCHOOLS & COLLEGES DIRECTORY */}
      {activeTab === 'COLLEGES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" /> Managed Schools &amp; Colleges Directory
              </h2>
              <p className="text-xs text-slate-500">Super Admin can provision new institutions and inspect institutional leadership.</p>
            </div>
            <button
              onClick={() => setShowAddCollegeModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add New College / School
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {institutions.map((inst) => (
              <div key={inst.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-blue-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border">
                    {inst.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{inst.name}</h3>
                  <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">{inst.type}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{inst.location}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Principal / Dean:</span>
                    <strong className="text-slate-800">{inst.principal}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">School Owner/Director:</span>
                    <strong className="text-slate-800">{inst.director}</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1">
                    <span className="text-slate-500">Enrolled Students:</span>
                    <strong className="text-blue-700">{inst.students} Students</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {Object.values(moduleLicenses[inst.code] || {}).filter(Boolean).length} / 10 Modules Licensed
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCampusForLicense(inst.code);
                      setActiveTab('LICENSES');
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Configure Licenses <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXCLUSIVE CORE MODULE LICENSING */}
      {activeTab === 'LICENSES' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-600" /> Super Admin Exclusive Authority
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">Institution Core Module Licensing Controls</h2>
              <p className="text-xs text-slate-500">
                School Owners/Directors only have access to modules enabled by the Super Admin. Toggle licenses below per institution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Institution:</span>
              <select
                value={selectedCampusForLicense}
                onChange={(e) => setSelectedCampusForLicense(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-xs text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
              >
                {institutions.map(i => (
                  <option key={i.code} value={i.code}>
                    {i.name} ({i.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'aiInsights', label: 'AI Insights & Early Warning Engine', desc: 'Predict at-risk students & generate auto quizzes', badge: 'AI Engine' },
              { key: 'gpsTransport', label: 'Transport Fleet GPS & Live Bus Tracking', desc: 'Live telematics, parent notifications & route allocation', badge: 'Transport' },
              { key: 'feeGateway', label: 'Online Fee Gateway & Stamped Invoices', desc: 'UPI/Netbanking collection & printable digital stamps', badge: 'Finance' },
              { key: 'lmsHomework', label: 'Digital Homework & Student LMS Portal', desc: 'Assignments posting, rubric grading & student submissions', badge: 'LMS' },
              { key: 'biometrics', label: 'Biometric Staff Check-in/out Tracker', desc: 'Facial/fingerprint hardware attendance integration', badge: 'HR Hardware' },
              { key: 'hostel', label: 'Hostel & Residential Boarding Desk', desc: 'Room allotment, warden oversight & mess roster', badge: 'Campus Ops' },
              { key: 'library', label: 'Library Automation & Barcode Desk', desc: 'ISBN catalog, book issue/return & fine tracking', badge: 'Library' },
              { key: 'tcEngine', label: 'Transfer Certificate (TC) Generator', desc: 'Official CBSE formatted certificate generation with seal', badge: 'Governance' },
              { key: 'smsBroadcast', label: 'SMS & WhatsApp Circular Broadcast', desc: 'Instant bulk notifications to student/parent phones', badge: 'Gateway' },
              { key: 'hrPayroll', label: 'HR, Staff Workload & Payroll Ledger', desc: 'Salary structures, payslips, leaves & EPF/TDS', badge: 'HRMS' },
            ].map((feat) => {
              const isLicensed = moduleLicenses[selectedCampusForLicense]?.[feat.key] ?? false;
              return (
                <div
                  key={feat.key}
                  className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
                    isLicensed ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-50/30 border-slate-100 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{feat.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {feat.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{feat.desc}</p>
                    <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${isLicensed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                      {isLicensed ? '✓ Licensed & Active' : '✕ Suspended / Unlicensed'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCoreModuleLicense(selectedCampusForLicense, feat.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      isLicensed ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isLicensed ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: USER ID & PASSWORD MANAGER */}
      {activeTab === 'CREDENTIALS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" /> Master User Credentials &amp; ID/Password Desk
              </h2>
              <p className="text-xs text-slate-500">
                Super Admin can inspect student/director/faculty login IDs, issue credentials, and reset passwords directly.
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Create New User Login
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or Roll/ID..."
                  value={credSearch}
                  onChange={(e) => setCredSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={credRoleFilter}
                onChange={(e) => setCredRoleFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 text-xs"
              >
                <option value="ALL">All User Roles</option>
                <option value="STUDENT">Students Only</option>
                <option value="DIRECTOR">School Owners / Directors</option>
                <option value="PRINCIPAL">Principals</option>
                <option value="TEACHER">Teachers / Faculty</option>
                <option value="ACCOUNTANT">Accountants</option>
              </select>

              <select
                value={credCampusFilter}
                onChange={(e) => setCredCampusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700 text-xs"
              >
                <option value="ALL">All Campuses</option>
                <option value="DPS-CENTRAL">DPS Central Campus</option>
                <option value="DPS-NORTH">DPS North Campus</option>
                <option value="DPS-SOUTH">DPS South Campus</option>
              </select>
            </div>

            <span className="text-slate-400 text-[11px] font-medium">
              Showing {filteredUsers.length} user accounts
            </span>
          </div>

          {/* Credentials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Institution Campus</th>
                  <th className="py-3 px-4">ID / Roll No</th>
                  <th className="py-3 px-4">Current Password</th>
                  <th className="py-3 px-4 text-right">Super Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'DIRECTOR'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'PRINCIPAL'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'TEACHER'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.role === 'STUDENT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" /> {u.branch}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {u.identifier}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800 text-[11px] border border-slate-200">
                        {u.tempPass}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`Email: ${u.email}\nPassword: ${u.tempPass}\nCampus: ${u.branch}`);
                            setStatusNotice(`Copied login card for ${u.name}!`);
                            setTimeout(() => setStatusNotice(null), 3000);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy Login
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserForCreds(u);
                            setNewPasswordInput('');
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" /> Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add New School / College */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-red-600" /> Provision New School or College
              </h3>
              <button onClick={() => setShowAddCollegeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddInstitution} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institution Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DPIS Institute of Technology & Engineering"
                  value={newCollegeData.name}
                  onChange={(e) => setNewCollegeData({ ...newCollegeData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DPS-EAST"
                    value={newCollegeData.code}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-red-500/20 uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Board / System Type</label>
                  <select
                    value={newCollegeData.type}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    <option value="CBSE K-12 School">CBSE K-12 School</option>
                    <option value="ICSE School">ICSE School</option>
                    <option value="Engineering College (Higher Ed)">Engineering College (Higher Ed)</option>
                    <option value="International IB World School">International IB World School</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus Location / Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Mayur Vihar, New Delhi"
                    value={newCollegeData.location}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Principal / Dean Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K.S. Rathore"
                    value={newCollegeData.principal}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, principal: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowAddCollegeModal(false)} className="px-4 py-2 border rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md">Provision Institution</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password for Specific User */}
      {selectedUserForCreds && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" /> Reset Password for User
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Setting new permanent or temporary password for <strong>{selectedUserForCreds.name}</strong> ({selectedUserForCreds.email}) at <strong>{selectedUserForCreds.branch}</strong>.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="text"
                  required
                  placeholder="Enter new password (e.g. Pass@2026)"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedUserForCreds(null)} className="px-4 py-2 border rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">Save &amp; Issue Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create User Login */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" /> Issue New User Login Credentials
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateUserLogin} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">User Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-bold text-slate-800"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="DIRECTOR">School Owner / Director</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="TEACHER">Teacher / Faculty</option>
                    <option value="ACCOUNTANT">Accountant</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target School / College</label>
                  <select
                    value={newUserData.branchCode}
                    onChange={(e) => setNewUserData({ ...newUserData, branchCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-bold text-slate-800"
                  >
                    {institutions.map(i => (
                      <option key={i.code} value={i.code}>{i.name} ({i.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email / Login ID</label>
                  <input
                    type="email"
                    required
                    placeholder="user@school.edu"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Password</label>
                  <input
                    type="text"
                    required
                    placeholder="password123"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="px-4 py-2 border rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">Create &amp; Issue Credentials</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
