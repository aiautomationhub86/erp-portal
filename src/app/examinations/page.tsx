'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Plus,
  X,
  Search,
  School,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ExaminationsPage() {
  const { activeRole, user } = useAuth();
  const [data, setData] = useState<any>({ exams: [], results: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'reportCard' | 'marksEntry'>('schedule');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const [marksForm, setMarksForm] = useState({
    examId: '',
    subjectId: '',
    studentId: '',
    marksObtained: '85',
    maxMarks: '100',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/exams');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.exams?.[0]) {
          setMarksForm((prev) => ({
            ...prev,
            examId: json.exams[0].id,
            subjectId: json.exams[0].semester?.subjects?.[0]?.id || '',
          }));
        }
      }

      const studRes = await fetch('/api/students');
      if (studRes.ok) {
        const studJson = await studRes.json();
        setStudents(studJson);
        if (studJson[0]) {
          setMarksForm((prev) => ({ ...prev, studentId: studJson[0].id }));
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

  const handleMarksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SUBMIT_MARKS', ...marksForm }),
      });
      if (res.ok) {
        setShowEntryModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> Module 8 • Examinations, Marks &amp; Results
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Examination Portal &amp; Grade Cards</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            MST and End-Semester datesheets, faculty marks submission, SGPA/CGPA calculation, and official printable transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(activeRole === 'TEACHER' || activeRole === 'HOD' || activeRole === 'ADMIN' || activeRole === 'SUPER_ADMIN') && (
            <button
              onClick={() => setShowEntryModal(true)}
              className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Enter Student Marks
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" /> Print Grade Sheet
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-600 no-print">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'schedule' ? 'border-purple-600 text-purple-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Exam Schedules &amp; Date Sheets
        </button>
        <button
          onClick={() => setActiveTab('reportCard')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'reportCard' ? 'border-purple-600 text-purple-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Official Student Grade Card (Transcript)
        </button>
      </div>

      {/* Tab: Schedules */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {data.exams?.map((exam: any) => (
            <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 uppercase">
                    {exam.type} EXAMINATION
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-1">{exam.name}</h3>
                  <p className="text-xs text-slate-500">
                    Semester {exam.semester?.semesterNum} • {exam.semester?.course?.name}
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Dates: {new Date(exam.startDate).toLocaleDateString()} to {new Date(exam.endDate).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {exam.semester?.subjects?.map((sub: any) => (
                  <div key={sub.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-mono font-bold text-purple-700 block">{sub.code}</span>
                    <h4 className="font-bold text-slate-800 mt-0.5">{sub.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Duration: 3 Hours • Max Marks: 100</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Report Card / Transcript (Printable Area) */}
      {activeTab === 'reportCard' && (
        <div className="printable-area bg-white rounded-2xl border border-slate-200 shadow-md p-8 max-w-4xl mx-auto space-y-6">
          {/* Institute Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <School className="w-8 h-8 text-blue-700" />
              <h2 className="text-xl font-extrabold tracking-wide uppercase text-slate-900">
                CAMPUS INSTITUTE OF TECHNOLOGY &amp; SCIENCES
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              (Autonomous Institute affiliated with Technical University • NAAC Grade A+ Accredited)
            </p>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mt-2">
              SEMESTER GRADE REPORT (TRANSCRIPT)
            </h3>
          </div>

          {/* Student Bio Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
              <span className="font-bold text-slate-800">Rahul Kumar</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll Number</span>
              <span className="font-mono font-bold text-slate-800">23CSE1023</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Program / Branch</span>
              <span className="font-bold text-slate-800">B.Tech (CSE)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester</span>
              <span className="font-bold text-slate-800">Semester 5 (Active)</span>
            </div>
          </div>

          {/* Grades Table */}
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 border-r">Course Code</th>
                <th className="py-2.5 px-3 border-r">Course Title</th>
                <th className="py-2.5 px-3 border-r text-center">Credits</th>
                <th className="py-2.5 px-3 border-r text-center">Marks (100)</th>
                <th className="py-2.5 px-3 text-center">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-mono border-r">CS501</td>
                <td className="py-2.5 px-3 font-medium border-r">Database Management Systems</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">4</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">88</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-700">A+</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono border-r">CS502</td>
                <td className="py-2.5 px-3 font-medium border-r">Computer Networks</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">4</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">82</td>
                <td className="py-2.5 px-3 text-center font-bold text-blue-700">A</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono border-r">CS503</td>
                <td className="py-2.5 px-3 font-medium border-r">Operating Systems</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">4</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">85</td>
                <td className="py-2.5 px-3 text-center font-bold text-blue-700">A</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono border-r">CS504</td>
                <td className="py-2.5 px-3 font-medium border-r">Software Engineering</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">3</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">80</td>
                <td className="py-2.5 px-3 text-center font-bold text-blue-700">A</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono border-r">CS505</td>
                <td className="py-2.5 px-3 font-medium border-r">DBMS &amp; SQL Laboratory</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">2</td>
                <td className="py-2.5 px-3 text-center border-r font-bold">94</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-700">A+</td>
              </tr>
            </tbody>
          </table>

          {/* GPA Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900 text-white rounded-xl text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-bold">Semester SGPA</span>
              <span className="text-xl font-extrabold text-emerald-400 mt-1 block">8.70</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-bold">Cumulative CGPA</span>
              <span className="text-xl font-extrabold text-blue-400 mt-1 block">8.42</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-bold">Result Status</span>
              <span className="text-sm font-extrabold text-emerald-300 mt-1.5 block">PASSED (FIRST CLASS)</span>
            </div>
          </div>

          <div className="pt-8 flex justify-between text-xs text-slate-500 border-t">
            <div>Date of Issue: 15-Sep-2026</div>
            <div>Controller of Examinations</div>
          </div>
        </div>
      )}

      {/* Marks Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Submit Student Marks</h2>
              <button onClick={() => setShowEntryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleMarksSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student</label>
                <select
                  value={marksForm.studentId}
                  onChange={(e) => setMarksForm({ ...marksForm, studentId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.user.name} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    required
                    value={marksForm.marksObtained}
                    onChange={(e) => setMarksForm({ ...marksForm, marksObtained: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={marksForm.maxMarks}
                    onChange={(e) => setMarksForm({ ...marksForm, maxMarks: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow"
                >
                  Save &amp; Compute Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
