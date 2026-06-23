import { NextResponse } from "next/server";

import { requireSchoolModule } from "@/lib/module-governance";
import { resolvePlatformContext } from "@/lib/api/context";
import { issueStudentCertificate } from "@/lib/student-certificate-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireSchoolModule("STUDENTS");
  if (guard.response) {
    return guard.response;
  }

  const { id } = await params;
  const context = await resolvePlatformContext(request);
  const body = await request.json().catch(() => ({}));

  try {
    const result = await issueStudentCertificate({
      studentId: Number(id),
      certificateType: "STUDY_CERTIFICATE",
      academicYearId: context?.academicYearId ?? null,
      issueDate: body.issue_date ? new Date(body.issue_date) : new Date(),
      userId: guard.user?.id ?? null,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Study certificate error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate study certificate.",
      },
      { status: 400 }
    );
  }
}

