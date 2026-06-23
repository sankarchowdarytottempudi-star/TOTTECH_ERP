module.exports=[193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},494371,e=>{"use strict";var t=e.i(747909),r=e.i(174017),n=e.i(996250),a=e.i(759756),s=e.i(561916),o=e.i(174677),i=e.i(869741),l=e.i(316795),d=e.i(487718),u=e.i(995169),c=e.i(47587),p=e.i(666012),h=e.i(570101),m=e.i(626937),v=e.i(10372),R=e.i(193695);e.i(52474);var x=e.i(600220),g=e.i(89171);async function E(e){let{question:t,student:r,studentDNA:n,risk:a,attendancePercent:s,averageMarks:o,subjectPerformance:i,riskFactors:l,examStats:d,aiInsights:u}=await e.json(),c="";return"How can I improve this student?"===t?c=`
STUDENT IMPROVEMENT PLAN

Student:
${r.first_name} ${r.last_name}

Attendance:
${s}%

Average Marks:
${o}%

Risk Level:
${a.level}

Learning Style:
${n.learningStyle}

Career Alignment:
${n.career}

Strength Areas:
${n.strengths.join(", ")}

Improvement Areas:
${n.improvements.join(", ")}

Teacher Actions

1. Focus on weak concepts weekly

2. Provide project-based learning

3. Conduct one-on-one mentoring

4. Track attendance every week

5. Review progress every month

Expected Outcome

Improved academic consistency,
higher promotion readiness and
stronger classroom engagement.
`:"Generate intervention plan"===t?c=`
30 DAY INTERVENTION PLAN

Week 1
• Assess weaknesses
• Parent discussion

Week 2
• Personalized assignments

Week 3
• Mock tests

Week 4
• Performance review

Risk Factors

${l.join("\n")}
`:"Parent discussion points"===t?c=`
PARENT MEETING GUIDE

Student Health:
${u.healthScore}%

Promotion Probability:
${u.promotionProbability}%

Discussion Topics

• Attendance

• Homework completion

• Examination readiness

• Strengths:
${n.strengths.join(", ")}

• Improvement:
${n.improvements.join(", ")}

Recommended home support:
Daily supervised study.
`:"Recommend learning style"===t&&(c=`
LEARNING STRATEGY

Student Type:
${n.learningStyle}

Recommended Techniques

• Visual learning

• Practical projects

• Concept maps

• Quiz reinforcement

• Weekly revision cycles

Career Direction

${n.career}

Confidence

${n.careerConfidence}%
`),g.NextResponse.json({answer:c})}e.s(["POST",0,E],247770);var w=e.i(247770);let y=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/copilot/student/route",pathname:"/api/copilot/student",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/copilot/student/route.ts",nextConfigOutput:"",userland:w,...{}}),{workAsyncStorage:f,workUnitAsyncStorage:A,serverHooks:C}=y;async function T(e,t,n){n.requestMeta&&(0,a.setRequestMeta)(e,n.requestMeta),y.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let g="/api/copilot/student/route";g=g.replace(/\/index$/,"")||"/";let E=await y.prepare(e,t,{srcPage:g,multiZoneDraftMode:!1});if(!E)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:w,deploymentId:f,params:A,nextConfig:C,parsedUrl:T,isDraftMode:P,prerenderManifest:N,routerServerContext:k,isOnDemandRevalidate:b,revalidateOnlyGenerated:S,resolvedPathname:j,clientReferenceManifest:I,serverActionsManifest:$}=E,q=(0,i.normalizeAppPath)(g),O=!!(N.dynamicRoutes[q]||N.routes[j]),_=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,T,!1):t.end("This page could not be found"),null);if(O&&!P){let e=!!N.routes[j],t=N.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await _();throw new R.NoFallbackError}}let H=null;!O||y.isDev||P||(H="/index"===(H=j)?"/":H);let M=!0===y.isDev||!O,D=O&&!M;$&&I&&(0,o.setManifestsSingleton)({page:g,clientReferenceManifest:I,serverActionsManifest:$});let U=e.method||"GET",F=(0,s.getTracer)(),L=F.getActiveScopeSpan(),G=!!(null==k?void 0:k.isWrappedByNextServer),K=!!(0,a.getRequestMeta)(e,"minimalMode"),W=(0,a.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,C,N,K);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let B={params:A,previewProps:N.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:M,incrementalCache:W,cacheLifeProfiles:C.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>y.onRequestError(e,t,n,a,k)},sharedContext:{buildId:w,deploymentId:f}},V=new l.NodeNextRequest(e),z=new l.NodeNextResponse(t),X=d.NextRequestAdapter.fromNodeNextRequest(V,(0,d.signalFromNodeResponse)(t));try{let a,o=async e=>y.handle(X,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${U} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",n),a.updateName(t))}else e.updateName(`${U} ${g}`)}),i=async a=>{var s,i;let l=async({previousCacheEntry:r})=>{try{if(!K&&b&&S&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(a);e.fetchMetrics=B.renderOpts.fetchMetrics;let i=B.renderOpts.pendingWaitUntil;i&&n.waitUntil&&(n.waitUntil(i),i=void 0);let l=B.renderOpts.collectedTags;if(!O)return await (0,p.sendResponse)(V,z,s,B.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[v.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=v.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=v.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:x.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:g,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:b})},!1,k),t}},d=await y.handleResponse({req:e,nextConfig:C,cacheKey:H,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:S,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:K});if(!O)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==x.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(i=d.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",b?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),P&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return K&&O||u.delete(v.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,p.sendResponse)(V,z,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};G&&L?await i(L):(a=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${U} ${g}`,kind:s.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},i),void 0,!G))}catch(t){if(t instanceof R.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:b})},!1,k),O)throw t;return await (0,p.sendResponse)(V,z,new Response(null,{status:500})),null}}e.s(["handler",0,T,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:A})},"routeModule",0,y,"serverHooks",0,C,"workAsyncStorage",0,f,"workUnitAsyncStorage",0,A],494371)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0r60x0d._.js.map