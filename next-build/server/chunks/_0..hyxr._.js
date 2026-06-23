module.exports=[532541,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),r=e.i(679504),o=e.i(57446),s=e.i(15270),d=t([n,r,o,s]);[n,r,o,s]=d.then?(await d)():d;let c=e=>String(e??"").trim(),p=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},E=e=>`${e}-${Date.now()}-${Math.floor(9e3*Math.random()+1e3)}`;async function l(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,r=new URL(e.url),o=p(r.searchParams.get("patientId")),d=c(r.searchParams.get("status")),l=c(r.searchParams.get("sourceModule")),u=c(r.searchParams.get("q")).toLowerCase(),E=u?`%${u}%`:null,_=await s.prisma.$queryRawUnsafe(`
    SELECT
      i.*,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      p.patient_uid,
      p.uhid,
      COUNT(ii.id)::int AS item_count
    FROM billing_invoices i
    LEFT JOIN patients p ON p.id=i.patient_id
    LEFT JOIN billing_invoice_items ii ON ii.invoice_id=i.id AND COALESCE(ii.is_deleted,false)=false
    WHERE i.tenant_id=$1
      AND i.hospital_id=$2
      AND i.branch_id=$3
      AND COALESCE(i.is_deleted,false)=false
      AND ($4::int IS NULL OR i.patient_id=$4::int)
      AND ($5::text = '' OR i.status=$5::text)
      AND ($7::text = '' OR i.source_module=$7::text OR i.invoice_type=$7::text)
      AND (
        $6::text IS NULL
        OR lower(i.invoice_number) LIKE $6::text
        OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $6::text
        OR lower(COALESCE(p.patient_uid,'')) LIKE $6::text
      )
    GROUP BY i.id,p.id
    ORDER BY i.created_at DESC
    LIMIT 300
    `,a.tenantId,a.hospitalId,a.branchId,o,d,E,l),R=_.reduce((e,t)=>{let a=c(t.status).toUpperCase(),i=Number(t.total||0),n=Number(t.paid_amount||0),r=Number(t.balance_amount??t.balance??0);return e.total+=i,e.paid+=n,e.balance+=r,"PAID"===a?e.paidCount+=1:"PARTIAL"===a?e.partialCount+=1:"CANCELLED"===a?e.cancelledCount+=1:"REFUNDED"===a?e.refundedCount+=1:e.pendingCount+=1,e},{total:0,paid:0,balance:0,pendingCount:0,paidCount:0,partialCount:0,cancelledCount:0,refundedCount:0});return i.NextResponse.json({invoices:_,summary:R})}async function u(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,d=await e.json(),l=c(d.action)||"invoice",u=p(d.invoiceId),_=p(d.patientId);if("payment"===l){if(!u||!_||!Number(d.amount))return i.NextResponse.json({error:"Invoice, patient, and amount are required."},{status:400});let e=await s.prisma.$queryRawUnsafe(`
      INSERT INTO payments (
        tenant_id,hospital_id,branch_id,clinic_id,
        invoice_id,patient_id,payment_number,payment_mode,
        payment_method,amount,payment_date,reference_number,
        remarks,received_by,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::varchar,$8::varchar,$9,CURRENT_DATE,$10,$11,$12,$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,u,_,E("PAY"),c(d.paymentMode)||"Cash",Number(d.amount),c(d.referenceNumber),c(d.remarks),a.user.id??null);await (0,o.recalculateInvoice)(u);let t=await s.prisma.$queryRawUnsafe(`
      SELECT *
      FROM billing_invoices
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      LIMIT 1
      `,u,a.tenantId,a.hospitalId,a.branchId),n=c(t[0]?.status).toUpperCase();return("PAID"===n||"PARTIAL"===n)&&await s.prisma.$executeRawUnsafe(`
        UPDATE lab_orders lo
        SET status = CASE
              WHEN $5::varchar = 'PAID' THEN 'BILL_PAID'
              ELSE lo.status
            END,
            updated_by = $6,
            updated_at = CURRENT_TIMESTAMP
        FROM billing_invoice_items ii
        WHERE ii.invoice_id = $1
          AND ii.item_type = 'LAB'
          AND ii.item_reference_id = lo.id
          AND lo.tenant_id = $2
          AND lo.hospital_id = $3
          AND lo.branch_id = $4
          AND COALESCE(ii.is_deleted,false) = false
          AND COALESCE(lo.is_deleted,false) = false
          AND lo.status IN ('DOCTOR_PRESCRIBED','ORDERED','BILL_GENERATED','PENDING_PAYMENT')
        `,u,a.tenantId,a.hospitalId,a.branchId,n,a.user.id??null),t[0]?.status==="PAID"&&await s.prisma.$executeRawUnsafe(`
        UPDATE appointments
        SET status = 'COMPLETED',
            queue_status = 'COMPLETED',
            updated_by = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE patient_id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
          AND COALESCE(is_deleted,false) = false
          AND status IN ('CONSULTATION_COMPLETED','AWAITING_BILLING','AWAITING_PAYMENT','LAB_COMPLETED')
        `,_,a.tenantId,a.hospitalId,a.branchId,a.user.id??null),await (0,o.createPatientTimelineEvent)(a,{patientId:_,eventType:"Payments",eventSource:"payments",sourceRecordId:Number(e[0].id),title:`Payment received: ${d.amount}`,description:`${d.paymentMode||"Cash"} payment posted for invoice ${u}.`}),await (0,r.queueClinicalWorkflowNotification)(a,{templateKey:"payment_received",patientId:_,invoiceId:u,sourceModule:"payments",sourceRecordId:Number(e[0].id),variables:{amount:Number(d.amount),payment_mode:d.paymentMode||"Cash",receipt_number:e[0].payment_number||e[0].receipt_number||e[0].id}}),i.NextResponse.json(e[0],{status:201})}if("refund"===l){if(!u||!_||!Number(d.amount))return i.NextResponse.json({error:"Invoice, patient, and refund amount are required."},{status:400});let e=await s.prisma.$queryRawUnsafe(`
      INSERT INTO refunds (
        tenant_id,hospital_id,branch_id,clinic_id,
        invoice_id,patient_id,refund_number,amount,refund_amount,
        reason,status,requested_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,'REQUESTED',$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,u,_,E("REF"),Number(d.amount),c(d.reason),a.user.id??null);return await (0,o.createPatientTimelineEvent)(a,{patientId:_,eventType:"Refunds",eventSource:"refunds",sourceRecordId:Number(e[0].id),title:`Refund requested: ${d.amount}`,description:c(d.reason)}),i.NextResponse.json(e[0],{status:201})}if(!_)return i.NextResponse.json({error:"Patient is required."},{status:400});let R=await s.prisma.$queryRawUnsafe(`
    INSERT INTO billing_invoices (
      tenant_id,hospital_id,branch_id,clinic_id,
      invoice_number,patient_id,visit_id,invoice_date,status,
      subtotal,discount,tax,total,paid_amount,balance_amount,balance,
      invoice_type,source_module,source_record_id,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,'OPEN',0,0,0,0,0,0,0,'PATIENT',$8,$9,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,E("INV"),_,p(d.visitId),c(d.sourceModule),p(d.sourceRecordId),a.user.id??null);return await (0,o.createPatientTimelineEvent)(a,{patientId:_,eventType:"Billing Events",eventSource:"billing_invoices",sourceRecordId:Number(R[0].id),title:`Invoice created: ${R[0].invoice_number}`,description:"Manual billing invoice created."}),await (0,r.queueClinicalWorkflowNotification)(a,{templateKey:"bill_generated",patientId:_,invoiceId:Number(R[0].id),sourceModule:"billing_invoices",sourceRecordId:Number(R[0].id),variables:{invoice_number:R[0].invoice_number||R[0].id,amount:R[0].total||0,department:c(d.sourceModule)||"Billing"}}),i.NextResponse.json(R[0],{status:201})}e.s(["GET",0,l,"POST",0,u]),a()}catch(e){a(e)}},!1),418134,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),o=e.i(759756),s=e.i(561916),d=e.i(174677),l=e.i(869741),u=e.i(316795),c=e.i(487718),p=e.i(995169),E=e.i(47587),_=e.i(666012),R=e.i(570101),m=e.i(626937),N=e.i(10372),h=e.i(193695);e.i(52474);var A=e.i(600220),I=e.i(532541),v=t([I]);[I]=v.then?(await v)():v;let T=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/billing/invoices/route",pathname:"/api/clinical/billing/invoices",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/billing/invoices/route.ts",nextConfigOutput:"",userland:I,...{}}),{workAsyncStorage:b,workUnitAsyncStorage:$,serverHooks:f}=T;async function C(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/billing/invoices/route";i=i.replace(/\/index$/,"")||"/";let r=await T.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:I,deploymentId:v,params:C,nextConfig:b,parsedUrl:$,isDraftMode:f,prerenderManifest:w,routerServerContext:y,isOnDemandRevalidate:S,revalidateOnlyGenerated:D,resolvedPathname:P,clientReferenceManifest:g,serverActionsManifest:O}=r,x=(0,l.normalizeAppPath)(i),M=!!(w.dynamicRoutes[x]||w.routes[P]),L=async()=>((null==y?void 0:y.render404)?await y.render404(e,t,$,!1):t.end("This page could not be found"),null);if(M&&!f){let e=!!w.routes[P],t=w.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(b.adapterPath)return await L();throw new h.NoFallbackError}}let U=null;!M||T.isDev||f||(U=P,U="/index"===U?"/":U);let q=!0===T.isDev||!M,H=M&&!q;O&&g&&(0,d.setManifestsSingleton)({page:i,clientReferenceManifest:g,serverActionsManifest:O});let k=e.method||"GET",B=(0,s.getTracer)(),F=B.getActiveScopeSpan(),j=!!(null==y?void 0:y.isWrappedByNextServer),G=!!(0,o.getRequestMeta)(e,"minimalMode"),K=(0,o.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,b,w,G);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let W={params:C,previewProps:w.preview,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:q,incrementalCache:K,cacheLifeProfiles:b.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>T.onRequestError(e,t,i,n,y)},sharedContext:{buildId:I,deploymentId:v}},V=new u.NodeNextRequest(e),Y=new u.NodeNextResponse(t),X=c.NextRequestAdapter.fromNodeNextRequest(V,(0,c.signalFromNodeResponse)(t));try{let r,o=async e=>T.handle(X,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=B.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${k} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${k} ${i}`)}),d=async r=>{var s,d;let l=async({previousCacheEntry:n})=>{try{if(!G&&S&&D&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(r);e.fetchMetrics=W.renderOpts.fetchMetrics;let s=W.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let d=W.renderOpts.collectedTags;if(!M)return await (0,_.sendResponse)(V,Y,i,W.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(i.headers);d&&(t[N.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,n=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})},!1,y),t}},u=await T.handleResponse({req:e,nextConfig:b,cacheKey:U,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:w,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:D,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:G});if(!M)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",S?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,R.fromNodeOutgoingHttpHeaders)(u.value.headers);return G&&M||c.delete(N.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,m.getCacheControlHeader)(u.cacheControl)),await (0,_.sendResponse)(V,Y,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};j&&F?await d(F):(r=B.getActiveScopeSpan(),await B.withPropagatedContext(e.headers,()=>B.trace(p.BaseServerSpan.handleRequest,{spanName:`${k} ${i}`,kind:s.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},d),void 0,!j))}catch(t){if(t instanceof h.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})},!1,y),M)throw t;return await (0,_.sendResponse)(V,Y,new Response(null,{status:500})),null}}e.s(["handler",0,C,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:$})},"routeModule",0,T,"serverHooks",0,f,"workAsyncStorage",0,b,"workUnitAsyncStorage",0,$]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0..hyxr._.js.map