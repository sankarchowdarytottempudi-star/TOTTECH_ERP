module.exports=[802187,e=>e.a(async(t,a)=>{try{var r=e.i(89171),n=e.i(780907),i=e.i(15270),l=t([n,i]);[n,i]=l.then?(await l)():l;let o=e=>{let t=Number(e);return Number.isFinite(t)?t:0},d=(e,t)=>{if(!e)return t;let a=new Date(String(e));return Number.isNaN(a.getTime())?t:a.toISOString().slice(0,10)},c=(e,t)=>{let a=new Map;return e.forEach(e=>{let r=String(e[t]||"Not recorded");a.set(r,(a.get(r)||0)+1)}),Array.from(a.entries()).map(([e,t])=>({name:e,value:t}))},u=(e,t)=>e.reduce((e,a)=>e+o(a[t]),0),p=(e,t,a)=>e.slice().reverse().map((e,r)=>{let n={name:d(e[t],`Record ${r+1}`)};return a.forEach(t=>{n[t]=o(e[t])}),n}),m=(e,t)=>{let a=[1,2,3,4,5].map(a=>o(e[`${t}_follicle_${a}`])).filter(e=>e>0);return a.length?Number((a.reduce((e,t)=>e+t,0)/a.length).toFixed(2)):0},_=(e,t,a)=>{let r=[t.tenantId,t.hospitalId,t.branchId],n=["tenant_id = $1","hospital_id = $2","branch_id = $3","COALESCE(is_deleted,false) = false"];return a?.coupleId&&(r.push(a.coupleId),n.push(`couple_id = $${r.length}`)),i.prisma.$queryRawUnsafe(`
    SELECT *
    FROM ${e}
    WHERE ${n.join(" AND ")}
    ORDER BY ${a?.orderColumn||"created_at"} DESC NULLS LAST, id DESC
    LIMIT ${a?.limit||200}
    `,...r)},h=async(e,t)=>{let a=`%${e.toLowerCase()}%`;return i.prisma.$queryRawUnsafe(`
    SELECT *
    FROM (
      SELECT
        'couple' AS result_type,
        c.id AS couple_id,
        NULL::integer AS patient_id,
        NULL::integer AS cycle_id,
        c.couple_number AS primary_label,
        CONCAT_WS(' / ', c.female_name, c.male_name) AS secondary_label,
        CONCAT_WS(' ', fp.uhid, mp.uhid) AS uhid,
        CONCAT_WS(' ', fp.phone, mp.phone) AS phone
      FROM ivf_couples c
      LEFT JOIN patients fp ON fp.id = c.female_patient_id
      LEFT JOIN patients mp ON mp.id = c.male_patient_id
      WHERE c.tenant_id = $1
        AND c.hospital_id = $2
        AND c.branch_id = $3
        AND COALESCE(c.is_deleted,false) = false
        AND LOWER(CONCAT_WS(' ', c.couple_number, c.female_name, c.male_name, fp.uhid, mp.uhid, fp.patient_uid, mp.patient_uid, fp.phone, mp.phone, fp.abha_id, mp.abha_id)) LIKE $4

      UNION ALL

      SELECT
        'patient' AS result_type,
        c.id AS couple_id,
        p.id AS patient_id,
        NULL::integer AS cycle_id,
        CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name) AS primary_label,
        CONCAT('UHID ', COALESCE(p.uhid, p.patient_uid, '-'), ' | ', COALESCE(p.phone, '-')) AS secondary_label,
        COALESCE(p.uhid, p.patient_uid, '') AS uhid,
        COALESCE(p.phone, p.whatsapp_number, '') AS phone
      FROM patients p
      JOIN ivf_couples c ON p.id IN (c.female_patient_id, c.male_patient_id)
      WHERE p.tenant_id = $1
        AND p.hospital_id = $2
        AND p.branch_id = $3
        AND COALESCE(p.is_deleted,false) = false
        AND COALESCE(c.is_deleted,false) = false
        AND LOWER(CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name, p.uhid, p.patient_uid, p.phone, p.whatsapp_number, p.abha_id, c.couple_number)) LIKE $4

      UNION ALL

      SELECT
        'cycle' AS result_type,
        c.id AS couple_id,
        cyc.patient_id AS patient_id,
        cyc.id AS cycle_id,
        cyc.cycle_number AS primary_label,
        CONCAT_WS(' | ', c.couple_number, cyc.cycle_type, cyc.status) AS secondary_label,
        CONCAT_WS(' ', fp.uhid, mp.uhid) AS uhid,
        CONCAT_WS(' ', fp.phone, mp.phone) AS phone
      FROM ivf_cycles cyc
      JOIN ivf_couples c ON c.id = cyc.couple_id
      LEFT JOIN patients fp ON fp.id = c.female_patient_id
      LEFT JOIN patients mp ON mp.id = c.male_patient_id
      WHERE cyc.tenant_id = $1
        AND cyc.hospital_id = $2
        AND cyc.branch_id = $3
        AND COALESCE(cyc.is_deleted,false) = false
        AND COALESCE(c.is_deleted,false) = false
        AND LOWER(CONCAT_WS(' ', cyc.cycle_number, cyc.cycle_type, cyc.status, cyc.outcome, c.couple_number, c.female_name, c.male_name)) LIKE $4
    ) matches
    ORDER BY result_type, primary_label
    LIMIT 12
    `,t.tenantId,t.hospitalId,t.branchId,a)};async function s(e){var t;let a,l=await (0,n.requireClinicalContext)(e);if(l.response)return l.response;let s=l.context,{searchParams:f}=new URL(e.url),g=String(f.get("search")||"").trim(),C=(t=f.get("couple_id"),a=Number(t),Number.isFinite(a)&&a>0?a:null);if(g.length>=2){let e=await h(g,s);return r.NextResponse.json({context:s,suggestions:e})}if(!C){let e=await _("ivf_couples",s,{orderColumn:"created_at",limit:10});return r.NextResponse.json({context:s,recentCouples:e,suggestions:[]})}let v=await i.prisma.$queryRawUnsafe(`
    SELECT
      c.*,
      fp.uhid AS female_uhid,
      fp.patient_uid AS female_patient_uid,
      fp.phone AS female_phone,
      mp.uhid AS male_uhid,
      mp.patient_uid AS male_patient_uid,
      mp.phone AS male_phone
    FROM ivf_couples c
    LEFT JOIN patients fp ON fp.id = c.female_patient_id
    LEFT JOIN patients mp ON mp.id = c.male_patient_id
    WHERE c.id = $1
      AND c.tenant_id = $2
      AND c.hospital_id = $3
      AND c.branch_id = $4
      AND COALESCE(c.is_deleted,false) = false
    LIMIT 1
    `,C,s.tenantId,s.hospitalId,s.branchId);if(!v.length)return r.NextResponse.json({error:"IVF couple context was not found."},{status:404});let[y,E,S,A,N,R,b,O,T,w,I,L,D]=await Promise.all([_("ivf_female_assessments",s,{coupleId:C,orderColumn:"assessment_date"}),_("ivf_male_assessments",s,{coupleId:C,orderColumn:"assessment_date"}),_("ivf_cycles",s,{coupleId:C,orderColumn:"start_date"}),_("ivf_stimulation_records",s,{coupleId:C,orderColumn:"monitoring_date"}),_("ivf_follicle_tracking",s,{coupleId:C,orderColumn:"tracking_date"}),_("ivf_retrievals",s,{coupleId:C,orderColumn:"retrieval_date"}),_("ivf_fertilization_records",s,{coupleId:C,orderColumn:"created_at"}),_("ivf_embryos",s,{coupleId:C,orderColumn:"creation_date"}),_("ivf_freezing_records",s,{coupleId:C,orderColumn:"freezing_date"}),_("ivf_embryo_transfers",s,{coupleId:C,orderColumn:"transfer_date"}),_("ivf_pregnancies",s,{coupleId:C,orderColumn:"beta_hcg_date"}),_("ivf_donors",s,{orderColumn:"created_at",limit:100}),_("ivf_surrogates",s,{orderColumn:"created_at",limit:100})]),$=N.slice().reverse().map((e,t)=>({name:d(e.tracking_date,`Day ${t+1}`),right:m(e,"right"),left:m(e,"left"),endometrium:o(e.endometrial_thickness)})),U=I.filter(e=>String(e.beta_hcg_status||"").toUpperCase().includes("POSITIVE")).length,x=I.filter(e=>!0===e.heartbeat).length,P=I.filter(e=>String(e.pregnancy_outcome||e.status||"").toUpperCase().includes("DELIVER")).length;return r.NextResponse.json({context:s,couple:v[0],records:{femaleAssessments:y,maleAssessments:E,cycles:S,stimulation:A,follicleTracking:N,retrievals:R,fertilization:b,embryos:O,freezing:T,transfers:w,pregnancies:I,donors:L,surrogates:D},analytics:{femaleAssessmentTrend:p(y,"assessment_date",["amh","fsh","right_ovary_afc","left_ovary_afc"]).map(e=>({...e,afc:o(e.right_ovary_afc)+o(e.left_ovary_afc),bmi:o(v[0].female_bmi)})),femaleHormoneTrend:p(y,"assessment_date",["lh","estradiol","progesterone","tsh","prolactin"]),maleAssessmentTrend:p(E,"assessment_date",["sperm_count","motility","morphology"]),cycleTimeline:S.slice().reverse().map((e,t)=>({name:String(e.cycle_number||`Cycle ${t+1}`),date:d(e.start_date||e.created_at,`Cycle ${t+1}`),status:String(e.status||"Not recorded"),outcome:String(e.outcome||"Pending")})),cycleStatus:c(S,"status"),cycleOutcomes:c(S,"outcome"),follicleGrowth:$,medicationTimeline:A.slice().reverse().map((e,t)=>({name:d(e.monitoring_date,`Day ${e.cycle_day||t+1}`),medication:String(e.medication||"Medication not recorded"),dose:String(e.dose||"-"),status:String(e.status||"-")})),retrievalBreakdown:[{name:"Retrieved Eggs",value:u(R,"oocytes_retrieved")},{name:"Mature Eggs",value:u(R,"mii")},{name:"Immature Eggs",value:u(R,"mi")+u(R,"gv")},{name:"Degenerated Eggs",value:u(R,"degenerated")}],embryologyBreakdown:[{name:"2PN",value:u(b,"two_pn")},{name:"4 Cell",value:O.filter(e=>String(e.day3_grade||e.embryo_grade||"").toUpperCase().includes("4")).length},{name:"8 Cell",value:O.filter(e=>String(e.day3_grade||e.embryo_grade||"").toUpperCase().includes("8")).length},{name:"Blastocyst",value:O.filter(e=>String(e.day5_grade||e.embryo_grade||"").toUpperCase().includes("BLAST")).length},{name:"Frozen",value:O.filter(e=>String(e.current_status||"").toUpperCase().includes("FROZEN")).length},{name:"Discarded",value:O.filter(e=>String(e.current_status||"").toUpperCase().includes("DISCARD")).length}],cryoBreakdown:[{name:"Frozen Embryos",value:T.filter(e=>String(e.status||"").toUpperCase().includes("FROZEN")).length},{name:"Frozen Oocytes",value:T.filter(e=>String(e.method||"").toUpperCase().includes("OOCYTE")).length},{name:"Frozen Sperm",value:T.filter(e=>String(e.method||"").toUpperCase().includes("SPERM")).length}],transferHistory:w.slice().reverse().map((e,t)=>({name:String(e.transfer_number||`Transfer ${t+1}`),date:d(e.transfer_date,`Transfer ${t+1}`),embryos:o(e.embryo_count),status:String(e.status||"Not recorded")})),transferSuccessRate:[{name:"Transfers",value:w.length},{name:"Positive Beta HCG",value:U},{name:"Heartbeat",value:x},{name:"Delivery",value:P}],donorUsage:c(L,"donor_type"),donorSuccessRate:c(L,"availability_status"),surrogacyProgress:c(D,"availability_status"),surrogacyMilestones:[{name:"Profiles",value:D.length},{name:"Legal Clearance",value:D.filter(e=>!0===e.legal_clearance).length},{name:"Available",value:D.filter(e=>String(e.availability_status||"").toUpperCase().includes("AVAILABLE")).length}],pregnancyFunnel:[{name:"Beta HCG",value:I.length},{name:"Heartbeat",value:x},{name:"12 Weeks",value:I.filter(e=>!0===e.gestational_sac).length},{name:"20 Weeks",value:I.filter(e=>String(e.status||"").toUpperCase().includes("ONGOING")).length},{name:"Delivery",value:P}]}})}e.s(["GET",0,s]),a()}catch(e){a(e)}},!1),645520,e=>e.a(async(t,a)=>{try{var r=e.i(747909),n=e.i(174017),i=e.i(996250),l=e.i(759756),s=e.i(561916),o=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),p=e.i(995169),m=e.i(47587),_=e.i(666012),h=e.i(570101),f=e.i(626937),g=e.i(10372),C=e.i(193695);e.i(52474);var v=e.i(600220),y=e.i(802187),E=t([y]);[y]=E.then?(await E)():E;let A=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/ivf/dashboard/route",pathname:"/api/clinical/ivf/dashboard",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/ivf/dashboard/route.ts",nextConfigOutput:"",userland:y,...{}}),{workAsyncStorage:N,workUnitAsyncStorage:R,serverHooks:b}=A;async function S(e,t,a){a.requestMeta&&(0,l.setRequestMeta)(e,a.requestMeta),A.isDev&&(0,l.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/clinical/ivf/dashboard/route";r=r.replace(/\/index$/,"")||"/";let i=await A.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:y,deploymentId:E,params:S,nextConfig:N,parsedUrl:R,isDraftMode:b,prerenderManifest:O,routerServerContext:T,isOnDemandRevalidate:w,revalidateOnlyGenerated:I,resolvedPathname:L,clientReferenceManifest:D,serverActionsManifest:$}=i,U=(0,d.normalizeAppPath)(r),x=!!(O.dynamicRoutes[U]||O.routes[L]),P=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,R,!1):t.end("This page could not be found"),null);if(x&&!b){let e=!!O.routes[L],t=O.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(N.adapterPath)return await P();throw new C.NoFallbackError}}let F=null;!x||A.isDev||b||(F=L,F="/index"===F?"/":F);let H=!0===A.isDev||!x,M=x&&!H;$&&D&&(0,o.setManifestsSingleton)({page:r,clientReferenceManifest:D,serverActionsManifest:$});let W=e.method||"GET",k=(0,s.getTracer)(),q=k.getActiveScopeSpan(),B=!!(null==T?void 0:T.isWrappedByNextServer),j=!!(0,l.getRequestMeta)(e,"minimalMode"),K=(0,l.getRequestMeta)(e,"incrementalCache")||await A.getIncrementalCache(e,N,O,j);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let z={params:S,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!N.experimental.authInterrupts},cacheComponents:!!N.cacheComponents,supportsDynamicResponse:H,incrementalCache:K,cacheLifeProfiles:N.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>A.onRequestError(e,t,r,n,T)},sharedContext:{buildId:y,deploymentId:E}},G=new c.NodeNextRequest(e),J=new c.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let i,l=async e=>A.handle(V,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=k.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${W} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",n),i.updateName(t))}else e.updateName(`${W} ${r}`)}),o=async i=>{var s,o;let d=async({previousCacheEntry:n})=>{try{if(!j&&w&&I&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await l(i);e.fetchMetrics=z.renderOpts.fetchMetrics;let s=z.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let o=z.renderOpts.collectedTags;if(!x)return await (0,_.sendResponse)(G,J,r,z.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(r.headers);o&&(t[g.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:w})},!1,T),t}},c=await A.handleResponse({req:e,nextConfig:N,cacheKey:F,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:w,revalidateOnlyGenerated:I,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:j});if(!x)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(o=c.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",w?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),b&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return j&&x||u.delete(g.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,f.getCacheControlHeader)(c.cacheControl)),await (0,_.sendResponse)(G,J,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};B&&q?await o(q):(i=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${W} ${r}`,kind:s.SpanKind.SERVER,attributes:{"http.method":W,"http.target":e.url}},o),void 0,!B))}catch(t){if(t instanceof C.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:w})},!1,T),x)throw t;return await (0,_.sendResponse)(G,J,new Response(null,{status:500})),null}}e.s(["handler",0,S,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:R})},"routeModule",0,A,"serverHooks",0,b,"workAsyncStorage",0,N,"workUnitAsyncStorage",0,R]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0t-0rky._.js.map