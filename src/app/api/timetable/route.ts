import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get('sectionId');
    const teacherId = searchParams.get('teacherId');

    const slots = await prisma.timetableSlot.findMany({
      where: {
        AND: [
          sectionId ? { sectionId } : {},
          teacherId ? { teacherId } : {},
        ],
      },
      include: {
        subject: true,
        teacher: {
          include: {
            user: true,
          },
        },
        classroom: true,
        section: {
          include: {
            semester: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json(slots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dayOfWeek, startTime, endTime, sectionId, subjectId, teacherId, classroomId } = body;

    // Resolve Foreign Keys safely to prevent DB constraint failure
    let resolvedSectionId = sectionId;
    if (!resolvedSectionId) {
      const defaultSec = await prisma.section.findFirst();
      resolvedSectionId = defaultSec?.id;
    }

    let resolvedSubjectId = subjectId;
    if (resolvedSubjectId) {
      const subExists = await prisma.subject.findUnique({ where: { id: resolvedSubjectId } });
      if (!subExists) {
        const subByCode = await prisma.subject.findFirst({ where: { OR: [{ id: resolvedSubjectId }, { code: resolvedSubjectId }] } });
        resolvedSubjectId = subByCode ? subByCode.id : (await prisma.subject.findFirst())?.id;
      }
    } else {
      resolvedSubjectId = (await prisma.subject.findFirst())?.id;
    }

    let resolvedTeacherId = teacherId;
    if (resolvedTeacherId) {
      const tExists = await prisma.teacherProfile.findUnique({ where: { id: resolvedTeacherId } });
      if (!tExists) {
        resolvedTeacherId = (await prisma.teacherProfile.findFirst())?.id;
      }
    } else {
      resolvedTeacherId = (await prisma.teacherProfile.findFirst())?.id;
    }

    let resolvedClassroomId = classroomId;
    if (resolvedClassroomId) {
      const rExists = await prisma.classroom.findUnique({ where: { id: resolvedClassroomId } });
      if (!rExists) {
        resolvedClassroomId = (await prisma.classroom.findFirst())?.id;
      }
    } else {
      resolvedClassroomId = (await prisma.classroom.findFirst())?.id;
    }

    if (!resolvedSectionId || !resolvedSubjectId || !resolvedTeacherId || !resolvedClassroomId) {
      return NextResponse.json(
        { error: 'Academic reference missing: Subject, Teacher, Section or Classroom record not found.' },
        { status: 400 }
      );
    }

    // 1. CONFLICT DETECTION: Check if Classroom is already booked in that slot
    const roomConflict = await prisma.timetableSlot.findFirst({
      where: {
        dayOfWeek,
        startTime,
        classroomId: resolvedClassroomId,
      },
      include: {
        subject: true,
        classroom: true,
      },
    });

    if (roomConflict) {
      return NextResponse.json(
        {
          error: `Room Conflict! ${roomConflict.classroom.roomNumber} is already booked on ${dayOfWeek} at ${startTime} for ${roomConflict.subject.name}.`,
          conflictType: 'ROOM_CLASH',
        },
        { status: 409 }
      );
    }

    // 2. CONFLICT DETECTION: Check if Teacher is already teaching another class in that slot
    const teacherConflict = await prisma.timetableSlot.findFirst({
      where: {
        dayOfWeek,
        startTime,
        teacherId: resolvedTeacherId,
      },
      include: {
        subject: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    if (teacherConflict) {
      return NextResponse.json(
        {
          error: `Faculty Conflict! ${teacherConflict.teacher.user.name} is already assigned to teach ${teacherConflict.subject.name} on ${dayOfWeek} at ${startTime}.`,
          conflictType: 'TEACHER_CLASH',
        },
        { status: 409 }
      );
    }

    // Create slot
    const slot = await prisma.timetableSlot.create({
      data: {
        dayOfWeek: dayOfWeek || 'MONDAY',
        startTime: startTime || '11:00',
        endTime: endTime || '12:00',
        sectionId: resolvedSectionId,
        subjectId: resolvedSubjectId,
        teacherId: resolvedTeacherId,
        classroomId: resolvedClassroomId,
      },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        classroom: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'TIMETABLE_SLOT_CREATED',
        module: 'TIMETABLE',
        details: `Scheduled ${slot.subject.code} (${dayOfWeek} ${startTime}) in ${slot.classroom.roomNumber}`,
      },
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
