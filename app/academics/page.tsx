import Link from "next/link";
import {
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  LayoutGrid,
  NotebookPen,
  PenLine,
  School,
  Users,
} from "lucide-react";

import Layout from "@/components/Layout";

const modules = [
  {
    title: "Classes",
    href: "/academics/classes",
    detail:
      "Create school/college classes and keep every academic workflow tied to the school/college.",
    icon: School,
  },
  {
    title: "Sections",
    href: "/academics/sections",
    detail:
      "Create sections under classes for student, attendance, dining, and marks filters.",
    icon: LayoutGrid,
  },
  {
    title: "Subjects",
    href: "/academics/subjects",
    detail:
      "Maintain subject master data used by exams, homework, papers, and timetables.",
    icon: BookOpen,
  },
  {
    title: "Timetable",
    href: "/academics/timetable",
    detail:
      "Plan class schedules and teacher workload by academic year.",
    icon: CalendarClock,
  },
  {
    title: "Exams",
    href: "/academics/exams",
    detail:
      "Create exams and exam types before scheduling papers and entering marks.",
    icon: GraduationCap,
    featured: true,
  },
  {
    title: "Exam Schedule",
    href: "/academics/exam-schedule",
    detail:
      "Map exams to class, section, subject, question paper, room, and invigilator.",
    icon: ClipboardCheck,
    featured: true,
  },
  {
    title: "Question Bank",
    href: "/academics/question-bank",
    detail:
      "Maintain reusable questions with marks, difficulty, topics, and answer keys.",
    icon: FileQuestion,
  },
  {
    title: "Question Papers",
    href: "/academics/question-papers",
    detail:
      "Build full question papers question by question and attach them to exams.",
    icon: NotebookPen,
    featured: true,
  },
  {
    title: "Homework",
    href: "/academics/homework",
    detail:
      "Assign class and section homework with due dates and submission tracking.",
    icon: PenLine,
  },
  {
    title: "Syllabus Planner",
    href: "/academics/syllabus",
    detail:
      "Assign syllabus to staff and define how much syllabus should be completed for each exam type.",
    icon: BookOpenCheck,
    featured: true,
  },
  {
    title: "Marks Entry",
    href: "/academics/marks-entry",
    detail:
      "Enter question-wise marks for scheduled exams and update student results.",
    icon: Users,
    featured: true,
  },
];

export default function AcademicsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black md:text-4xl">
              Academics
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Manage the full academic journey: classes, sections, subjects, exams, question papers, homework, and marks.
            </p>
          </div>
          <Link
            href="/academics/marks-entry"
            className="tt-button w-fit"
          >
            Open Marks Entry
          </Link>
        </div>

        <section className="tt-card tt-card-pad">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className={`group min-w-0 rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                    module.featured
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                        module.featured
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-950 text-white"
                      }`}
                    >
                      <Icon size={21} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-black text-slate-950">
                        {module.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {module.detail}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
