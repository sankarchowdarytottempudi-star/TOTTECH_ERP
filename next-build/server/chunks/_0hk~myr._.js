module.exports=[64924,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),r=e.i(15270),o=t([n,r]);async function d(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,{searchParams:o}=new URL(e.url),d=o.get("view")||"queue",s=o.get("q")?.trim()||"",l=s?`%${s.toLowerCase()}%`:null,p=[a.tenantId,a.hospitalId,a.branchId];if("prescriptions"===d){let e=await r.prisma.$queryRawUnsafe(`
        SELECT
          pr.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM prescriptions pr
        LEFT JOIN patients p ON p.id = pr.patient_id
        LEFT JOIN doctors d ON d.id = pr.doctor_id
        WHERE pr.tenant_id = $1
          AND pr.hospital_id = $2
          AND pr.branch_id = $3
          AND COALESCE(pr.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(pr.prescription_uid,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.uhid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY pr.created_at DESC, pr.id DESC
        LIMIT 200
        `,...p,l);return i.NextResponse.json({view:d,rows:e})}if("lab-orders"===d){let e=await r.prisma.$queryRawUnsafe(`
        SELECT
          lo.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM lab_orders lo
        LEFT JOIN patients p ON p.id = lo.patient_id
        LEFT JOIN doctors d ON d.id = lo.doctor_id
        WHERE lo.tenant_id = $1
          AND lo.hospital_id = $2
          AND lo.branch_id = $3
          AND COALESCE(lo.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(lo.order_uid,'')) LIKE $4
            OR lower(COALESCE(lo.order_type,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY lo.ordered_at DESC, lo.id DESC
        LIMIT 200
        `,...p,l);return i.NextResponse.json({view:d,rows:e})}if("radiology-orders"===d){let e=await r.prisma.$queryRawUnsafe(`
        SELECT
          ro.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM radiology_orders ro
        LEFT JOIN patients p ON p.id = ro.patient_id
        LEFT JOIN doctors d ON d.id = ro.doctor_id
        WHERE ro.tenant_id = $1
          AND ro.hospital_id = $2
          AND ro.branch_id = $3
          AND COALESCE(ro.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(ro.order_number,'')) LIKE $4
            OR lower(COALESCE(ro.study_type,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY ro.created_at DESC, ro.id DESC
        LIMIT 200
        `,...p,l);return i.NextResponse.json({view:d,rows:e})}if("clinical-notes"===d||"follow-ups"===d){let e="follow-ups"===d?"AND mr.follow_up_date IS NOT NULL":"",t=await r.prisma.$queryRawUnsafe(`
        SELECT
          mr.*,
          p.patient_uid,
          p.uhid,
          p.phone,
          COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
          d.full_name AS doctor_name
        FROM medical_records mr
        LEFT JOIN patients p ON p.id = mr.patient_id
        LEFT JOIN doctors d ON d.id = mr.doctor_id
        WHERE mr.tenant_id = $1
          AND mr.hospital_id = $2
          AND mr.branch_id = $3
          AND COALESCE(mr.is_deleted,false) = false
          ${e}
          AND (
            $4::text IS NULL
            OR lower(COALESCE(mr.chief_complaint,'')) LIKE $4
            OR lower(COALESCE(mr.diagnosis,'')) LIKE $4
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        ORDER BY COALESCE(mr.follow_up_date, mr.created_at::date) DESC, mr.id DESC
        LIMIT 200
        `,...p,l);return i.NextResponse.json({view:d,rows:t})}if("patient-history"===d){let e=await r.prisma.$queryRawUnsafe(`
        SELECT
          p.*,
          COUNT(DISTINCT a.id)::int AS appointment_count,
          COUNT(DISTINCT mr.id)::int AS consultation_count,
          COUNT(DISTINCT pr.id)::int AS prescription_count,
          COUNT(DISTINCT lo.id)::int AS lab_order_count,
          COUNT(DISTINCT ro.id)::int AS radiology_order_count
        FROM patients p
        LEFT JOIN appointments a ON a.patient_id = p.id AND COALESCE(a.is_deleted,false) = false
        LEFT JOIN medical_records mr ON mr.patient_id = p.id AND COALESCE(mr.is_deleted,false) = false
        LEFT JOIN prescriptions pr ON pr.patient_id = p.id AND COALESCE(pr.is_deleted,false) = false
        LEFT JOIN lab_orders lo ON lo.patient_id = p.id AND COALESCE(lo.is_deleted,false) = false
        LEFT JOIN radiology_orders ro ON ro.patient_id = p.id AND COALESCE(ro.is_deleted,false) = false
        WHERE p.tenant_id = $1
          AND p.hospital_id = $2
          AND p.branch_id = $3
          AND COALESCE(p.is_deleted,false) = false
          AND (
            $4::text IS NULL
            OR lower(COALESCE(p.patient_uid,'')) LIKE $4
            OR lower(COALESCE(p.uhid,'')) LIKE $4
            OR lower(COALESCE(p.phone,'')) LIKE $4
            OR lower(COALESCE(p.abha_id,'')) LIKE $4
            OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          )
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 200
        `,...p,l);return i.NextResponse.json({view:d,rows:e})}let E="active"===d?"AND a.status = 'IN_CONSULTATION'":"completed"===d?"AND a.status IN ('CHECKED_OUT','COMPLETED','CONSULTATION_COMPLETED')":"appointments"===d?"AND a.appointment_date >= CURRENT_DATE":"AND (a.status IN ('READY_FOR_CONSULTATION','VITALS_COLLECTED','VITALS_COMPLETED','CHECKED_IN','LAB_COMPLETED') OR a.queue_status IN ('WAITING_FOR_DOCTOR','WAITING_FOR_DOCTOR_REVIEW','READY_FOR_CONSULTATION'))",u=await r.prisma.$queryRawUnsafe(`
      SELECT
        a.*,
        p.patient_uid,
        p.uhid,
        p.phone,
        p.gender,
        p.date_of_birth,
        p.blood_group,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        d.full_name AS doctor_name,
        dep.department_name,
        mr.id AS medical_record_id,
        mr.status AS consultation_status
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      LEFT JOIN departments dep ON dep.id = a.department_id
      LEFT JOIN medical_records mr ON mr.appointment_id = a.id AND COALESCE(mr.is_deleted,false) = false
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND COALESCE(a.is_deleted,false) = false
        ${E}
        AND (
          $4::text IS NULL
          OR lower(COALESCE(a.appointment_uid,'')) LIKE $4
          OR lower(COALESCE(a.token_number,'')) LIKE $4
          OR lower(COALESCE(p.patient_uid,'')) LIKE $4
          OR lower(COALESCE(p.uhid,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          OR lower(COALESCE(d.full_name,'')) LIKE $4
        )
      ORDER BY
        CASE WHEN a.queue_status IN ('WAITING_FOR_DOCTOR','READY_FOR_CONSULTATION') OR a.status IN ('VITALS_COMPLETED','READY_FOR_CONSULTATION') THEN 0 ELSE 1 END,
        COALESCE(a.updated_at, a.created_at) ASC,
        a.appointment_date ASC,
        a.start_time ASC NULLS LAST,
        a.id ASC
      LIMIT 200
      `,...p,l);return i.NextResponse.json({view:d,rows:u})}async function s(e){var t;let a,o=await (0,n.requireClinicalContext)(e);if(o.response)return o.response;let d=o.context,s=(t=(await e.json()).appointment_id,a=Number(t),Number.isFinite(a)&&a>0?a:null);if(!s)return i.NextResponse.json({error:"Appointment id is required to start consultation."},{status:400});let l=(await r.prisma.$queryRawUnsafe(`
      SELECT *
      FROM appointments
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      LIMIT 1
      `,s,d.tenantId,d.hospitalId,d.branchId))[0];if(!l)return i.NextResponse.json({error:"Appointment not found."},{status:404});let p=await r.prisma.$queryRawUnsafe(`
      SELECT *
      FROM medical_records
      WHERE appointment_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY id DESC
      LIMIT 1
      `,s,d.tenantId,d.hospitalId,d.branchId);return p.length||(p=await r.prisma.$queryRawUnsafe(`
        INSERT INTO medical_records (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          patient_id,
          doctor_id,
          appointment_id,
          record_type,
          chief_complaint,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'OPD_CONSULTATION',$8,'ACTIVE',$9::jsonb,$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,d.tenantId,d.hospitalId,d.branchId,d.clinicId,l.patient_id,l.doctor_id,s,l.reason||null,JSON.stringify({source:"doctor_consultation_start",token_number:l.token_number}),d.user.id??null)),await r.prisma.$executeRawUnsafe(`
    UPDATE appointments
    SET status = 'IN_CONSULTATION',
        queue_status = 'IN_CONSULTATION',
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,s,d.tenantId,d.hospitalId,d.branchId,d.user.id??null),await r.prisma.$executeRawUnsafe(`
    INSERT INTO clinical_patient_timeline (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      patient_id,
      event_type,
      event_title,
      event_summary,
      source_table,
      source_id,
      metadata,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,'CONSULTATION_STARTED','Consultation started',$6,'medical_records',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,d.tenantId,d.hospitalId,d.branchId,d.clinicId,l.patient_id,`Doctor consultation started for appointment ${l.appointment_uid||s}`,p[0].id,JSON.stringify({appointment_id:s}),d.user.id??null),await (0,n.recordClinicalAudit)(d,{moduleName:"doctor_consultation",action:"start",entityType:"medical_record",entityId:Number(p[0].id),summary:"Doctor consultation started",payload:{appointment_id:s}}),i.NextResponse.json({appointment_id:s,medical_record:p[0],consultation_url:`/clinical-services/doctors/consultation/${s}`})}[n,r]=o.then?(await o)():o,e.s(["GET",0,d,"POST",0,s]),a()}catch(e){a(e)}},!1),770095,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),o=e.i(759756),d=e.i(561916),s=e.i(174677),l=e.i(869741),p=e.i(316795),E=e.i(487718),u=e.i(995169),_=e.i(47587),c=e.i(666012),C=e.i(570101),O=e.i(626937),A=e.i(10372),N=e.i(193695);e.i(52474);var R=e.i(600220),L=e.i(64924),S=t([L]);[L]=S.then?(await S)():S;let I=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/doctors/consultations/route",pathname:"/api/clinical/doctors/consultations",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/doctors/consultations/route.ts",nextConfigOutput:"",userland:L,...{}}),{workAsyncStorage:T,workUnitAsyncStorage:h,serverHooks:f}=I;async function m(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),I.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/doctors/consultations/route";i=i.replace(/\/index$/,"")||"/";let r=await I.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:L,deploymentId:S,params:m,nextConfig:T,parsedUrl:h,isDraftMode:f,prerenderManifest:$,routerServerContext:w,isOnDemandRevalidate:D,revalidateOnlyGenerated:y,resolvedPathname:U,clientReferenceManifest:b,serverActionsManifest:v}=r,g=(0,l.normalizeAppPath)(i),x=!!($.dynamicRoutes[g]||$.routes[U]),M=async()=>((null==w?void 0:w.render404)?await w.render404(e,t,h,!1):t.end("This page could not be found"),null);if(x&&!f){let e=!!$.routes[U],t=$.dynamicRoutes[g];if(t&&!1===t.fallback&&!e){if(T.adapterPath)return await M();throw new N.NoFallbackError}}let K=null;!x||I.isDev||f||(K=U,K="/index"===K?"/":K);let F=!0===I.isDev||!x,P=x&&!F;v&&b&&(0,s.setManifestsSingleton)({page:i,clientReferenceManifest:b,serverActionsManifest:v});let q=e.method||"GET",H=(0,d.getTracer)(),j=H.getActiveScopeSpan(),J=!!(null==w?void 0:w.isWrappedByNextServer),W=!!(0,o.getRequestMeta)(e,"minimalMode"),k=(0,o.getRequestMeta)(e,"incrementalCache")||await I.getIncrementalCache(e,T,$,W);null==k||k.resetRequestCache(),globalThis.__incrementalCache=k;let B={params:m,previewProps:$.preview,renderOpts:{experimental:{authInterrupts:!!T.experimental.authInterrupts},cacheComponents:!!T.cacheComponents,supportsDynamicResponse:F,incrementalCache:k,cacheLifeProfiles:T.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>I.onRequestError(e,t,i,n,w)},sharedContext:{buildId:L,deploymentId:S}},Y=new p.NodeNextRequest(e),V=new p.NodeNextResponse(t),G=E.NextRequestAdapter.fromNodeNextRequest(Y,(0,E.signalFromNodeResponse)(t));try{let r,o=async e=>I.handle(G,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${q} ${i}`)}),s=async r=>{var d,s;let l=async({previousCacheEntry:n})=>{try{if(!W&&D&&y&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(r);e.fetchMetrics=B.renderOpts.fetchMetrics;let d=B.renderOpts.pendingWaitUntil;d&&a.waitUntil&&(a.waitUntil(d),d=void 0);let s=B.renderOpts.collectedTags;if(!x)return await (0,c.sendResponse)(Y,V,i,B.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,C.toNodeOutgoingHttpHeaders)(i.headers);s&&(t[A.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:D})},!1,w),t}},p=await I.handleResponse({req:e,nextConfig:T,cacheKey:K,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:$,isRoutePPREnabled:!1,isOnDemandRevalidate:D,revalidateOnlyGenerated:y,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:W});if(!x)return null;if((null==p||null==(d=p.value)?void 0:d.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(s=p.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",D?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let E=(0,C.fromNodeOutgoingHttpHeaders)(p.value.headers);return W&&x||E.delete(A.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||E.get("Cache-Control")||E.set("Cache-Control",(0,O.getCacheControlHeader)(p.cacheControl)),await (0,c.sendResponse)(Y,V,new Response(p.value.body,{headers:E,status:p.value.status||200})),null};J&&j?await s(j):(r=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(u.BaseServerSpan.handleRequest,{spanName:`${q} ${i}`,kind:d.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},s),void 0,!J))}catch(t){if(t instanceof N.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:g,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:D})},!1,w),x)throw t;return await (0,c.sendResponse)(Y,V,new Response(null,{status:500})),null}}e.s(["handler",0,m,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:h})},"routeModule",0,I,"serverHooks",0,f,"workAsyncStorage",0,T,"workUnitAsyncStorage",0,h]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0hk~myr._.js.map