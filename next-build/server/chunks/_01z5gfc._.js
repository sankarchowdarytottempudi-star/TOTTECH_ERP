module.exports=[395484,e=>{"use strict";e.s(["BP_VALIDATION_MESSAGE",0,"Please enter a valid blood pressure value","parseBloodPressure",0,function(e){let t=e.trim().match(/^(\d{2,3})\/(\d{1,3})$/);if(!t)return null;let a=Number(t[1]),i=Number(t[2]);return!Number.isFinite(a)||!Number.isFinite(i)||a<50||a>300||i<30||i>200?null:{bloodPressure:`${a}/${i}`,systolicBp:a,diastolicBp:i}}])},948588,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),r=e.i(395484),s=e.i(679504),o=e.i(155876),l=e.i(15270),d=t([n,s,o,l]);async function u(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,r=await l.prisma.$queryRawUnsafe(`
    SELECT
      a.*,
      p.patient_uid,
      p.uhid,
      p.phone,
      p.gender,
      p.age_years,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      d.full_name AS doctor_name,
      v.id AS vitals_id,
      v.blood_pressure,
      v.systolic_bp,
      v.diastolic_bp,
      v.weight,
      v.height,
      v.temperature,
      v.spo2,
      v.pulse,
      v.respiration,
      v.bmi,
      v.notes AS vitals_notes,
      CASE
        WHEN v.id IS NOT NULL THEN 'COMPLETED_VITALS'
        WHEN a.queue_status IN ('WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION') OR a.status IN ('VITALS_COMPLETED','READY_FOR_CONSULTATION') THEN 'READY_FOR_DOCTOR'
        ELSE 'WAITING_FOR_VITALS'
      END AS vitals_queue_bucket
    FROM appointments a
    LEFT JOIN patients p ON p.id = a.patient_id
    LEFT JOIN doctors d ON d.id = a.doctor_id
    LEFT JOIN LATERAL (
      SELECT *
      FROM clinical_vitals cv
      WHERE cv.appointment_id = a.id
        AND COALESCE(cv.is_deleted,false) = false
      ORDER BY cv.created_at DESC, cv.id DESC
      LIMIT 1
    ) v ON true
    WHERE a.tenant_id = $1
      AND a.hospital_id = $2
      AND a.branch_id = $3
      AND a.appointment_date = CURRENT_DATE
      AND COALESCE(a.is_deleted,false) = false
      AND (
        a.status IN ('BOOKED','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','VITALS_COMPLETED','READY_FOR_CONSULTATION')
        OR a.queue_status IN ('WAITING','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION')
      )
    ORDER BY a.created_at ASC, a.id ASC
    LIMIT 200
    `,a.tenantId,a.hospitalId,a.branchId);return i.NextResponse.json((0,o.serialize)({rows:r}))}async function p(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,d=await e.json(),u=(0,o.toNumber)(d.appointment_id),p=(0,o.toNumber)(d.patient_id);if(!u&&p){let e=await l.prisma.$queryRawUnsafe(`
      SELECT id
      FROM appointments
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
        AND (
          appointment_date = CURRENT_DATE
          OR status IN ('BOOKED','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','VITALS_COMPLETED','READY_FOR_CONSULTATION','IN_CONSULTATION')
          OR queue_status IN ('WAITING','CHECKED_IN','WAITING_FOR_VITALS','VITALS_COLLECTED','WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION','IN_CONSULTATION')
        )
      ORDER BY
        CASE WHEN appointment_date = CURRENT_DATE THEN 0 ELSE 1 END,
        appointment_date DESC NULLS LAST,
        created_at DESC,
        id DESC
      LIMIT 1
      `,p,a.tenantId,a.hospitalId,a.branchId);u=(0,o.toNumber)(e[0]?.id)}if(!u)return i.NextResponse.json({error:"Select a patient with an active appointment before saving vitals."},{status:400});let c=(await l.prisma.$queryRawUnsafe(`
    SELECT
      a.*,
      d.full_name AS doctor_name
    FROM appointments a
    LEFT JOIN doctors d ON d.id = a.doctor_id
    WHERE a.id = $1
      AND a.tenant_id = $2
      AND a.hospital_id = $3
      AND a.branch_id = $4
      AND COALESCE(a.is_deleted,false) = false
    LIMIT 1
    `,u,a.tenantId,a.hospitalId,a.branchId))[0];if(!c)return i.NextResponse.json({error:"Appointment not found."},{status:404});let _=(0,o.toDecimal)(d.weight),E=(0,o.toDecimal)(d.height),N=_&&E?Number((_/Math.pow(E/100,2)).toFixed(2)):(0,o.toDecimal)(d.bmi),T=(0,o.nullableText)(d.blood_pressure),R=T?(0,r.parseBloodPressure)(T):null;if(T&&!R)return i.NextResponse.json({error:r.BP_VALIDATION_MESSAGE},{status:400});let A=await l.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_vitals (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,blood_pressure,systolic_bp,diastolic_bp,
      weight,height,temperature,spo2,pulse,respiration,bmi,notes,status,
      created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'VITALS_COLLECTED',$18,$18,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,c.patient_id,u,R?.bloodPressure||null,R?.systolicBp||null,R?.diastolicBp||null,_,E,(0,o.toDecimal)(d.temperature),(0,o.toDecimal)(d.spo2),(0,o.toDecimal)(d.pulse),(0,o.toDecimal)(d.respiration),N,(0,o.nullableText)(d.notes),a.user.id??null),I=!1!==d.mark_ready,C=I?"VITALS_COMPLETED":"VITALS_COLLECTED",O=I?"WAITING_FOR_DOCTOR":"VITALS_COLLECTED";return await l.prisma.$executeRawUnsafe(`
    UPDATE appointments
    SET status = $5,
        queue_status = $6,
        updated_by = $7,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,u,a.tenantId,a.hospitalId,a.branchId,C,O,a.user.id??null),await l.prisma.$executeRawUnsafe(`
    UPDATE medical_records
    SET vitals = $5::jsonb,
        updated_by = $6,
        updated_at = CURRENT_TIMESTAMP
    WHERE appointment_id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    `,u,a.tenantId,a.hospitalId,a.branchId,JSON.stringify(A[0]),a.user.id??null),await (0,o.recordWorkflowEvent)(a,{patientId:Number(c.patient_id),appointmentId:u,workflowStage:"VITALS",status:C,summary:I?"Vitals captured by nursing and patient moved to doctor queue.":"Vitals captured by nursing.",sourceTable:"clinical_vitals",sourceId:Number(A[0].id),metadata:A[0]}),await (0,n.recordClinicalAudit)(a,{moduleName:"vitals",action:"save",entityType:"clinical_vitals",entityId:Number(A[0].id),summary:"Patient vitals saved",payload:A[0]}),await (0,s.queueClinicalWorkflowNotification)(a,{templateKey:"vitals_completed",patientId:Number(c.patient_id),appointmentId:u,sourceModule:"clinical_vitals",sourceRecordId:Number(A[0].id),variables:{doctor_name:(0,o.nullableText)(c.doctor_name)||(c.doctor_id?"Assigned Doctor":"Doctor")}}),i.NextResponse.json((0,o.serialize)({...A[0],message:I?"Vitals saved successfully. Patient moved to Doctor Queue.":"Vitals saved successfully.",appointment_status:C,queue_status:O}),{status:201})}[n,s,o,l]=d.then?(await d)():d,e.s(["GET",0,u,"POST",0,p]),a()}catch(e){a(e)}},!1),889265,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),o=e.i(561916),l=e.i(174677),d=e.i(869741),u=e.i(316795),p=e.i(487718),c=e.i(995169),_=e.i(47587),E=e.i(666012),N=e.i(570101),T=e.i(626937),R=e.i(10372),A=e.i(193695);e.i(52474);var I=e.i(600220),C=e.i(948588),O=t([C]);[C]=O.then?(await O)():O;let m=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/operations/vitals/route",pathname:"/api/clinical/operations/vitals",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/operations/vitals/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:S,serverHooks:D}=m;async function h(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),m.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/operations/vitals/route";i=i.replace(/\/index$/,"")||"/";let r=await m.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,deploymentId:O,params:h,nextConfig:v,parsedUrl:S,isDraftMode:D,prerenderManifest:L,routerServerContext:f,isOnDemandRevalidate:b,revalidateOnlyGenerated:w,resolvedPathname:$,clientReferenceManifest:y,serverActionsManifest:g}=r,x=(0,d.normalizeAppPath)(i),P=!!(L.dynamicRoutes[x]||L.routes[$]),U=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,S,!1):t.end("This page could not be found"),null);if(P&&!D){let e=!!L.routes[$],t=L.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(v.adapterPath)return await U();throw new A.NoFallbackError}}let M=null;!P||m.isDev||D||(M=$,M="/index"===M?"/":M);let F=!0===m.isDev||!P,H=P&&!F;g&&y&&(0,l.setManifestsSingleton)({page:i,clientReferenceManifest:y,serverActionsManifest:g});let q=e.method||"GET",V=(0,o.getTracer)(),W=V.getActiveScopeSpan(),k=!!(null==f?void 0:f.isWrappedByNextServer),G=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await m.getIncrementalCache(e,v,L,G);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let K={params:h,previewProps:L.preview,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:F,incrementalCache:B,cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>m.onRequestError(e,t,i,n,f)},sharedContext:{buildId:C,deploymentId:O}},j=new u.NodeNextRequest(e),Y=new u.NodeNextResponse(t),J=p.NextRequestAdapter.fromNodeNextRequest(j,(0,p.signalFromNodeResponse)(t));try{let r,s=async e=>m.handle(J,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=V.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${q} ${i}`)}),l=async r=>{var o,l;let d=async({previousCacheEntry:n})=>{try{if(!G&&b&&w&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(r);e.fetchMetrics=K.renderOpts.fetchMetrics;let o=K.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=K.renderOpts.collectedTags;if(!P)return await (0,E.sendResponse)(j,Y,i,K.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,N.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,n=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:I.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await m.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:b})},!1,f),t}},u=await m.handleResponse({req:e,nextConfig:v,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:L,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:w,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:G});if(!P)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==I.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",b?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,N.fromNodeOutgoingHttpHeaders)(u.value.headers);return G&&P||p.delete(R.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,T.getCacheControlHeader)(u.cacheControl)),await (0,E.sendResponse)(j,Y,new Response(u.value.body,{headers:p,status:u.value.status||200})),null};k&&W?await l(W):(r=V.getActiveScopeSpan(),await V.withPropagatedContext(e.headers,()=>V.trace(c.BaseServerSpan.handleRequest,{spanName:`${q} ${i}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l),void 0,!k))}catch(t){if(t instanceof A.NoFallbackError||await m.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:b})},!1,f),P)throw t;return await (0,E.sendResponse)(j,Y,new Response(null,{status:500})),null}}e.s(["handler",0,h,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:S})},"routeModule",0,m,"serverHooks",0,D,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,S]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_01z5gfc._.js.map