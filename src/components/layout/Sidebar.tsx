'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Clock,
  BookOpen,
  CalendarDays,
  Award,
  CreditCard,
  BellRing,
  FileCheck2,
  Library,
  Building2,
  Briefcase,
  Bus,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  School,
  Sparkles,
  Boxes,
  FileSpreadsheet,
  Globe,
  LogOut,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles?: UserRole[];
}

const NAVIGATION_ITEMS: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Student Management',
    href: '/students',
    icon: Users,
    badge: '1,842',
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER', 'ACCOUNTANT', 'WARDEN'],
  },
  {
    name: 'Faculty Management',
    href: '/faculty',
    icon: GraduationCap,
    badge: '126',
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD'],
  },
  {
    name: 'Homework & Tasks',
    href: '/homework',
    icon: BookOpen,
    badge: 'Daily',
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SUPER_ADMIN', 'ADMIN', 'HOD'],
  },
  {
    name: 'Student Attendance',
    href: '/attendance',
    icon: CalendarCheck,
    badge: '93.4%',
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER', 'STUDENT', 'PARENT'],
  },
  {
    name: 'Staff Attendance',
    href: '/attendance/faculty',
    icon: Clock,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER'],
  },
  {
    name: 'Academic Setup & Wings',
    href: '/academics',
    icon: BookOpen,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD'],
  },
  {
    name: 'Class Timetable',
    href: '/timetable',
    icon: CalendarDays,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER', 'STUDENT', 'PARENT'],
  },
  {
    name: 'Exams & Report Cards',
    href: '/examinations',
    icon: Award,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER', 'STUDENT', 'PARENT'],
  },
  {
    name: 'Fees & Stamped Receipts',
    href: '/fees',
    icon: CreditCard,
    badge: '87%',
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'ACCOUNTANT', 'SUPER_ADMIN', 'ADMIN', 'STUDENT', 'PARENT'],
  },
  {
    name: 'HR & Staff Payroll',
    href: '/payroll',
    icon: Users,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'ACCOUNTANT', 'SUPER_ADMIN', 'ADMIN'],
  },
  {
    name: 'Accounting & Daybook',
    href: '/accounts',
    icon: FileSpreadsheet,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'ACCOUNTANT', 'SUPER_ADMIN', 'ADMIN'],
  },
  {
    name: 'Institutional Reports',
    href: '/reports',
    icon: BarChart3,
    badge: 'Audited',
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'ACCOUNTANT', 'SUPER_ADMIN', 'ADMIN', 'HOD'],
  },
  {
    name: 'Inventory & Campus Assets',
    href: '/inventory',
    icon: Boxes,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'ACCOUNTANT', 'SUPER_ADMIN', 'ADMIN'],
  },
  {
    name: 'AI Insights & Early Warning',
    href: '/ai-insights',
    icon: Sparkles,
    badge: '31 Risk',
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER'],
  },
  {
    name: 'Circulars & Notices',
    href: '/notices',
    icon: BellRing,
    badge: 'Live',
  },
  {
    name: 'Leave Management',
    href: '/leaves',
    icon: FileCheck2,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER', 'STUDENT'],
  },
  {
    name: 'Library Portal',
    href: '/library',
    icon: Library,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'LIBRARIAN', 'TEACHER', 'STUDENT'],
  },
  {
    name: 'Hostel Management',
    href: '/hostel',
    icon: Building2,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'WARDEN', 'STUDENT'],
  },
  {
    name: 'Transport & Fleet GPS',
    href: '/transport',
    icon: Bus,
    allowedRoles: ['DIRECTOR', 'PRINCIPAL', 'SUPER_ADMIN', 'ADMIN', 'STUDENT', 'PARENT'],
  },
  {
    name: 'School Public Website',
    href: '/website',
    icon: Globe,
    badge: 'V1',
  },
  {
    name: 'Audit Logs & Settings',
    href: '/settings',
    icon: Settings,
    allowedRoles: ['DIRECTOR', 'SUPER_ADMIN', 'ADMIN'],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNav = NAVIGATION_ITEMS.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(activeRole)
  );

  return (
    <aside
      className={`bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-all duration-300 relative z-30 shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
            <School className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <span className="font-bold text-sm tracking-wide text-white block">DPIS EDUCORE</span>
              <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">School ERP v2.5</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator in Sidebar */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
              {activeRole.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Logged User'}</p>
              <p className="text-[10px] text-slate-400 font-mono capitalize">{activeRole.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          {!collapsed ? 'School Modules' : '���'}
        </div>
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wide ${
                        isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout Action */}
      <div className="p-2 border-t border-slate-800">
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Sign Out / Switch Account"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/20 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RBAC Matrix Active
          </span>
          <span className="text-[10px] text-slate-500">18 Modules</span>
        </div>
      )}
    </aside>
  );
}
