module.exports=[179863,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),s=e.i(503031),d=e.i(15270),r=t([n,d]);async function l(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,[r,l,o,c,E,_,A,p,u]=await Promise.all([d.prisma.$queryRawUnsafe(`
      SELECT
        (SELECT COUNT(*)::int FROM appointments WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND appointment_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false) AS todays_appointments,
        (SELECT COUNT(*)::int FROM patients WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND created_at::date = CURRENT_DATE AND COALESCE(is_deleted,false) = false) AS patients_registered_today,
        (SELECT COUNT(*)::int FROM doctors WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND status = 'AVAILABLE' AND COALESCE(is_deleted,false) = false) AS doctors_available,
        (SELECT COUNT(*)::int FROM lab_orders WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND status IN ('ORDERED','SAMPLE_COLLECTED','PENDING') AND COALESCE(is_deleted,false) = false) AS lab_orders_pending,
        (
          COALESCE((SELECT SUM(COALESCE(total,0)) FROM billing_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND invoice_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(paid_amount,0)) FROM clinical_finance_ar_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND invoice_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(amount,0)) FROM clinical_finance_cash_transactions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND transaction_date = CURRENT_DATE AND COALESCE(is_deleted,false) = false), 0)
        )::numeric AS revenue_today,
        (
          COALESCE((SELECT SUM(COALESCE(total,0)) FROM billing_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE) AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(paid_amount,0)) FROM clinical_finance_ar_invoices WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE) AND COALESCE(is_deleted,false) = false), 0)
          +
          COALESCE((SELECT SUM(COALESCE(amount,0)) FROM clinical_finance_cash_transactions WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE) AND COALESCE(is_deleted,false) = false), 0)
        )::numeric AS revenue_this_month,
        (SELECT COUNT(*)::int FROM ivf_cycles WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND status = 'ACTIVE' AND COALESCE(is_deleted,false) = false) AS ivf_cycles_active,
        (SELECT COUNT(*)::int FROM appointments WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND appointment_date = CURRENT_DATE AND queue_status = 'WAITING' AND COALESCE(is_deleted,false) = false) AS patients_waiting
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT
        a.id,
        a.appointment_uid,
        a.appointment_date,
        a.start_time,
        a.status,
        a.queue_status,
        a.token_number,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
        d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND COALESCE(a.is_deleted, false) = false
      ORDER BY a.start_time ASC NULLS LAST, a.id DESC
      LIMIT 12
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT
        a.id,
        a.token_number,
        a.queue_status,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND a.queue_status IN ('WAITING','CHECKED_IN')
        AND COALESCE(a.is_deleted, false) = false
      ORDER BY a.created_at ASC
      LIMIT 10
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT
        id,
        patient_uid,
        uhid,
        first_name,
        last_name,
        phone AS mobile,
        created_at
      FROM patients
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted, false) = false
      ORDER BY created_at DESC
      LIMIT 8
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT 'OP/IP Billing' AS label,
        COALESCE(SUM(COALESCE(total,0)), 0)::numeric AS value,
        '/clinical-services/hms/billing' AS href
      FROM billing_invoices
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Finance AR' AS label,
        COALESCE(SUM(COALESCE(paid_amount,0)), 0)::numeric AS value,
        '/clinical-services/finance/ar' AS href
      FROM clinical_finance_ar_invoices
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Cash Collections' AS label,
        COALESCE(SUM(COALESCE(amount,0)), 0)::numeric AS value,
        '/clinical-services/finance/cash' AS href
      FROM clinical_finance_cash_transactions
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE)
        AND COALESCE(is_deleted, false) = false
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(d.department_name, 'Unassigned') AS label,
        COUNT(a.id)::int AS value,
        '/clinical-services/appointments' AS href
      FROM departments d
      LEFT JOIN doctors doc
        ON doc.department_id = d.id
        AND doc.tenant_id = d.tenant_id
        AND doc.hospital_id = d.hospital_id
        AND doc.branch_id = d.branch_id
        AND COALESCE(doc.is_deleted, false) = false
      LEFT JOIN appointments a
        ON a.doctor_id = doc.id
        AND a.appointment_date = CURRENT_DATE
        AND COALESCE(a.is_deleted, false) = false
      WHERE d.tenant_id = $1
        AND d.hospital_id = $2
        AND d.branch_id = $3
        AND COALESCE(d.is_deleted, false) = false
      GROUP BY d.department_name
      ORDER BY value DESC, d.department_name ASC
      LIMIT 8
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT 'Patients waiting' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/appointments' AS href
      FROM appointments
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND appointment_date = CURRENT_DATE
        AND queue_status IN ('WAITING','CHECKED_IN')
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Pending lab orders' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/lab-orders' AS href
      FROM lab_orders
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND status IN ('ORDERED','SAMPLE_COLLECTED','PENDING')
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Active IVF cycles' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/ivf/cycles' AS href
      FROM ivf_cycles
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND status = 'ACTIVE'
        AND COALESCE(is_deleted, false) = false
      UNION ALL
      SELECT 'Draft insurance claims' AS title,
        COUNT(*)::int AS value,
        '/clinical-services/finance/claims' AS href
      FROM clinical_finance_claims
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND status IN ('DRAFT','PENDING')
        AND COALESCE(is_deleted, false) = false
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT
        'Queue' AS category,
        a.id,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS title,
        CONCAT('Token ', COALESCE(a.token_number::text, '-'), ' is ', COALESCE(a.queue_status, '-')) AS summary,
        '/clinical-services/appointments' AS href
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND a.queue_status IN ('WAITING','CHECKED_IN')
        AND COALESCE(a.is_deleted, false) = false
      ORDER BY a.created_at ASC
      LIMIT 6
      `,a.tenantId,a.hospitalId,a.branchId),d.prisma.$queryRawUnsafe(`
      SELECT
        'Appointment' AS category,
        id,
        appointment_uid AS title,
        CONCAT(COALESCE(status, '-'), ' on ', appointment_date::text) AS summary,
        '/clinical-services/appointments' AS href
      FROM appointments
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND appointment_date >= CURRENT_DATE
        AND COALESCE(is_deleted, false) = false
      ORDER BY appointment_date ASC, start_time ASC NULLS LAST
      LIMIT 6
      `,a.tenantId,a.hospitalId,a.branchId)]),C=a.licensedModules||[],N=e=>(0,s.isModuleLicensed)((0,s.moduleCodeForClinicalPath)(e),C),h=r[0]||{},R={...h,lab_orders_pending:N("/clinical-services/laboratory")?h.lab_orders_pending:void 0,revenue_today:N("/clinical-services/hms/billing")?h.revenue_today:void 0,revenue_this_month:N("/clinical-services/finance/cash")?h.revenue_this_month:void 0,ivf_cycles_active:N("/clinical-services/ivf/cycles")?h.ivf_cycles_active:void 0},S=e=>e.filter(e=>N(String(e.href||"")));return i.NextResponse.json({context:a,metrics:R,appointments:l,waiting:o,recentPatients:c,revenueBreakdown:S(E),departmentPerformance:_,pendingTasks:S(A),alerts:S(p),notifications:S(u),aiInsight:{confidenceScore:82,summary:"Clinical dashboard is grounded in patient, appointment, doctor, lab, IVF, finance, and queue records for the selected clinic.",dataSourcesUsed:["appointments","patients","doctors","lab_orders","ivf_cycles","billing_invoices","clinical_finance_ar_invoices"]}})}[n,d]=r.then?(await r)():r,e.s(["GET",0,l]),a()}catch(e){a(e)}},!1),341022,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),s=e.i(996250),d=e.i(759756),r=e.i(561916),l=e.i(174677),o=e.i(869741),c=e.i(316795),E=e.i(487718),_=e.i(995169),A=e.i(47587),p=e.i(666012),u=e.i(570101),C=e.i(626937),N=e.i(10372),h=e.i(193695);e.i(52474);var R=e.i(600220),S=e.i(179863),D=t([S]);[S]=D.then?(await D)():D;let O=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/dashboard/route",pathname:"/api/clinical/dashboard",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/dashboard/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:m,workUnitAsyncStorage:T,serverHooks:L}=O;async function f(e,t,a){a.requestMeta&&(0,d.setRequestMeta)(e,a.requestMeta),O.isDev&&(0,d.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/dashboard/route";i=i.replace(/\/index$/,"")||"/";let s=await O.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:S,deploymentId:D,params:f,nextConfig:m,parsedUrl:T,isDraftMode:L,prerenderManifest:v,routerServerContext:I,isOnDemandRevalidate:$,revalidateOnlyGenerated:b,resolvedPathname:U,clientReferenceManifest:g,serverActionsManifest:y}=s,M=(0,o.normalizeAppPath)(i),w=!!(v.dynamicRoutes[M]||v.routes[U]),H=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,T,!1):t.end("This page could not be found"),null);if(w&&!L){let e=!!v.routes[U],t=v.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(m.adapterPath)return await H();throw new h.NoFallbackError}}let F=null;!w||O.isDev||L||(F=U,F="/index"===F?"/":F);let q=!0===O.isDev||!w,x=w&&!q;y&&g&&(0,l.setManifestsSingleton)({page:i,clientReferenceManifest:g,serverActionsManifest:y});let P=e.method||"GET",W=(0,r.getTracer)(),k=W.getActiveScopeSpan(),B=!!(null==I?void 0:I.isWrappedByNextServer),G=!!(0,d.getRequestMeta)(e,"minimalMode"),K=(0,d.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,m,v,G);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let j={params:f,previewProps:v.preview,renderOpts:{experimental:{authInterrupts:!!m.experimental.authInterrupts},cacheComponents:!!m.cacheComponents,supportsDynamicResponse:q,incrementalCache:K,cacheLifeProfiles:m.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>O.onRequestError(e,t,i,n,I)},sharedContext:{buildId:S,deploymentId:D}},V=new c.NodeNextRequest(e),Y=new c.NodeNextResponse(t),J=E.NextRequestAdapter.fromNodeNextRequest(V,(0,E.signalFromNodeResponse)(t));try{let s,d=async e=>O.handle(J,j).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=W.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${P} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${P} ${i}`)}),l=async s=>{var r,l;let o=async({previousCacheEntry:n})=>{try{if(!G&&$&&b&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await d(s);e.fetchMetrics=j.renderOpts.fetchMetrics;let r=j.renderOpts.pendingWaitUntil;r&&a.waitUntil&&(a.waitUntil(r),r=void 0);let l=j.renderOpts.collectedTags;if(!w)return await (0,p.sendResponse)(V,Y,i,j.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[N.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==j.renderOpts.collectedRevalidate&&!(j.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&j.renderOpts.collectedRevalidate,n=void 0===j.renderOpts.collectedExpire||j.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:j.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,A.getRevalidateReason)({isStaticGeneration:x,isOnDemandRevalidate:$})},!1,I),t}},c=await O.handleResponse({req:e,nextConfig:m,cacheKey:F,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:$,revalidateOnlyGenerated:b,responseGenerator:o,waitUntil:a.waitUntil,isMinimalMode:G});if(!w)return null;if((null==c||null==(r=c.value)?void 0:r.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",$?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),L&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let E=(0,u.fromNodeOutgoingHttpHeaders)(c.value.headers);return G&&w||E.delete(N.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||E.get("Cache-Control")||E.set("Cache-Control",(0,C.getCacheControlHeader)(c.cacheControl)),await (0,p.sendResponse)(V,Y,new Response(c.value.body,{headers:E,status:c.value.status||200})),null};B&&k?await l(k):(s=W.getActiveScopeSpan(),await W.withPropagatedContext(e.headers,()=>W.trace(_.BaseServerSpan.handleRequest,{spanName:`${P} ${i}`,kind:r.SpanKind.SERVER,attributes:{"http.method":P,"http.target":e.url}},l),void 0,!B))}catch(t){if(t instanceof h.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,A.getRevalidateReason)({isStaticGeneration:x,isOnDemandRevalidate:$})},!1,I),w)throw t;return await (0,p.sendResponse)(V,Y,new Response(null,{status:500})),null}}e.s(["handler",0,f,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:T})},"routeModule",0,O,"serverHooks",0,L,"workAsyncStorage",0,m,"workUnitAsyncStorage",0,T]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_01rraml._.js.map