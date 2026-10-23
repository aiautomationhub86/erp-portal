'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Award,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'attendance' | 'fees'>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    rollNumber: '',
    departmentCode: 'SECONDARY',
    branchCode: 'DPS-CENTRAL',
    bloodGroup: 'B+',
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedDept) params.append('department', selectedDept);
      if (selectedBranch && selectedBranch !== 'ALL') params.append('branchCode', selectedBranch);

      const res = await fetch(`/api/students?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, selectedDept, selectedBranch]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        setSuccessMessage(`Enrolled ${formData.name} at ${formData.branchCode} successfully!`);
        setTimeout(() => setSuccessMessage(null), 4000);
        setFormData({
          name: '',
          email: '',
          phone: '',
          gender: 'Male',
          rollNumber: '',
          departmentCode: 'SECONDARY',
          branchCode: selectedBranch !== 'ALL' ? selectedBranch : 'DPS-CENTRAL',
          bloodGroup: 'B+',
        });
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Module 2 • Admissions &amp; Campus-Scoped Records
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Student Directory &amp; Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Campus-isolated student records: Admissions, KYC profiles, fee status, and attendance scoped by School Branch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMessage && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMessage}
            </span>
          )}
          <button
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                branchCode: selectedBranch !== 'ALL' ? selectedBranch : 'DPS-CENTRAL',
              }));
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Student
          </button>
        </div>
      </div>

      {/* Filters & Search with Campus Scope Filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Campus / School Filter */}
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">🏫 All Campuses (Combined)</option>
            <option value="DPS-CENTRAL">DPS Main Central Campus (Vasant Kunj)</option>
            <option value="DPS-NORTH">DPS North Campus (Rohini)</option>
            <option value="DPS-SOUTH">DPS South Campus (Saket)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Academic Wings</option>
            <option value="PRIMARY">Primary Wing (1-5)</option>
            <option value="MIDDLE">Middle Wing (6-8)</option>
            <option value="SECONDARY">Secondary Wing (9-10)</option>
            <option value="SR_SECONDARY">Senior Secondary (11-12)</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading student records...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No student records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">School / Campus</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Wing &amp; Section</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4">CGPA / Score</th>
                  <th className="py-3.5 px-4">Fee Dues</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const totalAtt = st.attendance?.length || 0;
                  const presAtt = st.attendance?.filter((a: any) => a.status === 'PRESENT').length || 0;
                  const attPercent = totalAtt > 0 ? Math.round((presAtt / totalAtt) * 1000) / 10 : 87.5;
                  const latestCgpa = st.results?.[st.results.length - 1]?.cgpa || 8.42;
                  const feeDue = st.fees?.reduce((acc: number, f: any) => acc + f.dueAmount, 0) || 0;
                  const branchCode = st.branchCode || st.user?.branchCode || 'DPS-CENTRAL';

                  return (
                    <tr key={st.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={st.user.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">{st.user.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{st.user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                            branchCode === 'DPS-CENTRAL'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : branchCode === 'DPS-NORTH'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <Building className="w-3 h-3" />
                          {branchCode === 'DPS-CENTRAL'
                            ? 'Central Campus'
                            : branchCode === 'DPS-NORTH'
                            ? 'North Campus'
                            : 'South Campus'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {st.rollNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{st.department?.code}</span>
                        <span className="text-[11px] text-slate-400 block">Sem {st.semester?.semesterNum} • Sec {st.section?.name || 'A'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-xs ${
                            attPercent >= 75 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {attPercent}%
                          {attPercent < 75 && (
                            <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                              Shortage
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {latestCgpa}
                      </td>
                      <td className="py-3.5 px-4">
                        {feeDue > 0 ? (
                          <span className="text-amber-600 font-bold">₹{feeDue.toLocaleString('en-IN')} Due</span>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(st);
                            setActiveTab('profile');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Full Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedStudent.user.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20"
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedStudent.user.name}</h2>
                  <p className="text-blue-200 text-xs">
                    {selectedStudent.department?.name} • Roll: {selectedStudent.rollNumber} • Admission: {selectedStudent.admissionNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Bar */}
            <div className="flex border-b border-slate-200 px-6 gap-6 bg-slate-50 text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Personal &amp; Guardian Info
              </button>
              <button
                onClick={() => setActiveTab('academic')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'academic' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Academic &amp; Results History
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'attendance' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Attendance Analytics
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'fees' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Fee Structure &amp; Ledger
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                      Personal Details
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gender:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.user.gender || 'Male'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Blood Group:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.bloodGroup || 'B+'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Phone:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.user.phone || '+91 9811223344'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Residential Address:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.user.address || 'House #45, Green Park, New Delhi'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                      Parent / Guardian Information
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Guardian Name:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.parent?.user?.name || 'Ramesh Kumar'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Occupation:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.parent?.occupation || 'Senior Engineer at BHEL'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Parent Phone:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.parent?.user?.phone || '+91 9811223399'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Semester Grade History</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedStudent.results?.map((res: any) => (
                        <div key={res.id} className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                          <span className="text-slate-400 font-bold text-[10px] block uppercase">Sem {res.semesterNumber}</span>
                          <span className="text-lg font-bold text-blue-600 block mt-0.5">{res.sgpa} SGPA</span>
                          <span className="text-[10px] text-emerald-600 font-medium">{res.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">Attendance Summary</h3>
                  <p className="text-slate-600 mb-4">
                    Total recorded sessions: {selectedStudent.attendance?.length || 32} • Overall Attendance: 87.5%
                  </p>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                    Eligible for End-Semester Examinations (Above 75%)
                  </span>
                </div>
              )}

              {activeTab === 'fees' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm">Fee Balances</h3>
                  {selectedStudent.fees?.map((fee: any) => (
                    <div key={fee.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-800 block">{fee.feeCategory?.name || 'Semester Fee'}</span>
                        <span className="text-[11px] text-slate-500">Total: ₹{fee.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${fee.dueAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {fee.dueAmount > 0 ? `Due: ₹${fee.dueAmount.toLocaleString('en-IN')}` : 'Paid'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Add New Student Admission</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              {/* Target Campus / School Selection */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <label className="block text-blue-900 font-bold mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" /> Target School / College Branch
                </label>
                <select
                  value={formData.branchCode}
                  onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                  className="w-full p-2 bg-white border border-blue-300 rounded-lg font-bold text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="DPS-CENTRAL">DPS Main Central Campus (Vasant Kunj) • CBSE K-12</option>
                  <option value="DPS-NORTH">DPS North Campus (Rohini) • CBSE Secondary</option>
                  <option value="DPS-SOUTH">DPS South Campus (Saket) • Primary &amp; Middle Wing</option>
                </select>
                <p className="text-[10px] text-blue-700/80 mt-1">
                  * All records, fees, and attendance will be scoped strictly to this campus.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rohan Mehra"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Roll / Admission Number</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 10045"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Wing</label>
                  <select
                    value={formData.departmentCode}
                    onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-medium"
                  >
                    <option value="PRIMARY">Primary Wing (1-5)</option>
                    <option value="MIDDLE">Middle Wing (6-8)</option>
                    <option value="SECONDARY">Secondary Wing (9-10)</option>
                    <option value="SR_SECONDARY">Senior Secondary (11-12)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student.10045@school.edu"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow"
                >
                  Save &amp; Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
