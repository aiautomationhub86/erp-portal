'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Building,
  Layers,
  GraduationCap,
  Plus,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function AcademicsPage() {
  const [data, setData] = useState<any>({ departments: [], classrooms: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'departments' | 'subjects' | 'classrooms'>('departments');
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);

  const [deptForm, setDeptForm] = useState({
    code: '',
    name: '',
    hodName: '',
    hodEmail: '',
  });

  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    credits: '4',
    type: 'THEORY',
    departmentId: '',
    semesterId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/academics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.departments?.[0]) {
          setSubjectForm((prev) => ({
            ...prev,
            departmentId: json.departments[0].id,
            semesterId: json.departments[0].courses?.[0]?.semesters?.[0]?.id || '',
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_DEPARTMENT', ...deptForm }),
      });
      if (res.ok) {
        setShowAddDept(false);
        setDeptForm({ code: '', name: '', hodName: '', hodEmail: '' });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_SUBJECT', ...subjectForm }),
      });
      if (res.ok) {
        setShowAddSubject(false);
        setSubjectForm({
          code: '',
          name: '',
          credits: '4',
          type: 'THEORY',
          departmentId: data.departments?.[0]?.id || '',
          semesterId: data.departments?.[0]?.courses?.[0]?.semesters?.[0]?.id || '',
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" /> Module 6 • Curriculum &amp; Academic Architecture
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Academic Structure &amp; Courses</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Departments, Degree programs, Semesters, Subjects with credits, and Lecture hall allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddDept(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Department
          </button>
          <button
            onClick={() => setShowAddSubject(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Subject
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'departments' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Departments &amp; Degree Programs
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'subjects' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Curriculum &amp; Subjects Matrix
        </button>
        <button
          onClick={() => setActiveTab('classrooms')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'classrooms' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Lecture Halls &amp; Laboratories
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.departments?.map((dept: any) => (
            <div key={dept.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                    Code: {dept.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-1">{dept.name}</h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <Building className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Head of Dept (HOD):</span>
                  <span className="font-bold text-slate-700">{dept.hodName || 'Dr. Arvind Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Faculty Members:</span>
                  <span className="font-semibold text-slate-700">{dept.teachers?.length || 18} Teachers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Offered Programs:</span>
                  <span className="font-semibold text-blue-600">{dept.courses?.length || 1} Degree Course</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b font-bold text-xs text-slate-700">
            Subject Catalog &amp; Faculty Allocations
          </div>
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Allocated Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.departments?.flatMap((d: any) =>
                d.courses?.flatMap((c: any) =>
                  c.semesters?.flatMap((s: any) =>
                    s.subjects?.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{sub.code}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{sub.name}</td>
                        <td className="py-3 px-4 font-bold text-blue-600">{sub.credits} Credits</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.type === 'LAB' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {sub.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {sub.teacherAllocations?.[0]?.teacher?.user?.name || 'Prof. Sneha Gupta'}
                        </td>
                      </tr>
                    ))
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'classrooms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {data.classrooms?.map((room: any) => (
            <div key={room.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                {room.type}
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-2">{room.roomNumber}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{room.building} • Floor {room.floor}</p>
              <div className="mt-3 pt-2 border-t text-xs text-slate-600 flex justify-between">
                <span>Capacity:</span>
                <span className="font-bold">{room.capacity} Seats</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Add Academic Department</h2>
              <button onClick={() => setShowAddDept(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDept} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department Code</label>
                <input
                  type="text"
                  required
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                  placeholder="e.g. CIVIL"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Civil Engineering"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">HOD Full Name</label>
                <input
                  type="text"
                  value={deptForm.hodName}
                  onChange={(e) => setDeptForm({ ...deptForm, hodName: e.target.value })}
                  placeholder="Dr. K. Sharma"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddDept(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Add New Subject</h2>
              <button onClick={() => setShowAddSubject(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    placeholder="e.g. CS507"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Credits</label>
                  <input
                    type="number"
                    required
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                    placeholder="4"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g. Distributed Cloud Computing"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
