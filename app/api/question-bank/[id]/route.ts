import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const question =
    await prisma.question_bank.findUnique({
      where: {
        id: Number(id),
      },
    });

  return NextResponse.json(question);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const question =
      await prisma.question_bank.update({
        where: {
          id: Number(id),
        },
        data: {
          subject_id: Number(body.subject_id),
          chapter_name: body.chapter_name,
          topic_name: body.topic_name,
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

    return NextResponse.json(question);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Update Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
