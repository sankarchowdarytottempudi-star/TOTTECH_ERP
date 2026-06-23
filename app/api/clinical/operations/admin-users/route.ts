import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import {
  clinicalRoleKey,
  ensureClinicalRoleRecord,
  ensureClinicalOperationalRoles,
} from "@/lib/clinical/role-governance";
import { nullableText, serialize, text } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const roleMap: Record<string, string> = {
  "Front Desk": "receptionist",
  Reception: "receptionist",
  Receptionist: "receptionist",
  Vitals: "vitals",
  "Vital Team": "vital_team",
  Doctor: "doctor",
  Doctors: "doctor",
  Nurse: "nurse",
  "Lab Technician": "lab_technician",
  Lab: "lab_technician",
  Pharmacist: "pharmacist",
  Pharmacy: "pharmacist",
  ICU: "icu_staff",
  "ICU Staff": "icu_staff",
  OT: "ot_staff",
  "OT Staff": "ot_staff",
  Finance: "finance_user",
  "Finance User": "finance_user",
  Admin: "hospital_admin",
  "Hospital Admin": "hospital_admin",
  Owner: "hospital_owner",
  "Hospital Owner": "hospital_owner",
  Auditor: "auditor",
};

const humanizeRole = (roleKey: string) =>
  String(roleKey || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (value) =>
      value.toUpperCase()
    );

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;
  await ensureClinicalOperationalRoles({
    tenantId: context.tenantId,
    hospitalId: context.hospitalId,
    branchId: context.branchId,
    clinicId: context.clinicId,
    user: { id: context.user.id ?? null },
  });
  const { searchParams } = new URL(request.url);
  const includeDeleted =
    searchParams?.get("deleted") === "true";

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.role,
      u.status,
      u.is_active,
      COALESCE(u.is_deleted,false) AS is_deleted,
      u.deleted_at,
      deleter.full_name AS deleted_by_name,
      cup.display_name,
      cup.settings,
      cr.role_name,
      cr.role_key,
      dep.department_name,
      cup.created_at
    FROM clinical_user_profiles cup
    JOIN users u ON u.id = cup.user_id
    LEFT JOIN users deleter ON deleter.id = u.deleted_by
    LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
    LEFT JOIN departments dep ON dep.id = cup.department_id
    WHERE cup.tenant_id = $1
      AND cup.hospital_id = $2
      AND cup.branch_id = $3
      AND (
        ($4::boolean = true AND (COALESCE(cup.is_deleted,false) = true OR COALESCE(u.is_deleted,false) = true))
        OR
        ($4::boolean = false AND COALESCE(cup.is_deleted,false) = false AND COALESCE(u.is_deleted,false) = false)
      )
    ORDER BY cup.created_at DESC, cup.id DESC
    LIMIT 300
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    includeDeleted
  );

  return NextResponse.json(serialize({ rows }));
}

