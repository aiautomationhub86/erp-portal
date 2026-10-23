'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Boxes,
  PlusCircle,
  CheckCircle2,
  Search,
  Filter,
  Package,
  Layers,
  MapPin,
  Truck,
  IndianRupee,
  AlertTriangle
} from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('LAB_EQUIPMENT');
  const [quantity, setQuantity] = useState('15');
  const [unitPrice, setUnitPrice] = useState('4500');
  const [location, setLocation] = useState('Physics Lab Cabinet B');
  const [vendorId, setVendorId] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setVendors(data.vendors || []);
        if (data.vendors?.length > 0) {
          setVendorId(data.vendors[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          quantity,
          unitPrice,
          location,
          vendorId,
        })
      });

      if (res.ok) {
        setStatusMsg('New inventory item added to school asset registry!');
        setIsAddModalOpen(false);
        setName('');
        fetchInventory();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalAssetValue = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5" /> Campus Asset Management
              </span>
              <span className="text-xs text-slate-300">Laboratories, Sports &amp; Smart IT Hardware</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              School Inventory &amp; Stock Registry
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Track scientific laboratory kits, sports equipment, interactive projectors, and vendor procurement lifecycle.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Asset Item
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Asset Items</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{items.length} SKUs</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">Science, Sports, IT</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Valuation</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            ?{(totalAssetValue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-slate-500 mt-1">Capital Assets Under Registry</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Approved Vendors</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{vendors.length} Vendors</div>
          <div className="text-xs text-slate-500 mt-1">Contracted Suppliers</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Low Stock Alerts</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">0 Low</div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">All Stocks Adequate</div>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> Active Campus Asset Stock
          </h2>
          <span className="text-xs text-slate-500">{items.length} Registered Items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Asset Code</th>
                <th className="py-2.5 px-3">Item Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Unit Price</th>
                <th className="py-2.5 px-3">Total Value</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Vendor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {it.itemCode}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {it.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {it.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {it.quantity} Units
                  </td>
                  <td className="py-3 px-3">?{it.unitPrice?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    ?{(it.quantity * it.unitPrice)?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {it.location}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {it.vendor?.name || 'Apex Scientific'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" /> Register New Asset
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Add campus equipment, classroom tech, or sports inventory.
            </p>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Digital Vernier Caliper Set"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                >
                  <option value="LAB_EQUIPMENT">Science Lab Equipment</option>
                  <option value="SPORTS">Sports &amp; Fitness Gear</option>
                  <option value="IT_ASSETS">IT &amp; Smart Classrooms</option>
                  <option value="STATIONERY">Stationery &amp; Books</option>
                  <option value="FURNITURE">Campus Furniture</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Price (?)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campus Storage Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Physics Lab - Cupboard 4"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-sm"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
