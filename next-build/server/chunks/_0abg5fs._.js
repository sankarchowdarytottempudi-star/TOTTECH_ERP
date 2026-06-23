module.exports=[30837,e=>e.a(async(t,a)=>{try{var r=e.i(924868),s=e.i(814747),n=e.i(89171),o=e.i(19754),i=e.i(368105),c=e.i(493399),l=e.i(410325),d=e.i(15270),u=t([o,i,c,l,d]);[o,i,c,l,d]=u.then?(await u)():u;let N=[["SALARY","Salary"],["BUS_FUEL","Bus Fuel"],["BUS_MAINTENANCE","Bus Maintenance"],["STATIONERY","Stationery"],["ELECTRICITY","Electricity"],["WATER","Water"],["INTERNET","Internet"],["LABORATORY","Laboratory"],["LIBRARY","Library"],["SPORTS","Sports"],["FURNITURE","Furniture"],["EQUIPMENT","Equipment"],["REPAIRS","Repairs"],["BUILDING_MAINTENANCE","Building Maintenance"],["MARKETING","Marketing"],["EVENTS","Events"],["EXAM_EXPENSES","Exam Expenses"],["PRINTING","Printing"],["SOFTWARE_SUBSCRIPTION","Software Subscription"],["TRANSPORT","Transport"],["DINING","Dining"],["HOSTEL","Hostel"],["MISCELLANEOUS","Miscellaneous"]],C=new Set(["PENDING_APPROVAL","APPROVED","REJECTED","PAID"]),A=new Set(["CASH","UPI","CARD","BANK_TRANSFER","CHEQUE","NET_BANKING","INSURANCE","MIXED"]),T=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?Math.floor(t):null},g=e=>String(e??"").trim(),f=e=>{let t=g(e);if(!t)return null;let a=new Date(t);return Number.isNaN(a.getTime())?null:a};async function E(e){for(let[e,t]of N)await d.prisma.$executeRawUnsafe(`
      INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
      SELECT NULL, $1, $2, 'DEFAULT', FALSE, TRUE
      WHERE NOT EXISTS (
        SELECT 1 FROM expense_categories
        WHERE school_id IS NULL AND category_code = $1
      )
      `,e,t);if(e)for(let[t,a]of N.filter(([e])=>"MISCELLANEOUS"!==e))await d.prisma.$executeRawUnsafe(`
        INSERT INTO expense_categories (school_id, category_code, category_name, category_group, is_custom, is_active)
        SELECT $1, $2, $3, 'SCHOOL', FALSE, TRUE
        WHERE NOT EXISTS (
          SELECT 1 FROM expense_categories
          WHERE school_id = $1 AND category_code = $2
        )
        `,e,t,a)}async function p(e,t){let a=new URL(e.url),r=t?.allSchools?T(a.searchParams.get("school_id")):t?.schoolId??null,s=t?.allYears?T(a.searchParams.get("academic_year_id")):t?.academicYearId??null;return{schoolId:r,academicYearId:s,classId:T(a.searchParams.get("class_id")),sectionId:T(a.searchParams.get("section_id")),status:g(a.searchParams.get("status")).toUpperCase()||null,category:g(a.searchParams.get("category")).toUpperCase()||null,createdBy:T(a.searchParams.get("created_by")),from:f(a.searchParams.get("from")),to:f(a.searchParams.get("to")),q:g(a.searchParams.get("q"))}}async function _(e){await d.prisma.$executeRawUnsafe(`
    INSERT INTO school_expense_events (
      school_id, academic_year_id, expense_id, event_type,
      actor_user_id, actor_role, summary, payload, created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,CURRENT_TIMESTAMP)
    `,e.schoolId,e.academicYearId,e.expenseId,e.eventType,e.actorUserId,e.actorRole,e.summary,JSON.stringify(e.payload||{}))}async function m(e){if(!e)return null;if(!new Set(["application/pdf","image/png","image/jpeg","image/jpg","image/webp"]).has(e.type))throw Error("Attachment must be PDF, JPG, PNG, or WEBP.");if(e.size>8388608)throw Error("Attachment must be 8 MB or smaller.");let t=s.default.join(process.cwd(),"public","uploads","finance","expenses");await (0,r.mkdir)(t,{recursive:!0});let a="application/pdf"===e.type?".pdf":"image/png"===e.type?".png":"image/webp"===e.type?".webp":".jpg",n=`expense-${Date.now()}-${Math.random().toString(36).slice(2,8)}${a}`,o=s.default.join(t,n);return await (0,r.writeFile)(o,Buffer.from(await e.arrayBuffer())),{attachment_url:`/uploads/finance/expenses/${n}`,attachment_name:e.name}}async function R(e){if((e.headers.get("content-type")||"").includes("multipart/form-data")){let t=await e.formData();return{school_id:t.get("school_id"),academic_year_id:t.get("academic_year_id"),class_id:t.get("class_id"),section_id:t.get("section_id"),category:t.get("category"),custom_category:t.get("custom_category"),expense_date:t.get("expense_date"),vendor_name:t.get("vendor_name"),description:t.get("description"),amount:t.get("amount"),payment_method:t.get("payment_method"),reference_number:t.get("reference_number"),status:t.get("status"),created_by:t.get("created_by"),attachment:t.get("attachment")}}return await e.json()}async function y(e){let t=await (0,l.requireSchoolModule)("FINANCE");if(t.response)return t.response;let a=await (0,o.resolvePlatformContext)(e);if(!a)return n.NextResponse.json({error:"Unauthorized"},{status:401});let r=await p(e,a);await E(r.schoolId??a.schoolId);let s=a.allSchools?r.schoolId:a.schoolId,i=a.allYears?r.academicYearId:a.academicYearId,c=[s?`e.school_id = ${s}`:"TRUE",i?`COALESCE(e.academic_year_id, 0) = ${i}`:"TRUE",r.classId?`e.class_id = ${r.classId}`:"TRUE",r.sectionId?`e.section_id = ${r.sectionId}`:"TRUE",r.status?`UPPER(COALESCE(e.status, '')) = '${r.status.replace(/'/g,"''")}'`:"TRUE",r.category?`UPPER(COALESCE(e.category, '')) = '${r.category.replace(/'/g,"''")}'`:"TRUE",r.createdBy?`e.created_by = ${r.createdBy}`:"TRUE",r.from?`e.expense_date >= '${r.from.toISOString().slice(0,10)}'`:"TRUE",r.to?`e.expense_date <= '${r.to.toISOString().slice(0,10)}'`:"TRUE",r.q?`(COALESCE(e.vendor_name, '') ILIKE '%${r.q.replace(/'/g,"''")}%' OR COALESCE(e.description, '') ILIKE '%${r.q.replace(/'/g,"''")}%' OR COALESCE(e.reference_number, '') ILIKE '%${r.q.replace(/'/g,"''")}%' )`:"TRUE"].join(" AND "),[u,_,m,R,y,S,h,N,T,g,f,I,O,x]=await Promise.all([d.prisma.$queryRawUnsafe(`
      SELECT
        e.*,
        s.school_name,
        s.school_code,
        ay.academic_year,
        c.class_name,
        sec.section_name,
        creator.full_name AS created_by_name,
        approver.full_name AS approved_by_name,
        rejecter.full_name AS rejected_by_name,
        payer.full_name AS paid_by_name
      FROM school_expenses e
      LEFT JOIN schools s ON s.id = e.school_id
      LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
      LEFT JOIN classes c ON c.id = e.class_id
      LEFT JOIN sections sec ON sec.id = e.section_id
      LEFT JOIN users creator ON creator.id = e.created_by
      LEFT JOIN users approver ON approver.id = e.approved_by
      LEFT JOIN users rejecter ON rejecter.id = e.rejected_by
      LEFT JOIN users payer ON payer.id = e.paid_by
      WHERE ${c}
      ORDER BY e.expense_date DESC, e.id DESC
      LIMIT 500
      `),d.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*)::int AS expense_count,
        COALESCE(SUM(e.amount), 0)::numeric AS total_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'APPROVED'), 0)::numeric AS approved_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'PENDING_APPROVAL'), 0)::numeric AS pending_approval,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'REJECTED'), 0)::numeric AS rejected_expense,
        COALESCE(SUM(e.amount) FILTER (WHERE UPPER(COALESCE(e.status, '')) = 'PAID'), 0)::numeric AS paid_expense
      FROM school_expenses e
      WHERE ${c}
      `),d.prisma.$queryRawUnsafe(`
      SELECT
        to_char(date_trunc('month', e.expense_date), 'Mon YYYY') AS label,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      WHERE ${c}
      GROUP BY 1
      ORDER BY date_trunc('month', e.expense_date)
      `),d.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(e.category, 'Uncategorized') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      WHERE ${c}
      GROUP BY 1
      ORDER BY value DESC
      LIMIT 10
      `),d.prisma.$queryRawUnsafe(`
      SELECT
        s.school_name AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN schools s ON s.id = e.school_id
      WHERE ${c}
      GROUP BY s.school_name
      ORDER BY value DESC
      LIMIT 20
      `),d.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(ay.academic_year, 'Unassigned') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
      WHERE ${c}
      GROUP BY ay.academic_year
      ORDER BY value DESC
      LIMIT 20
      `),d.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(c.class_name, 'Entire School') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN classes c ON c.id = e.class_id
      WHERE ${c}
      GROUP BY c.class_name
      ORDER BY value DESC
      LIMIT 20
      `),d.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(sec.section_name, 'Entire School') AS label,
        COUNT(*)::int AS count,
        COALESCE(SUM(e.amount), 0)::numeric AS value
      FROM school_expenses e
      LEFT JOIN sections sec ON sec.id = e.section_id
      WHERE ${c}
      GROUP BY sec.section_name
      ORDER BY value DESC
      LIMIT 20
      `),d.prisma.schools.findMany({where:a.allSchools?{}:{id:a.schoolId??0},select:{id:!0,school_name:!0,school_code:!0,logo_url:!0},orderBy:{school_name:"asc"}}),d.prisma.academic_years.findMany({where:a.allYears?{}:{id:a.academicYearId??0},select:{id:!0,academic_year:!0},orderBy:{academic_year:"desc"}}),d.prisma.classes.findMany({where:s?{school_id:s}:{},select:{id:!0,class_name:!0,school_id:!0},orderBy:{class_name:"asc"}}),d.prisma.sections.findMany({where:s?{school_id:s}:{},select:{id:!0,section_name:!0,class_id:!0,school_id:!0},orderBy:{section_name:"asc"}}),d.prisma.users.findMany({where:{platform_type:"EDUCATIONAL",...s?{user_school_access:{some:{school_id:s,is_active:!0}}}:{}},select:{id:!0,full_name:!0,role:!0},orderBy:{full_name:"asc"},take:200}),d.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(ec.category_code, e.category) AS category_code,
        COALESCE(ec.category_name, e.category) AS category_name,
        COUNT(*)::int AS count
      FROM school_expenses e
      LEFT JOIN expense_categories ec
        ON UPPER(COALESCE(ec.category_code, '')) = UPPER(COALESCE(e.category, ''))
      WHERE ${c}
      GROUP BY 1, 2
      ORDER BY count DESC, category_name ASC
      `)]),U=Number(_[0]?.total_expense||0),b=Number(_[0]?.approved_expense||0),P=Number(_[0]?.pending_approval||0),v=Number(_[0]?.rejected_expense||0),w=Number(_[0]?.paid_expense||0),L=m.map(e=>({label:String(e.label||"-"),value:Number(e.value||0)}));return n.NextResponse.json({context:{allSchools:a.allSchools,allYears:a.allYears,selectedSchool:T.find(e=>e.id===s)??null,selectedAcademicYear:g.find(e=>e.id===i)??null,filters:{school_id:s,academic_year_id:i,class_id:r.classId,section_id:r.sectionId,status:r.status,category:r.category,created_by:r.createdBy,from:r.from,to:r.to,q:r.q}},expenses:u,summary:{expenseCount:Number(_[0]?.expense_count||0),totalExpense:U,approvedExpense:b,pendingApproval:P,rejectedExpense:v,paidExpense:w,monthlyExpense:L.at(-1)?.value||0,yearlyExpense:U},analytics:{expenseByMonth:L,expenseByCategory:R.map(e=>({label:String(e.label||"-"),value:Number(e.value||0),count:Number(e.count||0)})),expenseBySchool:y.map(e=>({label:String(e.label||"-"),value:Number(e.value||0),count:Number(e.count||0)})),expenseByAcademicYear:S.map(e=>({label:String(e.label||"-"),value:Number(e.value||0),count:Number(e.count||0)})),expenseByClass:h.map(e=>({label:String(e.label||"-"),value:Number(e.value||0),count:Number(e.count||0)})),expenseBySection:N.map(e=>({label:String(e.label||"-"),value:Number(e.value||0),count:Number(e.count||0)})),topCategories:x.map(e=>({label:String(e.category_name||e.category_code||"-"),value:Number(e.count||0)}))},options:{schools:T,academicYears:g,classes:f.map(e=>({id:e.id,class_name:e.class_name,school_id:e.school_id})),sections:I.map(e=>({id:e.id,section_name:e.section_name,class_id:e.class_id,school_id:e.school_id})),createdByUsers:O.map(e=>({id:e.id,full_name:e.full_name,role:e.role})),categories:x.map(e=>({code:e.category_code,name:e.category_name})),statuses:Array.from(C),paymentModes:Array.from(A)}})}async function S(e){var t;let a,r=await (0,l.requireSchoolModule)("FINANCE");if(r.response)return r.response;let s=await (0,o.resolvePlatformContext)(e),u=await (0,i.getCurrentUser)();if(!s||!u)return n.NextResponse.json({error:"Unauthorized"},{status:401});if(!s.schoolId)return n.NextResponse.json({error:"Select a school before creating expenses."},{status:400});let E=await R(e),p=T(E.school_id)||s.schoolId,y=T(E.academic_year_id)||s.academicYearId,S=T(E.class_id),h=T(E.section_id),N=(t=E.amount,a=Number(t),Number.isFinite(a)&&a>0?Number(a.toFixed(2)):null),I=g(E.status).toUpperCase()||"PENDING_APPROVAL",O=E.attachment instanceof File?E.attachment:null,x=g(E.vendor_name),U=g(E.description),b=g(E.payment_method).toUpperCase(),P=g(E.custom_category),v=g(E.category).toUpperCase();if(!p||p!==s.schoolId&&!s.allSchools)return n.NextResponse.json({error:"Expense must belong to the selected school."},{status:400});if(!y)return n.NextResponse.json({error:"Academic year is required."},{status:400});if(!N)return n.NextResponse.json({error:"Expense amount must be greater than zero."},{status:400});if(I&&!C.has(I))return n.NextResponse.json({error:"Select a valid expense status."},{status:400});if(b&&!A.has(b))return n.NextResponse.json({error:"Select a valid payment mode."},{status:400});let w=v;if("CUSTOM"===v){if(!P)return n.NextResponse.json({error:"Enter a custom expense category."},{status:400});w=P.trim().toUpperCase().replace(/[^A-Z0-9]+/g,"_").replace(/^_+|_+$/g,"")}if(!w)return n.NextResponse.json({error:"Select an expense category."},{status:400});let L=await m(O),$=(await d.prisma.$transaction(async e=>await e.$queryRawUnsafe(`
      INSERT INTO school_expenses (
        school_id, academic_year_id, class_id, section_id, category, expense_type, expense_date,
        vendor_name, description, amount, payment_method, reference_number, status,
        attachment_url, attachment_name,
        created_by, updated_by, created_at, updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,
        $14,$15,
        $16,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
      )
      RETURNING *
      `,p,y,S,h,w,w,f(E.expense_date)??new Date,x||null,U||null,N,b||null,g(E.reference_number)||null,I,L?.attachment_url??null,L?.attachment_name??null,Number(u.id)||null)))[0]||null;return $?(await _({schoolId:p,academicYearId:y,expenseId:Number($.id),eventType:"EXPENSE_CREATED",actorUserId:Number(u.id)||null,actorRole:u.role||null,summary:`Expense created for ${w}.`,payload:$}),await (0,c.recordEvent)({school_id:p,academic_year_id:y,user_id:Number(u.id)||null,actor_role:u.role,module_name:"finance",event_type:"EXPENSE_CREATED",action:"create",entity_type:"school_expense",entity_id:Number($.id)||null,summary:`Expense created for ${w}.`,payload:$}),n.NextResponse.json($,{status:201})):n.NextResponse.json({error:"Failed to create expense."},{status:500})}async function h(e){let t=await (0,l.requireSchoolModule)("FINANCE");if(t.response)return t.response;let a=await (0,o.resolvePlatformContext)(e),r=await (0,i.getCurrentUser)();if(!a||!r)return n.NextResponse.json({error:"Unauthorized"},{status:401});let s=await e.json(),u=T(s.id),E=g(s.action).toUpperCase();if(!u||!["APPROVE","REJECT","MARK_PAID"].includes(E))return n.NextResponse.json({error:"Valid id and action are required."},{status:400});let p=(await d.prisma.$queryRawUnsafe(`
    SELECT e.*
    FROM school_expenses e
    WHERE e.id = $1
      AND ($2::int IS NULL OR e.school_id = $2::int)
    LIMIT 1
    `,u,a.schoolId))[0];if(!p)return n.NextResponse.json({error:"Expense not found for the selected school."},{status:404});let m=p.status,R="";"APPROVE"===E?(m="APPROVED",R=`
      UPDATE school_expenses
      SET status = 'APPROVED',
          approved_by = $2,
          approved_at = CURRENT_TIMESTAMP,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `):"REJECT"===E?(m="REJECTED",R=`
      UPDATE school_expenses
      SET status = 'REJECTED',
          rejected_by = $2,
          rejected_at = CURRENT_TIMESTAMP,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `):(m="PAID",R=`
      UPDATE school_expenses
      SET status = 'PAID',
          paid_by = $2,
          paid_at = CURRENT_TIMESTAMP,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `);let y=await d.prisma.$queryRawUnsafe(R,u,Number(r.id)||null);if(!y.length)return n.NextResponse.json({error:"Failed to update expense status."},{status:500});let S=y[0];return await _({schoolId:Number(S.school_id)||Number(p.school_id)||0,academicYearId:Number(S.academic_year_id)||Number(p.academic_year_id)||null,expenseId:u,eventType:`EXPENSE_${m}`,actorUserId:Number(r.id)||null,actorRole:r.role||null,summary:`Expense ${m.toLowerCase()}.`,payload:S}),await (0,c.recordEvent)({school_id:Number(S.school_id)||Number(p.school_id)||null,academic_year_id:Number(S.academic_year_id)||Number(p.academic_year_id)||null,user_id:Number(r.id)||null,actor_role:r.role,module_name:"finance",event_type:`EXPENSE_${m}`,action:E.toLowerCase(),entity_type:"school_expense",entity_id:u,summary:`Expense ${m.toLowerCase()}.`,payload:S}),n.NextResponse.json(S)}e.s(["GET",0,y,"PATCH",0,h,"POST",0,S,"runtime",0,"nodejs"]),a()}catch(e){a(e)}},!1),334143,e=>e.a(async(t,a)=>{try{var r=e.i(747909),s=e.i(174017),n=e.i(996250),o=e.i(759756),i=e.i(561916),c=e.i(174677),l=e.i(869741),d=e.i(316795),u=e.i(487718),E=e.i(995169),p=e.i(47587),_=e.i(666012),m=e.i(570101),R=e.i(626937),y=e.i(10372),S=e.i(193695);e.i(52474);var h=e.i(600220),N=e.i(30837),C=t([N]);[N]=C.then?(await C)():C;let T=new r.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/finance/expenses/route",pathname:"/api/finance/expenses",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/finance/expenses/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:f,serverHooks:I}=T;async function A(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/finance/expenses/route";r=r.replace(/\/index$/,"")||"/";let n=await T.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:N,deploymentId:C,params:A,nextConfig:g,parsedUrl:f,isDraftMode:I,prerenderManifest:O,routerServerContext:x,isOnDemandRevalidate:U,revalidateOnlyGenerated:b,resolvedPathname:P,clientReferenceManifest:v,serverActionsManifest:w}=n,L=(0,l.normalizeAppPath)(r),$=!!(O.dynamicRoutes[L]||O.routes[P]),M=async()=>((null==x?void 0:x.render404)?await x.render404(e,t,f,!1):t.end("This page could not be found"),null);if($&&!I){let e=!!O.routes[P],t=O.dynamicRoutes[L];if(t&&!1===t.fallback&&!e){if(g.adapterPath)return await M();throw new S.NoFallbackError}}let D=null;!$||T.isDev||I||(D=P,D="/index"===D?"/":D);let F=!0===T.isDev||!$,B=$&&!F;w&&v&&(0,c.setManifestsSingleton)({page:r,clientReferenceManifest:v,serverActionsManifest:w});let j=e.method||"GET",q=(0,i.getTracer)(),H=q.getActiveScopeSpan(),Y=!!(null==x?void 0:x.isWrappedByNextServer),W=!!(0,o.getRequestMeta)(e,"minimalMode"),G=(0,o.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,g,O,W);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let J={params:A,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!g.experimental.authInterrupts},cacheComponents:!!g.cacheComponents,supportsDynamicResponse:F,incrementalCache:G,cacheLifeProfiles:g.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,s)=>T.onRequestError(e,t,r,s,x)},sharedContext:{buildId:N,deploymentId:C}},k=new d.NodeNextRequest(e),V=new d.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(k,(0,u.signalFromNodeResponse)(t));try{let n,o=async e=>T.handle(K,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=q.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==E.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let t=`${j} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",s),n.updateName(t))}else e.updateName(`${j} ${r}`)}),c=async n=>{var i,c;let l=async({previousCacheEntry:s})=>{try{if(!W&&U&&b&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await o(n);e.fetchMetrics=J.renderOpts.fetchMetrics;let i=J.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let c=J.renderOpts.collectedTags;if(!$)return await (0,_.sendResponse)(k,V,r,J.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(r.headers);c&&(t[y.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,s=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:U})},!1,x),t}},d=await T.handleResponse({req:e,nextConfig:g,cacheKey:D,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:U,revalidateOnlyGenerated:b,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:W});if(!$)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",U?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return W&&$||u.delete(y.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,R.getCacheControlHeader)(d.cacheControl)),await (0,_.sendResponse)(k,V,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};Y&&H?await c(H):(n=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(E.BaseServerSpan.handleRequest,{spanName:`${j} ${r}`,kind:i.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},c),void 0,!Y))}catch(t){if(t instanceof S.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:U})},!1,x),$)throw t;return await (0,_.sendResponse)(k,V,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:f})},"routeModule",0,T,"serverHooks",0,I,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,f]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0abg5fs._.js.map