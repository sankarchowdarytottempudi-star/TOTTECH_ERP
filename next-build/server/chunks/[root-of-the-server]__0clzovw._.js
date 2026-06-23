module.exports=[193695,(e,t,i)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,i)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,i)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let i=e.split("?")[0].split("#")[0].toLowerCase(),a=t.find(e=>!!(e.startsWith&&i.startsWith(e.startsWith)||e.includes&&i.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(t,i)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),s=e.i(15270),l=e.i(274173),o=e.i(503031),c=t([r,s]);[r,s]=c.then?(await c)():c;let m=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},C=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",A=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,t){return(await s.prisma.$queryRawUnsafe(`
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
      `,e,t);return Number(i[0]?.count||0)>0}async function p(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(t?.email)))return null;let i=await (0,a.cookies)(),n=m(i.get("active_clinic_id")?.value),o=m(i.get("active_hospital_id")?.value),c=m(i.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=m(u?.searchParams.get("clinic_id")),_=m(u?.searchParams.get("hospital_id")),h=m(u?.searchParams.get("branch_id")),N=(await s.prisma.$queryRawUnsafe(`
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
      `,t.id??null,p??n,_??o,h??c))[0];if(!N&&o&&t.id&&(N=(await s.prisma.$queryRawUnsafe(`
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
        `,t.id,o,Array.from(A),c,n))[0]),!N)return null;let R=C(N.organization_branding),S=C(N.hospital_branding),I=C(N.branch_branding),b=C(N.clinic_branding),O={...R,...S,...I,...b},L=E(O.logoUrl,O.logo_url,O.logo,O.hospital_logo,O.image),g=E(O.name,O.hospitalName,O.hospital_name,N.hospital_name,N.branch_name,N.clinic_name,N.organization_name),T=await d(Number(N.tenant_id),Number(N.hospital_id));return{user:t,tenantId:Number(N.tenant_id),hospitalId:Number(N.hospital_id),branchId:Number(N.branch_id),clinicId:Number(N.clinic_id),organizationId:m(N.organization_id),organizationName:String(N.organization_name||""),tenantName:String(N.tenant_name||""),hospitalName:String(N.hospital_name||""),hospitalAddress:String(N.hospital_address||""),hospitalPhone:String(N.hospital_phone||""),hospitalEmail:String(N.hospital_email||""),hospitalLicenseNumber:String(N.hospital_license_number||""),branchName:String(N.branch_name||""),clinicName:String(N.clinic_name||""),roleKey:String(N.role_key||"clinical_user"),roleName:String(N.role_name||"Clinical User"),permissions:N.permissions||{},licensedModules:T,branding:{name:g||"Hospital",logoUrl:L||null,primaryColor:E(O.primaryColor,O.primary_color)||"#04142E",accentColor:E(O.accentColor,O.accent_color)||"#D4AF37",source:L?"hospital":"generated"}}}async function _(e){let t=await p(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let i=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(i);if(a&&!(!await u(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:t,response:null}}async function h(e,t){await s.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,h,"requireClinicalContext",0,_]),i()}catch(e){i(e)}},!1),414192,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(15270),s=t([n,r]);[n,r]=s.then?(await s)():s;let o=new Set(["DRAFT","SUBMITTED","UNDER_REVIEW","APPROVED","REJECTED","SETTLED"]);async function l(e,{params:t}){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let s=i.context,{id:c}=await t,d=Number(c),u=await e.json(),p=String(u.status||"").toUpperCase();if(!o.has(p))return a.NextResponse.json({error:"Unsupported insurance claim status."},{status:400});let _=await r.prisma.$queryRawUnsafe(`
    UPDATE insurance_claims
    SET status=$5,
        approved_amount=COALESCE($6::numeric, approved_amount),
        rejected_amount=COALESCE($7::numeric, rejected_amount),
        settled_amount=COALESCE($8::numeric, settled_amount),
        pending_amount=GREATEST(COALESCE(claimed_amount,0)-COALESCE($8::numeric, settled_amount,0),0),
        updated_by=$9,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1 AND tenant_id=$2 AND hospital_id=$3 AND branch_id=$4 AND COALESCE(is_deleted,false)=false
    RETURNING *
    `,d,s.tenantId,s.hospitalId,s.branchId,p,u.approved_amount??null,u.rejected_amount??null,u.settled_amount??null,s.user.id??null);return _[0]?(await (0,n.recordClinicalAudit)(s,{moduleName:"insurance_claims",action:"workflow_transition",entityType:"insurance_claims",entityId:d,summary:`Insurance claim moved to ${p}`,payload:{status:p,body:u}}),a.NextResponse.json(_[0])):a.NextResponse.json({error:"Claim not found."},{status:404})}e.s(["PATCH",0,l,"runtime",0,"nodejs"]),i()}catch(e){i(e)}},!1),386156,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),l=e.i(561916),o=e.i(174677),c=e.i(869741),d=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),h=e.i(666012),m=e.i(570101),C=e.i(626937),E=e.i(10372),A=e.i(193695);e.i(52474);var N=e.i(600220),R=e.i(414192),S=t([R]);[R]=S.then?(await S)():S;let b=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/insurance/claims/[id]/workflow/route",pathname:"/api/clinical/insurance/claims/[id]/workflow",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/insurance/claims/[id]/workflow/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:O,workUnitAsyncStorage:L,serverHooks:g}=b;async function I(e,t,i){i.requestMeta&&(0,s.setRequestMeta)(e,i.requestMeta),b.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/insurance/claims/[id]/workflow/route";a=a.replace(/\/index$/,"")||"/";let r=await b.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:R,deploymentId:S,params:I,nextConfig:O,parsedUrl:L,isDraftMode:g,prerenderManifest:T,routerServerContext:f,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,resolvedPathname:w,clientReferenceManifest:P,serverActionsManifest:x}=r,U=(0,c.normalizeAppPath)(a),D=!!(T.dynamicRoutes[U]||T.routes[w]),$=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,L,!1):t.end("This page could not be found"),null);if(D&&!g){let e=!!T.routes[w],t=T.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(O.adapterPath)return await $();throw new A.NoFallbackError}}let M=null;!D||b.isDev||g||(M=w,M="/index"===M?"/":M);let W=!0===b.isDev||!D,F=D&&!W;x&&P&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:P,serverActionsManifest:x});let H=e.method||"GET",j=(0,l.getTracer)(),k=j.getActiveScopeSpan(),q=!!(null==f?void 0:f.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),Y=(0,s.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,O,T,B);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let z={params:I,previewProps:T.preview,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:W,incrementalCache:Y,cacheLifeProfiles:O.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>b.onRequestError(e,t,a,n,f)},sharedContext:{buildId:R,deploymentId:S}},J=new d.NodeNextRequest(e),V=new d.NodeNextResponse(t),G=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(t));try{let r,s=async e=>b.handle(G,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=j.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${H} ${a}`)}),o=async r=>{var l,o;let c=async({previousCacheEntry:n})=>{try{if(!B&&y&&v&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(r);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&i.waitUntil&&(i.waitUntil(l),l=void 0);let o=z.renderOpts.collectedTags;if(!D)return await (0,h.sendResponse)(J,V,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(a.headers);o&&(t[E.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:y})},!1,f),t}},d=await b.handleResponse({req:e,nextConfig:O,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,responseGenerator:c,waitUntil:i.waitUntil,isMinimalMode:B});if(!D)return null;if((null==d||null==(l=d.value)?void 0:l.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(o=d.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",y?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&D||u.delete(E.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,C.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(J,V,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};q&&k?await o(k):(r=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:l.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!q))}catch(t){if(t instanceof A.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:y})},!1,f),D)throw t;return await (0,h.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,I,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:L})},"routeModule",0,b,"serverHooks",0,g,"workAsyncStorage",0,O,"workUnitAsyncStorage",0,L]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0clzovw._.js.map