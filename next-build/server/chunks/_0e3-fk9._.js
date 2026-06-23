module.exports=[73294,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(780907),s=e.i(679504),n=e.i(155876),l=e.i(15270),d=t([i,s,n,l]);[i,s,n,l]=d.then?(await d)():d;let p=e=>{if("boolean"==typeof e)return e;let t=(0,n.text)(e).toLowerCase();return!!["true","yes","y","1","critical"].includes(t)};async function o(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,{searchParams:s}=new URL(e.url),d=s.get("status"),o=await l.prisma.$queryRawUnsafe(`
    SELECT
      lo.*,
      p.patient_uid,
      p.uhid,
      p.phone,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      d.full_name AS doctor_name,
      lr.id AS result_id,
      lr.result_uid,
      lr.result_status,
      lr.result_data,
      lr.interpretation,
      lr.validated_at
    FROM lab_orders lo
    LEFT JOIN patients p ON p.id = lo.patient_id
    LEFT JOIN doctors d ON d.id = lo.doctor_id
    LEFT JOIN LATERAL (
      SELECT *
      FROM lab_results lrx
      WHERE lrx.lab_order_id = lo.id
        AND COALESCE(lrx.is_deleted,false) = false
      ORDER BY lrx.created_at DESC, lrx.id DESC
      LIMIT 1
    ) lr ON true
    WHERE lo.tenant_id = $1
      AND lo.hospital_id = $2
      AND lo.branch_id = $3
      AND COALESCE(lo.is_deleted,false) = false
      AND ($4::text IS NULL OR lo.status = $4)
    ORDER BY lo.ordered_at DESC, lo.id DESC
    LIMIT 250
    `,a.tenantId,a.hospitalId,a.branchId,d||null);return r.NextResponse.json((0,n.serialize)({rows:o}))}async function u(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,d=await e.json(),o=(0,n.toNumber)(d.lab_order_id),u=(0,n.text)(d.action);if(!o)return r.NextResponse.json({error:"Lab order is required."},{status:400});let E=(await l.prisma.$queryRawUnsafe(`
    SELECT *
    FROM lab_orders
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,o,a.tenantId,a.hospitalId,a.branchId))[0];if(!E)return r.NextResponse.json({error:"Lab order not found."},{status:404});if("SAMPLE_COLLECTED"===u||"COLLECTED"===u){let e=await l.prisma.$queryRawUnsafe(`
      UPDATE lab_orders
      SET status = 'SAMPLE_COLLECTED',
          notes = COALESCE($5, notes),
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,o,a.tenantId,a.hospitalId,a.branchId,(0,n.nullableText)(d.remarks),a.user.id??null);return await (0,n.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,n.toNumber)(E.appointment_id),workflowStage:"LAB",status:"SAMPLE_COLLECTED",summary:`Sample collected / scan completed for ${E.order_type||"lab order"}.`,sourceTable:"lab_orders",sourceId:o,metadata:e[0]}),await (0,i.recordClinicalAudit)(a,{moduleName:"lab_results",action:"sample_collected",entityType:"lab_orders",entityId:o,summary:"Lab sample collected",payload:e[0]}),r.NextResponse.json((0,n.serialize)(e[0]))}if("PROCESSING"===u){let e=await l.prisma.$queryRawUnsafe(`
      UPDATE lab_orders
      SET status = 'PROCESSING',
          notes = COALESCE($5, notes),
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,o,a.tenantId,a.hospitalId,a.branchId,(0,n.nullableText)(d.remarks),a.user.id??null);return await (0,n.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,n.toNumber)(E.appointment_id),workflowStage:"LAB",status:"PROCESSING",summary:`Lab processing started for ${E.order_type||"test"}.`,sourceTable:"lab_orders",sourceId:o,metadata:e[0]}),await (0,i.recordClinicalAudit)(a,{moduleName:"lab_results",action:"processing",entityType:"lab_orders",entityId:o,summary:"Lab processing started",payload:e[0]}),r.NextResponse.json((0,n.serialize)(e[0]))}let _=(await l.prisma.$queryRawUnsafe(`
    SELECT *
    FROM lab_results
    WHERE lab_order_id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    ORDER BY id DESC
    LIMIT 1
    `,o,a.tenantId,a.hospitalId,a.branchId))[0];if("VALIDATE"===u||"VALIDATED"===u){if(!_)return r.NextResponse.json({error:"Enter a lab result before validation."},{status:400});let e=await l.prisma.$queryRawUnsafe(`
      UPDATE lab_results
      SET result_status = 'VALIDATED',
          status = 'VALIDATED',
          validated_by = $5,
          validated_at = CURRENT_TIMESTAMP,
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,_.id,a.tenantId,a.hospitalId,a.branchId,a.user.id??null);return await l.prisma.$executeRawUnsafe(`
      UPDATE lab_orders
      SET status = 'VALIDATED',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,o,a.tenantId,a.hospitalId,a.branchId,a.user.id??null),await (0,n.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,n.toNumber)(E.appointment_id),workflowStage:"LAB",status:"VALIDATED",summary:`Lab result validated for ${E.order_type||"test"}.`,sourceTable:"lab_results",sourceId:Number(e[0].id),metadata:e[0]}),await (0,i.recordClinicalAudit)(a,{moduleName:"lab_results",action:"validate",entityType:"lab_results",entityId:Number(e[0].id),summary:"Lab result validated",payload:e[0]}),await (0,s.queueClinicalWorkflowNotification)(a,{templateKey:"lab_report_ready",patientId:Number(E.patient_id),appointmentId:(0,n.toNumber)(E.appointment_id),sourceModule:"lab_results",sourceRecordId:Number(e[0].id),variables:{lab_tests:E.order_type||"Lab test"}}),r.NextResponse.json((0,n.serialize)(e[0]))}if("APPROVE"===u||"APPROVED"===u){if(!_)return r.NextResponse.json({error:"Enter and validate a lab result before approval."},{status:400});let e=await l.prisma.$queryRawUnsafe(`
      UPDATE lab_results
      SET result_status = 'APPROVED',
          status = 'APPROVED',
          validated_by = COALESCE(validated_by, $5),
          validated_at = COALESCE(validated_at, CURRENT_TIMESTAMP),
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,_.id,a.tenantId,a.hospitalId,a.branchId,a.user.id??null);return await l.prisma.$executeRawUnsafe(`
      UPDATE lab_orders
      SET status = 'APPROVED',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,o,a.tenantId,a.hospitalId,a.branchId,a.user.id??null),await (0,n.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,n.toNumber)(E.appointment_id),workflowStage:"LAB",status:"APPROVED",summary:`Lab result approved for ${E.order_type||"test"}.`,sourceTable:"lab_results",sourceId:Number(e[0].id),metadata:e[0]}),await (0,i.recordClinicalAudit)(a,{moduleName:"lab_results",action:"approve",entityType:"lab_results",entityId:Number(e[0].id),summary:"Lab result approved",payload:e[0]}),r.NextResponse.json((0,n.serialize)(e[0]))}if("RELEASE"===u||"RESULT_READY"===u){if(!_)return r.NextResponse.json({error:"Enter and approve a lab result before release."},{status:400});let e=await l.prisma.$queryRawUnsafe(`
      UPDATE lab_results
      SET result_status = 'RELEASED',
          status = 'RELEASED',
          validated_by = COALESCE(validated_by, $5),
          validated_at = COALESCE(validated_at, CURRENT_TIMESTAMP),
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      RETURNING *
      `,_.id,a.tenantId,a.hospitalId,a.branchId,a.user.id??null);return await l.prisma.$executeRawUnsafe(`
      UPDATE lab_orders
      SET status = 'RELEASED',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,o,a.tenantId,a.hospitalId,a.branchId,a.user.id??null),await l.prisma.$executeRawUnsafe(`
      UPDATE appointments
      SET status = 'LAB_COMPLETED',
          queue_status = 'WAITING_FOR_DOCTOR_REVIEW',
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,E.appointment_id,a.tenantId,a.hospitalId,a.branchId,a.user.id??null),await (0,n.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,n.toNumber)(E.appointment_id),workflowStage:"LAB",status:"RELEASED",summary:`Lab result released for doctor review: ${E.order_type||"test"}.`,sourceTable:"lab_results",sourceId:Number(e[0].id),metadata:{whatsapp_template:"lab_report_ready",lab_order_id:o,result:e[0]}}),await (0,i.recordClinicalAudit)(a,{moduleName:"lab_results",action:"release",entityType:"lab_results",entityId:Number(e[0].id),summary:"Lab result released",payload:e[0]}),r.NextResponse.json((0,n.serialize)(e[0]))}let c={test_name:E.order_type,value:(0,n.text)(d.result_value),remarks:(0,n.nullableText)(d.remarks),attachments:Array.isArray(d.attachments)?d.attachments:[]},R=await l.prisma.$queryRawUnsafe(`
      INSERT INTO lab_results (
        tenant_id,hospital_id,branch_id,clinic_id,lab_order_id,patient_id,result_uid,
        result_status,result_data,interpretation,validated_by,validated_at,
        result_value,critical_value,entered_by,entered_at,status,
        created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,'ENTERED',$8::jsonb,$9,NULL,NULL,$10,$11,$12,CURRENT_TIMESTAMP,'ENTERED',$12,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,o,E.patient_id,`LABR-${Date.now()}`,JSON.stringify(c),(0,n.nullableText)(d.remarks),(0,n.nullableText)(d.result_value),p(d.critical_value),a.user.id??null);return await l.prisma.$executeRawUnsafe(`
    UPDATE lab_orders
    SET status = 'RESULT_ENTERED',
        result_value = $5,
        critical_value = $6,
        updated_by = $7,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,o,a.tenantId,a.hospitalId,a.branchId,(0,n.nullableText)(d.result_value),p(d.critical_value),a.user.id??null),await (0,n.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,n.toNumber)(E.appointment_id),workflowStage:"LAB",status:"RESULT_ENTERED",summary:`Lab result entered for ${E.order_type||"test"} and waiting for approval.`,sourceTable:"lab_results",sourceId:Number(R[0].id),metadata:{lab_order_id:o,result:R[0]}}),await (0,i.recordClinicalAudit)(a,{moduleName:"lab_results",action:"create",entityType:"lab_results",entityId:Number(R[0].id),summary:"Lab result entered",payload:R[0]}),r.NextResponse.json((0,n.serialize)(R[0]),{status:201})}e.s(["GET",0,o,"POST",0,u]),a()}catch(e){a(e)}},!1),260374,e=>e.a(async(t,a)=>{try{var r=e.i(747909),i=e.i(174017),s=e.i(996250),n=e.i(759756),l=e.i(561916),d=e.i(174677),o=e.i(869741),u=e.i(316795),p=e.i(487718),E=e.i(995169),_=e.i(47587),c=e.i(666012),R=e.i(570101),b=e.i(626937),A=e.i(10372),N=e.i(193695);e.i(52474);var T=e.i(600220),m=e.i(73294),I=t([m]);[m]=I.then?(await I)():I;let y=new r.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/clinical/operations/lab-results/route",pathname:"/api/clinical/operations/lab-results",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/operations/lab-results/route.ts",nextConfigOutput:"",userland:m,...{}}),{workAsyncStorage:$,workUnitAsyncStorage:C,serverHooks:w}=y;async function h(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),y.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/clinical/operations/lab-results/route";r=r.replace(/\/index$/,"")||"/";let s=await y.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:m,deploymentId:I,params:h,nextConfig:$,parsedUrl:C,isDraftMode:w,prerenderManifest:f,routerServerContext:D,isOnDemandRevalidate:S,revalidateOnlyGenerated:v,resolvedPathname:L,clientReferenceManifest:P,serverActionsManifest:U}=s,x=(0,o.normalizeAppPath)(r),O=!!(f.dynamicRoutes[x]||f.routes[L]),M=async()=>((null==D?void 0:D.render404)?await D.render404(e,t,C,!1):t.end("This page could not be found"),null);if(O&&!w){let e=!!f.routes[L],t=f.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if($.adapterPath)return await M();throw new N.NoFallbackError}}let g=null;!O||y.isDev||w||(g=L,g="/index"===g?"/":g);let q=!0===y.isDev||!O,k=O&&!q;U&&P&&(0,d.setManifestsSingleton)({page:r,clientReferenceManifest:P,serverActionsManifest:U});let H=e.method||"GET",W=(0,l.getTracer)(),j=W.getActiveScopeSpan(),B=!!(null==D?void 0:D.isWrappedByNextServer),V=!!(0,n.getRequestMeta)(e,"minimalMode"),F=(0,n.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,$,f,V);null==F||F.resetRequestCache(),globalThis.__incrementalCache=F;let G={params:h,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!$.experimental.authInterrupts},cacheComponents:!!$.cacheComponents,supportsDynamicResponse:q,incrementalCache:F,cacheLifeProfiles:$.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,i)=>y.onRequestError(e,t,r,i,D)},sharedContext:{buildId:m,deploymentId:I}},K=new u.NodeNextRequest(e),z=new u.NodeNextResponse(t),J=p.NextRequestAdapter.fromNodeNextRequest(K,(0,p.signalFromNodeResponse)(t));try{let s,n=async e=>y.handle(J,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=W.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==E.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",i),s.updateName(t))}else e.updateName(`${H} ${r}`)}),d=async s=>{var l,d;let o=async({previousCacheEntry:i})=>{try{if(!V&&S&&v&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await n(s);e.fetchMetrics=G.renderOpts.fetchMetrics;let l=G.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=G.renderOpts.collectedTags;if(!O)return await (0,c.sendResponse)(K,z,r,G.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(r.headers);d&&(t[A.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,i=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:T.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:S})},!1,D),t}},u=await y.handleResponse({req:e,nextConfig:$,cacheKey:g,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:v,responseGenerator:o,waitUntil:a.waitUntil,isMinimalMode:V});if(!O)return null;if((null==u||null==(l=u.value)?void 0:l.kind)!==T.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});V||t.setHeader("x-nextjs-cache",S?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,R.fromNodeOutgoingHttpHeaders)(u.value.headers);return V&&O||p.delete(A.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,b.getCacheControlHeader)(u.cacheControl)),await (0,c.sendResponse)(K,z,new Response(u.value.body,{headers:p,status:u.value.status||200})),null};B&&j?await d(j):(s=W.getActiveScopeSpan(),await W.withPropagatedContext(e.headers,()=>W.trace(E.BaseServerSpan.handleRequest,{spanName:`${H} ${r}`,kind:l.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},d),void 0,!B))}catch(t){if(t instanceof N.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:S})},!1,D),O)throw t;return await (0,c.sendResponse)(K,z,new Response(null,{status:500})),null}}e.s(["handler",0,h,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:$,workUnitAsyncStorage:C})},"routeModule",0,y,"serverHooks",0,w,"workAsyncStorage",0,$,"workUnitAsyncStorage",0,C]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0e3-fk9._.js.map