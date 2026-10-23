import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = (searchParams.get('role') as UserRole) || undefined;
    const userId = searchParams.get('userId') || undefined;
    const emailParam = searchParams.get('email') || undefined;

    const fullInclude = {
      studentProfile: {
        include: {
          department: true,
          course: true,
          semester: true,
          section: true,
          attendance: true,
          marks: true,
          results: true,
          fees: true,
        },
      },
      teacherProfile: {
        include: {
          department: true,
          teacherSubjects: {
            include: {
              subject: true,
            },
          },
        },
      },
    };

    const emailByRole: Record<string, string> = {
      DIRECTOR: 'director@school.edu',
      PRINCIPAL: 'principal@school.edu',
      TEACHER: 'teacher.rajesh@school.edu',
      PARENT: 'parent.sharma@school.edu',
      STUDENT: 'aarav.sharma@school.edu',
      ACCOUNTANT: 'accountant@school.edu',
      SUPER_ADMIN: 'superadmin@school.edu',
      ADMIN: 'admin@school.edu',
      HOD: 'hod.science@school.edu',
      LIBRARIAN: 'librarian@school.edu',
    };

    let user = null;

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: fullInclude,
      });
    }

    if (!user && emailParam) {
      user = await prisma.user.findUnique({
        where: { email: emailParam },
        include: fullInclude,
      });
    }

    if (!user && role) {
      const targetEmail = emailByRole[role];
      user = targetEmail
        ? await prisma.user.findUnique({
            where: { email: targetEmail },
            include: fullInclude,
          })
        : null;

      if (!user) {
        user = await prisma.user.findFirst({
          where: { role },
          include: fullInclude,
        });
      }
    }

    if (!user) {
      // Fallback if no user exists for that role
      user = await prisma.user.findFirst({
        include: fullInclude,
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    let studentProfileSummary = undefined;
    if (user.studentProfile) {
      const sp = user.studentProfile;
      const totalAtt = sp.attendance?.length || 0;
      const presentAtt = sp.attendance?.filter((a) => a.status === 'PRESENT').length || 0;
      const attendancePercent = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 1000) / 10 : 94.2;

      const latestResult = sp.results?.[sp.results.length - 1];
      const cgpa = latestResult ? latestResult.cgpa : 9.4;

      const pendingFee = sp.fees?.reduce((acc, f) => acc + f.dueAmount, 0) || 8500;

      studentProfileSummary = {
        id: sp.id,
        rollNumber: sp.rollNumber,
        admissionNo: sp.admissionNo,
        departmentName: sp.department?.name || 'Secondary Wing (Class 10 CBSE)',
        departmentCode: sp.department?.code || 'SECONDARY',
        courseName: sp.course?.name || 'Class 10 (CBSE)',
        semesterNum: sp.semester?.semesterNum || 1,
        sectionName: sp.section?.name || 'A',
        attendancePercent,
        cgpa,
        pendingFee,
        isAtRisk: sp.isAtRisk,
        riskReason: sp.riskReason || undefined,
      };
    } else if (role === 'PARENT') {
      // Find ward (Aarav Sharma)
      const ward = await prisma.studentProfile.findFirst({
        where: { rollNumber: '10024' },
        include: {
          department: true,
          course: true,
          semester: true,
          section: true,
          attendance: true,
          results: true,
          fees: true,
        },
      });
      if (ward) {
        const totalAtt = ward.attendance?.length || 0;
        const presentAtt = ward.attendance?.filter((a) => a.status === 'PRESENT').length || 0;
        const attendancePercent = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 1000) / 10 : 94.2;
        const latestResult = ward.results?.[ward.results.length - 1];
        const cgpa = latestResult ? latestResult.cgpa : 9.4;
        const pendingFee = ward.fees?.reduce((acc, f) => acc + f.dueAmount, 0) || 8500;

        studentProfileSummary = {
          id: ward.id,
          rollNumber: ward.rollNumber,
          admissionNo: ward.admissionNo,
          departmentName: ward.department?.name || 'Secondary Wing (Class 10 CBSE)',
          departmentCode: ward.department?.code || 'SECONDARY',
          courseName: ward.course?.name || 'Class 10 (CBSE)',
          semesterNum: ward.semester?.semesterNum || 1,
          sectionName: ward.section?.name || 'A',
          attendancePercent,
          cgpa,
          pendingFee,
          isAtRisk: ward.isAtRisk,
          riskReason: ward.riskReason || undefined,
        };
      }
    }

    let teacherProfileSummary = undefined;
    if (user.teacherProfile) {
      const tp = user.teacherProfile;
      teacherProfileSummary = {
        id: tp.id,
        employeeId: tp.employeeId,
        designation: tp.designation,
        departmentName: tp.department?.name || 'Secondary Wing',
      };
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
      branchCode: user.branchCode || 'DPS-CENTRAL',
      studentProfile: studentProfileSummary,
      teacherProfile: teacherProfileSummary,
    };

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
