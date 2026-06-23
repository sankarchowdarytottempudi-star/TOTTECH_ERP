module.exports=[193695,(e,t,i)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,i)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,i)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let i=e.split("?")[0].split("#")[0].toLowerCase(),a=t.find(e=>!!(e.startsWith&&i.startsWith(e.startsWith)||e.includes&&i.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(t,i)=>{try{var a=e.i(493458),n=e.i(89171),s=e.i(368105),r=e.i(15270),l=e.i(274173),o=e.i(503031),d=t([s,r]);[s,r]=d.then?(await d)():d;let m=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},E=e=>e&&"object"==typeof e?e:{},C=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",N=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function c(e,t){return(await r.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(o.CLINICAL_MODULE_LABELS,e))}async function u(e,t){let i=await r.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(i[0]?.count||0)>0}async function p(e){let t=await (0,s.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(t?.email)))return null;let i=await (0,a.cookies)(),n=m(i.get("active_clinic_id")?.value),o=m(i.get("active_hospital_id")?.value),d=m(i.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=m(u?.searchParams.get("clinic_id")),_=m(u?.searchParams.get("hospital_id")),h=m(u?.searchParams.get("branch_id")),A=(await r.prisma.$queryRawUnsafe(`
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
      `,t.id??null,p??n,_??o,h??d))[0];if(!A&&o&&t.id&&(A=(await r.prisma.$queryRawUnsafe(`
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
        `,t.id,o,Array.from(N),d,n))[0]),!A)return null;let I=E(A.organization_branding),S=E(A.hospital_branding),R=E(A.branch_branding),b=E(A.clinic_branding),O={...I,...S,...R,...b},L=C(O.logoUrl,O.logo_url,O.logo,O.hospital_logo,O.image),T=C(O.name,O.hospitalName,O.hospital_name,A.hospital_name,A.branch_name,A.clinic_name,A.organization_name),g=await c(Number(A.tenant_id),Number(A.hospital_id));return{user:t,tenantId:Number(A.tenant_id),hospitalId:Number(A.hospital_id),branchId:Number(A.branch_id),clinicId:Number(A.clinic_id),organizationId:m(A.organization_id),organizationName:String(A.organization_name||""),tenantName:String(A.tenant_name||""),hospitalName:String(A.hospital_name||""),hospitalAddress:String(A.hospital_address||""),hospitalPhone:String(A.hospital_phone||""),hospitalEmail:String(A.hospital_email||""),hospitalLicenseNumber:String(A.hospital_license_number||""),branchName:String(A.branch_name||""),clinicName:String(A.clinic_name||""),roleKey:String(A.role_key||"clinical_user"),roleName:String(A.role_name||"Clinical User"),permissions:A.permissions||{},licensedModules:g,branding:{name:T||"Hospital",logoUrl:L||null,primaryColor:C(O.primaryColor,O.primary_color)||"#04142E",accentColor:C(O.accentColor,O.accent_color)||"#D4AF37",source:L?"hospital":"generated"}}}async function _(e){let t=await p(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let i=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(i);if(a&&!(!await u(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:t,response:null}}async function h(e,t){await r.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,h,"requireClinicalContext",0,_]),i()}catch(e){i(e)}},!1),155876,e=>e.a(async(t,i)=>{try{var a=e.i(15270),n=t([a]);[a]=n.then?(await n)():n;let r=e=>String(e||"").trim();async function s(e,t){await a.prisma.$executeRawUnsafe(`
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
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId,t.workflowStage,t.status,t.summary,t.sourceTable||"clinical_patient_workflow_events",t.sourceId??null,JSON.stringify({appointment_id:t.appointmentId??null,...t.metadata||{}}),e.user.id??null)}e.s(["nullableText",0,e=>r(e)||null,"recordWorkflowEvent",0,s,"serialize",0,e=>JSON.parse(JSON.stringify(e,(e,t)=>"bigint"==typeof t?Number(t):t)),"text",0,r,"toDecimal",0,e=>{let t=Number(e);return Number.isFinite(t)?t:null},"toNumber",0,e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null}]),i()}catch(e){i(e)}},!1),942390,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),s=e.i(503031),r=e.i(155876),l=e.i(15270),o=t([n,r,l]);[n,r,l]=o.then?(await o)():o;let u=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]),p=new Set([...u,"hospital_admin"]),_={IVF_ONLY:["PATIENTS","APPOINTMENTS","OP","IVF","BILLING"],CLINICAL_PRO:["PATIENTS","APPOINTMENTS","OP","IVF","LAB","RADIOLOGY","PHARMACY","BILLING","FINANCE"],ENTERPRISE:[...s.CLINICAL_MODULE_CODES]};async function d(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let i=t.context;if(!p.has(i.roleKey))return a.NextResponse.json({error:"Only hospital administrators can view licensing."},{status:403});let o=u.has(i.roleKey),d=await l.prisma.$queryRawUnsafe(`
    SELECT
      h.id,
      h.tenant_id,
      h.hospital_name,
      h.hospital_code,
      h.email,
      h.phone,
      h.status AS hospital_status,
      h.branding,
      COALESCE(hs.plan_name, 'ENTERPRISE') AS plan_name,
      hs.start_date,
      hs.end_date,
      COALESCE(hs.status, h.status, 'ACTIVE') AS subscription_status,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'module_code', hma.module_code,
            'enabled', COALESCE(hma.enabled, false),
            'label', hma.module_code
          ) ORDER BY hma.module_code)
          FROM hospital_module_access hma
          WHERE hma.tenant_id = h.tenant_id
            AND hma.hospital_id = h.id
        ),
        '[]'::jsonb
      ) AS modules
    FROM hospitals h
    LEFT JOIN LATERAL (
      SELECT *
      FROM hospital_subscriptions hs
      WHERE hs.tenant_id = h.tenant_id
        AND hs.hospital_id = h.id
        AND COALESCE(hs.is_deleted, false) = false
      ORDER BY hs.created_at DESC, hs.id DESC
      LIMIT 1
    ) hs ON true
    WHERE h.tenant_id = $1
      AND COALESCE(h.is_deleted, false) = false
      AND ($2::boolean = true OR h.id = $3)
    ORDER BY h.hospital_name ASC
    `,i.tenantId,o,i.hospitalId);return a.NextResponse.json((0,r.serialize)({canEdit:o,modules:s.CLINICAL_MODULE_CODES.map(e=>({module_code:e,label:s.CLINICAL_MODULE_LABELS[e]})),rows:d}))}async function c(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let i=t.context;if(!u.has(i.roleKey))return a.NextResponse.json({error:"Only platform super admins can modify hospital licensing."},{status:403});let o=await e.json(),d=Number(o.hospital_id),c=(0,r.text)(o.plan_name)||"CUSTOM",p=(0,r.text)(o.status)||"ACTIVE",h=(0,r.nullableText)(o.start_date),m=(0,r.nullableText)(o.end_date),E=Array.isArray(o.modules)?o.modules.map(e=>String(e||"")):_[c]||[],C=new Set(E.filter(e=>s.CLINICAL_MODULE_CODES.includes(e)));return d?(await l.prisma.$queryRawUnsafe(`
      SELECT id, hospital_name
      FROM hospitals
      WHERE tenant_id = $1
        AND id = $2
        AND COALESCE(is_deleted, false) = false
      LIMIT 1
      `,i.tenantId,d)).length?(await l.prisma.$transaction(async e=>{for(let t of(await e.$executeRawUnsafe(`
      INSERT INTO hospital_subscriptions (
        tenant_id,
        hospital_id,
        plan_name,
        start_date,
        end_date,
        status,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4::date,$5::date,$6,$7,$7,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,i.tenantId,d,c,h,m,p,i.user.id??null),s.CLINICAL_MODULE_CODES))await e.$executeRawUnsafe(`
        INSERT INTO hospital_module_access (
          tenant_id,
          hospital_id,
          module_code,
          enabled,
          enabled_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (tenant_id, hospital_id, module_code)
        DO UPDATE SET
          enabled = EXCLUDED.enabled,
          updated_by = EXCLUDED.updated_by,
          updated_at = CURRENT_TIMESTAMP
        `,i.tenantId,d,t,C.has(t),i.user.id??null)}),await (0,n.recordClinicalAudit)(i,{moduleName:"hospital_licensing",action:"update",entityType:"hospital",entityId:d,summary:"Hospital subscription and module access updated",payload:{hospital_id:d,plan_name:c,status:p,modules:Array.from(C)}}),a.NextResponse.json({success:!0})):a.NextResponse.json({error:"Hospital not found."},{status:404}):a.NextResponse.json({error:"hospital_id is required."},{status:400})}e.s(["GET",0,d,"PUT",0,c]),i()}catch(e){i(e)}},!1),16699,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),s=e.i(996250),r=e.i(759756),l=e.i(561916),o=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),h=e.i(666012),m=e.i(570101),E=e.i(626937),C=e.i(10372),N=e.i(193695);e.i(52474);var A=e.i(600220),I=e.i(942390),S=t([I]);[I]=S.then?(await S)():S;let b=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/platform/licensing/route",pathname:"/api/clinical/platform/licensing",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/platform/licensing/route.ts",nextConfigOutput:"",userland:I,...{}}),{workAsyncStorage:O,workUnitAsyncStorage:L,serverHooks:T}=b;async function R(e,t,i){i.requestMeta&&(0,r.setRequestMeta)(e,i.requestMeta),b.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/platform/licensing/route";a=a.replace(/\/index$/,"")||"/";let s=await b.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:I,deploymentId:S,params:R,nextConfig:O,parsedUrl:L,isDraftMode:T,prerenderManifest:g,routerServerContext:f,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,resolvedPathname:P,clientReferenceManifest:w,serverActionsManifest:$}=s,x=(0,d.normalizeAppPath)(a),U=!!(g.dynamicRoutes[x]||g.routes[P]),M=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,L,!1):t.end("This page could not be found"),null);if(U&&!T){let e=!!g.routes[P],t=g.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(O.adapterPath)return await M();throw new N.NoFallbackError}}let D=null;!U||b.isDev||T||(D=P,D="/index"===D?"/":D);let F=!0===b.isDev||!U,W=U&&!F;$&&w&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:w,serverActionsManifest:$});let H=e.method||"GET",j=(0,l.getTracer)(),k=j.getActiveScopeSpan(),q=!!(null==f?void 0:f.isWrappedByNextServer),B=!!(0,r.getRequestMeta)(e,"minimalMode"),Y=(0,r.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,O,g,B);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let z={params:R,previewProps:g.preview,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:F,incrementalCache:Y,cacheLifeProfiles:O.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>b.onRequestError(e,t,a,n,f)},sharedContext:{buildId:I,deploymentId:S}},V=new c.NodeNextRequest(e),J=new c.NodeNextResponse(t),G=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let s,r=async e=>b.handle(G,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=j.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${H} ${a}`)}),o=async s=>{var l,o;let d=async({previousCacheEntry:n})=>{try{if(!B&&y&&v&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await r(s);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&i.waitUntil&&(i.waitUntil(l),l=void 0);let o=z.renderOpts.collectedTags;if(!U)return await (0,h.sendResponse)(V,J,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(a.headers);o&&(t[C.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=C.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=C.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:y})},!1,f),t}},c=await b.handleResponse({req:e,nextConfig:O,cacheKey:D,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:g,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,responseGenerator:d,waitUntil:i.waitUntil,isMinimalMode:B});if(!U)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(o=c.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",y?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(c.value.headers);return B&&U||u.delete(C.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,E.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(V,J,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};q&&k?await o(k):(s=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:l.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!q))}catch(t){if(t instanceof N.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:y})},!1,f),U)throw t;return await (0,h.sendResponse)(V,J,new Response(null,{status:500})),null}}e.s(["handler",0,R,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:L})},"routeModule",0,b,"serverHooks",0,T,"workAsyncStorage",0,O,"workUnitAsyncStorage",0,L]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0tmxwxd._.js.map