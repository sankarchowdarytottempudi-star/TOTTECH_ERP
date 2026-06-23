module.exports=[255076,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(599683),r=e.i(597380),d=e.i(19754),o=e.i(368105),s=e.i(493399),c=e.i(15270),_=t([n,d,o,s,c]);[n,d,o,s,c]=_.then?(await _)():_;let m=e=>e?new Date(String(e)):new Date;async function l(e){let t=await (0,o.getCurrentUser)();if(!t)return{user:null,schoolId:null,academicYear:null,academicYearId:null,response:(0,r.validationError)("Login required to manage dining operations.")};let a=Number(e?.school_id)||Number(t?.school_id)||null;if(!a)return{user:t,schoolId:null,academicYear:null,academicYearId:null,response:(0,r.validationError)("Select a school before managing dining operations.")};let i=await (0,n.getSelectedAcademicYear)(a),d=Number(e?.academic_year_id??t.academic_year_id??i?.id)||null;return{user:t,schoolId:a,academicYear:i,academicYearId:d,response:null}}async function u(e){try{let t=await (0,d.resolvePlatformContext)(e);if(!t)return(0,r.validationError)("Login required to manage dining operations.");let a=t.schoolId,n=t.academicYearId,[o,s,_,l,u,p,m]=await Promise.all([c.prisma.$queryRawUnsafe(`
        SELECT *
        FROM dining_inventory_items
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY item_name ASC
        `,a,n),c.prisma.$queryRawUnsafe(`
        SELECT p.*, i.item_name, i.unit
        FROM dining_purchases p
        LEFT JOIN dining_inventory_items i ON i.id = p.item_id
        WHERE ($1::int IS NULL OR p.school_id = $1::int)
          AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
        ORDER BY p.purchase_date DESC, p.id DESC
        LIMIT 200
        `,a,n),c.prisma.$queryRawUnsafe(`
        SELECT c.*, i.item_name, i.unit
        FROM dining_consumption_logs c
        LEFT JOIN dining_inventory_items i ON i.id = c.item_id
        WHERE ($1::int IS NULL OR c.school_id = $1::int)
          AND ($2::int IS NULL OR c.academic_year_id = $2::int OR c.academic_year_id IS NULL)
        ORDER BY c.consumption_date DESC, c.id DESC
        LIMIT 200
        `,a,n),c.prisma.$queryRawUnsafe(`
        SELECT *
        FROM dining_production_sheets
        WHERE ($1::int IS NULL OR school_id = $1::int)
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        ORDER BY production_date DESC, id DESC
        LIMIT 200
        `,a,n),c.prisma.$queryRawUnsafe(`
        SELECT w.*, ps.meal_type, ps.production_date
        FROM dining_wastage_logs w
        LEFT JOIN dining_production_sheets ps ON ps.id = w.production_sheet_id
        WHERE ($1::int IS NULL OR w.school_id = $1::int)
          AND ($2::int IS NULL OR w.academic_year_id = $2::int OR w.academic_year_id IS NULL)
        ORDER BY w.wastage_date DESC, w.id DESC
        LIMIT 200
        `,a,n),c.prisma.$queryRawUnsafe(`
        SELECT
          a.*,
          mp.plan_name,
          mp.meal_type,
          s.admission_number,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
          t.first_name AS teacher_first_name,
          t.last_name AS teacher_last_name
        FROM dining_meal_assignments a
        LEFT JOIN dining_meal_plans mp ON mp.id = a.meal_plan_id
        LEFT JOIN students s ON s.id = a.student_id
        LEFT JOIN teachers t ON t.id = a.teacher_id
        WHERE ($1::int IS NULL OR a.school_id = $1::int)
          AND ($2::int IS NULL OR a.academic_year_id = $2::int OR a.academic_year_id IS NULL)
        ORDER BY a.created_at DESC, a.id DESC
        LIMIT 200
        `,a,n),c.prisma.$queryRawUnsafe(`
        SELECT
          COALESCE(SUM(ps.served_count), 0)::int AS served_count,
          COALESCE(SUM(ps.cost_amount), 0)::numeric AS production_cost,
          COALESCE(SUM(w.cost_amount), 0)::numeric AS wastage_cost,
          COALESCE(SUM(p.total_cost), 0)::numeric AS purchase_cost,
          COALESCE(COUNT(DISTINCT da.id), 0)::int AS attendance_count,
          COALESCE(COUNT(DISTINCT a.id), 0)::int AS assignment_count
        FROM (SELECT $1::int AS school_id, $2::int AS academic_year_id) ctx
        LEFT JOIN dining_production_sheets ps
          ON (ctx.school_id IS NULL OR ps.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR ps.academic_year_id = ctx.academic_year_id OR ps.academic_year_id IS NULL)
        LEFT JOIN dining_wastage_logs w
          ON (ctx.school_id IS NULL OR w.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR w.academic_year_id = ctx.academic_year_id OR w.academic_year_id IS NULL)
        LEFT JOIN dining_purchases p
          ON (ctx.school_id IS NULL OR p.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR p.academic_year_id = ctx.academic_year_id OR p.academic_year_id IS NULL)
        LEFT JOIN dining_attendance da
          ON (ctx.school_id IS NULL OR da.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR da.academic_year_id = ctx.academic_year_id OR da.academic_year_id IS NULL)
        LEFT JOIN dining_meal_assignments a
          ON (ctx.school_id IS NULL OR a.school_id = ctx.school_id)
          AND (ctx.academic_year_id IS NULL OR a.academic_year_id = ctx.academic_year_id OR a.academic_year_id IS NULL)
        `,a,n)]);return i.NextResponse.json({academicYear:{id:n,scope:t.academicYearScope},inventoryItems:o,purchases:s,consumptionLogs:_,productionSheets:l,wastageLogs:u,mealAssignments:p,analytics:m[0]||{}})}catch(e){return console.error(e),(0,r.apiError)(e,"Failed to load dining operations.")}}async function p(e){try{let t=await e.json(),a=await l(t);if(a.response)return a.response;let n=a.user,d=a.schoolId,o=a.academicYearId,_=String(t.kind||"").toLowerCase();if("inventory_item"===_){if(!t.item_name)return(0,r.validationError)("Inventory item name is required.");let e=await c.prisma.$queryRawUnsafe(`
          INSERT INTO dining_inventory_items (
            school_id,
            academic_year_id,
            item_name,
            unit,
            current_quantity,
            reorder_level,
            metadata,
            created_by,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
          RETURNING *
          `,d,o,String(t.item_name).trim(),t.unit||"kg",Number(t.current_quantity||0),Number(t.reorder_level||0),JSON.stringify(t.metadata||{}),n.id||null);return await (0,s.recordEvent)({school_id:d,academic_year_id:o,user_id:n.id,actor_role:n.role,module_name:"dining",event_type:"DINING_INVENTORY_ITEM_CREATED",action:"create",entity_type:"school",entity_id:d,summary:"Dining inventory item created",payload:e[0]}),i.NextResponse.json({inventoryItem:e[0]})}if("purchase"===_){let e=Number(t.item_id)||null,a=Number(t.quantity||0),_=Number(t.unit_cost||0);if(!e||a<=0)return(0,r.validationError)("Inventory item and positive purchase quantity are required.");let l=await c.prisma.$queryRawUnsafe(`
          INSERT INTO dining_purchases (
            school_id,
            academic_year_id,
            item_id,
            purchase_date,
            quantity,
            unit_cost,
            total_cost,
            vendor_name,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP)
          RETURNING *
          `,d,o,e,m(t.purchase_date),a,_,Number(t.total_cost??a*_),t.vendor_name||null,n.id||null);return await c.prisma.$executeRawUnsafe(`
        UPDATE dining_inventory_items
        SET current_quantity = COALESCE(current_quantity, 0) + $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND school_id = $3
        `,a,e,d),await (0,s.recordEvent)({school_id:d,academic_year_id:o,user_id:n.id,actor_role:n.role,module_name:"dining",event_type:"DINING_PURCHASE_RECORDED",action:"create",entity_type:"school",entity_id:d,summary:"Dining purchase recorded",payload:l[0]}),i.NextResponse.json({purchase:l[0]})}if("consumption"===_){let e=Number(t.item_id)||null,a=Number(t.quantity||0);if(!e||a<=0)return(0,r.validationError)("Inventory item and positive consumption quantity are required.");let _=await c.prisma.$queryRawUnsafe(`
          INSERT INTO dining_consumption_logs (
            school_id,
            academic_year_id,
            item_id,
            consumption_date,
            quantity,
            meal_type,
            recorded_by,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,CURRENT_TIMESTAMP)
          RETURNING *
          `,d,o,e,m(t.consumption_date),a,t.meal_type||"LUNCH",n.id||null,JSON.stringify(t.metadata||{}),n.id||null);return await c.prisma.$executeRawUnsafe(`
        UPDATE dining_inventory_items
        SET current_quantity = GREATEST(COALESCE(current_quantity, 0) - $1, 0),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND school_id = $3
        `,a,e,d),await (0,s.recordEvent)({school_id:d,academic_year_id:o,user_id:n.id,actor_role:n.role,module_name:"dining",event_type:"DINING_CONSUMPTION_RECORDED",action:"record",entity_type:"school",entity_id:d,summary:"Dining consumption recorded",payload:_[0]}),i.NextResponse.json({consumption:_[0]})}if("production"===_){let e=await c.prisma.$queryRawUnsafe(`
          INSERT INTO dining_production_sheets (
            school_id,
            academic_year_id,
            production_date,
            meal_type,
            expected_count,
            produced_count,
            served_count,
            cost_amount,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,CURRENT_TIMESTAMP)
          RETURNING *
          `,d,o,m(t.production_date),t.meal_type||"LUNCH",Number(t.expected_count||0),Number(t.produced_count||0),Number(t.served_count||0),Number(t.cost_amount||0),JSON.stringify(t.metadata||{}),n.id||null);return await (0,s.recordEvent)({school_id:d,academic_year_id:o,user_id:n.id,actor_role:n.role,module_name:"dining",event_type:"DINING_PRODUCTION_RECORDED",action:"record",entity_type:"school",entity_id:d,summary:"Dining production sheet recorded",payload:e[0]}),i.NextResponse.json({productionSheet:e[0]})}if("wastage"===_){let e=Number(t.quantity||0);if(e<=0)return(0,r.validationError)("Positive wastage quantity is required.");let a=await c.prisma.$queryRawUnsafe(`
          INSERT INTO dining_wastage_logs (
            school_id,
            academic_year_id,
            production_sheet_id,
            wastage_date,
            quantity,
            cost_amount,
            reason,
            recorded_by,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP)
          RETURNING *
          `,d,o,t.production_sheet_id?Number(t.production_sheet_id):null,m(t.wastage_date),e,Number(t.cost_amount||0),t.reason||null,n.id||null,n.id||null);return await (0,s.recordEvent)({school_id:d,academic_year_id:o,user_id:n.id,actor_role:n.role,module_name:"dining",event_type:"DINING_WASTAGE_RECORDED",action:"record",entity_type:"school",entity_id:d,summary:"Dining wastage recorded",payload:a[0]}),i.NextResponse.json({wastage:a[0]})}if("meal_assignment"===_||"special_diet"===_){let e=Number(t.student_id)||null,a=Number(t.teacher_id)||null;if(!e&&!a)return(0,r.validationError)("Select a student or teacher before assigning a meal plan.");let l={...t.metadata||{},special_diet:"special_diet"===_||!!t.special_diet,diet_notes:t.diet_notes||null,medical_notes:t.medical_notes||null},u=await c.prisma.$queryRawUnsafe(`
          INSERT INTO dining_meal_assignments (
            school_id,
            academic_year_id,
            meal_plan_id,
            student_id,
            teacher_id,
            staff_id,
            start_date,
            end_date,
            status,
            metadata,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,CURRENT_TIMESTAMP)
          RETURNING *
          `,d,o,t.meal_plan_id?Number(t.meal_plan_id):null,e,a,t.staff_id?Number(t.staff_id):null,m(t.start_date),t.end_date?new Date(t.end_date):null,t.status||("special_diet"===_?"SPECIAL_DIET":"ACTIVE"),JSON.stringify(l),n.id||null);return await (0,s.recordEvent)({school_id:d,academic_year_id:o,user_id:n.id,actor_role:n.role,module_name:"dining",event_type:"special_diet"===_?"DINING_SPECIAL_DIET_RECORDED":"DINING_MEAL_ASSIGNED",action:"assign",entity_type:e?"student":"teacher",entity_id:e||a,summary:"special_diet"===_?"Dining special diet recorded":"Dining meal plan assigned",payload:u[0]}),i.NextResponse.json({assignment:u[0]})}return(0,r.validationError)("Unsupported dining operation.")}catch(e){return console.error(e),(0,r.apiError)(e,"Failed to save dining operation.")}}e.s(["GET",0,u,"POST",0,p]),a()}catch(e){a(e)}},!1),947514,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),d=e.i(759756),o=e.i(561916),s=e.i(174677),c=e.i(869741),_=e.i(316795),l=e.i(487718),u=e.i(995169),p=e.i(47587),m=e.i(666012),E=e.i(570101),R=e.i(626937),N=e.i(10372),y=e.i(193695);e.i(52474);var h=e.i(600220),S=e.i(255076),I=t([S]);[S]=I.then?(await I)():I;let O=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/dining/operations/route",pathname:"/api/dining/operations",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/dining/operations/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:L,workUnitAsyncStorage:T,serverHooks:$}=O;async function g(e,t,a){a.requestMeta&&(0,d.setRequestMeta)(e,a.requestMeta),O.isDev&&(0,d.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/dining/operations/route";i=i.replace(/\/index$/,"")||"/";let r=await O.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:S,deploymentId:I,params:g,nextConfig:L,parsedUrl:T,isDraftMode:$,prerenderManifest:C,routerServerContext:w,isOnDemandRevalidate:U,revalidateOnlyGenerated:v,resolvedPathname:A,clientReferenceManifest:f,serverActionsManifest:D}=r,x=(0,c.normalizeAppPath)(i),b=!!(C.dynamicRoutes[x]||C.routes[A]),M=async()=>((null==w?void 0:w.render404)?await w.render404(e,t,T,!1):t.end("This page could not be found"),null);if(b&&!$){let e=!!C.routes[A],t=C.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(L.adapterPath)return await M();throw new y.NoFallbackError}}let q=null;!b||O.isDev||$||(q=A,q="/index"===q?"/":q);let P=!0===O.isDev||!b,F=b&&!P;D&&f&&(0,s.setManifestsSingleton)({page:i,clientReferenceManifest:f,serverActionsManifest:D});let H=e.method||"GET",G=(0,o.getTracer)(),j=G.getActiveScopeSpan(),Y=!!(null==w?void 0:w.isWrappedByNextServer),k=!!(0,d.getRequestMeta)(e,"minimalMode"),J=(0,d.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,L,C,k);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let B={params:g,previewProps:C.preview,renderOpts:{experimental:{authInterrupts:!!L.experimental.authInterrupts},cacheComponents:!!L.cacheComponents,supportsDynamicResponse:P,incrementalCache:J,cacheLifeProfiles:L.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>O.onRequestError(e,t,i,n,w)},sharedContext:{buildId:S,deploymentId:I}},W=new _.NodeNextRequest(e),V=new _.NodeNextResponse(t),K=l.NextRequestAdapter.fromNodeNextRequest(W,(0,l.signalFromNodeResponse)(t));try{let r,d=async e=>O.handle(K,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=G.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${H} ${i}`)}),s=async r=>{var o,s;let c=async({previousCacheEntry:n})=>{try{if(!k&&U&&v&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await d(r);e.fetchMetrics=B.renderOpts.fetchMetrics;let o=B.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let s=B.renderOpts.collectedTags;if(!b)return await (0,m.sendResponse)(W,V,i,B.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(i.headers);s&&(t[N.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:U})},!1,w),t}},_=await O.handleResponse({req:e,nextConfig:L,cacheKey:q,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:U,revalidateOnlyGenerated:v,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:k});if(!b)return null;if((null==_||null==(o=_.value)?void 0:o.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==_||null==(s=_.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});k||t.setHeader("x-nextjs-cache",U?"REVALIDATED":_.isMiss?"MISS":_.isStale?"STALE":"HIT"),$&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,E.fromNodeOutgoingHttpHeaders)(_.value.headers);return k&&b||l.delete(N.NEXT_CACHE_TAGS_HEADER),!_.cacheControl||t.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,R.getCacheControlHeader)(_.cacheControl)),await (0,m.sendResponse)(W,V,new Response(_.value.body,{headers:l,status:_.value.status||200})),null};Y&&j?await s(j):(r=G.getActiveScopeSpan(),await G.withPropagatedContext(e.headers,()=>G.trace(u.BaseServerSpan.handleRequest,{spanName:`${H} ${i}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},s),void 0,!Y))}catch(t){if(t instanceof y.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:U})},!1,w),b)throw t;return await (0,m.sendResponse)(W,V,new Response(null,{status:500})),null}}e.s(["handler",0,g,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:L,workUnitAsyncStorage:T})},"routeModule",0,O,"serverHooks",0,$,"workAsyncStorage",0,L,"workUnitAsyncStorage",0,T]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0.7liw3._.js.map