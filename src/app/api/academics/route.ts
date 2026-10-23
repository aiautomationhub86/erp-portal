import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const departments = await prisma.department.findMany({
      include: {
        courses: {
          include: {
            semesters: {
              include: {
                sections: true,
                subjects: {
                  include: {
                    teacherAllocations: {
                      include: {
                        teacher: {
                          include: {
                            user: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        teachers: {
          include: {
            user: true,
          },
        },
      },
    });

    const classrooms = await prisma.classroom.findMany();

    return NextResponse.json({ departments, classrooms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'CREATE_DEPARTMENT') {
      const { code, name, hodName, hodEmail } = body;
      const dept = await prisma.department.create({
        data: { code, name, hodName, hodEmail },
      });
      return NextResponse.json(dept, { status: 201 });
    }

    if (action === 'CREATE_SUBJECT') {
      const { code, name, credits, type, departmentId, semesterId } = body;
      const sub = await prisma.subject.create({
        data: {
          code,
          name,
          credits: parseInt(credits) || 4,
          type: type || 'THEORY',
          departmentId,
          semesterId,
        },
      });
      return NextResponse.json(sub, { status: 201 });
    }

    if (action === 'ALLOCATE_TEACHER') {
      const { teacherId, subjectId } = body;
      const allocation = await prisma.teacherSubject.create({
        data: { teacherId, subjectId },
      });
      return NextResponse.json(allocation, { status: 201 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
