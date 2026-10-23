'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Users,
  GraduationCap,
  Building,
  CalendarCheck2,
  IndianRupee,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Award,
  Sparkles,
  MapPin,
  School,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Send,
  FileSpreadsheet,
  Download,
  FileText,
  Printer,
  ChevronRight
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
} from 'recharts';

export function DirectorDashboardView() {
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [remedialActionSuccess, setRemedialActionSuccess] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportType, setActiveReportType] = useState<'FINANCIAL' | 'FEE_COLLECTION' | 'ACADEMIC_CBSE' | 'STAFF_WORKLOAD'>('FINANCIAL');

  const branchData = [
    { code: 'DPS-CENTRAL', name: 'Main Central Campus (Vasant Kunj)', students: 1120, teachers: 78, attendance: '94.2%', fees: '89%', budget: '₹62.5L' },
    { code: 'DPS-NORTH', name: 'North Campus (Rohini)', students: 432, teachers: 30, attendance: '92.6%', fees: '84%', budget: '₹21.2L' },
    { code: 'DPS-SOUTH', name: 'South Campus (Saket)', students: 290, teachers: 18, attendance: '92.1%', fees: '85%', budget: '₹11.7L' },
  ];

  const financialTrend = [
    { month: 'Apr', billed: 95.4, collected: 88.0, expense: 42.1 },
    { month: 'May', billed: 95.4, collected: 90.2, expense: 43.5 },
    { month: 'Jun', billed: 95.4, collected: 86.4, expense: 44.8 },
    { month: 'Jul', billed: 95.4, collected: 91.5, expense: 45.0 },
    { month: 'Aug', billed: 95.4, collected: 89.1, expense: 46.2 },
    { month: 'Sep', billed: 95.4, collected: 83.0, expense: 41.8 },
  ];

  const wingDistribution = [
    { name: 'Primary Wing (1-5)', students: 580, color: '#3b82f6', avgScore: '89.4%' },
    { name: 'Middle Wing (6-8)', students: 460, color: '#10b981', avgScore: '84.2%' },
    { name: 'Secondary Wing (9-10)', students: 442, color: '#8b5cf6', avgScore: '86.1%' },
    { name: 'Sr. Secondary (11-12)', students: 360, color: '#f59e0b', avgScore: '82.8%' },
  ];

  const atRiskList = [
    { id: '1', name: 'Rohan Mehta', class: 'Class 10-A', roll: '10025', issue: 'Attendance shortage (64.2%) & Failed UT-1 Math (38%)', severity: 'HIGH' },
    { id: '2', name: 'Simran Kaur', class: 'Class 10-A', roll: '10026', issue: 'Term 1 Fee pending >60 days & low Science score (44%)', severity: 'MEDIUM' },
    { id: '3', name: 'Harsh Vardhan', class: 'Class 9-B', roll: '9012', issue: 'Consecutive 6 days unexcused absence & Lab backlog', severity: 'HIGH' },
    { id: '4', name: 'Ayesha Siddiqui', class: 'Class 11-B', roll: '1104', issue: 'Physics numerical score below 40% & Remedial skipped', severity: 'MEDIUM' },
  ];

  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedCampusForConfig, setSelectedCampusForConfig] = useState('DPS-CENTRAL');
  const [campusFeatures, setCampusFeatures] = useState<Record<string, Record<string, boolean>>>({
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
      alumniNetwork: true,
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
      alumniNetwork: false,
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
      alumniNetwork: false,
    },
  });

  const [customFeatures, setCustomFeatures] = useState<Array<{ id: string; campusCode: string; name: string; category: string; description: string }>>([
    { id: '1', campusCode: 'DPS-CENTRAL', name: 'Robotics & STEM AI Lab', category: 'ACADEMICS', description: 'Advanced IoT & AI lab workstation tracking' },
    { id: '2', campusCode: 'DPS-CENTRAL', name: 'Smart RFID Cafeteria Meal Pass', category: 'OPERATIONS', description: 'Contactless wallet for canteen meals' },
  ]);

  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureCategory, setNewFeatureCategory] = useState('ACADEMICS');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [isAddingFeature, setIsAddingFeature] = useState(false);

  const toggleCampusFeature = (campusCode: string, featureKey: string) => {
    setCampusFeatures((prev) => ({
      ...prev,
      [campusCode]: {
        ...prev[campusCode],
        [featureKey]: !prev[campusCode]?.[featureKey],
      },
    }));
    setRemedialActionSuccess(`Updated feature settings for campus ${campusCode}!`);
    setTimeout(() => setRemedialActionSuccess(null), 3000);
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      campusCode: selectedCampusForConfig,
      name: newFeatureName,
      category: newFeatureCategory,
      description: newFeatureDesc || 'Custom institution module configured by School Owner',
    };
    setCustomFeatures((prev) => [...prev, newEntry]);
    setNewFeatureName('');
    setNewFeatureDesc('');
    setIsAddingFeature(false);
    setRemedialActionSuccess(`Added new module "${newFeatureName}" to ${selectedCampusForConfig}!`);
    setTimeout(() => setRemedialActionSuccess(null), 4000);
  };

  const handleTriggerAction = (studentName: string, actionType: string) => {
    setRemedialActionSuccess(`Successfully dispatched ${actionType} for ${studentName}`);
    setTimeout(() => setRemedialActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Director Context & Multi-Branch Selector */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Level 1 — School Owner / Director
              </span>
              <span className="text-xs text-blue-200">Executive School Governance Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name || 'Dr. Vikramaditya Singhania'}
            </h1>
            <p className="text-sm text-blue-100/80 mt-1 max-w-2xl">
              Overall institutional health: <strong>1,842 Students</strong> • <strong>93.4% Attendance</strong> • <strong>87.0% Fee Collection</strong> • <strong>126 Teachers</strong> across 3 Campuses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => setIsFeatureModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2 border border-blue-400/30"
            >
              <Building className="w-4 h-4 text-blue-200" /> ⚙️ Configure College Features
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" /> Management Reports
            </button>

            {/* Branch Switcher Pill */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 flex flex-wrap items-center gap-1">
              <span className="text-xs font-medium text-blue-200 px-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Campus:
              </span>
              <button
                onClick={() => setSelectedBranch('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedBranch === 'ALL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                All (1,842)
              </button>
              <button
                onClick={() => setSelectedBranch('DPS-CENTRAL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedBranch === 'DPS-CENTRAL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                Central (1,120)
              </button>
              <button
                onClick={() => setSelectedBranch('DPS-NORTH')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedBranch === 'DPS-NORTH'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                North (432)
              </button>
              <button
                onClick={() => setSelectedBranch('DPS-SOUTH')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedBranch === 'DPS-SOUTH'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                South (290)
              </button>
            </div>
          </div>
        </div>
      </div>

      {remedialActionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{remedialActionSuccess}</span>
        </div>
      )}

      {/* 6 Core Director KPI Cards (Answering "Mera school overall kaisa perform kar raha hai?") */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Student Strength */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Student Strength</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">1,842</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +148 YoY Admissions
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">93.4%</div>
            <div className="text-xs text-emerald-600 mt-1 font-medium">Above 92% Target</div>
          </div>
        </div>

        {/* Fee Collection Rate */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fee Collection</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-indigo-600">87.0%</div>
            <div className="text-xs text-slate-500 mt-1">₹83.0L / ₹95.4L</div>
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Outstanding</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-amber-600">₹12.4L</div>
            <div className="text-xs text-amber-700 mt-1 font-medium">134 Defaulters Pending</div>
          </div>
        </div>

        {/* Staff Overview */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Staff Overview</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">126</div>
            <div className="text-xs text-purple-600 mt-1 font-medium">1:14.6 Teacher Ratio</div>
          </div>
        </div>

        {/* Important Alerts / At-Risk */}
        <div className="bg-white rounded-xl p-4 border border-rose-200 bg-rose-50/40 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">Important Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-rose-600">31 Risk</div>
            <div className="text-xs text-rose-700 mt-1 font-medium">Remedial Flagged</div>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Revenue & Academic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Run-Rate (₹ in Lakhs) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" /> Revenue &amp; Cashflow Telemetry (₹ in Lakhs)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Billed Term Fees vs Inflow Collections vs Expenditures</p>
            </div>
            <Link
              href="/accounts"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Daybook Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val: number) => [`₹${val} Lakhs`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="billed" fill="#cbd5e1" name="Billed Fees" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="#3b82f6" name="Collections (87%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f87171" name="Expenses &amp; Payroll" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Performance by Wing */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <School className="w-4 h-4 text-indigo-600" /> Academic Wing Performance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">1,842 Students across 4 wings</p>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wingDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="students"
                  >
                    {wingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => [`${val} Students`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {wingDistribution.map((wing) => (
              <div key={wing.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: wing.color }} />
                  <span className="text-slate-700 font-medium">{wing.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-900 font-semibold">{wing.students}</span>
                  <span className="text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                    Avg {wing.avgScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Alerts: At-Risk Students & Branch Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Alerts Table */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">
                Early Warning Diagnostics (31 At-Risk Students Flagged)
              </h2>
            </div>
            <Link
              href="/ai-insights"
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              Full AI Diagnostic <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Class &amp; Roll</th>
                  <th className="py-2.5 px-3">Risk Trigger Factor</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {atRiskList.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${st.severity === 'HIGH' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      {st.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                        {st.class} (#{st.roll})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {st.issue}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTriggerAction(st.name, 'SMS Parent Notice')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-medium transition flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> SMS Parent
                        </button>
                        <button
                          onClick={() => handleTriggerAction(st.name, 'Remedial Class Schedule')}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[11px] font-medium transition"
                        >
                          Remedial
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Performance Comparison */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" /> Multi-Branch Performance
          </h2>
          <p className="text-xs text-slate-500 mb-4">Delhi Public International School Network</p>

          <div className="space-y-3">
            {branchData.map((branch) => (
              <div
                key={branch.code}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900">{branch.name}</h3>
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">
                    {branch.code}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Students</span>
                    <span className="font-bold text-slate-800">{branch.students}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Attendance</span>
                    <span className="font-bold text-emerald-600">{branch.attendance}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fee Collected</span>
                    <span className="font-bold text-indigo-600">{branch.fees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Management Reports Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Executive Management Reports Desk</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Report Selector Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-3 mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveReportType('FINANCIAL')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeReportType === 'FINANCIAL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                P&amp;L &amp; Revenue Run-Rate
              </button>
              <button
                onClick={() => setActiveReportType('FEE_COLLECTION')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeReportType === 'FEE_COLLECTION' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Fee Collection &amp; Defaulters
              </button>
              <button
                onClick={() => setActiveReportType('ACADEMIC_CBSE')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeReportType === 'ACADEMIC_CBSE' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                CBSE Board &amp; Term Results
              </button>
            </div>

            {/* Report Content Preview */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3 font-mono">
              {activeReportType === 'FINANCIAL' && (
                <div>
                  <div className="font-bold text-slate-900">EXECUTIVE P&amp;L STATEMENT — TERM 1 (2026-27)</div>
                  <div className="text-slate-600 mt-1">Delhi Public International School (Network of 3 Campuses)</div>
                  <div className="border-t border-slate-200 my-2 pt-2 space-y-1">
                    <div className="flex justify-between font-sans"><span>Gross Billed Tuition &amp; Lab Revenue:</span><strong>₹95,40,000</strong></div>
                    <div className="flex justify-between font-sans text-emerald-700"><span>Actual Collections Realized (87%):</span><strong>₹83,00,000</strong></div>
                    <div className="flex justify-between font-sans text-rose-700"><span>Staff Payroll &amp; Operational Costs:</span><strong>₹46,20,000</strong></div>
                    <div className="flex justify-between font-sans border-t border-slate-300 pt-1 font-bold text-slate-900"><span>Net Operating Surplus:</span><span className="text-emerald-700">+₹36,80,000</span></div>
                  </div>
                </div>
              )}

              {activeReportType === 'FEE_COLLECTION' && (
                <div>
                  <div className="font-bold text-slate-900">TERM 1 FEE DEFAULTERS &amp; AGING SUMMARY</div>
                  <div className="text-slate-600 mt-1">134 Students Overdue &gt; 30 Days</div>
                  <div className="border-t border-slate-200 my-2 pt-2 space-y-1 font-sans">
                    <div className="flex justify-between"><span>Central Campus (64 Defaulters):</span><strong>₹6.40 Lakhs</strong></div>
                    <div className="flex justify-between"><span>North Campus (42 Defaulters):</span><strong>₹3.80 Lakhs</strong></div>
                    <div className="flex justify-between"><span>South Campus (28 Defaulters):</span><strong>₹2.20 Lakhs</strong></div>
                    <div className="flex justify-between font-bold border-t border-slate-300 pt-1"><span>Total Outstanding Balance:</span><span className="text-amber-700">₹12.40 Lakhs</span></div>
                  </div>
                </div>
              )}

              {activeReportType === 'ACADEMIC_CBSE' && (
                <div>
                  <div className="font-bold text-slate-900">CBSE BOARD 2026-27 PROJECTION &amp; PERIODIC ASSESSMENT</div>
                  <div className="text-slate-600 mt-1">Class 10 &amp; Class 12 Cohort Performance (1,842 Total Body)</div>
                  <div className="border-t border-slate-200 my-2 pt-2 space-y-1 font-sans">
                    <div className="flex justify-between"><span>Distinction Rate (A1 / A2 Grades):</span><strong className="text-emerald-700">68.4%</strong></div>
                    <div className="flex justify-between"><span>First Class Rate (&gt; 60%):</span><strong>94.2%</strong></div>
                    <div className="flex justify-between"><span>Remedial Cohort Under Intervention:</span><strong className="text-rose-600">31 Students</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  window.print();
                  setIsReportModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print PDF Official Copy
              </button>
              <button
                onClick={() => {
                  setRemedialActionSuccess('Management Report exported to Excel (.xlsx) successfully!');
                  setIsReportModalOpen(false);
                  setTimeout(() => setRemedialActionSuccess(null), 4000);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Export to Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Owner / Director Campus Feature Controls & Add-on Manager Modal */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Campus Feature &amp; Add-on Configuration Hub</h3>
                  <p className="text-slate-500 text-xs">Manage active modules, add custom college features, and configure branch operational parameters.</p>
                </div>
              </div>
              <button
                onClick={() => setIsFeatureModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Campus Selector Bar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select College / Campus:</span>
                <select
                  value={selectedCampusForConfig}
                  onChange={(e) => setSelectedCampusForConfig(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-xs text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="DPS-CENTRAL">DPS Main Central Campus (Vasant Kunj) • CBSE K-12</option>
                  <option value="DPS-NORTH">DPS North Campus (Rohini) • CBSE Secondary</option>
                  <option value="DPS-SOUTH">DPS South Campus (Saket) • Primary &amp; Middle Wing</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddingFeature(!isAddingFeature)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> + Add Custom Feature to this College
              </button>
            </div>

            {/* Add Custom Feature Inline Form */}
            {isAddingFeature && (
              <form onSubmit={handleAddCustomFeature} className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl mb-5 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" /> Provision New Feature for {selectedCampusForConfig}
                  </h4>
                  <button type="button" onClick={() => setIsAddingFeature(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Feature / Module Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alumni Network, RFID Canteen..."
                      value={newFeatureName}
                      onChange={(e) => setNewFeatureName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newFeatureCategory}
                      onChange={(e) => setNewFeatureCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                    >
                      <option value="ACADEMICS">Academics &amp; LMS</option>
                      <option value="ADMINISTRATION">Administration &amp; HR</option>
                      <option value="OPERATIONS">Operations &amp; Security</option>
                      <option value="FINANCE">Finance &amp; Accounts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
                    <input
                      type="text"
                      placeholder="Purpose of this college module..."
                      value={newFeatureDesc}
                      onChange={(e) => setNewFeatureDesc(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                  >
                    Save &amp; Enable for this Campus
                  </button>
                </div>
              </form>
            )}

            {/* Core Feature Status (Licensed exclusively by Super Admin) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Core System Modules for {selectedCampusForConfig}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Core licenses are governed by Super Admin. Directors manage campus-specific programs &amp; operations.</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  🔒 Governed by Super Admin
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'aiInsights', label: 'AI Insights & Early Warning Engine', desc: 'Predict at-risk students & generate auto quizzes', badge: 'AI Powered' },
                  { key: 'gpsTransport', label: 'Transport Fleet GPS & Live Bus Tracking', desc: 'Live telematics, parent notifications & route allocation', badge: 'Fleet' },
                  { key: 'feeGateway', label: 'Online Fee Gateway & Stamped Invoices', desc: 'UPI/Netbanking collection & printable digital stamps', badge: 'Finance' },
                  { key: 'lmsHomework', label: 'Digital Homework & Student LMS Portal', desc: 'Assignments posting, rubric grading & student submissions', badge: 'LMS' },
                  { key: 'biometrics', label: 'Biometric Staff Check-in/out Tracker', desc: 'Facial/fingerprint hardware attendance integration', badge: 'HR' },
                  { key: 'hostel', label: 'Hostel & Residential Boarding Desk', desc: 'Room allotment, warden oversight & mess roster', badge: 'Campus' },
                  { key: 'library', label: 'Library Automation & Barcode Desk', desc: 'ISBN catalog, book issue/return & fine tracking', badge: 'Library' },
                  { key: 'tcEngine', label: 'Transfer Certificate (TC) Generator', desc: 'Official CBSE formatted certificate generation with seal', badge: 'Admin' },
                  { key: 'smsBroadcast', label: 'SMS & WhatsApp Circular Broadcast', desc: 'Instant bulk notifications to student/parent phones', badge: 'Comms' },
                  { key: 'hrPayroll', label: 'HR, Staff Workload & Payroll Ledger', desc: 'Salary structures, payslips, leaves & EPF/TDS', badge: 'HR' },
                ].map((feat) => {
                  const isEnabled = campusFeatures[selectedCampusForConfig]?.[feat.key] ?? false;
                  return (
                    <div
                      key={feat.key}
                      className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                        isEnabled ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-50/30 border-slate-100 opacity-60'
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
                      </div>

                      <div className="shrink-0">
                        {isEnabled ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Licensed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-semibold flex items-center gap-1">
                            Not Licensed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Add-on Modules List */}
              {customFeatures.filter(f => f.campusCode === selectedCampusForConfig).length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                    Custom Campus Modules Configured for {selectedCampusForConfig}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {customFeatures.filter(f => f.campusCode === selectedCampusForConfig).map((cf) => (
                      <div key={cf.id} className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-indigo-950">{cf.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                              {cf.category}
                            </span>
                          </div>
                          <p className="text-indigo-800/80 text-[11px] mt-0.5">{cf.description}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsFeatureModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Close Desk
              </button>
              <button
                onClick={() => {
                  setRemedialActionSuccess('Campus initiatives saved successfully!');
                  setIsFeatureModalOpen(false);
                  setTimeout(() => setRemedialActionSuccess(null), 4000);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Campus Initiatives
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
