module.exports=[802364,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(780907),n=e.i(15270),o=t([i,n]);async function s(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,{searchParams:o}=new URL(e.url),s=o.get("q")?.trim()||"",l=s?`%${s.toLowerCase()}%`:null,p=s.replace(/\D/g,"");if(!l&&p.length<4)return r.NextResponse.json({query:s,results:[]});let[d,E,C,c,u,_]=await Promise.all([n.prisma.$queryRawUnsafe(`
      SELECT
        'Patient' AS result_type,
        p.id,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS title,
        CONCAT(
          'UHID ', COALESCE(NULLIF(p.uhid,''), NULLIF(p.patient_uid,''), '-'),
          ' | ', COALESCE(p.phone,'No mobile'),
          ' | ', COALESCE(p.gender,'-'),
          ' | Age ', COALESCE(COALESCE(p.age_years, EXTRACT(YEAR FROM age(CURRENT_DATE, p.date_of_birth))::int)::text, '-'),
          ' | Latest Visit ', COALESCE(latest_appointment.appointment_date::text, 'No visit'),
          ' | Rx ', COALESCE(latest_prescription.prescription_uid, 'No prescription'),
          ' | Lab Reports ', COALESCE(lab_counts.lab_report_count::text, '0')
        ) AS subtitle,
        '/clinical-services/patients/' || p.id AS href,
        p.created_at,
        latest_appointment.id AS latest_appointment_id,
        latest_appointment.status AS latest_visit_status,
        latest_prescription.prescription_uid AS latest_prescription_uid,
        lab_counts.lab_report_count,
        radiology_counts.radiology_record_count
      FROM patients p
      LEFT JOIN LATERAL (
        SELECT a.*
        FROM appointments a
        WHERE a.patient_id = p.id
          AND a.tenant_id = p.tenant_id
          AND a.hospital_id = p.hospital_id
          AND a.branch_id = p.branch_id
          AND COALESCE(a.is_deleted,false) = false
        ORDER BY a.appointment_date DESC NULLS LAST, a.created_at DESC, a.id DESC
        LIMIT 1
      ) latest_appointment ON true
      LEFT JOIN LATERAL (
        SELECT pr.*
        FROM prescriptions pr
        WHERE pr.patient_id = p.id
          AND pr.tenant_id = p.tenant_id
          AND pr.hospital_id = p.hospital_id
          AND pr.branch_id = p.branch_id
          AND COALESCE(pr.is_deleted,false) = false
        ORDER BY pr.created_at DESC, pr.id DESC
        LIMIT 1
      ) latest_prescription ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS lab_report_count
        FROM lab_results lr
        WHERE lr.patient_id = p.id
          AND lr.tenant_id = p.tenant_id
          AND lr.hospital_id = p.hospital_id
          AND lr.branch_id = p.branch_id
          AND COALESCE(lr.is_deleted,false) = false
      ) lab_counts ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS radiology_record_count
        FROM radiology_orders ro
        WHERE ro.patient_id = p.id
          AND ro.tenant_id = p.tenant_id
          AND ro.hospital_id = p.hospital_id
          AND ro.branch_id = p.branch_id
          AND COALESCE(ro.is_deleted,false) = false
      ) radiology_counts ON true
      WHERE p.tenant_id = $1
        AND p.hospital_id = $2
        AND p.branch_id = $3
        AND COALESCE(p.is_deleted,false) = false
        AND (
          lower(COALESCE(p.patient_uid,'')) LIKE $4
          OR lower(COALESCE(p.uhid,'')) LIKE $4
          OR lower(COALESCE(p.abha_id,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY p.created_at DESC
      LIMIT 20
      `,a.tenantId,a.hospitalId,a.branchId,l,p),n.prisma.$queryRawUnsafe(`
      SELECT
        'Appointment' AS result_type,
        a.id,
        COALESCE(a.appointment_uid, a.token_number, 'Appointment') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(a.status,'')) AS subtitle,
        '/clinical-services/appointments/' || a.id AS href,
        a.created_at
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id = $1
        AND a.hospital_id = $2
        AND a.branch_id = $3
        AND COALESCE(a.is_deleted,false) = false
        AND (
          lower(COALESCE(a.appointment_uid,'')) LIKE $4
          OR lower(COALESCE(a.token_number,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          OR lower(COALESCE(d.full_name,'')) LIKE $4
        )
      ORDER BY a.created_at DESC
      LIMIT 20
      `,a.tenantId,a.hospitalId,a.branchId,l,p),n.prisma.$queryRawUnsafe(`
      SELECT
        'Consultation' AS result_type,
        mr.id,
        COALESCE(mr.diagnosis, mr.chief_complaint, 'Clinical Note') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(d.full_name,'')) AS subtitle,
        '/clinical-services/doctors/consultation/' || mr.appointment_id AS href,
        mr.created_at
      FROM medical_records mr
      LEFT JOIN patients p ON p.id = mr.patient_id
      LEFT JOIN doctors d ON d.id = mr.doctor_id
      WHERE mr.tenant_id = $1
        AND mr.hospital_id = $2
        AND mr.branch_id = $3
        AND COALESCE(mr.is_deleted,false) = false
        AND (
          lower(COALESCE(mr.diagnosis,'')) LIKE $4
          OR lower(COALESCE(mr.chief_complaint,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
          OR lower(COALESCE(d.full_name,'')) LIKE $4
        )
      ORDER BY mr.created_at DESC
      LIMIT 20
      `,a.tenantId,a.hospitalId,a.branchId,l,p),n.prisma.$queryRawUnsafe(`
      SELECT
        'Prescription' AS result_type,
        pr.id,
        pr.prescription_uid AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(pr.pharmacy_status,'')) AS subtitle,
        '/clinical-services/doctors/prescriptions?q=' || pr.prescription_uid AS href,
        pr.created_at
      FROM prescriptions pr
      LEFT JOIN patients p ON p.id = pr.patient_id
      WHERE pr.tenant_id = $1
        AND pr.hospital_id = $2
        AND pr.branch_id = $3
        AND COALESCE(pr.is_deleted,false) = false
        AND (
          lower(COALESCE(pr.prescription_uid,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY pr.created_at DESC
      LIMIT 20
      `,a.tenantId,a.hospitalId,a.branchId,l,p),n.prisma.$queryRawUnsafe(`
      SELECT
        'Lab Order' AS result_type,
        lo.id,
        COALESCE(lo.order_uid, lo.order_type, 'Lab Order') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(lo.status,'')) AS subtitle,
        '/clinical-services/doctors/lab-orders?q=' || COALESCE(lo.order_uid,'') AS href,
        lo.created_at
      FROM lab_orders lo
      LEFT JOIN patients p ON p.id = lo.patient_id
      WHERE lo.tenant_id = $1
        AND lo.hospital_id = $2
        AND lo.branch_id = $3
        AND COALESCE(lo.is_deleted,false) = false
        AND (
          lower(COALESCE(lo.order_uid,'')) LIKE $4
          OR lower(COALESCE(lo.order_type,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY lo.created_at DESC
      LIMIT 20
      `,a.tenantId,a.hospitalId,a.branchId,l,p),n.prisma.$queryRawUnsafe(`
      SELECT
        'Radiology Order' AS result_type,
        ro.id,
        COALESCE(ro.order_number, ro.study_type, 'Radiology Order') AS title,
        CONCAT(COALESCE(p.first_name,''), ' ', COALESCE(p.last_name,''), ' | ', COALESCE(ro.order_status,'')) AS subtitle,
        '/clinical-services/doctors/radiology-orders?q=' || COALESCE(ro.order_number,'') AS href,
        ro.created_at
      FROM radiology_orders ro
      LEFT JOIN patients p ON p.id = ro.patient_id
      WHERE ro.tenant_id = $1
        AND ro.hospital_id = $2
        AND ro.branch_id = $3
        AND COALESCE(ro.is_deleted,false) = false
        AND (
          lower(COALESCE(ro.order_number,'')) LIKE $4
          OR lower(COALESCE(ro.study_type,'')) LIKE $4
          OR lower(COALESCE(p.phone,'')) LIKE $4
          OR regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $5
          OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $4
        )
      ORDER BY ro.created_at DESC
      LIMIT 20
      `,a.tenantId,a.hospitalId,a.branchId,l,p)]);return r.NextResponse.json({query:s,results:[...d,...E,...C,...c,...u,..._].sort((e,t)=>{let a=new Date(String(e.created_at||0)).getTime();return new Date(String(t.created_at||0)).getTime()-a})})}[i,n]=o.then?(await o)():o,e.s(["GET",0,s]),a()}catch(e){a(e)}},!1),885029,e=>e.a(async(t,a)=>{try{var r=e.i(747909),i=e.i(174017),n=e.i(996250),o=e.i(759756),s=e.i(561916),l=e.i(174677),p=e.i(869741),d=e.i(316795),E=e.i(487718),C=e.i(995169),c=e.i(47587),u=e.i(666012),_=e.i(570101),A=e.i(626937),O=e.i(10372),L=e.i(193695);e.i(52474);var S=e.i(600220),R=e.i(802364),h=t([R]);[R]=h.then?(await h)():h;let N=new r.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/clinical/global-search/route",pathname:"/api/clinical/global-search",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/global-search/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:I,workUnitAsyncStorage:f,serverHooks:D}=N;async function m(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),N.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/clinical/global-search/route";r=r.replace(/\/index$/,"")||"/";let n=await N.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:h,params:m,nextConfig:I,parsedUrl:f,isDraftMode:D,prerenderManifest:w,routerServerContext:g,isOnDemandRevalidate:T,revalidateOnlyGenerated:b,resolvedPathname:$,clientReferenceManifest:y,serverActionsManifest:v}=n,x=(0,p.normalizeAppPath)(r),K=!!(w.dynamicRoutes[x]||w.routes[$]),M=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,f,!1):t.end("This page could not be found"),null);if(K&&!D){let e=!!w.routes[$],t=w.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(I.adapterPath)return await M();throw new L.NoFallbackError}}let F=null;!K||N.isDev||D||(F=$,F="/index"===F?"/":F);let q=!0===N.isDev||!K,U=K&&!q;v&&y&&(0,l.setManifestsSingleton)({page:r,clientReferenceManifest:y,serverActionsManifest:v});let H=e.method||"GET",P=(0,s.getTracer)(),k=P.getActiveScopeSpan(),B=!!(null==g?void 0:g.isWrappedByNextServer),W=!!(0,o.getRequestMeta)(e,"minimalMode"),J=(0,o.getRequestMeta)(e,"incrementalCache")||await N.getIncrementalCache(e,I,w,W);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let j={params:m,previewProps:w.preview,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:q,incrementalCache:J,cacheLifeProfiles:I.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,i)=>N.onRequestError(e,t,r,i,g)},sharedContext:{buildId:R,deploymentId:h}},Y=new d.NodeNextRequest(e),G=new d.NodeNextResponse(t),V=E.NextRequestAdapter.fromNodeNextRequest(Y,(0,E.signalFromNodeResponse)(t));try{let n,o=async e=>N.handle(V,j).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=P.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==C.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",i),n.updateName(t))}else e.updateName(`${H} ${r}`)}),l=async n=>{var s,l;let p=async({previousCacheEntry:i})=>{try{if(!W&&T&&b&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await o(n);e.fetchMetrics=j.renderOpts.fetchMetrics;let s=j.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=j.renderOpts.collectedTags;if(!K)return await (0,u.sendResponse)(Y,G,r,j.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(r.headers);l&&(t[O.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==j.renderOpts.collectedRevalidate&&!(j.renderOpts.collectedRevalidate>=O.INFINITE_CACHE)&&j.renderOpts.collectedRevalidate,i=void 0===j.renderOpts.collectedExpire||j.renderOpts.collectedExpire>=O.INFINITE_CACHE?void 0:j.renderOpts.collectedExpire;return{value:{kind:S.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})},!1,g),t}},d=await N.handleResponse({req:e,nextConfig:I,cacheKey:F,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:w,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:b,responseGenerator:p,waitUntil:a.waitUntil,isMinimalMode:W});if(!K)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==S.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",T?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let E=(0,_.fromNodeOutgoingHttpHeaders)(d.value.headers);return W&&K||E.delete(O.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||E.get("Cache-Control")||E.set("Cache-Control",(0,A.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(Y,G,new Response(d.value.body,{headers:E,status:d.value.status||200})),null};B&&k?await l(k):(n=P.getActiveScopeSpan(),await P.withPropagatedContext(e.headers,()=>P.trace(C.BaseServerSpan.handleRequest,{spanName:`${H} ${r}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l),void 0,!B))}catch(t){if(t instanceof L.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})},!1,g),K)throw t;return await (0,u.sendResponse)(Y,G,new Response(null,{status:500})),null}}e.s(["handler",0,m,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:f})},"routeModule",0,N,"serverHooks",0,D,"workAsyncStorage",0,I,"workUnitAsyncStorage",0,f]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0-dvnn-._.js.map