import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const payrolls = await prisma.payrollRecord.findMany({
      include: {
        teacher: {
          include: {
            user: true,
            department: true,
          }
        }
      },
      orderBy: { paymentDate: 'desc' },
    });

    const teachers = await prisma.teacherProfile.findMany({
      include: {
        user: true,
        department: true,
      }
    });

    return NextResponse.json({ payrolls, teachers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, month, basicSalary, allowances, deductions } = body;

    const basic = parseFloat(basicSalary) || 55000;
    const allow = parseFloat(allowances) || 15000;
    const ded = parseFloat(deductions) || 5000;
    const net = basic + allow - ded;

    const payslipNum = `PAY-2026-${month.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const record = await prisma.payrollRecord.create({
      data: {
        teacherId,
        month,
        basicSalary: basic,
        allowances: allow,
        deductions: ded,
        netSalary: net,
        status: 'PAID',
        payslipNumber: payslipNum,
        paymentDate: new Date(),
      },
      include: {
        teacher: {
          include: {
            user: true,
          }
        }
      }
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
