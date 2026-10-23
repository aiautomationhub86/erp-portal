'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  IndianRupee,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Plus,
  MapPin,
  Award,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function PlacementsPage() {
  const { user, activeRole } = useAuth();
  const [data, setData] = useState<any>({ drives: [], companies: [] });
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [appliedDrives, setAppliedDrives] = useState<string[]>([]);

  const [form, setForm] = useState({
    companyName: 'Amazon Web Services',
    jobRole: 'Cloud Support Associate',
    packageLPA: '18.5',
    minCgpa: '7.5',
    location: 'Hyderabad / Bangalore',
    driveDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
    deadlineDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/placements');
      if (res.ok) {
        const json = await res.json();
        setData(json);
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

  const handleApply = async (driveId: string) => {
    try {
      const studentId = user?.studentProfile?.id || (await fetch('/api/students').then(r => r.json()))[0]?.id;
      const res = await fetch('/api/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPLY_DRIVE', driveId, studentId }),
      });
      if (res.ok) {
        setAppliedDrives((prev) => [...prev, driveId]);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'POST_DRIVE', ...form }),
      });
      if (res.ok) {
        setShowPostModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isPlacementOfficer =
    activeRole === 'PLACEMENT_OFFICER' || activeRole === 'ADMIN' || activeRole === 'SUPER_ADMIN';

  const userCgpa = user?.studentProfile?.cgpa || 8.42;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-violet-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" /> Module 14 • Corporate Relations &amp; Placements
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Campus Placements &amp; Job Drives</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Recruitment drives, eligibility criterion checks (min CGPA), and student application lifecycle.
          </p>
        </div>

        {isPlacementOfficer && (
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Post New Recruitment Drive
          </button>
        )}
      </div>

      {/* Placement Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Highest CTC Offered</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">₹28.5 LPA</div>
          <p className="text-xs text-slate-500 mt-1">Google India • Software Engineer</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Average Package (2026-27)</span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">₹9.2 LPA</div>
          <p className="text-xs text-slate-500 mt-1">CSE &amp; ECE Batches</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Offers Extended</span>
          <div className="text-3xl font-extrabold text-violet-600 mt-2">342 Offers</div>
          <p className="text-xs text-emerald-600 mt-1">84% Placement Conversion</p>
        </div>
      </div>

      {/* Active Drives Feed */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Active Recruitment Drives
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.drives?.map((drive: any) => {
            const isEligible = userCgpa >= drive.minCgpa;
            const hasApplied =
              appliedDrives.includes(drive.id) ||
              drive.applications?.some(
                (a: any) => a.student?.user?.email === user?.email || a.student?.rollNumber === '23CSE1023'
              );

            return (
              <div
                key={drive.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-violet-300 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-violet-600 uppercase tracking-wide block">
                        {drive.company?.name}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{drive.jobRole}</h3>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      ₹{drive.packageLPA} LPA
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {drive.location}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Min. CGPA Criteria</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Award className="w-3 h-3 text-violet-600" /> {drive.minCgpa} CGPA
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Drive Date</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(drive.driveDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Apply Deadline</span>
                      <span className="font-semibold text-rose-600">
                        {new Date(drive.deadlineDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <div className="text-xs">
                    {isEligible ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> You are eligible (CGPA {userCgpa})
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Ineligible (Requires &gt;= {drive.minCgpa})
                      </span>
                    )}
                  </div>

                  {hasApplied ? (
                    <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Application Submitted
                    </span>
                  ) : (
                    <button
                      disabled={!isEligible}
                      onClick={() => handleApply(drive.id)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition-all"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Drive Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Post Recruitment Drive</h2>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePostDrive} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g. Microsoft"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Job Designation</label>
                <input
                  type="text"
                  required
                  value={form.jobRole}
                  onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
                  placeholder="Software Engineer"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CTC Package (LPA ₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={form.packageLPA}
                    onChange={(e) => setForm({ ...form, packageLPA: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min CGPA Required</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.minCgpa}
                    onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
