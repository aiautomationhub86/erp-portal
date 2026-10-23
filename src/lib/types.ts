export type UserRole =
  | 'DIRECTOR'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'PARENT'
  | 'STUDENT'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'HOD'
  | 'LIBRARIAN'
  | 'PLACEMENT_OFFICER'
  | 'WARDEN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  branchCode?: string;
  departmentCode?: string;
  studentProfile?: {
    id: string;
    rollNumber: string;
    admissionNo: string;
    departmentName: string;
    departmentCode?: string;
    courseName: string;
    semesterNum: number;
    sectionName: string;
    attendancePercent: number;
    cgpa: number;
    pendingFee: number;
    isAtRisk?: boolean;
    riskReason?: string;
  };
  teacherProfile?: {
    id: string;
    employeeId: string;
    designation: string;
    departmentName: string;
  };
}

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
  roles?: UserRole[];
}
