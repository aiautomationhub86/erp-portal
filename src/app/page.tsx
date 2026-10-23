'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import StudentDashboardView from '@/components/dashboard/StudentDashboardView';
import { SuperAdminDashboardView } from '@/components/dashboard/SuperAdminDashboardView';
import { DirectorDashboardView } from '@/components/dashboard/DirectorDashboardView';
import { PrincipalDashboardView } from '@/components/dashboard/PrincipalDashboardView';
import { SchoolAdminDashboardView } from '@/components/dashboard/SchoolAdminDashboardView';
import { TeacherDashboardView } from '@/components/dashboard/TeacherDashboardView';
import { AccountantDashboardView } from '@/components/dashboard/AccountantDashboardView';
import { ParentDashboardView } from '@/components/dashboard/ParentDashboardView';
import AdminDashboardView from '@/components/dashboard/AdminDashboardView';
import FacultyDashboardView from '@/components/dashboard/FacultyDashboardView';

export default function DashboardPage() {
  const { activeRole, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading School ERP Workspace...</p>
        </div>
      </div>
    );
  }

  // Super Admin: Global Institution Governance, Add Colleges, Core Module Licensing & User ID/Pass
  if (activeRole === 'SUPER_ADMIN') {
    return <SuperAdminDashboardView />;
  }

  // Level 1: School Owner / Director
  if (activeRole === 'DIRECTOR') {
    return <DirectorDashboardView />;
  }

  // Level 2: Principal
  if (activeRole === 'PRINCIPAL') {
    return <PrincipalDashboardView />;
  }

  // Level 3: School Administrator
  if (activeRole === 'ADMIN') {
    return <SchoolAdminDashboardView />;
  }

  // Teacher / Faculty
  if (activeRole === 'TEACHER') {
    return <TeacherDashboardView />;
  }

  // Accountant
  if (activeRole === 'ACCOUNTANT') {
    return <AccountantDashboardView />;
  }

  // Parent
  if (activeRole === 'PARENT') {
    return <ParentDashboardView />;
  }

  // Student
  if (activeRole === 'STUDENT') {
    return <StudentDashboardView />;
  }

  // HOD
  if (activeRole === 'HOD') {
    return <TeacherDashboardView />;
  }

  // Fallback
  return <SchoolAdminDashboardView />;
}
