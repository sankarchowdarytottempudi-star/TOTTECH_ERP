module.exports=[193695,(e,i,t)=>{i.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,i,t)=>{i.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,i,t)=>{i.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let i="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===i?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let i=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===i||i.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?i:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let i=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,i){return!(e&&Array.isArray(i)&&0!==i.length)||i.includes(e)},"moduleCodeForClinicalPath",0,function(e){let t=e.split("?")[0].split("#")[0].toLowerCase(),a=i.find(e=>!!(e.startsWith&&t.startsWith(e.startsWith)||e.includes&&t.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(i,t)=>{try{var a=e.i(493458),n=e.i(89171),l=e.i(368105),r=e.i(15270),s=e.i(274173),o=e.i(503031),c=i([l,r]);[l,r]=c.then?(await c)():c;let E=e=>{let i=Number(e);return Number.isFinite(i)&&i>0?i:null},C=e=>e&&"object"==typeof e?e:{},A=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",m=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,i){return(await r.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,i)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(o.CLINICAL_MODULE_LABELS,e))}async function p(e,i){let t=await r.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,i);return Number(t[0]?.count||0)>0}async function _(e){let i=await (0,l.getCurrentUser)();if(!i||!(i?.project==="tottech_clinical_services"||"CLINICAL"===String(i?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(i?.platform_type||"").trim().toUpperCase()||(0,s.isClinicalServicesEmail)(i?.email)))return null;let t=await (0,a.cookies)(),n=E(t.get("active_clinic_id")?.value),o=E(t.get("active_hospital_id")?.value),c=E(t.get("active_branch_id")?.value),p=e?new URL(e.url):null,_=E(p?.searchParams.get("clinic_id")),u=E(p?.searchParams.get("hospital_id")),h=E(p?.searchParams.get("branch_id")),N=(await r.prisma.$queryRawUnsafe(`
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
      `,i.id??null,_??n,u??o,h??c))[0];if(!N&&o&&i.id&&(N=(await r.prisma.$queryRawUnsafe(`
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
        `,i.id,o,Array.from(m),c,n))[0]),!N)return null;let R=C(N.organization_branding),S=C(N.hospital_branding),O=C(N.branch_branding),b=C(N.clinic_branding),I={...R,...S,...O,...b},g=A(I.logoUrl,I.logo_url,I.logo,I.hospital_logo,I.image),L=A(I.name,I.hospitalName,I.hospital_name,N.hospital_name,N.branch_name,N.clinic_name,N.organization_name),f=await d(Number(N.tenant_id),Number(N.hospital_id));return{user:i,tenantId:Number(N.tenant_id),hospitalId:Number(N.hospital_id),branchId:Number(N.branch_id),clinicId:Number(N.clinic_id),organizationId:E(N.organization_id),organizationName:String(N.organization_name||""),tenantName:String(N.tenant_name||""),hospitalName:String(N.hospital_name||""),hospitalAddress:String(N.hospital_address||""),hospitalPhone:String(N.hospital_phone||""),hospitalEmail:String(N.hospital_email||""),hospitalLicenseNumber:String(N.hospital_license_number||""),branchName:String(N.branch_name||""),clinicName:String(N.clinic_name||""),roleKey:String(N.role_key||"clinical_user"),roleName:String(N.role_name||"Clinical User"),permissions:N.permissions||{},licensedModules:f,branding:{name:L||"Hospital",logoUrl:g||null,primaryColor:A(I.primaryColor,I.primary_color)||"#04142E",accentColor:A(I.accentColor,I.accent_color)||"#D4AF37",source:g?"hospital":"generated"}}}async function u(e){let i=await _(e);if(!i)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let t=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(t);if(a&&!(!await p(i.tenantId,i.hospitalId)||(i.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:i,response:null}}async function h(e,i){await r.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,i.moduleName,i.action,i.entityType??null,i.entityId??null,i.summary??null,JSON.stringify(i.payload??{}))}e.s(["recordClinicalAudit",0,h,"requireClinicalContext",0,u]),t()}catch(e){t(e)}},!1),968173,e=>e.a(async(i,t)=>{try{var a=e.i(89171),n=e.i(780907),l=e.i(15270),r=i([n,l]);async function s(e){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let t=i.context,[r,s,o,c,d,p,_]=await Promise.all([l.prisma.$queryRawUnsafe(`
      SELECT
        (SELECT COUNT(*)::int FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'clinical_api_catalog_%') AS catalog_tables,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_gateway_policies WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS gateway_policies,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_rest_endpoints WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS rest_endpoints,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_graphql_operations WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS graphql_operations,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_websocket_channels WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS websocket_channels,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_websocket_events WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS websocket_events,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_events WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS event_catalog,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_rabbitmq_topics WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS rabbitmq_topics,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_webhooks WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS webhooks,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_error_standards WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS error_standards,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_versioning_rules WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS versioning_rules,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_rate_limits WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS rate_limits,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_openapi_specs WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS openapi_specs,
        (SELECT COUNT(*)::int FROM clinical_api_catalog_integration_contracts WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false) AS integration_contracts
      `,t.tenantId,t.hospitalId,t.branchId),l.prisma.$queryRawUnsafe(`
      SELECT policy_key, policy_name, middleware_order, middleware_name, requirement
      FROM clinical_api_catalog_gateway_policies
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY middleware_order
      `,t.tenantId,t.hospitalId,t.branchId),l.prisma.$queryRawUnsafe(`
      SELECT endpoint_name, method, path, api_group, module_key, permission_key, rate_limit_policy
      FROM clinical_api_catalog_rest_endpoints
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY api_group, path, method
      LIMIT 120
      `,t.tenantId,t.hospitalId,t.branchId),l.prisma.$queryRawUnsafe(`
      SELECT operation_key, operation_name, operation_type, graph_area, query_definition
      FROM clinical_api_catalog_graphql_operations
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY graph_area, operation_name
      LIMIT 80
      `,t.tenantId,t.hospitalId,t.branchId),l.prisma.$queryRawUnsafe(`
      SELECT event_key, event_name, event_category, producer_service, consumer_services
      FROM clinical_api_catalog_events
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY event_category, event_name
      LIMIT 80
      `,t.tenantId,t.hospitalId,t.branchId),l.prisma.$queryRawUnsafe(`
      SELECT webhook_key, webhook_name, direction, external_system, path, auth_scheme
      FROM clinical_api_catalog_webhooks
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY direction, external_system
      `,t.tenantId,t.hospitalId,t.branchId),l.prisma.$queryRawUnsafe(`
      SELECT contract_key, integration_name, integration_type, external_system, protocol, auth_scheme
      FROM clinical_api_catalog_integration_contracts
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND COALESCE(is_deleted,false)=false
      ORDER BY integration_type, integration_name
      `,t.tenantId,t.hospitalId,t.branchId)]);return a.NextResponse.json({context:t,counts:r[0]||{},gateway:s,rest:o,graphql:c,events:d,webhooks:p,integrations:_})}[n,l]=r.then?(await r)():r,e.s(["GET",0,s]),t()}catch(e){t(e)}},!1),738292,e=>e.a(async(i,t)=>{try{var a=e.i(747909),n=e.i(174017),l=e.i(996250),r=e.i(759756),s=e.i(561916),o=e.i(174677),c=e.i(869741),d=e.i(316795),p=e.i(487718),_=e.i(995169),u=e.i(47587),h=e.i(666012),E=e.i(570101),C=e.i(626937),A=e.i(10372),m=e.i(193695);e.i(52474);var N=e.i(600220),R=e.i(968173),S=i([R]);[R]=S.then?(await S)():S;let b=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/api-catalog/registry/route",pathname:"/api/clinical/api-catalog/registry",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/api-catalog/registry/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:I,workUnitAsyncStorage:g,serverHooks:L}=b;async function O(e,i,t){t.requestMeta&&(0,r.setRequestMeta)(e,t.requestMeta),b.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/api-catalog/registry/route";a=a.replace(/\/index$/,"")||"/";let l=await b.prepare(e,i,{srcPage:a,multiZoneDraftMode:!1});if(!l)return i.statusCode=400,i.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve()),null;let{buildId:R,deploymentId:S,params:O,nextConfig:I,parsedUrl:g,isDraftMode:L,prerenderManifest:f,routerServerContext:T,isOnDemandRevalidate:y,revalidateOnlyGenerated:D,resolvedPathname:$,clientReferenceManifest:v,serverActionsManifest:w}=l,U=(0,c.normalizeAppPath)(a),P=!!(f.dynamicRoutes[U]||f.routes[$]),x=async()=>((null==T?void 0:T.render404)?await T.render404(e,i,g,!1):i.end("This page could not be found"),null);if(P&&!L){let e=!!f.routes[$],i=f.dynamicRoutes[U];if(i&&!1===i.fallback&&!e){if(I.adapterPath)return await x();throw new m.NoFallbackError}}let M=null;!P||b.isDev||L||(M=$,M="/index"===M?"/":M);let W=!0===b.isDev||!P,F=P&&!W;w&&v&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:v,serverActionsManifest:w});let H=e.method||"GET",k=(0,s.getTracer)(),q=k.getActiveScopeSpan(),Y=!!(null==T?void 0:T.isWrappedByNextServer),B=!!(0,r.getRequestMeta)(e,"minimalMode"),j=(0,r.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,I,f,B);null==j||j.resetRequestCache(),globalThis.__incrementalCache=j;let z={params:O,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:W,incrementalCache:j,cacheLifeProfiles:I.cacheLife,waitUntil:t.waitUntil,onClose:e=>{i.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(i,t,a,n)=>b.onRequestError(e,i,a,n,T)},sharedContext:{buildId:R,deploymentId:S}},J=new d.NodeNextRequest(e),V=new d.NodeNextResponse(i),G=p.NextRequestAdapter.fromNodeNextRequest(J,(0,p.signalFromNodeResponse)(i));try{let l,r=async e=>b.handle(G,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":i.statusCode,"next.rsc":!1});let t=k.getRootSpanAttributes();if(!t)return;if(t.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${t.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=t.get("next.route");if(n){let i=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":i}),e.updateName(i),l&&l!==e&&(l.setAttribute("http.route",n),l.updateName(i))}else e.updateName(`${H} ${a}`)}),o=async l=>{var s,o;let c=async({previousCacheEntry:n})=>{try{if(!B&&y&&D&&!n)return i.statusCode=404,i.setHeader("x-nextjs-cache","REVALIDATED"),i.end("This page could not be found"),null;let a=await r(l);e.fetchMetrics=z.renderOpts.fetchMetrics;let s=z.renderOpts.pendingWaitUntil;s&&t.waitUntil&&(t.waitUntil(s),s=void 0);let o=z.renderOpts.collectedTags;if(!P)return await (0,h.sendResponse)(J,V,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),i=(0,E.toNodeOutgoingHttpHeaders)(a.headers);o&&(i[A.NEXT_CACHE_TAGS_HEADER]=o),!i["content-type"]&&e.type&&(i["content-type"]=e.type);let t=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:i},cacheControl:{revalidate:t,expire:n}}}}catch(i){throw(null==n?void 0:n.isStale)&&await b.onRequestError(e,i,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:y})},!1,T),i}},d=await b.handleResponse({req:e,nextConfig:I,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:D,responseGenerator:c,waitUntil:t.waitUntil,isMinimalMode:B});if(!P)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(o=d.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||i.setHeader("x-nextjs-cache",y?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),L&&i.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,E.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&P||p.delete(A.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||i.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,C.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(J,V,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};Y&&q?await o(q):(l=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(_.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!Y))}catch(i){if(i instanceof m.NoFallbackError||await b.onRequestError(e,i,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:y})},!1,T),P)throw i;return await (0,h.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,O,"patchFetch",0,function(){return(0,l.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:g})},"routeModule",0,b,"serverHooks",0,L,"workAsyncStorage",0,I,"workUnitAsyncStorage",0,g]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ip7sw5._.js.map