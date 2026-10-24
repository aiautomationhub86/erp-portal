# 🎓 DPIS EDUCORE — Unified School & College ERP Portal

An enterprise-grade, full-stack multi-tier **School and College ERP Management System** built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

Designed for single schools, multi-branch educational institutions, CBSE / ICSE schools, international schools, and colleges.

---

## 🏛️ System Architecture

```text
                           SCHOOL / COLLEGE ERP
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       │                            │                            │
   ACADEMICS                  ADMINISTRATION                  FINANCE
       │                            │                            │
 ├── Students                 ├── Multi-Campus HR          ├── Fee Structures
 ├── Faculty & Staff          ├── User Roles & Permissions ├── Stamped Receipts
 ├── Timetable Engine         ├── Campus Assets/Inventory  ├── Outstanding Defaulters
 ├── Exam Management          ├── Transport & Fleet GPS    ├── Double-Entry Accounts
 └── Daily Attendance         └── Hostel & Warden Desk     └── Audited Reports
       │
       └──────────────────── COMMUNICATION & NOTICES
                                    │
                            AI INSIGHTS & EARLY WARNING
```

---

## 👥 Multi-Tier Role-Based Access Control (RBAC)

The system features dedicated, role-tailored dashboards and permission sets:

| Role | Primary Concerns & Capabilities | Sample Demo Login |
| :--- | :--- | :--- |
| **👑 Super Admin** | Multi-branch oversight, master settings, campus provisioning, global audit logs | `superadmin@school.edu` |
| **🏛️ Owner / Director** | High-level performance KPIs, revenue collection, outstanding balances, campus health | `director@school.edu` |
| **🎓 Principal** | Academic supervision, daily attendance oversight, faculty schedules, approvals | `principal@school.edu` |
| **👨‍🏫 Teacher / Faculty** | Assigned subject roll-call, homework dispatch, exam marks entry | `teacher.rajesh@school.edu` (or `FAC-CSE-001`) |
| **💼 Accountant** | Fee collections, stamped digital receipt issuance, outstanding recovery, daybook ledger | `accountant@school.edu` |
| **🎒 Student** | Read-only attendance record, timetable, homework submissions, report cards, fees | Roll: `10024` (or `rahul.kumar@college.edu`) |
| **👨‍👧 Parent** | Child attendance monitoring, stamped receipts, homework tracker, teacher circulars | `parent.sharma@school.edu` |
| **📚 Librarian** | Book cataloging, circulation desk, issue/return logs, fine tracking | `librarian@school.edu` |

> **Default Password for all seeded accounts**: `password123`

---

## 🚀 Key Modules & Capabilities

### 1. Daily & Subject-Wise Attendance (Module 4)
- **Faculty Class Attendance Register**: Teachers mark attendance exclusively for their assigned subjects and sections with 1-click toggles (`Present`, `Late`, `Absent`) and batch roster saves.
- **Strict Institutional Policy Enforcement**: Students and parents have a dedicated **Read-Only Academic Verification Portal** displaying overall attendance, CBSE 75% examination eligibility status, subject-wise breakdown with faculty names, and recent roll-call history. Student self-punching is strictly blocked at the backend API (`403 Forbidden`).

### 2. Fees & Stamped Digital Receipts (Module 5)
- Automated fee ledger calculation by category (Tuition, Transport, Lab, Hostel).
- Real-time generation of digitally stamped and signed fee receipts with transaction numbers.
- Outstanding fee defaulter tracking and collection analytics.

### 3. Examination & Report Cards (Module 6)
- Exam scheduling (Unit Tests, Mid-Term, Board Pre-Boards).
- Subject-wise marks and grade point calculations.
- Clean, printable student grade cards with CBSE/University grading scales.

### 4. Class Timetable Engine (Module 7)
- Dynamic weekly period allocation across days (Monday through Saturday).
- Room/Lab allocation and faculty scheduling with conflict avoidance.

### 5. Institutional Reports & Analytics Hub (Module 17)
- Executive high-level summaries for School Directors and Principals.
- Fee collection and defaulter registers with CSV exports.
- Academic pass rate, board exam readiness, and subject rankings.
- HR payroll disbursement records and teacher-student ratio compliance (1:14.6).
- Transport fleet GPS status and student route occupancy.

### 6. AI Insights & Early Warning System
- AI-driven student risk identification based on attendance drops (<75%) and academic deviations.
- Proactive early alerts for counselors, principals, and teachers.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2.5 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript 5.5
- **Database & ORM**: Prisma 5.16 with SQLite (PostgreSQL / MySQL compatible)
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Authentication**: Custom session provider with bcrypt password hashing and 1-Click quick role login

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/AiAutomationHub/erp-portal.git
cd erp-portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
To access the login portal directly, navigate to [http://localhost:3000/login](http://localhost:3000/login).

---

## 📄 License
This project is proprietary software for educational institutions and colleges. All rights reserved.
