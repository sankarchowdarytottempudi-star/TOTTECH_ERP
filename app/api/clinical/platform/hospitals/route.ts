import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { CLINICAL_MODULE_CODES } from "@/lib/clinical/module-licensing";
import { nullableText, serialize, text, toNumber } from "@/lib/clinical/workflow";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

const slugCode = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 8);

const normalizeClinicalUsername = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, ".")
    .replace(/^[._-]+|[._-]+$/g, "")
    .replace(/\.{2,}/g, ".")
    .slice(0, 110) || "clinical-user";

async function buildUniqueClinicalUsername(
  db: any,
  baseValue: string
) {
  const base = normalizeClinicalUsername(baseValue);
  const rows = (await db.$queryRawUnsafe(
    `
    SELECT LOWER(username) AS username
    FROM users
    WHERE platform_type = 'CLINICAL'
      AND (
        LOWER(username) = LOWER($1)
        OR LOWER(username) LIKE LOWER($1) || '-%'
      )
    `,
    base
  )) as Row[];

  const existing = new Set(
    rows
      .map((row) => text(row.username))
      .filter(Boolean)
  );

  if (!existing.has(base)) {
    return base;
  }

  let suffix = 2;
  while (existing.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`.slice(0, 120);
}

const canCreateHospitals = (roleKey: string) =>
  [
    "tottech_super_admin",
    "clinical_super_admin",
    "organization_admin",
  ].includes(roleKey);

const hospitalPayload = (body: Row) => {
  const hospitalName = text(body.hospital_name);
  const branding = {
    name: hospitalName,
    logoUrl: text(body.logo_url),
    logo_url: text(body.logo_url),
    primaryColor: text(body.primary_color) || "#04142E",
    accentColor: text(body.accent_color) || "#D4AF37",
  };
  const subscription = {
    plan_type: nullableText(body.plan_type) || "STANDARD",
    start_date: nullableText(body.start_date),
    end_date: nullableText(body.end_date),
    maximum_users: toNumber(body.maximum_users) || 25,
    maximum_doctors: toNumber(body.maximum_doctors) || 10,
    maximum_branches: toNumber(body.maximum_branches) || 1,
  };
  const abhaIntegration = {
    client_id: nullableText(body.abha_client_id),
    facility_id: nullableText(body.abha_facility_id),
  };
  const nabhDetails = {
    number: nullableText(body.nabh_number),
  };
  const platformSettings = {
    subscription,
    abha_integration: abhaIntegration,
    timezone: nullableText(body.timezone) || "Asia/Kolkata",
    currency: nullableText(body.currency) || "INR",
  };

  return {
    hospitalName,
    branding,
    subscription,
    abhaIntegration,
    nabhDetails,
    platformSettings,
  };
};

async function findRoleId(
  db: any,
  tenantId: number,
  roleKeys: string[]
) {
  const rows = (await db.$queryRawUnsafe(
    `
    SELECT id
    FROM clinical_roles
    WHERE tenant_id = $1
      AND role_key = ANY($2::text[])
      AND COALESCE(is_deleted,false) = false
    ORDER BY id ASC
    LIMIT 1
    `,
    tenantId,
    roleKeys
  )) as Row[];
  return rows[0]?.id ? Number(rows[0].id) : null;
}

async function createClinicalUser(input: {
  db?: any;
  tenantId: number;
  hospitalId: number;
  branchId: number;
  clinicId: number;
  roleId: number | null;
  fullName: string;
  email: string;
  phone?: string | null;
  password: string;
  role: string;
  createdBy?: number | null;
}) {
  if (!input.email || !input.password || !input.fullName) {
    return null;
  }

  const db = input.db || prisma;
  const passwordHash = await bcrypt.hash(input.password, 10);
  const usernameSeed = input.email.split("@")[0].replace(/^cs-/i, "");
  const username = await buildUniqueClinicalUsername(
    db,
    usernameSeed || input.fullName
  );
  const users = (await db.$queryRawUnsafe(
    `
    INSERT INTO users (school_id, full_name, email, username, platform_type, status, phone, password_hash, role, is_active, created_at)
    VALUES (NULL,$1,$2,$3,'CLINICAL','ACTIVE',$4,$5,$6,true,CURRENT_TIMESTAMP)
    ON CONFLICT (email) DO UPDATE
      SET full_name = EXCLUDED.full_name,
          username = EXCLUDED.username,
          platform_type = 'CLINICAL',
          status = 'ACTIVE',
          phone = EXCLUDED.phone,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          is_active = true
    RETURNING id, full_name, email, phone, role, is_active
    `,
    input.fullName,
    input.email,
    username,
    input.phone || null,
    passwordHash,
    input.role.toUpperCase()
  )) as Row[];
  const user = users[0];

  await db.$executeRawUnsafe(
    `
    INSERT INTO clinical_user_profiles (
      tenant_id,hospital_id,branch_id,clinic_id,user_id,clinical_role_id,project_type,
      display_name,settings,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,'tottech_clinical_services',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    ON CONFLICT DO NOTHING
    `,
    input.tenantId,
    input.hospitalId,
    input.branchId,
    input.clinicId,
    user.id,
    input.roleId,
    input.fullName,
    JSON.stringify({
      source: "hospital_creation",
      role: input.role,
    }),
    input.createdBy || null
  );

  return user;
}

async function getHospitalRegistryRow(
  db: any,
  hospitalId: number
) {
  const rows = (await db.$queryRawUnsafe(
    `
    SELECT
      h.*,
      creator.full_name AS created_by_name,
      COUNT(DISTINCT b.id)::int AS branch_count,
      COUNT(DISTINCT c.id)::int AS clinic_count,
      COUNT(DISTINCT d.id)::int AS doctor_count,
      COUNT(DISTINCT cup.user_id)::int AS staff_count,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', b2.id,
            'branch_name', b2.branch_name,
            'branch_code', b2.branch_code,
            'phone', b2.phone,
            'email', b2.email,
            'status', b2.status
          ) ORDER BY b2.created_at DESC, b2.id DESC)
          FROM branches b2
          WHERE b2.hospital_id = h.id
            AND COALESCE(b2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS branches,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', d2.id,
            'full_name', d2.full_name,
            'specialization', d2.specialization,
            'phone', d2.phone,
            'email', d2.email,
            'status', d2.status
          ) ORDER BY d2.full_name)
          FROM doctors d2
          WHERE d2.hospital_id = h.id
            AND COALESCE(d2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS doctors,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', cup2.id,
            'user_id', u2.id,
            'full_name', COALESCE(u2.full_name, cup2.display_name),
            'email', u2.email,
            'role', u2.role,
            'profile_name', cup2.display_name
          ) ORDER BY cup2.created_at DESC, cup2.id DESC)
          FROM clinical_user_profiles cup2
          LEFT JOIN users u2 ON u2.id = cup2.user_id
          WHERE cup2.hospital_id = h.id
            AND COALESCE(cup2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS staff
    FROM hospitals h
    LEFT JOIN branches b ON b.hospital_id = h.id AND COALESCE(b.is_deleted,false) = false
    LEFT JOIN clinics c ON c.hospital_id = h.id AND COALESCE(c.is_deleted,false) = false
    LEFT JOIN doctors d ON d.hospital_id = h.id AND COALESCE(d.is_deleted,false) = false
    LEFT JOIN clinical_user_profiles cup ON cup.hospital_id = h.id AND COALESCE(cup.is_deleted,false) = false
    LEFT JOIN users creator ON creator.id = h.created_by
    WHERE h.id = $1
    GROUP BY h.id, creator.full_name
    LIMIT 1
    `,
    hospitalId
  )) as Row[];

  return rows[0] || null;
}

export async function GET(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  if (!canCreateHospitals(context.roleKey)) {
    return NextResponse.json(
      { error: "Only platform super admins can view hospital onboarding." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const search = text(searchParams?.get("search"));
  const statusFilter = text(searchParams?.get("status"));
  const isPlatformSuperAdmin = context.roleKey === "tottech_super_admin";
  const values: unknown[] = [];
  const filters: string[] = [];

  if (!isPlatformSuperAdmin) {
    values.push(context.tenantId);
    filters.push("h.tenant_id = $1");
  }

  if (statusFilter === "DELETED") {
    filters.push("COALESCE(h.is_deleted,false) = true");
  } else {
    filters.push("COALESCE(h.is_deleted,false) = false");
    if (statusFilter === "ACTIVE" || statusFilter === "INACTIVE") {
      values.push(statusFilter);
      filters.push(`h.status = $${values.length}`);
    }
  }

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    const index = values.length;
    filters.push(`
      (
        LOWER(COALESCE(h.hospital_name,'')) LIKE $${index}
        OR LOWER(COALESCE(h.hospital_code,'')) LIKE $${index}
        OR LOWER(COALESCE(h.phone,'')) LIKE $${index}
        OR LOWER(COALESCE(h.email,'')) LIKE $${index}
      )
    `);
  }

  const rows = await prisma.$queryRawUnsafe<Row[]>(
    `
    SELECT
      h.*,
      creator.full_name AS created_by_name,
      COUNT(DISTINCT b.id)::int AS branch_count,
      COUNT(DISTINCT c.id)::int AS clinic_count,
      COUNT(DISTINCT d.id)::int AS doctor_count,
      COUNT(DISTINCT cup.user_id)::int AS staff_count,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', b2.id,
            'branch_name', b2.branch_name,
            'branch_code', b2.branch_code,
            'phone', b2.phone,
            'email', b2.email,
            'status', b2.status
          ) ORDER BY b2.created_at DESC, b2.id DESC)
          FROM branches b2
          WHERE b2.hospital_id = h.id
            AND COALESCE(b2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS branches,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', d2.id,
            'full_name', d2.full_name,
            'specialization', d2.specialization,
            'phone', d2.phone,
            'email', d2.email,
            'status', d2.status
          ) ORDER BY d2.full_name)
          FROM doctors d2
          WHERE d2.hospital_id = h.id
            AND COALESCE(d2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS doctors,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', cup2.id,
            'user_id', u2.id,
            'full_name', COALESCE(u2.full_name, cup2.display_name),
            'email', u2.email,
            'role', u2.role,
            'profile_name', cup2.display_name
          ) ORDER BY cup2.created_at DESC, cup2.id DESC)
          FROM clinical_user_profiles cup2
          LEFT JOIN users u2 ON u2.id = cup2.user_id
          WHERE cup2.hospital_id = h.id
            AND COALESCE(cup2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS staff
    FROM hospitals h
    LEFT JOIN branches b ON b.hospital_id = h.id AND COALESCE(b.is_deleted,false) = false
    LEFT JOIN clinics c ON c.hospital_id = h.id AND COALESCE(c.is_deleted,false) = false
    LEFT JOIN doctors d ON d.hospital_id = h.id AND COALESCE(d.is_deleted,false) = false
    LEFT JOIN clinical_user_profiles cup ON cup.hospital_id = h.id AND COALESCE(cup.is_deleted,false) = false
    LEFT JOIN users creator ON creator.id = h.created_by
    WHERE ${filters.join(" AND ")}
    GROUP BY h.id, creator.full_name
    ORDER BY h.created_at DESC, h.id DESC
    LIMIT 300
    `,
    ...values
  );

  return NextResponse.json(serialize({ rows }));
}

export async function POST(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  if (!canCreateHospitals(context.roleKey)) {
    return NextResponse.json(
      { error: "Only platform super admins can create hospitals." },
      { status: 403 }
    );
  }

  const body = await request.json();
  console.info("CREATE_HOSPITAL_START", {
    user_id: context.user.id,
    tenant_id: context.tenantId,
  });
  const hospitalName = text(body.hospital_name);
  const ownerEmail = text(body.owner_email);
  const adminEmail = text(body.admin_email);

  if (!hospitalName) {
    return NextResponse.json({ error: "Hospital name is required." }, { status: 400 });
  }
  if (!text(body.logo_url)) {
    return NextResponse.json({ error: "Hospital logo URL/path is required." }, { status: 400 });
  }
  if (!text(body.email) || !text(body.phone) || !text(body.address) || !text(body.city) || !text(body.state) || !text(body.country)) {
    return NextResponse.json({ error: "Hospital email, phone, address, city, state and country are required." }, { status: 400 });
  }
  const codeBase = slugCode(hospitalName) || "HOSP";
  const requestedCode = slugCode(text(body.hospital_code));
  const hospitalCode = requestedCode || `${codeBase}-${Date.now().toString().slice(-5)}`;
  const { branding, nabhDetails, platformSettings } =
    hospitalPayload(body);

  try {
	    console.info("REQUEST_RECEIVED", {
	      hospital_name: hospitalName,
	      requested_code: hospitalCode,
	      tenant_id: context.tenantId,
	    });
	    console.info("VALIDATION_PASSED", {
	      hospital_name: hospitalName,
	      hospital_code: hospitalCode,
	    });
    // pre-check: avoid unique constraint violations by checking hospital_code for this tenant
    // include soft-deleted rows as the DB unique index may cover them
    const existing = await prisma.$queryRawUnsafe<Row[]>(
      `SELECT id, COALESCE(is_deleted,false) AS is_deleted FROM hospitals WHERE tenant_id = $1 AND hospital_code = $2 LIMIT 1`,
      context.tenantId,
      hospitalCode
    );
    if (existing && existing.length) {
      console.warn("CREATE_HOSPITAL_DUPLICATE_CODE", {
        hospital_code: hospitalCode,
        is_deleted: existing[0].is_deleted,
      });
      return NextResponse.json({ error: 'Hospital code already exists for this tenant.' }, { status: 409 });
    }
    const result = await prisma.$transaction(async (tx) => {
      const hospitals = await tx.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO hospitals (
      tenant_id,hospital_name,hospital_code,legal_name,license_number,gst_number,email,phone,
      address,city,state,country,status,branding,settings,nabh_details,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb,$16::jsonb,$17,$17,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    hospitalName,
    hospitalCode,
    nullableText(body.legal_name) || hospitalName,
    nullableText(body.license_number) || nullableText(body.nabh_number),
    nullableText(body.gst_number),
    text(body.email),
    text(body.phone),
    text(body.address),
    text(body.city),
    text(body.state),
    text(body.country),
    text(body.status) || "ACTIVE",
    JSON.stringify(branding),
    JSON.stringify(platformSettings),
    JSON.stringify(nabhDetails),
    context.user.id ?? null
  );
  const hospital = hospitals[0];
    console.info("HOSPITAL_INSERT_SUCCESS", {
      hospital_id: hospital?.id,
      hospital_code: hospital?.hospital_code,
    });

    console.info("CREATE_BRANCH_START", {
      hospital_id: hospital?.id,
    });
    const branches = await tx.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO branches (
      tenant_id,hospital_id,branch_name,branch_code,branch_type,email,phone,address,city,state,country,
      status,branding,settings,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,'MAIN',$5,$6,$7,$8,$9,$10,'ACTIVE',$11::jsonb,$12::jsonb,$13,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    hospital.id,
    `${hospitalName} Main Branch`,
    `${hospitalCode}-MAIN`,
    text(body.email),
    text(body.phone),
    text(body.address),
    text(body.city),
    text(body.state),
    text(body.country),
    JSON.stringify(branding),
    JSON.stringify({ auto_created: true }),
    context.user.id ?? null
  );
  const branch = branches[0];
    console.info("BRANCH_INSERT_SUCCESS", {
      hospital_id: hospital?.id,
      branch_id: branch?.id,
    });

    console.info("CREATE_CLINIC_START", {
      hospital_id: hospital?.id,
      branch_id: branch?.id,
    });
    const clinics = await tx.$queryRawUnsafe<Row[]>(
    `
    INSERT INTO clinics (
      tenant_id,hospital_id,branch_id,organization_id,clinic_name,clinic_code,clinic_type,email,phone,
      address,city,state,country,branding,settings,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,'HMS',$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb,$15,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,
    context.tenantId,
    hospital.id,
    branch.id,
    context.organizationId,
    hospitalName,
    `${hospitalCode}-HMS`,
    text(body.email),
    text(body.phone),
    text(body.address),
    text(body.city),
    text(body.state),
    text(body.country),
    JSON.stringify(branding),
    JSON.stringify({ auto_created: true }),
    context.user.id ?? null
  );
  const clinic = clinics[0];
    console.info("CLINIC_INSERT_SUCCESS", {
      hospital_id: hospital?.id,
      branch_id: branch?.id,
      clinic_id: clinic?.id,
    });

    console.info("FIND_ROLE_IDS_START");
    const ownerRoleId = await findRoleId(tx, context.tenantId, ["hospital_owner", "owner", "hospital_admin", "clinic_admin"]);
    const adminRoleId = await findRoleId(tx, context.tenantId, ["hospital_admin", "clinic_admin", "branch_admin"]);
    console.info("CREATE_OWNER_START");
  const owner = await createClinicalUser({
    db: tx,
    tenantId: context.tenantId,
    hospitalId: Number(hospital.id),
    branchId: Number(branch.id),
    clinicId: Number(clinic.id),
    roleId: ownerRoleId,
    fullName: text(body.owner_name),
    email: ownerEmail,
    phone: nullableText(body.owner_phone),
    password: text(body.owner_password),
    role: "hospital_owner",
    createdBy: context.user.id ?? null,
  });
  console.info("OWNER_INSERT_SUCCESS", {
    user_id: owner?.id || null,
    email: owner?.email || ownerEmail || null,
  });
  console.info("CREATE_ADMIN_START");
  const admin = await createClinicalUser({
    db: tx,
    tenantId: context.tenantId,
    hospitalId: Number(hospital.id),
    branchId: Number(branch.id),
    clinicId: Number(clinic.id),
    roleId: adminRoleId,
    fullName: text(body.admin_name),
    email: adminEmail,
    phone: nullableText(body.admin_phone),
    password: text(body.admin_password),
    role: "hospital_admin",
    createdBy: context.user.id ?? null,
  });
	  console.info("ADMIN_INSERT_SUCCESS", {
	    user_id: admin?.id || null,
	    email: admin?.email || adminEmail || null,
	  });

    console.info("SUBSCRIPTION_INSERT_START", {
      hospital_id: hospital?.id,
    });
    await tx.$executeRawUnsafe(
      `
      INSERT INTO hospital_subscriptions (
        tenant_id,hospital_id,plan_name,start_date,status,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,CURRENT_DATE,'ACTIVE',$4,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,
      context.tenantId,
      hospital.id,
      platformSettings.subscription?.plan_type || "ENTERPRISE",
      context.user.id ?? null
    );
    console.info("SUBSCRIPTION_INSERT_SUCCESS", {
      hospital_id: hospital?.id,
    });

    for (const moduleCode of CLINICAL_MODULE_CODES) {
      await tx.$executeRawUnsafe(
        `
        INSERT INTO hospital_module_access (
          tenant_id,hospital_id,module_code,enabled,created_at,updated_at,enabled_by,updated_by
        )
        VALUES ($1,$2,$3,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$4,$4)
        ON CONFLICT (tenant_id,hospital_id,module_code) DO NOTHING
        `,
        context.tenantId,
        hospital.id,
        moduleCode,
        context.user.id ?? null
      );
    }
    console.info("MODULE_ACCESS_INSERT_SUCCESS", {
      hospital_id: hospital?.id,
      module_count: CLINICAL_MODULE_CODES.length,
    });

      return {
        hospital,
        branch,
        clinic,
        owner,
        admin,
      };
    });

    console.info("TRANSACTION_COMMITTED", {
      hospital_id: result.hospital?.id,
    });

    const {
      hospital,
      branch,
      clinic,
      owner,
      admin,
    } = result;

	   console.info("RECORD_AUDIT_START", {
      hospital_id: hospital?.id,
    });
    try {
      await recordClinicalAudit(context, {
        moduleName: "platform_hospitals",
        action: "create",
        entityType: "hospital",
        entityId: Number(hospital.id),
        summary: "White-label hospital tenant created",
        payload: {
          hospital,
          branch,
          clinic,
          owner_user_id: owner?.id || null,
          admin_user_id: admin?.id || null,
        },
      });
    } catch (auditError) {
      console.warn("RECORD_AUDIT_FAILED", {
        hospital_id: hospital?.id,
        error:
          auditError instanceof Error
            ? auditError.message
            : String(auditError),
      });
    }

    let registryHospital = null;
    try {
      registryHospital = await getHospitalRegistryRow(
        prisma,
        Number(hospital.id)
      );
    } catch (registryError) {
      console.warn("REGISTRY_REFRESH_FAILED_POST_SAVE", {
        hospital_id: hospital?.id,
        error:
          registryError instanceof Error
            ? registryError.message
            : String(registryError),
      });
    }

	    console.info("REGISTRY_REFRESH_SUCCESS", {
	      hospital_id: hospital?.id,
	      found: Boolean(registryHospital),
	    });
	    console.info("RESPONSE_SENT", {
	      hospital_id: hospital?.id,
	      found_in_registry: Boolean(registryHospital),
	    });

    return NextResponse.json(
      serialize({
        hospital: registryHospital || hospital,
        rawHospital: hospital,
        branch,
        clinic,
        owner,
        admin,
      }),
      { status: 201 }
    );
	  } catch (err: any) {
	    console.error('CREATE_HOSPITAL_ERROR', err);
	    const msg = err?.meta?.driverAdapterError?.message || err?.message || String(err);
	    if (/duplicate key|unique constraint|23505/i.test(String(msg))) {
	      return NextResponse.json({ error: 'Hospital code already exists for this tenant.' }, { status: 409 });
	    }
	    if (/invalid.*email|email/i.test(String(msg))) {
	      return NextResponse.json({ error: 'Invalid Email', details: msg }, { status: 400 });
	    }
	    return NextResponse.json({ error: 'Database Transaction Failed', details: msg }, { status: 500 });
	  }
}

export async function PATCH(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  if (!canCreateHospitals(context.roleKey)) {
    return NextResponse.json(
      { error: "Only platform super admins can update hospitals." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const id = toNumber(body.id);
  const action = text(body.action);

  if (!id) {
    return NextResponse.json({ error: "Hospital id is required." }, { status: 400 });
  }

  if (["ACTIVATE", "DEACTIVATE"].includes(action)) {
    const status = action === "ACTIVATE" ? "ACTIVE" : "INACTIVE";
    const isPlatformSuperAdmin = context.roleKey === "tottech_super_admin";
    const query = `
      UPDATE hospitals
      SET status = $${isPlatformSuperAdmin ? 2 : 3},
          updated_by = $${isPlatformSuperAdmin ? 3 : 4},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      ${isPlatformSuperAdmin ? "" : "AND tenant_id = $2"}
        AND COALESCE(is_deleted,false) = false
      RETURNING *
    `;
    const values: unknown[] = [id, status, context.user.id ?? null];
    if (!isPlatformSuperAdmin) {
      values.splice(1, 0, context.tenantId);
    }
    const rows = await prisma.$queryRawUnsafe<Row[]>(query, ...values);

    if (!rows.length) {
      return NextResponse.json({ error: "Hospital not found." }, { status: 404 });
    }

    await recordClinicalAudit(context, {
      moduleName: "platform_hospitals",
      action: status.toLowerCase(),
      entityType: "hospital",
      entityId: id,
      summary: `Hospital ${status.toLowerCase()}`,
      payload: rows[0],
    });

    const registryHospital = await getHospitalRegistryRow(prisma, id);

    return NextResponse.json(
      serialize({ hospital: registryHospital || rows[0] })
    );
  }

  const hospitalName = text(body.hospital_name);
  if (!hospitalName) {
    return NextResponse.json({ error: "Hospital name is required." }, { status: 400 });
  }
  if (!text(body.logo_url)) {
    return NextResponse.json({ error: "Hospital logo URL/path is required." }, { status: 400 });
  }
  if (!text(body.email) || !text(body.phone) || !text(body.address)) {
    return NextResponse.json({ error: "Hospital email, phone and address are required." }, { status: 400 });
  }

  const requestedCode = slugCode(text(body.hospital_code));
  const { branding, nabhDetails, platformSettings } =
    hospitalPayload(body);

  const isPlatformSuperAdmin = context.roleKey === "tottech_super_admin";
  const updateSql = `
    UPDATE hospitals
    SET hospital_name = $3,
        hospital_code = COALESCE(NULLIF($4,''), hospital_code),
        legal_name = $5,
        license_number = $6,
        gst_number = $7,
        email = $8,
        phone = $9,
        address = $10,
        city = $11,
        state = $12,
        country = $13,
        status = $14,
        branding = $15::jsonb,
        settings = $16::jsonb,
        nabh_details = $17::jsonb,
        updated_by = $18,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      ${isPlatformSuperAdmin ? "" : "AND tenant_id = $2"}
      AND COALESCE(is_deleted,false) = false
    RETURNING *
    `;
  const updateValues: unknown[] = [
    id,
    ...(isPlatformSuperAdmin ? [] : [context.tenantId]),
    hospitalName,
    requestedCode,
    nullableText(body.legal_name) || hospitalName,
    nullableText(body.license_number) || nullableText(body.nabh_number),
    nullableText(body.gst_number),
    text(body.email),
    text(body.phone),
    text(body.address),
    nullableText(body.city),
    nullableText(body.state),
    nullableText(body.country) || "India",
    text(body.status) || "ACTIVE",
    JSON.stringify(branding),
    JSON.stringify(platformSettings),
    JSON.stringify(nabhDetails),
    context.user.id ?? null,
  ];
  const rows = await prisma.$queryRawUnsafe<Row[]>(updateSql, ...updateValues);

  if (!rows.length) {
    return NextResponse.json({ error: "Hospital not found." }, { status: 404 });
  }

  await recordClinicalAudit(context, {
    moduleName: "platform_hospitals",
    action: "update",
    entityType: "hospital",
    entityId: id,
    summary: "Hospital details updated",
    payload: rows[0],
  });

  const registryHospital = await getHospitalRegistryRow(prisma, id);

  return NextResponse.json(
    serialize({ hospital: registryHospital || rows[0] })
  );
}

export async function DELETE(request: Request) {
  const auth = await requireClinicalContext(request);
  if (auth.response) return auth.response;
  const context = auth.context!;

  if (!canCreateHospitals(context.roleKey)) {
    return NextResponse.json(
      { error: "Only platform super admins can delete hospitals." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = toNumber(searchParams?.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Hospital id is required." }, { status: 400 });
  }

  const isPlatformSuperAdmin = context.roleKey === "tottech_super_admin";
  const deleteSql = `
    UPDATE hospitals
    SET is_deleted = true,
        status = 'DELETED',
        updated_by = $${isPlatformSuperAdmin ? 2 : 3},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      ${isPlatformSuperAdmin ? "" : "AND tenant_id = $2"}
      AND COALESCE(is_deleted,false) = false
    RETURNING *
    `;
  const deleteValues: unknown[] = [
    id,
    ...(isPlatformSuperAdmin ? [] : [context.tenantId]),
    context.user.id ?? null,
  ];
  const rows = await prisma.$queryRawUnsafe<Row[]>(deleteSql, ...deleteValues);

  if (!rows.length) {
    return NextResponse.json({ error: "Hospital not found." }, { status: 404 });
  }

  await recordClinicalAudit(context, {
    moduleName: "platform_hospitals",
    action: "delete",
    entityType: "hospital",
    entityId: id,
    summary: "Hospital soft deleted",
    payload: rows[0],
  });

  return NextResponse.json({ success: true, hospital: serialize(rows[0]) });
}
