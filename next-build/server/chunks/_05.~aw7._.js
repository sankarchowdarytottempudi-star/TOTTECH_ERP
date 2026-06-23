module.exports=[835456,e=>e.a(async(t,a)=>{try{var s=e.i(89171),r=e.i(368105),i=e.i(597380),n=e.i(19754),o=e.i(493399),l=e.i(15270),d=t([r,n,o,l]);[r,n,o,l]=d.then?(await d)():d;let _=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},m=e=>String(e??"").trim();async function u(e){try{let t=await (0,n.resolvePlatformContext)(e);if(!t)return s.NextResponse.json([]);let{searchParams:a}=new URL(e.url),r=_(a.get("class_id")),i=_(a.get("section_id")),o=_(a.get("subject_id")),d=_(a.get("exam_type_id")),u=await l.prisma.$queryRawUnsafe(`
        SELECT
          su.*,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          et.exam_name AS exam_type_name,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'assignment_id', ssa.id,
                'teacher_id', ssa.teacher_id,
                'teacher_name', TRIM(COALESCE(t.first_name,'') || ' ' || COALESCE(t.last_name,'')),
                'expected_completion_percent', ssa.expected_completion_percent,
                'actual_completion_percent', ssa.actual_completion_percent,
                'completed_periods', ssa.completed_periods,
                'status', ssa.status,
                'remarks', ssa.remarks
              )
            ) FILTER (WHERE ssa.id IS NOT NULL),
            '[]'::json
          ) AS assignments
        FROM syllabus_units su
        LEFT JOIN classes c ON c.id = su.class_id
        LEFT JOIN sections sec ON sec.id = su.section_id
        LEFT JOIN subjects sub ON sub.id = su.subject_id
        LEFT JOIN exam_types et ON et.id = su.exam_type_id
        LEFT JOIN syllabus_staff_assignments ssa ON ssa.syllabus_unit_id = su.id
        LEFT JOIN teachers t ON t.id = ssa.teacher_id
        WHERE ($1::int IS NULL OR su.school_id = $1::int)
          AND ($2::int IS NULL OR su.academic_year_id = $2::int OR su.academic_year_id IS NULL)
          AND ($3::int IS NULL OR su.class_id = $3::int)
          AND ($4::int IS NULL OR su.section_id = $4::int)
          AND ($5::int IS NULL OR su.subject_id = $5::int)
          AND ($6::int IS NULL OR su.exam_type_id = $6::int)
        GROUP BY su.id, c.class_name, sec.section_name, sub.subject_name, et.exam_name
        ORDER BY su.created_at DESC, su.id DESC
        `,t.schoolId,t.academicYearId,r,i,o,d);return s.NextResponse.json(u)}catch(e){return console.error(e),(0,i.apiError)(e,"Failed to load syllabus")}}async function c(e){try{let t=await (0,r.getCurrentUser)();if(!t)return(0,i.validationError)("Login required before creating syllabus.");let a=await e.json(),d=await (0,n.resolveMutationContext)(e,a),u=d.context;if(!u)return(0,i.validationError)(d.error||"School and academic year context is required.");let c=_(a.school_id)??u.requiredSchoolId,p=_(a.academic_year_id)??u.requiredAcademicYearId,E=_(a.class_id),R=_(a.section_id),y=_(a.subject_id),h=_(a.exam_type_id),N=_(a.teacher_id),b=m(a.title);if(!c)return(0,i.validationError)("Select a school before creating syllabus.");if(!p)return(0,i.validationError)("Select an academic year before creating syllabus.");if(!E||!R||!y||!h||!N||!b)return(0,i.validationError)("Class, section, subject, exam type, staff, and syllabus title are required.");let f=await l.prisma.$queryRawUnsafe(`
        INSERT INTO syllabus_units (
          school_id,
          academic_year_id,
          class_id,
          section_id,
          subject_id,
          exam_type_id,
          title,
          description,
          total_periods,
          target_completion_percent,
          start_date,
          target_date,
          status,
          created_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::date,$12::date,$13,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING id
        `,c,p,E,R,y,h,b,m(a.description)||null,_(a.total_periods)??0,Number(a.target_completion_percent||100),m(a.start_date)||null,m(a.target_date)||null,m(a.status)||"PLANNED",t.id||null),g=f[0]?.id;return await l.prisma.$executeRawUnsafe(`
      INSERT INTO syllabus_staff_assignments (
        syllabus_unit_id,
        teacher_id,
        assigned_by,
        expected_completion_percent,
        actual_completion_percent,
        completed_periods,
        status,
        remarks,
        assigned_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,0,0,'ASSIGNED',$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      `,g,N,t.id||null,Number(a.expected_completion_percent||a.target_completion_percent||100),m(a.remarks)||null),await (0,o.recordEvent)({school_id:c,academic_year_id:p,user_id:t.id,actor_role:t.role,module_name:"academics",event_type:"SYLLABUS_CREATED",action:"create",entity_type:"syllabus",entity_id:g,summary:"Syllabus created and assigned to staff",payload:{class_id:E,section_id:R,subject_id:y,exam_type_id:h,teacher_id:N}}),s.NextResponse.json({success:!0,id:g},{status:201})}catch(e){return console.error(e),(0,i.apiError)(e,"Failed to create syllabus")}}async function p(e){try{let t=await (0,r.getCurrentUser)();if(!t)return(0,i.validationError)("Login required before updating syllabus progress.");let a=await e.json(),n=_(a.assignment_id);if(!n)return(0,i.validationError)("Assignment is required.");let d=Math.max(0,Math.min(100,Number(a.actual_completion_percent||0))),u=_(a.completed_periods)??0,c=d>=100?"COMPLETED":m(a.status)||"IN_PROGRESS";await l.prisma.$executeRawUnsafe(`
      UPDATE syllabus_staff_assignments
      SET actual_completion_percent = $2,
          completed_periods = $3,
          status = $4,
          remarks = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,n,d,u,c,m(a.remarks)||null);let p=(await l.prisma.$queryRawUnsafe(`
        SELECT su.*
        FROM syllabus_staff_assignments ssa
        JOIN syllabus_units su ON su.id = ssa.syllabus_unit_id
        WHERE ssa.id = $1
        LIMIT 1
        `,n))[0];return await (0,o.recordEvent)({school_id:Number(p?.school_id)||null,academic_year_id:Number(p?.academic_year_id)||null,user_id:t.id,actor_role:t.role,module_name:"academics",event_type:"SYLLABUS_PROGRESS_UPDATED",action:"update",entity_type:"syllabus",entity_id:Number(p?.id)||n,summary:"Syllabus completion updated",payload:{assignment_id:n,actual_completion_percent:d,completed_periods:u,status:c}}),s.NextResponse.json({success:!0})}catch(e){return console.error(e),(0,i.apiError)(e,"Failed to update syllabus progress")}}e.s(["GET",0,u,"PATCH",0,p,"POST",0,c]),a()}catch(e){a(e)}},!1),528419,e=>e.a(async(t,a)=>{try{var s=e.i(747909),r=e.i(174017),i=e.i(996250),n=e.i(759756),o=e.i(561916),l=e.i(174677),d=e.i(869741),u=e.i(316795),c=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),E=e.i(570101),R=e.i(626937),y=e.i(10372),h=e.i(193695);e.i(52474);var N=e.i(600220),b=e.i(835456),f=t([b]);[b]=f.then?(await f)():f;let S=new s.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/syllabus/route",pathname:"/api/syllabus",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/syllabus/route.ts",nextConfigOutput:"",userland:b,...{}}),{workAsyncStorage:T,workUnitAsyncStorage:v,serverHooks:C}=S;async function g(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),S.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let s="/api/syllabus/route";s=s.replace(/\/index$/,"")||"/";let i=await S.prepare(e,t,{srcPage:s,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,deploymentId:f,params:g,nextConfig:T,parsedUrl:v,isDraftMode:C,prerenderManifest:w,routerServerContext:A,isOnDemandRevalidate:x,revalidateOnlyGenerated:O,resolvedPathname:I,clientReferenceManifest:$,serverActionsManifest:L}=i,U=(0,d.normalizeAppPath)(s),P=!!(w.dynamicRoutes[U]||w.routes[I]),M=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,v,!1):t.end("This page could not be found"),null);if(P&&!C){let e=!!w.routes[I],t=w.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(T.adapterPath)return await M();throw new h.NoFallbackError}}let D=null;!P||S.isDev||C||(D=I,D="/index"===D?"/":D);let q=!0===S.isDev||!P,j=P&&!q;L&&$&&(0,l.setManifestsSingleton)({page:s,clientReferenceManifest:$,serverActionsManifest:L});let H=e.method||"GET",F=(0,o.getTracer)(),k=F.getActiveScopeSpan(),B=!!(null==A?void 0:A.isWrappedByNextServer),G=!!(0,n.getRequestMeta)(e,"minimalMode"),K=(0,n.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,T,w,G);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let J={params:g,previewProps:w.preview,renderOpts:{experimental:{authInterrupts:!!T.experimental.authInterrupts},cacheComponents:!!T.cacheComponents,supportsDynamicResponse:q,incrementalCache:K,cacheLifeProfiles:T.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,s,r)=>S.onRequestError(e,t,s,r,A)},sharedContext:{buildId:b,deploymentId:f}},W=new u.NodeNextRequest(e),Y=new u.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(W,(0,c.signalFromNodeResponse)(t));try{let i,n=async e=>S.handle(V,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",r),i.updateName(t))}else e.updateName(`${H} ${s}`)}),l=async i=>{var o,l;let d=async({previousCacheEntry:r})=>{try{if(!G&&x&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await n(i);e.fetchMetrics=J.renderOpts.fetchMetrics;let o=J.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=J.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(W,Y,s,J.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[y.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,r=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:s,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:x})},!1,A),t}},u=await S.handleResponse({req:e,nextConfig:T,cacheKey:D,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:w,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:O,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:G});if(!P)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",x?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,E.fromNodeOutgoingHttpHeaders)(u.value.headers);return G&&P||c.delete(y.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(W,Y,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};B&&k?await l(k):(i=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${s}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l),void 0,!B))}catch(t){if(t instanceof h.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:x})},!1,A),P)throw t;return await (0,m.sendResponse)(W,Y,new Response(null,{status:500})),null}}e.s(["handler",0,g,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:v})},"routeModule",0,S,"serverHooks",0,C,"workAsyncStorage",0,T,"workUnitAsyncStorage",0,v]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_05.~aw7._.js.map