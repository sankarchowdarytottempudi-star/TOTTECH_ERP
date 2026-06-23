module.exports=[169247,e=>e.a(async(t,a)=>{try{var r=e.i(89171),n=e.i(599683),i=e.i(597380),o=e.i(19754),s=e.i(368105),d=e.i(493399),l=e.i(15270),u=e.i(922799),c=e.i(410325),_=t([n,o,s,d,l,c]);[n,o,s,d,l,c]=_.then?(await _)():_;let S=e=>e?.role==="SUPER_ADMIN"?Number(e.school_id)||null:Number(e?.school_id)||null;async function h(e){try{let t=await (0,c.requireSchoolModule)("HOSTEL");if(t.response)return t.response;let a=await (0,o.resolvePlatformContext)(e);if(!a)return(0,i.validationError)("Login required to view hostel operations.");let n=a.schoolId,s=a.academicYearId,[d,u,_,h]=await Promise.all([l.prisma.hostels.findMany({where:{...n?{school_id:n}:{},...s?{OR:[{academic_year_id:s},{academic_year_id:null}]}:{}},orderBy:{id:"desc"}}),l.prisma.$queryRawUnsafe(`
        SELECT
          ha.*,
          h.hostel_name,
          h.hostel_type,
          s.admission_number,
          s.enrollment_number,
          s.first_name,
          s.middle_name,
          s.last_name,
          COALESCE(c.class_name, '') AS class_name,
          COALESCE(sec.section_name, '') AS section_name
        FROM hostel_allocations ha
        LEFT JOIN hostels h ON h.id = ha.hostel_id
        LEFT JOIN students s ON s.id = ha.student_id
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        WHERE ($1::int IS NULL OR ha.school_id = $1::int)
          AND ($2::int IS NULL OR ha.academic_year_id = $2::int OR ha.academic_year_id IS NULL)
        ORDER BY ha.allocation_date DESC NULLS LAST, ha.id DESC
        LIMIT 200
        `,n,s),l.prisma.$queryRawUnsafe(`
        SELECT
          ha.*,
          h.hostel_name,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM hostel_attendance ha
        LEFT JOIN hostels h ON h.id = ha.hostel_id
        LEFT JOIN students s ON s.id = ha.student_id
        WHERE ($1::int IS NULL OR ha.school_id = $1::int)
          AND ($2::int IS NULL OR ha.academic_year_id = $2::int OR ha.academic_year_id IS NULL)
        ORDER BY ha.attendance_date DESC, ha.id DESC
        LIMIT 200
        `,n,s),l.prisma.$queryRawUnsafe(`
        SELECT
          hm.*,
          h.hostel_name,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM hostel_movement_history hm
        LEFT JOIN hostels h ON h.id = hm.hostel_id
        LEFT JOIN students s ON s.id = hm.student_id
        WHERE ($1::int IS NULL OR hm.school_id = $1::int)
          AND ($2::int IS NULL OR hm.academic_year_id = $2::int OR hm.academic_year_id IS NULL)
        ORDER BY hm.movement_at DESC, hm.id DESC
        LIMIT 200
        `,n,s)]);return r.NextResponse.json({hostels:d,allocations:u,attendance:_,movementHistory:h,academicYear:{id:s,scope:a.academicYearScope}})}catch(e){return console.error("Hostel GET error:",e),(0,i.apiError)(e,"Failed to load hostel operations.")}}async function m(e){try{let t=await (0,s.getCurrentUser)();if(!t)return(0,i.validationError)("Login required before updating hostel operations.");if(!(0,u.canManageRecord)(t.role,"hostel","create"))return r.NextResponse.json({error:(0,u.managementError)("hostel","create")},{status:403});let a=await e.json(),o=String(a.kind||"hostel"),c=S(t)||Number(a.school_id)||null,_=await (0,n.getSelectedAcademicYear)(c),h=Number(_?.id??t.academic_year_id)||null;if(!c)return(0,i.validationError)("Select a school before updating hostel operations.");if(!h)return(0,i.validationError)("Select an academic year before updating hostel operations.");if("assignment"===o)return R({body:a,user:t,schoolId:c,academicYearId:h});if("attendance"===o)return y({body:a,user:t,schoolId:c,academicYearId:h});if("movement"===o)return N({body:a,user:t,schoolId:c,academicYearId:h});if(!a.hostel_name)return(0,i.validationError)("Hostel name is required.");let m=await l.prisma.hostels.create({data:{school_id:c,academic_year_id:h,hostel_name:String(a.hostel_name).trim(),hostel_type:a.hostel_type?String(a.hostel_type).trim():null,warden_name:a.warden_name?String(a.warden_name).trim():null,warden_phone:a.warden_phone?String(a.warden_phone).trim():null,created_by:t.id||null}});return await (0,d.recordEvent)({school_id:c,academic_year_id:h,user_id:t.id,actor_role:t.role,module_name:"hostel",event_type:"HOSTEL_CREATED",action:"create",entity_type:"hostel",entity_id:m.id,summary:"Hostel created",payload:{hostel_name:m.hostel_name,hostel_type:m.hostel_type}}),r.NextResponse.json({hostel:m},{status:201})}catch(e){return console.error("Hostel POST error:",e),(0,i.apiError)(e,"Failed to save hostel operations.")}}async function E(e){try{let t=await (0,s.getCurrentUser)();if(!t)return(0,i.validationError)("Login required before updating hostels.");if(!(0,u.canManageRecord)(t.role,"hostel","update"))return r.NextResponse.json({error:(0,u.managementError)("hostel","update")},{status:403});let a=await e.json(),n=Number(a.id),o=S(t);if(!n)return(0,i.validationError)("A valid hostel id is required.");let c=await l.prisma.$queryRawUnsafe(`
        UPDATE hostels
        SET hostel_name = COALESCE($2, hostel_name),
            hostel_type = $3,
            warden_name = $4,
            warden_phone = $5
        WHERE id = $1
          AND ($6::int IS NULL OR school_id = $6::int)
        RETURNING *
        `,n,a.hostel_name?String(a.hostel_name).trim():null,a.hostel_type||null,a.warden_name||null,a.warden_phone||null,o);if(!c[0])return r.NextResponse.json({error:"Hostel not found."},{status:404});return await (0,d.recordEvent)({school_id:o,user_id:t.id,actor_role:t.role,module_name:"hostel",event_type:"HOSTEL_UPDATED",action:"update",entity_type:"hostel",entity_id:n,summary:"Hostel updated",payload:c[0]}),r.NextResponse.json({hostel:c[0]})}catch(e){return(0,i.apiError)(e,"Failed to update hostel")}}async function p(e){try{let t=await (0,s.getCurrentUser)();if(!t)return(0,i.validationError)("Login required before deleting hostels.");if(!(0,u.canManageRecord)(t.role,"hostel","delete"))return r.NextResponse.json({error:(0,u.managementError)("hostel","delete")},{status:403});let a=new URL(e.url),n=Number(a.searchParams.get("id")),o=S(t);if(!n)return(0,i.validationError)("A valid hostel id is required.");return await l.prisma.$transaction(async e=>{await e.$executeRawUnsafe("DELETE FROM hostel_attendance WHERE hostel_id = $1",n),await e.$executeRawUnsafe("DELETE FROM hostel_movement_history WHERE hostel_id = $1",n),await e.$executeRawUnsafe("DELETE FROM hostel_allocations WHERE hostel_id = $1",n),await e.$executeRawUnsafe("DELETE FROM hostels WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",n,o)}),await (0,d.recordEvent)({school_id:o,user_id:t.id,actor_role:t.role,module_name:"hostel",event_type:"HOSTEL_DELETED",action:"delete",entity_type:"hostel",entity_id:n,summary:"Hostel deleted"}),r.NextResponse.json({success:!0})}catch(e){return(0,i.apiError)(e,"Failed to delete hostel")}}async function R({body:e,user:t,schoolId:a,academicYearId:n}){let o=Number(e.hostel_id)||null,s=Number(e.student_id)||null;if(!o)return(0,i.validationError)("Select a hostel before assigning a student.");if(!s)return(0,i.validationError)("Select a student before assigning hostel.");let[u]=await l.prisma.hostels.findMany({where:{id:o,school_id:a},take:1});if(!u)return(0,i.validationError)("Selected hostel does not belong to the selected school.");let c=(await l.prisma.$queryRawUnsafe(`
      SELECT
        s.id,
        s.school_id,
        COALESCE(s.current_class_id, sye.class_id) AS class_id,
        COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id
      FROM students s
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
        AND ($3::int IS NULL OR sye.academic_year_id = $3::int)
      WHERE s.id = $1
        AND s.school_id = $2
      ORDER BY sye.id DESC NULLS LAST
      LIMIT 1
      `,s,a,n))[0];if(!c)return(0,i.validationError)("Selected student was not found in the selected school.");let _=Number(e.class_id)||null,h=Number(e.section_id)||null;if(_&&Number(c.class_id)!==_)return(0,i.validationError)("Selected student does not belong to the selected class.");if(h&&Number(c.section_id)!==h)return(0,i.validationError)("Selected student does not belong to the selected section.");let m=e.allocation_date?new Date(e.allocation_date):new Date,E=e.bed_number?String(e.bed_number).trim():null,p=(await l.prisma.$queryRawUnsafe(`
      INSERT INTO hostel_allocations (
        school_id,
        academic_year_id,
        student_id,
        hostel_id,
        room_id,
        bed_number,
        allocation_date,
        created_by,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)
      RETURNING *
      `,a,n,s,o,e.room_id?Number(e.room_id):null,E,m,t.id||null))[0];return await l.prisma.hostel_students.create({data:{student_id:s,room_number:e.room_number?String(e.room_number).trim():null,bed_number:E,joining_date:m,status:"ACTIVE"}}),await l.prisma.students.update({where:{id:s},data:{hostel_required:!0}}),await (0,d.recordEvent)({school_id:a,academic_year_id:n,user_id:t.id,actor_role:t.role,module_name:"hostel",event_type:"HOSTEL_ASSIGNED_TO_STUDENT",action:"assign",entity_type:"student",entity_id:s,summary:"Hostel assigned to student",payload:{hostel_id:o,allocation_id:p?.id,class_id:_,section_id:h}}),r.NextResponse.json({allocation:p},{status:201})}async function y({body:e,user:t,schoolId:a,academicYearId:n}){let o=Number(e.student_id)||null,s=Number(e.hostel_id)||null;if(!o||!s)return(0,i.validationError)("Student and hostel are required before recording hostel attendance.");let u=await l.prisma.$queryRawUnsafe(`
      INSERT INTO hostel_attendance (
        school_id,
        academic_year_id,
        student_id,
        hostel_id,
        room_id,
        attendance_date,
        status,
        recorded_by,
        remarks,
        metadata,
        created_by,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,CURRENT_TIMESTAMP)
      ON CONFLICT ON CONSTRAINT uq_hostel_student_date
      DO UPDATE SET
        hostel_id = EXCLUDED.hostel_id,
        room_id = EXCLUDED.room_id,
        status = EXCLUDED.status,
        recorded_by = EXCLUDED.recorded_by,
        remarks = EXCLUDED.remarks,
        metadata = EXCLUDED.metadata
      RETURNING *
      `,a,n,o,s,e.room_id?Number(e.room_id):null,e.attendance_date?new Date(e.attendance_date):new Date,e.status||"PRESENT",t.id||null,e.remarks||null,JSON.stringify(e.metadata||{}),t.id||null),c=await (0,d.recordEvent)({school_id:a,academic_year_id:n,user_id:t.id,actor_role:t.role,module_name:"hostel",event_type:"HOSTEL_ATTENDANCE_RECORDED",action:"record",entity_type:"student",entity_id:o,summary:"Hostel attendance recorded",payload:u[0]});return await l.prisma.$executeRawUnsafe(`
    UPDATE hostel_attendance
    SET event_id = $1
    WHERE id = $2
    `,c.id,u[0]?.id),r.NextResponse.json({attendance:{...u[0],event_id:c.id}})}async function N({body:e,user:t,schoolId:a,academicYearId:n}){let o=Number(e.student_id)||null,s=Number(e.hostel_id)||null;if(!o||!s)return(0,i.validationError)("Student and hostel are required before recording hostel movement.");let u=await l.prisma.$queryRawUnsafe(`
      INSERT INTO hostel_movement_history (
        school_id,
        academic_year_id,
        student_id,
        hostel_id,
        room_id,
        bed_id,
        movement_type,
        movement_at,
        recorded_by,
        notes,
        metadata,
        created_by,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,CURRENT_TIMESTAMP)
      RETURNING *
      `,a,n,o,s,e.room_id?Number(e.room_id):null,e.bed_id?Number(e.bed_id):null,e.movement_type||"CHECK_IN",e.movement_at?new Date(e.movement_at):new Date,t.id||null,e.notes||null,JSON.stringify(e.metadata||{}),t.id||null);return await (0,d.recordEvent)({school_id:a,academic_year_id:n,user_id:t.id,actor_role:t.role,module_name:"hostel",event_type:"HOSTEL_MOVEMENT_RECORDED",action:"record",entity_type:"student",entity_id:o,summary:"Hostel movement recorded",payload:u[0]}),r.NextResponse.json({movement:u[0]})}e.s(["DELETE",0,p,"GET",0,h,"PATCH",0,E,"POST",0,m]),a()}catch(e){a(e)}},!1),816602,e=>e.a(async(t,a)=>{try{var r=e.i(747909),n=e.i(174017),i=e.i(996250),o=e.i(759756),s=e.i(561916),d=e.i(174677),l=e.i(869741),u=e.i(316795),c=e.i(487718),_=e.i(995169),h=e.i(47587),m=e.i(666012),E=e.i(570101),p=e.i(626937),R=e.i(10372),y=e.i(193695);e.i(52474);var N=e.i(600220),S=e.i(169247),w=t([S]);[S]=w.then?(await w)():w;let O=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/hostels/route",pathname:"/api/hostels",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/hostels/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:T,workUnitAsyncStorage:v,serverHooks:C}=O;async function f(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),O.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/hostels/route";r=r.replace(/\/index$/,"")||"/";let i=await O.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:S,deploymentId:w,params:f,nextConfig:T,parsedUrl:v,isDraftMode:C,prerenderManifest:L,routerServerContext:$,isOnDemandRevalidate:b,revalidateOnlyGenerated:g,resolvedPathname:A,clientReferenceManifest:D,serverActionsManifest:I}=i,U=(0,l.normalizeAppPath)(r),x=!!(L.dynamicRoutes[U]||L.routes[A]),H=async()=>((null==$?void 0:$.render404)?await $.render404(e,t,v,!1):t.end("This page could not be found"),null);if(x&&!C){let e=!!L.routes[A],t=L.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(T.adapterPath)return await H();throw new y.NoFallbackError}}let M=null;!x||O.isDev||C||(M=A,M="/index"===M?"/":M);let P=!0===O.isDev||!x,q=x&&!P;I&&D&&(0,d.setManifestsSingleton)({page:r,clientReferenceManifest:D,serverActionsManifest:I});let F=e.method||"GET",j=(0,s.getTracer)(),k=j.getActiveScopeSpan(),W=!!(null==$?void 0:$.isWrappedByNextServer),J=!!(0,o.getRequestMeta)(e,"minimalMode"),B=(0,o.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,T,L,J);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let G={params:f,previewProps:L.preview,renderOpts:{experimental:{authInterrupts:!!T.experimental.authInterrupts},cacheComponents:!!T.cacheComponents,supportsDynamicResponse:P,incrementalCache:B,cacheLifeProfiles:T.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>O.onRequestError(e,t,r,n,$)},sharedContext:{buildId:S,deploymentId:w}},K=new u.NodeNextRequest(e),X=new u.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let i,o=async e=>O.handle(V,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${F} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",n),i.updateName(t))}else e.updateName(`${F} ${r}`)}),d=async i=>{var s,d;let l=async({previousCacheEntry:n})=>{try{if(!J&&b&&g&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await o(i);e.fetchMetrics=G.renderOpts.fetchMetrics;let s=G.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let d=G.renderOpts.collectedTags;if(!x)return await (0,m.sendResponse)(K,X,r,G.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(r.headers);d&&(t[R.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,n=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:b})},!1,$),t}},u=await O.handleResponse({req:e,nextConfig:T,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:L,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:g,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:J});if(!x)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});J||t.setHeader("x-nextjs-cache",b?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,E.fromNodeOutgoingHttpHeaders)(u.value.headers);return J&&x||c.delete(R.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,p.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(K,X,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};W&&k?await d(k):(i=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(_.BaseServerSpan.handleRequest,{spanName:`${F} ${r}`,kind:s.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},d),void 0,!W))}catch(t){if(t instanceof y.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:b})},!1,$),x)throw t;return await (0,m.sendResponse)(K,X,new Response(null,{status:500})),null}}e.s(["handler",0,f,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:v})},"routeModule",0,O,"serverHooks",0,C,"workAsyncStorage",0,T,"workUnitAsyncStorage",0,v]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0ouf_3r._.js.map