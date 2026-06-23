import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  requireCurrentUser,
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
    await requireCurrentUser();

  if (auth.response) {
    return auth.response;
  }

  const { id } = await params;
  const invoice =
    await prisma.invoices.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!invoice) {
    return NextResponse.json(
      {
        error:
          "Invoice not found",
      },
      {
        status: 404,
      }
    );
  }
  const school =
    invoice.school_id
      ? await prisma.schools.findUnique({
          where: {
            id: Number(
              invoice.school_id
            ),
          },
        })
      : null;
  const branding =
    normalizeSchoolBranding(school);

  return NextResponse.json({
    fileName: `invoice-${id}.pdf`,
    contentType: "application/pdf",
    pdfPayload: {
      title: `${branding.schoolName} Invoice`,
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
      invoice,
    },
  });
}
