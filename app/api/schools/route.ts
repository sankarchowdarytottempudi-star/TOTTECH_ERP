import { NextResponse } from "next/server";
import {
  apiError,
  validationError,
} from "@/lib/api/errors";
import {
  canManageRecord,
  managementError,
} from "@/lib/access-control";
import { getCurrentUser } from "@/lib/auth";
import { recordEvent } from "@/lib/governance/events";
import { prisma } from "@/lib/prisma";
import {
  getUserSchoolAccess,
  isSuperAdminRole,
} from "@/lib/school-access";

const parseDate = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const invalidDateRange = (
  start: Date | null,
  end: Date | null
) =>
  Boolean(
    start && end && end.getTime() <= start.getTime()
  );

export async function GET() {
  try {
    const user =
      await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Login required before loading schools.",
        },
        { status: 401 }
      );
    }
    const superAdmin =
      isSuperAdminRole(user?.role);
    const access =
      user && !superAdmin
        ? await getUserSchoolAccess(
            Number(user.id) || null,
            user.role
          )
        : [];

    const schools = await prisma.schools.findMany({
      where: superAdmin
        ? {}
        : {
            id: {
              in: access.map(
                (school) => school.id
              ),
            },
          },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch schools/colleges" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return validationError(
        "Login required before creating a school."
      );
    }

    if (
      !canManageRecord(
        user.role,
        "school",
        "create"
      )
    ) {
      return NextResponse.json(
        {
          error: managementError(
            "school",
            "create"
          ),
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();
    const schoolName = String(
      body.school_name ?? ""
    ).trim();
    const schoolCode = String(
      body.school_code ?? ""
    )
      .trim()
      .toUpperCase();
    const email = String(
      body.email ?? ""
    ).trim();
    const phone = String(
      body.phone ?? ""
    ).trim();
    const address = String(
      body.address ?? ""
    ).trim();
    const principalName = String(
      body.principal_name ?? ""
    ).trim();
    const recognitionStartDate = parseDate(
      body.recognition_start_date
    );
    const recognitionExpiryDate = parseDate(
      body.recognition_expiry_date
    );
    const affiliationStartDate = parseDate(
      body.affiliation_start_date
    );
    const affiliationExpiryDate = parseDate(
      body.affiliation_expiry_date
    );
    const normalizeText = (
      value: unknown
    ) => {
      const output = String(
        value ?? ""
      ).trim();

      return output || null;
    };

    if (!schoolName) {
      return validationError(
        "School/College name is required."
      );
    }

    if (!schoolCode) {
      return validationError(
        "School/College code is required."
      );
    }

    if (
      invalidDateRange(
        recognitionStartDate,
        recognitionExpiryDate
      )
    ) {
      return validationError(
        "Recognition expiry date must be greater than the start date."
      );
    }

    if (
      invalidDateRange(
        affiliationStartDate,
        affiliationExpiryDate
      )
    ) {
      return validationError(
        "Affiliation expiry date must be greater than the start date."
      );
    }

    const existingSchool =
      await prisma.schools.findUnique({
        where: {
          school_code: schoolCode,
        },
        select: {
          school_name: true,
          school_code: true,
        },
      });

    if (existingSchool) {
      return validationError(
        `School/College code ${schoolCode} already exists for ${existingSchool.school_name}. Use a different code or edit the existing school/college.`
      );
    }

    const school = await prisma.schools.create({
      data: {
        school_name: schoolName,
        school_code: schoolCode,
        email: email || null,
        phone: phone || null,
        address: address || null,
        logo_url:
          normalizeText(body.logo_url) ||
          normalizeText(body.school_logo),
        school_logo:
          normalizeText(
            body.school_logo
          ) ||
          normalizeText(body.logo_url),
        favicon_url:
          normalizeText(
            body.favicon_url
          ) ||
          normalizeText(
            body.school_favicon
          ) ||
          normalizeText(body.logo_url),
        school_favicon:
          normalizeText(
            body.school_favicon
          ) ||
          normalizeText(
            body.favicon_url
          ) ||
          normalizeText(body.logo_url),
        primary_color:
          normalizeText(
            body.primary_color
          ) || "#04142E",
        secondary_color:
          normalizeText(
            body.secondary_color
          ) || "#D4AF37",
        recognition_number:
          normalizeText(
            body.recognition_number
          ),
        recognition_authority:
          normalizeText(
            body.recognition_authority
          ),
        recognition_start_date:
          recognitionStartDate,
        recognition_expiry_date:
          recognitionExpiryDate,
        affiliation_number:
          normalizeText(
            body.affiliation_number
          ),
        affiliation_authority:
          normalizeText(
            body.affiliation_authority
          ),
        affiliation_start_date:
          affiliationStartDate,
        affiliation_expiry_date:
          affiliationExpiryDate,
        city: normalizeText(body.city),
        state: normalizeText(body.state),
        country:
          normalizeText(body.country) ||
          "India",
        postal_code:
          normalizeText(
            body.postal_code
          ),
        website:
          normalizeText(body.website),
        principal_name:
          principalName || null,
        principal_contact:
          normalizeText(
            body.principal_contact
          ),
        owner_name:
          normalizeText(
            body.owner_name
          ),
        owner_contact:
          normalizeText(
            body.owner_contact
          ),
        subscription_plan:
          normalizeText(
            body.subscription_plan
          ) || "BASIC",
        subscription_status:
          normalizeText(
            body.subscription_status
          ) || "ACTIVE",
        ai_branding_name:
          normalizeText(
            body.ai_branding_name
          ) ||
          `${schoolName} Assistant`,
        is_active: true,
        created_by:
          user.id || null,
      },
    });

    await recordEvent({
      school_id: school.id,
      user_id: user.id,
      actor_role: user.role,
      module_name: "schools",
      event_type: "SCHOOL_CREATED",
      action: "create",
      entity_type: "school",
      entity_id: school.id,
      summary: "School/College created",
      payload: {
        school_code: school.school_code,
        branding:
          "school/college white-label identity initialized",
      },
    });

    await prisma.user_school_access.upsert({
      where: {
        user_id_school_id: {
          user_id: Number(user.id),
          school_id: school.id,
        },
      },
      create: {
        user_id: Number(user.id),
        school_id: school.id,
        is_primary:
          !Number(user.school_id),
        is_active: true,
        created_by:
          user.id || null,
      },
      update: {
        is_active: true,
      },
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error(error);

    return apiError(
      error,
      "Failed to create school/college"
    );
  }
}
