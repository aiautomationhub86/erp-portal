import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const dept = searchParams.get('department') || '';

    const faculty = await prisma.teacherProfile.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { employeeId: { contains: search } },
                  { designation: { contains: search } },
                  { user: { name: { contains: search } } },
                  { user: { email: { contains: search } } },
                ],
              }
            : {},
          dept ? { department: { code: dept } } : {},
        ],
      },
      include: {
        user: true,
        department: true,
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
        timetableSlots: {
          include: {
            subject: true,
            classroom: true,
            section: true,
          },
        },
        attendance: true,
      },
      orderBy: { employeeId: 'asc' },
    });

    return NextResponse.json(faculty);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, employeeId, designation, qualification, departmentCode, salary } = body;

    const department = await prisma.department.findUnique({
      where: { code: departmentCode || 'CSE' },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: designation.includes('HOD') ? 'HOD' : 'TEACHER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
    });

    const teacher = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        employeeId: employeeId || `FAC-${Date.now().toString().slice(-4)}`,
        designation: designation || 'Assistant Professor',
        qualification: qualification || 'M.Tech, Ph.D.',
        departmentId: department!.id,
        salary: salary ? parseFloat(salary) : 85000,
      },
      include: {
        user: true,
        department: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'ADD_FACULTY',
        module: 'FACULTY',
        details: `Onboarded faculty ${name} (${teacher.employeeId})`,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
