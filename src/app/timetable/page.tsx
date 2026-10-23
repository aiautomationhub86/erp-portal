'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Filter,
  X,
} from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const TIME_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
];

export default function TimetablePage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const [slotForm, setSlotForm] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '11:00',
    endTime: '12:00',
    subjectId: '',
    teacherId: '',
    classroomId: '',
    sectionId: '',
  });

  const [academics, setAcademics] = useState<any>({ departments: [], classrooms: [] });

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/timetable');
      if (res.ok) {
        const data = await res.json();
        setSlots(data);
      }

      const acadRes = await fetch('/api/academics');
      if (acadRes.ok) {
        const acadData = await acadRes.json();
        setAcademics(acadData);

        const firstDept = acadData.departments?.[0];
        const firstSem = firstDept?.courses?.[0]?.semesters?.[0];
        const firstSec = firstSem?.sections?.[0];
        const firstSub = firstSem?.subjects?.[0];
        const firstTeacher = firstDept?.teachers?.[0];
        const firstRoom = acadData.classrooms?.[0];

        setSlotForm({
          dayOfWeek: 'MONDAY',
          startTime: '11:00',
          endTime: '12:00',
          subjectId: firstSub?.id || '',
          teacherId: firstTeacher?.id || '',
          classroomId: firstRoom?.id || '',
          sectionId: firstSec?.id || '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);
    try {
      const res = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotForm),
      });
      const json = await res.json();

      if (!res.ok) {
        setConflictError(json.error || 'Failed to schedule slot due to collision.');
        return;
      }

      setShowAddModal(false);
      fetchTimetable();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" /> Module 7 • Dynamic Timetable &amp; Schedule
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Weekly Class Timetable</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Interactive schedule grid with built-in conflict detection for classrooms and faculty.
          </p>
        </div>

        <button
          onClick={() => {
            setConflictError(null);
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Schedule Class Slot
        </button>
      </div>

      {/* Timetable Grid View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700 uppercase">
            B.Tech CSE — Semester 5 (Section A) Schedule
          </span>
          <span className="text-[11px] text-slate-400">Monday – Friday</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-6 gap-3 text-xs">
            {/* Header row */}
            <div className="font-bold text-slate-400 p-2 uppercase text-[10px]">Time / Day</div>
            {DAYS.map((day) => (
              <div key={day} className="font-bold text-slate-700 bg-slate-100/70 p-2.5 rounded-lg text-center">
                {day}
              </div>
            ))}

            {/* Time Slot Rows */}
            {TIME_SLOTS.map((timeRange) => {
              const start = timeRange.split(' - ')[0];
              return (
                <React.Fragment key={timeRange}>
                  <div className="font-mono font-bold text-slate-500 flex items-center justify-center p-2 bg-slate-50 rounded-lg text-[11px]">
                    {timeRange}
                  </div>
                  {DAYS.map((day) => {
                    const matchedSlot = slots.find(
                      (s) => s.dayOfWeek === day && s.startTime === start
                    );

                    if (matchedSlot) {
                      return (
                        <div
                          key={`${day}-${timeRange}`}
                          className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors"
                        >
                          <div>
                            <span className="font-bold text-blue-950 block leading-tight">
                              {matchedSlot.subject?.code}
                            </span>
                            <span className="text-[11px] text-blue-800 font-medium block truncate">
                              {matchedSlot.subject?.name}
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-between text-[10px] text-slate-600">
                            <span className="flex items-center gap-1 font-semibold text-indigo-700">
                              <MapPin className="w-2.5 h-2.5" /> {matchedSlot.classroom?.roomNumber}
                            </span>
                            <span className="truncate max-w-[70px] text-slate-500">
                              {matchedSlot.teacher?.user?.name?.split(' ')?.[1] || 'Faculty'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`${day}-${timeRange}`}
                        className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/30 flex items-center justify-center text-slate-300 text-[10px]"
                      >
                        Free Slot
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Slot Modal with Collision Warning */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Schedule Class Slot</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}

            <form onSubmit={handleAddSlot} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Day of Week</label>
                  <select
                    value={slotForm.dayOfWeek}
                    onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time Range</label>
                  <select
                    value={slotForm.startTime}
                    onChange={(e) => {
                      const start = e.target.value;
                      const end = start === '09:00' ? '10:00' : start === '10:00' ? '11:00' : '12:00';
                      setSlotForm({ ...slotForm, startTime: start, endTime: end });
                    }}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-mono"
                  >
                    <option value="09:00">09:00 - 10:00 AM</option>
                    <option value="10:00">10:00 - 11:00 AM</option>
                    <option value="11:00">11:00 - 12:00 PM</option>
                    <option value="12:00">12:00 - 13:00 PM</option>
                    <option value="14:00">14:00 - 15:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <select
                  value={slotForm.subjectId}
                  onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                >
                  {academics.departments?.flatMap((d: any) =>
                    d.courses?.flatMap((c: any) =>
                      c.semesters?.flatMap((s: any) =>
                        s.subjects?.map((sub: any) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.code} - {sub.name}
                          </option>
                        ))
                      )
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teacher</label>
                  <select
                    value={slotForm.teacherId}
                    onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    {academics.departments?.flatMap((d: any) =>
                      d.teachers?.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.user.name} ({t.employeeId})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Classroom / Lab</label>
                  <select
                    value={slotForm.classroomId}
                    onChange={(e) => setSlotForm({ ...slotForm, classroomId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    {academics.classrooms?.map((r: any) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} ({r.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow"
                >
                  Verify &amp; Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