export async function POST(request: Request) {
  try {
    const auth = await requireClinicalContext(request);
    if (auth.response) return auth.response;
    const context = auth.context!;
    await ensureClinicalOperationalRoles({
      tenantId: context.tenantId,
      hospitalId: context.hospitalId,
      branchId: context.branchId,
      clinicId: context.clinicId,
      user: { id: context.user.id ?? null },
    });
    const body = await request.json();
    const name = text(body.name);
    const username = text(body.username) || text(body.email);
    const password = text(body.password);
    const roleLabel = text(body.role) || "Front Desk";
    const roleKey = clinicalRoleKey(
      roleMap[roleLabel] || roleLabel
    );
    const roleDisplayLabel = humanizeRole(roleKey);

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Name, username/email and password are required." },
        { status: 400 }
      );
    }

    const roleRow =
      (await ensureClinicalRoleRecord(context, roleKey, roleLabel)) ||
      null;
    const roleId = Number(roleRow?.id || 0);

    if (!roleId) {
      return NextResponse.json(
        { error: `Role ${roleLabel} is not configured for this hospital.` },
        { status: 400 }
      );
    }
    const hashed = await bcrypt.hash(password, 10);
    const userRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO users (school_id, full_name, email, username, platform_type, status, phone, password_hash, role, is_active, created_at)
      VALUES (NULL,$1,$2,$3,'CLINICAL',$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)
      RETURNING id, full_name, email, phone, role, is_active
      `,
      name,
      username,
      username.split("@")[0].toLowerCase(),
      text(body.status) === "Inactive" ? "INACTIVE" : "ACTIVE",
      nullableText(body.mobile),
      hashed,
      roleKey.toUpperCase(),
      text(body.status) !== "Inactive"
    );

    const user = userRows[0];
    const profileRows = await prisma.$queryRawUnsafe<Row[]>(
      `
      INSERT INTO clinical_user_profiles (
        tenant_id,hospital_id,branch_id,clinic_id,user_id,clinical_role_id,department_id,
        project_type,display_name,settings,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,NULL,'tottech_clinical_services',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId,
      context.clinicId,
      user.id,
      roleId,
      name,
      JSON.stringify({
        employee_id: nullableText(body.employee_id),
        department: nullableText(body.department),
        role_label: roleDisplayLabel,
        status: text(body.status) || "Active",
      }),
      context.user.id ?? null
    );

    if (roleKey === "doctor") {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO doctors (
          tenant_id,hospital_id,branch_id,clinic_id,user_id,doctor_uid,full_name,
          specialization,phone,email,consultation_fee,status,created_by,updated_by,created_at,updated_at,is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,0,'AVAILABLE',$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        ON CONFLICT (doctor_uid) DO NOTHING
        `,
        context.tenantId,
        context.hospitalId,
        context.branchId,
        context.clinicId,
        user.id,
        nullableText(body.employee_id) || `DOC-${user.id}`,
        name,
        nullableText(body.department),
        nullableText(body.mobile),
        username,
        context.user.id ?? null
      );
    }

    await recordClinicalAudit(context, {
      moduleName: "clinical_admin_users",
      action: "create",
      entityType: "users",
      entityId: Number(user.id),
      summary: "Clinical operational user created",
      payload: { user, profile: profileRows[0] },
    });

    return NextResponse.json(serialize({ user, profile: profileRows[0] }), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user.";
    if (message.includes("duplicate key value violates unique constraint") || message.includes("Unique constraint failed")) {
      return NextResponse.json({ error: "A user with the same email or username already exists in this hospital." }, { status: 409 });
    }
    if (message.includes("clinical_roles") || message.includes("Role")) {
      return NextResponse.json({ error: "Selected role is not configured for this hospital." }, { status: 400 });
    }
    console.error("Clinical admin user create failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function PATCH(
  request: Request
) {
  try {
    const auth = await requireClinicalContext(request);
    if (auth.response) return auth.response;
    const context = auth.context!;
    await ensureClinicalOperationalRoles({
      tenantId: context.tenantId,
      hospitalId: context.hospitalId,
      branchId: context.branchId,
      clinicId: context.clinicId,
      user: { id: context.user.id ?? null },
    });
    const body = await request.json();
    const id = Number(body.id);
    const action = text(body.action);

  if (!id) {
    return NextResponse.json(
      { error: "User id is required." },
      { status: 400 }
    );
  }

  if (action === "ACTIVATE" || action === "DEACTIVATE") {
    const isActive = action === "ACTIVATE";
    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE users
      SET is_active = $2,
          status = $3
      WHERE id = $1
        AND COALESCE(is_deleted,false) = false
      RETURNING id, full_name, email, phone, role, is_active
      `,
      id,
      isActive,
      isActive ? "ACTIVE" : "INACTIVE"
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    await prisma.$executeRawUnsafe(
      `
      UPDATE clinical_user_profiles
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{status}',
        to_jsonb($2::text),
        true
      ),
      updated_by = $3,
      updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
        AND COALESCE(is_deleted,false) = false
      `,
      id,
      isActive ? "Active" : "Inactive",
      context.user.id ?? null
    );

    await recordClinicalAudit(context, {
      moduleName: "admin_users",
      action: isActive ? "activate" : "deactivate",
      entityType: "users",
      entityId: id,
      summary: `Clinical operational user ${isActive ? "activated" : "deactivated"}`,
      payload: rows[0],
    });

    return NextResponse.json(serialize({ user: rows[0] }));
  }

  if (action === "LOCK" || action === "ARCHIVE") {
    const targetStatus = action;
    const rows = await prisma.$queryRawUnsafe<Row[]>(
      `
      UPDATE users
      SET is_active = false,
          status = $2
      WHERE id = $1
        AND COALESCE(is_deleted,false) = false
      RETURNING id, full_name, email, phone, role, is_active, status
      `,
      id,
      targetStatus
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    await recordClinicalAudit(context, {
      moduleName: "admin_users",
      action: targetStatus.toLowerCase(),
      entityType: "users",
      entityId: id,
      summary: `Clinical operational user ${targetStatus.toLowerCase()}`,
      payload: rows[0],
    });

    return NextResponse.json(serialize({ user: rows[0] }));
  }

  if (action === "DELETE") {
    const profileRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        UPDATE clinical_user_profiles
        SET is_deleted = true,
            updated_by = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
          AND tenant_id = $3
          AND hospital_id = $4
          AND branch_id = $5
        RETURNING *
        `,
        id,
        context.user.id ?? null,
        context.tenantId,
        context.hospitalId,
        context.branchId
      );

    const userRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        UPDATE users
        SET is_active = false,
            status = 'ARCHIVED',
            is_deleted = true,
            deleted_at = CURRENT_TIMESTAMP,
            deleted_by = $2
        WHERE id = $1
        RETURNING id, full_name, email, phone, role, is_active, status, is_deleted, deleted_at
        `,
        id,
        context.user.id ?? null
      );

    await recordClinicalAudit(context, {
      moduleName: "admin_users",
      action: "delete",
      entityType: "users",
      entityId: id,
      summary: "Clinical operational user deleted",
      payload: { user: userRows[0], profile: profileRows[0] },
    });

    return NextResponse.json({ success: true });
  }

  if (action === "RESTORE") {
    const userRows =
      await prisma.$queryRawUnsafe<Row[]>(
        `
        UPDATE users
        SET is_deleted = false,
            deleted_at = NULL,
            deleted_by = NULL,
            status = 'INACTIVE',
            is_active = false
        WHERE id = $1
        RETURNING id, full_name, email, phone, role, is_active, status, is_deleted
        `,
        id
      );

    if (!userRows.length) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    await prisma.$executeRawUnsafe(
      `
      UPDATE clinical_user_profiles
      SET is_deleted = false,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
        AND tenant_id = $3
        AND hospital_id = $4
        AND branch_id = $5
      `,
      id,
      context.user.id ?? null,
      context.tenantId,
      context.hospitalId,
      context.branchId
    );

    await recordClinicalAudit(context, {
      moduleName: "admin_users",
      action: "restore",
      entityType: "users",
      entityId: id,
      summary: "Clinical operational user restored",
      payload: userRows[0],
    });

    return NextResponse.json(
      serialize({ user: userRows[0] })
    );
  }

  if (action === "PERMANENT_DELETE") {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(
          `
          DELETE FROM clinical_user_profiles
          WHERE user_id = $1
            AND tenant_id = $2
            AND hospital_id = $3
            AND branch_id = $4
            AND COALESCE(is_deleted,false) = true
          `,
          id,
          context.tenantId,
          context.hospitalId,
          context.branchId
        );
        await tx.$executeRawUnsafe(
          `
          DELETE FROM users
          WHERE id = $1
            AND COALESCE(is_deleted,false) = true
          `,
          id
        );
      });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            "Permanent delete blocked because this user is referenced by clinical records or audit history. Keep the user archived.",
        },
        { status: 409 }
      );
    }

    await recordClinicalAudit(context, {
      moduleName: "admin_users",
      action: "permanent_delete",
      entityType: "users",
      entityId: id,
      summary: "Clinical operational user permanently deleted",
      payload: { userId: id },
    });

    return NextResponse.json({ success: true });
  }

  const roleLabel = text(body.role) || "Front Desk";
  const roleKey = clinicalRoleKey(
    roleMap[roleLabel] || roleLabel
  );
  const roleDisplayLabel = humanizeRole(roleKey);

  const roleRow =
    (await ensureClinicalRoleRecord(context, roleKey, roleLabel)) ||
    null;
  const roleId = roleRow?.id ? Number(roleRow.id) : null;
  const passwordHash = body.password
    ? await bcrypt.hash(body.password, 10)
    : null;

  const userRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE users
    SET full_name = $2,
        email = $3,
        phone = $4,
        role = $5,
        is_active = $6
        ${passwordHash ? ", password_hash = $7" : ""}
    WHERE id = $1
    RETURNING id, full_name, email, phone, role, is_active
    `,
    ...[
      id,
      text(body.name),
      text(body.email),
      nullableText(body.mobile),
      roleKey.toUpperCase(),
      text(body.status) !== "Inactive",
      ...(passwordHash ? [passwordHash] : []),
    ]
  );

  if (!userRows.length) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  const settings = JSON.stringify({
    employee_id: nullableText(body.employee_id),
    department: nullableText(body.department),
    role_label: roleDisplayLabel,
    status: text(body.status) || "Active",
  });

  const profileRows = await prisma.$queryRawUnsafe<Row[]>(
    `
    UPDATE clinical_user_profiles
    SET ${roleId ? "clinical_role_id = $2," : ""} display_name = $3,
        settings = $4::jsonb,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
      AND COALESCE(is_deleted,false) = false
    RETURNING *
    `,
    ...[
      id,
      ...(roleId ? [roleId] : []),
      text(body.name),
      settings,
      context.user.id ?? null,
    ]
  );

  await recordClinicalAudit(context, {
    moduleName: "admin_users",
    action: "update",
    entityType: "users",
    entityId: id,
    summary: "Clinical operational user updated",
    payload: { user: userRows[0], profile: profileRows[0] },
  });

  return NextResponse.json(
    serialize({ user: userRows[0], profile: profileRows[0] })
  );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update user.";
    if (message.includes("duplicate key value violates unique constraint") || message.includes("Unique constraint failed")) {
      return NextResponse.json({ error: "Duplicate user details detected." }, { status: 409 });
    }
    console.error("Clinical admin user update failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
