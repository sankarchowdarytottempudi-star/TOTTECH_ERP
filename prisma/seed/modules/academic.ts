import { prisma } from "../../../lib/prisma";

export async function createExamTypes() {

  console.log(
    "Creating Exam Types..."
  );

  const examTypes = [
    "FA1",
    "FA2",
    "SA1",
    "FA3",
    "FA4",
    "SA2",
  ];

  for (const examName of examTypes) {

    const existing =
      await prisma.exam_types.findFirst({
        where: {
          exam_name: examName,
        },
      });

    if (!existing) {

      await prisma.exam_types.create({
        data: {
          exam_name: examName,
          description:
            `${examName} Examination`,
          is_active: true,
        },
      });

    }

  }

  console.log(
    "Exam Types Created"
  );

}

export async function createExams() {

  console.log(
    "Creating Exams..."
  );

  const schools =
    await prisma.schools.findMany();

  const examTypes =
    await prisma.exam_types.findMany();

  for (const school of schools) {

    for (const examType of examTypes) {

      const existing =
        await prisma.exams.findFirst({
          where: {
            school_id:
              school.id,

            exam_name:
              examType.exam_name || "",
          },
        });

      if (existing) {
        continue;
      }

      await prisma.exams.create({
        data: {

          school_id:
            school.id,

          exam_name:
            examType.exam_name,

          exam_type:
            examType.exam_name,

          start_date:
            new Date(),

          end_date:
            new Date(),

        },
      });

    }

  }

  console.log(
    "Exams Created"
  );

}

export async function createQuestionBank() {

  console.log(
    "Creating Question Bank..."
  );

  const subjects =
    await prisma.subjects.findMany();

  const chapters = [
    "Introduction",
    "Fundamentals",
    "Applications",
    "Advanced Concepts",
    "Revision",
  ];

  const difficulty = [
    "Easy",
    "Medium",
    "Hard",
  ];

  const blooms = [
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
    "Evaluate",
  ];

  for (const subject of subjects) {

    for (
      let i = 1;
      i <= 20;
      i++
    ) {

      await prisma.question_bank.create({
        data: {

          subject_id:
            subject.id,

          chapter_name:
            chapters[
              i %
              chapters.length
            ],

          topic_name:
            `Topic ${i}`,

          learning_outcome:
            `Learning Outcome ${i}`,

          difficulty_level:
            difficulty[
              i %
              difficulty.length
            ],

          bloom_level:
            blooms[
              i %
              blooms.length
            ],

          question_type:
            i % 2 === 0
              ? "MCQ"
              : "Descriptive",

          question_text:
            `Sample Question ${i} for ${subject.subject_name}`,

          max_marks:
            5,

          created_by:
            1,

        },
      });

    }

  }

  console.log(
    "Question Bank Created"
  );

}

export async function academicPartA() {

  await createExamTypes();

  await createExams();

  await createQuestionBank();

  console.log(
    "Academic Part A Completed"
  );

}
export async function createQuestionPapers() {

  console.log(
    "Creating Question Papers..."
  );

  const classes =
    await prisma.classes.findMany();

  const subjects =
    await prisma.subjects.findMany();

  const examTypes =
    await prisma.exam_types.findMany();

  for (const cls of classes) {

    const schoolSubjects =
      subjects.filter(
        s =>
          s.school_id ===
          cls.school_id
      );

    for (const subject of schoolSubjects) {

      for (const examType of examTypes) {

        const paper =
  await prisma.question_papers.create({
    data: {

      exam_type_id:
        examType.id,

      class_id:
        cls.id,

      section_id:
        null,

      subject_id:
        subject.id,

      paper_name:
        `${examType.exam_name} ${subject.subject_name}`,

      total_marks:
        100,

      exam_date:
        new Date(),

    },
  });

        const questions =
          await prisma.question_bank.findMany({
            where: {
              subject_id:
                subject.id,
            },
            take: 10,
          });

        let order = 1;

        for (
          const question of questions
        ) {

          await prisma.question_paper_questions.create({
            data: {

              question_paper_id:
                paper.id,

              question_id:
                question.id,

              display_order:
                order,

              section_name:
                "A",

              question_marks:
                10,

              is_optional:
                false,

            },
          });

          order++;

        }

      }

    }

  }

  console.log(
    "Question Papers Created"
  );

}

export async function createExamSchedules() {

  console.log(
    "Creating Exam Schedule..."
  );

  const sections =
    await prisma.sections.findMany();

  const papers =
    await prisma.question_papers.findMany();

  for (const section of sections) {

    const sectionPapers =
      papers.filter(
        p =>
          p.class_id ===
          section.class_id
      );

    for (
      const paper of sectionPapers
    ) {

      await prisma.exam_schedule.create({
        data: {

          exam_type_id:
            paper.exam_type_id,

          question_paper_id:
            paper.id,

          class_id:
            section.class_id,

          section_id:
            section.id,

          subject_id:
            paper.subject_id,

          exam_date:
            new Date(),

          start_time:
            new Date(),

          end_time:
            new Date(),

          room_no:
            `R-${section.id}`,

          invigilator_teacher_id:
            1,

          status:
            "SCHEDULED",

        },
      });

    }

  }

  console.log(
    "Exam Schedule Created"
  );

}

