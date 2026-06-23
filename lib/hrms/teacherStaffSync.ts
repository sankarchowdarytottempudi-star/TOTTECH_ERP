import { prisma } from "@/lib/prisma";
import { nextEmployeeId } from "@/lib/hrms";

export type TeacherSyncInput = {
  teacherId: number;
  schoolId: number;
  academicYearId?: number | null;
  employeeId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  department?: string | null;
  designation?: string | null;
  qualification?: string | null;
  experienceYears?: unknown;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  salary?: unknown;
  isActive?: boolean;
  createdBy?: number | null;
  updatedBy?: number | null;
};

async function getSchoolCode(schoolId: number) {
  const school = await prisma.schools.findUnique({
    where: { id: schoolId },
    select: { school_code: true },
  });

  return school?.school_code || "SCH";
}

export async function ensureTeacherEmployeeId(
  schoolId: number,
  employeeId?: string | null
) {
  const cleaned = String(employeeId || "").trim();
  if (cleaned) {
    return cleaned;
  }

  const schoolCode = await getSchoolCode(schoolId);
  return nextEmployeeId(schoolCode);
}

export async function syncTeacherToStaff(
  input: TeacherSyncInput
) {
  const employeeId = await ensureTeacherEmployeeId(
    input.schoolId,
    input.employeeId
  );

  const existing = await prisma.hr_staff_master.findFirst({
    where: {
      OR: [
        { teacher_id: input.teacherId },
        { employee_id: employeeId },
      ],
    },
    select: { id: true },
  });

  const staffData = {
    school_id: input.schoolId,
    academic_year_id: input.academicYearId ?? null,
    teacher_id: input.teacherId,
    employee_id: employeeId,
    employee_number: employeeId,
    first_name: input.firstName || null,
    last_name: input.lastName || null,
    department: input.department || null,
    designation: input.designation || null,
    qualification: input.qualification || null,
    experience_years:
      input.experienceYears == null
        ? null
        : Number(input.experienceYears),
    mobile: input.phone || null,
    email: input.email || null,
    address: input.address || null,
    basic_salary:
      input.salary == null ? null : Number(input.salary),
    da: 0,
    pf_wage:
      input.salary == null ? null : Number(input.salary),
    pf_applicable: true,
    eps_applicable: true,
    pf_status: input.isActive === false ? "INACTIVE" : "ACTIVE",
    is_active: input.isActive !== false,
    created_by: input.createdBy ?? null,
    updated_by: input.updatedBy ?? null,
    updated_at: new Date(),
  } as const;

  const staff = existing
    ? await prisma.hr_staff_master.update({
        where: { id: existing.id },
        data: staffData,
      })
    : await prisma.hr_staff_master.create({
        data: staffData,
      });

  await prisma.teachers.update({
    where: { id: input.teacherId },
    data: {
      staff_id: staff.id,
      employee_id: employeeId,
      updated_at: new Date(),
    },
  });

  return { staff, employeeId };
}

export async function archiveTeacherStaff(
  teacherId: number,
  notes: Record<string, unknown> = {}
) {
  const staff = await prisma.hr_staff_master.findFirst({
    where: { teacher_id: teacherId },
    select: { id: true, notes: true },
  });

  if (!staff) {
    return null;
  }

  return prisma.hr_staff_master.update({
    where: { id: staff.id },
    data: {
      teacher_id: null,
      is_active: false,
      pf_status: "INACTIVE",
      updated_at: new Date(),
      notes: {
        ...(staff.notes && typeof staff.notes === "object"
          ? (staff.notes as Record<string, unknown>)
          : {}),
        ...notes,
        archived_at: new Date().toISOString(),
      },
    },
  });
}
