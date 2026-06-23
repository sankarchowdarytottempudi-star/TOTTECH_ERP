import { prisma } from "../../../lib/prisma";

function randomStatus() {
  const n = Math.random() * 100;

  if (n < 88) return "PRESENT";
  if (n < 95) return "ABSENT";
  if (n < 98) return "LATE";

  return "LEAVE";
}

export async function createStudentAttendance() {

  console.log(
    "Creating Student Attendance..."
  );

  const students =
    await prisma.students.findMany();

  const days = 90;

  for (const student of students) {

    for (
      let i = 0;
      i < days;
      i++
    ) {

      const date =
        new Date();

      date.setDate(
        date.getDate() - i
      );

      const status =
        randomStatus();

      await prisma.attendance.create({
        data: {

          school_id:
            student.school_id,

          student_id:
            student.id,

          attendance_date:
            date,

          status,

          remarks:
            status === "ABSENT"
              ? "Not Attended"
              : null,

        },
      });

      await prisma.attendance_master.create({
        data: {

          school_id:
            student.school_id,

          class_id:
            null,

          section_id:
            student.section_id,

          student_id:
            student.id,

          attendance_date:
            date,

          status,

          remarks:
            null,

        },
      });

    }

  }

  console.log(
    "Student Attendance Created"
  );

}

export async function createTeacherAttendance() {

  console.log(
    "Creating Teacher Attendance..."
  );

  const teachers =
    await prisma.teachers.findMany();

  const days = 90;

  for (const teacher of teachers) {

    for (
      let i = 0;
      i < days;
      i++
    ) {

      const date =
        new Date();

      date.setDate(
        date.getDate() - i
      );

      const n =
        Math.random() * 100;

      const status =
        n < 93
          ? "PRESENT"
          : n < 97
          ? "LEAVE"
          : "ABSENT";

      await prisma.teacher_attendance.create({
        data: {

          teacher_id:
            teacher.id,

          attendance_date:
            date,

          status,

          remarks:
            null,

        },
      });

    }

  }

  console.log(
    "Teacher Attendance Created"
  );

}

export async function attendanceSeed() {

  await createStudentAttendance();

  await createTeacherAttendance();

  console.log(
    "Attendance Module Completed"
  );

}
