import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolvePlatformContext } from "@/lib/api/context";

export async function GET(
  request: Request
) {
  try {
    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json([]);
    }

    const questions =
      await prisma.question_bank.findMany({
        where: {
          ...(context.schoolId
            ? {
                school_id:
                  context.schoolId,
              }
            : {}),
          ...(context.academicYearId
            ? {
                OR: [
                  {
                    academic_year_id:
                      context.academicYearId,
                  },
                  {
                    academic_year_id:
                      null,
                  },
                ],
              }
            : {}),
        },
        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(questions);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const context =
      await resolvePlatformContext(
        request
      );

    if (!context) {
      return NextResponse.json(
        {
          error:
            "Login required before creating a question.",
        },
        {
          status: 401,
        }
      );
    }

    const schoolId =
      Number(body.school_id) ||
      context.schoolId;
    const academicYearId =
      Number(body.academic_year_id) ||
      context.academicYearId;

    if (!schoolId || !academicYearId) {
      return NextResponse.json(
        {
          error:
            "Select a school and academic year before creating a question.",
        },
        {
          status: 400,
        }
      );
    }

    const question =
      await prisma.question_bank.create({
        data: {
          school_id: schoolId,
          academic_year_id:
            academicYearId,
          class_id: body.class_id
            ? Number(body.class_id)
            : null,
          section_id:
            body.section_id
              ? Number(
                  body.section_id
                )
              : null,
          subject_id: Number(
            body.subject_id
          ),

          chapter_name:
            body.chapter_name,

          topic_name:
            body.topic_name,

          learning_outcome:
            body.learning_outcome,

          difficulty_level:
            body.difficulty_level,

          bloom_level:
            body.bloom_level,

          question_type:
            body.question_type,

          question_text:
            body.question_text,

          answer_text:
            body.answer_text ||
            body.ideal_answer ||
            null,

          ideal_answer:
            body.ideal_answer ||
            body.answer_text ||
            null,

          rubric:
            body.rubric ||
            body.metadata?.rubric ||
            null,

          keywords: Array.isArray(
            body.keywords
          )
            ? body.keywords.join(", ")
            : body.keywords ||
              body.metadata?.keywords ||
              null,

          max_marks: Number(
            body.max_marks
          ),
          metadata: {
            ...(body.metadata || {}),
            rubric:
              body.rubric ||
              body.metadata?.rubric ||
              null,
            keywords: Array.isArray(
              body.keywords
            )
              ? body.keywords
              : String(
                  body.keywords ||
                    body.metadata?.keywords ||
                    ""
                )
                  .split(/[,;\n]/)
                  .map((item: string) =>
                    item.trim()
                  )
                  .filter(Boolean),
            ideal_answer:
              body.ideal_answer ||
              body.answer_text ||
              null,
          },
          created_by:
            context.user.id ||
            null,
        },
      });

    return NextResponse.json(
      question
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const body = await request.json();

    const question =
      await prisma.question_bank.update({
        where: {
          id: Number(body.id),
        },

        data: {
          chapter_name:
            body.chapter_name,

          topic_name:
            body.topic_name,

          learning_outcome:
            body.learning_outcome,

          difficulty_level:
            body.difficulty_level,

          bloom_level:
            body.bloom_level,

          question_type:
            body.question_type,

          question_text:
            body.question_text,

          answer_text:
            body.answer_text ||
            body.ideal_answer ||
            null,

          ideal_answer:
            body.ideal_answer ||
            body.answer_text ||
            null,

          rubric:
            body.rubric ||
            body.metadata?.rubric ||
            null,

          keywords: Array.isArray(
            body.keywords
          )
            ? body.keywords.join(", ")
            : body.keywords ||
              body.metadata?.keywords ||
              null,

          max_marks: Number(
            body.max_marks
          ),

          metadata: {
            ...(body.metadata || {}),
            rubric:
              body.rubric ||
              body.metadata?.rubric ||
              null,
            keywords: Array.isArray(
              body.keywords
            )
              ? body.keywords
              : String(
                  body.keywords ||
                    body.metadata?.keywords ||
                    ""
                )
                  .split(/[,;\n]/)
                  .map((item: string) =>
                    item.trim()
                  )
                  .filter(Boolean),
            ideal_answer:
              body.ideal_answer ||
              body.answer_text ||
              null,
          },
        },
      });

    return NextResponse.json(
      question
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Update Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const id =
      searchParams?.get("id");

    await prisma.question_bank.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Delete Failed" },
      { status: 500 }
    );
  }
}
