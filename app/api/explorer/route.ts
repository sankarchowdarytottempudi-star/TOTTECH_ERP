import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {

  try {

    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json([]);
    }

    const { searchParams } =
      new URL(request.url);

    const module =
      searchParams?.get("module");

    const schoolFilter =
      user.role === "SUPER_ADMIN"
        ? undefined
        : user.school_id;

    switch (module) {

      case "students":

        return NextResponse.json(
          await prisma.students.findMany({
            where: {
              school_id:
                schoolFilter,
            },
            take: 500,
            orderBy: {
              id: "desc",
            },
          })
        );

      case "teachers":

        return NextResponse.json(
          await prisma.teachers.findMany({
            where: {
              school_id:
                schoolFilter,
            },
            take: 500,
            orderBy: {
              id: "desc",
            },
          })
        );

      case "schools":

        return NextResponse.json(
          await prisma.schools.findMany({
            orderBy: {
              id: "desc",
            },
          })
        );

      case "classes":

        return NextResponse.json(
          await prisma.classes.findMany({
            where:
              schoolFilter
                ? {
                    school_id:
                      schoolFilter,
                  }
                : {},
          })
        );
        case "subjects":

  return NextResponse.json(
    await prisma.subjects.findMany({
      where: schoolFilter
        ? {
            school_id: schoolFilter,
          }
        : {},
      orderBy: {
        id: "desc",
      },
    })
  );

case "sections":

  return NextResponse.json(
    await prisma.sections.findMany({
      where: schoolFilter
        ? {
            school_id: schoolFilter,
          }
        : {},
      orderBy: {
        id: "desc",
      },
    })
  );

case "questionBank":

  return NextResponse.json(
    await prisma.question_bank.findMany({
      orderBy: {
        id: "desc",
      },
    })
  );

case "questionPapers":

  return NextResponse.json(
    await prisma.question_papers.findMany({
      orderBy: {
        id: "desc",
      },
    })
  );

case "examSchedule":

  return NextResponse.json(
    await prisma.exam_schedule.findMany({
      orderBy: {
        id: "desc",
      },
    })
  );

case "marksEntries":

  return NextResponse.json(
    await prisma.student_marks_entry.findMany({
      orderBy: {
        id: "desc",
      },
    })
  );

      default:

        return NextResponse.json([]);

    }

  } catch (error) {

    console.error(error);

    return NextResponse.json([]);

  }

}
