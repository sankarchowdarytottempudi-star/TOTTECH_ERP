import { NextResponse } from "next/server";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before loading school branding."
      );
    }

    if (!user.school_id) {
      return NextResponse.json({
        school_name:
          "TOTTECH ONE Platform",
        school_code: "PLATFORM",
        logo_url: "/images/logo.png",
        primary_color: "#04142E",
        secondary_color: "#D4AF37",
        ai_branding_name: "TOTTECH AI",
        is_platform: true,
      });
    }

    const school =
      await prisma.schools.findUnique({
        where: {
          id: Number(user.school_id),
        },
      });

    return NextResponse.json(school);
  } catch (error) {
    return apiError(
      error,
      "Failed to load school branding."
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before saving school branding."
      );
    }

    if (!user.school_id) {
      return validationError(
        "Select a specific school before saving branding."
      );
    }

    const body =
      await request.json();
    const schoolName = String(
      body.school_name ?? ""
    ).trim();
    if (!schoolName) {
      return validationError(
        "School/College name is required."
      );
    }

    const updated =
      await prisma.schools.update({
        where: {
          id: Number(user.school_id),
        },
        data: {
          school_name: schoolName,
          school_code: undefined,
          principal_name:
            body.principal_name || null,
          principal_contact:
            body.principal_contact ||
            null,
          email: body.email || null,
          phone: body.phone || null,
          website: body.website || null,
          address: body.address || null,
          city: body.city || null,
          state: body.state || null,
          country:
            body.country || "India",
          postal_code:
            body.postal_code || null,
          logo_url:
            body.logo_url || null,
          school_logo:
            body.school_logo ||
            body.logo_url ||
            null,
          favicon_url:
            body.favicon_url ||
            body.logo_url ||
            null,
          school_favicon:
            body.school_favicon ||
            body.favicon_url ||
            body.logo_url ||
            null,
          primary_color:
            body.primary_color ||
            "#04142E",
          secondary_color:
            body.secondary_color ||
            "#D4AF37",
          owner_name:
            body.owner_name || null,
          owner_contact:
            body.owner_contact || null,
          subscription_plan:
            body.subscription_plan ||
            undefined,
          subscription_status:
            body.subscription_status ||
            undefined,
          ai_branding_name:
            body.ai_branding_name ||
            null,
          updated_by:
            user.id || null,
          updated_at: new Date(),
        },
      });

    return NextResponse.json(updated);
  } catch (error) {
    return apiError(
      error,
      "Failed to save school branding."
    );
  }
}
