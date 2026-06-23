import "dotenv/config";
import { prisma } from "../../lib/prisma";
import {
  academicPartA,
  academicPartB,
  academicPartC,
} from "./modules/academic";
import {
  attendanceSeed,
} from "./modules/attendance";
import {
  financePartA,
  financePartB,
} from "./modules/finance";
async function cleanup() {

  console.log(
    "Cleaning demo data..."
  );

  // Child tables first

  await prisma.student_marks_entry.deleteMany();
await prisma.student_exam_analysis.deleteMany();

await prisma.ai_student_analysis.deleteMany();

await prisma.exam_schedule.deleteMany();

await prisma.question_paper_questions.deleteMany();

await prisma.question_papers.deleteMany();

await prisma.question_bank.deleteMany();

await prisma.marks.deleteMany();

await prisma.exams.deleteMany();

await prisma.exam_types.deleteMany();
  await prisma.attendance.deleteMany();

  await prisma.hostel_students.deleteMany();

  await prisma.transport_assignments.deleteMany();

  // Fee tables

  try {
    await prisma.fee_payments.deleteMany();
  } catch {}

  try {
    await prisma.invoices.deleteMany();
  } catch {}

  try {
    await prisma.fees.deleteMany();
  } catch {}

  try {
    await prisma.fee_categories.deleteMany();
  } catch {}

  // Master tables

  await prisma.students.deleteMany();

  await prisma.teachers.deleteMany();

  await prisma.sections.deleteMany();

  await prisma.classes.deleteMany();
try {
  await prisma.marks.deleteMany();
} catch {}

try {
  await prisma.ai_student_analysis.deleteMany();
} catch {}

try {
  await prisma.exam_schedule.deleteMany();
} catch {}

try {
  await prisma.question_papers.deleteMany();
} catch {}

try {
  await prisma.question_bank.deleteMany();
} catch {}
  await prisma.subjects.deleteMany();

  await prisma.academic_years.deleteMany();

  console.log(
    "Cleanup completed"
  );

}

async function createSchools() {

  console.log("Creating schools...");

  let kakatheeya =
    await prisma.schools.findFirst({
      where: {
        school_code: "KAK001",
      },
    });

  if (!kakatheeya) {

    kakatheeya =
      await prisma.schools.create({
        data: {
          school_name:
            "Kakatheeya High School",
          school_code:
            "KAK001",
          address:
            "Warangal",
         phone:
            "9000000001",
          email:
            "admin@kakatheeya.edu",
          is_active: true,
        },
      });

  }

  let grc =
    await prisma.schools.findFirst({
      where: {
        school_code: "GRC001",
      },
    });

  if (!grc) {

    grc =
      await prisma.schools.create({
        data: {
          school_name:
            "GRC Junior College",
          school_code:
            "GRC001",
          address:
            "Hanamkonda",
         phone:
            "9000000002",
          email:
            "admin@grc.edu",
          is_active: true,
        },
      });

  }

  return {
    kakatheeya,
    grc,
  };
}

async function createAcademicYears(
  schoolId: number
) {

  await prisma.academic_years.create({
    data: {
      school_id: schoolId,
      academic_year:
        "2025-2026",
      is_current: true,
      start_date:
        new Date("2025-06-01"),
      end_date:
        new Date("2026-04-30"),
    },
  });

}

async function createSchoolClasses(
  schoolId: number
) {

  const classes = [];

  for (
    let i = 1;
    i <= 10;
    i++
  ) {

    const cls =
      await prisma.classes.create({
        data: {
          school_id:
            schoolId,
          class_name:
            `Class ${i}`,
        },
      });

    classes.push(cls);

  }

  return classes;
}

async function createCollegeClasses(
  schoolId: number
) {

  const names = [

    "First Year MPC",
    "First Year BiPC",
    "First Year CEC",
    "First Year MEC",

    "Second Year MPC",
    "Second Year BiPC",
    "Second Year CEC",
    "Second Year MEC",

  ];

  const classes = [];

  for (const name of names) {

    const cls =
      await prisma.classes.create({
        data: {
          school_id:
            schoolId,
          class_name:
            name,
        },
      });

    classes.push(cls);

  }

  return classes;
}

async function createSchoolSections(
  classes: any[]
) {

  const sections = [];

  for (const cls of classes) {

    for (
      const sectionName of
      ["A", "B", "C", "D"]
    ) {

      const section =
        await prisma.sections.create({
          data: {
            school_id:
              cls.school_id,
            class_id:
              cls.id,
            section_name:
              sectionName,
          },
        });

      sections.push(section);

    }

  }

  return sections;
}

