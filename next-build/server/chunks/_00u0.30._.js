module.exports=[665995,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(19754),r=e.i(368105),s=e.i(493399),o=e.i(410325),l=e.i(527426),d=e.i(15270),u=t([i,r,s,o,l,d]);[i,r,s,o,l,d]=u.then?(await u)():u;let m=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null};async function c(e){let t=await (0,o.requireSchoolModule)("PARENT_PORTAL");if(t.response)return t.response;let a=await (0,i.resolvePlatformContext)(e);if(!a)return n.NextResponse.json({error:"Unauthorized"},{status:401});let r=await d.prisma.$queryRawUnsafe(`
    SELECT
      p.*,
      COALESCE(s.name, NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), 'Student ' || s.id::text) AS student_name,
      t.first_name || ' ' || COALESCE(t.last_name,'') AS teacher_name,
      c.class_name,
      sec.section_name
    FROM ptm_meetings p
    LEFT JOIN students s ON s.id = p.student_id
    LEFT JOIN teachers t ON t.id = p.teacher_id
    LEFT JOIN classes c ON c.id = p.class_id
    LEFT JOIN sections sec ON sec.id = p.section_id
    WHERE ($1::int IS NULL OR p.school_id = $1::int)
      AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
    ORDER BY p.meeting_date DESC, p.id DESC
    LIMIT 200
    `,a.schoolId,a.academicYearId),s=await d.prisma.$queryRawUnsafe(`
    SELECT
      COUNT(*)::int AS total_ptms,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'SCHEDULED')::int AS scheduled_count,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'COMPLETED')::int AS completed_count,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'MISSED')::int AS missed_count,
      COUNT(*) FILTER (WHERE UPPER(COALESCE(status,'')) = 'RESCHEDULED')::int AS rescheduled_count,
      ROUND(
        CASE WHEN COUNT(*) = 0 THEN 0
        ELSE (COUNT(*) FILTER (WHERE COALESCE(parent_confirmation,'') IN ('CONFIRMED','ATTENDED'))::numeric / COUNT(*)::numeric) * 100
        END
      , 2)::numeric AS parent_attendance_pct
    FROM ptm_meetings
    WHERE ($1::int IS NULL OR school_id = $1::int)
      AND ($2::int IS NULL OR academic_year_id = $2::int)
    `,a.schoolId,a.academicYearId);return n.NextResponse.json({meetings:r,summary:s[0]||{}})}async function p(e){let t=await (0,o.requireSchoolModule)("PARENT_PORTAL");if(t.response)return t.response;let a=await (0,i.resolvePlatformContext)(e),u=await (0,r.getCurrentUser)();if(!a||!u)return n.NextResponse.json({error:"Unauthorized"},{status:401});if(!a.schoolId)return n.NextResponse.json({error:"Select a school before scheduling PTM."},{status:400});let c=await e.json();if(!c.meeting_title||!c.meeting_date)return n.NextResponse.json({error:"Meeting title and date are required."},{status:400});let p=(await d.prisma.$queryRawUnsafe(`
    SELECT school_name, school_code, phone, email, principal_name, address
    FROM schools
    WHERE id = $1::int
    LIMIT 1
    `,a.schoolId))[0]||{};await (0,l.ensurePtmWhatsAppTemplates)(a.schoolId,Number(u.id)||null);let E=(await d.prisma.$queryRawUnsafe(`
    INSERT INTO ptm_meetings (
      school_id, academic_year_id, student_id, teacher_id, class_id, section_id,
      meeting_title, meeting_date, meeting_time, mode, parent_confirmation,
      status, notes, action_items, follow_up_date, created_by, updated_by,
      created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'PENDING','SCHEDULED',$11,$12,$13,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
    RETURNING *
    `,a.schoolId,a.academicYearId,m(c.student_id),m(c.teacher_id),m(c.class_id),m(c.section_id),c.meeting_title,new Date(c.meeting_date),c.meeting_time||null,c.mode||"IN_PERSON",c.notes||null,c.action_items||null,c.follow_up_date?new Date(c.follow_up_date):null,Number(u.id)||null))[0]||{},_=await d.prisma.$queryRawUnsafe(`
    SELECT COALESCE(s.name, NULLIF(TRIM(COALESCE(s.first_name,'') || ' ' || COALESCE(s.last_name,'')), ''), 'Student ' || s.id::text) AS student_name
    FROM students s
    WHERE s.id = $1::int
    LIMIT 1
    `,m(c.student_id)),R=await d.prisma.$queryRawUnsafe(`
    SELECT COALESCE(NULLIF(TRIM(COALESCE(t.first_name,'') || ' ' || COALESCE(t.last_name,'')), ''), 'Teacher ' || t.id::text) AS teacher_name
    FROM teachers t
    WHERE t.id = $1::int
    LIMIT 1
    `,m(c.teacher_id)),h=String(_[0]?.student_name||"Student").trim()||"Student",C=String(R[0]?.teacher_name||"Teacher").trim()||"Teacher",S=String(p.school_name||"School").trim()||"School",N=String(c.venue||c.meeting_venue||p.address||p.principal_name||"School premises").trim()||"School premises",T=new Date(c.meeting_date).toLocaleDateString("en-IN"),f=String(c.meeting_time||"-").trim()||"-",A=String(c.parent_phone||c.whatsapp_number||c.mobile||"").trim();return A&&await (0,l.queueWhatsAppMessage)({templateName:"ptm_scheduled",schoolId:a.schoolId,academicYearId:a.academicYearId,userId:Number(u.id)||null,studentId:m(c.student_id),recipient:A,variables:[h,String(c.class_name||c.class_id||"-"),C,T,f,N,S],triggeredBy:"PTM_SCHEDULED",entityType:"ptm_meeting",entityId:Number(E.id)||null,messagePreview:`Dear Parent, PTM scheduled for ${h} at ${S}.`}).catch(e=>{console.error("PTM WhatsApp queue failed:",e)}),await (0,s.recordEvent)({school_id:a.schoolId,academic_year_id:a.academicYearId,user_id:Number(u.id)||null,actor_role:u.role,module_name:"ptm",event_type:"PTM_SCHEDULED",action:"create",entity_type:"ptm_meeting",entity_id:Number(E.id)||null,summary:"Parent teacher meeting scheduled.",payload:{...E,school_name:S}}),n.NextResponse.json({...E,school_name:S},{status:201})}async function E(e){let t=await (0,o.requireSchoolModule)("PARENT_PORTAL");if(t.response)return t.response;let a=await (0,i.resolvePlatformContext)(e);if(!a)return n.NextResponse.json({error:"Unauthorized"},{status:401});let r=await e.json(),s=m(r.id);if(!s)return n.NextResponse.json({error:"Meeting id is required."},{status:400});let l=await d.prisma.$queryRawUnsafe(`
    UPDATE ptm_meetings
    SET parent_confirmation = COALESCE($2, parent_confirmation),
        status = COALESCE($3, status),
        notes = COALESCE($4, notes),
        action_items = COALESCE($5, action_items),
        follow_up_date = COALESCE($6, follow_up_date),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND ($7::int IS NULL OR school_id = $7::int)
    RETURNING *
    `,s,r.parent_confirmation||null,r.status||null,r.notes||null,r.action_items||null,r.follow_up_date?new Date(r.follow_up_date):null,a.schoolId);return n.NextResponse.json(l[0]||null)}e.s(["GET",0,c,"PATCH",0,E,"POST",0,p]),a()}catch(e){a(e)}},!1),311708,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),s=e.i(759756),o=e.i(561916),l=e.i(174677),d=e.i(869741),u=e.i(316795),c=e.i(487718),p=e.i(995169),E=e.i(47587),m=e.i(666012),_=e.i(570101),R=e.i(626937),h=e.i(10372),C=e.i(193695);e.i(52474);var S=e.i(600220),N=e.i(665995),T=t([N]);[N]=T.then?(await T)():T;let A=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/ptm/route",pathname:"/api/ptm",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/ptm/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:w,workUnitAsyncStorage:O,serverHooks:I}=A;async function f(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),A.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/ptm/route";n=n.replace(/\/index$/,"")||"/";let r=await A.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:N,deploymentId:T,params:f,nextConfig:w,parsedUrl:O,isDraftMode:I,prerenderManifest:g,routerServerContext:L,isOnDemandRevalidate:U,revalidateOnlyGenerated:v,resolvedPathname:y,clientReferenceManifest:P,serverActionsManifest:$}=r,M=(0,d.normalizeAppPath)(n),x=!!(g.dynamicRoutes[M]||g.routes[y]),D=async()=>((null==L?void 0:L.render404)?await L.render404(e,t,O,!1):t.end("This page could not be found"),null);if(x&&!I){let e=!!g.routes[y],t=g.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await D();throw new C.NoFallbackError}}let b=null;!x||A.isDev||I||(b=y,b="/index"===b?"/":b);let H=!0===A.isDev||!x,q=x&&!H;$&&P&&(0,l.setManifestsSingleton)({page:n,clientReferenceManifest:P,serverActionsManifest:$});let F=e.method||"GET",j=(0,o.getTracer)(),W=j.getActiveScopeSpan(),k=!!(null==L?void 0:L.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),K=(0,s.getRequestMeta)(e,"incrementalCache")||await A.getIncrementalCache(e,w,g,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let G={params:f,previewProps:g.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:H,incrementalCache:K,cacheLifeProfiles:w.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>A.onRequestError(e,t,n,i,L)},sharedContext:{buildId:N,deploymentId:T}},Y=new u.NodeNextRequest(e),z=new u.NodeNextResponse(t),J=c.NextRequestAdapter.fromNodeNextRequest(Y,(0,c.signalFromNodeResponse)(t));try{let r,s=async e=>A.handle(J,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${F} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${F} ${n}`)}),l=async r=>{var o,l;let d=async({previousCacheEntry:i})=>{try{if(!B&&U&&v&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(r);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=G.renderOpts.collectedTags;if(!x)return await (0,m.sendResponse)(Y,z,n,G.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[h.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,i=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:S.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:U})},!1,L),t}},u=await A.handleResponse({req:e,nextConfig:w,cacheKey:b,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:g,isRoutePPREnabled:!1,isOnDemandRevalidate:U,revalidateOnlyGenerated:v,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:B});if(!x)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==S.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",U?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,_.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&x||c.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(Y,z,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};k&&W?await l(W):(r=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},l),void 0,!k))}catch(t){if(t instanceof C.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:U})},!1,L),x)throw t;return await (0,m.sendResponse)(Y,z,new Response(null,{status:500})),null}}e.s(["handler",0,f,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:O})},"routeModule",0,A,"serverHooks",0,I,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,O]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_00u0.30._.js.map