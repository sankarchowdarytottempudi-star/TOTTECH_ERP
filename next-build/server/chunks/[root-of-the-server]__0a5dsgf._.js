module.exports=[193695,(e,i,t)=>{i.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,i,t)=>{i.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,i,t)=>{i.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,i,t)=>{i.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let i="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===i?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let i=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===i||i.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?i:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let i=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,i){return!(e&&Array.isArray(i)&&0!==i.length)||i.includes(e)},"moduleCodeForClinicalPath",0,function(e){let t=e.split("?")[0].split("#")[0].toLowerCase(),a=i.find(e=>!!(e.startsWith&&t.startsWith(e.startsWith)||e.includes&&t.includes(e.includes)));return a?.moduleCode??null}])},780907,e=>e.a(async(i,t)=>{try{var a=e.i(493458),n=e.i(89171),r=e.i(368105),s=e.i(15270),l=e.i(274173),o=e.i(503031),d=i([r,s]);[r,s]=d.then?(await d)():d;let E=e=>{let i=Number(e);return Number.isFinite(i)&&i>0?i:null},h=e=>e&&"object"==typeof e?e:{},C=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",N=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function c(e,i){return(await s.prisma.$queryRawUnsafe(`
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
      `,e,i);return Number(t[0]?.count||0)>0}async function p(e){let i=await (0,r.getCurrentUser)();if(!i||!(i?.project==="tottech_clinical_services"||"CLINICAL"===String(i?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(i?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(i?.email)))return null;let t=await (0,a.cookies)(),n=E(t.get("active_clinic_id")?.value),o=E(t.get("active_hospital_id")?.value),d=E(t.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=E(u?.searchParams.get("clinic_id")),_=E(u?.searchParams.get("hospital_id")),m=E(u?.searchParams.get("branch_id")),f=(await s.prisma.$queryRawUnsafe(`
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
      `,i.id??null,p??n,_??o,m??d))[0];if(!f&&o&&i.id&&(f=(await s.prisma.$queryRawUnsafe(`
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
        `,i.id,o,Array.from(N),d,n))[0]),!f)return null;let A=h(f.organization_branding),R=h(f.hospital_branding),b=h(f.branch_branding),I=h(f.clinic_branding),S={...A,...R,...b,...I},O=C(S.logoUrl,S.logo_url,S.logo,S.hospital_logo,S.image),y=C(S.name,S.hospitalName,S.hospital_name,f.hospital_name,f.branch_name,f.clinic_name,f.organization_name),L=await c(Number(f.tenant_id),Number(f.hospital_id));return{user:i,tenantId:Number(f.tenant_id),hospitalId:Number(f.hospital_id),branchId:Number(f.branch_id),clinicId:Number(f.clinic_id),organizationId:E(f.organization_id),organizationName:String(f.organization_name||""),tenantName:String(f.tenant_name||""),hospitalName:String(f.hospital_name||""),hospitalAddress:String(f.hospital_address||""),hospitalPhone:String(f.hospital_phone||""),hospitalEmail:String(f.hospital_email||""),hospitalLicenseNumber:String(f.hospital_license_number||""),branchName:String(f.branch_name||""),clinicName:String(f.clinic_name||""),roleKey:String(f.role_key||"clinical_user"),roleName:String(f.role_name||"Clinical User"),permissions:f.permissions||{},licensedModules:L,branding:{name:y||"Hospital",logoUrl:O||null,primaryColor:C(S.primaryColor,S.primary_color)||"#04142E",accentColor:C(S.accentColor,S.accent_color)||"#D4AF37",source:O?"hospital":"generated"}}}async function _(e){let i=await p(e);if(!i)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let t=new URL(e.url).pathname,a=(0,o.moduleCodeForClinicalPath)(t);if(a&&!(!await u(i.tenantId,i.hospitalId)||(i.licensedModules||[]).includes(a)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:a,module_name:o.CLINICAL_MODULE_LABELS[a]},{status:403})}}return{context:i,response:null}}async function m(e,i){await s.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,i.moduleName,i.action,i.entityType??null,i.entityId??null,i.summary??null,JSON.stringify(i.payload??{}))}e.s(["recordClinicalAudit",0,m,"requireClinicalContext",0,_]),t()}catch(e){t(e)}},!1),665706,e=>e.a(async(i,t)=>{try{var a=e.i(89171),n=e.i(780907),r=e.i(15270),s=i([n,r]);[n,r]=s.then?(await s)():s;let d=e=>String(e||"").trim();async function l(e){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let t=i.context,s=await r.prisma.$queryRawUnsafe(`
      SELECT
        f.*,
        COALESCE(
          json_agg(
            jsonb_build_object(
              'id', ff.id,
              'field_key', ff.field_key,
              'label', ff.label,
              'field_type', ff.field_type,
              'section_key', ff.section_key,
              'tab_key', ff.tab_key,
              'sort_order', ff.sort_order,
              'is_required', ff.is_required,
              'options', ff.options,
              'validations', ff.validations
            )
            ORDER BY ff.sort_order ASC, ff.id ASC
          ) FILTER (WHERE ff.id IS NOT NULL),
          '[]'::json
        ) AS fields
      FROM clinical_forms f
      LEFT JOIN clinical_form_fields ff
        ON ff.form_id = f.id
       AND COALESCE(ff.is_deleted, false) = false
      WHERE f.tenant_id = $1
        AND f.hospital_id = $2
        AND f.branch_id = $3
        AND COALESCE(f.is_deleted, false) = false
      GROUP BY f.id
      ORDER BY f.updated_at DESC
      `,t.tenantId,t.hospitalId,t.branchId);return a.NextResponse.json({forms:s})}async function o(e){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let t=i.context,s=await e.json(),l=d(s.action);if("field"===l){let e=Number(s.form_id);if(!e||!d(s.field_key))return a.NextResponse.json({error:"Form and field key are required."},{status:400});let i=await r.prisma.$queryRawUnsafe(`
        INSERT INTO clinical_form_fields (
          tenant_id,
          clinic_id,
          hospital_id,
          branch_id,
          form_id,
          field_key,
          label,
          field_type,
          section_key,
          tab_key,
          sort_order,
          is_required,
          options,
          validations,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb,$15,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        ON CONFLICT (form_id, field_key)
        DO UPDATE SET
          label = EXCLUDED.label,
          field_type = EXCLUDED.field_type,
          section_key = EXCLUDED.section_key,
          tab_key = EXCLUDED.tab_key,
          sort_order = EXCLUDED.sort_order,
          is_required = EXCLUDED.is_required,
          options = EXCLUDED.options,
          validations = EXCLUDED.validations,
          updated_by = EXCLUDED.updated_by,
          updated_at = CURRENT_TIMESTAMP,
          is_deleted = false
        RETURNING *
        `,t.tenantId,t.clinicId,t.hospitalId,t.branchId,e,d(s.field_key),d(s.label)||d(s.field_key),d(s.field_type)||"Text",d(s.section_key)||null,d(s.tab_key)||null,Number(s.sort_order||0),!!s.is_required,JSON.stringify(s.options||[]),JSON.stringify(s.validations||{}),t.user.id??null);return await (0,n.recordClinicalAudit)(t,{moduleName:"forms",action:"field_upsert",entityType:"clinical_form_field",entityId:Number(i[0].id),summary:"Clinical form field saved",payload:{form_id:e,field_key:s.field_key}}),a.NextResponse.json(i[0],{status:201})}if(!d(s.form_key))return a.NextResponse.json({error:"Form key is required."},{status:400});let o=await r.prisma.$queryRawUnsafe(`
      INSERT INTO clinical_forms (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        form_key,
        form_name,
        module_name,
        version,
        layout,
        validations,
        workflow_key,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,1,$8::jsonb,$9::jsonb,$10,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (tenant_id, clinic_id, form_key, version)
      DO UPDATE SET
        form_name = EXCLUDED.form_name,
        module_name = EXCLUDED.module_name,
        layout = EXCLUDED.layout,
        validations = EXCLUDED.validations,
        workflow_key = EXCLUDED.workflow_key,
        updated_by = EXCLUDED.updated_by,
        updated_at = CURRENT_TIMESTAMP,
        is_deleted = false
      RETURNING *
      `,t.tenantId,t.clinicId,t.hospitalId,t.branchId,d(s.form_key),d(s.form_name)||d(s.form_key),d(s.module_name)||"custom",JSON.stringify(s.layout||{}),JSON.stringify(s.validations||{}),d(s.workflow_key)||null,t.user.id??null);return await (0,n.recordClinicalAudit)(t,{moduleName:"forms",action:"upsert",entityType:"clinical_form",entityId:Number(o[0].id),summary:"Clinical form saved",payload:{form_key:s.form_key}}),a.NextResponse.json(o[0],{status:201})}e.s(["GET",0,l,"POST",0,o]),t()}catch(e){t(e)}},!1),176051,e=>e.a(async(i,t)=>{try{var a=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),l=e.i(561916),o=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),E=e.i(570101),h=e.i(626937),C=e.i(10372),N=e.i(193695);e.i(52474);var f=e.i(600220),A=e.i(665706),R=i([A]);[A]=R.then?(await R)():R;let I=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/forms/route",pathname:"/api/clinical/forms",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/forms/route.ts",nextConfigOutput:"",userland:A,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:O,serverHooks:y}=I;async function b(e,i,t){t.requestMeta&&(0,s.setRequestMeta)(e,t.requestMeta),I.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/forms/route";a=a.replace(/\/index$/,"")||"/";let r=await I.prepare(e,i,{srcPage:a,multiZoneDraftMode:!1});if(!r)return i.statusCode=400,i.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve()),null;let{buildId:A,deploymentId:R,params:b,nextConfig:S,parsedUrl:O,isDraftMode:y,prerenderManifest:L,routerServerContext:T,isOnDemandRevalidate:g,revalidateOnlyGenerated:v,resolvedPathname:U,clientReferenceManifest:D,serverActionsManifest:P}=r,w=(0,d.normalizeAppPath)(a),$=!!(L.dynamicRoutes[w]||L.routes[U]),x=async()=>((null==T?void 0:T.render404)?await T.render404(e,i,O,!1):i.end("This page could not be found"),null);if($&&!y){let e=!!L.routes[U],i=L.dynamicRoutes[w];if(i&&!1===i.fallback&&!e){if(S.adapterPath)return await x();throw new N.NoFallbackError}}let M=null;!$||I.isDev||y||(M=U,M="/index"===M?"/":M);let k=!0===I.isDev||!$,F=$&&!k;P&&D&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:D,serverActionsManifest:P});let W=e.method||"GET",q=(0,l.getTracer)(),H=q.getActiveScopeSpan(),j=!!(null==T?void 0:T.isWrappedByNextServer),Y=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await I.getIncrementalCache(e,S,L,Y);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let J={params:b,previewProps:L.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:k,incrementalCache:B,cacheLifeProfiles:S.cacheLife,waitUntil:t.waitUntil,onClose:e=>{i.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(i,t,a,n)=>I.onRequestError(e,i,a,n,T)},sharedContext:{buildId:A,deploymentId:R}},z=new c.NodeNextRequest(e),X=new c.NodeNextResponse(i),V=u.NextRequestAdapter.fromNodeNextRequest(z,(0,u.signalFromNodeResponse)(i));try{let r,s=async e=>I.handle(V,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":i.statusCode,"next.rsc":!1});let t=q.getRootSpanAttributes();if(!t)return;if(t.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${t.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=t.get("next.route");if(n){let i=`${W} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":i}),e.updateName(i),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(i))}else e.updateName(`${W} ${a}`)}),o=async r=>{var l,o;let d=async({previousCacheEntry:n})=>{try{if(!Y&&g&&v&&!n)return i.statusCode=404,i.setHeader("x-nextjs-cache","REVALIDATED"),i.end("This page could not be found"),null;let a=await s(r);e.fetchMetrics=J.renderOpts.fetchMetrics;let l=J.renderOpts.pendingWaitUntil;l&&t.waitUntil&&(t.waitUntil(l),l=void 0);let o=J.renderOpts.collectedTags;if(!$)return await (0,m.sendResponse)(z,X,a,J.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),i=(0,E.toNodeOutgoingHttpHeaders)(a.headers);o&&(i[C.NEXT_CACHE_TAGS_HEADER]=o),!i["content-type"]&&e.type&&(i["content-type"]=e.type);let t=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=C.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,n=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=C.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:i},cacheControl:{revalidate:t,expire:n}}}}catch(i){throw(null==n?void 0:n.isStale)&&await I.onRequestError(e,i,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,T),i}},c=await I.handleResponse({req:e,nextConfig:S,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:L,isRoutePPREnabled:!1,isOnDemandRevalidate:g,revalidateOnlyGenerated:v,responseGenerator:d,waitUntil:t.waitUntil,isMinimalMode:Y});if(!$)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(o=c.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});Y||i.setHeader("x-nextjs-cache",g?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),y&&i.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,E.fromNodeOutgoingHttpHeaders)(c.value.headers);return Y&&$||u.delete(C.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||i.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,h.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(z,X,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};j&&H?await o(H):(r=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(p.BaseServerSpan.handleRequest,{spanName:`${W} ${a}`,kind:l.SpanKind.SERVER,attributes:{"http.method":W,"http.target":e.url}},o),void 0,!j))}catch(i){if(i instanceof N.NoFallbackError||await I.onRequestError(e,i,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,T),$)throw i;return await (0,m.sendResponse)(z,X,new Response(null,{status:500})),null}}e.s(["handler",0,b,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:O})},"routeModule",0,I,"serverHooks",0,y,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,O]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0a5dsgf._.js.map