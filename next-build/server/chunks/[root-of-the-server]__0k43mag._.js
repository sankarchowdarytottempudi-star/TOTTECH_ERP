module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},215619,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(368105),s=e.i(15270),n=t([i,s]);[i,s]=n.then?(await n)():n;let y=e=>e.trim().toUpperCase();async function o(e){if(!e)return new Set;let t=await s.prisma.roles.findFirst({where:{role_name:e}});if(!t)return new Set;let a=(await s.prisma.role_permissions.findMany({where:{role_id:t.id}})).map(e=>e.permission_id).filter(e=>"number"==typeof e);if(!a.length)return new Set;let r=await s.prisma.permissions.findMany({where:{id:{in:a}}});return new Set(r.filter(e=>e.module_name&&e.action_name).map(e=>`${y(e.module_name)}.${y(e.action_name)}`))}async function d(e,t){if(!e?.role)return!1;let a="string"==typeof t?y(t):`${y(t.module)}.${y(t.action)}`;return(await o(e.role)).has(a)}async function l(){let e=await (0,i.getCurrentUser)();return e?{user:e,response:null}:{user:null,response:r.NextResponse.json({error:"Unauthorized"},{status:401})}}async function c(e){let t=await l();return t.user?await d(t.user,e)?{user:t.user,response:null}:{user:t.user,response:r.NextResponse.json({error:"Forbidden"},{status:403})}:t}async function u(e){return"SUPER_ADMIN"===String(e?.role||"").trim().toUpperCase()}async function _(e){return await u(e)?{}:{school_id:e?.school_id??-1}}async function p(e){return e?s.prisma.academic_years.findFirst({where:{school_id:e,is_current:!0},orderBy:{id:"desc"}}):null}async function m(e){let[t,a,r,i]=await Promise.all([o(e.role),p(e.school_id),s.prisma.governance_settings.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{setting_key:"asc"}}),s.prisma.feature_flags.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{flag_key:"asc"}})]);return{user:{id:e.id,school_id:e.school_id,school_name:e.school_name},activeAcademicYear:a,permissions:Array.from(t).sort(),settings:r,flags:i}}e.s(["getActiveAcademicYear",0,p,"getGovernanceSnapshot",0,m,"getRolePermissionCodes",0,o,"requireCurrentUser",0,l,"requirePermission",0,c,"scopedSchoolWhere",0,_,"userHasPermission",0,d]),a()}catch(e){a(e)}},!1),493399,e=>e.a(async(t,a)=>{try{var r=e.i(15270),i=t([r]);[r]=i.then?(await i)():i;let o=e=>void 0===e?void 0:JSON.parse(JSON.stringify(e));async function s(e){let t=e.school_id??("school"===e.entity_type?e.entity_id:null),a=e.academic_year_id??(t?(await r.prisma.academic_years.findFirst({where:{school_id:t,is_current:!0},orderBy:{id:"desc"}}))?.id??null:null),i=await r.prisma.event_ledger.create({data:{school_id:t,academic_year_id:a,user_id:e.user_id??null,created_by:e.created_by??e.user_id??null,actor_role:e.actor_role??null,module_name:e.module_name,event_type:e.event_type,action:e.action??null,entity_type:e.entity_type??null,entity_id:e.entity_id??null,entity_uid:e.entity_uid??null,severity:e.severity??"INFO",summary:e.summary??null,payload:o(e.payload),metadata:o(e.metadata)}});return await n(i).catch(e=>{console.error("Timeline fan-out failed",e)}),i}async function n(e){if(!e.entity_type||!e.entity_id)return;let t=e.summary||`${e.module_name} event`,a={school_id:e.school_id,event_id:e.id,academic_year_id:e.academic_year_id,title:t,description:t,source_module:e.module_name,metadata:o({event_payload:e.payload}),occurred_at:e.occurred_at??void 0};"student"===e.entity_type&&await r.prisma.student_timelines.create({data:{...a,student_id:e.entity_id}}),"teacher"===e.entity_type&&await r.prisma.teacher_timelines.create({data:{...a,teacher_id:e.entity_id}}),"class"===e.entity_type&&await r.prisma.class_timelines.create({data:{...a,class_id:e.entity_id}}),"school"===e.entity_type&&await r.prisma.school_timelines.create({data:{...a,school_id:e.entity_id}})}e.s(["recordEvent",0,s]),a()}catch(e){a(e)}},!1),381402,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(15270),s=e.i(493399),n=e.i(215619),o=t([i,s,n]);async function d(e,{params:t}){let a=await (0,n.requirePermission)({module:"promotions",action:"approve"});if(a.response)return a.response;let{id:o}=await t,l=(await i.prisma.$queryRawUnsafe("SELECT * FROM promotion_workflows WHERE id = $1",Number(o)))[0];if(!l)return r.NextResponse.json({error:"Promotion workflow not found."},{status:404});if("APPROVED"!==l.approval_status)return r.NextResponse.json({error:"Promotion workflow must be approved before execution."},{status:400});let c=(await i.prisma.$queryRawUnsafe("SELECT id, academic_year FROM academic_years WHERE id = $1",l.target_academic_year_id))[0];if(!c)return r.NextResponse.json({error:"Target academic year not found."},{status:400});let u=await i.prisma.$queryRawUnsafe(`
      SELECT student_id, source_class_id, source_section_id, target_class_id, target_section_id
      FROM promotion_workflow_students
      WHERE workflow_id = $1
        AND status <> 'EXECUTED'
      ORDER BY id ASC
      `,l.id),_=0;for(let e of u){let t=e.target_class_id??l.to_class_id,r=e.target_section_id??l.to_section_id;await i.prisma.$transaction([i.prisma.$executeRawUnsafe(`
        UPDATE students
        SET academic_year_id = $1,
            academic_year = $2,
            current_class_id = $3,
            current_section_id = $4,
            section_id = COALESCE($4, section_id),
            student_status = 'PROMOTED',
            is_active = true,
            status_updated_at = CURRENT_TIMESTAMP,
            status_reason = 'Promoted to next academic year',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        `,c.id,c.academic_year,t,r,e.student_id),i.prisma.$executeRawUnsafe(`
        INSERT INTO student_year_enrollments (
          school_id,
          student_id,
          academic_year_id,
          class_id,
          section_id,
          status,
          source,
          metadata
        )
        VALUES ($1,$2,$3,$4,$5,'ACTIVE','promotion',$6::jsonb)
        ON CONFLICT (student_id, academic_year_id)
        DO UPDATE SET
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          status = 'ACTIVE',
          updated_at = CURRENT_TIMESTAMP,
          metadata = EXCLUDED.metadata
        `,l.school_id,e.student_id,c.id,t,r,JSON.stringify({workflowId:l.id})),i.prisma.$executeRawUnsafe(`
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
        VALUES ($1,$2,$3,$4,$5,'PROMOTED',CURRENT_TIMESTAMP,$6,$7::jsonb)
        `,e.student_id,l.school_id,c.id,t,r,a.user?.id??null,JSON.stringify({workflowId:l.id,sourceAcademicYearId:l.source_academic_year_id})),i.prisma.$executeRawUnsafe(`
        INSERT INTO student_promotions (
          school_id,
          student_id,
          from_class_id,
          from_section_id,
          to_class_id,
          to_section_id,
          academic_year,
          source_academic_year_id,
          target_academic_year_id,
          promotion_date,
          promoted_by,
          promoted_by_user_id,
          approval_status,
          approved_by,
          approved_at,
          metadata
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_DATE,'SYSTEM',$10,'APPROVED',$10,CURRENT_TIMESTAMP,$11::jsonb)
        `,l.school_id,e.student_id,e.source_class_id,e.source_section_id,t,r,c.academic_year,l.source_academic_year_id,c.id,a.user?.id??null,JSON.stringify({workflowId:l.id})),i.prisma.$executeRawUnsafe(`
        UPDATE promotion_workflow_students
        SET status = 'EXECUTED',
            updated_at = CURRENT_TIMESTAMP
        WHERE workflow_id = $1
          AND student_id = $2
        `,l.id,e.student_id)]),_+=1}return await i.prisma.$executeRawUnsafe(`
    UPDATE promotion_workflows
    SET approval_status = 'EXECUTED',
        executed_by = $1,
        executed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,a.user?.id??null,l.id),await (0,s.recordEvent)({school_id:l.school_id,academic_year_id:l.target_academic_year_id,user_id:a.user?.id,actor_role:a.user?.role,module_name:"promotions",event_type:"PROMOTION_WORKFLOW_EXECUTED",action:"execute",entity_type:"promotion_workflow",entity_id:l.id,summary:"Promotion workflow executed",payload:{workflowId:l.id,executed:_,targetAcademicYear:c.academic_year}}),r.NextResponse.json({workflowId:l.id,executed:_})}[i,s,n]=o.then?(await o)():o,e.s(["POST",0,d]),a()}catch(e){a(e)}},!1),965110,e=>e.a(async(t,a)=>{try{var r=e.i(747909),i=e.i(174017),s=e.i(996250),n=e.i(759756),o=e.i(561916),d=e.i(174677),l=e.i(869741),c=e.i(316795),u=e.i(487718),_=e.i(995169),p=e.i(47587),m=e.i(666012),y=e.i(570101),h=e.i(626937),E=e.i(10372),w=e.i(193695);e.i(52474);var f=e.i(600220),R=e.i(381402),v=t([R]);[R]=v.then?(await v)():v;let T=new r.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/promotions/[id]/execute/route",pathname:"/api/promotions/[id]/execute",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/promotions/[id]/execute/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:C,serverHooks:$}=T;async function x(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/promotions/[id]/execute/route";r=r.replace(/\/index$/,"")||"/";let s=await T.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:v,params:x,nextConfig:g,parsedUrl:C,isDraftMode:$,prerenderManifest:A,routerServerContext:S,isOnDemandRevalidate:N,revalidateOnlyGenerated:P,resolvedPathname:U,clientReferenceManifest:O,serverActionsManifest:b}=s,M=(0,l.normalizeAppPath)(r),I=!!(A.dynamicRoutes[M]||A.routes[U]),k=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,C,!1):t.end("This page could not be found"),null);if(I&&!$){let e=!!A.routes[U],t=A.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(g.adapterPath)return await k();throw new w.NoFallbackError}}let D=null;!I||T.isDev||$||(D=U,D="/index"===D?"/":D);let q=!0===T.isDev||!I,j=I&&!q;b&&O&&(0,d.setManifestsSingleton)({page:r,clientReferenceManifest:O,serverActionsManifest:b});let H=e.method||"GET",F=(0,o.getTracer)(),L=F.getActiveScopeSpan(),W=!!(null==S?void 0:S.isWrappedByNextServer),B=!!(0,n.getRequestMeta)(e,"minimalMode"),V=(0,n.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,g,A,B);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let X={params:x,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!g.experimental.authInterrupts},cacheComponents:!!g.cacheComponents,supportsDynamicResponse:q,incrementalCache:V,cacheLifeProfiles:g.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,i)=>T.onRequestError(e,t,r,i,S)},sharedContext:{buildId:R,deploymentId:v}},K=new c.NodeNextRequest(e),J=new c.NodeNextResponse(t),Y=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t));try{let s,n=async e=>T.handle(Y,X).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",i),s.updateName(t))}else e.updateName(`${H} ${r}`)}),d=async s=>{var o,d;let l=async({previousCacheEntry:i})=>{try{if(!B&&N&&P&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await n(s);e.fetchMetrics=X.renderOpts.fetchMetrics;let o=X.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let d=X.renderOpts.collectedTags;if(!I)return await (0,m.sendResponse)(K,J,r,X.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,y.toNodeOutgoingHttpHeaders)(r.headers);d&&(t[E.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==X.renderOpts.collectedRevalidate&&!(X.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&X.renderOpts.collectedRevalidate,i=void 0===X.renderOpts.collectedExpire||X.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:X.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:N})},!1,S),t}},c=await T.handleResponse({req:e,nextConfig:g,cacheKey:D,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:P,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!I)return null;if((null==c||null==(o=c.value)?void 0:o.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(d=c.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",N?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),$&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,y.fromNodeOutgoingHttpHeaders)(c.value.headers);return B&&I||u.delete(E.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,h.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(K,J,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};W&&L?await d(L):(s=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(_.BaseServerSpan.handleRequest,{spanName:`${H} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},d),void 0,!W))}catch(t){if(t instanceof w.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:N})},!1,S),I)throw t;return await (0,m.sendResponse)(K,J,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:C})},"routeModule",0,T,"serverHooks",0,$,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,C]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0k43mag._.js.map