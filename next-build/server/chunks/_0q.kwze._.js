module.exports=[435383,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(780907),r=e.i(826267),o=e.i(15270),s=t([i,o]);[i,o]=s.then?(await s)():s;let E={reconciliation:"Financial Reconciliation","shift-closing":"Shift Closing","daily-collections":"Daily Collections","outstanding-receivables":"Outstanding Receivables",revenue:"Revenue Report"},f=e=>{let t=Number(e);return Number.isFinite(t)?t:0},C=e=>{let t=String(e??"");return`"${t.replace(/"/g,'""')}"`};async function l(e,t,a,n,i){return o.prisma.$queryRawUnsafe(`
    SELECT
      COALESCE(payment_mode, payment_method, 'Unspecified') AS payment_mode,
      COUNT(*)::int AS payment_count,
      COALESCE(SUM(amount),0)::numeric AS total_amount
    FROM payments
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND payment_date BETWEEN $4::date AND $5::date
    GROUP BY COALESCE(payment_mode, payment_method, 'Unspecified')
    ORDER BY total_amount DESC
    `,e,t,a,n,i)}async function d(e,t,a,n,i){return o.prisma.$queryRawUnsafe(`
    SELECT
      i.id,
      i.invoice_number,
      i.invoice_date,
      COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
      p.uhid,
      i.total,
      i.paid_amount,
      COALESCE(i.balance_amount, i.balance, 0) AS outstanding_amount,
      i.status
    FROM billing_invoices i
    LEFT JOIN patients p ON p.id=i.patient_id
    WHERE i.tenant_id=$1
      AND i.hospital_id=$2
      AND i.branch_id=$3
      AND COALESCE(i.is_deleted,false)=false
      AND i.invoice_date BETWEEN $4::date AND $5::date
      AND COALESCE(i.balance_amount, i.balance, 0) > 0
    ORDER BY i.invoice_date DESC, i.id DESC
    `,e,t,a,n,i)}async function u(e,t,a,n,i){return o.prisma.$queryRawUnsafe(`
    SELECT
      COALESCE(source_module, invoice_type, 'General') AS revenue_stream,
      COUNT(*)::int AS invoice_count,
      COALESCE(SUM(total),0)::numeric AS gross_revenue,
      COALESCE(SUM(paid_amount),0)::numeric AS collected_revenue,
      COALESCE(SUM(balance_amount),0)::numeric AS outstanding_revenue
    FROM billing_invoices
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND invoice_date BETWEEN $4::date AND $5::date
    GROUP BY COALESCE(source_module, invoice_type, 'General')
    ORDER BY gross_revenue DESC
    `,e,t,a,n,i)}async function c(e,t,a,n,i){let[r,s]=await Promise.all([l(e,t,a,n,i),o.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(status,'Unspecified') AS refund_status,
        COUNT(*)::int AS refund_count,
        COALESCE(SUM(COALESCE(amount, refund_amount, 0)),0)::numeric AS refund_amount
      FROM refunds
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND created_at::date BETWEEN $4::date AND $5::date
      GROUP BY COALESCE(status,'Unspecified')
      ORDER BY refund_amount DESC
      `,e,t,a,n,i)]),d=r.reduce((e,t)=>e+f(t.total_amount),0),u=s.reduce((e,t)=>e+f(t.refund_amount),0);return[...r.map(e=>({category:"Collection",mode_or_status:e.payment_mode,count:e.payment_count,amount:e.total_amount})),...s.map(e=>({category:"Refund",mode_or_status:e.refund_status,count:e.refund_count,amount:e.refund_amount})),{category:"Net",mode_or_status:"Collections minus refunds",count:"",amount:d-u}]}async function p(e,t,a,n,i){let r=await l(e,t,a,n,i),o=r.reduce((e,t)=>e+f(t.total_amount),0);return[...r.map(e=>({closing_item:e.payment_mode,transaction_count:e.payment_count,expected_amount:e.total_amount,variance:0,status:"READY_FOR_CLOSING"})),{closing_item:"Total",transaction_count:r.reduce((e,t)=>e+f(t.payment_count),0),expected_amount:o,variance:0,status:"BALANCED"}]}async function _(e,t,a,n,i,r){return"daily-collections"===e?l(t,a,n,i,r):"outstanding-receivables"===e?d(t,a,n,i,r):"revenue"===e?u(t,a,n,i,r):"reconciliation"===e?c(t,a,n,i,r):p(t,a,n,i,r)}async function m(e,t,a,n,i){let r=JSON.stringify({fromDate:a,toDate:n,rows:i}),s=i.reduce((e,t)=>e+f(t.total_amount)+f(t.gross_revenue)+f(t.outstanding_amount)+f(t.amount)+f(t.expected_amount),0);"daily-collections"===e?await o.prisma.$executeRawUnsafe(`
      INSERT INTO daily_collections (tenant_id,hospital_id,branch_id,collection_date,total_collected,total_transactions,collection_breakdown,created_by)
      VALUES ($1,$2,$3,$4::date,$5,$6,$7::jsonb,$8)
      `,t.tenantId,t.hospitalId,t.branchId,n,s,i.reduce((e,t)=>e+f(t.payment_count),0),r,t.user.id??null):"outstanding-receivables"===e?await o.prisma.$executeRawUnsafe(`
      INSERT INTO outstanding_receivables (tenant_id,hospital_id,branch_id,report_date,total_outstanding,invoice_count,aging_breakdown,created_by)
      VALUES ($1,$2,$3,$4::date,$5,$6,$7::jsonb,$8)
      `,t.tenantId,t.hospitalId,t.branchId,n,s,i.length,r,t.user.id??null):"revenue"===e&&await o.prisma.$executeRawUnsafe(`
      INSERT INTO revenue_report_snapshots (tenant_id,hospital_id,branch_id,report_name,period_start,period_end,gross_revenue,collected_revenue,outstanding_revenue,report_payload,created_by)
      VALUES ($1,$2,$3,$4,$5::date,$6::date,$7,$8,$9,$10::jsonb,$11)
      `,t.tenantId,t.hospitalId,t.branchId,E[e],a,n,i.reduce((e,t)=>e+f(t.gross_revenue),0),i.reduce((e,t)=>e+f(t.collected_revenue),0),i.reduce((e,t)=>e+f(t.outstanding_revenue),0),r,t.user.id??null)}async function h(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,o=new URL(e.url),s=o.searchParams.get("report")||"daily-collections";if(!Object.prototype.hasOwnProperty.call(E,s))return n.NextResponse.json({error:"Unsupported finance report."},{status:400});let l=new Date().toISOString().slice(0,10),d=o.searchParams.get("from")||l,u=o.searchParams.get("to")||l,c=await _(s,a.tenantId,a.hospitalId,a.branchId,d,u);if(await (0,i.recordClinicalAudit)(a,{moduleName:"clinical_finance_reports",action:"read_report",entityType:s,summary:`${E[s]} generated`,payload:{report:s,fromDate:d,toDate:u,rowCount:c.length}}),"true"===o.searchParams.get("snapshot")&&await m(s,a,d,u,c),"csv"===o.searchParams.get("format")){let e=Object.keys(c[0]||{report:s}),t=[e.map(C).join(","),...c.map(t=>e.map(e=>C(t[e])).join(","))].join("\n");return new Response(t,{headers:{"Content-Type":"text/csv","Content-Disposition":`attachment; filename="${s}-${d}-${u}.csv"`}})}if("pdf"===o.searchParams.get("format")){let e=Object.keys(c[0]||{report:s}).slice(0,6),t=await (0,r.renderClinicalPdf)(a,{title:E[s],subtitle:`${d} to ${u}`,documentNumber:`${s}-${d}-${u}`,qrText:`finance:${s}:${d}:${u}:tenant:${a.tenantId}:hospital:${a.hospitalId}:branch:${a.branchId}`,signatureLabel:"Finance Authorized Signature",sections:[{title:"Report Records",table:{columns:e.map(t=>({key:t,label:t.replace(/_/g," ").toUpperCase(),width:Math.floor(510/Math.max(e.length,1))})),rows:c}}]});return(0,r.pdfResponse)(t,`${s}-${d}-${u}.pdf`)}return n.NextResponse.json({report:s,title:E[s],scope:{tenant_id:a.tenantId,hospital_id:a.hospitalId,branch_id:a.branchId},fromDate:d,toDate:u,rows:c})}e.s(["GET",0,h,"runtime",0,"nodejs"]),a()}catch(e){a(e)}},!1),898748,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),o=e.i(759756),s=e.i(561916),l=e.i(174677),d=e.i(869741),u=e.i(316795),c=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),h=e.i(570101),E=e.i(626937),f=e.i(10372),C=e.i(193695);e.i(52474);var R=e.i(600220),A=e.i(435383),v=t([A]);[A]=v.then?(await v)():v;let y=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/clinical/finance/hardening/route",pathname:"/api/clinical/finance/hardening",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/finance/hardening/route.ts",nextConfigOutput:"",userland:A,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:$,serverHooks:N}=y;async function g(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),y.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/clinical/finance/hardening/route";n=n.replace(/\/index$/,"")||"/";let r=await y.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,deploymentId:v,params:g,nextConfig:S,parsedUrl:$,isDraftMode:N,prerenderManifest:b,routerServerContext:O,isOnDemandRevalidate:w,revalidateOnlyGenerated:D,resolvedPathname:T,clientReferenceManifest:x,serverActionsManifest:U}=r,I=(0,d.normalizeAppPath)(n),L=!!(b.dynamicRoutes[I]||b.routes[T]),P=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,$,!1):t.end("This page could not be found"),null);if(L&&!N){let e=!!b.routes[T],t=b.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await P();throw new C.NoFallbackError}}let M=null;!L||y.isDev||N||(M=T,M="/index"===M?"/":M);let q=!0===y.isDev||!L,H=L&&!q;U&&x&&(0,l.setManifestsSingleton)({page:n,clientReferenceManifest:x,serverActionsManifest:U});let j=e.method||"GET",k=(0,s.getTracer)(),B=k.getActiveScopeSpan(),F=!!(null==O?void 0:O.isWrappedByNextServer),W=!!(0,o.getRequestMeta)(e,"minimalMode"),G=(0,o.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,S,b,W);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let K={params:g,previewProps:b.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:q,incrementalCache:G,cacheLifeProfiles:S.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>y.onRequestError(e,t,n,i,O)},sharedContext:{buildId:A,deploymentId:v}},Y=new u.NodeNextRequest(e),V=new u.NodeNextResponse(t),X=c.NextRequestAdapter.fromNodeNextRequest(Y,(0,c.signalFromNodeResponse)(t));try{let r,o=async e=>y.handle(X,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=k.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${j} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${j} ${n}`)}),l=async r=>{var s,l;let d=async({previousCacheEntry:i})=>{try{if(!W&&w&&D&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(r);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=K.renderOpts.collectedTags;if(!L)return await (0,m.sendResponse)(Y,V,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,i=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:w})},!1,O),t}},u=await y.handleResponse({req:e,nextConfig:S,cacheKey:M,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:b,isRoutePPREnabled:!1,isOnDemandRevalidate:w,revalidateOnlyGenerated:D,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:W});if(!L)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",w?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return W&&L||c.delete(f.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,E.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(Y,V,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};F&&B?await l(B):(r=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${j} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},l),void 0,!F))}catch(t){if(t instanceof C.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:w})},!1,O),L)throw t;return await (0,m.sendResponse)(Y,V,new Response(null,{status:500})),null}}e.s(["handler",0,g,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:$})},"routeModule",0,y,"serverHooks",0,N,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,$]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0q.kwze._.js.map