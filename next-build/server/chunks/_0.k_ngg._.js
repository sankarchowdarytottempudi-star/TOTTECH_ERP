module.exports=[437614,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(780907),r=e.i(679504),l=e.i(15270),s=t([i,r,l]);[i,r,l]=s.then?(await s)():s;let u=e=>String(e||"").trim(),c=e=>{let t=Number(e);return Number.isFinite(t)?t:null};async function o(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,{searchParams:r}=new URL(e.url),s=r.get("q")?.trim()||"",o=s?`%${s.toLowerCase()}%`:null,d=await l.prisma.$queryRawUnsafe(`
      SELECT
        p.*,
        COUNT(DISTINCT a.id)::int AS appointment_count,
        COUNT(DISTINCT mr.id)::int AS record_count,
        COUNT(DISTINCT ivf.id)::int AS ivf_case_count
      FROM patients p
      LEFT JOIN appointments a ON a.patient_id = p.id AND COALESCE(a.is_deleted,false) = false
      LEFT JOIN medical_records mr ON mr.patient_id = p.id AND COALESCE(mr.is_deleted,false) = false
      LEFT JOIN ivf_cases ivf ON ivf.patient_id = p.id AND COALESCE(ivf.is_deleted,false) = false
      WHERE p.tenant_id = $1
        AND p.hospital_id = $2
        AND p.branch_id = $3
        AND COALESCE(p.is_deleted, false) = false
        AND (
          $4::text IS NULL
          OR lower(p.patient_uid) LIKE $4::text
          OR lower(COALESCE(p.uhid, '')) LIKE $4::text
          OR lower(COALESCE(p.abha_id, '')) LIKE $4::text
          OR lower(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')) LIKE $4::text
          OR lower(COALESCE(p.phone, '')) LIKE $4::text
          OR lower(COALESCE(p.whatsapp_number, '')) LIKE $4::text
          OR lower(COALESCE(p.email, '')) LIKE $4::text
        )
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 250
      `,a.tenantId,a.hospitalId,a.branchId,o);return n.NextResponse.json({patients:d})}async function d(e){let t,a,s,o,d,p,_,m,h,R,E,$,f,C,N,I,y,g,w,v,T,b,A,O,S,x,L,P,U,D,M,q,H,j,k,F,K=await (0,i.requireClinicalContext)(e);if(K.response)return K.response;let V=K.context,B=await e.json();if(!u(B.first_name))return n.NextResponse.json({error:"Patient first name is required."},{status:400});if(!u(B.last_name))return n.NextResponse.json({error:"Patient last name is required."},{status:400});if(!u(B.gender))return n.NextResponse.json({error:"Patient gender is required."},{status:400});if(!u(B.date_of_birth))return n.NextResponse.json({error:"Patient date of birth is required."},{status:400});let G=`PAT-${Date.now()}`,J=u(B.uhid)||`UHID-${Date.now()}`,W=(await l.prisma.$queryRawUnsafe(`
      INSERT INTO patients (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        patient_uid,
        uhid,
        abha_id,
        aadhaar_number,
        passport_number,
        first_name,
        middle_name,
        last_name,
        gender,
        date_of_birth,
        age_years,
        blood_group,
        marital_status,
        nationality,
        religion,
        occupation,
        phone,
        alternate_mobile,
        email,
        whatsapp_number,
        address,
        address_line1,
        address_line2,
        landmark,
        city,
        district,
        state,
        country,
        pincode,
        emergency_contact_name,
        emergency_relationship,
        emergency_contact_phone,
        emergency_address,
        insurance_provider,
        insurance_number,
        policy_validity,
        tpa,
        coverage_amount,
        referral_type,
        referral_code,
        referral_name,
        commission_plan,
        allergies,
        medical_history,
        consent_captured_at,
        qr_payload,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::date,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40::date,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50::jsonb,$51::jsonb,$52,$52,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING *
      `,V.tenantId,V.clinicId,V.hospitalId,V.branchId,G,J,(t=B.abha_id,u(t)||null),(a=B.aadhaar_number,u(a)||null),(s=B.passport_number,u(s)||null),u(B.first_name),(o=B.middle_name,u(o)||null),u(B.last_name),u(B.gender),u(B.date_of_birth),c(B.age_years),(d=B.blood_group,u(d)||null),(p=B.marital_status,u(p)||null),(_=B.nationality,u(_)||null),(m=B.religion,u(m)||null),(h=B.occupation,u(h)||null),(R=B.phone,u(R)||null),(E=B.alternate_mobile,u(E)||null),($=B.email,u($)||null),(f=B.whatsapp_number,u(f)||null),(C=B.address,u(C)||null),(N=B.address_line1,u(N)||null),(I=B.address_line2,u(I)||null),(y=B.landmark,u(y)||null),(g=B.city,u(g)||null),(w=B.district,u(w)||null),(v=B.state,u(v)||null),(T=B.country,u(T)||"India"),(b=B.pincode,u(b)||null),(A=B.emergency_contact_name,u(A)||null),(O=B.emergency_relationship,u(O)||null),(S=B.emergency_contact_phone,u(S)||null),(x=B.emergency_address,u(x)||null),(L=B.insurance_provider,u(L)||null),(P=B.insurance_number,u(P)||null),(U=B.policy_validity,u(U)||null),(D=B.tpa,u(D)||null),c(B.coverage_amount),(M=B.referral_type,u(M)||null),(q=B.referral_code,u(q)||null),(H=B.referral_name,u(H)||null),(j=B.commission_plan,u(j)||null),(k=B.allergies,u(k)||null),(F=B.medical_history,u(F)||null),B.consent_captured_at?new Date(B.consent_captured_at):null,JSON.stringify({patient_uid:G,uhid:J,clinic_id:V.clinicId,hospital_id:V.hospitalId,branch_id:V.branchId}),JSON.stringify(B.metadata||{}),V.user.id??null))[0],X=!0===B.ivf_patient||"true"===u(B.ivf_patient).toLowerCase()||"yes"===u(B.ivf_patient).toLowerCase()||"IVF"===u(B.patient_type).toUpperCase();return X&&await l.prisma.$executeRawUnsafe(`
      INSERT INTO ivf_cases (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        patient_id,
        case_uid,
        cycle_status,
        notes,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE','Created from IVF patient registration checkbox',$7::jsonb,$8,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (case_uid) DO NOTHING
      `,V.tenantId,V.hospitalId,V.branchId,V.clinicId,Number(W.id),`IVFCASE-${Date.now()}`,JSON.stringify({source:"patient_registration",ivf_patient:!0}),V.user.id??null),await (0,i.recordClinicalAudit)(V,{moduleName:"patients",action:"create",entityType:"patient",entityId:Number(W.id),summary:"Clinical patient registered",payload:{patient_uid:G,ivf_patient:X}}),await l.prisma.$executeRawUnsafe(`
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
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,'REGISTRATION','Patient Registered','Patient registration and UHID created','patients',$5,$6,$6,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,V.tenantId,V.hospitalId,V.branchId,V.clinicId,Number(W.id),V.user.id??null),await (0,r.queueClinicalWorkflowNotification)(V,{templateKey:"patient_registration_success",patientId:Number(W.id),sourceModule:"patients",sourceRecordId:Number(W.id),variables:{registration_date:new Date().toLocaleString("en-IN")}}),n.NextResponse.json(W,{status:201})}e.s(["GET",0,o,"POST",0,d]),a()}catch(e){a(e)}},!1),491151,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),l=e.i(759756),s=e.i(561916),o=e.i(174677),d=e.i(869741),u=e.i(316795),c=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),h=e.i(570101),R=e.i(626937),E=e.i(10372),$=e.i(193695);e.i(52474);var f=e.i(600220),C=e.i(437614),N=t([C]);[C]=N.then?(await N)():N;let y=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/clinical/patients/route",pathname:"/api/clinical/patients",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/patients/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:w,serverHooks:v}=y;async function I(e,t,a){a.requestMeta&&(0,l.setRequestMeta)(e,a.requestMeta),y.isDev&&(0,l.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/clinical/patients/route";n=n.replace(/\/index$/,"")||"/";let r=await y.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,deploymentId:N,params:I,nextConfig:g,parsedUrl:w,isDraftMode:v,prerenderManifest:T,routerServerContext:b,isOnDemandRevalidate:A,revalidateOnlyGenerated:O,resolvedPathname:S,clientReferenceManifest:x,serverActionsManifest:L}=r,P=(0,d.normalizeAppPath)(n),U=!!(T.dynamicRoutes[P]||T.routes[S]),D=async()=>((null==b?void 0:b.render404)?await b.render404(e,t,w,!1):t.end("This page could not be found"),null);if(U&&!v){let e=!!T.routes[S],t=T.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(g.adapterPath)return await D();throw new $.NoFallbackError}}let M=null;!U||y.isDev||v||(M=S,M="/index"===M?"/":M);let q=!0===y.isDev||!U,H=U&&!q;L&&x&&(0,o.setManifestsSingleton)({page:n,clientReferenceManifest:x,serverActionsManifest:L});let j=e.method||"GET",k=(0,s.getTracer)(),F=k.getActiveScopeSpan(),K=!!(null==b?void 0:b.isWrappedByNextServer),V=!!(0,l.getRequestMeta)(e,"minimalMode"),B=(0,l.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,g,T,V);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let G={params:I,previewProps:T.preview,renderOpts:{experimental:{authInterrupts:!!g.experimental.authInterrupts},cacheComponents:!!g.cacheComponents,supportsDynamicResponse:q,incrementalCache:B,cacheLifeProfiles:g.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>y.onRequestError(e,t,n,i,b)},sharedContext:{buildId:C,deploymentId:N}},J=new u.NodeNextRequest(e),W=new u.NodeNextResponse(t),X=c.NextRequestAdapter.fromNodeNextRequest(J,(0,c.signalFromNodeResponse)(t));try{let r,l=async e=>y.handle(X,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=k.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${j} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${j} ${n}`)}),o=async r=>{var s,o;let d=async({previousCacheEntry:i})=>{try{if(!V&&A&&O&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await l(r);e.fetchMetrics=G.renderOpts.fetchMetrics;let s=G.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let o=G.renderOpts.collectedTags;if(!U)return await (0,m.sendResponse)(J,W,n,G.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);o&&(t[E.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,i=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:A})},!1,b),t}},u=await y.handleResponse({req:e,nextConfig:g,cacheKey:M,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:O,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:V});if(!U)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});V||t.setHeader("x-nextjs-cache",A?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),v&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return V&&U||c.delete(E.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(J,W,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};K&&F?await o(F):(r=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${j} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},o),void 0,!K))}catch(t){if(t instanceof $.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:A})},!1,b),U)throw t;return await (0,m.sendResponse)(J,W,new Response(null,{status:500})),null}}e.s(["handler",0,I,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:w})},"routeModule",0,y,"serverHooks",0,v,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,w]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0.k_ngg._.js.map