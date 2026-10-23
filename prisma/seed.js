const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Full School ERP System with 7 Role Views, 1,842 Students Aggregate, and 18 Business Modules...');

  // 1. SCHOOL BRANCHES
  const mainBranch = await prisma.schoolBranch.upsert({
    where: { code: 'DPS-CENTRAL' },
    update: {},
    create: {
      name: 'Delhi Public International School - Main Central Campus',
      code: 'DPS-CENTRAL',
      address: 'Plot 14, Institutional Area, Vasant Kunj, New Delhi',
      principal: 'Mrs. Shailaja Mehra',
      contact: '+91 11 2689 4001',
    }
  });

  const northBranch = await prisma.schoolBranch.upsert({
    where: { code: 'DPS-NORTH' },
    update: {},
    create: {
      name: 'Delhi Public International School - North Campus',
      code: 'DPS-NORTH',
      address: 'Sector 14, Rohini, New Delhi',
      principal: 'Dr. Rameshwar Nath',
      contact: '+91 11 2755 8890',
    }
  });

  const southBranch = await prisma.schoolBranch.upsert({
    where: { code: 'DPS-SOUTH' },
    update: {},
    create: {
      name: 'Delhi Public International School - South Campus',
      code: 'DPS-SOUTH',
      address: 'Block C, Saket, New Delhi',
      principal: 'Mrs. Vandana Roy',
      contact: '+91 11 2956 1234',
    }
  });

  // 2. DEPARTMENTS / WINGS
  const primaryDept = await prisma.department.upsert({
    where: { code: 'PRIMARY' },
    update: {},
    create: {
      code: 'PRIMARY',
      name: 'Primary Wing (Grades 1 to 5)',
      hodName: 'Mrs. Anita Rao',
      hodEmail: 'anita.rao@school.edu',
      contactEmail: 'primary@school.edu',
    }
  });

  const middleDept = await prisma.department.upsert({
    where: { code: 'MIDDLE' },
    update: {},
    create: {
      code: 'MIDDLE',
      name: 'Middle Wing (Grades 6 to 8)',
      hodName: 'Mr. Arvind Swamy',
      hodEmail: 'hod.science@school.edu',
      contactEmail: 'middle@school.edu',
    }
  });

  const secondaryDept = await prisma.department.upsert({
    where: { code: 'SECONDARY' },
    update: {},
    create: {
      code: 'SECONDARY',
      name: 'Secondary Wing (Grades 9 & 10 CBSE)',
      hodName: 'Dr. Arvind Swamy',
      hodEmail: 'hod.science@school.edu',
      contactEmail: 'secondary@school.edu',
    }
  });

  const srSecondaryDept = await prisma.department.upsert({
    where: { code: 'SR_SECONDARY' },
    update: {},
    create: {
      code: 'SR_SECONDARY',
      name: 'Senior Secondary Wing (Grades 11 & 12)',
      hodName: 'Dr. K. S. Ramanujan',
      hodEmail: 'ramanujan@school.edu',
      contactEmail: 'srsec@school.edu',
    }
  });

  // 3. COURSES / CLASSES
  const class10 = await prisma.course.upsert({
    where: { code: 'CLASS-10' },
    update: {},
    create: {
      code: 'CLASS-10',
      name: 'Class 10 (CBSE Secondary Certificate)',
      durationYears: 1,
      departmentId: secondaryDept.id,
    }
  });

  const class9 = await prisma.course.upsert({
    where: { code: 'CLASS-9' },
    update: {},
    create: {
      code: 'CLASS-9',
      name: 'Class 9 (CBSE Preparatory)',
      durationYears: 1,
      departmentId: secondaryDept.id,
    }
  });

  const class11 = await prisma.course.upsert({
    where: { code: 'CLASS-11-SCI' },
    update: {},
    create: {
      code: 'CLASS-11-SCI',
      name: 'Class 11 Science (PCM / PCB)',
      durationYears: 1,
      departmentId: srSecondaryDept.id,
    }
  });

  // 4. SEMESTER / ACADEMIC TERMS
  const term1Class10 = await prisma.semester.upsert({
    where: { courseId_semesterNum: { courseId: class10.id, semesterNum: 1 } },
    update: {},
    create: {
      courseId: class10.id,
      semesterNum: 1,
    }
  });

  const term2Class10 = await prisma.semester.upsert({
    where: { courseId_semesterNum: { courseId: class10.id, semesterNum: 2 } },
    update: {},
    create: {
      courseId: class10.id,
      semesterNum: 2,
    }
  });

  // 5. SECTIONS
  const section10A = await prisma.section.upsert({
    where: { semesterId_name: { semesterId: term1Class10.id, name: 'A' } },
    update: {},
    create: {
      name: 'A',
      semesterId: term1Class10.id,
    }
  });

  const section10B = await prisma.section.upsert({
    where: { semesterId_name: { semesterId: term1Class10.id, name: 'B' } },
    update: {},
    create: {
      name: 'B',
      semesterId: term1Class10.id,
    }
  });

  // 6. CLASSROOMS
  const room101 = await prisma.classroom.upsert({
    where: { roomNumber: 'Room 101' },
    update: {},
    create: {
      roomNumber: 'Room 101',
      building: 'Sarabhai Academic Block',
      floor: 1,
      capacity: 45,
      type: 'Smart Classroom',
    }
  });

  const scienceLab = await prisma.classroom.upsert({
    where: { roomNumber: 'Science Composite Lab' },
    update: {},
    create: {
      roomNumber: 'Science Composite Lab',
      building: 'C.V. Raman Science Wing',
      floor: 2,
      capacity: 40,
      type: 'Laboratory',
    }
  });

  const mathLab = await prisma.classroom.upsert({
    where: { roomNumber: 'Mathematics Lab' },
    update: {},
    create: {
      roomNumber: 'Mathematics Lab',
      building: 'Aryabhata Mathematics Center',
      floor: 2,
      capacity: 35,
      type: 'Activity Lab',
    }
  });

  // 7. SUBJECTS
  const mathSubject = await prisma.subject.upsert({
    where: { code: 'MATH-10' },
    update: {},
    create: {
      code: 'MATH-10',
      name: 'Mathematics (Standard 041)',
      credits: 4,
      type: 'THEORY',
      departmentId: secondaryDept.id,
      semesterId: term1Class10.id,
    }
  });

  const scienceSubject = await prisma.subject.upsert({
    where: { code: 'SCI-10' },
    update: {},
    create: {
      code: 'SCI-10',
      name: 'Science (Physics, Chemistry, Biology 086)',
      credits: 4,
      type: 'THEORY',
      departmentId: secondaryDept.id,
      semesterId: term1Class10.id,
    }
  });

  const englishSubject = await prisma.subject.upsert({
    where: { code: 'ENG-10' },
    update: {},
    create: {
      code: 'ENG-10',
      name: 'English Language & Literature (184)',
      credits: 3,
      type: 'THEORY',
      departmentId: secondaryDept.id,
      semesterId: term1Class10.id,
    }
  });

  const sstSubject = await prisma.subject.upsert({
    where: { code: 'SST-10' },
    update: {},
    create: {
      code: 'SST-10',
      name: 'Social Science (History, Civics, Geography 087)',
      credits: 3,
      type: 'THEORY',
      departmentId: secondaryDept.id,
      semesterId: term1Class10.id,
    }
  });

  const itSubject = await prisma.subject.upsert({
    where: { code: 'IT-402' },
    update: {},
    create: {
      code: 'IT-402',
      name: 'Information Technology (Skill Subject 402)',
      credits: 2,
      type: 'LAB',
      departmentId: secondaryDept.id,
      semesterId: term1Class10.id,
    }
  });

  // 8. USERS FOR 7 ROLES
  // Director
  const directorUser = await prisma.user.upsert({
    where: { email: 'director@school.edu' },
    update: { name: 'Dr. Vikramaditya Singhania (Director)', role: 'DIRECTOR' },
    create: {
      email: 'director@school.edu',
      name: 'Dr. Vikramaditya Singhania (Director)',
      role: 'DIRECTOR',
      phone: '+91 9811002233',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    }
  });

  // Principal
  const principalUser = await prisma.user.upsert({
    where: { email: 'principal@school.edu' },
    update: { name: 'Mrs. Shailaja Mehra (Principal)', role: 'PRINCIPAL' },
    create: {
      email: 'principal@school.edu',
      name: 'Mrs. Shailaja Mehra (Principal)',
      role: 'PRINCIPAL',
      phone: '+91 9811004455',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    }
  });

  // Teacher 1 (Rajesh Sharma)
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher.rajesh@school.edu' },
    update: { name: 'Mr. Rajesh Sharma (PGT Math)', role: 'TEACHER' },
    create: {
      email: 'teacher.rajesh@school.edu',
      name: 'Mr. Rajesh Sharma (PGT Math)',
      role: 'TEACHER',
      phone: '+91 9876543213',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    }
  });

  const teacherProfile = await prisma.teacherProfile.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      employeeId: 'EMP-TCH-101',
      designation: 'Senior Faculty - Mathematics & Science',
      qualification: 'M.Sc. Mathematics, B.Ed. (Gold Medalist)',
      specialization: 'CBSE Class 10 & 12 Mathematics',
      salary: 68000,
      departmentId: secondaryDept.id,
    }
  });

  // Map teacher to subjects
  await prisma.teacherSubject.upsert({
    where: { teacherId_subjectId: { teacherId: teacherProfile.id, subjectId: mathSubject.id } },
    update: {},
    create: { teacherId: teacherProfile.id, subjectId: mathSubject.id }
  });

  await prisma.teacherSubject.upsert({
    where: { teacherId_subjectId: { teacherId: teacherProfile.id, subjectId: scienceSubject.id } },
    update: {},
    create: { teacherId: teacherProfile.id, subjectId: scienceSubject.id }
  });

  // Teacher 2 (Ananya Sen)
  const teacher2User = await prisma.user.upsert({
    where: { email: 'teacher.sen@school.edu' },
    update: { name: 'Mrs. Ananya Sen (TGT English & SST)', role: 'TEACHER' },
    create: {
      email: 'teacher.sen@school.edu',
      name: 'Mrs. Ananya Sen (TGT English & SST)',
      role: 'TEACHER',
      phone: '+91 9876543214',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    }
  });

  const teacher2Profile = await prisma.teacherProfile.upsert({
    where: { userId: teacher2User.id },
    update: {},
    create: {
      userId: teacher2User.id,
      employeeId: 'EMP-TCH-102',
      designation: 'Faculty - English & Social Sciences',
      qualification: 'M.A. English, B.Ed.',
      salary: 58000,
      departmentId: secondaryDept.id,
    }
  });

  // Parent (Sanjay Sharma)
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent.sharma@school.edu' },
    update: { name: 'Mr. Sanjay Sharma (Parent)', role: 'PARENT' },
    create: {
      email: 'parent.sharma@school.edu',
      name: 'Mr. Sanjay Sharma (Parent)',
      role: 'PARENT',
      phone: '+91 9811223399',
      address: 'Flat 402, Oakwood Towers, Vasant Kunj, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    }
  });

  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      occupation: 'Senior Director, Tech Mahindra',
      annualIncome: 3200000,
    }
  });

  // Student 1 (Aarav Sharma - Top Student)
  const studentUser1 = await prisma.user.upsert({
    where: { email: 'aarav.sharma@school.edu' },
    update: { name: 'Aarav Sharma', role: 'STUDENT' },
    create: {
      email: 'aarav.sharma@school.edu',
      name: 'Aarav Sharma',
      role: 'STUDENT',
      phone: '+91 9811223344',
      gender: 'Male',
      address: 'Flat 402, Oakwood Towers, Vasant Kunj, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    }
  });

  const studentProfile1 = await prisma.studentProfile.upsert({
    where: { rollNumber: '10024' },
    update: {
      isAtRisk: false,
      riskReason: null,
      parentId: parentProfile.id,
    },
    create: {
      userId: studentUser1.id,
      rollNumber: '10024',
      admissionNo: 'ADM-2026-10024',
      dob: new Date('2010-04-15'),
      bloodGroup: 'B+',
      category: 'General',
      academicHistory: 'Distinction in Class 9 (94.8%), Captain of School Quiz Club',
      isAtRisk: false,
      departmentId: secondaryDept.id,
      courseId: class10.id,
      semesterId: term1Class10.id,
      sectionId: section10A.id,
      parentId: parentProfile.id,
    }
  });

  // Student 2 (Rohan Mehta - At Risk: Attendance 64.2% & Math fail)
  const studentUser2 = await prisma.user.upsert({
    where: { email: 'rohan.mehta@school.edu' },
    update: { name: 'Rohan Mehta', role: 'STUDENT' },
    create: {
      email: 'rohan.mehta@school.edu',
      name: 'Rohan Mehta',
      role: 'STUDENT',
      phone: '+91 9822334455',
      gender: 'Male',
      address: 'House #12, Pocket D, Sarita Vihar, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    }
  });

  await prisma.studentProfile.upsert({
    where: { rollNumber: '10025' },
    update: {
      isAtRisk: true,
      riskReason: 'Attendance shortage (64.2%) & Failed Unit Test 1 Mathematics (38%)',
    },
    create: {
      userId: studentUser2.id,
      rollNumber: '10025',
      admissionNo: 'ADM-2026-10025',
      dob: new Date('2010-08-20'),
      bloodGroup: 'O+',
      category: 'General',
      isAtRisk: true,
      riskReason: 'Attendance shortage (64.2%) & Failed Unit Test 1 Mathematics (38%)',
      departmentId: secondaryDept.id,
      courseId: class10.id,
      semesterId: term1Class10.id,
      sectionId: section10A.id,
    }
  });

  // Student 3 (Simran Kaur - At Risk: Fee default & Low Science)
  const studentUser3 = await prisma.user.upsert({
    where: { email: 'simran.kaur@school.edu' },
    update: { name: 'Simran Kaur', role: 'STUDENT' },
    create: {
      email: 'simran.kaur@school.edu',
      name: 'Simran Kaur',
      role: 'STUDENT',
      phone: '+91 9833445566',
      gender: 'Female',
      address: 'C-48, Greater Kailash 1, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    }
  });

  await prisma.studentProfile.upsert({
    where: { rollNumber: '10026' },
    update: {
      isAtRisk: true,
      riskReason: 'Term 1 Fee pending over 60 days & declining Science score (44%)',
    },
    create: {
      userId: studentUser3.id,
      rollNumber: '10026',
      admissionNo: 'ADM-2026-10026',
      dob: new Date('2010-11-05'),
      bloodGroup: 'A+',
      category: 'General',
      isAtRisk: true,
      riskReason: 'Term 1 Fee pending over 60 days & declining Science score (44%)',
      departmentId: secondaryDept.id,
      courseId: class10.id,
      semesterId: term1Class10.id,
      sectionId: section10A.id,
    }
  });

  // Accountant (Rakesh Gupta)
  const accountantUser = await prisma.user.upsert({
    where: { email: 'accountant@school.edu' },
    update: { name: 'Mr. Rakesh Gupta (Senior Accounts Officer)', role: 'ACCOUNTANT' },
    create: {
      email: 'accountant@school.edu',
      name: 'Mr. Rakesh Gupta (Senior Accounts Officer)',
      role: 'ACCOUNTANT',
      phone: '+91 9844556677',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    }
  });

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'superadmin@school.edu' },
    update: { name: 'Master System Administrator', role: 'SUPER_ADMIN' },
    create: {
      email: 'superadmin@school.edu',
      name: 'Master System Administrator',
      role: 'SUPER_ADMIN',
      phone: '+91 9800112233',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    }
  });

  // Academic Admin
  await prisma.user.upsert({
    where: { email: 'admin@school.edu' },
    update: { name: 'Academic Dean Alok Verma', role: 'ADMIN' },
    create: {
      email: 'admin@school.edu',
      name: 'Academic Dean Alok Verma',
      role: 'ADMIN',
      phone: '+91 9811223311',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    }
  });

  // HOD
  await prisma.user.upsert({
    where: { email: 'hod.science@school.edu' },
    update: { name: 'Dr. Arvind Swamy (HOD Sciences)', role: 'HOD' },
    create: {
      email: 'hod.science@school.edu',
      name: 'Dr. Arvind Swamy (HOD Sciences)',
      role: 'HOD',
      phone: '+91 9811223322',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    }
  });

  // Librarian
  await prisma.user.upsert({
    where: { email: 'librarian@school.edu' },
    update: { name: 'Mrs. Sunita Verma (Head Librarian)', role: 'LIBRARIAN' },
    create: {
      email: 'librarian@school.edu',
      name: 'Mrs. Sunita Verma (Head Librarian)',
      role: 'LIBRARIAN',
      phone: '+91 9855667788',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    }
  });

  // 9. TIMETABLE FOR CLASS 10-A
  await prisma.timetableSlot.deleteMany({});
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  for (const day of days) {
    // Period 1: Math
    await prisma.timetableSlot.create({
      data: {
        dayOfWeek: day,
        startTime: '08:30',
        endTime: '09:15',
        sectionId: section10A.id,
        subjectId: mathSubject.id,
        teacherId: teacherProfile.id,
        classroomId: room101.id,
      }
    });

    // Period 2: Science
    await prisma.timetableSlot.create({
      data: {
        dayOfWeek: day,
        startTime: '09:20',
        endTime: '10:05',
        sectionId: section10A.id,
        subjectId: scienceSubject.id,
        teacherId: teacherProfile.id,
        classroomId: scienceLab.id,
      }
    });

    // Period 3: English
    await prisma.timetableSlot.create({
      data: {
        dayOfWeek: day,
        startTime: '10:10',
        endTime: '10:55',
        sectionId: section10A.id,
        subjectId: englishSubject.id,
        teacherId: teacher2Profile.id,
        classroomId: room101.id,
      }
    });
  }

  // 10. HOMEWORK & ASSIGNMENTS
  await prisma.homeworkSubmission.deleteMany({});
  await prisma.homework.deleteMany({});

  const hw1 = await prisma.homework.create({
    data: {
      title: 'Chapter 4: Quadratic Equations - Exercise 4.2 & Word Problems',
      description: 'Solve all word problems from questions 1 to 10 on quadratic factorization and nature of roots. Show complete algebraic steps.',
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days later
      subjectId: mathSubject.id,
      sectionId: section10A.id,
      teacherId: teacherUser.id,
      attachments: 'quadratic_equations_formula_sheet.pdf',
    }
  });

  const hw2 = await prisma.homework.create({
    data: {
      title: 'Optics Lab: Ray Diagrams & Spherical Mirrors Worksheet',
      description: 'Draw neat ray diagrams for convex and concave lenses when the object is at 2F, F, and between F and Optical Center. Calculate focal lengths.',
      dueDate: new Date(Date.now() + 86400000 * 4), // 4 days later
      subjectId: scienceSubject.id,
      sectionId: section10A.id,
      teacherId: teacherUser.id,
      attachments: 'optics_ray_diagram_manual.pdf',
    }
  });

  const hw3 = await prisma.homework.create({
    data: {
      title: 'Formal Letter to the Editor: Climate Action in Urban Metros',
      description: 'Draft a 150-word formal letter highlighting the urgent need for solar rooftops and electric transit in the NCR region.',
      dueDate: new Date(Date.now() + 86400000 * 3),
      subjectId: englishSubject.id,
      sectionId: section10A.id,
      teacherId: teacher2User.id,
    }
  });

  // Homework submission by Aarav Sharma
  await prisma.homeworkSubmission.create({
    data: {
      homeworkId: hw1.id,
      studentId: studentProfile1.id,
      submissionText: 'All 10 questions solved with discriminants calculated. Verified roots with quadratic formula.',
      fileUrl: 'aarav_sharma_math_hw_ch4.pdf',
      status: 'EVALUATED',
      grade: 'A+',
      feedback: 'Flawless working and very clear graph sketches. Excellent job Aarav!',
    }
  });

  // 11. ATTENDANCE SIMULATION (Aarav Sharma -> 94.2% Present)
  await prisma.studentAttendance.deleteMany({ where: { studentId: studentProfile1.id } });
  for (let i = 1; i <= 25; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const status = (i === 4 || i === 18) ? 'ABSENT' : 'PRESENT';
    await prisma.studentAttendance.create({
      data: {
        date: d,
        status: status,
        remarks: status === 'ABSENT' ? 'Informed medical leave' : 'Regular on-time punch',
        studentId: studentProfile1.id,
        subjectId: mathSubject.id,
      }
    });
  }

  // 12. EXAMS & MARKS (Aarav: 94.2% CGPA)
  await prisma.mark.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.exam.deleteMany({});

  const examPA1 = await prisma.exam.create({
    data: {
      name: 'Periodic Assessment 1 (PA-1)',
      type: 'UNIT_TEST',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-18'),
      semesterId: term1Class10.id,
    }
  });

  await prisma.mark.create({
    data: {
      examId: examPA1.id,
      subjectId: mathSubject.id,
      studentId: studentProfile1.id,
      marksObtained: 96,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Top in Section 10-A. Outstanding analytical skill.',
    }
  });

  await prisma.mark.create({
    data: {
      examId: examPA1.id,
      subjectId: scienceSubject.id,
      studentId: studentProfile1.id,
      marksObtained: 92,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Excellent concept clarity in Physics & Chemistry.',
    }
  });

  await prisma.mark.create({
    data: {
      examId: examPA1.id,
      subjectId: englishSubject.id,
      studentId: studentProfile1.id,
      marksObtained: 88,
      maxMarks: 100,
      grade: 'A2',
      remarks: 'Very good vocabulary and creative expression.',
    }
  });

  await prisma.result.create({
    data: {
      studentId: studentProfile1.id,
      semesterNumber: 1,
      sgpa: 9.4,
      cgpa: 9.4,
      totalCredits: 18,
      status: 'DISTINCTION',
    }
  });

  // 13. FEES & TRANSACTIONS
  await prisma.paymentTransaction.deleteMany({});
  await prisma.studentFee.deleteMany({});
  await prisma.feeCategory.deleteMany({});

  const tuitionFeeCat = await prisma.feeCategory.create({
    data: {
      name: 'Quarterly Tuition & Academic Fee',
      amount: 24000,
      frequency: 'QUARTERLY',
    }
  });

  const labTechFeeCat = await prisma.feeCategory.create({
    data: {
      name: 'Annual Smart Lab & STEM Robotics Fee',
      amount: 8500,
      frequency: 'ANNUAL',
    }
  });

  // Aarav Tuition Fee - PAID
  const paidFee = await prisma.studentFee.create({
    data: {
      studentId: studentProfile1.id,
      feeCategoryId: tuitionFeeCat.id,
      totalAmount: 24000,
      paidAmount: 24000,
      dueAmount: 0,
      dueDate: new Date('2026-07-15'),
      status: 'PAID',
    }
  });

  await prisma.paymentTransaction.create({
    data: {
      receiptNo: 'REC-2026-10024',
      studentFeeId: paidFee.id,
      amountPaid: 24000,
      paymentMode: 'UPI',
      transactionRef: 'UPI/HDFC/2026/8892193',
      remarks: 'Q1 Tuition fee cleared online via Parent Portal',
    }
  });

  // Aarav Lab Fee - PENDING (₹8,500 due)
  await prisma.studentFee.create({
    data: {
      studentId: studentProfile1.id,
      feeCategoryId: labTechFeeCat.id,
      totalAmount: 8500,
      paidAmount: 0,
      dueAmount: 8500,
      dueDate: new Date('2026-09-30'),
      status: 'PENDING',
    }
  });

  // 14. HR & PAYROLL
  await prisma.payrollRecord.deleteMany({});
  await prisma.payrollRecord.create({
    data: {
      teacherId: teacherProfile.id,
      month: 'August 2026',
      basicSalary: 55000,
      allowances: 18000,
      deductions: 5000,
      netSalary: 68000,
      status: 'PAID',
      payslipNumber: 'PAY-2026-AUG-101',
      paymentDate: new Date('2026-08-31'),
    }
  });

  await prisma.payrollRecord.create({
    data: {
      teacherId: teacher2Profile.id,
      month: 'August 2026',
      basicSalary: 48000,
      allowances: 14000,
      deductions: 4000,
      netSalary: 58000,
      status: 'PAID',
      payslipNumber: 'PAY-2026-AUG-102',
      paymentDate: new Date('2026-08-31'),
    }
  });

  // 15. INVENTORY & VENDORS
  await prisma.inventoryItem.deleteMany({});
  await prisma.vendor.deleteMany({});

  const vendorLab = await prisma.vendor.create({
    data: {
      name: 'Apex Scientific Instruments Ltd.',
      contactPerson: 'Karan Mehra',
      phone: '+91 9811882233',
      email: 'sales@apexscientific.com',
    }
  });

  const vendorSports = await prisma.vendor.create({
    data: {
      name: 'Everest Sports & Gymnasium Gear',
      contactPerson: 'Suresh Rana',
      phone: '+91 9822114455',
      email: 'orders@everestsports.com',
    }
  });

  await prisma.inventoryItem.create({
    data: {
      itemCode: 'AST-LAB-MIC-01',
      name: 'High-Resolution Binocular Compound Microscope',
      category: 'LAB_EQUIPMENT',
      quantity: 28,
      unitPrice: 14500,
      location: 'Science Composite Lab - Locker B',
      vendorId: vendorLab.id,
    }
  });

  await prisma.inventoryItem.create({
    data: {
      itemCode: 'AST-SPT-BB-04',
      name: 'Spalding Official Competition Basketballs (Size 7)',
      category: 'SPORTS',
      quantity: 45,
      unitPrice: 2200,
      location: 'Sports Complex - Equipment Room 2',
      vendorId: vendorSports.id,
    }
  });

  await prisma.inventoryItem.create({
    data: {
      itemCode: 'AST-IT-PRJ-09',
      name: 'Epson Interactive Laser Smart Classroom Projectors',
      category: 'IT_ASSETS',
      quantity: 18,
      unitPrice: 54000,
      location: 'Sarabhai Academic Block Classrooms',
      vendorId: vendorLab.id,
    }
  });

  // 16. ACCOUNT TRANSACTIONS / DAYBOOK
  await prisma.accountTransaction.deleteMany({});
  await prisma.accountTransaction.create({
    data: {
      voucherNo: 'VOU-2026-09-001',
      type: 'INCOME',
      category: 'FEE_COLLECTION',
      amount: 1850000,
      description: 'Aggregated Q2 Term Fee Online Batch Receipts',
      paymentMode: 'BANK_TRANSFER',
      transactionDate: new Date('2026-09-02'),
    }
  });

  await prisma.accountTransaction.create({
    data: {
      voucherNo: 'VOU-2026-09-002',
      type: 'EXPENSE',
      category: 'SALARIES',
      amount: 780000,
      description: 'August 2026 Teaching & Administrative Staff Salary Payout',
      paymentMode: 'NEFT_BATCH',
      transactionDate: new Date('2026-09-01'),
    }
  });

  await prisma.accountTransaction.create({
    data: {
      voucherNo: 'VOU-2026-09-003',
      type: 'EXPENSE',
      category: 'INFRASTRUCTURE',
      amount: 145000,
      description: 'Robotics & STEM AI Lab Sensor Equipment Purchase',
      paymentMode: 'BANK_TRANSFER',
      transactionDate: new Date('2026-09-05'),
    }
  });

  // 17. NOTICES & CIRCULARS
  await prisma.notice.deleteMany({});
  await prisma.notice.create({
    data: {
      title: 'CBSE Secondary & Sr. Secondary Board Registration 2026-27',
      content: 'All Class 10 and 12 students and parents are requested to verify their subject codes, spelling of names, and LOC documents before September 25, 2026.',
      category: 'ACADEMIC',
      targetRole: 'STUDENT',
      isPinned: true,
      authorId: principalUser.id,
      departmentId: secondaryDept.id,
    }
  });

  await prisma.notice.create({
    data: {
      title: 'Annual Inter-School STEM & Robotics Hackathon 2026',
      content: 'Registrations are open for the DPIS Annual Hackathon on AI & Sustainable Energy Solutions. Cash prizes up to ₹1,00,000.',
      category: 'EVENT',
      targetRole: 'ALL',
      isPinned: true,
      authorId: directorUser.id,
    }
  });

  // 18. TRANSPORT & FLEET
  await prisma.transportVehicle.deleteMany({});
  await prisma.transportRoute.deleteMany({});
  const route12 = await prisma.transportRoute.create({
    data: {
      routeNumber: 'Route #12',
      routeName: 'Dwarka Sector 21 -> Janakpuri -> DPIS Vasant Kunj',
      stops: 'Dwarka Sec 21 -> Sec 10 -> Janakpuri -> Munirka -> School',
    }
  });

  await prisma.transportVehicle.create({
    data: {
      vehicleNumber: 'DL-01-EA-9824',
      capacity: 45,
      driverName: 'Sardar Gurdeep Singh',
      driverPhone: '+91 9811334411',
      routeId: route12.id,
    }
  });

  // 19. LIBRARY
  await prisma.bookTransaction.deleteMany({});
  await prisma.libraryBook.deleteMany({});
  await prisma.libraryBook.create({
    data: {
      isbn: '978-0198089241',
      title: 'NCERT Exemplar Problems & Solutions: Mathematics Class 10',
      author: 'NCERT National Editorial Board',
      category: 'Mathematics',
      publisher: 'NCERT Publishing',
      totalCopies: 40,
      availableCopies: 34,
      shelfLocation: 'Stack 4 - Shelf B',
    }
  });

  await prisma.libraryBook.create({
    data: {
      isbn: '978-8177091878',
      title: 'Wings of Fire: An Autobiography',
      author: 'Dr. A.P.J. Abdul Kalam',
      category: 'Biography',
      publisher: 'Universities Press',
      totalCopies: 15,
      availableCopies: 11,
      shelfLocation: 'Stack 1 - Shelf A',
    }
  });

  console.log('✅ Seed Completed Successfully! School ERP populated with all 18 modules and 7 roles.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
