import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const dept = searchParams.get('department') || '';
    const sem = searchParams.get('semester');
    const branchCode = searchParams.get('branchCode') || searchParams.get('branch');

    const students = await prisma.studentProfile.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { rollNumber: { contains: search } },
                  { admissionNo: { contains: search } },
                  { user: { name: { contains: search } } },
                  { user: { email: { contains: search } } },
                ],
              }
            : {},
          dept ? { department: { code: dept } } : {},
          sem ? { semester: { semesterNum: parseInt(sem) } } : {},
          branchCode && branchCode !== 'ALL' ? { branchCode: branchCode } : {},
        ],
      },
      include: {
        user: true,
        department: true,
        course: true,
        semester: true,
        section: true,
        parent: {
          include: {
            user: true,
          },
        },
        fees: true,
        attendance: true,
        results: true,
        marks: {
          include: {
            subject: true,
            exam: true,
          },
        },
        hostelAllocation: {
          include: {
            room: {
              include: {
                hostel: true,
              },
            },
          },
        },
      },
      orderBy: { rollNumber: 'asc' },
    });

    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      gender,
      rollNumber,
      admissionNo,
      departmentCode,
      courseCode,
      semesterNum,
      bloodGroup,
      branchCode,
    } = body;

    const assignedBranch = branchCode || 'DPS-CENTRAL';

    // Resolve relations
    let department = await prisma.department.findUnique({
      where: { code: departmentCode || 'SECONDARY' },
    });

    if (!department) {
      department = await prisma.department.findFirst() || await prisma.department.create({
        data: { code: 'SECONDARY', name: 'Secondary Wing (Classes 9-10)' },
      });
    }

    let course = await prisma.course.findFirst({
      where: { departmentId: department?.id },
    });

    if (!course) {
      course = await prisma.course.findFirst();
    }

    let semester = await prisma.semester.findFirst({
      where: { courseId: course?.id },
    });

    if (!semester) {
      semester = await prisma.semester.findFirst();
    }

    const section = await prisma.section.findFirst({
      where: { semesterId: semester?.id },
    });

    const studentRoll = rollNumber || `${Date.now().toString().slice(-5)}`;
    const studentEmail = email || `student.${studentRoll.toLowerCase()}@school.edu`;

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name || 'New Student',
        email: studentEmail,
        phone: phone || '+91 98765 43210',
        gender: gender || 'Male',
        role: 'STUDENT',
        branchCode: assignedBranch,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    });

    // Create profile
    const student = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: studentRoll,
        admissionNo: admissionNo || `ADM-2026-${studentRoll}`,
        bloodGroup: bloodGroup || 'O+',
        branchCode: assignedBranch,
        departmentId: department!.id,
        courseId: course!.id,
        semesterId: semester!.id,
        sectionId: section?.id,
      },
      include: {
        user: true,
        department: true,
        course: true,
        semester: true,
        section: true,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_STUDENT',
        module: 'STUDENTS',
        details: `Registered student ${name} (${studentRoll}) at Campus ${assignedBranch}`,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
