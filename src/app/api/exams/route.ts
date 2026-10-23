import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        semester: {
          include: {
            course: true,
            subjects: true,
          },
        },
        marks: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
            subject: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    const results = await prisma.result.findMany({
      include: {
        student: {
          include: {
            user: true,
            department: true,
            course: true,
          },
        },
      },
      orderBy: { semesterNumber: 'desc' },
    });

    return NextResponse.json({ exams, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'SUBMIT_MARKS') {
      const { examId, subjectId, studentId, marksObtained, maxMarks } = body;
      const pct = (parseFloat(marksObtained) / (parseFloat(maxMarks) || 100)) * 100;
      let grade = 'F';
      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B+';
      else if (pct >= 60) grade = 'B';
      else if (pct >= 50) grade = 'C';

      const mark = await prisma.mark.upsert({
        where: {
          examId_subjectId_studentId: {
            examId,
            subjectId,
            studentId,
          },
        },
        update: {
          marksObtained: parseFloat(marksObtained),
          maxMarks: parseFloat(maxMarks) || 100,
          grade,
        },
        create: {
          examId,
          subjectId,
          studentId,
          marksObtained: parseFloat(marksObtained),
          maxMarks: parseFloat(maxMarks) || 100,
          grade,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: 'SUBMIT_MARKS',
          module: 'EXAMS',
          details: `Recorded marks ${marksObtained}/${maxMarks} (${grade}) for student ${studentId}`,
        },
      });

      return NextResponse.json(mark, { status: 201 });
    }

    if (action === 'CREATE_EXAM') {
      const { name, type, startDate, endDate, semesterId } = body;
      const exam = await prisma.exam.create({
        data: {
          name,
          type: type || 'INTERNAL',
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          semesterId,
        },
      });
      return NextResponse.json(exam, { status: 201 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
