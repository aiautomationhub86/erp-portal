'use client';

import React, { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Users,
  Phone,
  Plus,
  CheckCircle2,
  Navigation,
  X,
} from 'lucide-react';

export default function TransportPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    routeNumber: 'Route #14',
    routeName: 'South Campus – Ring Road Corridor',
    stops: 'Metro Pillar 12 -> City Center -> South Extension -> College Gate 1',
  });

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transport');
      if (res.ok) {
        const data = await res.json();
        setRoutes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_ROUTE', ...form }),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchRoutes();
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
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4" /> Module 15 • College Bus Fleet &amp; Transport
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Transport &amp; Bus Routes</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Bus route tracking, pickup stops, assigned drivers, and student bus pass verification.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Bus Route
        </button>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {routes.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 px-2 py-0.5 rounded bg-amber-50 uppercase">
                  {r.routeNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{r.routeName}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bus className="w-5 h-5" />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-200">
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{r.stops}</span>
              </div>
              {r.vehicles?.[0] && (
                <div className="pt-2 border-t flex items-center justify-between text-slate-700">
                  <span>Bus: <strong>{r.vehicles[0].vehicleNumber}</strong></span>
                  <span>Driver: <strong>{r.vehicles[0].driverName}</strong> ({r.vehicles[0].driverPhone})</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Add Transport Route</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoute} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Route Identifier</label>
                <input
                  type="text"
                  required
                  value={form.routeNumber}
                  onChange={(e) => setForm({ ...form, routeNumber: e.target.value })}
                  placeholder="Route #14"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Route Corridor Title</label>
                <input
                  type="text"
                  required
                  value={form.routeName}
                  onChange={(e) => setForm({ ...form, routeName: e.target.value })}
                  placeholder="City Central -> University Ring"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ordered Stops</label>
                <textarea
                  rows={3}
                  required
                  value={form.stops}
                  onChange={(e) => setForm({ ...form, stops: e.target.value })}
                  placeholder="Stop 1 -> Stop 2 -> Stop 3 -> College"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
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
                  className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-xl shadow"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
