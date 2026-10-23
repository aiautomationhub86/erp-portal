'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function FacultyAttendancePage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/attendance?type=TEACHER');
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

  useEffect(() => {
    fetchLogs();
  }, []);

  const handlePunchAttendance = async () => {
    try {
      const teacherId = user?.teacherProfile?.id || 'default-id';
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TEACHER_CHECKIN',
          teacherId,
        }),
      });
      if (res.ok) {
        setIsCheckedIn(!isCheckedIn);
        setActionMessage(isCheckedIn ? 'Checked out successfully!' : 'Checked in at 08:45 AM!');
        setTimeout(() => setActionMessage(''), 4000);
        fetchLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" /> Module 5 • Faculty Attendance &amp; Check-In Desk
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Faculty Attendance &amp; Work Hours</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Biometric simulation, digital punch in/out timestamps, and monthly staff presence tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {actionMessage && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {actionMessage}
            </span>
          )}
          <button
            onClick={handlePunchAttendance}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md transition-all ${
              isCheckedIn ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isCheckedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isCheckedIn ? 'Punch Check-Out' : 'Punch Check-In'}
          </button>
        </div>
      </div>

      {/* Daily Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 font-bold text-xs text-slate-700">
          Faculty Attendance Log (Recent 50 Check-Ins)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Faculty Name</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Check-Out Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-800">{log.teacher?.user?.name || 'Prof. Sneha Gupta'}</td>
                  <td className="py-3 px-4 font-mono">{log.teacher?.employeeId || 'FAC-CSE-014'}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:45 AM'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '17:15 PM'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'LATE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {log.status || 'PRESENT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
