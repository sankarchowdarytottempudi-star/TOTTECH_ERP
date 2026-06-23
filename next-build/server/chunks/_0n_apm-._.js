module.exports=[113854,e=>e.a(async(t,a)=>{try{var r=e.i(89171),n=e.i(368105),i=e.i(597380),s=e.i(19754),o=e.i(493399),l=e.i(15270),u=t([n,s,o,l]);async function d(e){try{let t=await (0,s.resolvePlatformContext)(e);if(!t)return(0,i.validationError)("Login required before viewing question papers.");let a=t.schoolId,n=t.academicYearId,o=await l.prisma.$queryRawUnsafe(`
        SELECT
          qp.*,
          e.exam_name,
          et.exam_name AS exam_type_name,
          c.class_name,
          sec.section_name,
          sub.subject_name,
          COUNT(qpq.id)::int AS question_count
        FROM question_papers qp
        LEFT JOIN exams e ON e.id = qp.exam_id
        LEFT JOIN exam_types et ON et.id = qp.exam_type_id
        LEFT JOIN classes c ON c.id = qp.class_id
        LEFT JOIN sections sec ON sec.id = qp.section_id
        LEFT JOIN subjects sub ON sub.id = qp.subject_id
        LEFT JOIN question_paper_questions qpq ON qpq.question_paper_id = qp.id
        WHERE ($1::int IS NULL OR COALESCE(qp.school_id, c.school_id) = $1::int)
          AND ($2::int IS NULL OR qp.academic_year_id = $2::int OR qp.academic_year_id IS NULL)
        GROUP BY qp.id, e.exam_name, et.exam_name, c.class_name, sec.section_name, sub.subject_name
        ORDER BY qp.created_at DESC NULLS LAST, qp.id DESC
        LIMIT 250
        `,a,n);return r.NextResponse.json(o)}catch(e){return console.error(e),(0,i.apiError)(e,"Failed to load question papers")}}async function c(e){try{let t=await (0,n.getCurrentUser)();if(!t)return(0,i.validationError)("Login required before creating a question paper.");let a=await e.json(),{context:u,error:d}=await (0,s.resolveMutationContext)(e,a),c=u?.requiredSchoolId??null,p=Number(a.class_id)||null,_=Number(a.section_id)||null,m=Number(a.subject_id)||null,R=Array.isArray(a.questions)?a.questions:[];if(d||!c)return(0,i.validationError)(d||"Select a school before creating a question paper.");if(!a.paper_name||!p||!_||!m)return(0,i.validationError)("Paper name, class, section, and subject are required.");if(!R.length)return(0,i.validationError)("Add at least one question to the question paper.");let E=u?.requiredAcademicYearId??null;if(!E)return(0,i.validationError)("Select an academic year before creating a question paper.");let h=R.reduce((e,t)=>e+Number(t.question_marks??t.max_marks??0),0),q=await l.prisma.$transaction(async e=>{let r=(await e.$queryRawUnsafe(`
              INSERT INTO question_papers (
                school_id,
                academic_year_id,
                exam_id,
                exam_type_id,
                class_id,
                section_id,
                subject_id,
                paper_name,
                total_marks,
                exam_date,
                instructions,
                duration_minutes,
                metadata,
                created_by,
                created_at,
                updated_at
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
              RETURNING *
              `,c,E,a.exam_id?Number(a.exam_id):null,a.exam_type_id?Number(a.exam_type_id):null,p,_,m,a.paper_name,Number(a.total_marks||h),a.exam_date?new Date(a.exam_date):null,a.instructions||null,a.duration_minutes?Number(a.duration_minutes):null,JSON.stringify(a.metadata||{}),t.id||null))[0];for(let[a,n]of R.entries()){let i={formula_text:n.formula_text||null,scribble_data:n.scribble_data||null,has_scribble:!!n.scribble_data},s=Number(n.question_id)||null;if(!s){if(!n.question_text)throw Error(`Question ${a+1} text is required.`);let r=await e.$queryRawUnsafe(`
                  INSERT INTO question_bank (
                    school_id,
                    academic_year_id,
                    class_id,
                    section_id,
                    subject_id,
                    chapter_name,
                    topic_name,
                    learning_outcome,
                    difficulty_level,
                    bloom_level,
                    question_type,
                    question_text,
                    answer_text,
                    max_marks,
                    created_by,
                    created_at,
                    updated_at,
                    metadata
                  )
                  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$16::jsonb)
                  RETURNING *
                  `,c,E,p,_,m,n.chapter_name||null,n.topic_name||null,n.learning_outcome||null,n.difficulty_level||"MEDIUM",n.bloom_level||null,n.question_type||"SHORT_ANSWER",n.question_text,n.answer_text||null,Number(n.max_marks??n.question_marks??0),t.id||null,JSON.stringify(i));s=Number(r[0]?.id)}await e.$executeRawUnsafe(`
              INSERT INTO question_paper_questions (
                question_paper_id,
                question_id,
                display_order,
                section_name,
                question_marks,
                is_optional,
                metadata,
                created_at
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,CURRENT_TIMESTAMP)
              `,Number(r.id),s,a+1,n.section_name||"A",Number(n.question_marks??n.max_marks??0),!!n.is_optional,JSON.stringify(i))}return r});return await (0,o.recordEvent)({school_id:c,academic_year_id:E,user_id:t.id,actor_role:t.role,module_name:"academics",event_type:"QUESTION_PAPER_CREATED",action:"create",entity_type:"class",entity_id:p,summary:"Question paper created",payload:{question_paper_id:q.id,section_id:_,subject_id:m,question_count:R.length}}),r.NextResponse.json(q,{status:201})}catch(e){return console.error(e),(0,i.apiError)(e,"Failed to create question paper")}}[n,s,o,l]=u.then?(await u)():u,e.s(["GET",0,d,"POST",0,c]),a()}catch(e){a(e)}},!1),188504,e=>e.a(async(t,a)=>{try{var r=e.i(747909),n=e.i(174017),i=e.i(996250),s=e.i(759756),o=e.i(561916),l=e.i(174677),u=e.i(869741),d=e.i(316795),c=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),R=e.i(570101),E=e.i(626937),h=e.i(10372),q=e.i(193695);e.i(52474);var N=e.i(600220),f=e.i(113854),b=t([f]);[f]=b.then?(await b)():b;let x=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/question-papers/route",pathname:"/api/question-papers",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/question-papers/route.ts",nextConfigOutput:"",userland:f,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:T,serverHooks:w}=x;async function y(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),x.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/question-papers/route";r=r.replace(/\/index$/,"")||"/";let i=await x.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:f,deploymentId:b,params:y,nextConfig:v,parsedUrl:T,isDraftMode:w,prerenderManifest:$,routerServerContext:g,isOnDemandRevalidate:S,revalidateOnlyGenerated:A,resolvedPathname:C,clientReferenceManifest:O,serverActionsManifest:I}=i,U=(0,u.normalizeAppPath)(r),P=!!($.dynamicRoutes[U]||$.routes[C]),M=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,T,!1):t.end("This page could not be found"),null);if(P&&!w){let e=!!$.routes[C],t=$.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(v.adapterPath)return await M();throw new q.NoFallbackError}}let L=null;!P||x.isDev||w||(L=C,L="/index"===L?"/":L);let k=!0===x.isDev||!P,j=P&&!k;I&&O&&(0,l.setManifestsSingleton)({page:r,clientReferenceManifest:O,serverActionsManifest:I});let D=e.method||"GET",H=(0,o.getTracer)(),F=H.getActiveScopeSpan(),J=!!(null==g?void 0:g.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),K=(0,s.getRequestMeta)(e,"incrementalCache")||await x.getIncrementalCache(e,v,$,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let G={params:y,previewProps:$.preview,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:k,incrementalCache:K,cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>x.onRequestError(e,t,r,n,g)},sharedContext:{buildId:f,deploymentId:b}},V=new d.NodeNextRequest(e),W=new d.NodeNextResponse(t),Y=c.NextRequestAdapter.fromNodeNextRequest(V,(0,c.signalFromNodeResponse)(t));try{let i,s=async e=>x.handle(Y,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${D} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",n),i.updateName(t))}else e.updateName(`${D} ${r}`)}),l=async i=>{var o,l;let u=async({previousCacheEntry:n})=>{try{if(!B&&S&&A&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(i);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=G.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(V,W,r,G.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(r.headers);l&&(t[h.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,n=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await x.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:S})},!1,g),t}},d=await x.handleResponse({req:e,nextConfig:v,cacheKey:L,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:$,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:A,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:B});if(!P)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",S?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,R.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&P||c.delete(h.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,E.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(V,W,new Response(d.value.body,{headers:c,status:d.value.status||200})),null};J&&F?await l(F):(i=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${D} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},l),void 0,!J))}catch(t){if(t instanceof q.NoFallbackError||await x.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:S})},!1,g),P)throw t;return await (0,m.sendResponse)(V,W,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:T})},"routeModule",0,x,"serverHooks",0,w,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,T]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0n_apm-._.js.map