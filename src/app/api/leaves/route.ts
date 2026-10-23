import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const leaves = await prisma.leaveRequest.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leaves);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'APPLY_LEAVE') {
      const { userEmail, leaveType, startDate, endDate, reason } = body;
      const user = await prisma.user.findFirst({
        where: userEmail ? { email: userEmail } : undefined,
      });

      const leave = await prisma.leaveRequest.create({
        data: {
          userId: user?.id || (await prisma.user.findFirst())!.id,
          leaveType: leaveType || 'CASUAL',
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reason,
          status: 'PENDING',
        },
        include: {
          user: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: 'LEAVE_APPLICATION_SUBMITTED',
          module: 'LEAVES',
          details: `Submitted ${leaveType} leave application for ${user?.name}`,
        },
      });

      return NextResponse.json(leave, { status: 201 });
    }

    if (action === 'UPDATE_STATUS') {
      const { leaveId, status, approvedBy, adminRemarks } = body;
      const leave = await prisma.leaveRequest.update({
        where: { id: leaveId },
        data: {
          status,
          approvedBy,
          adminRemarks,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: 'LEAVE_STATUS_UPDATED',
          module: 'LEAVES',
          details: `Leave #${leaveId.slice(0, 6)} updated to ${status} by ${approvedBy}`,
        },
      });

      return NextResponse.json(leave);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
