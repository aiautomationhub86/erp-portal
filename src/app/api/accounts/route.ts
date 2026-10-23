import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const transactions = await prisma.accountTransaction.findMany({
      orderBy: { transactionDate: 'desc' },
    });
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, category, amount, description, paymentMode } = body;

    const voucherNo = `VOU-2026-${new Date().toISOString().substring(5, 7)}-${Math.floor(100 + Math.random() * 900)}`;

    const tx = await prisma.accountTransaction.create({
      data: {
        voucherNo,
        type: type || 'EXPENSE',
        category: category || 'UTILITIES',
        amount: parseFloat(amount) || 1000,
        description: description || 'Campus general expense',
        paymentMode: paymentMode || 'BANK_TRANSFER',
        transactionDate: new Date(),
      }
    });

    return NextResponse.json(tx, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