export async function academicPartB() {

  await createQuestionPapers();

  await createExamSchedules();

  console.log(
    "Academic Part B Completed"
  );

}
export async function createMarks() {

  console.log(
    "Creating Marks..."
  );

  const students =
    await prisma.students.findMany();

  const subjects =
    await prisma.subjects.findMany();

  const exams =
    await prisma.exams.findMany();

  for (const student of students) {

    const schoolSubjects =
      subjects.filter(
        s =>
          s.school_id ===
          student.school_id
      );

    for (const subject of schoolSubjects) {

      for (const exam of exams.filter(
        e =>
          e.school_id ===
          student.school_id
      )) {

        let score = 0;

        const bucket =
          student.id % 100;

        if (bucket < 15) {

          score =
            90 +
            Math.floor(
              Math.random() * 10
            );

        } else if (
          bucket < 50
        ) {

          score =
            70 +
            Math.floor(
              Math.random() * 20
            );

        } else if (
          bucket < 85
        ) {

          score =
            45 +
            Math.floor(
              Math.random() * 25
            );

        } else {

          score =
            20 +
            Math.floor(
              Math.random() * 20
            );

        }

        await prisma.marks.create({
  data: {

    school_id:
      student.school_id,

    student_id:
      student.id,

    subject_id:
      subject.id,

    exam_id:
      exam.id,

    total_marks:
      100,

    obtained_marks:
      score,

    grade:
      score >= 90
        ? "A+"
        : score >= 75
        ? "A"
        : score >= 60
        ? "B"
        : score >= 40
        ? "C"
        : "F",

    remarks:
      score >= 35
        ? "PASS"
        : "FAIL",

  },
});

      }

    }

  }

  console.log(
    "Marks Created"
  );

}

export async function createStudentMarksEntries() {

  console.log(
    "Creating Student Marks Entries..."
  );

  const schedules =
    await prisma.exam_schedule.findMany();

  const students =
    await prisma.students.findMany();

  for (
    const schedule of schedules
  ) {

    const sectionStudents =
      students.filter(
        s =>
          s.section_id ===
          schedule.section_id
      );

    for (
      const student of sectionStudents
    ) {

      const score =
        30 +
        Math.floor(
          Math.random() * 70
        );

      await prisma.student_marks_entry.create({
        data: {

          student_id:
            student.id,

          exam_schedule_id:
            schedule.id,

          question_paper_id:
            schedule.question_paper_id,

          question_id:
            null,

          obtained_marks:
            score,

          max_marks:
            100,

          remarks:
            score >= 35
              ? "Pass"
              : "Fail",

        },
      });

    }

  }

  console.log(
    "Student Marks Entries Created"
  );

}

export async function createStudentExamAnalysis() {

  console.log(
    "Creating Student Exam Analysis..."
  );

  const students =
    await prisma.students.findMany();

  const papers =
    await prisma.question_papers.findMany();

  for (
    let i = 0;
    i < students.length;
    i++
  ) {

    const student =
      students[i];

    const paper =
      papers[
        i %
        papers.length
      ];

    await prisma.student_exam_analysis.create({
      data: {

        student_id:
          student.id,

        question_paper_id:
          paper.id,

        strengths:
          "Problem Solving",

        weaknesses:
          "Time Management",

        ai_recommendations:
          "Practice weekly assessments",

      },
    });

  }

  console.log(
    "Student Exam Analysis Created"
  );

}

export async function createAIStudentAnalysis() {

  console.log(
    "Creating AI Student Analysis..."
  );

  const students =
    await prisma.students.findMany();

  const subjects =
    await prisma.subjects.findMany();

  for (
    const student of students
  ) {

    const subject =
      subjects[
        student.id %
        subjects.length
      ];

    const risk =
      student.id % 10 === 0
        ? "HIGH"
        : student.id % 5 === 0
        ? "MEDIUM"
        : "LOW";

    await prisma.ai_student_analysis.create({
      data: {

        school_id:
          student.school_id,

        student_id:
          student.id,

        subject_id:
          subject.id,

        weakness_area:
          risk === "HIGH"
            ? "Mathematics"
            : "None",

        improvement_suggestion:
          risk === "HIGH"
            ? "Daily practice"
            : "Continue current strategy",

        predicted_score:
          risk === "HIGH"
            ? 45
            : 85,

        risk_level:
          risk,

      },
    });

  }

  console.log(
    "AI Student Analysis Created"
  );

}

export async function academicPartC() {

  await createMarks();

  await createStudentMarksEntries();

  await createStudentExamAnalysis();

  await createAIStudentAnalysis();

  console.log(
    "Academic Part C Completed"
  );

}
