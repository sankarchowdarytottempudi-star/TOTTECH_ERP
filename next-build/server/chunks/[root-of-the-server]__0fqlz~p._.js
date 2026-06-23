module.exports=[193695,(e,t,i)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,i)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,i)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let i=e.split("?")[0].split("#")[0].toLowerCase(),a=t.find(e=>!!(e.startsWith&&i.startsWith(e.startsWith)||e.includes&&i.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(t,i)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),s=e.i(15270),o=e.i(274173),l=e.i(503031),c=t([r,s]);[r,s]=c.then?(await c)():c;let h=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},C=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",b=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,t){return(await s.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(l.CLINICAL_MODULE_LABELS,e))}async function u(e,t){let i=await s.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(i[0]?.count||0)>0}async function p(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,o.isClinicalServicesEmail)(t?.email)))return null;let i=await (0,a.cookies)(),n=h(i.get("active_clinic_id")?.value),l=h(i.get("active_hospital_id")?.value),c=h(i.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=h(u?.searchParams.get("clinic_id")),_=h(u?.searchParams.get("hospital_id")),m=h(u?.searchParams.get("branch_id")),A=(await s.prisma.$queryRawUnsafe(`
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
      `,t.id??null,p??n,_??l,m??c))[0];if(!A&&l&&t.id&&(A=(await s.prisma.$queryRawUnsafe(`
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
        `,t.id,l,Array.from(b),c,n))[0]),!A)return null;let N=C(A.organization_branding),R=C(A.hospital_branding),y=C(A.branch_branding),g=C(A.clinic_branding),S={...N,...R,...y,...g},I=E(S.logoUrl,S.logo_url,S.logo,S.hospital_logo,S.image),f=E(S.name,S.hospitalName,S.hospital_name,A.hospital_name,A.branch_name,A.clinic_name,A.organization_name),O=await d(Number(A.tenant_id),Number(A.hospital_id));return{user:t,tenantId:Number(A.tenant_id),hospitalId:Number(A.hospital_id),branchId:Number(A.branch_id),clinicId:Number(A.clinic_id),organizationId:h(A.organization_id),organizationName:String(A.organization_name||""),tenantName:String(A.tenant_name||""),hospitalName:String(A.hospital_name||""),hospitalAddress:String(A.hospital_address||""),hospitalPhone:String(A.hospital_phone||""),hospitalEmail:String(A.hospital_email||""),hospitalLicenseNumber:String(A.hospital_license_number||""),branchName:String(A.branch_name||""),clinicName:String(A.clinic_name||""),roleKey:String(A.role_key||"clinical_user"),roleName:String(A.role_name||"Clinical User"),permissions:A.permissions||{},licensedModules:O,branding:{name:f||"Hospital",logoUrl:I||null,primaryColor:E(S.primaryColor,S.primary_color)||"#04142E",accentColor:E(S.accentColor,S.accent_color)||"#D4AF37",source:I?"hospital":"generated"}}}async function _(e){let t=await p(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let i=new URL(e.url).pathname,a=(0,l.moduleCodeForClinicalPath)(i);if(a&&!(!await u(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:l.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:t,response:null}}async function m(e,t){await s.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,m,"requireClinicalContext",0,_]),i()}catch(e){i(e)}},!1),702258,e=>{"use strict";let t={screens:{key:"screens",label:"Screen Specifications",table:"clinical_business_screens",category:"Business Layer",dateColumn:"created_at",description:"Screen-level specifications containing screen ID, name, module, role access, business rules, workflow states, notifications, reports, and audit events.",primaryColumns:["screen_id","screen_name","module_name","role_access","business_rules"]},fields:{key:"fields",label:"Screen Fields",table:"clinical_business_screen_fields",category:"Business Layer",dateColumn:"created_at",description:"Field dictionary for each screen, including type, mandatory flag, validation summary, dropdown group, masking rule, and display order.",primaryColumns:["screen_id","field_label","field_type","mandatory","validation_summary"]},dropdowns:{key:"dropdowns",label:"Dropdown Values",table:"clinical_business_dropdown_values",category:"Field Dictionary",dateColumn:"created_at",description:"Master dropdown values for gender, blood group, visit type, departments, IVF protocols, embryo status, and embryo grades.",primaryColumns:["dropdown_group","value_key","value_label","sort_order","status"]},validations:{key:"validations",label:"Validation Rules",table:"clinical_business_validation_rules",category:"Validation",dateColumn:"created_at",description:"Business validation rules for uniqueness, past dates, active doctors, appointment slot availability, clinical close rules, IVF consent, critical lab values, and claim documentation.",primaryColumns:["rule_key","screen_id","field_key","rule_type","message"]},workflows:{key:"workflows",label:"Workflows",table:"clinical_business_workflows",category:"Workflow",dateColumn:"created_at",description:"Patient, IP, IVF, and claim workflow definitions from registration/draft states through completion and settlement.",primaryColumns:["workflow_key","workflow_name","module_name","description"]},states:{key:"states",label:"Workflow States",table:"clinical_business_workflow_states",category:"Workflow",dateColumn:"created_at",description:"Ordered workflow states for patient, IP, IVF, and insurance claim workflows.",primaryColumns:["workflow_key","state_name","state_order","allowed_roles"]},approvals:{key:"approvals",label:"Approval Matrix",table:"clinical_business_approval_rules",category:"Approvals",dateColumn:"created_at",description:"Refund and discount approval matrix with amount/percentage thresholds, approver roles, audit, and reason requirements.",primaryColumns:["approval_type","condition_label","condition_expression","approver_role","reason_required"]},reports:{key:"reports",label:"Report Definitions",table:"clinical_business_reports",category:"Reporting",dateColumn:"created_at",description:"Business report definitions for Daily OP, Daily Admission, IVF Success, Lab Revenue, and Referral Revenue reports.",primaryColumns:["report_id","report_name","module_name","supported_formats","permission_key"]},"report-columns":{key:"report-columns",label:"Report Columns",table:"clinical_business_report_columns",category:"Reporting",dateColumn:"created_at",description:"Column-level definitions for each report, including data type and order.",primaryColumns:["report_id","column_label","data_type","sort_order"]},exports:{key:"exports",label:"Export Rules",table:"clinical_business_export_rules",category:"Reporting",dateColumn:"created_at",description:"PDF, Excel, CSV, and JSON export controls requiring permission, audit log, and reason.",primaryColumns:["export_format","permission_required","audit_required","reason_required","applies_to"]},templates:{key:"templates",label:"Communication Templates",table:"clinical_business_communication_templates",category:"Communication",dateColumn:"created_at",description:"Email, SMS, WhatsApp, and push notification templates for appointments, lab reports, payments, registration, IVF reminders, and prescriptions.",primaryColumns:["channel","template_name","trigger_event","subject_template","variables"]},audit:{key:"audit",label:"Audit Rules",table:"clinical_business_audit_rules",category:"Audit",dateColumn:"created_at",description:"Create, update, delete, view, export, print, and share audit rules across clinical and business modules.",primaryColumns:["action_key","module_name","entity_type","reason_required","old_new_required"]},sensitive:{key:"sensitive",label:"Sensitive Access",table:"clinical_business_sensitive_access_rules",category:"Audit",dateColumn:"created_at",description:"Sensitive data access rules for ABHA, Aadhaar, insurance, embryology records, and financial records.",primaryColumns:["sensitive_area","fields","allowed_roles","audit_event","masking_required"]},documents:{key:"documents",label:"Document Templates",table:"clinical_business_document_templates",category:"Documents",dateColumn:"created_at",description:"Document template definitions for prescription, discharge summary, lab report, radiology report, insurance claim, consent form, IVF consent, and embryology report.",primaryColumns:["template_name","module_name","output_formats","required_sections","signer_roles"]}};Object.values(t),e.s(["getBusinessSpecModuleConfig",0,function(e){return t[e]}])},493161,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(702258),s=e.i(15270),o=t([n,s]);async function l(e,{params:t}){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let o=i.context,{module:c}=await t,d=(0,r.getBusinessSpecModuleConfig)(c);if(!d)return a.NextResponse.json({error:"Unknown clinical business specification module."},{status:404});let[u,p]=await Promise.all([s.prisma.$queryRawUnsafe(`
        SELECT t.*
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        ORDER BY t.${d.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 500
        `,o.tenantId,o.hospitalId,o.branchId),s.prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE t.${d.dateColumn}::date = CURRENT_DATE)::int AS today
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        `,o.tenantId,o.hospitalId,o.branchId)]);return a.NextResponse.json({context:o,module:d,metrics:p[0]||{},rows:u})}[n,s]=o.then?(await o)():o,e.s(["GET",0,l]),i()}catch(e){i(e)}},!1),58180,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),o=e.i(561916),l=e.i(174677),c=e.i(869741),d=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),h=e.i(570101),C=e.i(626937),E=e.i(10372),b=e.i(193695);e.i(52474);var A=e.i(600220),N=e.i(493161),R=t([N]);[N]=R.then?(await R)():R;let g=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/business-spec/[module]/route",pathname:"/api/clinical/business-spec/[module]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/business-spec/[module]/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:I,serverHooks:f}=g;async function y(e,t,i){i.requestMeta&&(0,s.setRequestMeta)(e,i.requestMeta),g.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/business-spec/[module]/route";a=a.replace(/\/index$/,"")||"/";let r=await g.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:N,deploymentId:R,params:y,nextConfig:S,parsedUrl:I,isDraftMode:f,prerenderManifest:O,routerServerContext:L,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,resolvedPathname:w,clientReferenceManifest:x,serverActionsManifest:P}=r,D=(0,c.normalizeAppPath)(a),U=!!(O.dynamicRoutes[D]||O.routes[w]),k=async()=>((null==L?void 0:L.render404)?await L.render404(e,t,I,!1):t.end("This page could not be found"),null);if(U&&!f){let e=!!O.routes[w],t=O.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await k();throw new b.NoFallbackError}}let M=null;!U||g.isDev||f||(M=w,M="/index"===M?"/":M);let F=!0===g.isDev||!U,$=U&&!F;P&&x&&(0,l.setManifestsSingleton)({page:a,clientReferenceManifest:x,serverActionsManifest:P});let W=e.method||"GET",H=(0,o.getTracer)(),q=H.getActiveScopeSpan(),B=!!(null==L?void 0:L.isWrappedByNextServer),j=!!(0,s.getRequestMeta)(e,"minimalMode"),Y=(0,s.getRequestMeta)(e,"incrementalCache")||await g.getIncrementalCache(e,S,O,j);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let V={params:y,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:F,incrementalCache:Y,cacheLifeProfiles:S.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>g.onRequestError(e,t,a,n,L)},sharedContext:{buildId:N,deploymentId:R}},z=new d.NodeNextRequest(e),J=new d.NodeNextResponse(t),G=u.NextRequestAdapter.fromNodeNextRequest(z,(0,u.signalFromNodeResponse)(t));try{let r,s=async e=>g.handle(G,V).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=H.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${W} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${W} ${a}`)}),l=async r=>{var o,l;let c=async({previousCacheEntry:n})=>{try{if(!j&&v&&T&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(r);e.fetchMetrics=V.renderOpts.fetchMetrics;let o=V.renderOpts.pendingWaitUntil;o&&i.waitUntil&&(i.waitUntil(o),o=void 0);let l=V.renderOpts.collectedTags;if(!U)return await (0,m.sendResponse)(z,J,a,V.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[E.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==V.renderOpts.collectedRevalidate&&!(V.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&V.renderOpts.collectedRevalidate,n=void 0===V.renderOpts.collectedExpire||V.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:V.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await g.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:v})},!1,L),t}},d=await g.handleResponse({req:e,nextConfig:S,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,responseGenerator:c,waitUntil:i.waitUntil,isMinimalMode:j});if(!U)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",v?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return j&&U||u.delete(E.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,C.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(z,J,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};B&&q?await l(q):(r=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${W} ${a}`,kind:o.SpanKind.SERVER,attributes:{"http.method":W,"http.target":e.url}},l),void 0,!B))}catch(t){if(t instanceof b.NoFallbackError||await g.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:v})},!1,L),U)throw t;return await (0,m.sendResponse)(z,J,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:I})},"routeModule",0,g,"serverHooks",0,f,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,I]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0fqlz~p._.js.map