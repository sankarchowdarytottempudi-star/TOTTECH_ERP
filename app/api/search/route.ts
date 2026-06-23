import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request
) {
  try {

    const user =
      await getCurrentUser();

    if (!user) {

      return NextResponse.json({
        students: [],
        teachers: [],
        schools: [],
        classes: [],
      });

    }

    const { searchParams } =
      new URL(request.url);

    const q =
      searchParams
        .get("q")
        ?.trim() || "";

    if (!q) {

      return NextResponse.json({
        students: [],
        teachers: [],
        schools: [],
        classes: [],
      });

    }

    const schoolFilter =
      user.role === "SUPER_ADMIN"
        ? undefined
        : user.school_id;

    const students =
      await prisma.students.findMany({
        where: {

          school_id:
            schoolFilter,

          OR: [

            {
              first_name: {
                contains: q,
                mode:
                  "insensitive",
              },
            },

            {
              last_name: {
                contains: q,
                mode:
                  "insensitive",
              },
            },

            {
              admission_number: {
                contains: q,
                mode:
                  "insensitive",
              },
            },

            {
              phone: {
                contains: q,
              },
            },

          ],

        },

        take: 10,

        orderBy: {
          id: "desc",
        },

      });

    const teachers =
      await prisma.teachers.findMany({
        where: {

          school_id:
            schoolFilter,

          OR: [

            {
              first_name: {
                contains: q,
                mode:
                  "insensitive",
              },
            },

            {
              last_name: {
                contains: q,
                mode:
                  "insensitive",
              },
            },

            {
              employee_id: {
                contains: q,
                mode:
                  "insensitive",
              },
            },

          ],

        },

        take: 10,

        orderBy: {
          id: "desc",
        },

      });

    const classes =
      await prisma.classes.findMany({

        where: {

          school_id:
            schoolFilter,

          class_name: {
            contains: q,
            mode:
              "insensitive",
          },

        },

        take: 10,

      });

    const schools =
      user.role ===
      "SUPER_ADMIN"

        ? await prisma.schools.findMany({
            where: {
              school_name: {
                contains: q,
                mode:
                  "insensitive",
              },
            },
            take: 10,
          })

        : [];

    return NextResponse.json({

      students,

      teachers,

      schools,

      classes,

    });

  } catch (error) {

    console.error(
      "Search Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Search Failed",
      },
      {
        status: 500,
      }
    );

  }
}
