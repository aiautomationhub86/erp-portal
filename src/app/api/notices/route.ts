import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const target = searchParams.get('target');

    const notices = await prisma.notice.findMany({
      where: {
        AND: [
          category ? { category } : {},
          target ? { OR: [{ targetRole: target }, { targetRole: 'ALL' }] } : {},
        ],
      },
      include: {
        author: true,
        department: true,
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(notices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, targetRole, isPinned, departmentCode, authorEmail } = body;

    const author = await prisma.user.findFirst({
      where: authorEmail ? { email: authorEmail } : undefined,
    });

    let departmentId = undefined;
    if (departmentCode) {
      const dept = await prisma.department.findUnique({
        where: { code: departmentCode },
      });
      departmentId = dept?.id;
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category: category || 'GENERAL',
        targetRole: targetRole || 'ALL',
        isPinned: Boolean(isPinned),
        authorId: author?.id || (await prisma.user.findFirst())!.id,
        departmentId,
      },
      include: {
        author: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'BROADCAST_NOTICE',
        module: 'NOTICES',
        details: `Published circular: "${title}" to ${targetRole}`,
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
