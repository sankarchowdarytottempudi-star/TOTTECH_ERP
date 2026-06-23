import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireClinicalContext } from "@/lib/clinical/context";

type Row = Record<string, unknown>;

function shouldUseSecureCookie(
  request: Request
) {
  const proto =
    request.headers.get(
      "x-forwarded-proto"
    );

  return (
    process.env.NODE_ENV ===
      "production" &&
    (proto === "https" ||
      request.url.startsWith("https://"))
  );
}

export async function GET(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const canViewAllHospitals = [
    "tottech_super_admin",
    "clinical_super_admin",
    "organization_admin",
  ].includes(context.roleKey);

  let hospitals: Row[] = [];
  if (canViewAllHospitals) {
    hospitals = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT id, hospital_name, hospital_code, status, branding
      FROM hospitals
      WHERE tenant_id = $1
        AND COALESCE(is_deleted, false) = false
      ORDER BY hospital_name ASC
      `,
      context.tenantId
    );
  } else {
    hospitals = await prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT DISTINCT h.id, h.hospital_name, h.hospital_code, h.status, h.branding
      FROM clinical_user_profiles cup
      JOIN clinics c ON c.id = cup.clinic_id
      JOIN hospitals h ON h.id = COALESCE(cup.hospital_id, c.hospital_id)
      WHERE cup.user_id = $1
        AND COALESCE(cup.is_deleted, false) = false
        AND COALESCE(c.is_deleted, false) = false
        AND COALESCE(h.is_deleted, false) = false
      ORDER BY h.hospital_name ASC
      `,
      context.user.id ?? null
    );
  }

  const useSecureCookie =
    shouldUseSecureCookie(request);

  // If the current context.hospitalId is not present in the list
  // of accessible hospitals, pick the first available hospital
  // and update the context so subsequent queries use it.
  let shouldSetCookies = false;
  if (Array.isArray(hospitals) && hospitals.length) {
    const ids = hospitals.map((h) => Number((h as any).id));
    if (!ids.includes(Number(context.hospitalId))) {
      const first = hospitals[0] as any;
      context.hospitalId = Number(first.id);
      context.hospitalName = String(first.hospital_name || first.hospital_code || context.hospitalName || "");
      try {
        context.branding = {
          ...(context.branding || {}),
          ...(first.branding || {}),
        };
      } catch (e) {
        // ignore
      }
      context.branchId = null as any;
      context.clinicId = null as any;
      shouldSetCookies = true;
    }
  }

  const [branches, clinics, departments, menu] =
    await Promise.all([
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT id, hospital_id, branch_name, branch_code, branch_type, city, state, branding
        FROM branches
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND COALESCE(is_deleted, false) = false
        ORDER BY branch_name ASC
        `,
        context.tenantId,
        context.hospitalId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT id, hospital_id, branch_id, clinic_name, clinic_code, city, state, branding
        FROM clinics
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
        ORDER BY clinic_name ASC
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT id, hospital_id, branch_id, department_name, department_code, department_type
        FROM departments
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
        ORDER BY department_name ASC
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
      prisma.$queryRawUnsafe<Row[]>(
        `
        SELECT menu_key, label, path, module_name, permission_key, sort_order
        FROM clinical_menu_items
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
          AND COALESCE(is_enabled, true) = true
        ORDER BY sort_order ASC, label ASC
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId
      ),
    ]);

  const response = NextResponse.json({
    projectType: "CLINICAL",
    context,
    hospitals,
    branches,
    clinics,
    departments,
    menu,
  });

  if (shouldSetCookies) {
    response.cookies.set("active_hospital_id", String(context.hospitalId), {
      path: "/",
      httpOnly: false,
      secure: useSecureCookie,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
    // clear branch/clinic cookies
    response.cookies.delete("active_branch_id");
    response.cookies.delete("active_clinic_id");
  }

  return response;
}

export async function POST(
  request: Request
) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  const body = await request.json();
  const hospitalId = Number(body.hospital_id) || null;
  const branchId = Number(body.branch_id) || null;
  const clinicId = Number(body.clinic_id) || null;

  if (!hospitalId && !branchId && !clinicId) {
    return NextResponse.json(
      {
        error:
          "hospital_id, branch_id or clinic_id is required.",
      },
      { status: 400 }
    );
  }

  const canViewAllHospitals = [
    "tottech_super_admin",
    "clinical_super_admin",
    "organization_admin",
  ].includes(context.roleKey);

  const hospitalQuery = canViewAllHospitals
    ? `
      SELECT id, hospital_name, hospital_code, status, branding
      FROM hospitals
      WHERE tenant_id = $1
        AND id = $2
        AND COALESCE(is_deleted, false) = false
      LIMIT 1
      `
    : `
      SELECT DISTINCT h.id, h.hospital_name, h.hospital_code, h.status, h.branding
      FROM clinical_user_profiles cup
      JOIN clinics c ON c.id = cup.clinic_id
      JOIN hospitals h ON h.id = COALESCE(cup.hospital_id, c.hospital_id)
      WHERE cup.user_id = $1
        AND COALESCE(cup.is_deleted, false) = false
        AND COALESCE(c.is_deleted, false) = false
        AND COALESCE(h.is_deleted, false) = false
        AND h.id = $2
      LIMIT 1
      `;

  const hospitals = await prisma.$queryRawUnsafe<Row[]>(
    hospitalQuery,
    canViewAllHospitals ? context.tenantId : context.user.id,
    hospitalId
  );

  if (hospitalId && !hospitals.length) {
    return NextResponse.json(
      {
        error:
          "Requested hospital is not accessible.",
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });
  const useSecureCookie =
    shouldUseSecureCookie(request);

  if (hospitalId) {
    response.cookies.set("active_hospital_id", String(hospitalId), {
      path: "/",
      httpOnly: false,
      secure: useSecureCookie,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (branchId) {
    response.cookies.set("active_branch_id", String(branchId), {
      path: "/",
      httpOnly: false,
      secure: useSecureCookie,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    response.cookies.delete("active_branch_id");
  }

  if (clinicId) {
    response.cookies.set("active_clinic_id", String(clinicId), {
      path: "/",
      httpOnly: false,
      secure: useSecureCookie,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    response.cookies.delete("active_clinic_id");
  }

  return response;
}
