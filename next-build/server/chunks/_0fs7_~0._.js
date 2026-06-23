module.exports=[66343,e=>e.a(async(t,a)=>{try{var r=e.i(89171),s=e.i(368105),i=e.i(597380),n=e.i(19754),o=e.i(493399),d=e.i(15270),l=t([s,n,o,d]);[s,n,o,d]=l.then?(await l)():l;let _=(e,t)=>{let a=t>0?e/t*100:0;return a>=90?"A+":a>=80?"A":a>=70?"B":a>=60?"C":a>=50?"D":a>=35?"E":"F"};async function u(e){try{let t=await (0,n.resolvePlatformContext)(e);if(!t)return r.NextResponse.json([]);let a=t.schoolId,s=t.academicYearId,{searchParams:i}=new URL(e.url),o=Number(i.get("student_id")||0),l=Number(i.get("exam_schedule_id")||0),u=Number(i.get("question_paper_id")||0),c=await d.prisma.$queryRawUnsafe(`
        SELECT
          sme.*,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
          qb.question_text,
          es.exam_date,
          e.exam_name,
          sub.subject_name
        FROM student_marks_entry sme
        LEFT JOIN students s ON s.id = sme.student_id
        LEFT JOIN question_bank qb ON qb.id = sme.question_id
        LEFT JOIN exam_schedule es ON es.id = sme.exam_schedule_id
        LEFT JOIN exams e ON e.id = es.exam_id
        LEFT JOIN subjects sub ON sub.id = es.subject_id
        WHERE ($1::int IS NULL OR COALESCE(sme.school_id, s.school_id) = $1::int)
          AND ($2::int IS NULL OR sme.academic_year_id = $2::int OR sme.academic_year_id IS NULL)
          AND ($3::int IS NULL OR sme.student_id = $3::int)
          AND ($4::int IS NULL OR sme.exam_schedule_id = $4::int)
          AND ($5::int IS NULL OR sme.question_paper_id = $5::int)
        ORDER BY sme.created_at DESC
        LIMIT 300
        `,a,s,o||null,l||null,u||null);return r.NextResponse.json(c)}catch(e){return console.error(e),(0,i.apiError)(e,"Failed to load marks")}}async function c(e){try{let t=await (0,s.getCurrentUser)();if(!t)return(0,i.validationError)("Login required before saving marks.");let a=await e.json(),n=Number(a.student_id),l=Number(a.exam_schedule_id),u=Number(a.question_paper_id),c=Array.isArray(a.entries)?a.entries:[{question_id:a.question_id,obtained_marks:a.obtained_marks,max_marks:a.max_marks,remarks:a.remarks}];if(!n||!l||!u||!c.length)return(0,i.validationError)("Student, exam schedule, question paper, and marks are required.");let m=(await d.prisma.$queryRawUnsafe(`
        SELECT
          es.*,
          c.school_id AS class_school_id
        FROM exam_schedule es
        LEFT JOIN classes c ON c.id = es.class_id
        WHERE es.id = $1
        LIMIT 1
        `,l))[0];if(!m)return(0,i.validationError)("Exam schedule was not found.");let p=Number(m.school_id)||Number(m.class_school_id)||Number(t.school_id)||null,E=Number(m.academic_year_id)||null,R=Number(m.class_id)||null,h=Number(m.section_id)||null,N=Number(m.subject_id)||null,C=Number(m.exam_id)||null,b=0,x=0;return await d.prisma.$transaction(async e=>{for(let a of c){let r=Number(a.obtained_marks||0),s=Number(a.max_marks||0),i=Number(a.question_id);b+=r,x+=s,await e.$executeRawUnsafe(`
            INSERT INTO student_marks_entry (
              school_id,
              academic_year_id,
              class_id,
              section_id,
              student_id,
              exam_schedule_id,
              question_paper_id,
              question_id,
              obtained_marks,
              max_marks,
              grade,
              remarks,
              created_by,
              created_at,
              updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
            ON CONFLICT ON CONSTRAINT uq_student_question
            DO UPDATE SET
              school_id = EXCLUDED.school_id,
              academic_year_id = EXCLUDED.academic_year_id,
              class_id = EXCLUDED.class_id,
              section_id = EXCLUDED.section_id,
              obtained_marks = EXCLUDED.obtained_marks,
              max_marks = EXCLUDED.max_marks,
              grade = EXCLUDED.grade,
              remarks = EXCLUDED.remarks,
              created_by = EXCLUDED.created_by,
              updated_at = CURRENT_TIMESTAMP
            `,p,E,R,h,n,l,u,i,r,s,_(r,s),a.remarks||null,t.id||null)}if(C&&N){let t=await e.$queryRawUnsafe(`
              SELECT id
              FROM marks
              WHERE student_id = $1
                AND exam_id = $2
                AND subject_id = $3
                AND ($4::int IS NULL OR school_id = $4::int)
              ORDER BY id DESC
              LIMIT 1
              `,n,C,N,p),r=Number(t[0]?.id)||null,s=_(b,x);r?await e.$executeRawUnsafe(`
              UPDATE marks
              SET academic_year_id = $1,
                  total_marks = $2,
                  obtained_marks = $3,
                  grade = $4,
                  remarks = $5
              WHERE id = $6
              `,E,x,b,s,a.remarks||null,r):await e.$executeRawUnsafe(`
              INSERT INTO marks (
                school_id,
                academic_year_id,
                student_id,
                subject_id,
                exam_id,
                total_marks,
                obtained_marks,
                grade,
                remarks,
                created_at
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP)
              `,p,E,n,N,C,x,b,s,a.remarks||null)}}),await (0,o.recordEvent)({school_id:p,academic_year_id:E,user_id:t.id,actor_role:t.role,module_name:"marks",event_type:"MARKS_ENTERED",action:"evaluate",entity_type:"student",entity_id:n,summary:"Exam marks entered",payload:{exam_schedule_id:l,question_paper_id:u,total_marks:b,max_marks:x,grade:_(b,x)}}),r.NextResponse.json({success:!0,total_marks:b,max_marks:x,grade:_(b,x)})}catch(e){return console.error(e),(0,i.apiError)(e,"Failed to save marks")}}e.s(["GET",0,u,"POST",0,c]),a()}catch(e){a(e)}},!1),306424,e=>e.a(async(t,a)=>{try{var r=e.i(747909),s=e.i(174017),i=e.i(996250),n=e.i(759756),o=e.i(561916),d=e.i(174677),l=e.i(869741),u=e.i(316795),c=e.i(487718),_=e.i(995169),m=e.i(47587),p=e.i(666012),E=e.i(570101),R=e.i(626937),h=e.i(10372),N=e.i(193695);e.i(52474);var C=e.i(600220),b=e.i(66343),x=t([b]);[b]=x.then?(await x)():x;let T=new r.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/marks-entry/route",pathname:"/api/marks-entry",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/marks-entry/route.ts",nextConfigOutput:"",userland:b,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:w,serverHooks:$}=T;async function y(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/marks-entry/route";r=r.replace(/\/index$/,"")||"/";let i=await T.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,deploymentId:x,params:y,nextConfig:v,parsedUrl:w,isDraftMode:$,prerenderManifest:f,routerServerContext:k,isOnDemandRevalidate:A,revalidateOnlyGenerated:O,resolvedPathname:g,clientReferenceManifest:S,serverActionsManifest:L}=i,I=(0,l.normalizeAppPath)(r),U=!!(f.dynamicRoutes[I]||f.routes[g]),D=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,w,!1):t.end("This page could not be found"),null);if(U&&!$){let e=!!f.routes[g],t=f.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if(v.adapterPath)return await D();throw new N.NoFallbackError}}let q=null;!U||T.isDev||$||(q=g,q="/index"===q?"/":q);let P=!0===T.isDev||!U,M=U&&!P;L&&S&&(0,d.setManifestsSingleton)({page:r,clientReferenceManifest:S,serverActionsManifest:L});let F=e.method||"GET",H=(0,o.getTracer)(),j=H.getActiveScopeSpan(),X=!!(null==k?void 0:k.isWrappedByNextServer),B=!!(0,n.getRequestMeta)(e,"minimalMode"),K=(0,n.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,v,f,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let W={params:y,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:P,incrementalCache:K,cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,s)=>T.onRequestError(e,t,r,s,k)},sharedContext:{buildId:b,deploymentId:x}},J=new u.NodeNextRequest(e),V=new u.NodeNextResponse(t),G=c.NextRequestAdapter.fromNodeNextRequest(J,(0,c.signalFromNodeResponse)(t));try{let i,n=async e=>T.handle(G,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let t=`${F} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",s),i.updateName(t))}else e.updateName(`${F} ${r}`)}),d=async i=>{var o,d;let l=async({previousCacheEntry:s})=>{try{if(!B&&A&&O&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await n(i);e.fetchMetrics=W.renderOpts.fetchMetrics;let o=W.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let d=W.renderOpts.collectedTags;if(!U)return await (0,p.sendResponse)(J,V,r,W.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(r.headers);d&&(t[h.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,s=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:A})},!1,k),t}},u=await T.handleResponse({req:e,nextConfig:v,cacheKey:q,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:O,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!U)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",A?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),$&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,E.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&U||c.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(J,V,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};X&&j?await d(j):(i=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(_.BaseServerSpan.handleRequest,{spanName:`${F} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},d),void 0,!X))}catch(t){if(t instanceof N.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:A})},!1,k),U)throw t;return await (0,p.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:w})},"routeModule",0,T,"serverHooks",0,$,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,w]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0fs7_~0._.js.map