async function createCollegeSections(
  classes: any[]
) {

  const sections = [];

  for (const cls of classes) {

    const name =
      cls.class_name;

    let sectionNames =
      ["A"];

    if (
      name.includes("MPC")
    ) {
      sectionNames =
        ["A", "B", "C"];
    }

    if (
      name.includes("CEC")
    ) {
      sectionNames =
        ["A", "B"];
    }

    for (
      const sectionName
      of sectionNames
    ) {

      const section =
        await prisma.sections.create({
          data: {
            school_id:
              cls.school_id,
            class_id:
              cls.id,
            section_name:
              sectionName,
          },
        });

      sections.push(section);

    }

  }

  return sections;
}

async function createSubjects(
  schoolId: number,
  isCollege = false
) {

  let subjects: string[] =
    [];

  if (!isCollege) {

    subjects = [

      "English",
      "Mathematics",
      "Science",
      "Social",
      "Hindi",
      "Telugu",
      "Computers",

    ];

  } else {

    subjects = [

      "Physics",
      "Chemistry",
      "Mathematics",
      "Botany",
      "Zoology",
      "Economics",
      "Commerce",
      "Civics",

    ];

  }

  for (
    const subjectName
    of subjects
  ) {

    await prisma.subjects.create({
      data: {
        school_id:
          schoolId,
        subject_name:
          subjectName,
      },
    });

  }

}
async function createTeachers(
  schoolId: number,
  schoolName: string
) {

  console.log(
    `Creating staff for ${schoolName}`
  );

  let teacherCount = 0;

  if (
    schoolName.includes(
      "Kakatheeya"
    )
  ) {

    teacherCount = 55;

  } else {

    teacherCount = 25;

  }

  for (
    let i = 1;
    i <= teacherCount;
    i++
  ) {

    await prisma.teachers.create({
      data: {

        school_id:
          schoolId,

        employee_id:
          `${schoolName
            .substring(0,3)
            .toUpperCase()}-T-${i}`,

        first_name:
          `Teacher${i}`,

        last_name:
          "Demo",

        gender:
          i % 2 === 0
            ? "Male"
            : "Female",

        phone:
          `90000${String(i)
            .padStart(
              5,
              "0"
            )}`,

        email:
          `teacher${i}@${schoolName
            .replaceAll(
              " ",
              ""
            )
            .toLowerCase()}.com`,

        qualification:
          "M.Ed",

        experience_years:
          Math.floor(
            Math.random() * 15
          ) + 1,

        joining_date:
          new Date(
            "2023-06-01"
          ),

        salary:
          35000 +

          Math.floor(
            Math.random() *
            25000
          ),

        department:
          "Academics",

        designation:
          "Teacher",

        address:
          "Warangal",

        is_active:
          true,

      },
    });

  }

  const principalCount =
    schoolName.includes(
      "Kakatheeya"
    )
      ? 3
      : 1;

  for (
    let i = 1;
    i <= principalCount;
    i++
  ) {

    await prisma.teachers.create({
      data: {

        school_id:
          schoolId,

        employee_id:
          `${schoolName
            .substring(0,3)
            .toUpperCase()}-P-${i}`,

        first_name:
          `Principal${i}`,

        last_name:
          "Demo",

        qualification:
          "M.Ed",

        experience_years:
          15,

        joining_date:
          new Date(
            "2020-06-01"
          ),

        salary:
          90000,

        department:
          "Administration",

        designation:
          "Principal",

        address:
          "Warangal",

        is_active:
          true,

      },
    });

  }

  const accountantCount =
    schoolName.includes(
      "Kakatheeya"
    )
      ? 3
      : 2;

  for (
    let i = 1;
    i <= accountantCount;
    i++
  ) {

    await prisma.teachers.create({
      data: {

        school_id:
          schoolId,

        employee_id:
          `${schoolName
            .substring(0,3)
            .toUpperCase()}-A-${i}`,

        first_name:
          `Account${i}`,

        last_name:
          "Demo",

        qualification:
          "B.Com",

        experience_years:
          5,

        joining_date:
          new Date(
            "2022-06-01"
          ),

        salary:
          40000,

        department:
          "Finance",

        designation:
          "Accountant",

        address:
          "Warangal",

        is_active:
          true,

      },
    });

  }

  const driverCount =
    schoolName.includes(
      "Kakatheeya"
    )
      ? 5
      : 3;

  for (
    let i = 1;
    i <= driverCount;
    i++
  ) {

    await prisma.teachers.create({
      data: {

        school_id:
          schoolId,

        employee_id:
          `${schoolName
            .substring(0,3)
            .toUpperCase()}-D-${i}`,

        first_name:
          `Driver${i}`,

        last_name:
          "Demo",

        qualification:
          "SSC",

        experience_years:
          10,

        joining_date:
          new Date(
            "2021-06-01"
          ),

        salary:
          25000,

        department:
          "Transport",

        designation:
          "Driver",

        address:
          "Warangal",

        is_active:
          true,

      },
    });

  }

  console.log(
    `Staff created for ${schoolName}`
  );

}
async function createStudents(
  schoolId: number,
  schoolName: string
) {

  console.log(
    `Creating students for ${schoolName}`
  );

  const sections =
    await prisma.sections.findMany({
      where: {
        school_id: schoolId,
      },
      include: {
        classes: true,
      },
    });

  let studentCounter = 1;

  for (const section of sections) {

    let countPerSection = 40;

    if (
      schoolName.includes("GRC")
    ) {
      countPerSection = 50;
    }

    for (
      let i = 1;
      i <= countPerSection;
      i++
    ) {

      const gender =
        i % 2 === 0
          ? "Male"
          : "Female";

      const firstName =
        `${gender === "Male"
          ? "Rahul"
          : "Priya"}${studentCounter}`;

      await prisma.students.create({
        data: {

          school_id:
            schoolId,

          section_id:
            section.id,

          admission_number:
            `${schoolId}ADM${String(
              studentCounter
            ).padStart(
              5,
              "0"
            )}`,

          enrollment_number:
            `${schoolId}ENR${String(
              studentCounter
            ).padStart(
              5,
              "0"
            )}`,

          roll_number:
            String(i),

          first_name:
            firstName,

          last_name:
            "Demo",

          name:
            `${firstName} Demo`,

          gender,

          dob:
            new Date(
              2010,
              studentCounter % 12,
              (studentCounter % 28) + 1
            ),

          admission_date:
            new Date(
              "2024-06-01"
            ),

          phone:
            `9${String(
              100000000 +
              studentCounter
            )}`,

          email:
            `student${studentCounter}@demo.com`,

          father_name:
            `Father ${studentCounter}`,

          mother_name:
            `Mother ${studentCounter}`,

          father_phone:
            `8${String(
              100000000 +
              studentCounter
            )}`,

          mother_phone:
            `7${String(
              100000000 +
              studentCounter
            )}`,

          father_occupation:
            "Business",

          mother_occupation:
            "Teacher",

          address:
            "Warangal",

          city:
            "Warangal",

          state:
            "Telangana",

          country:
            "India",

          blood_group:
            "O+",

          religion:
            "Hindu",

          category:
            "General",

          medium:
            "English",

          is_active:
            true,

          transport_required:
            studentCounter % 3 === 0,

          hostel_required:
            studentCounter % 10 === 0,

          school_name:
            schoolName,

          school_class:
            section.classes?.class_name,

        },
      });

      studentCounter++;

    }

  }

  console.log(
    `Students created for ${schoolName}`
  );

}
async function main() {

  await cleanup();

  const {
    kakatheeya,
    grc,
  } =
    await createSchools();

  await createAcademicYears(
    kakatheeya.id
  );

  await createAcademicYears(
    grc.id
  );

  const schoolClasses =
    await createSchoolClasses(
      kakatheeya.id
    );

  const collegeClasses =
    await createCollegeClasses(
      grc.id
    );

  await createSchoolSections(
    schoolClasses
  );

  await createCollegeSections(
    collegeClasses
  );

  await createSubjects(
    kakatheeya.id,
    false
  );

  await createSubjects(
    grc.id,
    true
  );

  await createTeachers(
  kakatheeya.id,
  kakatheeya.school_name
);

await createTeachers(
  grc.id,
  grc.school_name
);
await createStudents(
  kakatheeya.id,
  kakatheeya.school_name
);

await createStudents(
  grc.id,
  grc.school_name
);

await academicPartA();

await academicPartB();

await academicPartC();

await attendanceSeed();

console.log(
  "Part 5 Attendance Completed"
);
await financePartA();

console.log(
  "Part 6 Finance A Completed"
);
await financePartB();

console.log(
  "Part 7 Finance B Completed"
);

}   // closes main()

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {

    console.error(e);

    await prisma.$disconnect();

    process.exit(1);

  });
