'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import RoleSwitcher from './RoleSwitcher';
import {
  Bell,
  Search,
  Calendar,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopNav() {
  const router = useRouter();
  const { user, activeRole, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'MST Exam Date-sheet Released',
      desc: 'Semester 5 MST examination schedule is published.',
      time: '10 mins ago',
      type: 'INFO',
      read: false,
    },
    {
      id: '2',
      title: 'Pending Fee Reminder',
      desc: 'Examination fee due date is nearing in 14 days.',
      time: '2 hours ago',
      type: 'WARNING',
      read: false,
    },
    {
      id: '3',
      title: 'XYZ Ltd Placement Drive',
      desc: 'Applications open for 2027 batch B.Tech students.',
      time: '1 day ago',
      type: 'SUCCESS',
      read: true,
    },
  ]);

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left Search / Breadcrumb */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students, faculty, roll numbers, subjects..."
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls: Role Switcher, Date, Notifications, Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate || 'Today'}</span>
        </div>

        {/* Instant Role Switcher (Key for 10-Role Demo) */}
        <RoleSwitcher />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-40 py-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 text-xs flex gap-3 transition-colors ${
                        item.read ? 'bg-white opacity-75' : 'bg-blue-50/40'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {item.type === 'INFO' && <Info className="w-4 h-4 text-blue-500" />}
                        {item.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {item.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 leading-snug">{item.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 text-center bg-slate-50">
                  <Link
                    href="/notices"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View Notice Board →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Area & Sign Out */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <Link href="/login" className="flex items-center gap-2 group">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all"
            />
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-tight group-hover:text-blue-600 transition-colors">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                {user?.email || 'user@college.edu'}
              </span>
            </div>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Log Out & Switch Account"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
