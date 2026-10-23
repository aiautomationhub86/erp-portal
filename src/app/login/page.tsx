'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  School,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  KeyRound,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { label: '👑 Super Admin', id: 'superadmin@school.edu', role: 'SUPER_ADMIN', pass: 'password123', color: 'from-red-600 to-rose-700' },
    { label: '🏛️ Director / Owner', id: 'director@school.edu', role: 'DIRECTOR', pass: 'password123', color: 'from-blue-700 to-indigo-800' },
    { label: '🎓 Principal', id: 'principal@school.edu', role: 'PRINCIPAL', pass: 'password123', color: 'from-purple-600 to-indigo-700' },
    { label: '👨‍🏫 Teacher (Mr. Rajesh)', id: 'teacher.rajesh@school.edu', role: 'TEACHER', pass: 'password123', color: 'from-emerald-600 to-teal-700' },
    { label: '🎒 Student (Roll: 10024)', id: '10024', role: 'STUDENT', pass: 'password123', color: 'from-blue-600 to-cyan-600' },
    { label: '💼 Accountant', id: 'accountant@school.edu', role: 'ACCOUNTANT', pass: 'password123', color: 'from-amber-600 to-orange-700' },
    { label: '👨‍👧 Parent (Ward: Aarav)', id: 'parent.sharma@school.edu', role: 'PARENT', pass: 'password123', color: 'from-teal-600 to-emerald-700' },
    { label: '📚 Librarian', id: 'librarian@school.edu', role: 'LIBRARIAN', pass: 'password123', color: 'from-violet-600 to-purple-700' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please provide both your Username/Email/Roll No and Password.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(identifier, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Invalid credentials. Please verify your details.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setLoading(true);
    setError(null);

    const result = await login(id, pass);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Authentication error.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 border border-white/20">
            <School className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          DPIS EDUCORE
        </h2>
        <p className="mt-1 text-center text-xs text-blue-200/80 font-medium">
          Unified School &amp; College ERP Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/40">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Sign in to your Portal</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your registered Email, Student Roll No, or Employee ID.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email, Roll Number or Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10024 or director@school.edu"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-blue-600 font-medium">Default: password123</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo 1-Click Role Login Selector */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Quick Demo Login
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Password: password123</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickLogin(acc.id, acc.pass)}
                  className="text-left p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/70 hover:border-blue-300 transition-all group"
                >
                  <span className="block text-[11px] font-bold text-slate-800 group-hover:text-blue-900 truncate">
                    {acc.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono truncate">
                    {acc.id}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-blue-200/70 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Tier Role-Based Security &amp; Audit Telemetry Protected</span>
          </p>
        </div>
      </div>
    </div>
  );
}
