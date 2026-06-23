module.exports=[193695,(e,i,t)=>{i.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,i,t)=>{i.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,i,t)=>{i.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let i="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===i?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let i=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===i||i.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?i:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let i=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,i){return!(e&&Array.isArray(i)&&0!==i.length)||i.includes(e)},"moduleCodeForClinicalPath",0,function(e){let t=e.split("?")[0].split("#")[0].toLowerCase(),a=i.find(e=>!!(e.startsWith&&t.startsWith(e.startsWith)||e.includes&&t.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(i,t)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),s=e.i(15270),l=e.i(274173),o=e.i(503031),c=i([r,s]);[r,s]=c.then?(await c)():c;let m=e=>{let i=Number(e);return Number.isFinite(i)&&i>0?i:null},C=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",A=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,i){return(await s.prisma.$queryRawUnsafe(`
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
      `,e,i);return Number(t[0]?.count||0)>0}async function p(e){let i=await (0,r.getCurrentUser)();if(!i||!(i?.project==="tottech_clinical_services"||"CLINICAL"===String(i?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(i?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(i?.email)))return null;let t=await (0,a.cookies)(),n=m(t.get("active_clinic_id")?.value),o=m(t.get("active_hospital_id")?.value),c=m(t.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=m(u?.searchParams.get("clinic_id")),_=m(u?.searchParams.get("hospital_id")),h=m(u?.searchParams.get("branch_id")),N=(await s.prisma.$queryRawUnsafe(`
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
      `,i.id??null,p??n,_??o,h??c))[0];if(!N&&o&&i.id&&(N=(await s.prisma.$queryRawUnsafe(`
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
        `,i.id,o,Array.from(A),c,n))[0]),!N)return null;let R=C(N.organization_branding),I=C(N.hospital_branding),S=C(N.branch_branding),O=C(N.clinic_branding),g={...R,...I,...S,...O},b=E(g.logoUrl,g.logo_url,g.logo,g.hospital_logo,g.image),y=E(g.name,g.hospitalName,g.hospital_name,N.hospital_name,N.branch_name,N.clinic_name,N.organization_name),L=await d(Number(N.tenant_id),Number(N.hospital_id));return{user:i,tenantId:Number(N.tenant_id),hospitalId:Number(N.hospital_id),branchId:Number(N.branch_id),clinicId:Number(N.clinic_id),organizationId:m(N.organization_id),organizationName:String(N.organization_name||""),tenantName:String(N.tenant_name||""),hospitalName:String(N.hospital_name||""),hospitalAddress:String(N.hospital_address||""),hospitalPhone:String(N.hospital_phone||""),hospitalEmail:String(N.hospital_email||""),hospitalLicenseNumber:String(N.hospital_license_number||""),branchName:String(N.branch_name||""),clinicName:String(N.clinic_name||""),roleKey:String(N.role_key||"clinical_user"),roleName:String(N.role_name||"Clinical User"),permissions:N.permissions||{},licensedModules:L,branding:{name:y||"Hospital",logoUrl:b||null,primaryColor:E(g.primaryColor,g.primary_color)||"#04142E",accentColor:E(g.accentColor,g.accent_color)||"#D4AF37",source:b?"hospital":"generated"}}}async function _(e){let i=await p(e);if(!i)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let t=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(t);if(a&&!(!await u(i.tenantId,i.hospitalId)||(i.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:i,response:null}}async function h(e,i){await s.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,i.moduleName,i.action,i.entityType??null,i.entityId??null,i.summary??null,JSON.stringify(i.payload??{}))}e.s(["recordClinicalAudit",0,h,"requireClinicalContext",0,_]),t()}catch(e){t(e)}},!1),270683,e=>e.a(async(i,t)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(15270),s=i([n,r]);async function l(e){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let t=i.context,[s,l,o]=await Promise.all([r.prisma.$queryRawUnsafe(`
      SELECT role_key, role_name, permissions, field_permissions
      FROM clinical_roles
      WHERE tenant_id=$1
        AND COALESCE(hospital_id,$2)=$2
        AND COALESCE(branch_id,$3)=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY role_key
      `,t.tenantId,t.hospitalId,t.branchId),r.prisma.$queryRawUnsafe(`
      SELECT permission_key, module_key, action_key, audit_required, requires_approval, status
      FROM clinical_security_permissions
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY module_key, action_key
      `,t.tenantId,t.hospitalId,t.branchId),r.prisma.$queryRawUnsafe(`
      SELECT role_key, permission_key, access_decision, record_scope_policy, field_mask_profile
      FROM clinical_security_role_permissions
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY role_key, permission_key
      `,t.tenantId,t.hospitalId,t.branchId)]),c=new Set(s.map(e=>String(e.role_key))),d=new Set(l.map(e=>String(e.permission_key))),u=[...s.filter(e=>!e.permissions||"{}"===JSON.stringify(e.permissions)).map(e=>({severity:"MEDIUM",finding:"Role has no structured permissions JSON.",role_key:e.role_key})),...o.filter(e=>!c.has(String(e.role_key))).map(e=>({severity:"HIGH",finding:"Role permission references a missing role.",role_key:e.role_key,permission_key:e.permission_key})),...o.filter(e=>!d.has(String(e.permission_key))).map(e=>({severity:"HIGH",finding:"Role permission references a missing permission.",role_key:e.role_key,permission_key:e.permission_key})),...l.filter(e=>e.status&&"ACTIVE"!==String(e.status)).map(e=>({severity:"LOW",finding:"Permission is not active.",permission_key:e.permission_key,status:e.status}))];for(let e of u.length?u:[{severity:"INFO",finding:"No role permission gaps detected."}])await r.prisma.$executeRawUnsafe(`
      INSERT INTO clinical_role_permission_audit (
        tenant_id,
        hospital_id,
        branch_id,
        role_key,
        permission_key,
        audit_status,
        finding,
        created_by,
        created_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,false)
      `,t.tenantId,t.hospitalId,t.branchId,String(e.role_key||""),String(e.permission_key||""),String(e.severity||"INFO"),String(e.finding||""),t.user.id??null);return await (0,n.recordClinicalAudit)(t,{moduleName:"clinical_security",action:"role_permission_audit",summary:`Role permission audit completed with ${u.length} findings.`,payload:{roles:s.length,permissions:l.length,findings:u.length}}),a.NextResponse.json({status:u.some(e=>"HIGH"===e.severity)?"PARTIAL":"WORKING",roles:s.length,permissions:l.length,rolePermissions:o.length,findings:u})}[n,r]=s.then?(await s)():s,e.s(["GET",0,l,"runtime",0,"nodejs"]),t()}catch(e){t(e)}},!1),258043,e=>e.a(async(i,t)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),l=e.i(561916),o=e.i(174677),c=e.i(869741),d=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),h=e.i(666012),m=e.i(570101),C=e.i(626937),E=e.i(10372),A=e.i(193695);e.i(52474);var N=e.i(600220),R=e.i(270683),I=i([R]);[R]=I.then?(await I)():I;let O=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/security/role-permission-audit/route",pathname:"/api/clinical/security/role-permission-audit",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/security/role-permission-audit/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:b,serverHooks:y}=O;async function S(e,i,t){t.requestMeta&&(0,s.setRequestMeta)(e,t.requestMeta),O.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/security/role-permission-audit/route";a=a.replace(/\/index$/,"")||"/";let r=await O.prepare(e,i,{srcPage:a,multiZoneDraftMode:!1});if(!r)return i.statusCode=400,i.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve()),null;let{buildId:R,deploymentId:I,params:S,nextConfig:g,parsedUrl:b,isDraftMode:y,prerenderManifest:L,routerServerContext:f,isOnDemandRevalidate:T,revalidateOnlyGenerated:v,resolvedPathname:P,clientReferenceManifest:w,serverActionsManifest:x}=r,$=(0,c.normalizeAppPath)(a),U=!!(L.dynamicRoutes[$]||L.routes[P]),D=async()=>((null==f?void 0:f.render404)?await f.render404(e,i,b,!1):i.end("This page could not be found"),null);if(U&&!y){let e=!!L.routes[P],i=L.dynamicRoutes[$];if(i&&!1===i.fallback&&!e){if(g.adapterPath)return await D();throw new A.NoFallbackError}}let M=null;!U||O.isDev||y||(M=P,M="/index"===M?"/":M);let k=!0===O.isDev||!U,W=U&&!k;x&&w&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:w,serverActionsManifest:x});let F=e.method||"GET",H=(0,l.getTracer)(),q=H.getActiveScopeSpan(),j=!!(null==f?void 0:f.isWrappedByNextServer),Y=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,g,L,Y);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let z={params:S,previewProps:L.preview,renderOpts:{experimental:{authInterrupts:!!g.experimental.authInterrupts},cacheComponents:!!g.cacheComponents,supportsDynamicResponse:k,incrementalCache:B,cacheLifeProfiles:g.cacheLife,waitUntil:t.waitUntil,onClose:e=>{i.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(i,t,a,n)=>O.onRequestError(e,i,a,n,f)},sharedContext:{buildId:R,deploymentId:I}},J=new d.NodeNextRequest(e),G=new d.NodeNextResponse(i),V=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(i));try{let r,s=async e=>O.handle(V,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":i.statusCode,"next.rsc":!1});let t=H.getRootSpanAttributes();if(!t)return;if(t.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${t.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=t.get("next.route");if(n){let i=`${F} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":i}),e.updateName(i),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(i))}else e.updateName(`${F} ${a}`)}),o=async r=>{var l,o;let c=async({previousCacheEntry:n})=>{try{if(!Y&&T&&v&&!n)return i.statusCode=404,i.setHeader("x-nextjs-cache","REVALIDATED"),i.end("This page could not be found"),null;let a=await s(r);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&t.waitUntil&&(t.waitUntil(l),l=void 0);let o=z.renderOpts.collectedTags;if(!U)return await (0,h.sendResponse)(J,G,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),i=(0,m.toNodeOutgoingHttpHeaders)(a.headers);o&&(i[E.NEXT_CACHE_TAGS_HEADER]=o),!i["content-type"]&&e.type&&(i["content-type"]=e.type);let t=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:i},cacheControl:{revalidate:t,expire:n}}}}catch(i){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,i,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:T})},!1,f),i}},d=await O.handleResponse({req:e,nextConfig:g,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:L,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:v,responseGenerator:c,waitUntil:t.waitUntil,isMinimalMode:Y});if(!U)return null;if((null==d||null==(l=d.value)?void 0:l.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(o=d.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});Y||i.setHeader("x-nextjs-cache",T?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),y&&i.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return Y&&U||u.delete(E.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||i.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,C.getCacheControlHeader)(d.cacheControl)),await (0,h.sendResponse)(J,G,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};j&&q?await o(q):(r=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${a}`,kind:l.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},o),void 0,!j))}catch(i){if(i instanceof A.NoFallbackError||await O.onRequestError(e,i,{routerKind:"App Router",routePath:$,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:W,isOnDemandRevalidate:T})},!1,f),U)throw i;return await (0,h.sendResponse)(J,G,new Response(null,{status:500})),null}}e.s(["handler",0,S,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:b})},"routeModule",0,O,"serverHooks",0,y,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,b]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0yimtze._.js.map