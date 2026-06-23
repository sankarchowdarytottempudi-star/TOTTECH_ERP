import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";

const defaultExamTypes = [
  "Weekly Test",
  "Unit Test - 1",
  "Unit Test - 2",
  "Unit Test - 3",
  "Quarterly Examination",
  "Half-Yearly Examination",
  "Annual Examination",
];

async function ensureDefaultExamTypes() {
  const existing =
    await prisma.exam_types.findMany({
      select: {
        exam_name: true,
      },
    });

  const existingNames = new Set(
    existing
      .map((row) =>
        String(row.exam_name || "")
          .trim()
          .toLowerCase()
      )
      .filter(Boolean)
  );

  const missing =
    defaultExamTypes.filter(
      (name) =>
        !existingNames.has(
          name.toLowerCase()
        )
    );

  if (!missing.length) {
    return;
  }

  await prisma.exam_types.createMany({
    data: missing.map((examName) => ({
      exam_name: examName,
      description:
        "Default exam type",
      is_active: true,
    })),
  });
}

export async function GET() {
  await ensureDefaultExamTypes();

  const exams =
    await prisma.exam_types.findMany({
      orderBy: {
        id: "asc",
      },
    });

  const defaultOrder = new Map(
    defaultExamTypes.map((name, index) => [
      name.toLowerCase(),
      index,
    ])
  );

  exams.sort((left, right) => {
    const leftOrder =
      defaultOrder.get(
        String(left.exam_name || "")
          .trim()
          .toLowerCase()
      ) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder =
      defaultOrder.get(
        String(right.exam_name || "")
          .trim()
          .toLowerCase()
      ) ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return (
      Number(left.id || 0) -
      Number(right.id || 0)
    );
  });

  return NextResponse.json(exams);
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    if (!body.exam_name) {
      return validationError(
        "Exam type name is required."
      );
    }

    const examType =
      await prisma.exam_types.create({
        data: {
          exam_name:
            body.exam_name,
          description:
            body.description ||
            null,
          is_active: true,
        },
      });

    return NextResponse.json(
      examType,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create exam type"
    );
  }
}
