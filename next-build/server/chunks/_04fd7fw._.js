module.exports=[761730,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),r=e.i(679504),s=e.i(57446),o=e.i(155876),d=e.i(15270),l=t([n,r,s,o,d]);async function p(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,{searchParams:r}=new URL(e.url),s=r.get("status")||"PENDING",l=r.get("q")?.trim()||"",p=l?`%${l.toLowerCase()}%`:null,u=l.replace(/\D/g,""),c=await d.prisma.$queryRawUnsafe(`
    SELECT
      q.*,
      d.full_name AS doctor_name,
      p.patient_uid,
      p.uhid,
      p.phone,
      p.whatsapp_number,
      COALESCE(NULLIF(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), ''), q.patient_name) AS registered_patient_name,
      pr.instructions,
      pr.diagnosis,
      pr.follow_up_date,
      pr.medications AS prescription_medications
    FROM pharmacy_prescription_queue q
    LEFT JOIN doctors d ON d.id = q.doctor_id
    LEFT JOIN patients p ON p.id = q.patient_id
    LEFT JOIN prescriptions pr ON pr.id = q.prescription_id
	    WHERE q.tenant_id = $1::int
	      AND q.hospital_id = $2::int
	      AND q.branch_id = $3::int
      AND COALESCE(q.is_deleted,false) = false
	      AND ($4::text = 'ALL' OR q.status = $4::varchar)
      AND (
        $5::text IS NULL
        OR lower(COALESCE(q.patient_name,'')) LIKE $5
        OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $5
        OR lower(COALESCE(p.uhid,'')) LIKE $5
        OR lower(COALESCE(p.patient_uid,'')) LIKE $5
        OR lower(COALESCE(q.prescription_uid,'')) LIKE $5
        OR lower(COALESCE(p.phone,'')) LIKE $5
        OR ($6::text <> '' AND regexp_replace(COALESCE(p.phone,''),'\\D','','g') LIKE '%' || $6)
        OR ($6::text <> '' AND regexp_replace(COALESCE(p.whatsapp_number,''),'\\D','','g') LIKE '%' || $6)
        OR ($6::text <> '' AND regexp_replace(COALESCE(q.patient_mobile,''),'\\D','','g') LIKE '%' || $6)
      )
    ORDER BY q.created_at ASC, q.id ASC
    LIMIT 250
    `,a.tenantId,a.hospitalId,a.branchId,s,p,u);return i.NextResponse.json((0,o.serialize)({rows:c}))}async function u(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,l=await e.json(),p=(0,o.toNumber)(l.queue_id),u=(0,o.text)(l.dispense_status)||"DISPENSED";if(!p)return i.NextResponse.json({error:"Prescription queue record is required."},{status:400});let E=(await d.prisma.$queryRawUnsafe(`
    SELECT *
    FROM pharmacy_prescription_queue
    WHERE id = $1::int
      AND tenant_id = $2::int
      AND hospital_id = $3::int
      AND branch_id = $4::int
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,p,a.tenantId,a.hospitalId,a.branchId))[0];if(!E)return i.NextResponse.json({error:"Prescription queue record not found."},{status:404});let _=Array.isArray(E.medications)?E.medications:[],R=_.length?_:[{name:"Prescription medicines",quantity:l.quantity}],m=0,h="RETURNED"===u||"RETURN_REQUESTED"===u;for(let e of R){let t=(0,o.text)(e.name||e.medicine_name)||"Medicine",i=(0,o.toDecimal)(e.quantity||l.quantity)??0,n=await d.prisma.$queryRawUnsafe(`
      SELECT selling_price
      FROM clinical_medicine_master
	      WHERE tenant_id = $1::int
	        AND hospital_id = $2::int
	        AND branch_id = $3::int
	        AND lower(medicine_name) = lower($4::text)
        AND COALESCE(is_deleted,false) = false
      ORDER BY id DESC
      LIMIT 1
      `,a.tenantId,a.hospitalId,a.branchId,t),r=(0,o.toDecimal)(e.price||e.selling_price||n[0]?.selling_price)??100;m+=i>0?i*r:r,await d.prisma.$executeRawUnsafe(`
      INSERT INTO clinical_pharmacy_dispenses (
        tenant_id,hospital_id,branch_id,clinic_id,queue_id,prescription_id,patient_id,
        medicine_name,quantity,dispense_status,notes,created_by,updated_by,created_at,updated_at,is_deleted
      )
	      VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::int,$7::int,$8::text,$9::numeric,$10::varchar,$11::text,$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,p,E.prescription_id,E.patient_id,t,i,u,(0,o.nullableText)(l.notes),a.user.id??null),h&&i>0?await d.prisma.$executeRawUnsafe(`
        UPDATE clinical_medicine_master
	        SET stock_quantity = COALESCE(stock_quantity,0) + $5::numeric,
	            updated_by = $6::int,
            updated_at = CURRENT_TIMESTAMP
	        WHERE tenant_id = $1::int
	          AND hospital_id = $2::int
	          AND branch_id = $3::int
	          AND lower(medicine_name) = lower($4::text)
          AND COALESCE(is_deleted,false) = false
        `,a.tenantId,a.hospitalId,a.branchId,t,i,a.user.id??null):c(u)&&i>0&&await d.prisma.$executeRawUnsafe(`
        UPDATE clinical_medicine_master
	        SET stock_quantity = GREATEST(COALESCE(stock_quantity,0) - $5::numeric, 0),
	            updated_by = $6::int,
            updated_at = CURRENT_TIMESTAMP
	        WHERE tenant_id = $1::int
	          AND hospital_id = $2::int
	          AND branch_id = $3::int
	          AND lower(medicine_name) = lower($4::text)
          AND COALESCE(is_deleted,false) = false
        `,a.tenantId,a.hospitalId,a.branchId,t,i,a.user.id??null)}let A=h?"RETURNED":"OUT_OF_STOCK"===u?"OUT_OF_STOCK":"PARTIAL_DISPENSE"===u?"PARTIAL_DISPENSE":"COMPLETED",N=null;h&&(N=(await d.prisma.$queryRawUnsafe(`
      INSERT INTO pharmacy_customer_returns (
        tenant_id,hospital_id,branch_id,clinic_id,return_number,sale_id,patient_id,reason,approval_status,status,
        created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,NULL,$6,$7,'ELIGIBLE','RETURNED',$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,`RET-${Date.now()}`,E.patient_id,(0,o.nullableText)(l.notes)||"Medicine returned by patient.",a.user.id??null))[0]||null);let C=await d.prisma.$queryRawUnsafe(`
    UPDATE pharmacy_prescription_queue
    SET status = $5::varchar,
        dispensed_at = CASE WHEN $5::text = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE dispensed_at END,
        notes = COALESCE($6::text, notes),
        updated_by = $7::int,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1::int
      AND tenant_id = $2::int
      AND hospital_id = $3::int
      AND branch_id = $4::int
    RETURNING *
    `,p,a.tenantId,a.hospitalId,a.branchId,A,(0,o.nullableText)(l.notes),a.user.id??null);return await d.prisma.$executeRawUnsafe(`
    UPDATE prescriptions
    SET pharmacy_status = $5::varchar,
        updated_by = $6::int,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1::int
      AND tenant_id = $2::int
      AND hospital_id = $3::int
      AND branch_id = $4::int
    `,E.prescription_id,a.tenantId,a.hospitalId,a.branchId,A,a.user.id??null),await (0,o.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,o.toNumber)(E.appointment_id),workflowStage:"PHARMACY",status:A,summary:`Pharmacy ${A.toLowerCase().replaceAll("_"," ")} for prescription ${E.prescription_uid||E.prescription_id}.`,sourceTable:"pharmacy_prescription_queue",sourceId:p,metadata:C[0]}),h&&await (0,o.recordWorkflowEvent)(a,{patientId:Number(E.patient_id),appointmentId:(0,o.toNumber)(E.appointment_id),workflowStage:"PHARMACY_RETURN",status:"RETURNED",summary:`Medicine return captured for prescription ${E.prescription_uid||E.prescription_id}. Refund eligibility: ${m||0}.`,sourceTable:"pharmacy_customer_returns",sourceId:N?.id?Number(N.id):p,metadata:{return_record:N,refund_eligible_amount:m||0}}),("COMPLETED"===A||"PARTIAL_DISPENSE"===A)&&await (0,s.createBillingItemForWorkflow)(a,{moduleKey:"pharmacy",patientId:Number(E.patient_id),sourceRecordId:p,description:`Pharmacy medicines for ${E.prescription_uid||E.prescription_id}`,amount:m||100}),"COMPLETED"===A&&await (0,r.queueClinicalWorkflowNotification)(a,{templateKey:"medicines_dispensed",patientId:Number(E.patient_id),appointmentId:(0,o.toNumber)(E.appointment_id),sourceModule:"pharmacy_prescription_queue",sourceRecordId:p,variables:{prescription_number:E.prescription_uid||E.prescription_id,amount:m||0}}),await (0,n.recordClinicalAudit)(a,{moduleName:"pharmacy_dispense",action:"dispense",entityType:"pharmacy_prescription_queue",entityId:p,summary:"Pharmacy dispensing status updated",payload:C[0]}),i.NextResponse.json((0,o.serialize)(C[0]))}[n,r,s,o,d]=l.then?(await l)():l;let c=e=>"DISPENSED"===e||"PARTIAL_DISPENSE"===e;e.s(["GET",0,p,"POST",0,u]),a()}catch(e){a(e)}},!1),644157,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),s=e.i(759756),o=e.i(561916),d=e.i(174677),l=e.i(869741),p=e.i(316795),u=e.i(487718),c=e.i(995169),E=e.i(47587),_=e.i(666012),R=e.i(570101),m=e.i(626937),h=e.i(10372),A=e.i(193695);e.i(52474);var N=e.i(600220),C=e.i(761730),I=t([C]);[C]=I.then?(await I)():I;let $=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/operations/pharmacy-dispense/route",pathname:"/api/clinical/operations/pharmacy-dispense",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/operations/pharmacy-dispense/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:w,workUnitAsyncStorage:S,serverHooks:y}=$;async function T(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),$.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/operations/pharmacy-dispense/route";i=i.replace(/\/index$/,"")||"/";let r=await $.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,deploymentId:I,params:T,nextConfig:w,parsedUrl:S,isDraftMode:y,prerenderManifest:f,routerServerContext:D,isOnDemandRevalidate:O,revalidateOnlyGenerated:b,resolvedPathname:L,clientReferenceManifest:q,serverActionsManifest:x}=r,g=(0,l.normalizeAppPath)(i),P=!!(f.dynamicRoutes[g]||f.routes[L]),v=async()=>((null==D?void 0:D.render404)?await D.render404(e,t,S,!1):t.end("This page could not be found"),null);if(P&&!y){let e=!!f.routes[L],t=f.dynamicRoutes[g];if(t&&!1===t.fallback&&!e){if(w.adapterPath)return await v();throw new A.NoFallbackError}}let U=null;!P||$.isDev||y||(U=L,U="/index"===U?"/":U);let M=!0===$.isDev||!P,H=P&&!M;x&&q&&(0,d.setManifestsSingleton)({page:i,clientReferenceManifest:q,serverActionsManifest:x});let k=e.method||"GET",K=(0,o.getTracer)(),F=K.getActiveScopeSpan(),W=!!(null==D?void 0:D.isWrappedByNextServer),j=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await $.getIncrementalCache(e,w,f,j);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let G={params:T,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:M,incrementalCache:B,cacheLifeProfiles:w.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>$.onRequestError(e,t,i,n,D)},sharedContext:{buildId:C,deploymentId:I}},V=new p.NodeNextRequest(e),Y=new p.NodeNextResponse(t),z=u.NextRequestAdapter.fromNodeNextRequest(V,(0,u.signalFromNodeResponse)(t));try{let r,s=async e=>$.handle(z,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=K.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${k} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${k} ${i}`)}),d=async r=>{var o,d;let l=async({previousCacheEntry:n})=>{try{if(!j&&O&&b&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(r);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let d=G.renderOpts.collectedTags;if(!P)return await (0,_.sendResponse)(V,Y,i,G.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,R.toNodeOutgoingHttpHeaders)(i.headers);d&&(t[h.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,n=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:O})},!1,D),t}},p=await $.handleResponse({req:e,nextConfig:w,cacheKey:U,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:b,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:j});if(!P)return null;if((null==p||null==(o=p.value)?void 0:o.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(d=p.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",O?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),y&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,R.fromNodeOutgoingHttpHeaders)(p.value.headers);return j&&P||u.delete(h.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,m.getCacheControlHeader)(p.cacheControl)),await (0,_.sendResponse)(V,Y,new Response(p.value.body,{headers:u,status:p.value.status||200})),null};W&&F?await d(F):(r=K.getActiveScopeSpan(),await K.withPropagatedContext(e.headers,()=>K.trace(c.BaseServerSpan.handleRequest,{spanName:`${k} ${i}`,kind:o.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},d),void 0,!W))}catch(t){if(t instanceof A.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:g,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:O})},!1,D),P)throw t;return await (0,_.sendResponse)(V,Y,new Response(null,{status:500})),null}}e.s(["handler",0,T,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:S})},"routeModule",0,$,"serverHooks",0,y,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,S]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_04fd7fw._.js.map