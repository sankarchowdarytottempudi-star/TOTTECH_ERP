module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},215619,e=>e.a(async(t,a)=>{try{var r=e.i(89171),s=e.i(368105),i=e.i(15270),n=t([s,i]);[s,i]=n.then?(await n)():n;let m=e=>e.trim().toUpperCase();async function o(e){if(!e)return new Set;let t=await i.prisma.roles.findFirst({where:{role_name:e}});if(!t)return new Set;let a=(await i.prisma.role_permissions.findMany({where:{role_id:t.id}})).map(e=>e.permission_id).filter(e=>"number"==typeof e);if(!a.length)return new Set;let r=await i.prisma.permissions.findMany({where:{id:{in:a}}});return new Set(r.filter(e=>e.module_name&&e.action_name).map(e=>`${m(e.module_name)}.${m(e.action_name)}`))}async function d(e,t){if(!e?.role)return!1;let a="string"==typeof t?m(t):`${m(t.module)}.${m(t.action)}`;return(await o(e.role)).has(a)}async function c(){let e=await (0,s.getCurrentUser)();return e?{user:e,response:null}:{user:null,response:r.NextResponse.json({error:"Unauthorized"},{status:401})}}async function l(e){let t=await c();return t.user?await d(t.user,e)?{user:t.user,response:null}:{user:t.user,response:r.NextResponse.json({error:"Forbidden"},{status:403})}:t}async function u(e){return"SUPER_ADMIN"===String(e?.role||"").trim().toUpperCase()}async function p(e){return await u(e)?{}:{school_id:e?.school_id??-1}}async function y(e){return e?i.prisma.academic_years.findFirst({where:{school_id:e,is_current:!0},orderBy:{id:"desc"}}):null}async function _(e){let[t,a,r,s]=await Promise.all([o(e.role),y(e.school_id),i.prisma.governance_settings.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{setting_key:"asc"}}),i.prisma.feature_flags.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{flag_key:"asc"}})]);return{user:{id:e.id,school_id:e.school_id,school_name:e.school_name},activeAcademicYear:a,permissions:Array.from(t).sort(),settings:r,flags:s}}e.s(["getActiveAcademicYear",0,y,"getGovernanceSnapshot",0,_,"getRolePermissionCodes",0,o,"requireCurrentUser",0,c,"requirePermission",0,l,"scopedSchoolWhere",0,p,"userHasPermission",0,d]),a()}catch(e){a(e)}},!1),591702,e=>e.a(async(t,a)=>{try{var r=e.i(89171),s=e.i(15270),i=e.i(215619),n=t([s,i]);async function o(e,{params:t}){let a=await (0,i.requireCurrentUser)();if(a.response)return a.response;let{id:n}=await t,d=Number(n),c=a.user?.school_id??null,[l,u,p,y,_,m,h,E,R,f,w,O,v,C,x,g]=await Promise.all([s.prisma.students.findUnique({where:{id:d}}),s.prisma.$queryRawUnsafe(`
      SELECT sye.*, ay.academic_year, c.class_name, sec.section_name
      FROM student_year_enrollments sye
      LEFT JOIN academic_years ay ON ay.id = sye.academic_year_id
      LEFT JOIN classes c ON c.id = sye.class_id
      LEFT JOIN sections sec ON sec.id = sye.section_id
      WHERE sye.student_id = $1
      ORDER BY ay.start_date DESC NULLS LAST, sye.id DESC
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT sp.*, say.academic_year AS source_academic_year, tay.academic_year AS target_academic_year
      FROM student_promotions sp
      LEFT JOIN academic_years say ON say.id = sp.source_academic_year_id
      LEFT JOIN academic_years tay ON tay.id = sp.target_academic_year_id
      WHERE sp.student_id = $1
      ORDER BY COALESCE(sp.promotion_date, sp.promoted_on::date) DESC NULLS LAST, sp.id DESC
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT a.*, ay.academic_year
      FROM attendance_master a
      LEFT JOIN academic_years ay ON ay.id = a.academic_year_id
      WHERE a.student_id = $1
      ORDER BY a.attendance_date DESC NULLS LAST
      LIMIT 200
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT hs.*, ha.title, ha.description, ha.due_date, ay.academic_year
      FROM homework_submissions hs
      LEFT JOIN homework_assignments ha ON ha.id = hs.homework_id
      LEFT JOIN academic_years ay ON ay.id = hs.academic_year_id
      WHERE hs.student_id = $1
      ORDER BY hs.created_at DESC
      LIMIT 200
      `,d),s.prisma.marks.findMany({where:{student_id:d},orderBy:{created_at:"desc"},take:200}),s.prisma.$queryRawUnsafe(`
      SELECT i.*, ay.academic_year
      FROM invoices i
      LEFT JOIN academic_years ay ON ay.id = i.academic_year_id
      WHERE i.student_id = $1
      ORDER BY i.created_at DESC
      LIMIT 200
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT p.*, ay.academic_year
      FROM payments p
      LEFT JOIN academic_years ay ON ay.id = p.academic_year_id
      WHERE p.student_id = $1
      ORDER BY p.created_at DESC
      LIMIT 200
      `,d),s.prisma.concession_requests.findMany({where:{student_id:d},orderBy:{requested_at:"desc"},take:200}),s.prisma.$queryRawUnsafe(`
      SELECT d.*, ay.academic_year
      FROM dining_attendance d
      LEFT JOIN academic_years ay ON ay.id = d.academic_year_id
      WHERE d.student_id = $1
      ORDER BY d.attendance_date DESC
      LIMIT 200
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT ha.*, ay.academic_year
      FROM hostel_allocations ha
      LEFT JOIN academic_years ay ON ay.id = ha.academic_year_id
      WHERE ha.student_id = $1
      ORDER BY ha.allocation_date DESC NULLS LAST, ha.id DESC
      LIMIT 200
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT hmh.*, ay.academic_year
      FROM hostel_movement_history hmh
      LEFT JOIN academic_years ay ON ay.id = hmh.academic_year_id
      WHERE hmh.student_id = $1
      ORDER BY hmh.movement_at DESC
      LIMIT 200
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT ta.*, tr.route_name, ay.academic_year
      FROM transport_assignments ta
      LEFT JOIN transport_routes tr ON tr.id = ta.route_id
      LEFT JOIN academic_years ay ON ay.id = ta.academic_year_id
      WHERE ta.student_id = $1
      ORDER BY ta.id DESC
      LIMIT 200
      `,d),s.prisma.$queryRawUnsafe(`
      SELECT tph.*, ay.academic_year
      FROM transport_pickup_drop_history tph
      LEFT JOIN academic_years ay ON ay.id = tph.academic_year_id
      WHERE tph.student_id = $1
      ORDER BY tph.event_time DESC
      LIMIT 200
      `,d),s.prisma.student_timelines.findMany({where:{student_id:d},orderBy:{occurred_at:"desc"},take:200}),s.prisma.event_ledger.findMany({where:{school_id:c??void 0,entity_type:"student",entity_id:d},orderBy:{occurred_at:"desc"},take:200})]);return r.NextResponse.json({profile:l,academicYears:u,promotions:p,attendance:y,homework:_,marks:m,invoices:h,payments:E,concessions:R,dining:f,hostel:w,hostelMoves:O,transport:v,transportMoves:C,timelines:x,events:g})}[s,i]=n.then?(await n)():n,e.s(["GET",0,o]),a()}catch(e){a(e)}},!1),985078,e=>e.a(async(t,a)=>{try{var r=e.i(747909),s=e.i(174017),i=e.i(996250),n=e.i(759756),o=e.i(561916),d=e.i(174677),c=e.i(869741),l=e.i(316795),u=e.i(487718),p=e.i(995169),y=e.i(47587),_=e.i(666012),m=e.i(570101),h=e.i(626937),E=e.i(10372),R=e.i(193695);e.i(52474);var f=e.i(600220),w=e.i(591702),O=t([w]);[w]=O.then?(await O)():O;let C=new r.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/students/[id]/enterprise-history/route",pathname:"/api/students/[id]/enterprise-history",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/students/[id]/enterprise-history/route.ts",nextConfigOutput:"",userland:w,...{}}),{workAsyncStorage:x,workUnitAsyncStorage:g,serverHooks:N}=C;async function v(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),C.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/students/[id]/enterprise-history/route";r=r.replace(/\/index$/,"")||"/";let i=await C.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,deploymentId:O,params:v,nextConfig:x,parsedUrl:g,isDraftMode:N,prerenderManifest:S,routerServerContext:T,isOnDemandRevalidate:L,revalidateOnlyGenerated:I,resolvedPathname:M,clientReferenceManifest:A,serverActionsManifest:q}=i,D=(0,c.normalizeAppPath)(r),U=!!(S.dynamicRoutes[D]||S.routes[M]),F=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,g,!1):t.end("This page could not be found"),null);if(U&&!N){let e=!!S.routes[M],t=S.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(x.adapterPath)return await F();throw new R.NoFallbackError}}let $=null;!U||C.isDev||N||($=M,$="/index"===$?"/":$);let b=!0===C.isDev||!U,k=U&&!b;q&&A&&(0,d.setManifestsSingleton)({page:r,clientReferenceManifest:A,serverActionsManifest:q});let P=e.method||"GET",H=(0,o.getTracer)(),B=H.getActiveScopeSpan(),j=!!(null==T?void 0:T.isWrappedByNextServer),J=!!(0,n.getRequestMeta)(e,"minimalMode"),W=(0,n.getRequestMeta)(e,"incrementalCache")||await C.getIncrementalCache(e,x,S,J);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let Y={params:v,previewProps:S.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:b,incrementalCache:W,cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,s)=>C.onRequestError(e,t,r,s,T)},sharedContext:{buildId:w,deploymentId:O}},K=new l.NodeNextRequest(e),G=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t));try{let i,n=async e=>C.handle(V,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let t=`${P} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",s),i.updateName(t))}else e.updateName(`${P} ${r}`)}),d=async i=>{var o,d;let c=async({previousCacheEntry:s})=>{try{if(!J&&L&&I&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await n(i);e.fetchMetrics=Y.renderOpts.fetchMetrics;let o=Y.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let d=Y.renderOpts.collectedTags;if(!U)return await (0,_.sendResponse)(K,G,r,Y.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(r.headers);d&&(t[E.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,s=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,y.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:L})},!1,T),t}},l=await C.handleResponse({req:e,nextConfig:x,cacheKey:$,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:L,revalidateOnlyGenerated:I,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:J});if(!U)return null;if((null==l||null==(o=l.value)?void 0:o.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});J||t.setHeader("x-nextjs-cache",L?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(l.value.headers);return J&&U||u.delete(E.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,h.getCacheControlHeader)(l.cacheControl)),await (0,_.sendResponse)(K,G,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};j&&B?await d(B):(i=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${P} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":P,"http.target":e.url}},d),void 0,!j))}catch(t){if(t instanceof R.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,y.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:L})},!1,T),U)throw t;return await (0,_.sendResponse)(K,G,new Response(null,{status:500})),null}}e.s(["handler",0,v,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:g})},"routeModule",0,C,"serverHooks",0,N,"workAsyncStorage",0,x,"workUnitAsyncStorage",0,g]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0lw1_jh._.js.map