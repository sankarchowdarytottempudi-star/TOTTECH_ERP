module.exports=[858091,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),s=e.i(15270),r=t([n,s]);[n,s]=r.then?(await r)():r;let d=(e,t="")=>String(e??t).trim()||t,p=e=>String(e??"").trim()||null,u=e=>{let t=Number(e);return Number.isFinite(t)?t:0};async function l(e,...t){try{return await s.prisma.$queryRawUnsafe(e,...t)}catch(e){return console.error("[clinical-workboard] query failed",e),[]}}async function o(e,...t){let i=await l(e,...t);return u(i[0]?.value)}let _=(e,t,i)=>({id:`${e}-${d(t.id,"0")}`,...i});async function c(e){let t,i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let s=i.context,r=[s.tenantId,s.hospitalId,s.branchId],[c,m,E,h,A,N,C,R,y,b,f,v,O,S]=await Promise.all([l(`
      SELECT a.id, a.appointment_uid, a.appointment_date, a.start_time, a.status, a.queue_status,
        a.priority, a.token_number,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
        d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id = $1 AND a.hospital_id = $2 AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND COALESCE(a.is_deleted,false) = false
      ORDER BY a.start_time ASC NULLS LAST, a.id DESC
      LIMIT 12
      `,...r),l(`
      SELECT a.id, a.queue_status, a.priority, a.token_number, a.created_at,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1 AND a.hospital_id = $2 AND a.branch_id = $3
        AND a.appointment_date = CURRENT_DATE
        AND a.queue_status IN ('WAITING','CHECKED_IN','IN_CONSULTATION')
        AND COALESCE(a.is_deleted,false) = false
      ORDER BY a.created_at ASC
      LIMIT 12
      `,...r),o(`
      SELECT COUNT(*)::int AS value
      FROM patients
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND created_at::date = CURRENT_DATE
        AND COALESCE(is_deleted,false) = false
      `,...r),l(`
      SELECT ia.id, ia.admission_number, ia.admission_date, ia.expected_discharge, ia.status,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM ip_admissions ia
      LEFT JOIN patients p ON p.id = ia.patient_id
      WHERE ia.tenant_id = $1 AND ia.hospital_id = $2 AND ia.branch_id = $3
        AND ia.status IN ('ADMITTED','ACTIVE','OBSERVATION')
        AND COALESCE(ia.is_deleted,false) = false
      ORDER BY ia.admission_date DESC
      LIMIT 12
      `,...r),l(`
      SELECT ia.id, ia.admission_number, ia.expected_discharge, ia.status,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM ip_admissions ia
      LEFT JOIN patients p ON p.id = ia.patient_id
      WHERE ia.tenant_id = $1 AND ia.hospital_id = $2 AND ia.branch_id = $3
        AND (
          ia.status IN ('DISCHARGE_REQUESTED','PENDING_DISCHARGE')
          OR ia.expected_discharge <= CURRENT_DATE
        )
        AND COALESCE(ia.is_deleted,false) = false
      ORDER BY ia.expected_discharge ASC NULLS LAST
      LIMIT 12
      `,...r),l(`
      SELECT lo.id, lo.order_uid, lo.order_type, lo.priority, lo.status, lo.ordered_at,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM lab_orders lo
      LEFT JOIN patients p ON p.id = lo.patient_id
      WHERE lo.tenant_id = $1 AND lo.hospital_id = $2 AND lo.branch_id = $3
        AND lo.status IN ('ORDERED','PENDING','SAMPLE_COLLECTED','PROCESSING')
        AND COALESCE(lo.is_deleted,false) = false
      ORDER BY lo.ordered_at ASC NULLS LAST
      LIMIT 12
      `,...r),l(`
      SELECT lr.id, lr.result_uid, lr.result_status, lr.validated_at, lr.created_at,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM lab_results lr
      LEFT JOIN patients p ON p.id = lr.patient_id
      WHERE lr.tenant_id = $1 AND lr.hospital_id = $2 AND lr.branch_id = $3
        AND COALESCE(lr.result_status,'') IN ('COMPLETED','PENDING_REVIEW','PENDING_VERIFICATION')
        AND COALESCE(lr.is_deleted,false) = false
      ORDER BY lr.created_at ASC
      LIMIT 12
      `,...r),l(`
      SELECT ro.id, ro.order_number, ro.study_type, ro.priority, ro.order_status, ro.order_date,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM radiology_orders ro
      LEFT JOIN patients p ON p.id = ro.patient_id
      WHERE ro.tenant_id = $1 AND ro.hospital_id = $2 AND ro.branch_id = $3
        AND ro.order_status IN ('ORDERED','PENDING','SCHEDULED','IN_PROGRESS')
        AND COALESCE(ro.is_deleted,false) = false
      ORDER BY ro.order_date ASC NULLS LAST
      LIMIT 12
      `,...r),l(`
      SELECT ppq.id, ppq.queue_number, ppq.prescription_uid, ppq.patient_name,
        ppq.patient_mobile, ppq.status, ppq.created_at
      FROM pharmacy_prescription_queue ppq
      WHERE ppq.tenant_id = $1 AND ppq.hospital_id = $2 AND ppq.branch_id = $3
        AND ppq.status IN ('PENDING','READY','PARTIAL')
        AND COALESCE(ppq.is_deleted,false) = false
      ORDER BY ppq.created_at ASC
      LIMIT 12
      `,...r),l(`
      SELECT pi.id, pi.available_quantity, pi.inventory_status, pi.expiry_date,
        pi.medicine_id, pi.warehouse_id
      FROM pharmacy_inventory pi
      WHERE pi.tenant_id = $1 AND pi.hospital_id = $2 AND pi.branch_id = $3
        AND (
          COALESCE(pi.available_quantity,0) <= 5
          OR pi.inventory_status IN ('LOW_STOCK','OUT_OF_STOCK','NEAR_EXPIRY')
          OR pi.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
        )
        AND COALESCE(pi.is_deleted,false) = false
      ORDER BY pi.expiry_date ASC NULLS LAST, pi.available_quantity ASC
      LIMIT 12
      `,...r),l(`
      SELECT bi.id, bi.invoice_number, bi.total, bi.paid_amount, bi.balance_amount, bi.status, bi.invoice_date,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM billing_invoices bi
      LEFT JOIN patients p ON p.id = bi.patient_id
      WHERE bi.tenant_id = $1 AND bi.hospital_id = $2 AND bi.branch_id = $3
        AND COALESCE(bi.balance_amount,0) > 0
        AND COALESCE(bi.is_deleted,false) = false
      ORDER BY bi.invoice_date ASC NULLS LAST
      LIMIT 12
      `,...r),l(`
      SELECT cfc.id, cfc.claim_number, cfc.claim_amount, cfc.approved_amount, cfc.status, cfc.submitted_date,
        COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name
      FROM clinical_finance_claims cfc
      LEFT JOIN patients p ON p.id = cfc.patient_id
      WHERE cfc.tenant_id = $1 AND cfc.hospital_id = $2 AND cfc.branch_id = $3
        AND cfc.status IN ('DRAFT','PENDING','SUBMITTED','QUERY')
        AND COALESCE(cfc.is_deleted,false) = false
      ORDER BY cfc.submitted_date ASC NULLS LAST, cfc.created_at ASC
      LIMIT 12
      `,...r),o(`
      SELECT COALESCE(SUM(COALESCE(total,0)),0)::numeric AS value
      FROM billing_invoices
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND invoice_date = CURRENT_DATE
        AND COALESCE(is_deleted,false) = false
      `,...r),l(`
      SELECT id, module_name, action, entity_type, entity_id, summary, created_at
      FROM clinical_audit_events
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC
      LIMIT 14
      `,...r)]),I=[...m.map(e=>_("queue",e,{title:d(e.patient_name,"Waiting patient"),summary:`Token ${d(e.token_number,"-")} is ${d(e.queue_status,"waiting")}`,status:d(e.queue_status,"WAITING"),priority:d(e.priority,"NORMAL"),href:"/clinical-services/appointments",entityType:"appointment",entityId:u(e.id),dueAt:p(e.created_at)})),...A.map(e=>_("discharge",e,{title:`Discharge: ${d(e.patient_name,"Patient")}`,summary:`Admission ${d(e.admission_number,"-")} is ${d(e.status,"pending")}`,status:d(e.status,"PENDING"),priority:"HIGH",href:`/clinical-services/hms/ip/${e.id}`,entityType:"ip_admission",entityId:u(e.id),dueAt:p(e.expected_discharge)}))],D=[...c.map(e=>_("doctor-appointment",e,{title:d(e.patient_name,"Patient appointment"),summary:`${d(e.appointment_uid,"Appointment")} with ${d(e.doctor_name,"doctor")} at ${d(e.start_time,"-")}`,status:d(e.status,"SCHEDULED"),priority:d(e.priority,"NORMAL"),href:"/clinical-services/hms/op",entityType:"appointment",entityId:u(e.id),dueAt:p(e.appointment_date)})),...C.map(e=>_("lab-review",e,{title:`Review lab result ${d(e.result_uid,"")}`,summary:`${d(e.patient_name,"Patient")} result requires clinical review`,status:d(e.result_status,"PENDING_REVIEW"),priority:"HIGH",href:"/clinical-services/hms/lab-results",entityType:"lab_result",entityId:u(e.id),dueAt:p(e.created_at)}))],L=h.map(e=>_("nursing-admission",e,{title:d(e.patient_name,"Admitted patient"),summary:`Admission ${d(e.admission_number,"-")} needs vitals, medication and shift notes`,status:d(e.status,"ADMITTED"),priority:"HIGH",href:`/clinical-services/hms/ip/${e.id}`,entityType:"ip_admission",entityId:u(e.id),dueAt:p(e.expected_discharge)})),T=N.map(e=>_("lab-order",e,{title:d(e.order_uid,"Lab order"),summary:`${d(e.order_type,"Investigation")} for ${d(e.patient_name,"patient")}`,status:d(e.status,"PENDING"),priority:d(e.priority,"NORMAL"),href:"/clinical-services/hms/lab-orders",entityType:"lab_order",entityId:u(e.id),dueAt:p(e.ordered_at)})),g=[...y.map(e=>_("pharmacy-rx",e,{title:d(e.queue_number,"Prescription queue"),summary:`${d(e.patient_name,"Patient")} | ${d(e.prescription_uid,"Prescription")}`,status:d(e.status,"PENDING"),priority:"HIGH",href:"/clinical-services/pharmacy/sales",entityType:"pharmacy_queue",entityId:u(e.id),dueAt:p(e.created_at)})),...b.map(e=>_("stock",e,{title:`Inventory alert #${d(e.id)}`,summary:`Available ${d(e.available_quantity,"0")} | ${d(e.inventory_status,"stock review")}`,status:d(e.inventory_status,"LOW_STOCK"),priority:"HIGH",href:"/clinical-services/pharmacy/inventory",entityType:"pharmacy_inventory",entityId:u(e.id),dueAt:p(e.expiry_date)}))],$=[...f.map(e=>_("invoice",e,{title:d(e.invoice_number,"Unpaid invoice"),summary:`${d(e.patient_name,"Patient")} balance ${d(e.balance_amount,"0")}`,status:d(e.status,"PENDING"),priority:"HIGH",href:"/clinical-services/hms/billing",entityType:"billing_invoice",entityId:u(e.id),dueAt:p(e.invoice_date)})),...v.map(e=>_("claim",e,{title:d(e.claim_number,"Insurance claim"),summary:`${d(e.patient_name,"Patient")} claim ${d(e.claim_amount,"0")}`,status:d(e.status,"PENDING"),priority:"HIGH",href:"/clinical-services/finance/claims",entityType:"finance_claim",entityId:u(e.id),dueAt:p(e.submitted_date)}))],w=[...I.slice(0,4),...D.slice(0,4),...T.slice(0,4),...$.slice(0,4)],q={front_desk:{title:"Front Desk Workboard",question:"Which arrivals, registrations, admissions and billing handoffs need attention?",href:"/clinical-services/appointments",tasks:I,quickActions:[{label:"Register Patient",href:"/clinical-services/patients"},{label:"Book Appointment",href:"/clinical-services/appointments"},{label:"Open Queue",href:"/clinical-services/appointments"}]},doctor:{title:"Doctor Workboard",question:"Which patients should I consult, review or discharge next?",href:"/clinical-services/hms/op",tasks:D,quickActions:[{label:"Start OP Consultation",href:"/clinical-services/hms/op"},{label:"Review Lab Results",href:"/clinical-services/hms/lab-results"},{label:"Open Patient Search",href:"/clinical-services/patients"}]},nursing:{title:"Nursing Workboard",question:"Which admitted patients need vitals, medication or care-plan actions?",href:"/clinical-services/hms/ip",tasks:L,quickActions:[{label:"Open IP Admissions",href:"/clinical-services/hms/ip"},{label:"Open ICU",href:"/clinical-services/hms/icu"},{label:"Patient Search",href:"/clinical-services/patients"}]},lab:{title:"Laboratory Workboard",question:"Which samples, orders and reports are blocking clinical decisions?",href:"/clinical-services/hms/lab-orders",tasks:T,quickActions:[{label:"Pending Lab Orders",href:"/clinical-services/hms/lab-orders"},{label:"Lab Results",href:"/clinical-services/hms/lab-results"},{label:"Reports",href:"/clinical-services/reports"}]},pharmacy:{title:"Pharmacy Workboard",question:"Which prescriptions, low-stock items and expiry risks need action?",href:"/clinical-services/pharmacy",tasks:g,quickActions:[{label:"Dispense Prescription",href:"/clinical-services/pharmacy/sales"},{label:"Inventory",href:"/clinical-services/pharmacy/inventory"},{label:"Purchases",href:"/clinical-services/pharmacy/purchases"}]},billing:{title:"Billing Workboard",question:"Which bills, collections and insurance claims are holding revenue?",href:"/clinical-services/hms/billing",tasks:$,quickActions:[{label:"Create Invoice",href:"/clinical-services/hms/billing"},{label:"Post Payment",href:"/clinical-services/finance/cash"},{label:"Claims",href:"/clinical-services/finance/claims"}]},administration:{title:"Hospital Operations Workboard",question:"What needs attention across patient access, clinical care and revenue?",href:"/clinical-services",tasks:w,quickActions:[{label:"Register Patient",href:"/clinical-services/patients"},{label:"Book Appointment",href:"/clinical-services/appointments"},{label:"Create Invoice",href:"/clinical-services/hms/billing"},{label:"Reports",href:"/clinical-services/reports"}]}},P=q[(t=s.roleKey.toLowerCase()).includes("doctor")||t.includes("consultant")?"doctor":t.includes("nurse")||t.includes("ward")?"nursing":t.includes("lab")?"lab":t.includes("pharma")?"pharmacy":t.includes("bill")||t.includes("finance")||t.includes("cash")?"billing":t.includes("reception")||t.includes("front")?"front_desk":"administration"]||q.administration;return a.NextResponse.json({context:{tenantId:s.tenantId,hospitalId:s.hospitalId,branchId:s.branchId,clinicId:s.clinicId,hospitalName:s.hospitalName,branchName:s.branchName,clinicName:s.clinicName,roleKey:s.roleKey,roleName:s.roleName},metrics:{appointmentsToday:c.length,waitingQueue:m.length,registeredToday:E,activeAdmissions:h.length,pendingDischarges:A.length,pendingLabOrders:N.length,labResultsToReview:C.length,pendingRadiology:R.length,pendingPharmacy:y.length,lowStock:b.length,unpaidInvoices:f.length,pendingClaims:v.length,todayRevenue:O},roleWorkboard:P,workboards:q,activityFeed:S.map(e=>({id:e.id,title:d(e.summary,d(e.action,"Audit event")),summary:`${d(e.module_name,"Clinical")} | ${d(e.entity_type,"record")} ${d(e.entity_id,"")}`,action:e.action,moduleName:e.module_name,entityType:e.entity_type,entityId:e.entity_id,createdAt:e.created_at,href:"patient"===e.entity_type&&e.entity_id?`/clinical-services/patients/${e.entity_id}`:"/clinical-services/security/audit-logs"}))})}e.s(["GET",0,c]),i()}catch(e){i(e)}},!1),105626,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),s=e.i(996250),r=e.i(759756),l=e.i(561916),o=e.i(174677),c=e.i(869741),d=e.i(316795),p=e.i(487718),u=e.i(995169),_=e.i(47587),m=e.i(666012),E=e.i(570101),h=e.i(626937),A=e.i(10372),N=e.i(193695);e.i(52474);var C=e.i(600220),R=e.i(858091),y=t([R]);[R]=y.then?(await y)():y;let f=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/workboard/route",pathname:"/api/clinical/workboard",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/workboard/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:O,serverHooks:S}=f;async function b(e,t,i){i.requestMeta&&(0,r.setRequestMeta)(e,i.requestMeta),f.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/workboard/route";a=a.replace(/\/index$/,"")||"/";let s=await f.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:R,deploymentId:y,params:b,nextConfig:v,parsedUrl:O,isDraftMode:S,prerenderManifest:I,routerServerContext:D,isOnDemandRevalidate:L,revalidateOnlyGenerated:T,resolvedPathname:g,clientReferenceManifest:$,serverActionsManifest:w}=s,q=(0,c.normalizeAppPath)(a),P=!!(I.dynamicRoutes[q]||I.routes[g]),k=async()=>((null==D?void 0:D.render404)?await D.render404(e,t,O,!1):t.end("This page could not be found"),null);if(P&&!S){let e=!!I.routes[g],t=I.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(v.adapterPath)return await k();throw new N.NoFallbackError}}let H=null;!P||f.isDev||S||(H=g,H="/index"===H?"/":H);let M=!0===f.isDev||!P,x=P&&!M;w&&$&&(0,o.setManifestsSingleton)({page:a,clientReferenceManifest:$,serverActionsManifest:w});let U=e.method||"GET",F=(0,l.getTracer)(),W=F.getActiveScopeSpan(),G=!!(null==D?void 0:D.isWrappedByNextServer),B=!!(0,r.getRequestMeta)(e,"minimalMode"),K=(0,r.getRequestMeta)(e,"incrementalCache")||await f.getIncrementalCache(e,v,I,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let Y={params:b,previewProps:I.preview,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:M,incrementalCache:K,cacheLifeProfiles:v.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>f.onRequestError(e,t,a,n,D)},sharedContext:{buildId:R,deploymentId:y}},J=new d.NodeNextRequest(e),V=new d.NodeNextResponse(t),j=p.NextRequestAdapter.fromNodeNextRequest(J,(0,p.signalFromNodeResponse)(t));try{let s,r=async e=>f.handle(j,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=F.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${U} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${U} ${a}`)}),o=async s=>{var l,o;let c=async({previousCacheEntry:n})=>{try{if(!B&&L&&T&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await r(s);e.fetchMetrics=Y.renderOpts.fetchMetrics;let l=Y.renderOpts.pendingWaitUntil;l&&i.waitUntil&&(i.waitUntil(l),l=void 0);let o=Y.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(J,V,a,Y.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(a.headers);o&&(t[A.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,n=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:x,isOnDemandRevalidate:L})},!1,D),t}},d=await f.handleResponse({req:e,nextConfig:v,cacheKey:H,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:L,revalidateOnlyGenerated:T,responseGenerator:c,waitUntil:i.waitUntil,isMinimalMode:B});if(!P)return null;if((null==d||null==(l=d.value)?void 0:l.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(o=d.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",L?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,E.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&P||p.delete(A.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,h.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(J,V,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};G&&W?await o(W):(s=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${U} ${a}`,kind:l.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},o),void 0,!G))}catch(t){if(t instanceof N.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:x,isOnDemandRevalidate:L})},!1,D),P)throw t;return await (0,m.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,b,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:O})},"routeModule",0,f,"serverHooks",0,S,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,O]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=_0~4msce._.js.map