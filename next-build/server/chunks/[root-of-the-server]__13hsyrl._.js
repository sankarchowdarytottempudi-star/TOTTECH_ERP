module.exports=[193695,(e,t,i)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,i)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,i)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let i=e.split("?")[0].split("#")[0].toLowerCase(),a=t.find(e=>!!(e.startsWith&&i.startsWith(e.startsWith)||e.includes&&i.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(t,i)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),o=e.i(15270),s=e.i(274173),l=e.i(503031),c=t([r,o]);[r,o]=c.then?(await c)():c;let h=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},C=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",A=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,t){return(await o.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(l.CLINICAL_MODULE_LABELS,e))}async function u(e,t){let i=await o.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(i[0]?.count||0)>0}async function p(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,s.isClinicalServicesEmail)(t?.email)))return null;let i=await (0,a.cookies)(),n=h(i.get("active_clinic_id")?.value),l=h(i.get("active_hospital_id")?.value),c=h(i.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=h(u?.searchParams.get("clinic_id")),_=h(u?.searchParams.get("hospital_id")),m=h(u?.searchParams.get("branch_id")),b=(await o.prisma.$queryRawUnsafe(`
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
      `,t.id??null,p??n,_??l,m??c))[0];if(!b&&l&&t.id&&(b=(await o.prisma.$queryRawUnsafe(`
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
        `,t.id,l,Array.from(A),c,n))[0]),!b)return null;let g=C(b.organization_branding),y=C(b.hospital_branding),N=C(b.branch_branding),R=C(b.clinic_branding),I={...g,...y,...N,...R},S=E(I.logoUrl,I.logo_url,I.logo,I.hospital_logo,I.image),O=E(I.name,I.hospitalName,I.hospital_name,b.hospital_name,b.branch_name,b.clinic_name,b.organization_name),f=await d(Number(b.tenant_id),Number(b.hospital_id));return{user:t,tenantId:Number(b.tenant_id),hospitalId:Number(b.hospital_id),branchId:Number(b.branch_id),clinicId:Number(b.clinic_id),organizationId:h(b.organization_id),organizationName:String(b.organization_name||""),tenantName:String(b.tenant_name||""),hospitalName:String(b.hospital_name||""),hospitalAddress:String(b.hospital_address||""),hospitalPhone:String(b.hospital_phone||""),hospitalEmail:String(b.hospital_email||""),hospitalLicenseNumber:String(b.hospital_license_number||""),branchName:String(b.branch_name||""),clinicName:String(b.clinic_name||""),roleKey:String(b.role_key||"clinical_user"),roleName:String(b.role_name||"Clinical User"),permissions:b.permissions||{},licensedModules:f,branding:{name:O||"Hospital",logoUrl:S||null,primaryColor:E(I.primaryColor,I.primary_color)||"#04142E",accentColor:E(I.accentColor,I.accent_color)||"#D4AF37",source:S?"hospital":"generated"}}}async function _(e){let t=await p(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let i=new URL(e.url).pathname,a=(0,l.moduleCodeForClinicalPath)(i);if(a&&!(!await u(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:l.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:t,response:null}}async function m(e,t){await o.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,m,"requireClinicalContext",0,_]),i()}catch(e){i(e)}},!1),593655,e=>{"use strict";let t={apps:{key:"apps",label:"Monorepo Apps",table:"clinical_production_monorepo_apps",category:"Enterprise Architecture",dateColumn:"created_at",description:"Web admin, patient portal, doctor portal, nurse portal, referral portal, executive dashboard, and mobile API app architecture.",primaryColumns:["app_key","app_name","app_type","folder_path","deployment_target"]},services:{key:"services",label:"Microservices",table:"clinical_production_services",category:"Backend Architecture",dateColumn:"created_at",description:"NestJS service catalog for auth, patients, appointments, doctors, nursing, IP, ER, ICU, OT, IVF, lab, radiology, PACS, pharmacy, inventory, billing, finance, insurance, referrals, reporting, analytics, AI, notifications, and integrations.",primaryColumns:["service_key","service_name","service_type","api_prefix","responsibilities"]},packages:{key:"packages",label:"Shared Packages",table:"clinical_production_packages",category:"Monorepo",dateColumn:"created_at",description:"Shared UI, types, utilities, auth, and Prisma packages for generated clinical services.",primaryColumns:["package_key","package_name","folder_path","package_type","exports"]},infrastructure:{key:"infrastructure",label:"Infrastructure",table:"clinical_production_infrastructure_components",category:"DevOps",dateColumn:"created_at",description:"Docker, Kubernetes, Terraform, monitoring, and backup artifact registry.",primaryColumns:["component_key","component_name","component_type","artifact_path","provider_targets"]},stack:{key:"stack",label:"Technology Stack",table:"clinical_production_technology_stack",category:"Implementation Stack",dateColumn:"created_at",description:"Frontend, backend, database, cache, event bus, storage, testing, monitoring, and logging technology targets.",primaryColumns:["stack_key","stack_area","technology_name","minimum_version","usage_policy"]},"prisma-rules":{key:"prisma-rules",label:"Prisma Rules",table:"clinical_production_prisma_rules",category:"Database",dateColumn:"created_at",description:"Schema, relation, index, seeder, soft-delete, and audit rules for generated Prisma models and migrations.",primaryColumns:["rule_key","rule_name","rule_category","enforcement_level","requirement"]},"api-contracts":{key:"api-contracts",label:"API Contracts",table:"clinical_production_api_contracts",category:"OpenAPI",dateColumn:"created_at",description:"REST API and OpenAPI 3.1 endpoint contracts for every registered service.",primaryColumns:["service_key","method","path","auth_required","tenant_isolation_required"]},events:{key:"events",label:"Event Contracts",table:"clinical_production_event_contracts",category:"RabbitMQ",dateColumn:"created_at",description:"RabbitMQ events for patient, appointment, admission, lab, embryo, invoice, and claim workflows.",primaryColumns:["event_key","event_name","routing_key","producer_service","consumer_services"]},security:{key:"security",label:"Security Controls",table:"clinical_production_security_controls",category:"Security",dateColumn:"created_at",description:"JWT, MFA, SSO, RBAC, ABAC, tenant isolation, encryption, audit, and AI safety controls.",primaryColumns:["control_key","control_name","control_area","severity","requirement"]},testing:{key:"testing",label:"Testing Framework",table:"clinical_production_testing_requirements",category:"Testing",dateColumn:"created_at",description:"Jest, Supertest, Playwright, k6, and security testing requirements.",primaryColumns:["test_key","test_name","test_type","framework","target_coverage"]},devops:{key:"devops",label:"DevOps Artifacts",table:"clinical_production_devops_artifacts",category:"Deployment",dateColumn:"created_at",description:"Dockerfile, Docker Compose, Kubernetes, Prometheus, backup, and CI/CD artifact registry.",primaryColumns:["artifact_key","artifact_name","artifact_type","artifact_path","deployment_stage"]},monitoring:{key:"monitoring",label:"Monitoring Rules",table:"clinical_production_monitoring_rules",category:"Observability",dateColumn:"created_at",description:"Prometheus alert rules for service, database, CPU, memory, errors, claims, and backup failures.",primaryColumns:["rule_key","rule_name","metric_name","threshold_expression","severity"]},backups:{key:"backups",label:"Backup and DR",table:"clinical_production_backup_policies",category:"Disaster Recovery",dateColumn:"created_at",description:"15-minute database RPO, daily full backups, weekly archive, object storage backups, and restore targets.",primaryColumns:["policy_key","policy_name","backup_type","schedule_expression","recovery_target"]},"go-live":{key:"go-live",label:"Go-Live Checklist",table:"clinical_production_go_live_checklist",category:"Production Readiness",dateColumn:"created_at",description:"Functional, security, infrastructure, testing, disaster recovery, audit, training, and migration go-live gates.",primaryColumns:["checklist_key","checklist_item","checklist_category","status","acceptance_evidence"]}};Object.values(t),e.s(["getProductionModuleConfig",0,function(e){return t[e]}])},42998,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(593655),o=e.i(15270),s=t([n,o]);async function l(e,{params:t}){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let s=i.context,{module:c}=await t,d=(0,r.getProductionModuleConfig)(c);if(!d)return a.NextResponse.json({error:"Unknown clinical production-readiness module."},{status:404});let[u,p]=await Promise.all([o.prisma.$queryRawUnsafe(`
        SELECT t.*
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        ORDER BY t.${d.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 400
        `,s.tenantId,s.hospitalId,s.branchId),o.prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE t.${d.dateColumn}::date = CURRENT_DATE)::int AS today
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        `,s.tenantId,s.hospitalId,s.branchId)]);return a.NextResponse.json({context:s,module:d,metrics:p[0]||{},rows:u})}[n,o]=s.then?(await s)():s,e.s(["GET",0,l]),i()}catch(e){i(e)}},!1),77683,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),o=e.i(759756),s=e.i(561916),l=e.i(174677),c=e.i(869741),d=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),h=e.i(570101),C=e.i(626937),E=e.i(10372),A=e.i(193695);e.i(52474);var b=e.i(600220),g=e.i(42998),y=t([g]);[g]=y.then?(await y)():y;let R=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/production/[module]/route",pathname:"/api/clinical/production/[module]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/production/[module]/route.ts",nextConfigOutput:"",userland:g,...{}}),{workAsyncStorage:I,workUnitAsyncStorage:S,serverHooks:O}=R;async function N(e,t,i){i.requestMeta&&(0,o.setRequestMeta)(e,i.requestMeta),R.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/production/[module]/route";a=a.replace(/\/index$/,"")||"/";let r=await R.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:g,deploymentId:y,params:N,nextConfig:I,parsedUrl:S,isDraftMode:O,prerenderManifest:f,routerServerContext:L,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,resolvedPathname:P,clientReferenceManifest:k,serverActionsManifest:x}=r,w=(0,c.normalizeAppPath)(a),D=!!(f.dynamicRoutes[w]||f.routes[P]),U=async()=>((null==L?void 0:L.render404)?await L.render404(e,t,S,!1):t.end("This page could not be found"),null);if(D&&!O){let e=!!f.routes[P],t=f.dynamicRoutes[w];if(t&&!1===t.fallback&&!e){if(I.adapterPath)return await U();throw new A.NoFallbackError}}let M=null;!D||R.isDev||O||(M=P,M="/index"===M?"/":M);let $=!0===R.isDev||!D,F=D&&!$;x&&k&&(0,l.setManifestsSingleton)({page:a,clientReferenceManifest:k,serverActionsManifest:x});let W=e.method||"GET",H=(0,s.getTracer)(),q=H.getActiveScopeSpan(),j=!!(null==L?void 0:L.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),Y=(0,o.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,I,f,B);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let z={params:N,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:$,incrementalCache:Y,cacheLifeProfiles:I.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>R.onRequestError(e,t,a,n,L)},sharedContext:{buildId:g,deploymentId:y}},J=new d.NodeNextRequest(e),V=new d.NodeNextResponse(t),G=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(t));try{let r,o=async e=>R.handle(G,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=H.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${W} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${W} ${a}`)}),l=async r=>{var s,l;let c=async({previousCacheEntry:n})=>{try{if(!B&&v&&T&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await o(r);e.fetchMetrics=z.renderOpts.fetchMetrics;let s=z.renderOpts.pendingWaitUntil;s&&i.waitUntil&&(i.waitUntil(s),s=void 0);let l=z.renderOpts.collectedTags;if(!D)return await (0,m.sendResponse)(J,V,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[E.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:v})},!1,L),t}},d=await R.handleResponse({req:e,nextConfig:I,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,responseGenerator:c,waitUntil:i.waitUntil,isMinimalMode:B});if(!D)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",v?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&D||u.delete(E.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,C.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(J,V,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};j&&q?await l(q):(r=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${W} ${a}`,kind:s.SpanKind.SERVER,attributes:{"http.method":W,"http.target":e.url}},l),void 0,!j))}catch(t){if(t instanceof A.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:v})},!1,L),D)throw t;return await (0,m.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,N,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:S})},"routeModule",0,R,"serverHooks",0,O,"workAsyncStorage",0,I,"workUnitAsyncStorage",0,S]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__13hsyrl._.js.map