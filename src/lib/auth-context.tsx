'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession } from './types';

export interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  activeRole: UserRole;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  switchRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  availableRoles: { role: UserRole; label: string; email: string; desc: string }[];
}

export const DEMO_ROLES: { role: UserRole; label: string; email: string; desc: string }[] = [
  { role: 'SUPER_ADMIN', label: '👑 Super Admin (Master Network)', email: 'superadmin@school.edu', desc: 'Global Authority: All Colleges, Add Schools, Core Module Licensing & User ID/Pass' },
  { role: 'DIRECTOR', label: '1. School Owner / Director', email: 'director@school.edu', desc: 'Level 1: School Health, Finance, P&L & Assigned Campus (DPS-CENTRAL)' },
  { role: 'PRINCIPAL', label: '2. Principal', email: 'principal@school.edu', desc: 'Level 2: Staff/Student Attendance, Exams, Approvals & Alerts' },
  { role: 'ADMIN', label: '3. School Administrator', email: 'admin@school.edu', desc: 'Level 3: Students, Classes, Teachers, Calendar, TC & Settings' },
  { role: 'TEACHER', label: 'Teacher (Rajesh Sharma)', email: 'teacher.rajesh@school.edu', desc: 'Classes, 1-Click Attendance, Homework, Marks & Parent Broadcast' },
  { role: 'ACCOUNTANT', label: 'Accountant (Rakesh Gupta)', email: 'accountant@school.edu', desc: 'Fee Billing, Defaulters, Stamped Receipts & Daybook' },
  { role: 'PARENT', label: 'Parent (Sanjay Sharma)', email: 'parent.sharma@school.edu', desc: 'Ward: Aarav (10-A), Fees (₹8,500 due) & Homework Tracker' },
  { role: 'STUDENT', label: 'Student (Aarav Sharma)', email: 'aarav.sharma@school.edu', desc: 'Class 10-A, Homework Submissions, Timetable & Report Card' },
  { role: 'HOD', label: 'Head of Dept', email: 'hod.science@school.edu', desc: 'Curriculum & Faculty Oversight' },
  { role: 'LIBRARIAN', label: 'Librarian', email: 'librarian@school.edu', desc: 'Library Catalog & Issued Books' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('DIRECTOR');
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchSession = async (roleOrEmail?: string, userId?: string) => {
    setLoading(true);
    try {
      let url = '/api/auth/session';
      if (userId) {
        url += `?userId=${encodeURIComponent(userId)}`;
      } else if (roleOrEmail && roleOrEmail.includes('@')) {
        url += `?email=${encodeURIComponent(roleOrEmail)}`;
      } else if (roleOrEmail) {
        url += `?role=${encodeURIComponent(roleOrEmail)}`;
      } else {
        url += '?role=DIRECTOR';
      }

      const res = await fetch(url);
      if (res.ok) {
        const data: UserSession = await res.json();
        setUser(data);
        setActiveRole(data.role);
        setIsAuthenticated(true);
        localStorage.setItem('erp_active_role', data.role);
        localStorage.setItem('erp_auth_user_id', data.id);
        localStorage.setItem('erp_auth_logged_in', 'true');
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Failed to fetch session', e);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLogged = localStorage.getItem('erp_auth_logged_in');
    const savedUserId = localStorage.getItem('erp_auth_user_id');
    const savedRole = localStorage.getItem('erp_active_role') as UserRole | null;

    if (isLogged === 'false') {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    if (savedUserId) {
      fetchSession(undefined, savedUserId);
    } else if (savedRole) {
      fetchSession(savedRole);
    } else {
      // Default to DIRECTOR session for immediate rich preview
      fetchSession('DIRECTOR');
    }
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return { success: false, error: data.error || 'Authentication failed' };
      }

      if (data.user) {
        setUser(data.user);
        setActiveRole(data.user.role);
        setIsAuthenticated(true);
        localStorage.setItem('erp_active_role', data.user.role);
        localStorage.setItem('erp_auth_user_id', data.user.id);
        localStorage.setItem('erp_auth_logged_in', 'true');
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Unexpected response from server' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  const switchRole = async (newRole: UserRole) => {
    await fetchSession(newRole);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem('erp_auth_logged_in', 'false');
    localStorage.removeItem('erp_auth_user_id');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        activeRole,
        isAuthenticated,
        login,
        switchRole,
        logout,
        availableRoles: DEMO_ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
