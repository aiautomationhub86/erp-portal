import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const hostels = await prisma.hostel.findMany({
      include: {
        rooms: {
          include: {
            allocations: {
              include: {
                student: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const complaints = await prisma.hostelComplaint.findMany({
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ hostels, complaints });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'SUBMIT_COMPLAINT') {
      const { studentId, category, title, description } = body;
      const complaint = await prisma.hostelComplaint.create({
        data: {
          studentId,
          category: category || 'ELECTRICAL',
          title,
          description,
          status: 'PENDING',
        },
      });
      return NextResponse.json(complaint, { status: 201 });
    }

    if (action === 'RESOLVE_COMPLAINT') {
      const { complaintId, status } = body;
      const complaint = await prisma.hostelComplaint.update({
        where: { id: complaintId },
        data: { status: status || 'RESOLVED' },
      });
      return NextResponse.json(complaint);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
