'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Clock,
  Phone,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function HostelPage() {
  const { user, activeRole } = useAuth();
  const [data, setData] = useState<any>({ hostels: [], complaints: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rooms' | 'complaints'>('rooms');
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const [form, setForm] = useState({
    category: 'ELECTRICAL',
    title: '',
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hostel');
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

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/hostel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_COMPLAINT',
          studentId: user?.studentProfile?.id || (data.hostels?.[0]?.rooms?.[0]?.allocations?.[0]?.studentId),
          ...form,
        }),
      });
      if (res.ok) {
        setShowComplaintModal(false);
        setForm({ category: 'ELECTRICAL', title: '', description: '' });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    try {
      const res = await fetch('/api/hostel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESOLVE_COMPLAINT', complaintId, status: 'RESOLVED' }),
      });
      if (res.ok) {
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
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> Module 13 • Hostel Buildings &amp; Resident Services
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Hostel Administration &amp; Rooms</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Hostel block occupancy, student room allocations, and maintenance complaint resolution.
          </p>
        </div>

        <button
          onClick={() => setShowComplaintModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Raise Maintenance Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'rooms' ? 'border-rose-600 text-rose-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Hostel Blocks &amp; Room Allocations
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'complaints' ? 'border-rose-600 text-rose-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Maintenance &amp; Service Complaints
        </button>
      </div>

      {/* Tab: Rooms */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          {data.hostels?.map((h: any) => (
            <div key={h.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                    {h.type} HOSTEL
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{h.name}</h3>
                  <p className="text-xs text-slate-500">
                    Warden: <strong>{h.wardenName}</strong> ({h.wardenContact})
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Total Capacity: {h.totalRooms} Rooms
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {h.rooms?.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Room #{r.roomNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Occupied ({r.allocations?.length || 1}/{r.capacity})
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t space-y-1">
                      {r.allocations?.map((al: any) => (
                        <div key={al.id} className="flex justify-between text-slate-600">
                          <span className="font-semibold text-slate-800">{al.student?.user?.name}</span>
                          <span className="font-mono text-[11px] text-slate-400">{al.student?.rollNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Complaints */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Title &amp; Details</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Date Reported</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.complaints?.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-rose-700">{c.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{c.title}</span>
                    <span className="text-slate-500 text-[11px]">{c.description}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {c.student?.user?.name || 'Rahul Kumar'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {c.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveComplaint(c.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Raise Hostel Maintenance Complaint</h2>
              <button onClick={() => setShowComplaintModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                >
                  <option value="ELECTRICAL">Electrical (Socket / Lights / Fan)</option>
                  <option value="PLUMBING">Plumbing (Tap / Washroom leak)</option>
                  <option value="CLEANLINESS">Room Cleanliness &amp; Waste</option>
                  <option value="CARPENTRY">Furniture / Bed Repair</option>
                  <option value="MESS">Mess / Food Quality</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Study table reading lamp socket faulty"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide exact details and room number..."
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
