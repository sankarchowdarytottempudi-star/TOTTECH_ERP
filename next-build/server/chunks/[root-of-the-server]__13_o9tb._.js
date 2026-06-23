module.exports=[193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},215619,e=>e.a(async(t,r)=>{try{var a=e.i(89171),n=e.i(368105),o=e.i(15270),i=t([n,o]);[n,o]=i.then?(await i)():i;let y=e=>e.trim().toUpperCase();async function s(e){if(!e)return new Set;let t=await o.prisma.roles.findFirst({where:{role_name:e}});if(!t)return new Set;let r=(await o.prisma.role_permissions.findMany({where:{role_id:t.id}})).map(e=>e.permission_id).filter(e=>"number"==typeof e);if(!r.length)return new Set;let a=await o.prisma.permissions.findMany({where:{id:{in:r}}});return new Set(a.filter(e=>e.module_name&&e.action_name).map(e=>`${y(e.module_name)}.${y(e.action_name)}`))}async function d(e,t){if(!e?.role)return!1;let r="string"==typeof t?y(t):`${y(t.module)}.${y(t.action)}`;return(await s(e.role)).has(r)}async function u(){let e=await (0,n.getCurrentUser)();return e?{user:e,response:null}:{user:null,response:a.NextResponse.json({error:"Unauthorized"},{status:401})}}async function l(e){let t=await u();return t.user?await d(t.user,e)?{user:t.user,response:null}:{user:t.user,response:a.NextResponse.json({error:"Forbidden"},{status:403})}:t}async function c(e){return"SUPER_ADMIN"===String(e?.role||"").trim().toUpperCase()}async function p(e){return await c(e)?{}:{school_id:e?.school_id??-1}}async function _(e){return e?o.prisma.academic_years.findFirst({where:{school_id:e,is_current:!0},orderBy:{id:"desc"}}):null}async function m(e){let[t,r,a,n]=await Promise.all([s(e.role),_(e.school_id),o.prisma.governance_settings.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{setting_key:"asc"}}),o.prisma.feature_flags.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{flag_key:"asc"}})]);return{user:{id:e.id,school_id:e.school_id,school_name:e.school_name},activeAcademicYear:r,permissions:Array.from(t).sort(),settings:a,flags:n}}e.s(["getActiveAcademicYear",0,_,"getGovernanceSnapshot",0,m,"getRolePermissionCodes",0,s,"requireCurrentUser",0,u,"requirePermission",0,l,"scopedSchoolWhere",0,p,"userHasPermission",0,d]),r()}catch(e){r(e)}},!1),493399,e=>e.a(async(t,r)=>{try{var a=e.i(15270),n=t([a]);[a]=n.then?(await n)():n;let s=e=>void 0===e?void 0:JSON.parse(JSON.stringify(e));async function o(e){let t=e.school_id??("school"===e.entity_type?e.entity_id:null),r=e.academic_year_id??(t?(await a.prisma.academic_years.findFirst({where:{school_id:t,is_current:!0},orderBy:{id:"desc"}}))?.id??null:null),n=await a.prisma.event_ledger.create({data:{school_id:t,academic_year_id:r,user_id:e.user_id??null,created_by:e.created_by??e.user_id??null,actor_role:e.actor_role??null,module_name:e.module_name,event_type:e.event_type,action:e.action??null,entity_type:e.entity_type??null,entity_id:e.entity_id??null,entity_uid:e.entity_uid??null,severity:e.severity??"INFO",summary:e.summary??null,payload:s(e.payload),metadata:s(e.metadata)}});return await i(n).catch(e=>{console.error("Timeline fan-out failed",e)}),n}async function i(e){if(!e.entity_type||!e.entity_id)return;let t=e.summary||`${e.module_name} event`,r={school_id:e.school_id,event_id:e.id,academic_year_id:e.academic_year_id,title:t,description:t,source_module:e.module_name,metadata:s({event_payload:e.payload}),occurred_at:e.occurred_at??void 0};"student"===e.entity_type&&await a.prisma.student_timelines.create({data:{...r,student_id:e.entity_id}}),"teacher"===e.entity_type&&await a.prisma.teacher_timelines.create({data:{...r,teacher_id:e.entity_id}}),"class"===e.entity_type&&await a.prisma.class_timelines.create({data:{...r,class_id:e.entity_id}}),"school"===e.entity_type&&await a.prisma.school_timelines.create({data:{...r,school_id:e.entity_id}})}e.s(["recordEvent",0,o]),r()}catch(e){r(e)}},!1),502689,e=>e.a(async(t,r)=>{try{var a=e.i(89171),n=e.i(15270),o=e.i(493399),i=e.i(215619),s=t([n,o,i]);[n,o,i]=s.then?(await s)():s;let l=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},c=new Set(["TRANSFER","DISCONTINUED","FINANCIAL","MIGRATION","MEDICAL","OTHER"]);async function d(e){let t=await (0,i.requirePermission)({module:"promotions",action:"read"});if(t.response)return t.response;let{searchParams:r}=new URL(e.url),o=t.user?.role==="SUPER_ADMIN"?l(r.get("school_id"))??t.user?.school_id??null:t.user?.school_id??null,s=l(r.get("academic_year_id")),[d,u]=await Promise.all([n.prisma.$queryRawUnsafe(`
        SELECT
          d.*,
          COALESCE(NULLIF(TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')), ''), s.name) AS student_name,
          s.admission_number,
          c.class_name,
          sec.section_name,
          ay.academic_year
        FROM student_dropout_records d
        LEFT JOIN students s ON s.id = d.student_id
        LEFT JOIN classes c ON c.id = d.from_class_id
        LEFT JOIN sections sec ON sec.id = d.from_section_id
        LEFT JOIN academic_years ay ON ay.id = d.dropout_academic_year_id
        WHERE ($1::int IS NULL OR d.school_id = $1::int)
          AND ($2::int IS NULL OR d.dropout_academic_year_id = $2::int)
        ORDER BY d.dropout_date DESC NULLS LAST, d.id DESC
        LIMIT 300
        `,o,s),n.prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int AS dropout_count,
          COUNT(*) FILTER (WHERE dropout_category = 'TRANSFER')::int AS transfer_count,
          COUNT(*) FILTER (WHERE dropout_category = 'DISCONTINUED')::int AS discontinued_count,
          COUNT(*) FILTER (WHERE dropout_category = 'FINANCIAL')::int AS financial_count,
          COUNT(*) FILTER (WHERE dropout_category = 'MIGRATION')::int AS migration_count,
          COUNT(*) FILTER (WHERE dropout_category = 'MEDICAL')::int AS medical_count,
          COUNT(*) FILTER (WHERE dropout_category = 'OTHER')::int AS other_count
        FROM student_dropout_records
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR dropout_academic_year_id = $2::int)
        `,o,s)]);return a.NextResponse.json({records:d,summary:u[0]||{}})}async function u(e){let t=await (0,i.requirePermission)({module:"promotions",action:"create"});if(t.response)return t.response;let r=await e.json(),s=l(r.student_id),d=String(r.dropout_category||r.category||"OTHER").toUpperCase(),u=r.dropout_date?new Date(r.dropout_date):new Date;if(!s)return a.NextResponse.json({error:"Select a student before marking dropout."},{status:400});if(!c.has(d))return a.NextResponse.json({error:"Dropout category must be Transfer, Discontinued, Financial, Migration, Medical, or Other."},{status:400});let p=(await n.prisma.$queryRawUnsafe(`
      SELECT
        s.*,
        COALESCE(s.current_class_id, sye.class_id) AS class_id,
        COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id,
        COALESCE(s.academic_year_id, sye.academic_year_id) AS source_academic_year_id
      FROM students s
      LEFT JOIN student_year_enrollments sye ON sye.student_id = s.id
      WHERE s.id = $1
      ORDER BY sye.academic_year_id DESC NULLS LAST
      LIMIT 1
      `,s))[0];if(!p)return a.NextResponse.json({error:"Student not found."},{status:404});let _=Number(p.school_id)||null,m=l(r.dropout_academic_year_id)||Number(p.source_academic_year_id)||null;if(t.user?.role!=="SUPER_ADMIN"&&t.user?.school_id!==_)return a.NextResponse.json({error:"You can only update dropout records for your school."},{status:403});let y=await n.prisma.$queryRawUnsafe(`
      INSERT INTO student_dropout_records (
        school_id,
        student_id,
        from_class_id,
        from_section_id,
        dropout_academic_year_id,
        dropout_category,
        dropout_reason,
        dropout_date,
        remarks,
        approved_by,
        created_by,
        metadata
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10,$11::jsonb)
      RETURNING *
      `,_,s,Number(p.class_id)||null,Number(p.section_id)||null,m,d,r.dropout_reason||r.reason||null,u,r.remarks||null,t.user?.id??null,JSON.stringify({source:"promotion_center"}));return await n.prisma.$executeRawUnsafe(`
    UPDATE students
    SET status = $1,
        student_status = $1,
        is_active = false,
        dropout_reason = $5,
        dropout_category = $2,
        dropout_date = $3,
        dropout_academic_year_id = $4,
        status_updated_at = CURRENT_TIMESTAMP,
        status_reason = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    `,"TRANSFER"===d?"TRANSFERRED":"DROPOUT",d,u,m,r.dropout_reason||r.reason||null,s),await n.prisma.$executeRawUnsafe(`
    INSERT INTO student_academic_history (
      student_id,
      school_id,
      academic_year_id,
      class_id,
      section_id,
      promotion_status,
      promoted_on,
      created_by,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,$8::jsonb)
    `,s,_,m,Number(p.class_id)||null,Number(p.section_id)||null,"TRANSFER"===d?"TRANSFERRED":"DROPOUT",t.user?.id??null,JSON.stringify({source:"promotion_center",dropoutCategory:d,dropoutDate:u.toISOString()})),await (0,o.recordEvent)({school_id:_,academic_year_id:m,user_id:t.user?.id,actor_role:t.user?.role,module_name:"promotions",event_type:"STUDENT_MARKED_DROPOUT",action:"dropout",entity_type:"student",entity_id:s,summary:"Student marked as dropout",payload:{category:d,dropoutDate:u.toISOString()}}),a.NextResponse.json({dropout:y[0]})}e.s(["GET",0,d,"POST",0,u]),r()}catch(e){r(e)}},!1),235487,e=>e.a(async(t,r)=>{try{var a=e.i(747909),n=e.i(174017),o=e.i(996250),i=e.i(759756),s=e.i(561916),d=e.i(174677),u=e.i(869741),l=e.i(316795),c=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),y=e.i(570101),R=e.i(626937),h=e.i(10372),E=e.i(193695);e.i(52474);var f=e.i(600220),N=e.i(502689),S=t([N]);[N]=S.then?(await S)():S;let T=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/promotions/dropouts/route",pathname:"/api/promotions/dropouts",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/promotions/dropouts/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:v,serverHooks:A}=T;async function w(e,t,r){r.requestMeta&&(0,i.setRequestMeta)(e,r.requestMeta),T.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/promotions/dropouts/route";a=a.replace(/\/index$/,"")||"/";let o=await T.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!o)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:N,deploymentId:S,params:w,nextConfig:g,parsedUrl:v,isDraftMode:A,prerenderManifest:O,routerServerContext:C,isOnDemandRevalidate:x,revalidateOnlyGenerated:I,resolvedPathname:U,clientReferenceManifest:$,serverActionsManifest:L}=o,b=(0,u.normalizeAppPath)(a),D=!!(O.dynamicRoutes[b]||O.routes[U]),P=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,v,!1):t.end("This page could not be found"),null);if(D&&!A){let e=!!O.routes[U],t=O.dynamicRoutes[b];if(t&&!1===t.fallback&&!e){if(g.adapterPath)return await P();throw new E.NoFallbackError}}let M=null;!D||T.isDev||A||(M=U,M="/index"===M?"/":M);let F=!0===T.isDev||!D,q=D&&!F;L&&$&&(0,d.setManifestsSingleton)({page:a,clientReferenceManifest:$,serverActionsManifest:L});let H=e.method||"GET",j=(0,s.getTracer)(),k=j.getActiveScopeSpan(),W=!!(null==C?void 0:C.isWrappedByNextServer),B=!!(0,i.getRequestMeta)(e,"minimalMode"),J=(0,i.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,g,O,B);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let K={params:w,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!g.experimental.authInterrupts},cacheComponents:!!g.cacheComponents,supportsDynamicResponse:F,incrementalCache:J,cacheLifeProfiles:g.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>T.onRequestError(e,t,a,n,C)},sharedContext:{buildId:N,deploymentId:S}},G=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),Y=c.NextRequestAdapter.fromNodeNextRequest(G,(0,c.signalFromNodeResponse)(t));try{let o,i=async e=>T.handle(Y,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",n),o.updateName(t))}else e.updateName(`${H} ${a}`)}),d=async o=>{var s,d;let u=async({previousCacheEntry:n})=>{try{if(!B&&x&&I&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await i(o);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&r.waitUntil&&(r.waitUntil(s),s=void 0);let d=K.renderOpts.collectedTags;if(!D)return await (0,m.sendResponse)(G,V,a,K.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,y.toNodeOutgoingHttpHeaders)(a.headers);d&&(t[h.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,n=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:x})},!1,C),t}},l=await T.handleResponse({req:e,nextConfig:g,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:I,responseGenerator:u,waitUntil:r.waitUntil,isMinimalMode:B});if(!D)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",x?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,y.fromNodeOutgoingHttpHeaders)(l.value.headers);return B&&D||c.delete(h.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(l.cacheControl)),await (0,m.sendResponse)(G,V,new Response(l.value.body,{headers:c,status:l.value.status||200})),null};W&&k?await d(k):(o=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${a}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},d),void 0,!W))}catch(t){if(t instanceof E.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:x})},!1,C),D)throw t;return await (0,m.sendResponse)(G,V,new Response(null,{status:500})),null}}e.s(["handler",0,w,"patchFetch",0,function(){return(0,o.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:v})},"routeModule",0,T,"serverHooks",0,A,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,v]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__13_o9tb._.js.map