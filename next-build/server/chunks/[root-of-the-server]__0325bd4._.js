module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let a=e.split("?")[0].split("#")[0].toLowerCase(),i=t.find(e=>!!(e.startsWith&&a.startsWith(e.startsWith)||e.includes&&a.includes(e.includes)));return i?.moduleCode??null}])},780907,e=>e.a(async(t,a)=>{try{var i=e.i(493458),n=e.i(89171),r=e.i(368105),o=e.i(15270),l=e.i(274173),s=e.i(503031),c=t([r,o]);[r,o]=c.then?(await c)():c;let h=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},C=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",A=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,t){return(await o.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(s.CLINICAL_MODULE_LABELS,e))}async function p(e,t){let a=await o.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(a[0]?.count||0)>0}async function u(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(t?.email)))return null;let a=await (0,i.cookies)(),n=h(a.get("active_clinic_id")?.value),s=h(a.get("active_hospital_id")?.value),c=h(a.get("active_branch_id")?.value),p=e?new URL(e.url):null,u=h(p?.searchParams.get("clinic_id")),_=h(p?.searchParams.get("hospital_id")),m=h(p?.searchParams.get("branch_id")),b=(await o.prisma.$queryRawUnsafe(`
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
      `,t.id??null,u??n,_??s,m??c))[0];if(!b&&s&&t.id&&(b=(await o.prisma.$queryRawUnsafe(`
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
        `,t.id,s,Array.from(A),c,n))[0]),!b)return null;let g=C(b.organization_branding),N=C(b.hospital_branding),y=C(b.branch_branding),I=C(b.clinic_branding),R={...g,...N,...y,...I},S=E(R.logoUrl,R.logo_url,R.logo,R.hospital_logo,R.image),O=E(R.name,R.hospitalName,R.hospital_name,b.hospital_name,b.branch_name,b.clinic_name,b.organization_name),L=await d(Number(b.tenant_id),Number(b.hospital_id));return{user:t,tenantId:Number(b.tenant_id),hospitalId:Number(b.hospital_id),branchId:Number(b.branch_id),clinicId:Number(b.clinic_id),organizationId:h(b.organization_id),organizationName:String(b.organization_name||""),tenantName:String(b.tenant_name||""),hospitalName:String(b.hospital_name||""),hospitalAddress:String(b.hospital_address||""),hospitalPhone:String(b.hospital_phone||""),hospitalEmail:String(b.hospital_email||""),hospitalLicenseNumber:String(b.hospital_license_number||""),branchName:String(b.branch_name||""),clinicName:String(b.clinic_name||""),roleKey:String(b.role_key||"clinical_user"),roleName:String(b.role_name||"Clinical User"),permissions:b.permissions||{},licensedModules:L,branding:{name:O||"Hospital",logoUrl:S||null,primaryColor:E(R.primaryColor,R.primary_color)||"#04142E",accentColor:E(R.accentColor,R.accent_color)||"#D4AF37",source:S?"hospital":"generated"}}}async function _(e){let t=await u(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let a=new URL(e.url).pathname,i=(0,s.moduleCodeForClinicalPath)(a);if(i&&!(!await p(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(i)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:i,module_name:s.CLINICAL_MODULE_LABELS[i]},{status:403})}}return{context:t,response:null}}async function m(e,t){await o.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,m,"requireClinicalContext",0,_]),a()}catch(e){a(e)}},!1),888572,e=>{"use strict";let t={gateway:{key:"gateway",label:"API Gateway Policies",table:"clinical_api_catalog_gateway_policies",category:"Gateway",dateColumn:"created_at",description:"Gateway middleware contract for auth, tenant isolation, audit, rate limiting, and request logging before traffic reaches any clinical API.",primaryColumns:["policy_key","policy_name","middleware_order","middleware_name","requirement"]},rest:{key:"rest",label:"REST API Catalog",table:"clinical_api_catalog_rest_endpoints",category:"REST",dateColumn:"created_at",description:"Versioned REST contracts for Auth, Patients, Appointments, OP, IP, ICU, OT, IVF, Lab, Radiology, Pharmacy, Billing, Insurance, Referral, Finance, Reports, Analytics, Mobile, AI, and Security.",primaryColumns:["method","path","api_group","module_key","permission_key"]},graphql:{key:"graphql",label:"GraphQL Operations",table:"clinical_api_catalog_graphql_operations",category:"GraphQL",dateColumn:"created_at",description:"GraphQL query and mutation contracts for Patient 360, executive dashboards, analytics, and mobile application payloads.",primaryColumns:["operation_key","operation_name","operation_type","graph_area","query_definition"]},websockets:{key:"websockets",label:"WebSocket Channels",table:"clinical_api_catalog_websocket_channels",category:"Realtime",dateColumn:"created_at",description:"Realtime channel contracts for notifications, ICU monitoring, lab updates, telemedicine, and chat.",primaryColumns:["channel_key","channel_name","namespace","purpose","auth_required"]},"websocket-events":{key:"websocket-events",label:"WebSocket Events",table:"clinical_api_catalog_websocket_events",category:"Realtime",dateColumn:"created_at",description:"Realtime event payloads for appointment booking, lab results, claim approvals, patient admission, ICU alerts, telemedicine, and chat.",primaryColumns:["event_key","channel_key","event_name","direction","payload_schema"]},events:{key:"events",label:"Domain Event Catalog",table:"clinical_api_catalog_events",category:"Events",dateColumn:"created_at",description:"Canonical event catalog for PatientCreated, AppointmentBooked, LabResultReady, EmbryoCreated, ClaimApproved, and generated clinical workflow events.",primaryColumns:["event_key","event_name","event_category","producer_service","consumer_services"]},rabbitmq:{key:"rabbitmq",label:"RabbitMQ Topics",table:"clinical_api_catalog_rabbitmq_topics",category:"Messaging",dateColumn:"created_at",description:"RabbitMQ routing-key registry for patient, appointment, admission, lab, IVF, invoice, claim, payment, security, and AI review events.",primaryColumns:["routing_key","exchange_name","event_key","producer_service","dead_letter_queue"]},webhooks:{key:"webhooks",label:"Webhook Contracts",table:"clinical_api_catalog_webhooks",category:"Webhooks",dateColumn:"created_at",description:"Inbound and outbound webhook contracts for lab partners, insurance/TPA, ABHA, payments, claim status, and report-ready callbacks.",primaryColumns:["webhook_key","webhook_name","direction","external_system","path"]},errors:{key:"errors",label:"Error Standards",table:"clinical_api_catalog_error_standards",category:"Error Handling",dateColumn:"created_at",description:"Standardized error-code catalog using the platform response model: success, errorCode, and message.",primaryColumns:["error_code","http_status","module_key","message_template","response_schema"]},versioning:{key:"versioning",label:"API Versioning",table:"clinical_api_catalog_versioning_rules",category:"Versioning",dateColumn:"created_at",description:"API version lifecycle rules for /api/v1 and /api/v2, compatibility policy, and deprecation governance.",primaryColumns:["version_key","version_label","base_path","lifecycle_status","deprecation_policy"]},"rate-limits":{key:"rate-limits",label:"Rate Limit Policies",table:"clinical_api_catalog_rate_limits",category:"Gateway",dateColumn:"created_at",description:"Default, critical, and webhook rate-limit policies, including 100 requests/minute default and 20 requests/minute critical controls.",primaryColumns:["policy_key","policy_name","requests_per_minute","applies_to","reason"]},openapi:{key:"openapi",label:"OpenAPI Specifications",table:"clinical_api_catalog_openapi_specs",category:"OpenAPI 3.1",dateColumn:"created_at",description:"Swagger UI, OpenAPI JSON, and OpenAPI YAML publication contracts generated from the REST API catalog.",primaryColumns:["spec_key","spec_name","openapi_version","output_format","spec_path"]},integrations:{key:"integrations",label:"Integration Contracts",table:"clinical_api_catalog_integration_contracts",category:"Integrations",dateColumn:"created_at",description:"External integration contracts for FHIR R4/R5, HL7, DICOM, PACS, ABHA, Ayushman Bharat, labs, insurance, and payment gateways.",primaryColumns:["integration_name","integration_type","external_system","protocol","auth_scheme"]}};Object.values(t),e.s(["getApiCatalogModuleConfig",0,function(e){return t[e]}])},564862,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),r=e.i(888572),o=e.i(15270),l=t([n,o]);async function s(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let l=a.context,{module:c}=await t,d=(0,r.getApiCatalogModuleConfig)(c);if(!d)return i.NextResponse.json({error:"Unknown clinical API catalog module."},{status:404});let[p,u]=await Promise.all([o.prisma.$queryRawUnsafe(`
        SELECT t.*
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        ORDER BY t.${d.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 500
        `,l.tenantId,l.hospitalId,l.branchId),o.prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE t.${d.dateColumn}::date = CURRENT_DATE)::int AS today
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        `,l.tenantId,l.hospitalId,l.branchId)]);return i.NextResponse.json({context:l,module:d,metrics:u[0]||{},rows:p})}[n,o]=l.then?(await l)():l,e.s(["GET",0,s]),a()}catch(e){a(e)}},!1),31535,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),o=e.i(759756),l=e.i(561916),s=e.i(174677),c=e.i(869741),d=e.i(316795),p=e.i(487718),u=e.i(995169),_=e.i(47587),m=e.i(666012),h=e.i(570101),C=e.i(626937),E=e.i(10372),A=e.i(193695);e.i(52474);var b=e.i(600220),g=e.i(564862),N=t([g]);[g]=N.then?(await N)():N;let I=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/api-catalog/[module]/route",pathname:"/api/clinical/api-catalog/[module]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/api-catalog/[module]/route.ts",nextConfigOutput:"",userland:g,...{}}),{workAsyncStorage:R,workUnitAsyncStorage:S,serverHooks:O}=I;async function y(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),I.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/api-catalog/[module]/route";i=i.replace(/\/index$/,"")||"/";let r=await I.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:g,deploymentId:N,params:y,nextConfig:R,parsedUrl:S,isDraftMode:O,prerenderManifest:L,routerServerContext:f,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,resolvedPathname:w,clientReferenceManifest:P,serverActionsManifest:x}=r,k=(0,c.normalizeAppPath)(i),U=!!(L.dynamicRoutes[k]||L.routes[w]),M=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,S,!1):t.end("This page could not be found"),null);if(U&&!O){let e=!!L.routes[w],t=L.dynamicRoutes[k];if(t&&!1===t.fallback&&!e){if(R.adapterPath)return await M();throw new A.NoFallbackError}}let D=null;!U||I.isDev||O||(D=w,D="/index"===D?"/":D);let $=!0===I.isDev||!U,W=U&&!$;x&&P&&(0,s.setManifestsSingleton)({page:i,clientReferenceManifest:P,serverActionsManifest:x});let F=e.method||"GET",H=(0,l.getTracer)(),q=H.getActiveScopeSpan(),B=!!(null==f?void 0:f.isWrappedByNextServer),j=!!(0,o.getRequestMeta)(e,"minimalMode"),Y=(0,o.getRequestMeta)(e,"incrementalCache")||await I.getIncrementalCache(e,R,L,j);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let z={params:y,previewProps:L.preview,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:$,incrementalCache:Y,cacheLifeProfiles:R.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>I.onRequestError(e,t,i,n,f)},sharedContext:{buildId:g,deploymentId:N}},G=new d.NodeNextRequest(e),V=new d.NodeNextResponse(t),J=p.NextRequestAdapter.fromNodeNextRequest(G,(0,p.signalFromNodeResponse)(t));try{let r,o=async e=>I.handle(J,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${F} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${F} ${i}`)}),s=async r=>{var l,s;let c=async({previousCacheEntry:n})=>{try{if(!j&&v&&T&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(r);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let s=z.renderOpts.collectedTags;if(!U)return await (0,m.sendResponse)(G,V,i,z.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(i.headers);s&&(t[E.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:v})},!1,f),t}},d=await I.handleResponse({req:e,nextConfig:R,cacheKey:D,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:L,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:j});if(!U)return null;if((null==d||null==(l=d.value)?void 0:l.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",v?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return j&&U||p.delete(E.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,C.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(G,V,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};B&&q?await s(q):(r=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(u.BaseServerSpan.handleRequest,{spanName:`${F} ${i}`,kind:l.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},s),void 0,!B))}catch(t){if(t instanceof A.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:v})},!1,f),U)throw t;return await (0,m.sendResponse)(G,V,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:R,workUnitAsyncStorage:S})},"routeModule",0,I,"serverHooks",0,O,"workAsyncStorage",0,R,"workUnitAsyncStorage",0,S]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0325bd4._.js.map