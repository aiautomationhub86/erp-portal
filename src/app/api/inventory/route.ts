import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        vendor: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const vendors = await prisma.vendor.findMany();
    return NextResponse.json({ items, vendors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, quantity, unitPrice, location, vendorId } = body;

    const itemCode = `AST-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const item = await prisma.inventoryItem.create({
      data: {
        itemCode,
        name,
        category,
        quantity: parseInt(quantity) || 10,
        unitPrice: parseFloat(unitPrice) || 1200,
        location: location || 'Central Academic Store',
        vendorId: vendorId || null,
      },
      include: {
        vendor: true,
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
