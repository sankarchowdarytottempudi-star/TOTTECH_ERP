module.exports=[430575,e=>e.a(async(t,a)=>{try{var i=e.i(89171),r=e.i(368105),n=e.i(599683),s=e.i(597380),d=e.i(19754),o=e.i(493399),l=e.i(527426),u=e.i(15270),c=e.i(410325),_=t([r,n,d,o,l,u,c]);async function E(e,t,a){let i=String(new Date().getFullYear()).slice(-2),r=`${t}-${a}-`,n="AD"===a?"admission_number":"enrollment_number",s=await u.prisma.$queryRawUnsafe(`
      SELECT COALESCE(
        MAX(
          NULLIF(
            regexp_replace(${n}, '^.*-${a}-([0-9]+)/${i}$', '\\1'),
            ${n}
          )::int
        ),
        0
      )::int AS max_number
      FROM students
      WHERE school_id = $1::int
        AND ${n} ~ $2
      `,e,`^${r}[0-9]+/${i}$`),d=Number(s[0]?.max_number||0)+1;return`${r}${String(d).padStart(3,"0")}/${i}`}async function m({schoolId:e,academicYearId:t,classId:a,sectionId:i}){for(let[r,n]of(await u.prisma.$queryRawUnsafe(`
      SELECT s.id
      FROM students s
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
        AND sye.academic_year_id = $2::int
      WHERE s.school_id = $1::int
        AND COALESCE(s.current_class_id, sye.class_id) = $3::int
        AND (
          $4::int IS NULL
          OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $4::int
        )
        AND COALESCE(s.is_active, true) = true
      ORDER BY
        LOWER(COALESCE(NULLIF(s.first_name, ''), split_part(COALESCE(s.name, ''), ' ', 1), '')) ASC,
        LOWER(COALESCE(s.last_name, '')) ASC,
        s.id ASC
      `,e,t,a,i)).entries()){let e=String(r+1);await u.prisma.$executeRawUnsafe(`
      UPDATE students
      SET roll_number = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2::int
      `,e,Number(n.id)),await u.prisma.$executeRawUnsafe(`
      UPDATE student_year_enrollments
      SET roll_number = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE student_id = $2::int
        AND academic_year_id = $3::int
      `,e,Number(n.id),t)}}async function p({studentId:e,schoolId:t,academicYearId:a,classId:i,sectionId:r,promotionStatus:n,userId:s,metadata:d}){await u.prisma.$executeRawUnsafe(`
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
    VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,$8::jsonb)
    `,e,t,a,i,r,n,s,JSON.stringify(d||{}))}async function R(e){try{let t=await (0,c.requireSchoolModule)("STUDENTS");if(t.response)return t.response;let a=await (0,d.resolvePlatformContext)(e);if(!a)return i.NextResponse.json([]);let r=a.schoolId,n=a.academicYearId,s=await u.prisma.$queryRawUnsafe(`
        SELECT
          s.*,
          COALESCE(c.class_name, '') AS class_name,
          COALESCE(sec.section_name, '') AS section_name,
          ay.academic_year AS selected_academic_year
        FROM students s
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c
          ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec
          ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        LEFT JOIN academic_years ay
          ON ay.id = COALESCE(s.academic_year_id, sye.academic_year_id)
        WHERE ($1::int IS NULL OR s.school_id = $1::int)
          AND (
            $2::int IS NULL
            OR s.academic_year_id = $2::int
            OR sye.academic_year_id = $2::int
            OR (s.academic_year_id IS NULL AND sye.academic_year_id IS NULL)
          )
        ORDER BY s.id DESC
        `,r,n);return i.NextResponse.json(s)}catch(e){return console.error("Student fetch error:",e),(0,s.apiError)(e,"Failed to fetch students")}}async function h(e){try{let t,a=await (0,c.requireSchoolModule)("STUDENTS");if(a.response)return a.response;let d=await e.json(),_=await (0,r.getCurrentUser)();if(!_)return(0,s.validationError)("Login required before adding a student.");let R=Number(d.school_id??_.school_id)||null;if(!R)return(0,s.validationError)("Select a school before adding a student.");if(!d.first_name&&!d.name)return(0,s.validationError)("Student first name is required.");let h=await (0,n.getSelectedAcademicYear)(R),S=Number(d.academic_year_id??h?.id??_.academic_year_id)||null;if(!S)return(0,s.validationError)("Select an academic year before adding a student.");let y=Number(d.current_class_id??d.class_id)||null,N=Number(d.current_section_id??d.section_id)||null;if(!y)return(0,s.validationError)("Class is required before adding a student.");if(!N)return(0,s.validationError)("Section is required before adding a student.");if(y&&!(await u.prisma.$queryRawUnsafe(`
          SELECT id, school_id
          FROM classes
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
          `,y,R)).length)return(0,s.validationError)("Selected class does not belong to the selected school.");if(N&&!(await u.prisma.$queryRawUnsafe(`
          SELECT id, class_id, school_id
          FROM sections
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
            AND ($3::int IS NULL OR class_id = $3::int)
          `,N,R,y)).length)return(0,s.validationError)("Selected section must belong to the selected class and school.");let $=[d.first_name,d.middle_name,d.last_name].filter(Boolean).join(" "),C=await u.prisma.$queryRawUnsafe(`
        SELECT id, school_code
        FROM schools
        WHERE id = $1::int
        LIMIT 1
        `,R),T=(t=C[0]?.school_code,String(t||"KVS").trim().toUpperCase().replace(/[^A-Z0-9]/g,"")||"KVS"),f=await E(R,T,"AD"),A=await E(R,T,"EN"),w=(await u.prisma.$queryRawUnsafe(`
        INSERT INTO students (
          school_id,
          academic_year_id,
          enrollment_number,
          admission_number,
          name,
          first_name,
          middle_name,
          last_name,
          gender,
          phone,
          email,
          father_name,
          mother_name,
          roll_number,
          section_id,
          current_class_id,
          current_section_id,
          created_by,
          is_active,
          student_status,
          status_updated_at,
          status_reason,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,true,'ACTIVE',CURRENT_TIMESTAMP,'Admission created',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,R,S,A,f,$||d.name||null,d.first_name||null,d.middle_name||null,d.last_name||null,d.gender||null,d.phone||null,d.email||null,d.father_name||null,d.mother_name||null,null,N,y,N,_.id||null))[0];return w?.id&&S&&(await u.prisma.$executeRawUnsafe(`
        INSERT INTO student_year_enrollments (
          school_id,
          student_id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          source,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE','admission',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, academic_year_id)
        DO UPDATE SET
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          roll_number = EXCLUDED.roll_number,
          status = 'ACTIVE',
          source = 'admission',
          updated_at = CURRENT_TIMESTAMP
        `,R,Number(w.id),S,y,N,null),await p({studentId:Number(w.id),schoolId:R,academicYearId:S,classId:y,sectionId:N,promotionStatus:"ADMITTED",userId:_.id||null,metadata:{source:"student_admission",admissionNumber:f,enrollmentNumber:A}}),await m({schoolId:R,academicYearId:S,classId:y,sectionId:N}),w=(await u.prisma.$queryRawUnsafe(`
          SELECT *
          FROM students
          WHERE id = $1::int
          LIMIT 1
          `,Number(w.id)))[0]||w),await (0,o.recordEvent)({school_id:R,academic_year_id:S,user_id:_.id,actor_role:_.role,module_name:"students",event_type:"STUDENT_CREATED",action:"create",entity_type:"student",entity_id:"number"==typeof w?.id?w.id:Number(w?.id),summary:"Student record created",payload:{admission_number:f,enrollment_number:A,class_id:y,section_id:N}}),w?.id&&await (0,l.notifyStudentCreated)(Number(w.id),_.id||null).catch(e=>{console.error("WhatsApp student_created dispatch failed:",e instanceof Error?e.message:e)}),i.NextResponse.json(w,{status:201})}catch(e){return console.error("Student save error:",e),(0,s.apiError)(e,"Failed to save student")}}[r,n,d,o,l,u,c]=_.then?(await _)():_,e.s(["GET",0,R,"POST",0,h]),a()}catch(e){a(e)}},!1),266647,e=>e.a(async(t,a)=>{try{var i=e.i(747909),r=e.i(174017),n=e.i(996250),s=e.i(759756),d=e.i(561916),o=e.i(174677),l=e.i(869741),u=e.i(316795),c=e.i(487718),_=e.i(995169),E=e.i(47587),m=e.i(666012),p=e.i(570101),R=e.i(626937),h=e.i(10372),S=e.i(193695);e.i(52474);var y=e.i(600220),N=e.i(430575),$=t([N]);[N]=$.then?(await $)():$;let T=new i.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/students/route",pathname:"/api/students",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/students/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:f,workUnitAsyncStorage:A,serverHooks:w}=T;async function C(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/students/route";i=i.replace(/\/index$/,"")||"/";let n=await T.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:N,deploymentId:$,params:C,nextConfig:f,parsedUrl:A,isDraftMode:w,prerenderManifest:O,routerServerContext:v,isOnDemandRevalidate:g,revalidateOnlyGenerated:L,resolvedPathname:U,clientReferenceManifest:I,serverActionsManifest:b}=n,D=(0,l.normalizeAppPath)(i),M=!!(O.dynamicRoutes[D]||O.routes[U]),x=async()=>((null==v?void 0:v.render404)?await v.render404(e,t,A,!1):t.end("This page could not be found"),null);if(M&&!w){let e=!!O.routes[U],t=O.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(f.adapterPath)return await x();throw new S.NoFallbackError}}let P=null;!M||T.isDev||w||(P=U,P="/index"===P?"/":P);let q=!0===T.isDev||!M,F=M&&!q;b&&I&&(0,o.setManifestsSingleton)({page:i,clientReferenceManifest:I,serverActionsManifest:b});let H=e.method||"GET",W=(0,d.getTracer)(),j=W.getActiveScopeSpan(),k=!!(null==v?void 0:v.isWrappedByNextServer),V=!!(0,s.getRequestMeta)(e,"minimalMode"),K=(0,s.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,f,O,V);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let B={params:C,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:q,incrementalCache:K,cacheLifeProfiles:f.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,r)=>T.onRequestError(e,t,i,r,v)},sharedContext:{buildId:N,deploymentId:$}},X=new u.NodeNextRequest(e),J=new u.NodeNextResponse(t),G=c.NextRequestAdapter.fromNodeNextRequest(X,(0,c.signalFromNodeResponse)(t));try{let n,s=async e=>T.handle(G,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=W.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",r),n.updateName(t))}else e.updateName(`${H} ${i}`)}),o=async n=>{var d,o;let l=async({previousCacheEntry:r})=>{try{if(!V&&g&&L&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(n);e.fetchMetrics=B.renderOpts.fetchMetrics;let d=B.renderOpts.pendingWaitUntil;d&&a.waitUntil&&(a.waitUntil(d),d=void 0);let o=B.renderOpts.collectedTags;if(!M)return await (0,m.sendResponse)(X,J,i,B.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);o&&(t[h.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,r=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,v),t}},u=await T.handleResponse({req:e,nextConfig:f,cacheKey:P,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:g,revalidateOnlyGenerated:L,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:V});if(!M)return null;if((null==u||null==(d=u.value)?void 0:d.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});V||t.setHeader("x-nextjs-cache",g?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,p.fromNodeOutgoingHttpHeaders)(u.value.headers);return V&&M||c.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(X,J,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};k&&j?await o(j):(n=W.getActiveScopeSpan(),await W.withPropagatedContext(e.headers,()=>W.trace(_.BaseServerSpan.handleRequest,{spanName:`${H} ${i}`,kind:d.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!k))}catch(t){if(t instanceof S.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,v),M)throw t;return await (0,m.sendResponse)(X,J,new Response(null,{status:500})),null}}e.s(["handler",0,C,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:A})},"routeModule",0,T,"serverHooks",0,w,"workAsyncStorage",0,f,"workUnitAsyncStorage",0,A]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0yanded._.js.map