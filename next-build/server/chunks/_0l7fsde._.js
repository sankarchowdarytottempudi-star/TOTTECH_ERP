module.exports=[754898,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(368105),r=e.i(599683),s=e.i(597380),c=e.i(19754),o=e.i(493399),d=e.i(15270),l=e.i(410325),u=t([n,r,c,o,d,l]);async function _(e){try{let t=await (0,l.requireSchoolModule)("TEACHERS");if(t.response)return t.response;let a=await (0,c.resolvePlatformContext)(e);if(!a)return i.NextResponse.json([]);let n=a.schoolId,r=a.academicYearId,{searchParams:s}=new URL(e.url),o=Number(s.get("class_id"))||null,u=Number(s.get("section_id"))||null,_=Number(s.get("subject_id"))||null,E=await d.prisma.$queryRawUnsafe(`
        WITH attendance_stats AS (
          SELECT
            teacher_id,
            CASE
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'PRESENT')::numeric / COUNT(*)::numeric) * 100, 0)
              ELSE 0
            END AS attendance_percent
          FROM teacher_attendance
          WHERE ($1::int IS NULL OR school_id = $1::int)
            AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          GROUP BY teacher_id
        ),
        homework_stats AS (
          SELECT
            teacher_id,
            COUNT(*)::int AS homework_count,
            CASE
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) IN ('COMPLETED','PUBLISHED','ACTIVE'))::numeric / COUNT(*)::numeric) * 100, 0)
              ELSE 0
            END AS homework_completion_percent
          FROM homework_assignments
          WHERE ($1::int IS NULL OR school_id = $1::int)
            AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          GROUP BY teacher_id
        ),
        marks_stats AS (
          SELECT
            tca.teacher_id,
            CASE
              WHEN SUM(m.total_marks) > 0 THEN ROUND((SUM(m.obtained_marks)::numeric / SUM(m.total_marks)::numeric) * 100, 0)
              ELSE 0
            END AS exam_performance_percent
          FROM teacher_class_assignments tca
          LEFT JOIN marks m
            ON m.school_id = tca.school_id
           AND ($2::int IS NULL OR m.academic_year_id = $2::int OR m.academic_year_id IS NULL)
           AND ($3::int IS NULL OR m.subject_id = $3::int OR tca.subject_id = $3::int)
          WHERE ($1::int IS NULL OR tca.school_id = $1::int)
            AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
          GROUP BY tca.teacher_id
        )
        SELECT
          t.*,
          ay.academic_year AS selected_academic_year,
          MIN(c.class_name) AS class_name,
          MIN(sec.section_name) AS section_name,
          COALESCE(att.attendance_percent, 0)::int AS attendance_percent,
          COALESCE(hw.homework_completion_percent, 0)::int AS homework_completion_percent,
          COALESCE(ms.exam_performance_percent, 0)::int AS exam_performance_percent,
          ROUND((
            COALESCE(att.attendance_percent, 0) * 0.30 +
            COALESCE(hw.homework_completion_percent, 0) * 0.30 +
            COALESCE(ms.exam_performance_percent, 0) * 0.40
          ), 0)::int AS performance_percent,
          ROUND((
            COALESCE(hw.homework_completion_percent, 0) * 0.35 +
            COALESCE(ms.exam_performance_percent, 0) * 0.65
          ), 0)::int AS student_outcome_percent,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'assignment_id', tca.id,
                'class_id', tca.class_id,
                'class_name', c.class_name,
                'section_id', tca.section_id,
                'section_name', sec.section_name,
                'subject_id', tca.subject_id,
                'subject_name', sub.subject_name,
                'assignment_type', tca.assignment_type
              )
            ) FILTER (WHERE tca.id IS NOT NULL),
            '[]'::json
          ) AS assignments
        FROM teachers t
        LEFT JOIN academic_years ay
          ON ay.id = t.academic_year_id
        LEFT JOIN teacher_class_assignments tca
          ON tca.teacher_id = t.id
          AND tca.status = 'ACTIVE'
          AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
        LEFT JOIN classes c ON c.id = tca.class_id
        LEFT JOIN sections sec ON sec.id = tca.section_id
        LEFT JOIN subjects sub ON sub.id = tca.subject_id
        LEFT JOIN attendance_stats att ON att.teacher_id = t.id
        LEFT JOIN homework_stats hw ON hw.teacher_id = t.id
        LEFT JOIN marks_stats ms ON ms.teacher_id = t.id
        WHERE ($1::int IS NULL OR t.school_id = $1::int)
          AND (
            $2::int IS NULL
            OR t.academic_year_id = $2::int
            OR t.academic_year_id IS NULL
          )
          AND ($3::int IS NULL OR tca.subject_id = $3::int)
          AND ($4::int IS NULL OR tca.class_id = $4::int)
          AND ($5::int IS NULL OR tca.section_id = $5::int)
        GROUP BY t.id, ay.academic_year, att.attendance_percent, hw.homework_completion_percent, ms.exam_performance_percent
        ORDER BY t.id DESC
        `,n,r,_,o,u);return i.NextResponse.json(E)}catch(e){return console.error(e),(0,s.apiError)(e,"Failed to fetch teachers")}}async function E(e){try{let t=await (0,l.requireSchoolModule)("TEACHERS");if(t.response)return t.response;let a=await e.json(),c=await (0,n.getCurrentUser)();if(!c)return(0,s.validationError)("Login required before adding a teacher.");let u=Number(a.school_id??c.school_id)||null;if(!u)return(0,s.validationError)("Select a school before adding a teacher.");if(!a.first_name)return(0,s.validationError)("Teacher first name is required.");let _=await (0,r.getSelectedAcademicYear)(u),E=Number(a.academic_year_id??_?.id??c.academic_year_id)||null;if(!E)return(0,s.validationError)("Select an academic year before adding a teacher.");let m=Number(a.class_id)||null,p=Number(a.section_id)||null,R=Number(a.subject_id)||null,h=Array.isArray(a.assignments)?a.assignments.map(e=>({class_id:Number(e.class_id)||null,section_id:Number(e.section_id)||null,subject_id:Number(e.subject_id)||null,assignment_type:String(e.assignment_type||a.assignment_type||"SUBJECT_TEACHER").toUpperCase()})).filter(e=>e.class_id||e.subject_id):m||R?[{class_id:m,section_id:p,subject_id:R,assignment_type:a.assignment_type||"CLASS_TEACHER"}]:[];if(m&&!(await d.prisma.$queryRawUnsafe(`
          SELECT id
          FROM classes
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
          `,m,u)).length)return(0,s.validationError)("Selected class does not belong to the selected school.");if(p&&!(await d.prisma.$queryRawUnsafe(`
          SELECT id
          FROM sections
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
            AND ($3::int IS NULL OR class_id = $3::int)
          `,p,u,m)).length)return(0,s.validationError)("Selected section must belong to the selected class and school.");let N=(await d.prisma.$queryRawUnsafe(`
        INSERT INTO teachers (
          school_id,
          academic_year_id,
          employee_id,
          first_name,
          last_name,
          gender,
          phone,
          email,
          qualification,
          experience_years,
          joining_date,
          department,
          designation,
          salary,
          address,
          created_by,
          is_active,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,u,E,a.employee_id||null,a.first_name||null,a.last_name||null,a.gender||null,a.phone||null,a.email||null,a.qualification||null,a.experience_years?Number(a.experience_years):null,a.joining_date?new Date(a.joining_date):null,a.department||null,a.designation||null,a.salary?Number(a.salary):null,a.address||null,c.id||null))[0];if(N?.id)for(let e of h)await d.prisma.$executeRawUnsafe(`
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
          assigned_at,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'ACTIVE',$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (
          teacher_id,
          academic_year_id,
          class_id,
          (COALESCE(section_id, 0)),
          (COALESCE(subject_id, 0)),
          assignment_type
        )
        WHERE status = 'ACTIVE'
        DO UPDATE SET
          section_id = EXCLUDED.section_id,
          subject_id = EXCLUDED.subject_id,
          assigned_by = EXCLUDED.assigned_by,
          updated_at = CURRENT_TIMESTAMP
        `,u,E,Number(N.id),e.class_id,e.section_id,e.subject_id,e.assignment_type,c.id||null);return await (0,o.recordEvent)({school_id:u,academic_year_id:E,user_id:c.id,actor_role:c.role,module_name:"teachers",event_type:"TEACHER_CREATED",action:"create",entity_type:"teacher",entity_id:Number(N?.id)||null,summary:"Teacher record created",payload:{assignments:h}}),i.NextResponse.json(N,{status:201})}catch(e){return console.error(e),(0,s.apiError)(e,"Failed to save teacher")}}[n,r,c,o,d,l]=u.then?(await u)():u,e.s(["GET",0,_,"POST",0,E]),a()}catch(e){a(e)}},!1),267577,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),c=e.i(561916),o=e.i(174677),d=e.i(869741),l=e.i(316795),u=e.i(487718),_=e.i(995169),E=e.i(47587),m=e.i(666012),p=e.i(570101),R=e.i(626937),h=e.i(10372),N=e.i(193695);e.i(52474);var S=e.i(600220),C=e.i(754898),O=t([C]);[C]=O.then?(await O)():O;let T=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/teachers/route",pathname:"/api/teachers",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/teachers/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:L,workUnitAsyncStorage:y,serverHooks:g}=T;async function A(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/teachers/route";i=i.replace(/\/index$/,"")||"/";let r=await T.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,deploymentId:O,params:A,nextConfig:L,parsedUrl:y,isDraftMode:g,prerenderManifest:U,routerServerContext:f,isOnDemandRevalidate:I,revalidateOnlyGenerated:w,resolvedPathname:$,clientReferenceManifest:b,serverActionsManifest:v}=r,D=(0,d.normalizeAppPath)(i),x=!!(U.dynamicRoutes[D]||U.routes[$]),P=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,y,!1):t.end("This page could not be found"),null);if(x&&!g){let e=!!U.routes[$],t=U.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(L.adapterPath)return await P();throw new N.NoFallbackError}}let M=null;!x||T.isDev||g||(M=$,M="/index"===M?"/":M);let H=!0===T.isDev||!x,j=x&&!H;v&&b&&(0,o.setManifestsSingleton)({page:i,clientReferenceManifest:b,serverActionsManifest:v});let k=e.method||"GET",F=(0,c.getTracer)(),q=F.getActiveScopeSpan(),W=!!(null==f?void 0:f.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),J=(0,s.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,L,U,B);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let G={params:A,previewProps:U.preview,renderOpts:{experimental:{authInterrupts:!!L.experimental.authInterrupts},cacheComponents:!!L.cacheComponents,supportsDynamicResponse:H,incrementalCache:J,cacheLifeProfiles:L.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>T.onRequestError(e,t,i,n,f)},sharedContext:{buildId:C,deploymentId:O}},V=new l.NodeNextRequest(e),K=new l.NodeNextResponse(t),Y=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let r,s=async e=>T.handle(Y,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${k} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${k} ${i}`)}),o=async r=>{var c,o;let d=async({previousCacheEntry:n})=>{try{if(!B&&I&&w&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(r);e.fetchMetrics=G.renderOpts.fetchMetrics;let c=G.renderOpts.pendingWaitUntil;c&&a.waitUntil&&(a.waitUntil(c),c=void 0);let o=G.renderOpts.collectedTags;if(!x)return await (0,m.sendResponse)(V,K,i,G.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);o&&(t[h.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,n=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:S.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:I})},!1,f),t}},l=await T.handleResponse({req:e,nextConfig:L,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:U,isRoutePPREnabled:!1,isOnDemandRevalidate:I,revalidateOnlyGenerated:w,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:B});if(!x)return null;if((null==l||null==(c=l.value)?void 0:c.kind)!==S.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",I?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return B&&x||u.delete(h.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,R.getCacheControlHeader)(l.cacheControl)),await (0,m.sendResponse)(V,K,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};W&&q?await o(q):(r=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(_.BaseServerSpan.handleRequest,{spanName:`${k} ${i}`,kind:c.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},o),void 0,!W))}catch(t){if(t instanceof N.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:I})},!1,f),x)throw t;return await (0,m.sendResponse)(V,K,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:L,workUnitAsyncStorage:y})},"routeModule",0,T,"serverHooks",0,g,"workAsyncStorage",0,L,"workUnitAsyncStorage",0,y]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0l7fsde._.js.map