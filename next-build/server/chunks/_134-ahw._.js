module.exports=[294615,e=>{"use strict";e.s(["calculateRisk",0,function(e,t){let a=100,n=0===t,s=[],i=[];e<90&&(a-=10,s.push("Attendance below excellence threshold")),e<80&&(a-=20,s.push("Attendance below school target"),i.push("Parent follow-up recommended")),e<70&&(a-=25,s.push("Chronic absenteeism detected"),i.push("Attendance intervention required")),t<75&&(a-=10,s.push("Academic performance below distinction level")),!n&&t<60&&i.push("Additional academic support suggested"),!n&&t<40&&s.push("Academic performance below target");let r="LOW";return((a=Math.max(a,0))<50?r="HIGH":a<75&&(r="MEDIUM"),0===t)?{level:e>=75?"LOW":"MEDIUM",score:e,reasons:["No academic records available"],recommendations:["Enter examination results"]}:{score:a,level:r,reasons:s,recommendations:i}}])},105437,e=>{"use strict";e.s(["generateStudentDNA",0,function({attendancePercent:e,averageMarks:t,subjectStrengths:a,subjectWeaknesses:n}){let s=Math.round(.4*e+.6*t),i=["Mathematics","Science","Physics","Chemistry","Biology","Computer Science"],r=a.filter(e=>i.includes(e)).length,o="General";r>=2&&(o="STEM");let d="General Studies",l=50;"STEM"===o&&(d="Engineering",l=82),a.includes("Biology")&&(d="Medical",l=85);let u=Math.round(.4*e+.6*t),c="Developing Learner";e>=90&&(c="Consistent Learner");let _=`
Student demonstrates excellent attendance,
steady academic growth and strong ${o} aptitude.

Recent examination trends indicate continuous
improvement across ${a.join(", ")}.

Current promotion readiness is ${u}% and career inclination aligns with ${d} pathways.
`;return{learningStyle:c,learningVelocity:t>=85?20:t>=70?15:t>=50?8:-5,academicConsistency:s,subjectAffinity:o,career:d,careerConfidence:l,promotionReadiness:u,strengths:a.length?a:["Consistent Attendance"],improvements:n.length?n:["No major weaknesses"],summary:_}}])},996803,e=>e.a(async(t,a)=>{try{var n=e.i(89171),s=e.i(15270),i=e.i(368105),r=e.i(599683),o=e.i(597380),d=e.i(493399),l=e.i(294615),u=e.i(105437),c=e.i(332234),_=t([s,i,r,d]);async function m(e,{params:t}){try{let{id:e}=await t,a=await s.prisma.students.findUnique({where:{id:Number(e)}});if(!a)return n.NextResponse.json({error:"Student not found"},{status:404});let i=await s.prisma.attendance_master.findMany({where:{student_id:Number(e)},orderBy:{attendance_date:"desc"},take:30}),r=await s.prisma.marks.findMany({where:{student_id:Number(e)},include:{subjects:!0,exams:!0}}),o=await s.prisma.exam_schedule.findMany({orderBy:{exam_date:"asc"},take:5}),d={};r.forEach(e=>{let t=e.subjects?.subject_name||"Unknown";d[t]||(d[t]={total:0,count:0}),d[t].total+=Number(e.obtained_marks||0),d[t].count++});let c=Object.keys(d).map(e=>({subject:e,average:Math.round(d[e].total/d[e].count)})),_=c.filter(e=>e.average>=75).map(e=>e.subject),m=c.filter(e=>e.average<40).map(e=>e.subject),p=o.map(e=>({id:e.id,exam_date:e.exam_date,start_time:e.start_time,room_no:e.room_no,status:e.status})),E=i.filter(e=>"PRESENT"===e.status).length,h=i.length>0?Math.round(E/i.length*100):0,R=[...i].sort((e,t)=>new Date(t.attendance_date).getTime()-new Date(e.attendance_date).getTime()),f=0;for(let e of R)if("PRESENT"===e.status)f++;else break;let w=r.length>0?Number((r.reduce((e,t)=>e+Number(t.obtained_marks||0),0)/r.length).toFixed(2)):0,g=(0,l.calculateRisk)(h,w),y={upcomingExams:1,completedExams:+(r.length>0),examReadiness:w>0?Math.round(.4*h+.6*w):0},T={assignedAmount:0,paidAmount:0,outstandingAmount:0,complianceScore:100},$=[];h<75&&$.push("Attendance below 75%"),w>0&&w<40&&$.push("Academic performance below target"),w>0&&y.examReadiness<60&&$.push("Low exam readiness"),T.complianceScore<80&&$.push("Fee compliance issue");let N={healthScore:Math.round(.4*h+.4*w+.2*T.complianceScore),promotionProbability:Math.round(.3*h+.5*w+.2*T.complianceScore)},v=(0,u.generateStudentDNA)({attendancePercent:h,averageMarks:w,subjectStrengths:_,subjectWeaknesses:m});return n.NextResponse.json({student:a,attendancePercent:h,averageMarks:w,risk:g,subjectPerformance:c,attendance:i,marks:r,attendanceStreak:f,examStats:y,feeStats:T,aiInsights:N,upcomingExams:p,riskFactors:$,studentDNA:v})}catch(e){return console.error(e),n.NextResponse.json({error:"Failed"},{status:500})}}async function p({studentId:e,schoolId:t,academicYearId:a,classId:n,sectionId:i,promotionStatus:r,userId:o,metadata:d}){await s.prisma.$executeRawUnsafe(`
    INSERT INTO student_academic_history (
      student_id,
      school_id,
      academic_year_id,
      class_id,
      section_id,
      promotion_status,
      promoted_on,
      created_by,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,$8::jsonb)
    `,e,t,a,n,i,r,o,JSON.stringify(d||{}))}async function E(e,{params:t}){try{let{id:a}=await t,l=await e.json(),u=await (0,i.getCurrentUser)();if(!u)return(0,o.validationError)("Login required before updating a student.");let _=Number(a),m="SUPER_ADMIN"===u.role?null:Number(u.school_id),E=(await s.prisma.$queryRawUnsafe(`
        SELECT *
        FROM students
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,_,m))[0];if(!E)return(0,o.validationError)("Student not found or outside the selected school.");let h=await (0,r.getSelectedAcademicYear)(u.school_id),R=Number(l.academic_year_id??u.academic_year_id??h?.id)||null,f=Number(l.current_class_id??l.class_id)||null,w=Number(l.current_section_id??l.section_id)||null,g=(0,c.normalizeStudentStatus)(l.student_status??l.status??E.student_status??((0,c.statusIsActive)(E.is_active)?"ACTIVE":"DROPOUT")),y=(0,c.statusIsActive)(g,!!E.is_active),T=l.admission_number??E.admission_number??null,$=l.enrollment_number??E.enrollment_number??null;if(f&&!(await s.prisma.$queryRawUnsafe(`
          SELECT id
          FROM classes
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
          `,f,m)).length)return(0,o.validationError)("Selected class does not belong to the selected school.");if(w&&!(await s.prisma.$queryRawUnsafe(`
          SELECT id
          FROM sections
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
            AND ($3::int IS NULL OR class_id = $3::int)
          `,w,m,f)).length)return(0,o.validationError)("Selected section must belong to the selected class and school.");let N=[l.first_name,l.middle_name,l.last_name].filter(Boolean).join(" "),v=(await s.prisma.$queryRawUnsafe(`
        UPDATE students
        SET enrollment_number = $1,
            admission_number = $2,
            name = $3,
            first_name = $4,
            middle_name = $5,
            last_name = $6,
            gender = $7,
            phone = $8,
            email = $9,
            father_name = $10,
            mother_name = $11,
            father_phone = $12,
            mother_phone = $13,
            section_id = $14,
            current_class_id = $15,
            current_section_id = $16,
            academic_year_id = $17,
            student_status = $18,
            is_active = $19,
            status_updated_at = CURRENT_TIMESTAMP,
            status_reason = $20,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $21
          AND ($22::int IS NULL OR school_id = $22::int)
        RETURNING *
        `,$,T,N||l.name||null,l.first_name||null,l.middle_name||null,l.last_name||null,l.gender||null,l.phone||null,l.email||null,l.father_name||null,l.mother_name||null,l.father_phone||null,l.mother_phone||null,l.section_id?Number(l.section_id):w,f,w,R,g,y,l.status_reason||l.reason||("ACTIVE"===g?"Student record updated":`Status updated to ${g}`),_,m))[0];if(!v)return(0,o.validationError)("Student not found or outside the selected school.");return R&&(await s.prisma.$executeRawUnsafe(`
        INSERT INTO student_year_enrollments (
          school_id,
          student_id,
          academic_year_id,
          class_id,
          section_id,
          status,
          source,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,'ACTIVE','student_edit',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, academic_year_id)
        DO UPDATE SET
          class_id = EXCLUDED.class_id,
          section_id = EXCLUDED.section_id,
          status = 'ACTIVE',
          source = 'student_edit',
          updated_at = CURRENT_TIMESTAMP
        `,Number(v.school_id)||null,_,R,f,w),await p({studentId:_,schoolId:Number(v.school_id)||null,academicYearId:R,classId:f,sectionId:w,promotionStatus:"PROMOTED"===g?"PROMOTED":"UPDATED",userId:u.id||null,metadata:{source:"student_update",status:g}})),await (0,d.recordEvent)({school_id:Number(v.school_id)||null,academic_year_id:R,user_id:u.id,actor_role:u.role,module_name:"students",event_type:"STUDENT_UPDATED",action:"update",entity_type:"student",entity_id:_,summary:"Student record updated",payload:{class_id:f,section_id:w}}),n.NextResponse.json(v)}catch(e){return console.error("Student update error:",e),(0,o.apiError)(e,"Failed to update student")}}[s,i,r,d]=_.then?(await _)():_;let R=["ai_student_analysis","attendance","attendance_master","communication_logs","dining_attendance","dining_meal_assignments","dining_special_diets","fee_payments","homework_submissions","hostel_allocations","hostel_attendance","hostel_movement_history","hostel_students","marks","notifications","promotion_workflow_students","refunds","scholarships","student_exam_analysis","student_exam_answers","student_fee_assignments","student_marks_entry","student_promotions","student_timelines","student_year_enrollments","transport_assignments","transport_attendance","transport_pickup_drop_history"];async function h(e,{params:t}){try{let{id:e}=await t,a=await (0,i.getCurrentUser)();if(!a)return(0,o.validationError)("Login required before deleting a student.");let r=Number(e),l="SUPER_ADMIN"===a.role?null:Number(a.school_id),u=(await s.prisma.$queryRawUnsafe(`
        SELECT id, school_id, first_name, last_name, admission_number
        FROM students
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        `,r,l))[0];if(!u)return(0,o.validationError)("Student not found or outside the selected school.");return await s.prisma.$transaction(async e=>{for(let t of(await e.$executeRawUnsafe(`
          DELETE FROM payment_receipts
          WHERE payment_id IN (
            SELECT id FROM payments WHERE student_id = $1
          )
          `,r),await e.$executeRawUnsafe(`
          DELETE FROM invoice_audit_logs
          WHERE invoice_id IN (
            SELECT id FROM invoices WHERE student_id = $1
          )
          `,r),await e.$executeRawUnsafe(`
          DELETE FROM concession_audit_logs
          WHERE concession_request_id IN (
            SELECT id FROM concession_requests WHERE student_id = $1
          )
          `,r),await e.$executeRawUnsafe("DELETE FROM payments WHERE student_id = $1",r),await e.$executeRawUnsafe("DELETE FROM invoices WHERE student_id = $1",r),await e.$executeRawUnsafe("DELETE FROM concession_requests WHERE student_id = $1",r),R))await e.$executeRawUnsafe(`DELETE FROM ${t} WHERE student_id = $1`,r);await e.$executeRawUnsafe(`
          DELETE FROM event_ledger
          WHERE entity_type = 'student'
            AND entity_id = $1
          `,r),await e.$executeRawUnsafe("DELETE FROM students WHERE id = $1",r)}),await (0,d.recordEvent)({school_id:Number(u.school_id)||null,user_id:a.id,actor_role:a.role,module_name:"students",event_type:"STUDENT_DELETED",action:"delete",entity_type:"school",entity_id:Number(u.school_id)||null,summary:"Student record hard deleted",payload:{student_id:r,admission_number:u.admission_number}}),n.NextResponse.json({success:!0})}catch(e){return console.error("Student delete error:",e),(0,o.apiError)(e,"Failed to delete student")}}e.s(["DELETE",0,h,"GET",0,m,"PUT",0,E]),a()}catch(e){a(e)}},!1),385144,e=>e.a(async(t,a)=>{try{var n=e.i(747909),s=e.i(174017),i=e.i(996250),r=e.i(759756),o=e.i(561916),d=e.i(174677),l=e.i(869741),u=e.i(316795),c=e.i(487718),_=e.i(995169),m=e.i(47587),p=e.i(666012),E=e.i(570101),h=e.i(626937),R=e.i(10372),f=e.i(193695);e.i(52474);var w=e.i(600220),g=e.i(996803),y=t([g]);[g]=y.then?(await y)():y;let $=new n.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/students/[id]/route",pathname:"/api/students/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/students/[id]/route.ts",nextConfigOutput:"",userland:g,...{}}),{workAsyncStorage:N,workUnitAsyncStorage:v,serverHooks:S}=$;async function T(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),$.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/students/[id]/route";n=n.replace(/\/index$/,"")||"/";let i=await $.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:g,deploymentId:y,params:T,nextConfig:N,parsedUrl:v,isDraftMode:S,prerenderManifest:b,routerServerContext:A,isOnDemandRevalidate:C,revalidateOnlyGenerated:M,resolvedPathname:x,clientReferenceManifest:U,serverActionsManifest:O}=i,D=(0,l.normalizeAppPath)(n),I=!!(b.dynamicRoutes[D]||b.routes[x]),L=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,v,!1):t.end("This page could not be found"),null);if(I&&!S){let e=!!b.routes[x],t=b.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(N.adapterPath)return await L();throw new f.NoFallbackError}}let P=null;!I||$.isDev||S||(P=x,P="/index"===P?"/":P);let H=!0===$.isDev||!I,q=I&&!H;O&&U&&(0,d.setManifestsSingleton)({page:n,clientReferenceManifest:U,serverActionsManifest:O});let F=e.method||"GET",k=(0,o.getTracer)(),j=k.getActiveScopeSpan(),W=!!(null==A?void 0:A.isWrappedByNextServer),B=!!(0,r.getRequestMeta)(e,"minimalMode"),V=(0,r.getRequestMeta)(e,"incrementalCache")||await $.getIncrementalCache(e,N,b,B);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let G={params:T,previewProps:b.preview,renderOpts:{experimental:{authInterrupts:!!N.experimental.authInterrupts},cacheComponents:!!N.cacheComponents,supportsDynamicResponse:H,incrementalCache:V,cacheLifeProfiles:N.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,s)=>$.onRequestError(e,t,n,s,A)},sharedContext:{buildId:g,deploymentId:y}},K=new u.NodeNextRequest(e),X=new u.NodeNextResponse(t),z=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let i,r=async e=>$.handle(z,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=k.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let t=`${F} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",s),i.updateName(t))}else e.updateName(`${F} ${n}`)}),d=async i=>{var o,d;let l=async({previousCacheEntry:s})=>{try{if(!B&&C&&M&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await r(i);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let d=G.renderOpts.collectedTags;if(!I)return await (0,p.sendResponse)(K,X,n,G.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[R.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,s=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:C})},!1,A),t}},u=await $.handleResponse({req:e,nextConfig:N,cacheKey:P,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:b,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:M,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!I)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",C?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,E.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&I||c.delete(R.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,h.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(K,X,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};W&&j?await d(j):(i=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(_.BaseServerSpan.handleRequest,{spanName:`${F} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},d),void 0,!W))}catch(t){if(t instanceof f.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:C})},!1,A),I)throw t;return await (0,p.sendResponse)(K,X,new Response(null,{status:500})),null}}e.s(["handler",0,T,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:v})},"routeModule",0,$,"serverHooks",0,S,"workAsyncStorage",0,N,"workUnitAsyncStorage",0,v]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_134-ahw._.js.map