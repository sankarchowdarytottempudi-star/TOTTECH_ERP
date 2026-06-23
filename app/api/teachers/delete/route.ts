import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const teacherId = Number(body.id);

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `
        UPDATE hr_staff_master
        SET teacher_id = NULL,
            is_active = false,
            pf_status = 'INACTIVE',
            updated_at = CURRENT_TIMESTAMP,
            notes = COALESCE(notes, '{}'::jsonb) || jsonb_build_object(
              'archived_teacher_id', $2,
              'archived_at', CURRENT_TIMESTAMP::text
            )
        WHERE teacher_id = $1
        `,
        teacherId,
        teacherId
      );

      await tx.teachers.delete({
        where: {
          id: teacherId,
        },
      });
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
