module.exports=[193695,(e,t,i)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,i)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,i)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let i=e.split("?")[0].split("#")[0].toLowerCase(),a=t.find(e=>!!(e.startsWith&&i.startsWith(e.startsWith)||e.includes&&i.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(t,i)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),l=e.i(15270),s=e.i(274173),o=e.i(503031),d=t([r,l]);[r,l]=d.then?(await d)():d;let h=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},C=e=>e&&"object"==typeof e?e:{},A=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",m=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function c(e,t){return(await l.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(o.CLINICAL_MODULE_LABELS,e))}async function p(e,t){let i=await l.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(i[0]?.count||0)>0}async function _(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,s.isClinicalServicesEmail)(t?.email)))return null;let i=await (0,a.cookies)(),n=h(i.get("active_clinic_id")?.value),o=h(i.get("active_hospital_id")?.value),d=h(i.get("active_branch_id")?.value),p=e?new URL(e.url):null,_=h(p?.searchParams.get("clinic_id")),u=h(p?.searchParams.get("hospital_id")),E=h(p?.searchParams.get("branch_id")),N=(await l.prisma.$queryRawUnsafe(`
      SELECT
        cup.tenant_id,
        cup.clinic_id,
        COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
        COALESCE(cup.branch_id, c.branch_id) AS branch_id,
        c.organization_id,
        ct.tenant_name,
        h.hospital_name,
        h.address AS hospital_address,
        h.phone AS hospital_phone,
        h.email AS hospital_email,
        h.license_number AS hospital_license_number,
        h.branding AS hospital_branding,
        b.branch_name,
        b.branding AS branch_branding,
        COALESCE(o.organization_name, ct.tenant_name, c.clinic_name) AS organization_name,
        o.branding AS organization_branding,
        c.clinic_name,
        c.branding AS clinic_branding,
        cr.role_key,
        cr.role_name,
        cr.permissions
      FROM clinical_user_profiles cup
      JOIN clinics c ON c.id = cup.clinic_id
      LEFT JOIN organizations o ON (
        o.tenant_id = cup.tenant_id
        OR o.id = cup.tenant_id
      )
        AND COALESCE(o.is_deleted, false) = false
      LEFT JOIN clinical_tenants ct ON ct.id = cup.tenant_id
      LEFT JOIN hospitals h ON h.id = COALESCE(cup.hospital_id, c.hospital_id)
      LEFT JOIN branches b ON b.id = COALESCE(cup.branch_id, c.branch_id)
      LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
      WHERE cup.user_id = $1
        AND COALESCE(cup.is_deleted, false) = false
        AND COALESCE(c.is_deleted, false) = false
        AND ($2::int IS NULL OR cup.clinic_id = $2::int)
        AND ($3::int IS NULL OR COALESCE(cup.hospital_id, c.hospital_id) = $3::int)
        AND ($4::int IS NULL OR COALESCE(cup.branch_id, c.branch_id) = $4::int)
      ORDER BY cup.id ASC
      LIMIT 1
      `,t.id??null,_??n,u??o,E??d))[0];if(!N&&o&&t.id&&(N=(await l.prisma.$queryRawUnsafe(`
        WITH base_profile AS (
          SELECT
            cup.tenant_id,
            cup.clinic_id AS base_clinic_id,
            COALESCE(cup.hospital_id, c.hospital_id) AS base_hospital_id,
            COALESCE(cup.branch_id, c.branch_id) AS base_branch_id,
            c.organization_id,
            cr.role_key,
            cr.role_name,
            cr.permissions
          FROM clinical_user_profiles cup
          JOIN clinics c ON c.id = cup.clinic_id
          LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
          WHERE cup.user_id = $1
            AND COALESCE(cup.is_deleted, false) = false
            AND COALESCE(c.is_deleted, false) = false
          ORDER BY cup.id ASC
          LIMIT 1
        ),
        selected_hospital AS (
          SELECT h.*
          FROM hospitals h
          JOIN base_profile bp ON bp.tenant_id = h.tenant_id
          WHERE h.id = $2
            AND COALESCE(h.is_deleted, false) = false
            AND COALESCE(bp.role_key, '') = ANY($3::text[])
          LIMIT 1
        ),
        selected_branch AS (
          SELECT b.*
          FROM branches b
          JOIN selected_hospital h ON h.id = b.hospital_id
          WHERE b.tenant_id = h.tenant_id
            AND ($4::int IS NULL OR b.id = $4::int)
            AND COALESCE(b.is_deleted, false) = false
          ORDER BY
            CASE WHEN $4::int IS NOT NULL AND b.id = $4::int THEN 0 ELSE 1 END,
            b.id ASC
          LIMIT 1
        ),
        selected_clinic AS (
          SELECT c.*
          FROM clinics c
          JOIN selected_hospital h ON h.id = c.hospital_id
          LEFT JOIN selected_branch b ON b.id = c.branch_id
          WHERE c.tenant_id = h.tenant_id
            AND ($5::int IS NULL OR c.id = $5::int)
            AND (
              b.id IS NULL
              OR c.branch_id = b.id
            )
            AND COALESCE(c.is_deleted, false) = false
          ORDER BY
            CASE WHEN $5::int IS NOT NULL AND c.id = $5::int THEN 0 ELSE 1 END,
            c.id ASC
          LIMIT 1
        )
        SELECT
          bp.tenant_id,
          COALESCE(sc.id, bp.base_clinic_id) AS clinic_id,
          sh.id AS hospital_id,
          COALESCE(sb.id, sc.branch_id, bp.base_branch_id) AS branch_id,
          COALESCE(sc.organization_id, bp.organization_id) AS organization_id,
          ct.tenant_name,
          sh.hospital_name,
          sh.address AS hospital_address,
          sh.phone AS hospital_phone,
          sh.email AS hospital_email,
          sh.license_number AS hospital_license_number,
          sh.branding AS hospital_branding,
          sb.branch_name,
          sb.branding AS branch_branding,
          COALESCE(o.organization_name, ct.tenant_name, sc.clinic_name, sh.hospital_name) AS organization_name,
          o.branding AS organization_branding,
          COALESCE(sc.clinic_name, sh.hospital_name) AS clinic_name,
          sc.branding AS clinic_branding,
          bp.role_key,
          bp.role_name,
          bp.permissions
        FROM base_profile bp
        JOIN selected_hospital sh ON true
        LEFT JOIN selected_branch sb ON true
        LEFT JOIN selected_clinic sc ON true
        LEFT JOIN organizations o ON (
          o.tenant_id = bp.tenant_id
          OR o.id = bp.tenant_id
        )
          AND COALESCE(o.is_deleted, false) = false
        LEFT JOIN clinical_tenants ct ON ct.id = bp.tenant_id
        LIMIT 1
        `,t.id,o,Array.from(m),d,n))[0]),!N)return null;let S=C(N.organization_branding),L=C(N.hospital_branding),O=C(N.branch_branding),R=C(N.clinic_branding),b={...S,...L,...O,...R},I=A(b.logoUrl,b.logo_url,b.logo,b.hospital_logo,b.image),g=A(b.name,b.hospitalName,b.hospital_name,N.hospital_name,N.branch_name,N.clinic_name,N.organization_name),T=await c(Number(N.tenant_id),Number(N.hospital_id));return{user:t,tenantId:Number(N.tenant_id),hospitalId:Number(N.hospital_id),branchId:Number(N.branch_id),clinicId:Number(N.clinic_id),organizationId:h(N.organization_id),organizationName:String(N.organization_name||""),tenantName:String(N.tenant_name||""),hospitalName:String(N.hospital_name||""),hospitalAddress:String(N.hospital_address||""),hospitalPhone:String(N.hospital_phone||""),hospitalEmail:String(N.hospital_email||""),hospitalLicenseNumber:String(N.hospital_license_number||""),branchName:String(N.branch_name||""),clinicName:String(N.clinic_name||""),roleKey:String(N.role_key||"clinical_user"),roleName:String(N.role_name||"Clinical User"),permissions:N.permissions||{},licensedModules:T,branding:{name:g||"Hospital",logoUrl:I||null,primaryColor:A(b.primaryColor,b.primary_color)||"#04142E",accentColor:A(b.accentColor,b.accent_color)||"#D4AF37",source:I?"hospital":"generated"}}}async function u(e){let t=await _(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let i=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(i);if(a&&!(!await p(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:t,response:null}}async function E(e,t){await l.prisma.$executeRawUnsafe(`
    INSERT INTO clinical_audit_events (
      tenant_id,
      clinic_id,
      hospital_id,
      branch_id,
      user_id,
      module_name,
      action,
      entity_type,
      entity_id,
      summary,
      payload,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,E,"requireClinicalContext",0,u]),i()}catch(e){i(e)}},!1),441700,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(15270),l=t([n,r]);async function s(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let i=t.context,{searchParams:l}=new URL(e.url),s=l.get("q")?.trim()||"",o=s?`%${s.toLowerCase()}%`:null,d=s.replace(/\D/g,"");if(!o&&d.length<4)return a.NextResponse.json({query:s,patients:[],message:"Search by patient name, mobile number, UHID/MRN, or ABHA."});let c=await r.prisma.$queryRawUnsafe(`
    SELECT
      p.id,
      p.patient_uid,
      p.uhid,
      p.abha_id,
      p.first_name,
      p.last_name,
      COALESCE(NULLIF(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), ''), p.patient_uid, p.uhid) AS patient_name,
      p.gender,
      COALESCE(p.age_years, EXTRACT(YEAR FROM age(CURRENT_DATE, p.date_of_birth))::int) AS age,
      p.date_of_birth,
      p.phone,
      p.whatsapp_number,
      p.alternate_mobile,
      p.status,
      p.created_at,
      latest_appointment.id AS appointment_id,
      latest_appointment.status AS appointment_status,
      latest_appointment.queue_status,
      latest_appointment.token_number,
      latest_appointment.appointment_date,
      latest_doctor.full_name AS doctor_name,
      latest_prescription.prescription_uid AS latest_prescription_uid,
      latest_prescription.pharmacy_status AS latest_prescription_status,
      latest_lab.lab_test_name AS latest_lab_report,
      latest_lab.result_status AS latest_lab_status,
      latest_lab.released_at AS latest_lab_released_at,
      latest_radiology.study_type AS latest_radiology_study,
      latest_radiology.order_status AS latest_radiology_status,
      lab_counts.lab_report_count,
      radiology_counts.radiology_record_count,
      '/clinical-services/patients/' || p.id AS patient_360_href,
      latest_vitals.id AS vitals_id,
      latest_vitals.blood_pressure,
      latest_vitals.pulse,
      latest_vitals.temperature,
      latest_vitals.spo2,
      latest_vitals.height,
      latest_vitals.weight,
      latest_vitals.bmi
    FROM patients p
    LEFT JOIN LATERAL (
      SELECT a.*
      FROM appointments a
      WHERE a.patient_id = p.id
        AND a.tenant_id = p.tenant_id
        AND a.hospital_id = p.hospital_id
        AND a.branch_id = p.branch_id
        AND COALESCE(a.is_deleted,false) = false
      ORDER BY a.appointment_date DESC NULLS LAST, a.created_at DESC, a.id DESC
      LIMIT 1
    ) latest_appointment ON true
    LEFT JOIN doctors latest_doctor ON latest_doctor.id = latest_appointment.doctor_id
    LEFT JOIN LATERAL (
      SELECT pr.*
      FROM prescriptions pr
      WHERE pr.patient_id = p.id
        AND pr.tenant_id = p.tenant_id
        AND pr.hospital_id = p.hospital_id
        AND pr.branch_id = p.branch_id
        AND COALESCE(pr.is_deleted,false) = false
      ORDER BY pr.created_at DESC, pr.id DESC
      LIMIT 1
    ) latest_prescription ON true
    LEFT JOIN LATERAL (
      SELECT
        lr.*,
        COALESCE(lt.lab_test_name, lo.order_type, lr.result_uid) AS lab_test_name,
        lr.validated_at AS released_at
      FROM lab_results lr
      LEFT JOIN lab_orders lo ON lo.id = lr.lab_order_id
      LEFT JOIN clinical_lab_test_master lt ON lt.id = lo.lab_test_id
      WHERE lr.patient_id = p.id
        AND lr.tenant_id = p.tenant_id
        AND lr.hospital_id = p.hospital_id
        AND lr.branch_id = p.branch_id
        AND COALESCE(lr.is_deleted,false) = false
      ORDER BY lr.created_at DESC, lr.id DESC
      LIMIT 1
    ) latest_lab ON true
    LEFT JOIN LATERAL (
      SELECT ro.*
      FROM radiology_orders ro
      WHERE ro.patient_id = p.id
        AND ro.tenant_id = p.tenant_id
        AND ro.hospital_id = p.hospital_id
        AND ro.branch_id = p.branch_id
        AND COALESCE(ro.is_deleted,false) = false
      ORDER BY ro.created_at DESC, ro.id DESC
      LIMIT 1
    ) latest_radiology ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS lab_report_count
      FROM lab_results lr
      WHERE lr.patient_id = p.id
        AND lr.tenant_id = p.tenant_id
        AND lr.hospital_id = p.hospital_id
        AND lr.branch_id = p.branch_id
        AND COALESCE(lr.is_deleted,false) = false
    ) lab_counts ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS radiology_record_count
      FROM radiology_orders ro
      WHERE ro.patient_id = p.id
        AND ro.tenant_id = p.tenant_id
        AND ro.hospital_id = p.hospital_id
        AND ro.branch_id = p.branch_id
        AND COALESCE(ro.is_deleted,false) = false
    ) radiology_counts ON true
    LEFT JOIN LATERAL (
      SELECT cv.*
      FROM clinical_vitals cv
      WHERE cv.patient_id = p.id
        AND cv.tenant_id = p.tenant_id
        AND cv.hospital_id = p.hospital_id
        AND cv.branch_id = p.branch_id
        AND COALESCE(cv.is_deleted,false) = false
      ORDER BY
        CASE WHEN cv.appointment_id = latest_appointment.id THEN 0 ELSE 1 END,
        cv.created_at DESC,
        cv.id DESC
      LIMIT 1
    ) latest_vitals ON true
    WHERE p.tenant_id = $1
      AND p.hospital_id = $2
      AND p.branch_id = $3
      AND COALESCE(p.is_deleted,false) = false
      AND (
        lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        OR lower(COALESCE(p.patient_uid,'')) LIKE $4
        OR lower(COALESCE(p.uhid,'')) LIKE $4
        OR lower(COALESCE(p.abha_id,'')) LIKE $4
        OR lower(COALESCE(p.phone,'')) LIKE $4
        OR lower(COALESCE(p.whatsapp_number,'')) LIKE $4
        OR lower(COALESCE(p.alternate_mobile,'')) LIKE $4
        OR ($5::text <> '' AND regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5)
        OR ($5::text <> '' AND regexp_replace(COALESCE(p.whatsapp_number,''),'\\D','','g') LIKE '%' || $5)
        OR ($5::text <> '' AND regexp_replace(COALESCE(p.alternate_mobile,''),'\\D','','g') LIKE '%' || $5)
      )
    ORDER BY
      CASE
        WHEN lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4 THEN 1
        WHEN $5::text <> '' AND regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5 THEN 2
        WHEN lower(COALESCE(p.uhid,'')) LIKE $4 OR lower(COALESCE(p.patient_uid,'')) LIKE $4 THEN 3
        ELSE 4
      END,
      p.created_at DESC
    LIMIT 50
    `,i.tenantId,i.hospitalId,i.branchId,o||"%%",d);return a.NextResponse.json({query:s,patients:c})}[n,r]=l.then?(await l)():l,e.s(["GET",0,s]),i()}catch(e){i(e)}},!1),429802,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),l=e.i(759756),s=e.i(561916),o=e.i(174677),d=e.i(869741),c=e.i(316795),p=e.i(487718),_=e.i(995169),u=e.i(47587),E=e.i(666012),h=e.i(570101),C=e.i(626937),A=e.i(10372),m=e.i(193695);e.i(52474);var N=e.i(600220),S=e.i(441700),L=t([S]);[S]=L.then?(await L)():L;let R=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/patient-lookup/route",pathname:"/api/clinical/patient-lookup",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/patient-lookup/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:b,workUnitAsyncStorage:I,serverHooks:g}=R;async function O(e,t,i){i.requestMeta&&(0,l.setRequestMeta)(e,i.requestMeta),R.isDev&&(0,l.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/patient-lookup/route";a=a.replace(/\/index$/,"")||"/";let r=await R.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:S,deploymentId:L,params:O,nextConfig:b,parsedUrl:I,isDraftMode:g,prerenderManifest:T,routerServerContext:f,isOnDemandRevalidate:y,revalidateOnlyGenerated:D,resolvedPathname:v,clientReferenceManifest:w,serverActionsManifest:x}=r,P=(0,d.normalizeAppPath)(a),M=!!(T.dynamicRoutes[P]||T.routes[v]),$=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,I,!1):t.end("This page could not be found"),null);if(M&&!g){let e=!!T.routes[v],t=T.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(b.adapterPath)return await $();throw new m.NoFallbackError}}let U=null;!M||R.isDev||g||(U=v,U="/index"===U?"/":U);let F=!0===R.isDev||!M,W=M&&!F;x&&w&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:w,serverActionsManifest:x});let H=e.method||"GET",q=(0,s.getTracer)(),k=q.getActiveScopeSpan(),Y=!!(null==f?void 0:f.isWrappedByNextServer),B=!!(0,l.getRequestMeta)(e,"minimalMode"),j=(0,l.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,b,T,B);null==j||j.resetRequestCache(),globalThis.__incrementalCache=j;let J={params:O,previewProps:T.preview,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:F,incrementalCache:j,cacheLifeProfiles:b.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>R.onRequestError(e,t,a,n,f)},sharedContext:{buildId:S,deploymentId:L}},K=new c.NodeNextRequest(e),z=new c.NodeNextResponse(t),V=p.NextRequestAdapter.fromNodeNextRequest(K,(0,p.signalFromNodeResponse)(t));try{let r,l=async e=>R.handle(V,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=q.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${H} ${a}`)}),o=async r=>{var s,o;let d=async({previousCacheEntry:n})=>{try{if(!B&&y&&D&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await l(r);e.fetchMetrics=J.renderOpts.fetchMetrics;let s=J.renderOpts.pendingWaitUntil;s&&i.waitUntil&&(i.waitUntil(s),s=void 0);let o=J.renderOpts.collectedTags;if(!M)return await (0,E.sendResponse)(K,z,a,J.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(a.headers);o&&(t[A.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,n=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:y})},!1,f),t}},c=await R.handleResponse({req:e,nextConfig:b,cacheKey:U,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:D,responseGenerator:d,waitUntil:i.waitUntil,isMinimalMode:B});if(!M)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(o=c.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",y?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return B&&M||p.delete(A.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,C.getCacheControlHeader)(c.cacheControl)),await (0,E.sendResponse)(K,z,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};Y&&k?await o(k):(r=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(_.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!Y))}catch(t){if(t instanceof m.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:y})},!1,f),M)throw t;return await (0,E.sendResponse)(K,z,new Response(null,{status:500})),null}}e.s(["handler",0,O,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:I})},"routeModule",0,R,"serverHooks",0,g,"workAsyncStorage",0,b,"workUnitAsyncStorage",0,I]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0g9du.s._.js.map