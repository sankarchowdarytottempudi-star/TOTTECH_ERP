module.exports=[610141,e=>e.a(async(t,r)=>{try{var a=e.i(89171),n=e.i(368105),i=e.i(599683),o=e.i(597380),s=e.i(19754),d=e.i(493399),u=e.i(15270),l=e.i(922799),c=e.i(410325),_=t([n,i,s,d,u,c]);[n,i,s,d,u,c]=_.then?(await _)():_;let h=e=>e?.role==="SUPER_ADMIN"?Number(e.school_id)||null:Number(e?.school_id)||null;async function p(e){try{let t=await (0,c.requireSchoolModule)("TRANSPORT");if(t.response)return t.response;let r=await (0,s.resolvePlatformContext)(e);if(!r)return(0,o.validationError)("Login required to view transport.");let n=r.schoolId,i=r.academicYearId,[d,l,_,p,E]=await Promise.all([u.prisma.$queryRawUnsafe(`
        SELECT *
        FROM transport_vehicles
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY id DESC
        `,n,i),u.prisma.$queryRawUnsafe(`
        SELECT *
        FROM transport_routes
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY id DESC
        `,n,i),u.prisma.$queryRawUnsafe(`
        SELECT
          ta.*,
          tr.route_name,
          tr.vehicle_number,
          s.first_name,
          s.last_name,
          t.first_name AS teacher_first_name,
          t.last_name AS teacher_last_name,
          c.class_name,
          sec.section_name,
          ay.academic_year
        FROM transport_assignments ta
        LEFT JOIN transport_routes tr ON tr.id = ta.route_id
        LEFT JOIN students s ON s.id = ta.student_id
        LEFT JOIN teachers t ON t.id = ta.teacher_id
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($2::int IS NULL OR sye.academic_year_id = $2::int)
        LEFT JOIN classes c ON c.id = COALESCE(s.current_class_id, sye.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id, sye.section_id)
        LEFT JOIN academic_years ay ON ay.id = ta.academic_year_id
        WHERE ($1::int IS NULL OR COALESCE(ta.school_id, s.school_id, t.school_id) = $1::int)
          AND ($2::int IS NULL OR ta.academic_year_id = $2::int OR ta.academic_year_id IS NULL)
        ORDER BY ta.id DESC
        LIMIT 200
        `,n,i),u.prisma.$queryRawUnsafe(`
        SELECT
          ta.*,
          tr.route_name,
          tr.vehicle_number,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM transport_attendance ta
        LEFT JOIN transport_routes tr ON tr.id = ta.route_id
        LEFT JOIN students s ON s.id = ta.student_id
        WHERE ($1::int IS NULL OR ta.school_id = $1::int)
          AND ($2::int IS NULL OR ta.academic_year_id = $2::int OR ta.academic_year_id IS NULL)
        ORDER BY ta.attendance_date DESC, ta.id DESC
        LIMIT 200
        `,n,i),u.prisma.$queryRawUnsafe(`
        SELECT
          h.*,
          tr.route_name,
          tr.vehicle_number,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name
        FROM transport_pickup_drop_history h
        LEFT JOIN transport_routes tr ON tr.id = h.route_id
        LEFT JOIN students s ON s.id = h.student_id
        WHERE ($1::int IS NULL OR h.school_id = $1::int)
          AND ($2::int IS NULL OR h.academic_year_id = $2::int OR h.academic_year_id IS NULL)
        ORDER BY h.event_time DESC, h.id DESC
        LIMIT 200
        `,n,i)]);return a.NextResponse.json({vehicles:d,routes:l,assignments:_,attendance:p,pickupDropHistory:E,academicYear:{id:i,scope:r.academicYearScope}})}catch(e){return console.error(e),(0,o.apiError)(e,"Failed to load transport")}}async function E(e){try{let t=await (0,n.getCurrentUser)();if(!t)return(0,o.validationError)("Login required to update transport.");if(!(0,l.canManageRecord)(t.role,"transport","create"))return a.NextResponse.json({error:(0,l.managementError)("transport","create")},{status:403});let r=await e.json(),s=String(r.kind||"vehicle"),c="SUPER_ADMIN"===t.role&&Number(r.school_id)||h(t);if(!c)return(0,o.validationError)("Select a school before updating transport.");let _=await (0,i.getSelectedAcademicYear)(c),p=Number(r.academic_year_id??_?.id??t.academic_year_id)||null;if(!p)return(0,o.validationError)("Select an academic year before updating transport.");if("route"===s){if(!r.route_name)return(0,o.validationError)("Route name is required.");let e=await u.prisma.$queryRawUnsafe(`
          INSERT INTO transport_routes (
            school_id,
            academic_year_id,
            route_name,
            vehicle_number,
            driver_name,
            driver_phone,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)
          RETURNING *
          `,c,p,r.route_name,r.vehicle_number||null,r.driver_name||null,r.driver_phone||null,t.id||null);return await (0,d.recordEvent)({school_id:c,academic_year_id:p,user_id:t.id,actor_role:t.role,module_name:"transport",event_type:"TRANSPORT_ROUTE_CREATED",action:"create",entity_type:"school",entity_id:c,summary:"Transport route created"}),a.NextResponse.json({route:e[0]})}if("assignment"===s){let e=String(r.assigned_to_type||(r.teacher_id?"TEACHER":"STUDENT")).toUpperCase(),n="STUDENT"===e&&Number(r.student_id)||null,i="TEACHER"===e&&Number(r.teacher_id)||null;if("STUDENT"===e&&!n)return(0,o.validationError)("Select a student before assigning transport.");if("TEACHER"===e&&!i)return(0,o.validationError)("Select a teacher before assigning transport.");if(!r.route_id)return(0,o.validationError)("Select a route before assigning transport.");let s=await u.prisma.$queryRawUnsafe(`
          INSERT INTO transport_assignments (
            school_id,
            student_id,
            teacher_id,
            route_id,
            pickup_point,
            drop_point,
            academic_year_id,
            assigned_to_type,
            status,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ACTIVE',$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,c,n,i,Number(r.route_id),r.pickup_point||null,r.drop_point||null,p,e,t.id||null);return await (0,d.recordEvent)({school_id:c,academic_year_id:p,user_id:t.id,actor_role:t.role,module_name:"transport",event_type:"TRANSPORT_ASSIGNED",action:"assign",entity_type:"TEACHER"===e?"teacher":"student",entity_id:"TEACHER"===e?i:n,summary:`Transport assigned to ${e.toLowerCase()}`,payload:{route_id:r.route_id,assigned_to_type:e}}),a.NextResponse.json({assignment:s[0]})}if("attendance"===s){let e=Number(r.student_id)||null,n=Number(r.route_id)||null,i=String(r.trip_type||"PICKUP").toUpperCase();if(!e||!n)return(0,o.validationError)("Student and route are required before recording transport attendance.");let s=await u.prisma.$queryRawUnsafe(`
          INSERT INTO transport_attendance (
            school_id,
            academic_year_id,
            student_id,
            route_id,
            vehicle_id,
            trip_type,
            attendance_date,
            status,
            pickup_point,
            drop_point,
            recorded_by,
            remarks,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,CURRENT_TIMESTAMP)
          ON CONFLICT ON CONSTRAINT uq_transport_student_trip_date
          DO UPDATE SET
            route_id = EXCLUDED.route_id,
            vehicle_id = EXCLUDED.vehicle_id,
            status = EXCLUDED.status,
            pickup_point = EXCLUDED.pickup_point,
            drop_point = EXCLUDED.drop_point,
            recorded_by = EXCLUDED.recorded_by,
            remarks = EXCLUDED.remarks,
            metadata = EXCLUDED.metadata
          RETURNING *
          `,c,p,e,n,r.vehicle_id?Number(r.vehicle_id):null,i,r.attendance_date?new Date(r.attendance_date):new Date,r.status||"PRESENT",r.pickup_point||null,r.drop_point||null,t.id||null,r.remarks||null,JSON.stringify(r.metadata||{}),t.id||null),l=await (0,d.recordEvent)({school_id:c,academic_year_id:p,user_id:t.id,actor_role:t.role,module_name:"transport",event_type:"TRANSPORT_ATTENDANCE_RECORDED",action:"record",entity_type:"student",entity_id:e,summary:"Transport attendance recorded",payload:s[0]});return await u.prisma.$executeRawUnsafe(`
        UPDATE transport_attendance
        SET event_id = $1
        WHERE id = $2
        `,l.id,s[0]?.id),a.NextResponse.json({attendance:{...s[0],event_id:l.id}})}if("pickup_drop"===s||"trip_event"===s){let e=Number(r.student_id)||null,n=Number(r.route_id)||null;if(!e||!n)return(0,o.validationError)("Student and route are required before recording pickup/drop history.");let i=await u.prisma.$queryRawUnsafe(`
          INSERT INTO transport_pickup_drop_history (
            school_id,
            academic_year_id,
            student_id,
            route_id,
            vehicle_id,
            trip_type,
            pickup_point,
            drop_point,
            event_time,
            status,
            recorded_by,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,CURRENT_TIMESTAMP)
          RETURNING *
          `,c,p,e,n,r.vehicle_id?Number(r.vehicle_id):null,String(r.trip_type||"PICKUP").toUpperCase(),r.pickup_point||null,r.drop_point||null,r.event_time?new Date(r.event_time):new Date,r.status||"RECORDED",t.id||null,JSON.stringify(r.metadata||{}),t.id||null);return await (0,d.recordEvent)({school_id:c,academic_year_id:p,user_id:t.id,actor_role:t.role,module_name:"transport",event_type:"TRANSPORT_PICKUP_DROP_RECORDED",action:"record",entity_type:"student",entity_id:e,summary:"Transport pickup/drop history recorded",payload:i[0]}),a.NextResponse.json({pickupDrop:i[0]})}if(!r.vehicle_number)return(0,o.validationError)("Vehicle number is required.");let E=await u.prisma.transport_vehicles.create({data:{school_id:c,academic_year_id:p,vehicle_number:r.vehicle_number,vehicle_type:r.vehicle_type||null,capacity:r.capacity?Number(r.capacity):null,driver_name:r.driver_name||null,driver_phone:r.driver_phone||null,created_by:t.id||null}});return await (0,d.recordEvent)({school_id:c,academic_year_id:p,user_id:t.id,actor_role:t.role,module_name:"transport",event_type:"TRANSPORT_VEHICLE_CREATED",action:"create",entity_type:"school",entity_id:c,summary:"Transport vehicle created"}),a.NextResponse.json({vehicle:E})}catch(e){return console.error(e),(0,o.apiError)(e,"Failed to save transport")}}async function R(e){try{let t=await (0,n.getCurrentUser)();if(!t)return(0,o.validationError)("Login required to update transport.");if(!(0,l.canManageRecord)(t.role,"transport","update"))return a.NextResponse.json({error:(0,l.managementError)("transport","update")},{status:403});let r=await e.json(),i=String(r.kind||"").toLowerCase(),s=Number(r.id),d=h(t);if(!s)return(0,o.validationError)("A valid transport record id is required.");if("route"===i){let e=await u.prisma.$queryRawUnsafe(`
          UPDATE transport_routes
          SET route_name = COALESCE($2, route_name),
              vehicle_number = $3,
              driver_name = $4,
              driver_phone = $5
          WHERE id = $1
            AND ($6::int IS NULL OR school_id = $6::int)
          RETURNING *
          `,s,r.route_name?String(r.route_name).trim():null,r.vehicle_number||null,r.driver_name||null,r.driver_phone||null,d);if(!e[0])return a.NextResponse.json({error:"Transport route not found."},{status:404});return a.NextResponse.json({route:e[0]})}if("assignment"===i){let e=await u.prisma.$queryRawUnsafe(`
          UPDATE transport_assignments
          SET route_id = COALESCE($2, route_id),
              pickup_point = $3,
              drop_point = $4,
              status = COALESCE($5, status),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND ($6::int IS NULL OR school_id = $6::int)
          RETURNING *
          `,s,r.route_id?Number(r.route_id):null,r.pickup_point||null,r.drop_point||null,r.status||null,d);if(!e[0])return a.NextResponse.json({error:"Transport assignment not found."},{status:404});return a.NextResponse.json({assignment:e[0]})}let c=await u.prisma.$queryRawUnsafe(`
        UPDATE transport_vehicles
        SET vehicle_number = COALESCE($2, vehicle_number),
            vehicle_type = $3,
            capacity = $4,
            driver_name = $5,
            driver_phone = $6
        WHERE id = $1
          AND ($7::int IS NULL OR school_id = $7::int)
        RETURNING *
        `,s,r.vehicle_number?String(r.vehicle_number).trim():null,r.vehicle_type||null,r.capacity?Number(r.capacity):null,r.driver_name||null,r.driver_phone||null,d);if(!c[0])return a.NextResponse.json({error:"Transport vehicle not found."},{status:404});return a.NextResponse.json({vehicle:c[0]})}catch(e){return(0,o.apiError)(e,"Failed to update transport")}}async function m(e){try{let t=await (0,n.getCurrentUser)();if(!t)return(0,o.validationError)("Login required to delete transport.");if(!(0,l.canManageRecord)(t.role,"transport","delete"))return a.NextResponse.json({error:(0,l.managementError)("transport","delete")},{status:403});let r=new URL(e.url),i=String(r.searchParams.get("kind")||"vehicle").toLowerCase(),s=Number(r.searchParams.get("id")),c=h(t);if(!s)return(0,o.validationError)("A valid transport record id is required.");return"route"===i?await u.prisma.$transaction(async e=>{await e.$executeRawUnsafe("DELETE FROM transport_attendance WHERE route_id = $1",s),await e.$executeRawUnsafe("DELETE FROM transport_pickup_drop_history WHERE route_id = $1",s),await e.$executeRawUnsafe("DELETE FROM transport_assignments WHERE route_id = $1",s),await e.$executeRawUnsafe("DELETE FROM transport_routes WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",s,c)}):"assignment"===i?await u.prisma.$executeRawUnsafe("DELETE FROM transport_assignments WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",s,c):await u.prisma.$executeRawUnsafe("DELETE FROM transport_vehicles WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",s,c),await (0,d.recordEvent)({school_id:c,user_id:t.id,actor_role:t.role,module_name:"transport",event_type:"TRANSPORT_RECORD_DELETED",action:"delete",entity_type:i,entity_id:s,summary:"Transport record deleted"}),a.NextResponse.json({success:!0})}catch(e){return(0,o.apiError)(e,"Failed to delete transport")}}e.s(["DELETE",0,m,"GET",0,p,"PATCH",0,R,"POST",0,E]),r()}catch(e){r(e)}},!1),995272,e=>e.a(async(t,r)=>{try{var a=e.i(747909),n=e.i(174017),i=e.i(996250),o=e.i(759756),s=e.i(561916),d=e.i(174677),u=e.i(869741),l=e.i(316795),c=e.i(487718),_=e.i(995169),p=e.i(47587),E=e.i(666012),R=e.i(570101),m=e.i(626937),h=e.i(10372),N=e.i(193695);e.i(52474);var y=e.i(600220),T=e.i(610141),v=t([T]);[T]=v.then?(await v)():v;let S=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/transport/route",pathname:"/api/transport",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/transport/route.ts",nextConfigOutput:"",userland:T,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:O,serverHooks:L}=S;async function $(e,t,r){r.requestMeta&&(0,o.setRequestMeta)(e,r.requestMeta),S.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/transport/route";a=a.replace(/\/index$/,"")||"/";let i=await S.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:T,deploymentId:v,params:$,nextConfig:C,parsedUrl:O,isDraftMode:L,prerenderManifest:f,routerServerContext:U,isOnDemandRevalidate:w,revalidateOnlyGenerated:A,resolvedPathname:g,clientReferenceManifest:D,serverActionsManifest:I}=i,b=(0,u.normalizeAppPath)(a),P=!!(f.dynamicRoutes[b]||f.routes[g]),x=async()=>((null==U?void 0:U.render404)?await U.render404(e,t,O,!1):t.end("This page could not be found"),null);if(P&&!L){let e=!!f.routes[g],t=f.dynamicRoutes[b];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await x();throw new N.NoFallbackError}}let M=null;!P||S.isDev||L||(M=g,M="/index"===M?"/":M);let q=!0===S.isDev||!P,H=P&&!q;I&&D&&(0,d.setManifestsSingleton)({page:a,clientReferenceManifest:D,serverActionsManifest:I});let k=e.method||"GET",F=(0,s.getTracer)(),j=F.getActiveScopeSpan(),W=!!(null==U?void 0:U.isWrappedByNextServer),J=!!(0,o.getRequestMeta)(e,"minimalMode"),G=(0,o.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,C,f,J);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let B={params:$,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:q,incrementalCache:G,cacheLifeProfiles:C.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>S.onRequestError(e,t,a,n,U)},sharedContext:{buildId:T,deploymentId:v}},K=new l.NodeNextRequest(e),X=new l.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let i,o=async e=>S.handle(V,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${k} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",n),i.updateName(t))}else e.updateName(`${k} ${a}`)}),d=async i=>{var s,d;let u=async({previousCacheEntry:n})=>{try{if(!J&&w&&A&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await o(i);e.fetchMetrics=B.renderOpts.fetchMetrics;let s=B.renderOpts.pendingWaitUntil;s&&r.waitUntil&&(r.waitUntil(s),s=void 0);let d=B.renderOpts.collectedTags;if(!P)return await (0,E.sendResponse)(K,X,a,B.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(a.headers);d&&(t[h.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:w})},!1,U),t}},l=await S.handleResponse({req:e,nextConfig:C,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:w,revalidateOnlyGenerated:A,responseGenerator:u,waitUntil:r.waitUntil,isMinimalMode:J});if(!P)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});J||t.setHeader("x-nextjs-cache",w?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),L&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,R.fromNodeOutgoingHttpHeaders)(l.value.headers);return J&&P||c.delete(h.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,m.getCacheControlHeader)(l.cacheControl)),await (0,E.sendResponse)(K,X,new Response(l.value.body,{headers:c,status:l.value.status||200})),null};W&&j?await d(j):(i=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(_.BaseServerSpan.handleRequest,{spanName:`${k} ${a}`,kind:s.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},d),void 0,!W))}catch(t){if(t instanceof N.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:w})},!1,U),P)throw t;return await (0,E.sendResponse)(K,X,new Response(null,{status:500})),null}}e.s(["handler",0,$,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:O})},"routeModule",0,S,"serverHooks",0,L,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,O]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=_02x7n7n._.js.map