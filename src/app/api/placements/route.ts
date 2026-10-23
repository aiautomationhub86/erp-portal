import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const drives = await prisma.placementDrive.findMany({
      include: {
        company: true,
        applications: {
          include: {
            student: {
              include: {
                user: true,
                department: true,
                results: true,
              },
            },
          },
        },
      },
      orderBy: { driveDate: 'asc' },
    });

    const companies = await prisma.placementCompany.findMany();

    return NextResponse.json({ drives, companies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'APPLY_DRIVE') {
      const { driveId, studentId } = body;
      const app = await prisma.placementApplication.create({
        data: {
          driveId,
          studentId,
          status: 'APPLIED',
        },
      });
      return NextResponse.json(app, { status: 201 });
    }

    if (action === 'POST_DRIVE') {
      const { companyName, jobRole, packageLPA, minCgpa, location, driveDate, deadlineDate } = body;
      
      let company = await prisma.placementCompany.findFirst({
        where: { name: companyName },
      });

      if (!company) {
        company = await prisma.placementCompany.create({
          data: { name: companyName },
        });
      }

      const drive = await prisma.placementDrive.create({
        data: {
          companyId: company.id,
          jobRole,
          packageLPA: parseFloat(packageLPA) || 10.0,
          minCgpa: parseFloat(minCgpa) || 7.0,
          location: location || 'Bangalore / Remote',
          driveDate: new Date(driveDate),
          deadlineDate: new Date(deadlineDate),
          status: 'UPCOMING',
        },
        include: { company: true },
      });

      await prisma.auditLog.create({
        data: {
          action: 'POST_PLACEMENT_DRIVE',
          module: 'PLACEMENTS',
          details: `Posted drive ${companyName} (${jobRole}, ₹${packageLPA} LPA)`,
        },
      });

      return NextResponse.json(drive, { status: 201 });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
