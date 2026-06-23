module.exports=[681409,e=>e.a(async(t,a)=>{try{var s=e.i(89171),i=e.i(368105),n=e.i(599683),r=e.i(597380),c=e.i(15270),o=t([i,n,c]);[i,n,c]=o.then?(await o)():o;let l=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null};async function d(e){try{let t,a=await (0,i.getCurrentUser)();if(!a)return(0,r.validationError)("Login required before loading school roster.");let{searchParams:o}=new URL(e.url),d=l(o.get("class_id")),u=l(o.get("section_id")),_=(t=o.get("q"))&&t.trim()?`%${t.trim().toLowerCase()}%`:null,E=("SUPER_ADMIN"!==a.role||a.school_id)&&Number(a.school_id)||null,R=await (0,n.getSelectedAcademicYear)(E),O=Number(a.academic_year_id??R?.id)||null,[L,p,m,N,C]=await Promise.all([c.prisma.$queryRawUnsafe(`
        SELECT
          c.*,
          COUNT(DISTINCT sec.id)::int AS section_count,
          COUNT(DISTINCT s.id)::int AS student_count,
          COUNT(DISTINCT tca.teacher_id)::int AS teacher_count
        FROM classes c
        LEFT JOIN sections sec ON sec.class_id = c.id
        LEFT JOIN students s
          ON s.school_id = c.school_id
          AND COALESCE(s.current_class_id, 0) = c.id
        LEFT JOIN teacher_class_assignments tca
          ON tca.class_id = c.id
          AND tca.status = 'ACTIVE'
          AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
        WHERE ($1::int IS NULL OR c.school_id = $1::int)
        GROUP BY c.id
        ORDER BY c.class_name ASC, c.id ASC
        `,E,O),c.prisma.$queryRawUnsafe(`
        SELECT
          sec.*,
          c.class_name,
          COUNT(DISTINCT s.id)::int AS student_count,
          COUNT(DISTINCT tca.teacher_id)::int AS teacher_count
        FROM sections sec
        LEFT JOIN classes c ON c.id = sec.class_id
        LEFT JOIN students s
          ON s.school_id = sec.school_id
          AND COALESCE(s.current_section_id, s.section_id, 0) = sec.id
        LEFT JOIN teacher_class_assignments tca
          ON tca.section_id = sec.id
          AND tca.status = 'ACTIVE'
          AND ($3::int IS NULL OR tca.academic_year_id = $3::int OR tca.academic_year_id IS NULL)
        WHERE ($1::int IS NULL OR sec.school_id = $1::int)
          AND ($2::int IS NULL OR sec.class_id = $2::int)
        GROUP BY sec.id, c.class_name
        ORDER BY c.class_name ASC, sec.section_name ASC
        `,E,d,O),c.prisma.$queryRawUnsafe(`
        SELECT
          s.id,
          s.school_id,
          s.admission_number,
          s.enrollment_number,
          s.name,
          s.first_name,
          s.middle_name,
          s.last_name,
          s.phone,
          s.email,
          s.roll_number,
          COALESCE(s.current_class_id, sye.class_id) AS class_id,
          COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id,
          c.class_name,
          sec.section_name,
          ay.academic_year
        FROM students s
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        LEFT JOIN academic_years ay ON ay.id = COALESCE(s.academic_year_id, sye.academic_year_id)
        WHERE ($1::int IS NULL OR s.school_id = $1::int)
          AND ($3::int IS NULL OR COALESCE(s.current_class_id, sye.class_id) = $3::int)
          AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $4::int)
          AND (
            $5::text IS NULL
            OR LOWER(COALESCE(s.name, '')) LIKE $5::text
            OR LOWER(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, '')) LIKE $5::text
            OR LOWER(COALESCE(s.admission_number, '')) LIKE $5::text
            OR LOWER(COALESCE(s.enrollment_number, '')) LIKE $5::text
            OR LOWER(COALESCE(s.phone, '')) LIKE $5::text
          )
        ORDER BY s.first_name ASC NULLS LAST, s.id DESC
        LIMIT 250
        `,E,O,d,u,_),c.prisma.$queryRawUnsafe(`
        SELECT
          t.id,
          t.school_id,
          t.employee_id,
          t.first_name,
          t.last_name,
          t.phone,
          t.email,
          t.department,
          t.designation,
          ay.academic_year,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'assignment_id', tca.id,
                'class_id', tca.class_id,
                'class_name', c.class_name,
                'section_id', tca.section_id,
                'section_name', sec.section_name,
                'assignment_type', tca.assignment_type
              )
            ) FILTER (WHERE tca.id IS NOT NULL),
            '[]'::json
          ) AS assignments
        FROM teachers t
        LEFT JOIN teacher_class_assignments tca
          ON tca.teacher_id = t.id
          AND tca.status = 'ACTIVE'
          AND ($2::int IS NULL OR tca.academic_year_id = $2::int OR tca.academic_year_id IS NULL)
        LEFT JOIN classes c ON c.id = tca.class_id
        LEFT JOIN sections sec ON sec.id = tca.section_id
        LEFT JOIN academic_years ay ON ay.id = t.academic_year_id
        WHERE ($1::int IS NULL OR t.school_id = $1::int)
          AND ($3::int IS NULL OR tca.class_id = $3::int)
          AND ($4::int IS NULL OR tca.section_id = $4::int)
          AND (
            $5::text IS NULL
            OR LOWER(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) LIKE $5::text
            OR LOWER(COALESCE(t.employee_id, '')) LIKE $5::text
            OR LOWER(COALESCE(t.phone, '')) LIKE $5::text
            OR LOWER(COALESCE(t.email, '')) LIKE $5::text
            OR LOWER(COALESCE(t.department, '')) LIKE $5::text
          )
        GROUP BY t.id, ay.academic_year
        ORDER BY t.first_name ASC NULLS LAST, t.id DESC
        LIMIT 250
        `,E,O,d,u,_),c.prisma.$queryRawUnsafe(`
        SELECT id, school_id, academic_year_id, subject_name, subject_code
        FROM subjects
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY subject_name ASC NULLS LAST, id ASC
        `,E,O)]);return s.NextResponse.json({school_id:E,academic_year_id:O,academic_year:R?.academic_year??null,filters:{class_id:d,section_id:u,q:o.get("q")??""},classes:L,sections:p,students:m,teachers:N,subjects:C})}catch(e){return console.error("Roster context error:",e),(0,r.apiError)(e,"Failed to load school roster.")}}e.s(["GET",0,d]),a()}catch(e){a(e)}},!1),592455,e=>e.a(async(t,a)=>{try{var s=e.i(747909),i=e.i(174017),n=e.i(996250),r=e.i(759756),c=e.i(561916),o=e.i(174677),d=e.i(869741),l=e.i(316795),u=e.i(487718),_=e.i(995169),E=e.i(47587),R=e.i(666012),O=e.i(570101),L=e.i(626937),p=e.i(10372),m=e.i(193695);e.i(52474);var N=e.i(600220),C=e.i(681409),S=t([C]);[C]=S.then?(await S)():S;let A=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/roster/route",pathname:"/api/roster",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/roster/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:I,workUnitAsyncStorage:y,serverHooks:T}=A;async function h(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),A.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let s="/api/roster/route";s=s.replace(/\/index$/,"")||"/";let n=await A.prepare(e,t,{srcPage:s,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,deploymentId:S,params:h,nextConfig:I,parsedUrl:y,isDraftMode:T,prerenderManifest:g,routerServerContext:U,isOnDemandRevalidate:$,revalidateOnlyGenerated:f,resolvedPathname:v,clientReferenceManifest:w,serverActionsManifest:x}=n,D=(0,d.normalizeAppPath)(s),b=!!(g.dynamicRoutes[D]||g.routes[v]),F=async()=>((null==U?void 0:U.render404)?await U.render404(e,t,y,!1):t.end("This page could not be found"),null);if(b&&!T){let e=!!g.routes[v],t=g.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(I.adapterPath)return await F();throw new m.NoFallbackError}}let P=null;!b||A.isDev||T||(P=v,P="/index"===P?"/":P);let q=!0===A.isDev||!b,H=b&&!q;x&&w&&(0,o.setManifestsSingleton)({page:s,clientReferenceManifest:w,serverActionsManifest:x});let M=e.method||"GET",W=(0,c.getTracer)(),K=W.getActiveScopeSpan(),j=!!(null==U?void 0:U.isWrappedByNextServer),B=!!(0,r.getRequestMeta)(e,"minimalMode"),J=(0,r.getRequestMeta)(e,"incrementalCache")||await A.getIncrementalCache(e,I,g,B);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let k={params:h,previewProps:g.preview,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:q,incrementalCache:J,cacheLifeProfiles:I.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,s,i)=>A.onRequestError(e,t,s,i,U)},sharedContext:{buildId:C,deploymentId:S}},Y=new l.NodeNextRequest(e),G=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(Y,(0,u.signalFromNodeResponse)(t));try{let n,r=async e=>A.handle(V,k).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=W.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${M} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",i),n.updateName(t))}else e.updateName(`${M} ${s}`)}),o=async n=>{var c,o;let d=async({previousCacheEntry:i})=>{try{if(!B&&$&&f&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await r(n);e.fetchMetrics=k.renderOpts.fetchMetrics;let c=k.renderOpts.pendingWaitUntil;c&&a.waitUntil&&(a.waitUntil(c),c=void 0);let o=k.renderOpts.collectedTags;if(!b)return await (0,R.sendResponse)(Y,G,s,k.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,O.toNodeOutgoingHttpHeaders)(s.headers);o&&(t[p.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==k.renderOpts.collectedRevalidate&&!(k.renderOpts.collectedRevalidate>=p.INFINITE_CACHE)&&k.renderOpts.collectedRevalidate,i=void 0===k.renderOpts.collectedExpire||k.renderOpts.collectedExpire>=p.INFINITE_CACHE?void 0:k.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:s,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:$})},!1,U),t}},l=await A.handleResponse({req:e,nextConfig:I,cacheKey:P,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:g,isRoutePPREnabled:!1,isOnDemandRevalidate:$,revalidateOnlyGenerated:f,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:B});if(!b)return null;if((null==l||null==(c=l.value)?void 0:c.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",$?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,O.fromNodeOutgoingHttpHeaders)(l.value.headers);return B&&b||u.delete(p.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,L.getCacheControlHeader)(l.cacheControl)),await (0,R.sendResponse)(Y,G,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};j&&K?await o(K):(n=W.getActiveScopeSpan(),await W.withPropagatedContext(e.headers,()=>W.trace(_.BaseServerSpan.handleRequest,{spanName:`${M} ${s}`,kind:c.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},o),void 0,!j))}catch(t){if(t instanceof m.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:$})},!1,U),b)throw t;return await (0,R.sendResponse)(Y,G,new Response(null,{status:500})),null}}e.s(["handler",0,h,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:y})},"routeModule",0,A,"serverHooks",0,T,"workAsyncStorage",0,I,"workUnitAsyncStorage",0,y]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0t4~mvu._.js.map