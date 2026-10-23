import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    const categories = await prisma.feeCategory.findMany();

    const studentFees = await prisma.studentFee.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        student: {
          include: {
            user: true,
            department: true,
          },
        },
        feeCategory: true,
        transactions: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    const recentTransactions = await prisma.paymentTransaction.findMany({
      include: {
        studentFee: {
          include: {
            student: {
              include: {
                user: true,
                department: true,
              },
            },
            feeCategory: true,
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
      take: 20,
    });

    return NextResponse.json({ categories, studentFees, recentTransactions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentFeeId, amountPaid, paymentMode, remarks } = body;

    const studentFee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
    });

    if (!studentFee) {
      return NextResponse.json({ error: 'Fee record not found' }, { status: 404 });
    }

    const amt = parseFloat(amountPaid);
    const newPaid = studentFee.paidAmount + amt;
    const newDue = Math.max(0, studentFee.totalAmount - newPaid);
    const newStatus = newDue === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await prisma.paymentTransaction.create({
      data: {
        receiptNo,
        studentFeeId,
        amountPaid: amt,
        paymentMode: paymentMode || 'ONLINE',
        transactionRef: `TXN-${Date.now()}`,
        remarks: remarks || 'Fee payment recorded successfully',
      },
    });

    await prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        paidAmount: newPaid,
        dueAmount: newDue,
        status: newStatus,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'PAYMENT_RECORDED',
        module: 'FEES',
        details: `Recorded ₹${amt} via ${paymentMode} with receipt #${receiptNo}`,
      },
    });

    return NextResponse.json({ transaction, receiptNo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
