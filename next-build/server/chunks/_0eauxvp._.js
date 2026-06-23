module.exports=[486010,e=>e.a(async(t,a)=>{try{var i=e.i(89171),s=e.i(449632),r=e.i(780907),n=e.i(155876),l=e.i(15270),d=t([r,n,l]);[r,n,l]=d.then?(await d)():d;let p={"Front Desk":"receptionist","Vital Team":"vital_team",Doctors:"doctor",Lab:"lab_technician",Pharmacy:"pharmacist",ICU:"icu_staff",OT:"ot_staff",Nurse:"nurse",Admin:"hospital_admin"};async function o(e){let t=await (0,r.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,{searchParams:s}=new URL(e.url),d="true"===s.get("deleted"),o=await l.prisma.$queryRawUnsafe(`
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.role,
      u.status,
      u.is_active,
      COALESCE(u.is_deleted,false) AS is_deleted,
      u.deleted_at,
      deleter.full_name AS deleted_by_name,
      cup.display_name,
      cup.settings,
      cr.role_name,
      cr.role_key,
      dep.department_name,
      cup.created_at
    FROM clinical_user_profiles cup
    JOIN users u ON u.id = cup.user_id
    LEFT JOIN users deleter ON deleter.id = u.deleted_by
    LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
    LEFT JOIN departments dep ON dep.id = cup.department_id
    WHERE cup.tenant_id = $1
      AND cup.hospital_id = $2
      AND cup.branch_id = $3
      AND (
        ($4::boolean = true AND (COALESCE(cup.is_deleted,false) = true OR COALESCE(u.is_deleted,false) = true))
        OR
        ($4::boolean = false AND COALESCE(cup.is_deleted,false) = false AND COALESCE(u.is_deleted,false) = false)
      )
    ORDER BY cup.created_at DESC, cup.id DESC
    LIMIT 300
    `,a.tenantId,a.hospitalId,a.branchId,d);return i.NextResponse.json((0,n.serialize)({rows:o}))}async function u(e){let t=await (0,r.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,d=await e.json(),o=(0,n.text)(d.name),u=(0,n.text)(d.username)||(0,n.text)(d.email),c=(0,n.text)(d.password),_=(0,n.text)(d.role)||"Front Desk",E=p[_]||_.toLowerCase().replace(/\s+/g,"_");if(!o||!u||!c)return i.NextResponse.json({error:"Name, username/email and password are required."},{status:400});let R=await l.prisma.$queryRawUnsafe(`
    SELECT id
    FROM clinical_roles
    WHERE tenant_id = $1
      AND hospital_id = $2
      AND branch_id = $3
      AND role_key = $4
      AND COALESCE(is_deleted,false) = false
    ORDER BY id ASC
    LIMIT 1
    `,a.tenantId,a.hospitalId,a.branchId,E),m=R[0]?.id?Number(R[0].id):null,N=await s.default.hash(c,10),f=(await l.prisma.$queryRawUnsafe(`
    INSERT INTO users (school_id, full_name, email, username, platform_type, status, phone, password_hash, role, is_active, created_at)
    VALUES (NULL,$1,$2,$3,'CLINICAL',$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)
    RETURNING id, full_name, email, phone, role, is_active
    `,o,u,u.split("@")[0].toLowerCase(),"Inactive"===(0,n.text)(d.status)?"INACTIVE":"ACTIVE",(0,n.nullableText)(d.mobile),N,E.toUpperCase(),"Inactive"!==(0,n.text)(d.status)))[0],T=await l.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_user_profiles (
      tenant_id,hospital_id,branch_id,clinic_id,user_id,clinical_role_id,department_id,
      project_type,display_name,settings,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,NULL,'tottech_clinical_services',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,f.id,m,o,JSON.stringify({employee_id:(0,n.nullableText)(d.employee_id),department:(0,n.nullableText)(d.department),role_label:_,status:(0,n.text)(d.status)||"Active"}),a.user.id??null);return"doctor"===E&&await l.prisma.$executeRawUnsafe(`
      INSERT INTO doctors (
        tenant_id,hospital_id,branch_id,clinic_id,user_id,doctor_uid,full_name,
        specialization,phone,email,consultation_fee,status,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,0,'AVAILABLE',$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (doctor_uid) DO NOTHING
      `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,f.id,(0,n.nullableText)(d.employee_id)||`DOC-${f.id}`,o,(0,n.nullableText)(d.department),(0,n.nullableText)(d.mobile),u,a.user.id??null),await (0,r.recordClinicalAudit)(a,{moduleName:"clinical_admin_users",action:"create",entityType:"users",entityId:Number(f.id),summary:"Clinical operational user created",payload:{user:f,profile:T[0]}}),i.NextResponse.json((0,n.serialize)({user:f,profile:T[0]}),{status:201})}async function c(e){let t=await (0,r.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,d=await e.json(),o=Number(d.id),u=(0,n.text)(d.action);if(!o)return i.NextResponse.json({error:"User id is required."},{status:400});if("ACTIVATE"===u||"DEACTIVATE"===u){let e="ACTIVATE"===u,t=await l.prisma.$queryRawUnsafe(`
      UPDATE users
      SET is_active = $2,
          status = $3
      WHERE id = $1
        AND COALESCE(is_deleted,false) = false
      RETURNING id, full_name, email, phone, role, is_active
      `,o,e,e?"ACTIVE":"INACTIVE");return t.length?(await l.prisma.$executeRawUnsafe(`
      UPDATE clinical_user_profiles
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{status}',
        to_jsonb($2::text),
        true
      ),
      updated_by = $3,
      updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
        AND COALESCE(is_deleted,false) = false
      `,o,e?"Active":"Inactive",a.user.id??null),await (0,r.recordClinicalAudit)(a,{moduleName:"admin_users",action:e?"activate":"deactivate",entityType:"users",entityId:o,summary:`Clinical operational user ${e?"activated":"deactivated"}`,payload:t[0]}),i.NextResponse.json((0,n.serialize)({user:t[0]}))):i.NextResponse.json({error:"User not found."},{status:404})}if("LOCK"===u||"ARCHIVE"===u){let e=await l.prisma.$queryRawUnsafe(`
      UPDATE users
      SET is_active = false,
          status = $2
      WHERE id = $1
        AND COALESCE(is_deleted,false) = false
      RETURNING id, full_name, email, phone, role, is_active, status
      `,o,u);return e.length?(await (0,r.recordClinicalAudit)(a,{moduleName:"admin_users",action:u.toLowerCase(),entityType:"users",entityId:o,summary:`Clinical operational user ${u.toLowerCase()}`,payload:e[0]}),i.NextResponse.json((0,n.serialize)({user:e[0]}))):i.NextResponse.json({error:"User not found."},{status:404})}if("DELETE"===u){let e=await l.prisma.$queryRawUnsafe(`
        UPDATE clinical_user_profiles
        SET is_deleted = true,
            updated_by = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
          AND tenant_id = $3
          AND hospital_id = $4
          AND branch_id = $5
        RETURNING *
        `,o,a.user.id??null,a.tenantId,a.hospitalId,a.branchId),t=await l.prisma.$queryRawUnsafe(`
        UPDATE users
        SET is_active = false,
            status = 'ARCHIVED',
            is_deleted = true,
            deleted_at = CURRENT_TIMESTAMP,
            deleted_by = $2
        WHERE id = $1
        RETURNING id, full_name, email, phone, role, is_active, status, is_deleted, deleted_at
        `,o,a.user.id??null);return await (0,r.recordClinicalAudit)(a,{moduleName:"admin_users",action:"delete",entityType:"users",entityId:o,summary:"Clinical operational user deleted",payload:{user:t[0],profile:e[0]}}),i.NextResponse.json({success:!0})}if("RESTORE"===u){let e=await l.prisma.$queryRawUnsafe(`
        UPDATE users
        SET is_deleted = false,
            deleted_at = NULL,
            deleted_by = NULL,
            status = 'INACTIVE',
            is_active = false
        WHERE id = $1
        RETURNING id, full_name, email, phone, role, is_active, status, is_deleted
        `,o);return e.length?(await l.prisma.$executeRawUnsafe(`
      UPDATE clinical_user_profiles
      SET is_deleted = false,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
        AND tenant_id = $3
        AND hospital_id = $4
        AND branch_id = $5
      `,o,a.user.id??null,a.tenantId,a.hospitalId,a.branchId),await (0,r.recordClinicalAudit)(a,{moduleName:"admin_users",action:"restore",entityType:"users",entityId:o,summary:"Clinical operational user restored",payload:e[0]}),i.NextResponse.json((0,n.serialize)({user:e[0]}))):i.NextResponse.json({error:"User not found."},{status:404})}if("PERMANENT_DELETE"===u){try{await l.prisma.$transaction(async e=>{await e.$executeRawUnsafe(`
          DELETE FROM clinical_user_profiles
          WHERE user_id = $1
            AND tenant_id = $2
            AND hospital_id = $3
            AND branch_id = $4
            AND COALESCE(is_deleted,false) = true
          `,o,a.tenantId,a.hospitalId,a.branchId),await e.$executeRawUnsafe(`
          DELETE FROM users
          WHERE id = $1
            AND COALESCE(is_deleted,false) = true
          `,o)})}catch(e){return i.NextResponse.json({error:"Permanent delete blocked because this user is referenced by clinical records or audit history. Keep the user archived."},{status:409})}return await (0,r.recordClinicalAudit)(a,{moduleName:"admin_users",action:"permanent_delete",entityType:"users",entityId:o,summary:"Clinical operational user permanently deleted",payload:{userId:o}}),i.NextResponse.json({success:!0})}let c=(0,n.text)(d.role)||"Front Desk",_=p[c]||c.toLowerCase().replace(/\s+/g,"_"),E=await l.prisma.$queryRawUnsafe(`
    SELECT id
    FROM clinical_roles
    WHERE tenant_id = $1
      AND hospital_id = $2
      AND branch_id = $3
      AND role_key = $4
      AND COALESCE(is_deleted,false) = false
    ORDER BY id ASC
    LIMIT 1
    `,a.tenantId,a.hospitalId,a.branchId,_),R=E[0]?.id?Number(E[0].id):null,m=d.password?await s.default.hash(d.password,10):null,N=await l.prisma.$queryRawUnsafe(`
    UPDATE users
    SET full_name = $2,
        email = $3,
        phone = $4,
        role = $5,
        is_active = $6
        ${m?", password_hash = $7":""}
    WHERE id = $1
    RETURNING id, full_name, email, phone, role, is_active
    `,o,(0,n.text)(d.name),(0,n.text)(d.email),(0,n.nullableText)(d.mobile),_.toUpperCase(),"Inactive"!==(0,n.text)(d.status),...m?[m]:[]);if(!N.length)return i.NextResponse.json({error:"User not found."},{status:404});let f=JSON.stringify({employee_id:(0,n.nullableText)(d.employee_id),department:(0,n.nullableText)(d.department),role_label:c,status:(0,n.text)(d.status)||"Active"}),T=await l.prisma.$queryRawUnsafe(`
    UPDATE clinical_user_profiles
    SET ${R?"clinical_role_id = $2,":""} display_name = $3,
        settings = $4::jsonb,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
      AND COALESCE(is_deleted,false) = false
    RETURNING *
    `,o,...R?[R]:[],(0,n.text)(d.name),f,a.user.id??null);return await (0,r.recordClinicalAudit)(a,{moduleName:"admin_users",action:"update",entityType:"users",entityId:o,summary:"Clinical operational user updated",payload:{user:N[0],profile:T[0]}}),i.NextResponse.json((0,n.serialize)({user:N[0],profile:T[0]}))}e.s(["GET",0,o,"PATCH",0,c,"POST",0,u]),a()}catch(e){a(e)}},!1),181408,e=>e.a(async(t,a)=>{try{var i=e.i(747909),s=e.i(174017),r=e.i(996250),n=e.i(759756),l=e.i(561916),d=e.i(174677),o=e.i(869741),u=e.i(316795),c=e.i(487718),p=e.i(995169),_=e.i(47587),E=e.i(666012),R=e.i(570101),m=e.i(626937),N=e.i(10372),f=e.i(193695);e.i(52474);var T=e.i(600220),h=e.i(486010),A=t([h]);[h]=A.then?(await A)():A;let y=new i.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/clinical/operations/admin-users/route",pathname:"/api/clinical/operations/admin-users",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/operations/admin-users/route.ts",nextConfigOutput:"",userland:h,...{}}),{workAsyncStorage:$,workUnitAsyncStorage:I,serverHooks:w}=y;async function C(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),y.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/operations/admin-users/route";i=i.replace(/\/index$/,"")||"/";let r=await y.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:h,deploymentId:A,params:C,nextConfig:$,parsedUrl:I,isDraftMode:w,prerenderManifest:x,routerServerContext:b,isOnDemandRevalidate:v,revalidateOnlyGenerated:U,resolvedPathname:S,clientReferenceManifest:D,serverActionsManifest:O}=r,L=(0,o.normalizeAppPath)(i),g=!!(x.dynamicRoutes[L]||x.routes[S]),P=async()=>((null==b?void 0:b.render404)?await b.render404(e,t,I,!1):t.end("This page could not be found"),null);if(g&&!w){let e=!!x.routes[S],t=x.dynamicRoutes[L];if(t&&!1===t.fallback&&!e){if($.adapterPath)return await P();throw new f.NoFallbackError}}let M=null;!g||y.isDev||w||(M=S,M="/index"===M?"/":M);let q=!0===y.isDev||!g,H=g&&!q;O&&D&&(0,d.setManifestsSingleton)({page:i,clientReferenceManifest:D,serverActionsManifest:O});let j=e.method||"GET",k=(0,l.getTracer)(),F=k.getActiveScopeSpan(),V=!!(null==b?void 0:b.isWrappedByNextServer),W=!!(0,n.getRequestMeta)(e,"minimalMode"),G=(0,n.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,$,x,W);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let B={params:C,previewProps:x.preview,renderOpts:{experimental:{authInterrupts:!!$.experimental.authInterrupts},cacheComponents:!!$.cacheComponents,supportsDynamicResponse:q,incrementalCache:G,cacheLifeProfiles:$.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,s)=>y.onRequestError(e,t,i,s,b)},sharedContext:{buildId:h,deploymentId:A}},K=new u.NodeNextRequest(e),z=new u.NodeNextResponse(t),J=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let r,n=async e=>y.handle(J,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=k.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let t=`${j} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",s),r.updateName(t))}else e.updateName(`${j} ${i}`)}),d=async r=>{var l,d;let o=async({previousCacheEntry:s})=>{try{if(!W&&v&&U&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await n(r);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=B.renderOpts.collectedTags;if(!g)return await (0,E.sendResponse)(K,z,i,B.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(i.headers);d&&(t[N.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,s=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:T.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:v})},!1,b),t}},u=await y.handleResponse({req:e,nextConfig:$,cacheKey:M,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:x,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:U,responseGenerator:o,waitUntil:a.waitUntil,isMinimalMode:W});if(!g)return null;if((null==u||null==(l=u.value)?void 0:l.kind)!==T.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",v?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,R.fromNodeOutgoingHttpHeaders)(u.value.headers);return W&&g||c.delete(N.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,m.getCacheControlHeader)(u.cacheControl)),await (0,E.sendResponse)(K,z,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};V&&F?await d(F):(r=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${j} ${i}`,kind:l.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},d),void 0,!V))}catch(t){if(t instanceof f.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:v})},!1,b),g)throw t;return await (0,E.sendResponse)(K,z,new Response(null,{status:500})),null}}e.s(["handler",0,C,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:$,workUnitAsyncStorage:I})},"routeModule",0,y,"serverHooks",0,w,"workAsyncStorage",0,$,"workUnitAsyncStorage",0,I]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0eauxvp._.js.map