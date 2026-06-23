import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
} from "@/lib/governance/rbac";
import {
  normalizeSchoolBranding,
} from "@/lib/school-branding";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const auth =
    await requirePermission({
      module: "concessions",
      action: "read",
    });

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const concession =
    await prisma.concession_requests.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!concession) {
    return NextResponse.json(
      {
        error:
          "Concession not found",
      },
      {
        status: 404,
      }
    );
  }
  const school =
    concession.school_id
      ? await prisma.schools.findUnique({
          where: {
            id: Number(
              concession.school_id
            ),
          },
        })
      : null;
  const branding =
    normalizeSchoolBranding(school);

  return NextResponse.json({
    fileName: `concession-${id}.pdf`,
    contentType: "application/pdf",
    pdfPayload: {
      title:
        `${branding.schoolName} Concession Approval`,
      branding: {
        schoolName:
          branding.schoolName,
        schoolCode:
          branding.schoolCode,
        logoUrl:
          branding.logoUrl,
        primaryColor:
          branding.primaryColor,
        secondaryColor:
          branding.secondaryColor,
        address:
          school?.address,
        phone: school?.phone,
        email: school?.email,
        website: school?.website,
      },
      concession,
    },
  });
}
