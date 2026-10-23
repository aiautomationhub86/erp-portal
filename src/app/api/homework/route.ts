import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const homeworks = await prisma.homework.findMany({
      include: {
        subject: true,
        section: true,
        teacher: true,
        submissions: {
          include: {
            student: {
              include: {
                user: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(homeworks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, homeworkId, studentId, submissionText, fileUrl, title, description, dueDate, subjectId, sectionId, teacherId, attachments } = body;

    // 1. Student Submission Endpoint
    if (type === 'STUDENT_SUBMIT' || (homeworkId && (submissionText || fileUrl))) {
      let finalStudentId = studentId;
      if (!finalStudentId) {
        const defaultStudent = await prisma.studentProfile.findFirst({
          where: { rollNumber: '10024' },
        });
        finalStudentId = defaultStudent?.id;
      }
      if (!finalStudentId) {
        const anyStudent = await prisma.studentProfile.findFirst();
        finalStudentId = anyStudent?.id;
      }

      if (!finalStudentId) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const existingSubmission = await prisma.homeworkSubmission.findUnique({
        where: {
          homeworkId_studentId: {
            homeworkId,
            studentId: finalStudentId,
          },
        },
      });

      let submission;
      if (existingSubmission) {
        submission = await prisma.homeworkSubmission.update({
          where: { id: existingSubmission.id },
          data: {
            submissionText: submissionText || existingSubmission.submissionText,
            fileUrl: fileUrl || existingSubmission.fileUrl,
            status: 'SUBMITTED',
            submittedAt: new Date(),
          },
          include: {
            student: { include: { user: true } },
            homework: true,
          },
        });
      } else {
        submission = await prisma.homeworkSubmission.create({
          data: {
            homeworkId,
            studentId: finalStudentId,
            submissionText: submissionText || 'Attached solution file.',
            fileUrl: fileUrl || 'assignment_submission.pdf',
            status: 'SUBMITTED',
            submittedAt: new Date(),
          },
          include: {
            student: { include: { user: true } },
            homework: true,
          },
        });
      }

      await prisma.auditLog.create({
        data: {
          action: 'SUBMIT_HOMEWORK',
          module: 'HOMEWORK',
          details: `Student submitted homework for ${submission.homework.title}`,
        },
      });

      return NextResponse.json({ message: 'Homework submitted successfully!', submission }, { status: 201 });
    }

    // 2. Teacher Assign Homework Endpoint
    let finalSubjectId = subjectId;
    if (!finalSubjectId) {
      const sub = await prisma.subject.findFirst();
      finalSubjectId = sub?.id;
    }

    let finalSectionId = sectionId;
    if (!finalSectionId) {
      const sec = await prisma.section.findFirst();
      finalSectionId = sec?.id;
    }

    let finalTeacherId = teacherId;
    if (!finalTeacherId) {
      const t = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
      finalTeacherId = t?.id;
    }

    const homework = await prisma.homework.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate || Date.now() + 86400000 * 3),
        subjectId: finalSubjectId,
        sectionId: finalSectionId,
        teacherId: finalTeacherId,
        attachments: attachments || null,
      },
      include: {
        subject: true,
        section: true,
        teacher: true,
      }
    });

    return NextResponse.json(homework, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, grade, feedback, status } = body;

    const updated = await prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: {
        grade,
        feedback,
        status: status || 'EVALUATED',
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
