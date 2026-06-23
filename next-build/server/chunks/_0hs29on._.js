module.exports=[172503,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(15270),s=e.i(493399),r=e.i(19754),o=e.i(527426),l=e.i(215619),d=e.i(410325),c=t([n,s,r,o,l,d]);[n,s,r,o,l,d]=c.then?(await c)():c;let m=e=>Array.isArray(e)?e.map(e=>Number(e)).filter(e=>Number.isFinite(e)):[],p=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},E=(e,t)=>new Date(e.getFullYear(),e.getMonth()+t+1,0),R=e=>new Date(e.getFullYear(),e.getMonth(),e.getDate());async function u(e){let t=await (0,d.requireSchoolModule)("FINANCE");if(t.response)return t.response;let i=await (0,r.resolvePlatformContext)(e);if(!i)return a.NextResponse.json({error:"Unauthorized"},{status:401});let s=i.schoolId,o=i.academicYearId,[l,c]=await Promise.all([n.prisma.$queryRawUnsafe(`
        SELECT
          i.*,
          COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
          s.admission_number,
          c.class_name,
          sec.section_name,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', ili.id,
                'fee_category_id', ili.fee_category_id,
                'fee_name', ili.fee_name,
                'amount', ili.amount
              )
            ) FILTER (WHERE ili.id IS NOT NULL),
            '[]'::json
          ) AS line_items,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'id', ii.id,
                'part_number', ii.part_number,
                'part_label', ii.part_label,
                'due_date', ii.due_date,
                'amount', ii.amount,
                'paid_amount', ii.paid_amount,
                'balance_amount', ii.balance_amount,
                'status', ii.status
              )
            ) FILTER (WHERE ii.id IS NOT NULL),
            '[]'::json
          ) AS installments
        FROM invoices i
        LEFT JOIN students s ON s.id = i.student_id
        LEFT JOIN classes c ON c.id = i.class_id
        LEFT JOIN sections sec ON sec.id = i.section_id
        LEFT JOIN invoice_line_items ili ON ili.invoice_id = i.id
        LEFT JOIN invoice_installments ii ON ii.invoice_id = i.id
        WHERE ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
          AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
        GROUP BY i.id, s.name, s.first_name, s.last_name, s.admission_number, c.class_name, sec.section_name
        ORDER BY i.created_at DESC
        LIMIT 300
        `,s,o),n.prisma.$queryRawUnsafe(`
        SELECT COUNT(i.id)::int AS invoice_count,
               COALESCE(SUM(i.total_amount), 0)::numeric AS total_amount,
               COALESCE(SUM(i.paid_amount), 0)::numeric AS paid_amount,
               COALESCE(SUM(i.balance_amount), 0)::numeric AS balance_amount
        FROM invoices i
        LEFT JOIN students s ON s.id = i.student_id
        WHERE ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
          AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
        `,s,o)]);return a.NextResponse.json({invoices:l,summary:Array.isArray(c)?c[0]:c})}async function _(e){let t,i,d,c,u=await (0,l.requirePermission)({module:"fees",action:"create"});if(u.response)return u.response;let _=await e.json(),N=await (0,r.resolvePlatformContext)(e),h=u.user?.role==="SUPER_ADMIN"?p(_.school_id)??N?.schoolId??u.user?.school_id??null:N?.schoolId??u.user?.school_id??null;if(!h)return a.NextResponse.json({error:"Select a school before generating invoices."},{status:400});let f=p(_.class_id),S=p(_.section_id),C=m(_.student_ids??_.studentIds).slice(0,300),v=m(_.fee_category_ids??_.feeCategoryIds),y=String(_.billing_scope||_.student_scope||"STUDENT").toUpperCase(),I=C;if("CLASS_SECTION"===y||"CLASS"===y){if(!f)return a.NextResponse.json({error:"Select a class before generating class or section invoices."},{status:400});I=(await n.prisma.$queryRawUnsafe(`
        SELECT DISTINCT s.id
        FROM students s
        LEFT JOIN student_year_enrollments sye ON sye.student_id = s.id
        WHERE ($1::int IS NULL OR s.school_id = $1::int)
          AND COALESCE(s.current_class_id, sye.class_id) = $2::int
          AND ($3::int IS NULL OR COALESCE(s.current_section_id, s.section_id, sye.section_id) = $3::int)
        ORDER BY s.id ASC
        LIMIT 500
        `,h,f,S)).map(e=>Number(e.id))}if(!I.length)return a.NextResponse.json({error:"Select at least one student, or choose a class/section with active students."},{status:400});if(!v.length)return a.NextResponse.json({error:"Select at least one fee structure."},{status:400});let O=p(_.academic_year_id)??N?.academicYearId??null,g=O?await n.prisma.academic_years.findFirst({where:{id:O,OR:[{school_id:h},{school_id:null}]}}):await n.prisma.academic_years.findFirst({where:{is_current:!0,OR:[{school_id:h},{school_id:null}]},orderBy:{id:"desc"}});if(!g?.id)return a.NextResponse.json({error:"Select an academic year before generating invoices."},{status:400});let A=await n.prisma.fee_categories.findMany({where:{id:{in:v},is_active:!0,...h?{OR:[{school_id:h},{school_id:null}]}:{}}});if(!A.length)return a.NextResponse.json({error:"No active fee structures found."},{status:400});let T=A.reduce((e,t)=>e+Number(t.amount??0),0);if(T<=0)return a.NextResponse.json({error:"Selected fee structures have no billable amount."},{status:400});let b=new Date(_.due_date?_.due_date:Date.now()+12096e5),w=_.invoice_date?new Date(_.invoice_date):new Date;if(Number.isNaN(b.getTime())||R(b)<R(new Date))return a.NextResponse.json({error:"Invoice due date must be today or a future date."},{status:400});if(R(b)<R(w))return a.NextResponse.json({error:"Invoice due date cannot be earlier than invoice date."},{status:400});let L=String(_.installment_mode||_.billing_period||"SINGLE").toUpperCase(),$="SINGLE"===L?1:Math.max(1,Math.min(12,Number(_.installment_count||3)||3)),U=(t=Math.max(1,$),i=Math.floor(T/t*100)/100,d=Array.from({length:t},()=>i),c=i*t,d[t-1]=Math.round((d[t-1]+(T-c))*100)/100,d),x=[];for(let[e,t]of I.entries()){let i=(await n.prisma.$queryRawUnsafe(`
        SELECT
          s.id,
          s.school_id,
          COALESCE(s.current_class_id, sye.class_id) AS class_id,
          COALESCE(s.current_section_id, s.section_id, sye.section_id) AS section_id
        FROM students s
        LEFT JOIN student_year_enrollments sye
          ON sye.student_id = s.id
          AND ($3::int IS NULL OR sye.academic_year_id = $3::int)
        WHERE s.id = $1
          AND ($2::int IS NULL OR s.school_id = $2::int)
        ORDER BY sye.id DESC NULLS LAST
        LIMIT 1
        `,t,h,g?.id??null))[0];if(!i)continue;let a=f||Number(i.class_id)||null,r=S||Number(i.section_id)||null,l=`INV-${Date.now()}-${t}-${e+1}`,d=(await n.prisma.$queryRawUnsafe(`
        INSERT INTO invoices (
          invoice_number,
          school_id,
          academic_year_id,
          class_id,
          section_id,
          student_id,
          invoice_date,
          due_date,
          total_amount,
          paid_amount,
          balance_amount,
          status,
          billing_scope,
          billing_period,
          installment_count,
          source,
          metadata,
          created_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$9,'PENDING',$10,$11,$12,'web',$13::jsonb,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING *
        `,l,Number(i.school_id)||h,g?.id??null,a,r,t,w,b,T,y,L,$,JSON.stringify({fee_category_ids:v}),u.user?.id??null))[0];if(d?.id){for(let e of A)await n.prisma.$executeRawUnsafe(`
        INSERT INTO invoice_line_items (
          invoice_id,
          fee_category_id,
          fee_name,
          amount,
          metadata,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5::jsonb,CURRENT_TIMESTAMP)
        `,Number(d.id),e.id,e.fee_name,Number(e.amount??0),JSON.stringify({fee_code:e.fee_code,frequency:e.frequency}));for(let e=0;e<$;e++){let t=U[e];await n.prisma.$executeRawUnsafe(`
        INSERT INTO invoice_installments (
          invoice_id,
          part_number,
          part_label,
          due_date,
          amount,
          paid_amount,
          balance_amount,
          status,
          metadata,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,0,$5,'PENDING',$6::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        `,Number(d.id),e+1,1===$?"Full Amount":`Part ${e+1}`,1===$?b:E(b,e),t,JSON.stringify({installment_mode:L}))}x.push(d),await (0,s.recordEvent)({school_id:Number(i.school_id)||h,academic_year_id:g?.id??null,user_id:u.user?.id,actor_role:u.user?.role,module_name:"finance",event_type:"INVOICE_GENERATED",action:"generate",entity_type:"student",entity_id:t,summary:"Invoice generated with class/section and fee structure context.",payload:{invoice_id:d.id,invoice_number:d.invoice_number,fee_category_ids:v,class_id:a,section_id:r,installment_mode:L,installment_count:$,amount:T}}),await (0,o.notifyInvoiceCreated)(Number(d.id),u.user?.id??null).catch(e=>{console.error("WhatsApp invoice_created dispatch failed:",e instanceof Error?e.message:e)})}}return a.NextResponse.json({invoices:x,count:x.length,amount:T,installment_mode:L,installment_count:$,feeCategories:A.map(e=>({id:e.id,fee_name:e.fee_name,amount:e.amount}))},{status:201})}e.s(["GET",0,u,"POST",0,_]),i()}catch(e){i(e)}},!1),976748,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),s=e.i(996250),r=e.i(759756),o=e.i(561916),l=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),_=e.i(995169),m=e.i(47587),p=e.i(666012),E=e.i(570101),R=e.i(626937),N=e.i(10372),h=e.i(193695);e.i(52474);var f=e.i(600220),S=e.i(172503),C=t([S]);[S]=C.then?(await C)():C;let y=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/finance/invoices/route",pathname:"/api/finance/invoices",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/finance/invoices/route.ts",nextConfigOutput:"",userland:S,...{}}),{workAsyncStorage:I,workUnitAsyncStorage:O,serverHooks:g}=y;async function v(e,t,i){i.requestMeta&&(0,r.setRequestMeta)(e,i.requestMeta),y.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/finance/invoices/route";a=a.replace(/\/index$/,"")||"/";let s=await y.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:S,deploymentId:C,params:v,nextConfig:I,parsedUrl:O,isDraftMode:g,prerenderManifest:A,routerServerContext:T,isOnDemandRevalidate:b,revalidateOnlyGenerated:w,resolvedPathname:L,clientReferenceManifest:$,serverActionsManifest:U}=s,x=(0,d.normalizeAppPath)(a),M=!!(A.dynamicRoutes[x]||A.routes[L]),D=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,O,!1):t.end("This page could not be found"),null);if(M&&!g){let e=!!A.routes[L],t=A.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(I.adapterPath)return await D();throw new h.NoFallbackError}}let P=null;!M||y.isDev||g||(P=L,P="/index"===P?"/":P);let j=!0===y.isDev||!M,F=M&&!j;U&&$&&(0,l.setManifestsSingleton)({page:a,clientReferenceManifest:$,serverActionsManifest:U});let q=e.method||"GET",H=(0,o.getTracer)(),k=H.getActiveScopeSpan(),B=!!(null==T?void 0:T.isWrappedByNextServer),G=!!(0,r.getRequestMeta)(e,"minimalMode"),J=(0,r.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,I,A,G);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let W={params:v,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:j,incrementalCache:J,cacheLifeProfiles:I.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>y.onRequestError(e,t,a,n,T)},sharedContext:{buildId:S,deploymentId:C}},K=new c.NodeNextRequest(e),V=new c.NodeNextResponse(t),Y=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t));try{let s,r=async e=>y.handle(Y,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=H.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${q} ${a}`)}),l=async s=>{var o,l;let d=async({previousCacheEntry:n})=>{try{if(!G&&b&&w&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await r(s);e.fetchMetrics=W.renderOpts.fetchMetrics;let o=W.renderOpts.pendingWaitUntil;o&&i.waitUntil&&(i.waitUntil(o),o=void 0);let l=W.renderOpts.collectedTags;if(!M)return await (0,p.sendResponse)(K,V,a,W.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[N.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,n=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:b})},!1,T),t}},c=await y.handleResponse({req:e,nextConfig:I,cacheKey:P,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:w,responseGenerator:d,waitUntil:i.waitUntil,isMinimalMode:G});if(!M)return null;if((null==c||null==(o=c.value)?void 0:o.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",b?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,E.fromNodeOutgoingHttpHeaders)(c.value.headers);return G&&M||u.delete(N.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,R.getCacheControlHeader)(c.cacheControl)),await (0,p.sendResponse)(K,V,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};B&&k?await l(k):(s=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(_.BaseServerSpan.handleRequest,{spanName:`${q} ${a}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l),void 0,!B))}catch(t){if(t instanceof h.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:b})},!1,T),M)throw t;return await (0,p.sendResponse)(K,V,new Response(null,{status:500})),null}}e.s(["handler",0,v,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:O})},"routeModule",0,y,"serverHooks",0,g,"workAsyncStorage",0,I,"workUnitAsyncStorage",0,O]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=_0hs29on._.js.map