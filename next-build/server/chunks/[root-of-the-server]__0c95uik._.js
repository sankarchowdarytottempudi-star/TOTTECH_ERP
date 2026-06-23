module.exports=[193695,(e,t,i)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,i)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,i)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let i=e.split("?")[0].split("#")[0].toLowerCase(),a=t.find(e=>!!(e.startsWith&&i.startsWith(e.startsWith)||e.includes&&i.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(t,i)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),s=e.i(15270),l=e.i(274173),o=e.i(503031),d=t([r,s]);[r,s]=d.then?(await d)():d;let m=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},h=e=>e&&"object"==typeof e?e:{},C=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",A=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function c(e,t){return(await s.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(o.CLINICAL_MODULE_LABELS,e))}async function u(e,t){let i=await s.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(i[0]?.count||0)>0}async function p(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(t?.email)))return null;let i=await (0,a.cookies)(),n=m(i.get("active_clinic_id")?.value),o=m(i.get("active_hospital_id")?.value),d=m(i.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=m(u?.searchParams.get("clinic_id")),_=m(u?.searchParams.get("hospital_id")),E=m(u?.searchParams.get("branch_id")),N=(await s.prisma.$queryRawUnsafe(`
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
      `,t.id??null,p??n,_??o,E??d))[0];if(!N&&o&&t.id&&(N=(await s.prisma.$queryRawUnsafe(`
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
        `,t.id,o,Array.from(A),d,n))[0]),!N)return null;let S=h(N.organization_branding),I=h(N.hospital_branding),R=h(N.branch_branding),O=h(N.clinic_branding),b={...S,...I,...R,...O},L=C(b.logoUrl,b.logo_url,b.logo,b.hospital_logo,b.image),T=C(b.name,b.hospitalName,b.hospital_name,N.hospital_name,N.branch_name,N.clinic_name,N.organization_name),f=await c(Number(N.tenant_id),Number(N.hospital_id));return{user:t,tenantId:Number(N.tenant_id),hospitalId:Number(N.hospital_id),branchId:Number(N.branch_id),clinicId:Number(N.clinic_id),organizationId:m(N.organization_id),organizationName:String(N.organization_name||""),tenantName:String(N.tenant_name||""),hospitalName:String(N.hospital_name||""),hospitalAddress:String(N.hospital_address||""),hospitalPhone:String(N.hospital_phone||""),hospitalEmail:String(N.hospital_email||""),hospitalLicenseNumber:String(N.hospital_license_number||""),branchName:String(N.branch_name||""),clinicName:String(N.clinic_name||""),roleKey:String(N.role_key||"clinical_user"),roleName:String(N.role_name||"Clinical User"),permissions:N.permissions||{},licensedModules:f,branding:{name:T||"Hospital",logoUrl:L||null,primaryColor:C(b.primaryColor,b.primary_color)||"#04142E",accentColor:C(b.accentColor,b.accent_color)||"#D4AF37",source:L?"hospital":"generated"}}}async function _(e){let t=await p(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let i=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(i);if(a&&!(!await u(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:t,response:null}}async function E(e,t){await s.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,E,"requireClinicalContext",0,_]),i()}catch(e){i(e)}},!1),155876,e=>e.a(async(t,i)=>{try{var a=e.i(15270),n=t([a]);[a]=n.then?(await n)():n;let s=e=>String(e||"").trim();async function r(e,t){await a.prisma.$executeRawUnsafe(`
    INSERT INTO clinical_patient_workflow_events (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      patient_id,
      appointment_id,
      workflow_stage,
      status,
      summary,
      metadata,
      created_by,
      created_at,
      is_deleted
    )
	    VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::int,$7::varchar,$8::varchar,$9::text,$10::jsonb,$11::int,CURRENT_TIMESTAMP,false)
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId??null,t.appointmentId??null,t.workflowStage,t.status,t.summary,JSON.stringify(t.metadata||{}),e.user.id??null),t.patientId&&await a.prisma.$executeRawUnsafe(`
      INSERT INTO clinical_patient_timeline (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        patient_id,
        event_type,
        event_title,
        event_summary,
        source_table,
        source_id,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
	      VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::varchar,$7::varchar,$8::text,$9::varchar,$10::int,$11::jsonb,$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId,t.workflowStage,t.status,t.summary,t.sourceTable||"clinical_patient_workflow_events",t.sourceId??null,JSON.stringify({appointment_id:t.appointmentId??null,...t.metadata||{}}),e.user.id??null)}e.s(["nullableText",0,e=>s(e)||null,"recordWorkflowEvent",0,r,"serialize",0,e=>JSON.parse(JSON.stringify(e,(e,t)=>"bigint"==typeof t?Number(t):t)),"text",0,s,"toDecimal",0,e=>{let t=Number(e);return Number.isFinite(t)?t:null},"toNumber",0,e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null}]),i()}catch(e){i(e)}},!1),618696,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(155876),s=e.i(15270),l=t([n,r,s]);async function o(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let i=t.context,[l,o,d,c,u,p,_]=await Promise.all([s.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(SUM(CASE WHEN payment_type = 'CONSULTATION_FEE' THEN amount ELSE 0 END),0) AS op_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'IP_PAYMENT' THEN amount ELSE 0 END),0) AS ip_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'OT_PAYMENT' THEN amount ELSE 0 END),0) AS ot_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'LAB_PAYMENT' THEN amount ELSE 0 END),0) AS lab_revenue,
        COALESCE(SUM(CASE WHEN payment_type = 'PHARMACY_PAYMENT' THEN amount ELSE 0 END),0) AS pharmacy_revenue,
        COALESCE(SUM(amount),0) AS total_revenue,
        COUNT(*)::int AS payment_count
      FROM clinical_operational_payments
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,i.tenantId,i.hospitalId,i.branchId),s.prisma.$queryRawUnsafe(`
      SELECT payment_date, payment_type, COALESCE(SUM(amount),0) AS amount
      FROM clinical_operational_payments
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      GROUP BY payment_date, payment_type
      ORDER BY payment_date DESC
      LIMIT 120
      `,i.tenantId,i.hospitalId,i.branchId),s.prisma.$queryRawUnsafe(`
      SELECT workflow_stage, status, COUNT(*)::int AS count
      FROM clinical_patient_workflow_events
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      GROUP BY workflow_stage, status
      ORDER BY count DESC
      LIMIT 80
      `,i.tenantId,i.hospitalId,i.branchId),s.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(SUM(d.quantity * COALESCE(m.selling_price,0)),0) AS pharmacy_dispense_value,
        COALESCE(SUM(d.quantity),0) AS medicine_units_dispensed,
        COUNT(*)::int AS dispense_count
      FROM clinical_pharmacy_dispenses d
      LEFT JOIN clinical_medicine_master m
        ON lower(m.medicine_name) = lower(d.medicine_name)
       AND m.tenant_id = d.tenant_id
       AND m.hospital_id = d.hospital_id
       AND m.branch_id = d.branch_id
       AND COALESCE(m.is_deleted,false) = false
      WHERE d.tenant_id = $1 AND d.hospital_id = $2 AND d.branch_id = $3
        AND COALESCE(d.is_deleted,false) = false
      `,i.tenantId,i.hospitalId,i.branchId),s.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*)::int AS lab_order_count,
        COUNT(*) FILTER (WHERE status = 'RESULT_READY')::int AS lab_results_ready,
        COUNT(*) FILTER (WHERE status = 'SAMPLE_COLLECTED')::int AS samples_collected,
        COUNT(*) FILTER (WHERE status = 'BILL_PAID')::int AS lab_bills_paid
      FROM lab_orders
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,i.tenantId,i.hospitalId,i.branchId),s.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*)::int AS rooms_total,
        COUNT(*) FILTER (WHERE status = 'OCCUPIED')::int AS rooms_occupied,
        COUNT(*) FILTER (WHERE status = 'AVAILABLE')::int AS rooms_available,
        COALESCE(SUM(room_rent) FILTER (WHERE status = 'OCCUPIED'),0) AS active_room_rent
      FROM clinical_room_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,i.tenantId,i.hospitalId,i.branchId),s.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*)::int AS appointment_count,
        COUNT(*) FILTER (WHERE status = 'READY_FOR_CONSULTATION')::int AS ready_for_consultation,
        COUNT(*) FILTER (WHERE status = 'IN_CONSULTATION')::int AS in_consultation,
        COUNT(*) FILTER (WHERE status IN ('CHECKED_OUT','COMPLETED'))::int AS completed_consultations
      FROM appointments
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      `,i.tenantId,i.hospitalId,i.branchId)]),E=l[0]||{},m=c[0]||{},h=u[0]||{},C=p[0]||{},A=_[0]||{},N=Number(E.total_revenue||0),S=Number(m.pharmacy_dispense_value||0);return a.NextResponse.json((0,r.serialize)({summary:{...E,...m,...h,...C,...A,referral_commission:0,doctor_revenue:E.op_revenue||0,department_revenue:E.total_revenue||0,salary_expense:0,administrative_expense:0,medicine_burn_rate:S,lab_cost:0,ot_cost:0,current_bills:N,profit:N-S,cash_flow:N},daily:o,workflow:d}))}[n,r,s]=l.then?(await l)():l,e.s(["GET",0,o]),i()}catch(e){i(e)}},!1),577277,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),l=e.i(561916),o=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),E=e.i(666012),m=e.i(570101),h=e.i(626937),C=e.i(10372),A=e.i(193695);e.i(52474);var N=e.i(600220),S=e.i(618696),I=t([S]);[S]=I.then?(await I)():I;let O=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/operations/owner-dashboard/route",pathname:"/api/clinical/operations/owner-dashboard",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/operations/owner-dashboard/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:b,workUnitAsyncStorage:L,serverHooks:T}=O;async function R(e,t,i){i.requestMeta&&(0,s.setRequestMeta)(e,i.requestMeta),O.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/operations/owner-dashboard/route";a=a.replace(/\/index$/,"")||"/";let r=await O.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:S,deploymentId:I,params:R,nextConfig:b,parsedUrl:L,isDraftMode:T,prerenderManifest:f,routerServerContext:y,isOnDemandRevalidate:g,revalidateOnlyGenerated:v,resolvedPathname:w,clientReferenceManifest:U,serverActionsManifest:$}=r,P=(0,d.normalizeAppPath)(a),D=!!(f.dynamicRoutes[P]||f.routes[w]),M=async()=>((null==y?void 0:y.render404)?await y.render404(e,t,L,!1):t.end("This page could not be found"),null);if(D&&!T){let e=!!f.routes[w],t=f.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(b.adapterPath)return await M();throw new A.NoFallbackError}}let x=null;!D||O.isDev||T||(x=w,x="/index"===x?"/":x);let W=!0===O.isDev||!D,F=D&&!W;$&&U&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:U,serverActionsManifest:$});let H=e.method||"GET",q=(0,l.getTracer)(),k=q.getActiveScopeSpan(),Y=!!(null==y?void 0:y.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),j=(0,s.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,b,f,B);null==j||j.resetRequestCache(),globalThis.__incrementalCache=j;let z={params:R,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:W,incrementalCache:j,cacheLifeProfiles:b.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>O.onRequestError(e,t,a,n,y)},sharedContext:{buildId:S,deploymentId:I}},J=new c.NodeNextRequest(e),V=new c.NodeNextResponse(t),G=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(t));try{let r,s=async e=>O.handle(G,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=q.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${H} ${a}`)}),o=async r=>{var l,o;let d=async({previousCacheEntry:n})=>{try{if(!B&&g&&v&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(r);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&i.waitUntil&&(i.waitUntil(l),l=void 0);let o=z.renderOpts.collectedTags;if(!D)return await (0,E.sendResponse)(J,V,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(a.headers);o&&(t[C.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=C.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=C.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,y),t}},c=await O.handleResponse({req:e,nextConfig:b,cacheKey:x,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:g,revalidateOnlyGenerated:v,responseGenerator:d,waitUntil:i.waitUntil,isMinimalMode:B});if(!D)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(o=c.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",g?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(c.value.headers);return B&&D||u.delete(C.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,h.getCacheControlHeader)(c.cacheControl)),await (0,E.sendResponse)(J,V,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};Y&&k?await o(k):(r=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:l.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!Y))}catch(t){if(t instanceof A.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,y),D)throw t;return await (0,E.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,R,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:L})},"routeModule",0,O,"serverHooks",0,T,"workAsyncStorage",0,b,"workUnitAsyncStorage",0,L]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0c95uik._.js.map