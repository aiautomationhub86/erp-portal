'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Activity,
  Database,
  CheckCircle2,
  Lock,
  Users,
  Server,
  RefreshCw,
  Building,
  Sparkles,
  Plus,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { activeRole, user } = useAuth();
  const isSuperAdmin = activeRole === 'SUPER_ADMIN';
  const [activeTab, setActiveTab] = useState<'CAMPUS_CONFIG' | 'RBAC' | 'AUDIT_LOGS'>('CAMPUS_CONFIG');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState(user?.branchCode || 'DPS-CENTRAL');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Sync selected campus with user's branch if not Super Admin
  useEffect(() => {
    if (!isSuperAdmin && user?.branchCode) {
      setSelectedCampus(user.branchCode);
    }
  }, [isSuperAdmin, user?.branchCode]);

  const [campusList, setCampusList] = useState([
    { code: 'DPS-CENTRAL', name: 'Main Central Campus (Vasant Kunj)', type: 'CBSE K-12 + STEM College', head: 'Dr. Shailaja Mehra', capacity: 1200, status: 'ACTIVE' },
    { code: 'DPS-NORTH', name: 'North Campus (Rohini)', type: 'CBSE Secondary Wing', head: 'Mr. Anupam Verma', capacity: 600, status: 'ACTIVE' },
    { code: 'DPS-SOUTH', name: 'South Campus (Saket)', type: 'Primary & Middle School', head: 'Mrs. Radhika Sen', capacity: 450, status: 'ACTIVE' },
  ]);

  const [featuresByCampus, setFeaturesByCampus] = useState<Record<string, Record<string, boolean>>>({
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

  const [customAddons, setCustomAddons] = useState<Array<{ id: string; campusCode: string; name: string; category: string; description: string }>>([
    { id: '1', campusCode: 'DPS-CENTRAL', name: 'Robotics & STEM AI Lab', category: 'ACADEMICS', description: 'Advanced IoT & AI lab workstation tracking' },
    { id: '2', campusCode: 'DPS-CENTRAL', name: 'Smart RFID Cafeteria Meal Pass', category: 'OPERATIONS', description: 'Contactless wallet for canteen meals' },
  ]);

  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureCategory, setNewFeatureCategory] = useState('ACADEMICS');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleFeature = (campus: string, featKey: string) => {
    if (!isSuperAdmin) {
      setSaveSuccess('Permission Denied: Core Module licensing is controlled exclusively by Super Admin.');
      setTimeout(() => setSaveSuccess(null), 4000);
      return;
    }
    setFeaturesByCampus((prev) => ({
      ...prev,
      [campus]: {
        ...prev[campus],
        [featKey]: !prev[campus]?.[featKey],
      },
    }));
    setSaveSuccess(`Super Admin updated module license for ${campus}!`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    setCustomAddons((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        campusCode: selectedCampus,
        name: newFeatureName,
        category: newFeatureCategory,
        description: newFeatureDesc || 'Custom institution module configured by Owner',
      },
    ]);
    setNewFeatureName('');
    setNewFeatureDesc('');
    setShowAddModal(false);
    setSaveSuccess(`Added custom module "${newFeatureName}" to ${selectedCampus}!`);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ROLES_PERMISSIONS = [
    { role: 'Super Admin', access: 'Unrestricted Full ERP Access & System Config' },
    { role: 'Admin', access: 'Students, Faculty, Timetable, Fees, Exam Schedules' },
    { role: 'HOD', access: 'Department oversight, Staff allocation, Leave approvals' },
    { role: 'Teacher / Faculty', access: 'Class roster, Attendance marking, Marks entry' },
    { role: 'Student', access: 'Personal Dashboard, Today classes, Results, Dues, Notices' },
    { role: 'Parent', access: 'Ward attendance tracker, Fee invoices, Exam results' },
    { role: 'Accountant', access: 'Fee billing, Receipt generation, Defaulter ledger' },
    { role: 'Librarian', access: 'Library catalog, Issue/Return desk, Overdue fine' },
    { role: 'Placement Officer', access: 'Job drives, Eligibility filters, Applications' },
    { role: 'Hostel Warden', access: 'Block occupancy, Room allotments, Complaints' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" /> Institutional Administration • Governance &amp; Controls
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Campus Settings &amp; Feature Manager</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {isSuperAdmin
              ? 'Super Admin master console: Configure multi-college feature licenses, provision custom modules, and manage global network.'
              : 'School Owner / Director console: View campus operational status, custom college modules, and licensed ERP capabilities.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {saveSuccess}
            </span>
          )}
          <button
            onClick={fetchLogs}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('CAMPUS_CONFIG')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'CAMPUS_CONFIG'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" /> 1. Campus Feature Controls &amp; Add-ons
        </button>
        <button
          onClick={() => setActiveTab('RBAC')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'RBAC'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" /> 2. RBAC Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'AUDIT_LOGS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" /> 3. System Audit Trail
        </button>
      </div>

      {/* TAB 1: CAMPUS CONFIGURATION & FEATURE CONTROLS */}
      {activeTab === 'CAMPUS_CONFIG' && (
        <div className="space-y-6">
          {/* Campus Selector and Profile Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {isSuperAdmin ? 'Currently Managing Campus / College (Super Admin Switcher):' : 'Assigned Institution & Campus:'}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  {isSuperAdmin ? (
                    <select
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 font-bold text-sm text-slate-900 shadow-2xs focus:ring-2 focus:ring-blue-500/20"
                    >
                      {campusList.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.type})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                      <Building className="w-4 h-4 text-blue-700" />
                      <span className="font-bold text-sm text-blue-950">
                        {campusList.find(c => c.code === selectedCampus)?.name || 'Main Central Campus (Vasant Kunj)'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-800">
                        {selectedCampus}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> + Add Custom Feature / Module
              </button>
            </div>

            {/* Campus Profile Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Campus Code</span>
                <span className="font-bold text-slate-800 text-sm font-mono mt-0.5 block">{selectedCampus}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Principal / Dean</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {campusList.find(c => c.code === selectedCampus)?.head || 'Dr. Shailaja Mehra'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Approved Capacity</span>
                <span className="font-bold text-blue-700 text-sm mt-0.5 block">
                  {campusList.find(c => c.code === selectedCampus)?.capacity || 1200} Students
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Operational Status</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active &amp; Enrolled
                </span>
              </div>
            </div>
          </div>

          {/* Add Custom Module Modal / Inline Box */}
          {showAddModal && (
            <form onSubmit={handleAddModule} className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Provision Custom College Module for {selectedCampus}
                </h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Module Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Placement Cell, Robotics LMS..."
                    value={newFeatureName}
                    onChange={(e) => setNewFeatureName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Category</label>
                  <select
                    value={newFeatureCategory}
                    onChange={(e) => setNewFeatureCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="ACADEMICS">Academics &amp; Curriculum</option>
                    <option value="ADMINISTRATION">Administration &amp; HR</option>
                    <option value="OPERATIONS">Operations &amp; Security</option>
                    <option value="FINANCE">Finance &amp; Accounts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operational Description</label>
                  <input
                    type="text"
                    placeholder="Describe module purpose..."
                    value={newFeatureDesc}
                    onChange={(e) => setNewFeatureDesc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                >
                  Save &amp; Activate Module
                </button>
              </div>
            </form>
          )}

          {/* Core Feature Matrix Toggles */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> Core Module Controls for {selectedCampus}
              </h3>
              {isSuperAdmin ? (
                <span className="text-xs font-semibold text-red-600 flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                  <Lock className="w-3 h-3" /> Super Admin Licensing Console (Active Switches)
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Lock className="w-3 h-3" /> Governed &amp; Licensed exclusively by Super Admin
                </span>
              )}
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
                const isEnabled = featuresByCampus[selectedCampus]?.[feat.key] ?? false;
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

                    {isSuperAdmin ? (
                      <button
                        type="button"
                        onClick={() => toggleFeature(selectedCampus, feat.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
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
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Addons on this campus */}
            {customAddons.filter(f => f.campusCode === selectedCampus).length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                  Custom Institutional Modules for {selectedCampus}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {customAddons.filter(f => f.campusCode === selectedCampus).map((cf) => (
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
        </div>
      )}

      {/* TAB 2: RBAC PERMISSIONS */}
      {activeTab === 'RBAC' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-blue-600" /> 10 Configured User Roles &amp; Access Privileges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {ROLES_PERMISSIONS.map((item) => (
              <div key={item.role} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block">{item.role}</span>
                  <span className="text-slate-500 text-[11px] mt-0.5 block">{item.access}</span>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b font-bold text-xs text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Real-time System Audit Trail
            </span>
            <span className="text-slate-400 text-[10px]">Indexed by timestamp</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Initiator User</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{log.action}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{log.details}</td>
                    <td className="py-3 px-4 font-medium">{log.user?.name || 'System Auto'}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
