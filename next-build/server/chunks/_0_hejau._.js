module.exports=[306109,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),s=e.i(15270),d=t([n,s]);async function l(e,{params:t}){let a,d=await (0,n.requireClinicalContext)(e);if(d.response)return d.response;let r=d.context,{id:E}=await t,_=Number(E);if(!Number.isFinite(_))return i.NextResponse.json({error:"Valid patient id is required."},{status:400});let o=[_,r.tenantId,r.hospitalId,r.branchId],[D,p,c,A,R,C,u,N,S,$,f,h,O,L,m,T,I,y,M,b,w,v,U,g,q,H,F,B,W,Y,x,P,k,j,J,K,G,V,X,z]=await Promise.all([s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM patients
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      LIMIT 1
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM appointments
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY appointment_date DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM op_visits
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY visit_date DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM er_visits
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY arrival_time DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM ip_admissions
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY admission_date DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM icu_monitoring_records
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY recorded_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM ot_schedules
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY scheduled_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_ot_schedules
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY scheduled_date DESC NULLS LAST, scheduled_time DESC NULLS LAST, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM nursing_notes
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY note_time DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_vitals
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM medical_records
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT
        lo.*,
        d.full_name AS doctor_name,
        COALESCE(lt.lab_test_name, lt.test_name, lo.order_type) AS lab_test_name,
        COALESCE(lt.reference_range, lt.normal_value) AS reference_range,
        lt.unit AS result_unit
      FROM lab_orders lo
      LEFT JOIN doctors d ON d.id = lo.doctor_id
      LEFT JOIN clinical_lab_test_master lt
        ON lt.id = lo.lab_test_id
        AND lt.tenant_id = lo.tenant_id
        AND lt.hospital_id = lo.hospital_id
        AND lt.branch_id = lo.branch_id
        AND COALESCE(lt.is_deleted,false) = false
      WHERE lo.patient_id = $1
        AND lo.tenant_id = $2
        AND lo.hospital_id = $3
        AND lo.branch_id = $4
        AND COALESCE(lo.is_deleted,false) = false
      ORDER BY lo.ordered_at DESC, lo.id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
	      SELECT
	        lr.*,
	        lo.appointment_id,
	        lo.order_uid,
	        lo.order_type,
	        lo.status AS order_status,
	        COALESCE(lt.lab_test_name, lo.order_type) AS lab_test_name,
	        COALESCE(lt.unit, (lr.result_data ->> 'unit')) AS result_unit,
	        COALESCE(lt.reference_range, lt.normal_value, (lr.result_data ->> 'reference_range')) AS reference_range,
	        COALESCE(u.full_name, validator.full_name) AS released_by_name,
	        lr.validated_at AS released_at
	      FROM lab_results lr
	      LEFT JOIN lab_orders lo ON lo.id = lr.lab_order_id
	      LEFT JOIN clinical_lab_test_master lt
	        ON (
	          lt.id = lo.lab_test_id
	          OR lower(lt.lab_test_name) = lower(lo.order_type)
	        )
	        AND lt.tenant_id = lr.tenant_id
	        AND lt.hospital_id = lr.hospital_id
	        AND lt.branch_id = lr.branch_id
	        AND COALESCE(lt.is_deleted,false) = false
	      LEFT JOIN users u ON u.id = lr.updated_by
	      LEFT JOIN users validator ON validator.id = lr.validated_by
	      WHERE lr.patient_id = $1 AND lr.tenant_id = $2 AND lr.hospital_id = $3 AND lr.branch_id = $4 AND COALESCE(lr.is_deleted,false) = false
	      ORDER BY lr.created_at DESC, lr.id DESC
	      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM radiology_orders
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM radiology_reports
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM radiology_uploads
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY uploaded_at DESC NULLS LAST, created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM prescriptions
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM medical_documents
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM billing_invoices
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY invoice_date DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM billing_payments
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY payment_date DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM insurance_policies
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM insurance_claims
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY submission_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_referrals
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 20
      `,r.tenantId,r.hospitalId,r.branchId),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM ivf_cases
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM ivf_couples
      WHERE (female_patient_id = $1 OR male_patient_id = $1)
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT cyc.*
      FROM ivf_cycles cyc
      JOIN ivf_couples c ON c.id = cyc.couple_id
      WHERE (c.female_patient_id = $1 OR c.male_patient_id = $1)
        AND cyc.tenant_id = $2
        AND cyc.hospital_id = $3
        AND cyc.branch_id = $4
        AND COALESCE(cyc.is_deleted,false) = false
        AND COALESCE(c.is_deleted,false) = false
      ORDER BY cyc.start_date DESC NULLS LAST, cyc.id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT t.*
      FROM ivf_timeline t
      LEFT JOIN ivf_couples c ON c.id = t.couple_id
      WHERE (t.patient_id = $1 OR c.female_patient_id = $1 OR c.male_patient_id = $1)
        AND t.tenant_id = $2
        AND t.hospital_id = $3
        AND t.branch_id = $4
        AND COALESCE(t.is_deleted,false) = false
      ORDER BY t.created_at DESC, t.id DESC
      LIMIT 100
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM pharmacy_retail_sales
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY sale_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM pharmacy_ip_dispensing
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_pharmacy_dispenses
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM pharmacy_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_finance_ar_invoices
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY invoice_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_operational_payments
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY payment_date DESC NULLS LAST, created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_finance_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT fhir_id, resource_type, resource_status, resource, created_at, updated_at
      FROM clinical_interop_fhir_resources
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY updated_at DESC NULLS LAST, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_interop_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_patient_alerts
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_patient_timeline
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY event_time DESC, id DESC
      LIMIT 100
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_patient_workflow_events
      WHERE patient_id = $1 AND tenant_id = $2 AND hospital_id = $3 AND branch_id = $4 AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...o),s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_audit_events
      WHERE entity_type IN ('patient','appointment','op_visits','ip_admissions','billing_invoices')
        AND (
          entity_id = $1
          OR payload::text LIKE '%' || $1::text || '%'
        )
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...o)]);return D.length?i.NextResponse.json((a={context:r,patient:D[0],appointments:p,opVisits:c,erVisits:A,admissions:R,icuRecords:C,otSchedules:[...u,...N],nursingNotes:S,medicalRecords:$,vitals:f,labOrders:h,labResults:O,radiologyOrders:L,radiologyReports:m,radiologyUploads:T,prescriptions:I,documents:y,invoices:M,payments:b,insurancePolicies:w,insuranceClaims:v,referrals:U,ivfCases:g,ivfCouples:q,ivfCycles:H,ivfTimeline:F,pharmacySales:B,pharmacyDispensing:[...W,...Y],pharmacyTimeline:x,financeInvoices:P,operationalPayments:k,financeTimeline:j,interopResources:J,interopTimeline:K,alerts:G,timeline:[...V,...X.map(e=>({...e,event_type:e.workflow_stage,event_title:e.status,event_summary:e.summary})),...F,...x,...j,...K].sort((e,t)=>{let a=new Date(String(e.event_time||e.created_at||0)).getTime();return new Date(String(t.event_time||t.created_at||0)).getTime()-a}),audit:z},JSON.parse(JSON.stringify(a,(e,t)=>"bigint"==typeof t?Number(t):t)))):i.NextResponse.json({error:"Patient not found."},{status:404})}[n,s]=d.then?(await d)():d,e.s(["GET",0,l]),a()}catch(e){a(e)}},!1),262992,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),s=e.i(996250),d=e.i(759756),l=e.i(561916),r=e.i(174677),E=e.i(869741),_=e.i(316795),o=e.i(487718),D=e.i(995169),p=e.i(47587),c=e.i(666012),A=e.i(570101),R=e.i(626937),C=e.i(10372),u=e.i(193695);e.i(52474);var N=e.i(600220),S=e.i(306109),$=t([S]);[S]=$.then?(await $)():$;let h=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/hms/patient-360/[id]/route",pathname:"/api/clinical/hms/patient-360/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/hms/patient-360/[id]/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:O,workUnitAsyncStorage:L,serverHooks:m}=h;async function f(e,t,a){a.requestMeta&&(0,d.setRequestMeta)(e,a.requestMeta),h.isDev&&(0,d.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/hms/patient-360/[id]/route";i=i.replace(/\/index$/,"")||"/";let s=await h.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:S,deploymentId:$,params:f,nextConfig:O,parsedUrl:L,isDraftMode:m,prerenderManifest:T,routerServerContext:I,isOnDemandRevalidate:y,revalidateOnlyGenerated:M,resolvedPathname:b,clientReferenceManifest:w,serverActionsManifest:v}=s,U=(0,E.normalizeAppPath)(i),g=!!(T.dynamicRoutes[U]||T.routes[b]),q=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,L,!1):t.end("This page could not be found"),null);if(g&&!m){let e=!!T.routes[b],t=T.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(O.adapterPath)return await q();throw new u.NoFallbackError}}let H=null;!g||h.isDev||m||(H=b,H="/index"===H?"/":H);let F=!0===h.isDev||!g,B=g&&!F;v&&w&&(0,r.setManifestsSingleton)({page:i,clientReferenceManifest:w,serverActionsManifest:v});let W=e.method||"GET",Y=(0,l.getTracer)(),x=Y.getActiveScopeSpan(),P=!!(null==I?void 0:I.isWrappedByNextServer),k=!!(0,d.getRequestMeta)(e,"minimalMode"),j=(0,d.getRequestMeta)(e,"incrementalCache")||await h.getIncrementalCache(e,O,T,k);null==j||j.resetRequestCache(),globalThis.__incrementalCache=j;let J={params:f,previewProps:T.preview,renderOpts:{experimental:{authInterrupts:!!O.experimental.authInterrupts},cacheComponents:!!O.cacheComponents,supportsDynamicResponse:F,incrementalCache:j,cacheLifeProfiles:O.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>h.onRequestError(e,t,i,n,I)},sharedContext:{buildId:S,deploymentId:$}},K=new _.NodeNextRequest(e),G=new _.NodeNextResponse(t),V=o.NextRequestAdapter.fromNodeNextRequest(K,(0,o.signalFromNodeResponse)(t));try{let s,d=async e=>h.handle(V,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=Y.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==D.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${W} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${W} ${i}`)}),r=async s=>{var l,r;let E=async({previousCacheEntry:n})=>{try{if(!k&&y&&M&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await d(s);e.fetchMetrics=J.renderOpts.fetchMetrics;let l=J.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let r=J.renderOpts.collectedTags;if(!g)return await (0,c.sendResponse)(K,G,i,J.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,A.toNodeOutgoingHttpHeaders)(i.headers);r&&(t[C.NEXT_CACHE_TAGS_HEADER]=r),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=C.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,n=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=C.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await h.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:y})},!1,I),t}},_=await h.handleResponse({req:e,nextConfig:O,cacheKey:H,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:M,responseGenerator:E,waitUntil:a.waitUntil,isMinimalMode:k});if(!g)return null;if((null==_||null==(l=_.value)?void 0:l.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==_||null==(r=_.value)?void 0:r.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});k||t.setHeader("x-nextjs-cache",y?"REVALIDATED":_.isMiss?"MISS":_.isStale?"STALE":"HIT"),m&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let o=(0,A.fromNodeOutgoingHttpHeaders)(_.value.headers);return k&&g||o.delete(C.NEXT_CACHE_TAGS_HEADER),!_.cacheControl||t.getHeader("Cache-Control")||o.get("Cache-Control")||o.set("Cache-Control",(0,R.getCacheControlHeader)(_.cacheControl)),await (0,c.sendResponse)(K,G,new Response(_.value.body,{headers:o,status:_.value.status||200})),null};P&&x?await r(x):(s=Y.getActiveScopeSpan(),await Y.withPropagatedContext(e.headers,()=>Y.trace(D.BaseServerSpan.handleRequest,{spanName:`${W} ${i}`,kind:l.SpanKind.SERVER,attributes:{"http.method":W,"http.target":e.url}},r),void 0,!P))}catch(t){if(t instanceof u.NoFallbackError||await h.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:y})},!1,I),g)throw t;return await (0,c.sendResponse)(K,G,new Response(null,{status:500})),null}}e.s(["handler",0,f,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:L})},"routeModule",0,h,"serverHooks",0,m,"workAsyncStorage",0,O,"workUnitAsyncStorage",0,L]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0_hejau._.js.map