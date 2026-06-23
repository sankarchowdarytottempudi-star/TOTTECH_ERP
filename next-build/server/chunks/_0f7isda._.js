module.exports=[503117,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(780907),r=e.i(679504),o=e.i(155876),s=e.i(15270),d=t([i,r,o,s]);[i,r,o,s]=d.then?(await d)():d;let c=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},m=e=>String(e||"").trim();async function p(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,{searchParams:r}=new URL(e.url),o=c(r.get("id")),d=r.get("date")||new Date().toISOString().slice(0,10),p=o?"AND a.id = $4":"AND a.appointment_date = $4::date",[l,u,m]=await Promise.all([s.prisma.$queryRawUnsafe(`
        SELECT
          a.*,
          COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
          p.patient_uid,
          d.full_name AS doctor_name,
          dep.department_name
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN doctors d ON d.id = a.doctor_id
        LEFT JOIN departments dep ON dep.id = a.department_id
        WHERE a.tenant_id = $1
          AND a.hospital_id = $2
          AND a.branch_id = $3
          ${p}
          AND COALESCE(a.is_deleted, false) = false
        ORDER BY a.start_time ASC NULLS LAST, a.id DESC
        `,a.tenantId,a.hospitalId,a.branchId,o||d),s.prisma.$queryRawUnsafe(`
        SELECT id, patient_uid, first_name, last_name, phone
        FROM patients
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
        ORDER BY created_at DESC
        LIMIT 200
        `,a.tenantId,a.hospitalId,a.branchId),s.prisma.$queryRawUnsafe(`
        SELECT id, full_name, specialization, status
        FROM doctors
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND COALESCE(is_deleted, false) = false
        ORDER BY full_name ASC
        LIMIT 100
        `,a.tenantId,a.hospitalId,a.branchId)]);return n.NextResponse.json({date:d,appointments:l,patients:u,doctors:m})}async function l(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,d=await e.json(),p=c(d.patient_id);if(!p)return n.NextResponse.json({error:"Select a patient before booking an appointment."},{status:400});if(!m(d.appointment_date))return n.NextResponse.json({error:"Appointment date is required."},{status:400});let l=await s.prisma.$queryRawUnsafe(`
      SELECT COALESCE(MAX(NULLIF(regexp_replace(token_number, '\\D', '', 'g'), '')::int), 0) + 1 AS next_token
      FROM appointments
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND appointment_date = $4::date
      `,a.tenantId,a.hospitalId,a.branchId,d.appointment_date),u=`T-${String(l[0]?.next_token||1).padStart(3,"0")}`,_=`APT-${Date.now()}`,E=(await s.prisma.$queryRawUnsafe(`
      INSERT INTO appointments (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        patient_id,
        doctor_id,
        department_id,
        appointment_uid,
        appointment_date,
        start_time,
        end_time,
        appointment_type,
        status,
        token_number,
        queue_status,
        reason,
        notes,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::date,$10::time,$11::time,$12,'BOOKED',$13,'WAITING',$14,$15,$16::jsonb,$17,$17,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,a.tenantId,a.clinicId,a.hospitalId,a.branchId,p,c(d.doctor_id),c(d.department_id),_,d.appointment_date,m(d.start_time)||null,m(d.end_time)||null,m(d.appointment_type)||"OPD",u,m(d.reason)||null,m(d.notes)||null,JSON.stringify(d.metadata||{}),a.user.id??null))[0];return await (0,i.recordClinicalAudit)(a,{moduleName:"appointments",action:"create",entityType:"appointment",entityId:Number(E.id),summary:"Clinical appointment booked",payload:{appointment_uid:_,token_number:u,patient_id:p}}),await (0,o.recordWorkflowEvent)(a,{patientId:p,appointmentId:Number(E.id),workflowStage:"APPOINTMENT",status:"BOOKED",summary:`Appointment booked with token ${u}.`,sourceTable:"appointments",sourceId:Number(E.id),metadata:{appointment_uid:_,token_number:u,doctor_id:E.doctor_id,department_id:E.department_id}}),await (0,r.queueClinicalWorkflowNotification)(a,{templateKey:"appointment_booked",patientId:p,appointmentId:Number(E.id),sourceModule:"appointments",sourceRecordId:Number(E.id),variables:{doctor_name:E.doctor_id?`Doctor #${E.doctor_id}`:"Doctor",department:E.department_id?`Department #${E.department_id}`:"Department",appointment_date:String(E.appointment_date||d.appointment_date||"-"),appointment_time:String(E.start_time||"-"),appointment_number:E.appointment_uid||E.id}}),n.NextResponse.json(E,{status:201})}async function u(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,d=await e.json(),p=c(d.id);if(!p)return n.NextResponse.json({error:"Appointment id is required."},{status:400});let l=m(d.status)||null,u=m(d.queue_status)||null;("CHECKED_IN"===l||"CHECKED_IN"===u)&&(l="CHECKED_IN",u="WAITING_FOR_VITALS");let _=await s.prisma.$queryRawUnsafe(`
      UPDATE appointments
      SET doctor_id = COALESCE($5, doctor_id),
          department_id = COALESCE($6, department_id),
          appointment_date = COALESCE($7::date, appointment_date),
          start_time = COALESCE($8::time, start_time),
          end_time = COALESCE($9::time, end_time),
          appointment_type = COALESCE($10, appointment_type),
          reason = COALESCE($11, reason),
          notes = COALESCE($12, notes),
          status = COALESCE($13, status),
          queue_status = COALESCE($14, queue_status),
          cancellation_reason = CASE WHEN $13 = 'CANCELLED' THEN COALESCE($15, cancellation_reason) ELSE cancellation_reason END,
          updated_by = $16,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted, false) = false
      RETURNING *
      `,p,a.tenantId,a.hospitalId,a.branchId,c(d.doctor_id),c(d.department_id),m(d.appointment_date)||null,m(d.start_time)||null,m(d.end_time)||null,m(d.appointment_type)||null,m(d.reason)||null,m(d.notes)||null,l,u,m(d.cancellation_reason)||null,a.user.id??null);return _.length?(await (0,i.recordClinicalAudit)(a,{moduleName:"appointments",action:"update",entityType:"appointment",entityId:p,summary:"Clinical appointment status updated",payload:{status:l,queue_status:u}}),(l||u)&&(await (0,o.recordWorkflowEvent)(a,{patientId:Number(_[0].patient_id),appointmentId:p,workflowStage:"APPOINTMENT",status:u||l||"UPDATED",summary:`Appointment moved to ${u||l}.`,sourceTable:"appointments",sourceId:p,metadata:{status:l,queue_status:u}}),("CHECKED_IN"===l||"WAITING_FOR_VITALS"===u)&&await (0,r.queueClinicalWorkflowNotification)(a,{templateKey:"appointment_checked_in",patientId:Number(_[0].patient_id),appointmentId:p,sourceModule:"appointments",sourceRecordId:p,variables:{doctor_name:_[0].doctor_id?`Doctor #${_[0].doctor_id}`:"Doctor",department:_[0].department_id?`Department #${_[0].department_id}`:"Department",token_number:_[0].token_number||"-"}})),n.NextResponse.json(_[0])):n.NextResponse.json({error:"Appointment not found."},{status:404})}e.s(["GET",0,p,"PATCH",0,u,"POST",0,l]),a()}catch(e){a(e)}},!1),548035,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),o=e.i(759756),s=e.i(561916),d=e.i(174677),p=e.i(869741),l=e.i(316795),u=e.i(487718),c=e.i(995169),m=e.i(47587),_=e.i(666012),E=e.i(570101),C=e.i(626937),R=e.i(10372),h=e.i(193695);e.i(52474);var A=e.i(600220),N=e.i(503117),f=t([N]);[N]=f.then?(await f)():f;let S=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/clinical/appointments/route",pathname:"/api/clinical/appointments",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/appointments/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:w,workUnitAsyncStorage:$,serverHooks:T}=S;async function I(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),S.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/clinical/appointments/route";n=n.replace(/\/index$/,"")||"/";let r=await S.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:N,deploymentId:f,params:I,nextConfig:w,parsedUrl:$,isDraftMode:T,prerenderManifest:O,routerServerContext:b,isOnDemandRevalidate:y,revalidateOnlyGenerated:D,resolvedPathname:v,clientReferenceManifest:g,serverActionsManifest:x}=r,L=(0,p.normalizeAppPath)(n),P=!!(O.dynamicRoutes[L]||O.routes[v]),q=async()=>((null==b?void 0:b.render404)?await b.render404(e,t,$,!1):t.end("This page could not be found"),null);if(P&&!T){let e=!!O.routes[v],t=O.dynamicRoutes[L];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await q();throw new h.NoFallbackError}}let k=null;!P||S.isDev||T||(k=v,k="/index"===k?"/":k);let U=!0===S.isDev||!P,M=P&&!U;x&&g&&(0,d.setManifestsSingleton)({page:n,clientReferenceManifest:g,serverActionsManifest:x});let H=e.method||"GET",F=(0,s.getTracer)(),j=F.getActiveScopeSpan(),K=!!(null==b?void 0:b.isWrappedByNextServer),W=!!(0,o.getRequestMeta)(e,"minimalMode"),B=(0,o.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,w,O,W);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let G={params:I,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:U,incrementalCache:B,cacheLifeProfiles:w.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>S.onRequestError(e,t,n,i,b)},sharedContext:{buildId:N,deploymentId:f}},V=new l.NodeNextRequest(e),J=new l.NodeNextResponse(t),X=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let r,o=async e=>S.handle(X,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${H} ${n}`)}),d=async r=>{var s,d;let p=async({previousCacheEntry:i})=>{try{if(!W&&y&&D&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(r);e.fetchMetrics=G.renderOpts.fetchMetrics;let s=G.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let d=G.renderOpts.collectedTags;if(!P)return await (0,_.sendResponse)(V,J,n,G.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[R.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,i=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:y})},!1,b),t}},l=await S.handleResponse({req:e,nextConfig:w,cacheKey:k,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:D,responseGenerator:p,waitUntil:a.waitUntil,isMinimalMode:W});if(!P)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",y?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,E.fromNodeOutgoingHttpHeaders)(l.value.headers);return W&&P||u.delete(R.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,C.getCacheControlHeader)(l.cacheControl)),await (0,_.sendResponse)(V,J,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};K&&j?await d(j):(r=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},d),void 0,!K))}catch(t){if(t instanceof h.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:y})},!1,b),P)throw t;return await (0,_.sendResponse)(V,J,new Response(null,{status:500})),null}}e.s(["handler",0,I,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:$})},"routeModule",0,S,"serverHooks",0,T,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,$]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0f7isda._.js.map