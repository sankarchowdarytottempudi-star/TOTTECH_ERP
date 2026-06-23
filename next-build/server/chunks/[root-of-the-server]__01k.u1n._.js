module.exports=[193695,(e,i,t)=>{i.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,i,t)=>{i.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,i,t)=>{i.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let i="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===i?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let i=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===i||i.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?i:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let i=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,i){return!(e&&Array.isArray(i)&&0!==i.length)||i.includes(e)},"moduleCodeForClinicalPath",0,function(e){let t=e.split("?")[0].split("#")[0].toLowerCase(),a=i.find(e=>!!(e.startsWith&&t.startsWith(e.startsWith)||e.includes&&t.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(i,t)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),s=e.i(15270),l=e.i(274173),o=e.i(503031),d=i([r,s]);[r,s]=d.then?(await d)():d;let C=e=>{let i=Number(e);return Number.isFinite(i)&&i>0?i:null},E=e=>e&&"object"==typeof e?e:{},m=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",A=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function c(e,i){return(await s.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,i)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(o.CLINICAL_MODULE_LABELS,e))}async function u(e,i){let t=await s.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,i);return Number(t[0]?.count||0)>0}async function p(e){let i=await (0,r.getCurrentUser)();if(!i||!(i?.project==="tottech_clinical_services"||"CLINICAL"===String(i?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(i?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(i?.email)))return null;let t=await (0,a.cookies)(),n=C(t.get("active_clinic_id")?.value),o=C(t.get("active_hospital_id")?.value),d=C(t.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=C(u?.searchParams.get("clinic_id")),h=C(u?.searchParams.get("hospital_id")),_=C(u?.searchParams.get("branch_id")),N=(await s.prisma.$queryRawUnsafe(`
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
      `,i.id??null,p??n,h??o,_??d))[0];if(!N&&o&&i.id&&(N=(await s.prisma.$queryRawUnsafe(`
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
        `,i.id,o,Array.from(A),d,n))[0]),!N)return null;let R=E(N.organization_branding),I=E(N.hospital_branding),b=E(N.branch_branding),S=E(N.clinic_branding),O={...R,...I,...b,...S},L=m(O.logoUrl,O.logo_url,O.logo,O.hospital_logo,O.image),g=m(O.name,O.hospitalName,O.hospital_name,N.hospital_name,N.branch_name,N.clinic_name,N.organization_name),f=await c(Number(N.tenant_id),Number(N.hospital_id));return{user:i,tenantId:Number(N.tenant_id),hospitalId:Number(N.hospital_id),branchId:Number(N.branch_id),clinicId:Number(N.clinic_id),organizationId:C(N.organization_id),organizationName:String(N.organization_name||""),tenantName:String(N.tenant_name||""),hospitalName:String(N.hospital_name||""),hospitalAddress:String(N.hospital_address||""),hospitalPhone:String(N.hospital_phone||""),hospitalEmail:String(N.hospital_email||""),hospitalLicenseNumber:String(N.hospital_license_number||""),branchName:String(N.branch_name||""),clinicName:String(N.clinic_name||""),roleKey:String(N.role_key||"clinical_user"),roleName:String(N.role_name||"Clinical User"),permissions:N.permissions||{},licensedModules:f,branding:{name:g||"Hospital",logoUrl:L||null,primaryColor:m(O.primaryColor,O.primary_color)||"#04142E",accentColor:m(O.accentColor,O.accent_color)||"#D4AF37",source:L?"hospital":"generated"}}}async function h(e){let i=await p(e);if(!i)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let t=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(t);if(a&&!(!await u(i.tenantId,i.hospitalId)||(i.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:i,response:null}}async function _(e,i){await s.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,i.moduleName,i.action,i.entityType??null,i.entityId??null,i.summary??null,JSON.stringify(i.payload??{}))}e.s(["recordClinicalAudit",0,_,"requireClinicalContext",0,h]),t()}catch(e){t(e)}},!1),635063,e=>e.a(async(i,t)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(15270),s=i([n,r]);async function l(e,{params:i}){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let s=t.context,{id:o}=await i,d=Number(o),[c,u,p,h]=await Promise.all([r.prisma.$queryRawUnsafe(`
      SELECT i.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name, p.patient_uid, p.uhid
      FROM billing_invoices i
      LEFT JOIN patients p ON p.id=i.patient_id
      WHERE i.id=$1 AND i.tenant_id=$2 AND i.hospital_id=$3 AND i.branch_id=$4 AND COALESCE(i.is_deleted,false)=false
      LIMIT 1
      `,d,s.tenantId,s.hospitalId,s.branchId),r.prisma.$queryRawUnsafe(`
      SELECT * FROM billing_invoice_items
      WHERE invoice_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY id
      `,d,s.tenantId,s.hospitalId,s.branchId),r.prisma.$queryRawUnsafe(`
      SELECT * FROM payments
      WHERE invoice_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      `,d,s.tenantId,s.hospitalId,s.branchId),r.prisma.$queryRawUnsafe(`
      SELECT * FROM refunds
      WHERE invoice_id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      `,d,s.tenantId,s.hospitalId,s.branchId)]);return c[0]?a.NextResponse.json({invoice:c[0],items:u,payments:p,refunds:h}):a.NextResponse.json({error:"Invoice not found."},{status:404})}[n,r]=s.then?(await s)():s,e.s(["GET",0,l]),t()}catch(e){t(e)}},!1),391e3,e=>e.a(async(i,t)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),l=e.i(561916),o=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),p=e.i(995169),h=e.i(47587),_=e.i(666012),C=e.i(570101),E=e.i(626937),m=e.i(10372),A=e.i(193695);e.i(52474);var N=e.i(600220),R=e.i(635063),I=i([R]);[R]=I.then?(await I)():I;let S=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/billing/invoices/[id]/route",pathname:"/api/clinical/billing/invoices/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/billing/invoices/[id]/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:O,workUnitAsyncStorage:L,serverHooks:g}=S;async function b(e,i,t){t.requestMeta&&(0,s.setRequestMeta)(e,t.requestMeta),S.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/billing/invoices/[id]/route";a=a.replace(/\/index$/,"")||"/";let r=await S.prepare(e,i,{srcPage:a,multiZoneDraftMode:!1});if(!r)return i.statusCode=400,i.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve()),null;let{buildId:R,deploymentId:I,params:b,nextConfig:O,parsedUrl:L,isDraftMode:g,prerenderManifest:f,routerServerContext:T,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,resolvedPathname:P,clientReferenceManifest:w,serverActionsManifest:x}=r,D=(0,d.normalizeAppPath)(a),$=!!(f.dynamicRoutes[D]||f.routes[P]),U=async()=>((null==T?void 0:T.render404)?await T.render404(e,i,L,!1):i.end("This page could not be found"),null);if($&&!g){let e=!!f.routes[P],i=f.dynamicRoutes[D];if(i&&!1===i.fallback&&!e){if(O.adapterPath)return await U();throw new A.NoFallbackError}}let M=null;!$||S.isDev||g||(M=P,M="/index"===M?"/":M);let F=!0===S.isDev||!$,W=$&&!F;x&&w&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:w,serverActionsManifest:x});let H=e.method||"GET",q=(0,l.getTracer)(),j=q.getActiveScopeSpan(),k=!!(null==T?void 0:T.isWrappedByNextServer),Y=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,O,f,Y);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let z={params:b,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:F,incrementalCache:B,cacheLifeProfiles:O.cacheLife,waitUntil:t.waitUntil,onClose:e=>{i.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(i,t,a,n)=>S.onRequestError(e,i,a,n,T)},sharedContext:{buildId:R,deploymentId:I}},J=new c.NodeNextRequest(e),V=new c.NodeNextResponse(i),G=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(i));try{let r,s=async e=>S.handle(G,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":i.statusCode,"next.rsc":!1});let t=q.getRootSpanAttributes();if(!t)return;if(t.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${t.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=t.get("next.route");if(n){let i=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":i}),e.updateName(i),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(i))}else e.updateName(`${H} ${a}`)}),o=async r=>{var l,o;let d=async({previousCacheEntry:n})=>{try{if(!Y&&y&&v&&!n)return i.statusCode=404,i.setHeader("x-nextjs-cache","REVALIDATED"),i.end("This page could not be found"),null;let a=await s(r);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&t.waitUntil&&(t.waitUntil(l),l=void 0);let o=z.renderOpts.collectedTags;if(!$)return await (0,_.sendResponse)(J,V,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),i=(0,C.toNodeOutgoingHttpHeaders)(a.headers);o&&(i[m.NEXT_CACHE_TAGS_HEADER]=o),!i["content-type"]&&e.type&&(i["content-type"]=e.type);let t=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:i},cacheControl:{revalidate:t,expire:n}}}}catch(i){throw(null==n?void 0:n.isStale)&&await S.onRequestError(e,i,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:y})},!1,T),i}},c=await S.handleResponse({req:e,nextConfig:O,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,responseGenerator:d,waitUntil:t.waitUntil,isMinimalMode:Y});if(!$)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(o=c.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});Y||i.setHeader("x-nextjs-cache",y?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),g&&i.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,C.fromNodeOutgoingHttpHeaders)(c.value.headers);return Y&&$||u.delete(m.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||i.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,E.getCacheControlHeader)(c.cacheControl)),await (0,_.sendResponse)(J,V,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};k&&j?await o(j):(r=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:l.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!k))}catch(i){if(i instanceof A.NoFallbackError||await S.onRequestError(e,i,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:y})},!1,T),$)throw i;return await (0,_.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,b,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:L})},"routeModule",0,S,"serverHooks",0,g,"workAsyncStorage",0,O,"workUnitAsyncStorage",0,L]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__01k.u1n._.js.map