module.exports=[823231,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),s=e.i(15270),d=t([n,s]);[n,s]=d.then?(await d)():d;let r=async(e,...t)=>{try{return await s.prisma.$queryRawUnsafe(e,...t)}catch(e){return console.error("[clinical-enterprise-command-center] query failed",e),[]}},E=async(e,...t)=>(await r(e,...t))[0]||{};async function l(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,s=[a.tenantId,a.hospitalId,a.branchId],[d,l,o,_,c,p,A,u,C,S,N,R,O,m,D,L,h,b,T]=await Promise.all([E(`
      SELECT
        COALESCE(SUM(total) FILTER (WHERE invoice_date = CURRENT_DATE),0)::numeric AS today_revenue,
        COALESCE(SUM(total) FILTER (WHERE date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)),0)::numeric AS monthly_revenue,
        COALESCE(SUM(balance_amount),0)::numeric AS outstanding_amount,
        COUNT(*) FILTER (WHERE COALESCE(balance_amount,0) > 0)::int AS pending_payments,
        COUNT(*) FILTER (WHERE status IN ('REFUNDED','CANCELLED'))::int AS refunds,
        COALESCE(SUM(paid_amount),0)::numeric AS collection_efficiency_value,
        CASE WHEN COALESCE(SUM(total),0) > 0
          THEN ROUND((COALESCE(SUM(paid_amount),0) / NULLIF(SUM(total),0)) * 100, 2)
          ELSE 0
        END AS collection_efficiency
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      `,...s),r(`
      SELECT invoice_date::date AS label, COALESCE(SUM(total),0)::numeric AS value, '/clinical-services/finance?date=' || invoice_date::date AS href
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND invoice_date >= CURRENT_DATE - INTERVAL '14 days'
        AND COALESCE(is_deleted,false)=false
      GROUP BY invoice_date
      ORDER BY invoice_date
      `,...s),r(`
      SELECT COALESCE(d.department_name, bi.source_module, bi.invoice_type, 'Unassigned') AS label,
        COALESCE(SUM(bi.total),0)::numeric AS value,
        '/clinical-services/finance?department=' || COALESCE(d.id::text,'unassigned') AS href
      FROM billing_invoices bi
      LEFT JOIN departments d ON d.id=bi.department_id
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.is_deleted,false)=false
      GROUP BY d.id, d.department_name, bi.source_module, bi.invoice_type
      ORDER BY value DESC
      LIMIT 8
      `,...s),r(`
      SELECT COALESCE(u.full_name, d.full_name, 'Unassigned') AS label,
        COALESCE(SUM(bi.total),0)::numeric AS value,
        '/clinical-services/doctors' AS href
      FROM billing_invoices bi
      LEFT JOIN appointments a ON a.id=bi.source_record_id AND bi.source_module IN ('appointments','consultation','consultations')
      LEFT JOIN doctors d ON d.id=a.doctor_id
      LEFT JOIN users u ON u.id=bi.created_by
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.is_deleted,false)=false
      GROUP BY COALESCE(u.full_name, d.full_name, 'Unassigned')
      ORDER BY value DESC
      LIMIT 8
      `,...s),r(`
      SELECT COALESCE(source_module, invoice_type, 'General') AS label,
        COALESCE(SUM(total),0)::numeric AS value,
        '/clinical-services/finance?service=' || COALESCE(source_module, invoice_type, 'General') AS href
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      GROUP BY COALESCE(source_module, invoice_type, 'General')
      ORDER BY value DESC
      LIMIT 8
      `,...s),r(`
      SELECT payment_date::date AS label,
        COALESCE(SUM(amount),0)::numeric AS value,
        '/clinical-services/finance?collection_date=' || payment_date::date AS href
      FROM payments
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND payment_date::date >= CURRENT_DATE - INTERVAL '14 days'
      GROUP BY payment_date::date
      ORDER BY payment_date::date
      `,...s),r(`
      SELECT bi.id, bi.invoice_number, bi.invoice_date, bi.total, bi.paid_amount, bi.balance_amount, bi.status,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
      FROM billing_invoices bi
      LEFT JOIN patients p ON p.id=bi.patient_id
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.is_deleted,false)=false
      ORDER BY bi.created_at DESC
      LIMIT 20
      `,...s),r(`
      SELECT pay.id, pay.payment_number, pay.payment_date, pay.payment_mode, pay.payment_method, pay.amount, pay.reference_number,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        bi.invoice_number
      FROM payments pay
      LEFT JOIN patients p ON p.id=pay.patient_id
      LEFT JOIN billing_invoices bi ON bi.id=pay.invoice_id
      WHERE pay.tenant_id=$1 AND pay.hospital_id=$2 AND pay.branch_id=$3
        AND COALESCE(pay.is_deleted,false)=false
      ORDER BY pay.payment_date DESC NULLS LAST, pay.id DESC
      LIMIT 20
      `,...s),r(`
      SELECT bi.id, bi.invoice_number, bi.invoice_date, bi.total, bi.paid_amount, bi.balance_amount, bi.status,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
      FROM billing_invoices bi
      LEFT JOIN patients p ON p.id=bi.patient_id
      WHERE bi.tenant_id=$1 AND bi.hospital_id=$2 AND bi.branch_id=$3
        AND COALESCE(bi.balance_amount,0) > 0
        AND COALESCE(bi.is_deleted,false)=false
      ORDER BY bi.invoice_date ASC NULLS LAST, bi.id DESC
      LIMIT 20
      `,...s),r(`
      SELECT id, refund_number, amount, reason, status, created_at
      FROM billing_refunds
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 20
      `,...s),r(`
      SELECT id, claim_number, claim_amount, approved_amount, settled_amount, status, submitted_date
      FROM clinical_finance_claims
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY submitted_date DESC NULLS LAST, id DESC
      LIMIT 20
      `,...s),r(`
      SELECT id, patient_id, event_type, event_title, event_summary, source_table, source_id, event_time, created_at,
        COALESCE(source_table, 'Hospital') AS department_name,
        created_by
      FROM clinical_patient_timeline
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
      ORDER BY COALESCE(event_time, created_at) DESC
      LIMIT 40
      `,...s),r(`
      SELECT q.id, q.queue_number, q.prescription_uid, q.patient_name, q.status, q.created_at,
        pr.prescription_uid AS prescription_number
      FROM pharmacy_prescription_queue q
      LEFT JOIN prescriptions pr ON pr.id=q.prescription_id
      WHERE q.tenant_id=$1 AND q.hospital_id=$2 AND q.branch_id=$3
        AND COALESCE(q.is_deleted,false)=false
      ORDER BY q.created_at DESC
      LIMIT 20
      `,...s),r(`
      SELECT a.id, a.asset_number, a.asset_name, a.category, a.purchase_date, a.purchase_cost, a.current_value, a.status, a.location,
        d.department_name
      FROM clinical_finance_assets a
      LEFT JOIN departments d ON d.id=a.department_id
      WHERE a.tenant_id=$1 AND a.hospital_id=$2 AND a.branch_id=$3
        AND COALESCE(a.is_deleted,false)=false
      ORDER BY a.updated_at DESC NULLS LAST, a.id DESC
      LIMIT 30
      `,...s),r(`
      SELECT id, asset_number, asset_name, category, status, purchase_date, location
      FROM clinical_finance_assets
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND (
          status IN ('REPAIR','LOST','DISPOSED')
          OR (purchase_date IS NOT NULL AND purchase_date <= CURRENT_DATE - INTERVAL '330 days')
        )
      ORDER BY status, purchase_date ASC NULLS LAST
      LIMIT 12
      `,...s),r(`
      SELECT a.id, a.module_name, a.action, a.entity_type, a.entity_id, a.summary, a.created_at,
        u.full_name AS user_name
      FROM clinical_audit_events a
      LEFT JOIN users u ON u.id=a.user_id
      WHERE a.tenant_id=$1 AND a.hospital_id=$2 AND a.branch_id=$3
        AND COALESCE(a.is_deleted,false)=false
      ORDER BY a.created_at DESC
      LIMIT 30
      `,...s),E(`
      SELECT
        (SELECT COUNT(*)::int FROM hospitals WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_hospitals,
        (SELECT COUNT(*)::int FROM patients WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_patients,
        (SELECT COUNT(*)::int FROM doctors WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_doctors,
        (SELECT COUNT(*)::int FROM appointments WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_consultations,
        (SELECT COALESCE(SUM(total),0)::numeric FROM billing_invoices WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_revenue,
        (SELECT COUNT(*)::int FROM lab_orders WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_lab_tests,
        (SELECT COUNT(*)::int FROM prescriptions WHERE tenant_id=$1 AND COALESCE(is_deleted,false)=false) AS total_prescriptions
      `,a.tenantId),r(`
      SELECT h.id, h.hospital_name AS label,
        COALESCE(SUM(bi.total),0)::numeric AS value,
        COUNT(DISTINCT p.id)::int AS patient_count,
        COUNT(DISTINCT a.id)::int AS consultation_count,
        '/clinical-services/platform-hospitals' AS href
      FROM hospitals h
      LEFT JOIN billing_invoices bi ON bi.hospital_id=h.id AND COALESCE(bi.is_deleted,false)=false
      LEFT JOIN patients p ON p.hospital_id=h.id AND COALESCE(p.is_deleted,false)=false
      LEFT JOIN appointments a ON a.hospital_id=h.id AND COALESCE(a.is_deleted,false)=false
      WHERE h.tenant_id=$1 AND COALESCE(h.is_deleted,false)=false
      GROUP BY h.id, h.hospital_name
      ORDER BY value DESC
      LIMIT 10
      `,a.tenantId),E(`
      SELECT
        (SELECT COUNT(*)::int FROM patients WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND created_at::date=CURRENT_DATE AND COALESCE(is_deleted,false)=false) AS patients_today,
        (SELECT COALESCE(SUM(total),0)::numeric FROM billing_invoices WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND invoice_date=CURRENT_DATE AND COALESCE(is_deleted,false)=false) AS revenue_today,
        (SELECT COUNT(*)::int FROM ip_admissions WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('ADMITTED','ACTIVE') AND COALESCE(is_deleted,false)=false) AS admissions,
        (SELECT COUNT(*)::int FROM discharges WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND discharge_date=CURRENT_DATE AND COALESCE(is_deleted,false)=false) AS discharges,
        (SELECT COUNT(*)::int FROM lab_orders WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('ORDERED','COLLECTED','PROCESSING','RESULT_ENTERED','VALIDATED','APPROVED') AND COALESCE(is_deleted,false)=false) AS pending_labs,
        (SELECT COUNT(*)::int FROM pharmacy_prescription_queue WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('PENDING','PARTIAL') AND COALESCE(is_deleted,false)=false) AS pending_prescriptions,
        (SELECT COUNT(*)::int FROM bed_allocations WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status IN ('OCCUPIED','ACTIVE') AND COALESCE(is_deleted,false)=false) AS bed_occupancy,
        (SELECT COUNT(*)::int FROM doctors WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3 AND status='AVAILABLE' AND COALESCE(is_deleted,false)=false) AS doctor_utilization
      `,...s)]),f=await r(`
    SELECT COALESCE(payment_mode, payment_method, 'Unspecified') AS label,
      COALESCE(SUM(amount),0)::numeric AS value,
      '/clinical-services/finance?payment_mode=' || COALESCE(payment_mode, payment_method, 'Unspecified') AS href
    FROM payments
    WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND payment_date::date = CURRENT_DATE
    GROUP BY COALESCE(payment_mode, payment_method, 'Unspecified')
    ORDER BY value DESC
    `,...s);return i.NextResponse.json({context:a,revenue:d,cashByMode:f,revenueTrend:l,revenueByDepartment:o,revenueByDoctor:_,revenueByService:c,collectionTrend:p,invoices:A,payments:u,pendingDues:C,refunds:S,claims:N,patientJourney:R,prescriptionQueue:O,assets:m,assetAlerts:D,auditEvents:L,globalMetrics:h,hospitalComparison:b,executive:T})}e.s(["GET",0,l]),a()}catch(e){a(e)}},!1),187400,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),s=e.i(996250),d=e.i(759756),l=e.i(561916),r=e.i(174677),E=e.i(869741),o=e.i(316795),_=e.i(487718),c=e.i(995169),p=e.i(47587),A=e.i(666012),u=e.i(570101),C=e.i(626937),S=e.i(10372),N=e.i(193695);e.i(52474);var R=e.i(600220),O=e.i(823231),m=t([O]);[O]=m.then?(await m)():m;let L=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/enterprise-command-center/route",pathname:"/api/clinical/enterprise-command-center",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/enterprise-command-center/route.ts",nextConfigOutput:"",userland:O,...{}}),{workAsyncStorage:h,workUnitAsyncStorage:b,serverHooks:T}=L;async function D(e,t,a){a.requestMeta&&(0,d.setRequestMeta)(e,a.requestMeta),L.isDev&&(0,d.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/enterprise-command-center/route";i=i.replace(/\/index$/,"")||"/";let s=await L.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:O,deploymentId:m,params:D,nextConfig:h,parsedUrl:b,isDraftMode:T,prerenderManifest:f,routerServerContext:v,isOnDemandRevalidate:y,revalidateOnlyGenerated:I,resolvedPathname:$,clientReferenceManifest:U,serverActionsManifest:M}=s,g=(0,E.normalizeAppPath)(i),F=!!(f.dynamicRoutes[g]||f.routes[$]),H=async()=>((null==v?void 0:v.render404)?await v.render404(e,t,b,!1):t.end("This page could not be found"),null);if(F&&!T){let e=!!f.routes[$],t=f.dynamicRoutes[g];if(t&&!1===t.fallback&&!e){if(h.adapterPath)return await H();throw new N.NoFallbackError}}let w=null;!F||L.isDev||T||(w=$,w="/index"===w?"/":w);let W=!0===L.isDev||!F,P=F&&!W;M&&U&&(0,r.setManifestsSingleton)({page:i,clientReferenceManifest:U,serverActionsManifest:M});let q=e.method||"GET",x=(0,l.getTracer)(),B=x.getActiveScopeSpan(),Y=!!(null==v?void 0:v.isWrappedByNextServer),G=!!(0,d.getRequestMeta)(e,"minimalMode"),J=(0,d.getRequestMeta)(e,"incrementalCache")||await L.getIncrementalCache(e,h,f,G);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let k={params:D,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!h.experimental.authInterrupts},cacheComponents:!!h.cacheComponents,supportsDynamicResponse:W,incrementalCache:J,cacheLifeProfiles:h.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>L.onRequestError(e,t,i,n,v)},sharedContext:{buildId:O,deploymentId:m}},V=new o.NodeNextRequest(e),j=new o.NodeNextResponse(t),K=_.NextRequestAdapter.fromNodeNextRequest(V,(0,_.signalFromNodeResponse)(t));try{let s,d=async e=>L.handle(K,k).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=x.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${q} ${i}`)}),r=async s=>{var l,r;let E=async({previousCacheEntry:n})=>{try{if(!G&&y&&I&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await d(s);e.fetchMetrics=k.renderOpts.fetchMetrics;let l=k.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let r=k.renderOpts.collectedTags;if(!F)return await (0,A.sendResponse)(V,j,i,k.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(i.headers);r&&(t[S.NEXT_CACHE_TAGS_HEADER]=r),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==k.renderOpts.collectedRevalidate&&!(k.renderOpts.collectedRevalidate>=S.INFINITE_CACHE)&&k.renderOpts.collectedRevalidate,n=void 0===k.renderOpts.collectedExpire||k.renderOpts.collectedExpire>=S.INFINITE_CACHE?void 0:k.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await L.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:y})},!1,v),t}},o=await L.handleResponse({req:e,nextConfig:h,cacheKey:w,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:I,responseGenerator:E,waitUntil:a.waitUntil,isMinimalMode:G});if(!F)return null;if((null==o||null==(l=o.value)?void 0:l.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==o||null==(r=o.value)?void 0:r.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",y?"REVALIDATED":o.isMiss?"MISS":o.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let _=(0,u.fromNodeOutgoingHttpHeaders)(o.value.headers);return G&&F||_.delete(S.NEXT_CACHE_TAGS_HEADER),!o.cacheControl||t.getHeader("Cache-Control")||_.get("Cache-Control")||_.set("Cache-Control",(0,C.getCacheControlHeader)(o.cacheControl)),await (0,A.sendResponse)(V,j,new Response(o.value.body,{headers:_,status:o.value.status||200})),null};Y&&B?await r(B):(s=x.getActiveScopeSpan(),await x.withPropagatedContext(e.headers,()=>x.trace(c.BaseServerSpan.handleRequest,{spanName:`${q} ${i}`,kind:l.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},r),void 0,!Y))}catch(t){if(t instanceof N.NoFallbackError||await L.onRequestError(e,t,{routerKind:"App Router",routePath:g,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:y})},!1,v),F)throw t;return await (0,A.sendResponse)(V,j,new Response(null,{status:500})),null}}e.s(["handler",0,D,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:b})},"routeModule",0,L,"serverHooks",0,T,"workAsyncStorage",0,h,"workUnitAsyncStorage",0,b]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0s51ptd._.js.map