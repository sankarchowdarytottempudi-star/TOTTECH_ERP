import { prisma } from "@/lib/prisma";

export async function buildSchoolContext(
  schoolId: number
) {

  const students =
    await prisma.students.count({
      where: {
        school_id: schoolId,
      },
    });

  const teachers =
    await prisma.teachers.count({
      where: {
        school_id: schoolId,
      },
    });

  const attendance =
    await prisma.attendance_master.count({
      where: {
        school_id: schoolId,
      },
    });

  const marks =
    await prisma.student_marks_entry.findMany();

  const averageMarks =
    marks.length > 0
      ? Number(
          (
            marks.reduce(
              (sum, m) =>
                sum +
                Number(
                  m.obtained_marks || 0
                ),
              0
            ) / marks.length
          ).toFixed(2)
        )
      : 0;

  const schoolHealth =
    Math.round(
      averageMarks * 0.6 +
      40
    );

  return {

    students,

    teachers,

    attendance,

    averageMarks,

    schoolHealth,

  };

}
