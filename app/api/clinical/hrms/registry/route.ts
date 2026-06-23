import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { prisma } from "@/lib/prisma";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;

  const [
    counts,
    employees,
    attendancePolicies,
    shifts,
    courses,
    reports,
    expiringLicenses,
    apiSamples,
  ] = await Promise.all([
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'clinical_hr_%') AS hr_tables,
        (SELECT COUNT(*)::int FROM clinical_hr_employees WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS employees,
        (SELECT COUNT(*)::int FROM clinical_hr_attendance WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS attendance_records,
        (SELECT COUNT(*)::int FROM clinical_hr_geo_attendance_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS geo_policies,
        (SELECT COUNT(*)::int FROM clinical_hr_biometric_devices WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS biometric_devices,
        (SELECT COUNT(*)::int FROM clinical_hr_shifts WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS shifts,
        (SELECT COUNT(*)::int FROM clinical_hr_rosters WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS rosters,
        (SELECT COUNT(*)::int FROM clinical_hr_leave_requests WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS leave_requests,
        (SELECT COUNT(*)::int FROM clinical_hr_payroll WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS payroll_lines,
        (SELECT COUNT(*)::int FROM clinical_hr_doctor_credentials WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS credentials,
        (SELECT COUNT(*)::int FROM clinical_hr_doctor_privileges WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS privileges,
        (SELECT COUNT(*)::int FROM clinical_hr_lms_courses WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS courses,
        (SELECT COUNT(*)::int FROM clinical_hr_training_records WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS training_records,
        (SELECT COUNT(*)::int FROM clinical_hr_licenses WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS licenses,
        (SELECT COUNT(*)::int FROM clinical_hr_screens WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS screens,
        (SELECT COUNT(*)::int FROM clinical_hr_api_catalog WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS apis,
        (SELECT COUNT(*)::int FROM clinical_hr_reports WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS reports,
        (SELECT COUNT(*)::int FROM clinical_hr_table_blueprints WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS table_blueprints
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT employee_id, first_name, last_name, department, designation, employment_type, employee_status
      FROM clinical_hr_employees
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 12
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT policy_key, latitude, longitude, allowed_radius_meters, mobile_attendance_enabled, biometric_required
      FROM clinical_hr_geo_attendance_policies
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 12
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT shift_code, shift_name, shift_type, start_time, end_time, grace_minutes
      FROM clinical_hr_shifts
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY shift_code
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT course_id, course_name, category, duration_hours, instructor, mandatory
      FROM clinical_hr_lms_courses
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY mandatory DESC, course_name
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT report_key, report_name, report_category, output_formats
      FROM clinical_hr_reports
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY report_category, report_name
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT license_type, license_number, expiry_date, authority
      FROM clinical_hr_licenses
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
        AND expiry_date <= CURRENT_DATE + INTERVAL '90 days'
      ORDER BY expiry_date ASC
      LIMIT 20
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
    prisma.$queryRawUnsafe<Row[]>(
      `
      SELECT api_key, module_key, method, route_path, action_name, audit_event
      FROM clinical_hr_api_catalog
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY module_key, action_name
      LIMIT 30
      `,
      context.tenantId,
      context.hospitalId,
      context.branchId
    ),
  ]);

  return NextResponse.json({
    context,
    counts: counts[0] || {},
    employees,
    attendancePolicies,
    shifts,
    courses,
    reports,
    expiringLicenses,
    apiSamples,
  });
}
