module.exports=[193695,(e,i,t)=>{i.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,i,t)=>{i.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,i,t)=>{i.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let i="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===i?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let i=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===i||i.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?i:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let i=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,i){return!(e&&Array.isArray(i)&&0!==i.length)||i.includes(e)},"moduleCodeForClinicalPath",0,function(e){let t=e.split("?")[0].split("#")[0].toLowerCase(),a=i.find(e=>!!(e.startsWith&&t.startsWith(e.startsWith)||e.includes&&t.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(i,t)=>{try{var a=e.i(493458),n=e.i(89171),l=e.i(368105),r=e.i(15270),s=e.i(274173),c=e.i(503031),o=i([l,r]);[l,r]=o.then?(await o)():o;let h=e=>{let i=Number(e);return Number.isFinite(i)&&i>0?i:null},C=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",N=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,i){return(await r.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,i)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(c.CLINICAL_MODULE_LABELS,e))}async function u(e,i){let t=await r.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,i);return Number(t[0]?.count||0)>0}async function p(e){let i=await (0,l.getCurrentUser)();if(!i||!(i?.project==="tottech_clinical_services"||"CLINICAL"===String(i?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(i?.platform_type||"").trim().toUpperCase()||(0,s.isClinicalServicesEmail)(i?.email)))return null;let t=await (0,a.cookies)(),n=h(t.get("active_clinic_id")?.value),c=h(t.get("active_hospital_id")?.value),o=h(t.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=h(u?.searchParams.get("clinic_id")),_=h(u?.searchParams.get("hospital_id")),m=h(u?.searchParams.get("branch_id")),A=(await r.prisma.$queryRawUnsafe(`
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
      `,i.id??null,p??n,_??c,m??o))[0];if(!A&&c&&i.id&&(A=(await r.prisma.$queryRawUnsafe(`
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
        `,i.id,c,Array.from(N),o,n))[0]),!A)return null;let I=C(A.organization_branding),b=C(A.hospital_branding),S=C(A.branch_branding),O=C(A.clinic_branding),L={...I,...b,...S,...O},R=E(L.logoUrl,L.logo_url,L.logo,L.hospital_logo,L.image),g=E(L.name,L.hospitalName,L.hospital_name,A.hospital_name,A.branch_name,A.clinic_name,A.organization_name),T=await d(Number(A.tenant_id),Number(A.hospital_id));return{user:i,tenantId:Number(A.tenant_id),hospitalId:Number(A.hospital_id),branchId:Number(A.branch_id),clinicId:Number(A.clinic_id),organizationId:h(A.organization_id),organizationName:String(A.organization_name||""),tenantName:String(A.tenant_name||""),hospitalName:String(A.hospital_name||""),hospitalAddress:String(A.hospital_address||""),hospitalPhone:String(A.hospital_phone||""),hospitalEmail:String(A.hospital_email||""),hospitalLicenseNumber:String(A.hospital_license_number||""),branchName:String(A.branch_name||""),clinicName:String(A.clinic_name||""),roleKey:String(A.role_key||"clinical_user"),roleName:String(A.role_name||"Clinical User"),permissions:A.permissions||{},licensedModules:T,branding:{name:g||"Hospital",logoUrl:R||null,primaryColor:E(L.primaryColor,L.primary_color)||"#04142E",accentColor:E(L.accentColor,L.accent_color)||"#D4AF37",source:R?"hospital":"generated"}}}async function _(e){let i=await p(e);if(!i)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let t=new URL(e.url).pathname,a=(0,c.moduleCodeForClinicalPath)(t);if(a&&!(!await u(i.tenantId,i.hospitalId)||(i.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:c.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:i,response:null}}async function m(e,i){await r.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,i.moduleName,i.action,i.entityType??null,i.entityId??null,i.summary??null,JSON.stringify(i.payload??{}))}e.s(["recordClinicalAudit",0,m,"requireClinicalContext",0,_]),t()}catch(e){t(e)}},!1),254799,(e,i,t)=>{i.exports=e.x("crypto",()=>require("crypto"))},155876,e=>e.a(async(i,t)=>{try{var a=e.i(15270),n=i([a]);[a]=n.then?(await n)():n;let r=e=>String(e||"").trim();async function l(e,i){await a.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,i.patientId??null,i.appointmentId??null,i.workflowStage,i.status,i.summary,JSON.stringify(i.metadata||{}),e.user.id??null),i.patientId&&await a.prisma.$executeRawUnsafe(`
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
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,i.patientId,i.workflowStage,i.status,i.summary,i.sourceTable||"clinical_patient_workflow_events",i.sourceId??null,JSON.stringify({appointment_id:i.appointmentId??null,...i.metadata||{}}),e.user.id??null)}e.s(["nullableText",0,e=>r(e)||null,"recordWorkflowEvent",0,l,"serialize",0,e=>JSON.parse(JSON.stringify(e,(e,i)=>"bigint"==typeof i?Number(i):i)),"text",0,r,"toDecimal",0,e=>{let i=Number(e);return Number.isFinite(i)?i:null},"toNumber",0,e=>{let i=Number(e);return Number.isFinite(i)&&i>0?i:null}]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__06wh545._.js.map