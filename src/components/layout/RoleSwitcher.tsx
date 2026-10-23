'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Shield, ChevronDown, Check, UserCheck, Sparkles } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function RoleSwitcher() {
  const { activeRole, switchRole, availableRoles, user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const activeRoleObj = availableRoles.find((r) => r.role === activeRole) || availableRoles[4];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'DIRECTOR':
        return 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white border-blue-600 shadow-sm';
      case 'PRINCIPAL':
        return 'bg-slate-900 text-white border-slate-700 shadow-sm';
      case 'SUPER_ADMIN':
        return 'bg-red-500 text-white border-red-600';
      case 'ADMIN':
        return 'bg-purple-600 text-white border-purple-700';
      case 'HOD':
        return 'bg-indigo-600 text-white border-indigo-700';
      case 'TEACHER':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'STUDENT':
        return 'bg-blue-600 text-white border-blue-700';
      case 'PARENT':
        return 'bg-amber-600 text-white border-amber-700';
      case 'ACCOUNTANT':
        return 'bg-teal-600 text-white border-teal-700';
      case 'LIBRARIAN':
        return 'bg-cyan-600 text-white border-cyan-700';
      case 'PLACEMENT_OFFICER':
        return 'bg-violet-600 text-white border-violet-700';
      case 'WARDEN':
        return 'bg-rose-600 text-white border-rose-700';
      default:
        return 'bg-slate-700 text-white border-slate-800';
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <span className="hidden xl:inline-flex text-xs font-semibold uppercase tracking-wider text-slate-500 items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Active View:
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-all ${getRoleBadgeColor(
            activeRole
          )} hover:opacity-95 active:scale-95`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{activeRoleObj.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 py-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-2.5 bg-slate-50">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Select Role to Test Dashboard
              </p>
              <p className="text-[11px] text-slate-500">
                Instantly transforms the dashboard & permissions across all 10 roles.
              </p>
            </div>

            <div className="py-1.5 max-h-96 overflow-y-auto">
              {availableRoles.map((item) => {
                const isSelected = item.role === activeRole;
                return (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-start justify-between transition-colors ${
                      isSelected ? 'bg-blue-50/70 text-blue-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
