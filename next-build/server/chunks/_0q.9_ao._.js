module.exports=[618089,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(15270),r=e.i(493399),o=e.i(19754),s=e.i(527426),d=e.i(215619),u=e.i(410325),l=t([i,r,o,s,d,u]);[i,r,o,s,d,u]=l.then?(await l)():l;let E=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},m=e=>new Date(e.getFullYear(),e.getMonth(),e.getDate());async function c(e){let t=await (0,u.requireSchoolModule)("FINANCE");if(t.response)return t.response;let a=await (0,o.resolvePlatformContext)(e);if(!a)return n.NextResponse.json({error:"Unauthorized"},{status:401});let r=a.schoolId,s=a.academicYearId,d=await i.prisma.$queryRawUnsafe(`
      SELECT
        p.*,
        i.invoice_number,
        i.total_amount AS invoice_total_amount,
        i.paid_amount AS invoice_paid_amount,
        GREATEST(COALESCE(i.total_amount, 0) - COALESCE((
          SELECT SUM(p2.amount)
          FROM payments p2
          WHERE p2.invoice_id = i.id
        ), 0), 0) AS invoice_balance_amount,
        i.balance_amount,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        c.class_name,
        sec.section_name
      FROM payments p
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN students s ON s.id = p.student_id
      LEFT JOIN classes c ON c.id = p.class_id
      LEFT JOIN sections sec ON sec.id = p.section_id
      WHERE ($1::int IS NULL OR COALESCE(p.school_id, i.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
      ORDER BY p.created_at DESC
      LIMIT 250
      `,r,s);return n.NextResponse.json({payments:d})}async function p(e){let t=await (0,u.requireSchoolModule)("FINANCE");if(t.response)return t.response;let a=await (0,d.requirePermission)({module:"fees",action:"create"});if(a.response)return a.response;let l=await e.json(),c=await (0,o.resolvePlatformContext)(e);if(!c)return n.NextResponse.json({error:"Unauthorized"},{status:401});let p=E(l.invoice_id),_=Number(l.amount||0),R=E(l.installment_id);if(!p)return n.NextResponse.json({error:"Select an invoice before recording payment."},{status:400});if(!_||_<=0)return n.NextResponse.json({error:"Enter a valid payment amount greater than zero."},{status:400});let T=(e=>{if(!e)return m(new Date);let t=String(e).trim(),a=t.match(/^(\d{4})-(\d{2})-(\d{2})$/);return a?new Date(Number(a[1]),Number(a[2])-1,Number(a[3])):new Date(t)})(l.payment_date);if(Number.isNaN(T.getTime()))return n.NextResponse.json({error:"Enter a valid payment date."},{status:400});if(m(T)<m(new Date))return n.NextResponse.json({error:"Payment date cannot be older than today."},{status:400});let N=c.schoolId??null,h=(await i.prisma.$queryRawUnsafe(`
      SELECT *
      FROM invoices
      WHERE id = $1
        AND ($2::int IS NULL OR school_id = $2::int)
      LIMIT 1
      `,p,N))[0];if(!h)return n.NextResponse.json({error:"Invoice not found for the selected school."},{status:404});if(Number(h.installment_count||1)>1&&!R)return n.NextResponse.json({error:"Select the installment part before recording payment for a multi-part invoice."},{status:400});let A=Number(h.balance_amount||0);if(_>A)return n.NextResponse.json({error:"Payment amount cannot be greater than the invoice balance."},{status:400});let S=`RCPT-${Date.now()}-${p}`,C=await i.prisma.$transaction(async e=>{R?await e.$executeRawUnsafe(`
            UPDATE invoice_installments
            SET paid_amount = LEAST(amount, COALESCE(paid_amount, 0) + $1),
                balance_amount = GREATEST(amount - (COALESCE(paid_amount, 0) + $1), 0),
                status = CASE
                  WHEN GREATEST(amount - (COALESCE(paid_amount, 0) + $1), 0) = 0 THEN 'PAID'
                  ELSE 'PARTIAL'
                END,
                paid_at = CASE
                  WHEN GREATEST(amount - (COALESCE(paid_amount, 0) + $1), 0) = 0 THEN CURRENT_TIMESTAMP
                  ELSE paid_at
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
              AND invoice_id = $3
            `,_,R,p):await e.$executeRawUnsafe(`
            WITH pending AS (
              SELECT id
              FROM invoice_installments
              WHERE invoice_id = $2
                AND COALESCE(balance_amount, 0) > 0
              ORDER BY part_number ASC
              LIMIT 1
            )
            UPDATE invoice_installments ii
            SET paid_amount = LEAST(ii.amount, COALESCE(ii.paid_amount, 0) + $1),
                balance_amount = GREATEST(ii.amount - (COALESCE(ii.paid_amount, 0) + $1), 0),
                status = CASE
                  WHEN GREATEST(ii.amount - (COALESCE(ii.paid_amount, 0) + $1), 0) = 0 THEN 'PAID'
                  ELSE 'PARTIAL'
                END,
                paid_at = CASE
                  WHEN GREATEST(ii.amount - (COALESCE(ii.paid_amount, 0) + $1), 0) = 0 THEN CURRENT_TIMESTAMP
                  ELSE ii.paid_at
                END,
                updated_at = CURRENT_TIMESTAMP
            FROM pending
            WHERE ii.id = pending.id
            `,_,p);let t=(await e.$queryRawUnsafe(`
            UPDATE invoices
            SET paid_amount = COALESCE(paid_amount, 0) + $1,
                balance_amount = GREATEST(COALESCE(balance_amount, 0) - $1, 0),
                status = CASE
                  WHEN GREATEST(COALESCE(balance_amount, 0) - $1, 0) = 0 THEN 'PAID'
                  ELSE 'PARTIAL'
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,_,p))[0],n=(await e.$queryRawUnsafe(`
            INSERT INTO payments (
              school_id,
              academic_year_id,
              class_id,
              section_id,
              invoice_id,
              student_id,
              payment_date,
              payment_method,
              amount,
              reference_number,
              remarks,
              receipt_number,
              received_by,
              metadata,
              created_by,
              created_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15,CURRENT_TIMESTAMP)
            RETURNING *
            `,t.school_id,t.academic_year_id,t.class_id,t.section_id,p,t.student_id,T,l.payment_method||"CASH",_,l.reference_number||null,l.remarks||null,S,a.user?.id??null,JSON.stringify({installment_id:R}),a.user?.id??null))[0];return await e.$executeRawUnsafe(`
          INSERT INTO payment_receipts (
            receipt_number,
            school_id,
            academic_year_id,
            payment_id,
            receipt_date,
            amount,
            created_by,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)
          `,S,t.school_id,t.academic_year_id,n.id,T,_,a.user?.id??null),{invoice:t,payment:n}});return await (0,r.recordEvent)({school_id:Number(C.invoice.school_id)||N,academic_year_id:Number(C.invoice.academic_year_id)||null,user_id:a.user?.id,actor_role:a.user?.role,module_name:"finance",event_type:"PAYMENT_RECORDED",action:"collect",entity_type:"student",entity_id:Number(C.invoice.student_id)||null,summary:"Fee payment recorded and invoice balance updated.",payload:{invoice_id:p,payment_id:C.payment.id,amount:_,receipt_number:S,installment_id:R}}),await (0,s.notifyPaymentReceived)(Number(C.payment.id),a.user?.id??null).catch(e=>{console.error("WhatsApp payment_received dispatch failed:",e instanceof Error?e.message:e)}),n.NextResponse.json(C,{status:201})}e.s(["GET",0,c,"POST",0,p]),a()}catch(e){a(e)}},!1),370007,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),o=e.i(759756),s=e.i(561916),d=e.i(174677),u=e.i(869741),l=e.i(316795),c=e.i(487718),p=e.i(995169),E=e.i(47587),m=e.i(666012),_=e.i(570101),R=e.i(626937),T=e.i(10372),N=e.i(193695);e.i(52474);var h=e.i(600220),A=e.i(618089),S=t([A]);[A]=S.then?(await S)():S;let v=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/finance/payments/route",pathname:"/api/finance/payments",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/finance/payments/route.ts",nextConfigOutput:"",userland:A,...{}}),{workAsyncStorage:y,workUnitAsyncStorage:f,serverHooks:w}=v;async function C(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),v.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/finance/payments/route";n=n.replace(/\/index$/,"")||"/";let r=await v.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,deploymentId:S,params:C,nextConfig:y,parsedUrl:f,isDraftMode:w,prerenderManifest:$,routerServerContext:O,isOnDemandRevalidate:b,revalidateOnlyGenerated:I,resolvedPathname:g,clientReferenceManifest:L,serverActionsManifest:P}=r,x=(0,u.normalizeAppPath)(n),U=!!($.dynamicRoutes[x]||$.routes[g]),M=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,f,!1):t.end("This page could not be found"),null);if(U&&!w){let e=!!$.routes[g],t=$.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(y.adapterPath)return await M();throw new N.NoFallbackError}}let D=null;!U||v.isDev||w||(D=g,D="/index"===D?"/":D);let H=!0===v.isDev||!U,q=U&&!H;P&&L&&(0,d.setManifestsSingleton)({page:n,clientReferenceManifest:L,serverActionsManifest:P});let F=e.method||"GET",j=(0,s.getTracer)(),W=j.getActiveScopeSpan(),k=!!(null==O?void 0:O.isWrappedByNextServer),G=!!(0,o.getRequestMeta)(e,"minimalMode"),B=(0,o.getRequestMeta)(e,"incrementalCache")||await v.getIncrementalCache(e,y,$,G);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let K={params:C,previewProps:$.preview,renderOpts:{experimental:{authInterrupts:!!y.experimental.authInterrupts},cacheComponents:!!y.cacheComponents,supportsDynamicResponse:H,incrementalCache:B,cacheLifeProfiles:y.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>v.onRequestError(e,t,n,i,O)},sharedContext:{buildId:A,deploymentId:S}},J=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),Y=c.NextRequestAdapter.fromNodeNextRequest(J,(0,c.signalFromNodeResponse)(t));try{let r,o=async e=>v.handle(Y,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${F} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${F} ${n}`)}),d=async r=>{var s,d;let u=async({previousCacheEntry:i})=>{try{if(!G&&b&&I&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(r);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let d=K.renderOpts.collectedTags;if(!U)return await (0,m.sendResponse)(J,V,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[T.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=T.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,i=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=T.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:b})},!1,O),t}},l=await v.handleResponse({req:e,nextConfig:y,cacheKey:D,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:$,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:I,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:G});if(!U)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",b?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,_.fromNodeOutgoingHttpHeaders)(l.value.headers);return G&&U||c.delete(T.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(l.cacheControl)),await (0,m.sendResponse)(J,V,new Response(l.value.body,{headers:c,status:l.value.status||200})),null};k&&W?await d(W):(r=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},d),void 0,!k))}catch(t){if(t instanceof N.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:b})},!1,O),U)throw t;return await (0,m.sendResponse)(J,V,new Response(null,{status:500})),null}}e.s(["handler",0,C,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:f})},"routeModule",0,v,"serverHooks",0,w,"workAsyncStorage",0,y,"workUnitAsyncStorage",0,f]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0q.9_ao._.js.map