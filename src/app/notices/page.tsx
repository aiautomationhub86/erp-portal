'use client';

import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Pin,
  Calendar,
  Search,
  Plus,
  X,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function NoticesPage() {
  const { user, activeRole } = useAuth();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    targetRole: 'ALL',
    isPinned: false,
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);

      const res = await fetch(`/api/notices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [selectedCategory]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, authorEmail: user?.email }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setForm({
          title: '',
          content: '',
          category: 'GENERAL',
          targetRole: 'ALL',
          isPinned: false,
        });
        fetchNotices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'EXAM':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HOLIDAY':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PLACEMENT':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ACADEMIC':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4" /> Module 10 • Notices, Circulars &amp; Announcements
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Campus Notice Board</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Official announcements, examination date-sheets, event circulars, and departmental updates.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Broadcast Notice
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            selectedCategory === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Categories
        </button>
        <button
          onClick={() => setSelectedCategory('EXAM')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            selectedCategory === 'EXAM' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          }`}
        >
          Examinations
        </button>
        <button
          onClick={() => setSelectedCategory('PLACEMENT')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            selectedCategory === 'PLACEMENT' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Placements
        </button>
        <button
          onClick={() => setSelectedCategory('HOLIDAY')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            selectedCategory === 'HOLIDAY' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Holidays
        </button>
        <button
          onClick={() => setSelectedCategory('ACADEMIC')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            selectedCategory === 'ACADEMIC' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          Academic
        </button>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border">No notices found.</div>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all hover:border-slate-300 ${
                n.isPinned ? 'border-purple-300 bg-purple-50/10 ring-1 ring-purple-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryColor(n.category)}`}>
                    {n.category}
                  </span>
                  {n.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">Audience: {n.targetRole}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(n.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-2">{n.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{n.content}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Issued by: <strong className="text-slate-700">{n.author?.name || 'Administration'}</strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Broadcast Campus Circular</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Annual Sports Meet & Registration Guidelines"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    <option value="GENERAL">General</option>
                    <option value="EXAM">Examination</option>
                    <option value="PLACEMENT">Placement</option>
                    <option value="HOLIDAY">Holiday</option>
                    <option value="ACADEMIC">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <select
                    value={form.targetRole}
                    onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  >
                    <option value="ALL">All (Students, Faculty, Parents)</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="TEACHER">Faculty Only</option>
                    <option value="PARENT">Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write detailed circular description here..."
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={form.isPinned}
                  onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                  className="rounded text-purple-600"
                />
                <label htmlFor="isPinned" className="text-slate-700 font-semibold cursor-pointer">
                  Pin to top of notice board
                </label>
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow"
                >
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
