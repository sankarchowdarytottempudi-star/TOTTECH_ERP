module.exports=[162744,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(368105),r=e.i(599683),s=e.i(597380),d=e.i(19754),o=e.i(493399),l=e.i(15270),u=e.i(922799),c=e.i(410325),_=t([i,r,d,o,l,c]);[i,r,d,o,l,c]=_.then?(await _)():_;let N=e=>e?.role==="SUPER_ADMIN"?Number(e.school_id)||null:Number(e?.school_id)||null;async function p(e){try{let t=await (0,c.requireSchoolModule)("DINING");if(t.response)return t.response;let a=await (0,d.resolvePlatformContext)(e);if(!a)return(0,s.validationError)("Login required to view dining.");let i=a.schoolId,r=a.academicYearId,[o,u,_]=await Promise.all([l.prisma.$queryRawUnsafe(`
        SELECT
          da.*,
          s.first_name,
          s.last_name,
          COALESCE(c.class_name, '') AS class_name,
          COALESCE(sec.section_name, '') AS section_name
        FROM dining_attendance da
        LEFT JOIN students s ON s.id = da.student_id
        LEFT JOIN classes c ON c.id = da.class_id
        LEFT JOIN sections sec ON sec.id = da.section_id
        WHERE ($1::int IS NULL OR da.school_id = $1::int)
          AND ($2::int IS NULL OR da.academic_year_id = $2::int OR da.academic_year_id IS NULL)
        ORDER BY da.attendance_date DESC, da.id DESC
        LIMIT 200
        `,i,r),l.prisma.$queryRawUnsafe(`
        SELECT *
        FROM dining_meal_plans
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY created_at DESC
        LIMIT 200
        `,i,r),l.prisma.$queryRawUnsafe(`
        SELECT *
        FROM dining_weekly_menus
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY week_start DESC, day_of_week ASC, meal_type ASC
        LIMIT 200
        `,i,r)]);return n.NextResponse.json({diningAttendance:o,mealPlans:u,weeklyMenus:_,academicYear:{id:r,scope:a.academicYearScope}})}catch(e){return console.error(e),(0,s.apiError)(e,"Failed to load dining data")}}async function E(e){try{let t=await (0,i.getCurrentUser)();if(!t)return(0,s.validationError)("Login required to update dining.");let a=await e.json(),d=String(a.kind||"attendance"),c="meal_plan"===d?"meal_plan":"dining_menu";if(!(0,u.canManageRecord)(t.role,c,"create"))return n.NextResponse.json({error:(0,u.managementError)(c,"create")},{status:403});let _="SUPER_ADMIN"===t.role&&Number(a.school_id)||N(t),p=await (0,r.getSelectedAcademicYear)(_),E=Number(a.academic_year_id??p?.id??t.academic_year_id)||null;if(!_)return(0,s.validationError)("Select a school before updating dining.");if(!E)return(0,s.validationError)("Select an academic year before updating dining.");if("meal_plan"===d){if(!a.plan_name)return(0,s.validationError)("Meal plan name is required.");let e=await l.prisma.$queryRawUnsafe(`
          INSERT INTO dining_meal_plans (
            school_id,
            academic_year_id,
            plan_name,
            meal_type,
            price,
            status,
            metadata,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,_,E,a.plan_name,a.meal_type||"LUNCH",Number(a.price||0),a.status||"ACTIVE",JSON.stringify(a.metadata||{}),t.id||null);return await (0,o.recordEvent)({school_id:_,academic_year_id:E,user_id:t.id,actor_role:t.role,module_name:"dining",event_type:"DINING_MEAL_PLAN_CREATED",action:"create",entity_type:"school",entity_id:_,summary:"Dining meal plan created"}),n.NextResponse.json({mealPlan:e[0]})}if("weekly_menu"===d){if(!a.week_start)return(0,s.validationError)("Week start date is required.");let e="string"==typeof a.menu_items?a.menu_items.split(",").map(e=>e.trim()).filter(Boolean):a.menu_items||[],i=await l.prisma.$queryRawUnsafe(`
          INSERT INTO dining_weekly_menus (
            school_id,
            academic_year_id,
            week_start,
            day_of_week,
            meal_type,
            menu_items,
            nutrition_notes,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,_,E,new Date(a.week_start),a.day_of_week||"MONDAY",a.meal_type||"LUNCH",JSON.stringify(e),a.nutrition_notes||null,t.id||null);return await (0,o.recordEvent)({school_id:_,academic_year_id:E,user_id:t.id,actor_role:t.role,module_name:"dining",event_type:"DINING_MENU_CREATED",action:"create",entity_type:"school",entity_id:_,summary:"Dining menu created"}),n.NextResponse.json({weeklyMenu:i[0]})}if(!a.student_id)return(0,s.validationError)("Select a student before recording dining attendance.");let m=(await l.prisma.$queryRawUnsafe(`
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
          AND ($2::int IS NULL OR s.school_id = $2::int)
        ORDER BY sye.id DESC NULLS LAST
        LIMIT 1
        `,Number(a.student_id),_,E))[0];if(!m)return(0,s.validationError)("Selected student was not found in the selected school.");let R=Number(a.class_id??m.class_id)||null,y=Number(a.section_id??m.section_id)||null,g=(await l.prisma.$queryRawUnsafe(`
        INSERT INTO dining_attendance (
          school_id,
          academic_year_id,
          class_id,
          section_id,
          student_id,
          meal_type,
          attendance_date,
          status,
          recorded_by,
          source,
          remarks,
          metadata,
          created_by,
          created_at,
          recorded_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'web',$10,$11::jsonb,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT ON CONSTRAINT uq_dining_student_meal_date
        DO UPDATE SET
          status = EXCLUDED.status,
          remarks = EXCLUDED.remarks,
          recorded_by = EXCLUDED.recorded_by,
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          recorded_at = CURRENT_TIMESTAMP
        RETURNING *
        `,_,E,R,y,Number(a.student_id),a.meal_type||"LUNCH",a.attendance_date?new Date(a.attendance_date):new Date,a.status||"PRESENT",t.id||null,a.remarks||null,JSON.stringify(a.metadata||{}),t.id||null))[0];return await (0,o.recordEvent)({school_id:_,academic_year_id:E,user_id:t.id,actor_role:t.role,module_name:"dining",event_type:"DINING_ATTENDANCE_RECORDED",action:"record",entity_type:"student",entity_id:Number(a.student_id),summary:"Dining attendance recorded",payload:{meal_type:a.meal_type,status:a.status,class_id:R,section_id:y}}),n.NextResponse.json({record:g})}catch(e){return console.error(e),(0,s.apiError)(e,"Failed to save dining data")}}async function m(e){try{let t=await (0,i.getCurrentUser)();if(!t)return(0,s.validationError)("Login required to update dining.");let a=await e.json(),r=String(a.kind||"").toLowerCase(),d=Number(a.id),o="meal_plan"===r?"meal_plan":"dining_menu";if(!(0,u.canManageRecord)(t.role,o,"update"))return n.NextResponse.json({error:(0,u.managementError)(o,"update")},{status:403});if(!d)return(0,s.validationError)("A valid dining record id is required.");let c=N(t);if("meal_plan"===r){let e=await l.prisma.$queryRawUnsafe(`
          UPDATE dining_meal_plans
          SET plan_name = COALESCE($2, plan_name),
              meal_type = COALESCE($3, meal_type),
              price = COALESCE($4, price),
              status = COALESCE($5, status),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND ($6::int IS NULL OR school_id = $6::int)
          RETURNING *
          `,d,a.plan_name?String(a.plan_name).trim():null,a.meal_type||null,void 0!==a.price&&""!==a.price?Number(a.price):null,a.status||null,c);if(!e[0])return n.NextResponse.json({error:"Meal plan not found."},{status:404});return n.NextResponse.json({mealPlan:e[0]})}let _="string"==typeof a.menu_items?a.menu_items.split(",").map(e=>e.trim()).filter(Boolean):a.menu_items||null,p=await l.prisma.$queryRawUnsafe(`
        UPDATE dining_weekly_menus
        SET week_start = COALESCE($2, week_start),
            day_of_week = COALESCE($3, day_of_week),
            meal_type = COALESCE($4, meal_type),
            menu_items = COALESCE($5::jsonb, menu_items),
            nutrition_notes = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND ($7::int IS NULL OR school_id = $7::int)
        RETURNING *
        `,d,a.week_start?new Date(a.week_start):null,a.day_of_week||null,a.meal_type||null,_?JSON.stringify(_):null,a.nutrition_notes||null,c);if(!p[0])return n.NextResponse.json({error:"Dining menu not found."},{status:404});return n.NextResponse.json({menu:p[0]})}catch(e){return(0,s.apiError)(e,"Failed to update dining record")}}async function R(e){try{let t=await (0,i.getCurrentUser)();if(!t)return(0,s.validationError)("Login required to delete dining.");let a=new URL(e.url),r=String(a.searchParams.get("kind")||"").toLowerCase(),d=Number(a.searchParams.get("id")),c="meal_plan"===r?"meal_plan":"dining_menu";if(!(0,u.canManageRecord)(t.role,c,"delete"))return n.NextResponse.json({error:(0,u.managementError)(c,"delete")},{status:403});if(!d)return(0,s.validationError)("A valid dining record id is required.");let _=N(t);return"meal_plan"===r?await l.prisma.$transaction(async e=>{await e.$executeRawUnsafe("DELETE FROM dining_meal_assignments WHERE meal_plan_id = $1",d),await e.$executeRawUnsafe("DELETE FROM dining_meal_plans WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",d,_)}):await l.prisma.$executeRawUnsafe("DELETE FROM dining_weekly_menus WHERE id = $1 AND ($2::int IS NULL OR school_id = $2::int)",d,_),await (0,o.recordEvent)({school_id:_,user_id:t.id,actor_role:t.role,module_name:"dining",event_type:"DINING_RECORD_DELETED",action:"delete",entity_type:r,entity_id:d,summary:"Dining record deleted"}),n.NextResponse.json({success:!0})}catch(e){return(0,s.apiError)(e,"Failed to delete dining record")}}e.s(["DELETE",0,R,"GET",0,p,"PATCH",0,m,"POST",0,E]),a()}catch(e){a(e)}},!1),51696,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),s=e.i(759756),d=e.i(561916),o=e.i(174677),l=e.i(869741),u=e.i(316795),c=e.i(487718),_=e.i(995169),p=e.i(47587),E=e.i(666012),m=e.i(570101),R=e.i(626937),N=e.i(10372),y=e.i(193695);e.i(52474);var g=e.i(600220),w=e.i(162744),C=t([w]);[w]=C.then?(await C)():C;let h=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/dining/route",pathname:"/api/dining",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/dining/route.ts",nextConfigOutput:"",userland:w,...{}}),{workAsyncStorage:f,workUnitAsyncStorage:T,serverHooks:A}=h;async function S(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),h.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/dining/route";n=n.replace(/\/index$/,"")||"/";let r=await h.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,deploymentId:C,params:S,nextConfig:f,parsedUrl:T,isDraftMode:A,prerenderManifest:$,routerServerContext:L,isOnDemandRevalidate:O,revalidateOnlyGenerated:I,resolvedPathname:U,clientReferenceManifest:v,serverActionsManifest:D}=r,M=(0,l.normalizeAppPath)(n),b=!!($.dynamicRoutes[M]||$.routes[U]),P=async()=>((null==L?void 0:L.render404)?await L.render404(e,t,T,!1):t.end("This page could not be found"),null);if(b&&!A){let e=!!$.routes[U],t=$.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(f.adapterPath)return await P();throw new y.NoFallbackError}}let x=null;!b||h.isDev||A||(x=U,x="/index"===x?"/":x);let k=!0===h.isDev||!b,q=b&&!k;D&&v&&(0,o.setManifestsSingleton)({page:n,clientReferenceManifest:v,serverActionsManifest:D});let H=e.method||"GET",j=(0,d.getTracer)(),F=j.getActiveScopeSpan(),G=!!(null==L?void 0:L.isWrappedByNextServer),W=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await h.getIncrementalCache(e,f,$,W);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let Y={params:S,previewProps:$.preview,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:k,incrementalCache:B,cacheLifeProfiles:f.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>h.onRequestError(e,t,n,i,L)},sharedContext:{buildId:w,deploymentId:C}},J=new u.NodeNextRequest(e),K=new u.NodeNextResponse(t),X=c.NextRequestAdapter.fromNodeNextRequest(J,(0,c.signalFromNodeResponse)(t));try{let r,s=async e=>h.handle(X,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${H} ${n}`)}),o=async r=>{var d,o;let l=async({previousCacheEntry:i})=>{try{if(!W&&O&&I&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(r);e.fetchMetrics=Y.renderOpts.fetchMetrics;let d=Y.renderOpts.pendingWaitUntil;d&&a.waitUntil&&(a.waitUntil(d),d=void 0);let o=Y.renderOpts.collectedTags;if(!b)return await (0,E.sendResponse)(J,K,n,Y.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(n.headers);o&&(t[N.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,i=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await h.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:O})},!1,L),t}},u=await h.handleResponse({req:e,nextConfig:f,cacheKey:x,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:$,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:I,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:W});if(!b)return null;if((null==u||null==(d=u.value)?void 0:d.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",O?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,m.fromNodeOutgoingHttpHeaders)(u.value.headers);return W&&b||c.delete(N.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(u.cacheControl)),await (0,E.sendResponse)(J,K,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};G&&F?await o(F):(r=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(_.BaseServerSpan.handleRequest,{spanName:`${H} ${n}`,kind:d.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!G))}catch(t){if(t instanceof y.NoFallbackError||await h.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:O})},!1,L),b)throw t;return await (0,E.sendResponse)(J,K,new Response(null,{status:500})),null}}e.s(["handler",0,S,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:T})},"routeModule",0,h,"serverHooks",0,A,"workAsyncStorage",0,f,"workUnitAsyncStorage",0,T]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0nat.po._.js.map