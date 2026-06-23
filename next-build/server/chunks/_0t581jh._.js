module.exports=[53114,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(15270),n=e.i(493399),s=e.i(215619),o=t([i,n,s]);[i,n,s]=o.then?(await o)():o;let l=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null};async function c(e){let t=await (0,s.requirePermission)({module:"promotions",action:"read"});if(t.response)return t.response;let{searchParams:a}=new URL(e.url),n=t.user?.role==="SUPER_ADMIN"?l(a.get("school_id"))??t.user?.school_id??null:t.user?.school_id??null,o=l(a.get("source_academic_year_id")),c=l(a.get("target_academic_year_id")),[d,u]=await Promise.all([i.prisma.$queryRawUnsafe(`
      SELECT
        t.id,
        t.school_id,
        t.academic_year_id AS current_academic_year_id,
        ay.academic_year AS current_academic_year,
        t.employee_id,
        TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
        t.designation,
        t.department,
        COUNT(DISTINCT tca.id)::int AS assignment_count,
        COUNT(DISTINCT target_tca.id)::int AS target_assignment_count,
        MAX(tr.created_at) AS last_rollover_at,
        MAX(tr.action) AS last_rollover_action
      FROM teachers t
      LEFT JOIN academic_years ay ON ay.id = t.academic_year_id
      LEFT JOIN teacher_class_assignments tca
        ON tca.teacher_id = t.id
        AND tca.status = 'ACTIVE'
        AND ($2::int IS NULL OR tca.academic_year_id = $2::int)
      LEFT JOIN teacher_class_assignments target_tca
        ON target_tca.teacher_id = t.id
        AND target_tca.status = 'ACTIVE'
        AND ($3::int IS NULL OR target_tca.academic_year_id = $3::int)
      LEFT JOIN teacher_rollovers tr
        ON tr.teacher_id = t.id
        AND tr.school_id = t.school_id
        AND ($2::int IS NULL OR tr.source_academic_year_id = $2::int)
        AND ($3::int IS NULL OR tr.target_academic_year_id = $3::int)
      WHERE ($1::int IS NULL OR t.school_id = $1::int)
        AND COALESCE(t.is_active, true) = true
        AND (
          $2::int IS NULL
          OR t.academic_year_id = $2::int
          OR t.academic_year_id IS NULL
          OR tca.id IS NOT NULL
        )
      GROUP BY t.id, ay.academic_year
      ORDER BY teacher_name ASC
      LIMIT 300
      `,n,o,c),i.prisma.$queryRawUnsafe(`
        SELECT
          tr.*,
          TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
          source_year.academic_year AS source_academic_year,
          target_year.academic_year AS target_academic_year
        FROM teacher_rollovers tr
        LEFT JOIN teachers t ON t.id = tr.teacher_id
        LEFT JOIN academic_years source_year ON source_year.id = tr.source_academic_year_id
        LEFT JOIN academic_years target_year ON target_year.id = tr.target_academic_year_id
        WHERE ($1::int IS NULL OR tr.school_id = $1::int)
          AND ($2::int IS NULL OR tr.source_academic_year_id = $2::int)
          AND ($3::int IS NULL OR tr.target_academic_year_id = $3::int)
        ORDER BY tr.created_at DESC NULLS LAST, tr.id DESC
        LIMIT 50
        `,n,o,c)]);return r.NextResponse.json({teachers:d,history:u})}async function d(e){let t,a=await (0,s.requirePermission)({module:"promotions",action:"create"});if(a.response)return a.response;let o=await e.json(),c=a.user?.role==="SUPER_ADMIN"?l(o.school_id)??a.user?.school_id??null:a.user?.school_id??null,d=l(o.source_academic_year_id),u=l(o.target_academic_year_id),_=String(o.action||"CONTINUE").toUpperCase(),p=(t=o.teacher_ids,Array.isArray(t)?t.map(e=>l(e)).filter(e=>"number"==typeof e):[]);if(!c||!d||!u)return r.NextResponse.json({error:"School, source academic year, and target academic year are required for teacher rollover."},{status:400});if(d===u)return r.NextResponse.json({error:"Target academic year must be different from source academic year."},{status:400});if(!p.length)return r.NextResponse.json({error:"Select at least one teacher for rollover."},{status:400});let m=0,h=0,E=0;for(let e of p){let t=(await i.prisma.$queryRawUnsafe(`
        SELECT *
        FROM teachers
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,e,c))[0];if(!t)continue;let r=await i.prisma.$queryRawUnsafe(`
        SELECT *
        FROM teacher_class_assignments
        WHERE teacher_id = $1
          AND school_id = $2
          AND academic_year_id = $3
          AND status = 'ACTIVE'
        `,e,c,d);if("CONTINUE"===_||"TRANSFER"===_){for(let t of r){let r=await i.prisma.$queryRawUnsafe(`
          INSERT INTO teacher_class_assignments (
            school_id,
            academic_year_id,
            teacher_id,
            class_id,
            section_id,
            subject_id,
            assignment_type,
            status,
            assigned_by,
            metadata,
            created_at,
            updated_at
          )
          SELECT $1,$2,$3,$4,$5,$6,$7,'ACTIVE',$8,$9::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
          WHERE NOT EXISTS (
            SELECT 1
            FROM teacher_class_assignments existing
            WHERE existing.teacher_id = $3
              AND existing.academic_year_id = $2
              AND existing.class_id = $4
              AND COALESCE(existing.section_id, 0) = COALESCE($5, 0)
              AND existing.assignment_type = $7
              AND existing.status = 'ACTIVE'
          )
          RETURNING id
          `,c,u,e,Number(t.class_id),Number(t.section_id)||null,Number(t.subject_id)||null,t.assignment_type||"CLASS_TEACHER",a.user?.id??null,JSON.stringify({source:"teacher_rollover",sourceAcademicYearId:d,action:_}));h+=r.length}await i.prisma.teachers.update({where:{id:e},data:{academic_year_id:u,is_active:!0,updated_at:new Date}}),E+=1}"DEACTIVATE"===_&&await i.prisma.teachers.update({where:{id:e},data:{is_active:!1,updated_at:new Date}});let s=await i.prisma.$queryRawUnsafe(`
        SELECT COUNT(*)::int AS count
        FROM teacher_class_assignments
        WHERE teacher_id = $1
          AND school_id = $2
          AND academic_year_id = $3
          AND status = 'ACTIVE'
        `,e,c,u);await i.prisma.$executeRawUnsafe(`
      INSERT INTO teacher_rollovers (
        school_id,
        teacher_id,
        source_academic_year_id,
        target_academic_year_id,
        action,
        source_assignment_count,
        target_assignment_count,
        status,
        remarks,
        created_by,
        metadata
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,'COMPLETED',$8,$9,$10::jsonb)
      `,c,e,d,u,_,r.length,s[0]?.count||0,o.remarks||null,a.user?.id??null,JSON.stringify({source:"promotion_center",source_teacher_academic_year_id:t.academic_year_id,assignmentsCopied:h})),await (0,n.recordEvent)({school_id:c,academic_year_id:u,user_id:a.user?.id,actor_role:a.user?.role,module_name:"promotions",event_type:"TEACHER_ROLLED_OVER",action:"rollover",entity_type:"teacher",entity_id:e,summary:"DEACTIVATE"===_?"Teacher deactivated during academic-year rollover":"Teacher rolled over to target academic year",payload:{action:_,sourceYearId:d,targetYearId:u,source_assignment_count:r.length,target_assignment_count:s[0]?.count||0}}),m+=1}return await (0,n.recordEvent)({school_id:c,academic_year_id:u,user_id:a.user?.id,actor_role:a.user?.role,module_name:"promotions",event_type:"TEACHER_ROLLOVER_COMPLETED",action:"rollover",entity_type:"teacher_rollover",summary:"Teacher rollover completed",payload:{action:_,processed:m,sourceYearId:d,targetYearId:u}}),r.NextResponse.json({processed:m,assignmentsCopied:h,teachersUpdated:E})}e.s(["GET",0,c,"POST",0,d]),a()}catch(e){a(e)}},!1),692580,e=>e.a(async(t,a)=>{try{var r=e.i(747909),i=e.i(174017),n=e.i(996250),s=e.i(759756),o=e.i(561916),c=e.i(174677),d=e.i(869741),l=e.i(316795),u=e.i(487718),_=e.i(995169),p=e.i(47587),m=e.i(666012),h=e.i(570101),E=e.i(626937),R=e.i(10372),y=e.i(193695);e.i(52474);var N=e.i(600220),A=e.i(53114),g=t([A]);[A]=g.then?(await g)():g;let C=new r.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/promotions/teacher-rollover/route",pathname:"/api/promotions/teacher-rollover",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/promotions/teacher-rollover/route.ts",nextConfigOutput:"",userland:A,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:O,serverHooks:v}=C;async function T(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),C.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/promotions/teacher-rollover/route";r=r.replace(/\/index$/,"")||"/";let n=await C.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,deploymentId:g,params:T,nextConfig:S,parsedUrl:O,isDraftMode:v,prerenderManifest:f,routerServerContext:I,isOnDemandRevalidate:$,revalidateOnlyGenerated:w,resolvedPathname:L,clientReferenceManifest:D,serverActionsManifest:U}=n,x=(0,d.normalizeAppPath)(r),b=!!(f.dynamicRoutes[x]||f.routes[L]),M=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,O,!1):t.end("This page could not be found"),null);if(b&&!v){let e=!!f.routes[L],t=f.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await M();throw new y.NoFallbackError}}let P=null;!b||C.isDev||v||(P=L,P="/index"===P?"/":P);let q=!0===C.isDev||!b,H=b&&!q;U&&D&&(0,c.setManifestsSingleton)({page:r,clientReferenceManifest:D,serverActionsManifest:U});let F=e.method||"GET",j=(0,o.getTracer)(),k=j.getActiveScopeSpan(),V=!!(null==I?void 0:I.isWrappedByNextServer),W=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await C.getIncrementalCache(e,S,f,W);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let J={params:T,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:q,incrementalCache:B,cacheLifeProfiles:S.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,i)=>C.onRequestError(e,t,r,i,I)},sharedContext:{buildId:A,deploymentId:g}},K=new l.NodeNextRequest(e),G=new l.NodeNextResponse(t),X=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t));try{let n,s=async e=>C.handle(X,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${F} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",i),n.updateName(t))}else e.updateName(`${F} ${r}`)}),c=async n=>{var o,c;let d=async({previousCacheEntry:i})=>{try{if(!W&&$&&w&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(n);e.fetchMetrics=J.renderOpts.fetchMetrics;let o=J.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let c=J.renderOpts.collectedTags;if(!b)return await (0,m.sendResponse)(K,G,r,J.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(r.headers);c&&(t[R.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,i=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:$})},!1,I),t}},l=await C.handleResponse({req:e,nextConfig:S,cacheKey:P,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:$,revalidateOnlyGenerated:w,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:W});if(!b)return null;if((null==l||null==(o=l.value)?void 0:o.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(c=l.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",$?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),v&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(l.value.headers);return W&&b||u.delete(R.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,E.getCacheControlHeader)(l.cacheControl)),await (0,m.sendResponse)(K,G,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};V&&k?await c(k):(n=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(_.BaseServerSpan.handleRequest,{spanName:`${F} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},c),void 0,!V))}catch(t){if(t instanceof y.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:$})},!1,I),b)throw t;return await (0,m.sendResponse)(K,G,new Response(null,{status:500})),null}}e.s(["handler",0,T,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:O})},"routeModule",0,C,"serverHooks",0,v,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,O]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0t581jh._.js.map