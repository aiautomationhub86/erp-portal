'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Check,
  X as XIcon,
  Clock,
  AlertTriangle,
  Users,
  Search,
  CheckCircle2,
  Calendar,
  Save,
  Download,
  Sparkles,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Info,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

/* =========================================================================
   1. STUDENT / PARENT READ-ONLY ATTENDANCE VIEW (NO PUNCHING)
   ========================================================================= */
function StudentAttendanceReadOnlyView() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentRecord = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/attendance?type=STUDENT_RECORD&userEmail=${user?.email || ''}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load student attendance record:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentRecord();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading verified academic attendance records...</p>
      </div>
    );
  }

  const student = data?.student || {
    name: user?.name || 'Aarav Sharma',
    rollNumber: user?.studentProfile?.rollNumber || '10024',
    course: 'Class 10 (CBSE)',
    section: 'A',
    branchCode: user?.branchCode || 'DPS-CENTRAL',
  };

  const summary = data?.summary || {
    overallPercentage: 88.5,
    totalHeld: 148,
    totalAttended: 131,
    totalAbsent: 17,
    totalLate: 2,
    isEligible: true,
  };

  const subjectBreakdown = data?.subjectBreakdown || [];
  const recentHistory = data?.recentHistory || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shrink-0">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold tracking-wider uppercase mb-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Read-Only Academic Record • Verified by Faculty
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {student.name} — Attendance Record
              </h1>
              <p className="text-blue-200 text-xs mt-0.5 flex flex-wrap items-center gap-2">
                <span>{student.course}</span>
                <span>•</span>
                <span>Section {student.section}</span>
                <span>•</span>
                <span className="font-mono bg-blue-800/60 px-2 py-0.5 rounded text-white text-[11px]">
                  Roll No: {student.rollNumber}
                </span>
                <span>•</span>
                <span className="text-blue-300 font-mono text-[11px]">{student.branchCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition border border-white/20 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Attendance Slip
            </button>
          </div>
        </div>
      </div>

      {/* Strict Institutional Policy Banner */}
      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold text-amber-950">Official Institutional Attendance Policy (Strict Rule)</p>
          <p className="text-amber-800 text-[11px] mt-0.5">
            Students cannot punch or alter their own attendance. Attendance is strictly recorded period-by-period by assigned subject faculty during regular class hours.
            This portal provides students and parents with official, read-only verification of cumulative attendance and CBSE/Board examination eligibility status.
          </p>
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative Attendance % */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overall Attendance</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
              summary.isEligible ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold tracking-tight ${
                summary.isEligible ? 'text-slate-900' : 'text-rose-600'
              }`}>
                {summary.overallPercentage}%
              </span>
              <span className="text-xs font-medium text-slate-400">Min 75% Req.</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${
                  summary.isEligible ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, summary.overallPercentage)}%` }}
              />
            </div>
            <div className="mt-2.5">
              {summary.isEligible ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Eligible for Board Exams
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-3 h-3 text-rose-600" /> Attendance Shortage Warning
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lectures Attended */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lectures Attended</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{summary.totalAttended}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Lectures</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-2">
              Marked Present by Subject Teachers
            </p>
          </div>
        </div>

        {/* Total Lectures Conducted */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Conducted</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{summary.totalHeld}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Lectures</span>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              Across all enrolled academic subjects
            </p>
          </div>
        </div>

        {/* Lectures Missed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Absences Recorded</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <XIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-600">{summary.totalAbsent}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Lectures</span>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              {summary.totalLate} late check-ins recorded
            </p>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Subject-Wise Attendance Breakdown</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Verified by respective subject faculty. 75% attendance mandatory in every subject.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs">
            {subjectBreakdown.length} Enrolled Subjects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Faculty In-Charge</th>
                <th className="py-3 px-4 text-center">Held</th>
                <th className="py-3 px-4 text-center">Attended</th>
                <th className="py-3 px-4 text-center">Absent</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Exam Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectBreakdown.map((sub: any) => (
                <tr key={sub.id || sub.code} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block text-xs">{sub.name}</span>
                    <span className="text-[10px] text-blue-600 font-mono font-medium">{sub.code}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sub.teacherName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {sub.totalLectures}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                    {sub.attendedLectures}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-500">
                    {sub.absentLectures}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-36">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className={sub.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}>
                          {sub.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(100, sub.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {sub.isShortage ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        <AlertTriangle className="w-3 h-3" /> Shortage (&lt;75%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" /> Eligible
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Day-by-Day Attendance Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Class Attendance Log</h2>
            <p className="text-slate-500 text-xs">Official period-by-period roll-call logs submitted by faculty.</p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Last 15 Sessions</span>
        </div>

        {recentHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No recent attendance session logs found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentHistory.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    item.status === 'PRESENT'
                      ? 'bg-emerald-50 text-emerald-600'
                      : item.status === 'LATE'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.status === 'PRESENT' && <Check className="w-4 h-4" />}
                    {item.status === 'LATE' && <Clock className="w-4 h-4" />}
                    {item.status === 'ABSENT' && <XIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{item.subjectName} ({item.subjectCode})</span>
                    <span className="text-[11px] text-slate-400">{item.date} • {item.period}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    item.status === 'PRESENT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'LATE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400">
                    <Lock className="w-2.5 h-2.5" /> Verified by Faculty
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   2. FACULTY & ADMINISTRATIVE ATTENDANCE REGISTER (TEACHERS / PRINCIPALS)
   ========================================================================= */
export default function StudentAttendancePage() {
  const { user, activeRole } = useAuth();

  // If user is Student or Parent, show the strictly read-only view with no punching!
  if (activeRole === 'STUDENT' || activeRole === 'PARENT') {
    return <StudentAttendanceReadOnlyView />;
  }

  // Otherwise, render Faculty & Administrative Class Attendance Register
  return <FacultyAttendanceRegisterView />;
}

function FacultyAttendanceRegisterView() {
  const { user, activeRole } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectOptions, setSubjectOptions] = useState<any[]>([
    { id: 'MATH-10', code: 'MATH-10', name: 'Mathematics (Standard 041)', courseName: 'Class 10 (CBSE)' },
    { id: 'SCI-10', code: 'SCI-10', name: 'Science (Physics, Chemistry, Biology 086)', courseName: 'Class 10 (CBSE)' },
  ]);
  const [sectionOptions, setSectionOptions] = useState<any[]>([
    { id: 'A', name: 'Section A', displayName: 'Class 10 - Section A' },
    { id: 'B', name: 'Section B', displayName: 'Class 10 - Section B' },
  ]);
  const [subject, setSubject] = useState('MATH-10');
  const [section, setSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'LATE' | 'SHORTAGE'>('ALL');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [punchingId, setPunchingId] = useState<string | null>(null);
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  // 1. Fetch Teacher / Principal Metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`/api/attendance?type=METADATA&role=${activeRole}&userEmail=${user?.email || ''}`);
        if (res.ok) {
          const data = await res.json();
          if (data.subjects && data.subjects.length > 0) {
            setSubjectOptions(data.subjects);
            const found = data.subjects.some((s: any) => s.code === subject || s.id === subject);
            if (!found) {
              setSubject(data.subjects[0].code || data.subjects[0].id);
            }
          }
          if (data.sections && data.sections.length > 0) {
            setSectionOptions(data.sections);
          }
        }
      } catch (err) {
        console.error('Failed to load attendance metadata:', err);
      }
    };
    fetchMetadata();
  }, [activeRole, user?.email]);

  // 2. Fetch Student Attendance Roster Scoped to Subject & Section
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const branch = user?.branchCode || 'DPS-CENTRAL';
      const res = await fetch(
        `/api/attendance?subjectId=${subject}&section=${section}&branchCode=${branch}&role=${activeRole}&userEmail=${user?.email || ''}`
      );
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
        data.forEach((s: any) => {
          map[s.id] = s.todayStatus || 'PRESENT';
        });
        setAttendanceMap(map);
      }
    } catch (e) {
      console.error('Error fetching attendance:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject) {
      fetchAttendanceData();
    }
  }, [subject, section, activeRole, user?.email]);

  // Faculty Mark Student
  const handleFacultyMark = async (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE', studentName: string) => {
    setPunchingId(studentId);
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const wasPresent = s.todayStatus === 'PRESENT';
          const isNowPresent = status === 'PRESENT';
          const newPresent = isNowPresent && !wasPresent
            ? s.presentSessions + 1
            : !isNowPresent && wasPresent
            ? Math.max(0, s.presentSessions - 1)
            : s.presentSessions;
          const newTotal = Math.max(s.totalSessions || 28, newPresent);
          const boundedPresent = Math.min(newPresent, newTotal);
          const newPct = Math.min(100, Math.max(0, Math.round((boundedPresent / newTotal) * 1000) / 10));
          return {
            ...s,
            todayStatus: status,
            presentSessions: boundedPresent,
            totalSessions: newTotal,
            attendancePercentage: newPct,
            isShortage: newPct < 75,
          };
        }
        return s;
      })
    );

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'FACULTY_MARK_STUDENT',
          studentId,
          subjectId: subject,
          status,
          callerRole: activeRole,
        }),
      });

      if (res.ok) {
        setSavedSuccess(`Marked ${studentName} as ${status}!`);
        setTimeout(() => setSavedSuccess(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPunchingId(null);
    }
  };

  const markAll = async (status: 'PRESENT' | 'ABSENT') => {
    setIsSavingBatch(true);
    const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    const records = students.map((s) => {
      map[s.id] = status;
      return {
        studentId: s.id,
        subjectId: subject,
        status,
      };
    });
    setAttendanceMap(map);
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        todayStatus: status,
      }))
    );

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, callerRole: activeRole }),
      });
      if (res.ok) {
        setSavedSuccess(`All ${students.length} students marked as ${status} and saved!`);
        setTimeout(() => setSavedSuccess(null), 4000);
        fetchAttendanceData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingBatch(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSavingBatch(true);
    const records = Object.entries(attendanceMap).map(([studentId, status]) => ({
      studentId,
      subjectId: subject,
      status,
    }));

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, callerRole: activeRole }),
      });
      if (res.ok) {
        setSavedSuccess('All student attendance records saved to database!');
        setTimeout(() => setSavedSuccess(null), 4000);
        fetchAttendanceData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingBatch(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const currentStatus = attendanceMap[s.id] || s.todayStatus || 'PRESENT';
    if (activeFilter === 'PRESENT') return currentStatus === 'PRESENT';
    if (activeFilter === 'ABSENT') return currentStatus === 'ABSENT';
    if (activeFilter === 'LATE') return currentStatus === 'LATE';
    if (activeFilter === 'SHORTAGE') return s.isShortage;
    return true;
  });

  const shortageCount = students.filter((s) => s.isShortage).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" /> Faculty Attendance Desk • Class Roll-Call
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Faculty Student Attendance Register</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Only authorized faculty and administrators can mark attendance for their respective students and subjects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {savedSuccess}
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Roster Batch
          </button>
        </div>
      </div>

      {/* Role Banner */}
      {activeRole === 'TEACHER' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Faculty Attendance Register: {user?.name || 'Assigned Teacher'}</p>
              <p className="text-emerald-700 text-[11px]">
                You can only mark attendance for your assigned subjects ({subjectOptions.map((s) => s.code).join(', ')}) &amp; respective students.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-200/80 text-emerald-900 font-bold rounded-lg text-[10px]">
            {subjectOptions.length} Assigned Subjects
          </span>
        </div>
      )}

      {activeRole === 'PRINCIPAL' && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs text-purple-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Principal Institutional Attendance Oversight — {user?.branchCode || 'DPS-CENTRAL'}</p>
              <p className="text-purple-700 text-[11px]">
                Campus-wide attendance registers across all sections and classes.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-purple-200/80 text-purple-900 font-bold rounded-lg text-[10px]">
            Campus Oversight
          </span>
        </div>
      )}

      {/* Selector Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                {activeRole === 'TEACHER' ? 'My Assigned Subject' : 'Subject / Class'}
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
              >
                {subjectOptions.map((sub) => (
                  <option key={sub.code || sub.id} value={sub.code || sub.id}>
                    {sub.code} - {sub.name} ({sub.courseName || 'Class 10'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700"
              >
                {sectionOptions.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.displayName || `Class 10 - Section ${sec.name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div>
              <label className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Search Student</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Name or Roll No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 w-48"
                />
              </div>
            </div>
          </div>

          {/* Quick bulk markers */}
          <div className="flex items-center gap-2 self-end">
            <span className="text-slate-400 font-semibold text-xs">Bulk Action:</span>
            <button
              disabled={isSavingBatch}
              onClick={() => markAll('PRESENT')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" /> Mark All Present
            </button>
            <button
              disabled={isSavingBatch}
              onClick={() => markAll('ABSENT')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1 active:scale-95"
            >
              <XIcon className="w-3.5 h-3.5" /> Mark All Absent
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setActiveFilter('PRESENT')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeFilter === 'PRESENT'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Present Today ({students.filter((s) => (attendanceMap[s.id] || s.todayStatus) === 'PRESENT').length})
            </button>
            <button
              onClick={() => setActiveFilter('ABSENT')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeFilter === 'ABSENT'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Absent Today ({students.filter((s) => (attendanceMap[s.id] || s.todayStatus) === 'ABSENT').length})
            </button>
            <button
              onClick={() => setActiveFilter('LATE')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeFilter === 'LATE'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Late ({students.filter((s) => (attendanceMap[s.id] || s.todayStatus) === 'LATE').length})
            </button>
            <button
              onClick={() => setActiveFilter('SHORTAGE')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                activeFilter === 'SHORTAGE'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-100/60 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-600" /> Shortage &lt;75% ({shortageCount})
            </button>
          </div>

          <div className="text-slate-400 text-[11px] font-medium">
            Showing {filteredStudents.length} of {students.length} students enrolled in {section}
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading faculty attendance roster...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No students found in this subject and section.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class &amp; Roll Number</th>
                  <th className="py-3 px-4">Cumulative Attendance %</th>
                  <th className="py-3 px-4">Exam Eligibility</th>
                  <th className="py-3 px-4 text-center">Faculty Attendance Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const currentStatus = attendanceMap[st.id] || st.todayStatus || 'PRESENT';
                  const isPunching = punchingId === st.id;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={st.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">{st.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{st.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-bold text-slate-800 text-xs">{st.rollNumber}</span>
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium inline-block w-fit">
                            Class 10-Section {st.section} • {st.branchCode}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              st.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {st.attendancePercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({st.presentSessions}/{st.totalSessions} Sessions)
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {st.isShortage ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            <AlertTriangle className="w-3 h-3" /> Shortage (&lt;75%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> Eligible for Exams
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 gap-1 shadow-inner">
                          <button
                            type="button"
                            disabled={isPunching}
                            onClick={() => handleFacultyMark(st.id, 'PRESENT', st.name)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-400/40'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3" /> Present
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={isPunching}
                            onClick={() => handleFacultyMark(st.id, 'LATE', st.name)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'LATE'
                                ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-amber-400/40'
                                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Late
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={isPunching}
                            onClick={() => handleFacultyMark(st.id, 'ABSENT', st.name)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              currentStatus === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-md scale-105 ring-2 ring-rose-400/40'
                                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              <XIcon className="w-3 h-3" /> Absent
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
