import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const books = await prisma.libraryBook.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search } },
              { author: { contains: search } },
              { isbn: { contains: search } },
            ],
          }
        : undefined,
      include: {
        transactions: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { title: 'asc' },
    });

    const activeLoans = await prisma.bookTransaction.findMany({
      include: {
        book: true,
        student: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { issueDate: 'desc' },
    });

    return NextResponse.json({ books, activeLoans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'ISSUE_BOOK') {
      const { bookId, studentId, durationDays } = body;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (parseInt(durationDays) || 14));

      const txn = await prisma.bookTransaction.create({
        data: {
          bookId,
          studentId,
          dueDate,
          status: 'ISSUED',
        },
      });

      // Decrement available copies
      await prisma.libraryBook.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } },
      });

      await prisma.auditLog.create({
        data: {
          action: 'BOOK_ISSUED',
          module: 'LIBRARY',
          details: `Loaned book to student ${studentId}`,
        },
      });

      return NextResponse.json(txn, { status: 201 });
    }

    if (action === 'RETURN_BOOK') {
      const { transactionId, fineAmount } = body;
      const txn = await prisma.bookTransaction.update({
        where: { id: transactionId },
        data: {
          returnDate: new Date(),
          status: 'RETURNED',
          fineAmount: parseFloat(fineAmount) || 0,
        },
        include: { book: true },
      });

      // Increment available copies
      await prisma.libraryBook.update({
        where: { id: txn.bookId },
        data: { availableCopies: { increment: 1 } },
      });

      return NextResponse.json(txn);
    }

    if (action === 'ADD_BOOK') {
      const { isbn, title, author, publisher, category, totalCopies, shelfLocation } = body;
      const book = await prisma.libraryBook.create({
        data: {
          isbn,
          title,
          author,
          publisher,
          category: category || 'Computer Science',
          totalCopies: parseInt(totalCopies) || 5,
          availableCopies: parseInt(totalCopies) || 5,
          shelfLocation: shelfLocation || 'Rack CS-01',
        },
      });
      return NextResponse.json(book, { status: 201 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
