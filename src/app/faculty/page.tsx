'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Clock,
  Building,
  Award,
  IndianRupee,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    designation: 'Assistant Professor',
    qualification: 'M.Tech CSE',
    departmentCode: 'CSE',
    salary: '85000',
  });

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedDept) params.append('department', selectedDept);

      const res = await fetch(`/api/faculty?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFaculty(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [search, selectedDept]);

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          employeeId: '',
          designation: 'Assistant Professor',
          qualification: 'M.Tech CSE',
          departmentCode: 'CSE',
          salary: '85000',
        });
        fetchFaculty();
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
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" /> Module 3 • Faculty Directory &amp; Workload
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Teacher &amp; Faculty Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Employee records, academic specializations, assigned subjects, and teaching workload hours.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/10 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" /> Onboard Faculty Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by faculty name, designation, employee ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 font-medium text-slate-700"
        >
          <option value="">All Departments</option>
          <option value="CSE">Computer Science (CSE)</option>
          <option value="ECE">Electronics (ECE)</option>
          <option value="MECH">Mechanical (MECH)</option>
        </select>
      </div>

      {/* Grid of Faculty Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border border-slate-200">
          Loading faculty roster...
        </div>
      ) : faculty.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border border-slate-200">
          No faculty members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {faculty.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={f.user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
                    alt={f.user.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                      {f.department?.code} • {f.employeeId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 truncate mt-1">{f.user.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{f.designation}</p>
                  </div>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Qualification:</span>
                    <span className="font-semibold text-slate-700">{f.qualification}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Courses:</span>
                    <span className="font-semibold text-indigo-600">{f.teacherSubjects?.length || 2} Subjects</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Workload:</span>
                    <span className="font-semibold text-slate-700">14 Hours/Week</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[130px] font-mono text-[11px]">{f.user.email}</span>
                </div>
                <button
                  onClick={() => setSelectedFaculty(f)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Onboard New Faculty Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaculty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Faculty Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="FAC-CSE-025"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={formData.departmentCode}
                    onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="ECE">Electronics (ECE)</option>
                    <option value="MECH">Mechanical (MECH)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="Professor & HOD">Professor &amp; HOD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="Ph.D. Computer Science"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
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
                    placeholder="faculty@college.edu"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="85000"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow"
                >
                  Save &amp; Appoint Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Faculty Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedFaculty.user.avatar}
                  alt={selectedFaculty.user.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h2 className="text-base font-bold text-slate-800">{selectedFaculty.user.name}</h2>
                  <p className="text-xs text-slate-500">{selectedFaculty.designation} • {selectedFaculty.department?.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedFaculty(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between"><span className="text-slate-500">Employee ID:</span> <span className="font-bold">{selectedFaculty.employeeId}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Qualification:</span> <span className="font-bold">{selectedFaculty.qualification}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-mono">{selectedFaculty.user.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Monthly Compensation:</span> <span className="font-bold text-emerald-600">₹{selectedFaculty.salary?.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
