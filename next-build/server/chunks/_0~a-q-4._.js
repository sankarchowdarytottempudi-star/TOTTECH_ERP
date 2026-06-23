module.exports=[438802,e=>{"use strict";e.s(["generateTeacherDNA",0,function({attendancePercent:e,experienceScore:t,impactScore:a}){let n=Math.round(.5*e+.5*a),i=Math.round(.7*a+.3*e),r=Math.round(.8*a),s=Math.min(t+15,100),o=Math.round(.6*a+.4*t);return{teachingStyle:a>80?"Highly Engaging":a>60?"Balanced Instructor":"Needs Engagement",classroomManagement:n,studentSatisfaction:i,parentCommunication:r,innovationScore:s,leadershipPotential:o,burnoutRisk:e<75?"HIGH":e<90?"MEDIUM":"LOW",strengths:["Student Engagement","Classroom Discipline"],improvements:["Parent Communication"],summary:`Teacher demonstrates ${a}% instructional effectiveness with ${n}% classroom management capability.`}}])},366799,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(15270),r=e.i(368105),s=e.i(599683),o=e.i(597380),l=e.i(493399),d=e.i(438802),c=t([i,r,s,l]);async function u(e,t){try{let{id:e}=await t.params,a=await i.prisma.teachers.findUnique({where:{id:Number(e)}});if(!a)return n.NextResponse.json({error:"Teacher Not Found"},{status:404});let r=await i.prisma.$queryRawUnsafe(`
        SELECT
          tca.*,
          c.class_name,
          sec.section_name
        FROM teacher_class_assignments tca
        LEFT JOIN classes c ON c.id = tca.class_id
        LEFT JOIN sections sec ON sec.id = tca.section_id
        WHERE tca.teacher_id = $1
          AND tca.status = 'ACTIVE'
        ORDER BY tca.id DESC
        `,Number(e)),s=r[0]||null,o=await i.prisma.teacher_attendance.findMany({where:{teacher_id:Number(e)}}),l=o.filter(e=>"PRESENT"===e.status).length,c=o.length>0?Math.round(l/o.length*100):100,u=Math.min(10*(a.experience_years||0),100),_=Math.round(.6*c+.4*u),p="Excellent";_<60?p="Needs Support":_<80&&(p="Good");let h=Math.round(.5*_+.3*c+.2*u),E=c<70?"HIGH":c<85?"MEDIUM":"LOW",m=(0,d.generateTeacherDNA)({attendancePercent:c,experienceScore:u,impactScore:_}),R=_>=80?["Continue mentoring high-performing students","Maintain attendance consistency","Conduct advanced workshops","Share best practices with faculty"]:["Increase classroom engagement activities","Improve parent communication","Attend professional development sessions","Track student progress more frequently"];return n.NextResponse.json({teacher:{...a,class_id:s?.class_id??null,section_id:s?.section_id??null,class_name:s?.class_name??null,section_name:s?.section_name??null,assignments:r},attendancePercent:c,experienceScore:u,impactScore:_,teacherHealth:h,burnoutRisk:E,rating:p,recommendations:R,teacherDNA:m})}catch(e){return console.error(e),n.NextResponse.json({error:"Failed"},{status:500})}}async function _(e,t){try{let{id:a}=await t.params,d=await e.json(),c=await (0,r.getCurrentUser)();if(!c)return(0,o.validationError)("Login required before updating a teacher.");let u=Number(a),_="SUPER_ADMIN"===c.role?null:Number(c.school_id),p=await (0,s.getSelectedAcademicYear)(c.school_id),h=Number(d.academic_year_id??c.academic_year_id??p?.id)||null,E=Number(d.class_id)||null,m=Number(d.section_id)||null,R=Number(d.subject_id)||null,g=Array.isArray(d.assignments),y=g?d.assignments.map(e=>({class_id:Number(e.class_id)||null,section_id:Number(e.section_id)||null,subject_id:Number(e.subject_id)||null,assignment_type:String(e.assignment_type||d.assignment_type||"SUBJECT_TEACHER").toUpperCase()})).filter(e=>e.class_id||e.subject_id):E||R?[{class_id:E,section_id:m,subject_id:R,assignment_type:d.assignment_type||"CLASS_TEACHER"}]:[];if(E&&!(await i.prisma.$queryRawUnsafe(`
          SELECT id
          FROM classes
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
          `,E,_)).length)return(0,o.validationError)("Selected class does not belong to the selected school.");if(m&&!(await i.prisma.$queryRawUnsafe(`
          SELECT id
          FROM sections
          WHERE id = $1
            AND ($2::int IS NULL OR school_id = $2::int)
            AND ($3::int IS NULL OR class_id = $3::int)
          `,m,_,E)).length)return(0,o.validationError)("Selected section must belong to the selected class and school.");let T=(await i.prisma.$queryRawUnsafe(`
        UPDATE teachers
        SET academic_year_id = $1,
            employee_id = $2,
            first_name = $3,
            last_name = $4,
            gender = $5,
            phone = $6,
            email = $7,
            qualification = $8,
            experience_years = $9,
            joining_date = $10,
            department = $11,
            designation = $12,
            salary = $13,
            address = $14,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $15
          AND ($16::int IS NULL OR school_id = $16::int)
        RETURNING *
        `,h,d.employee_id||null,d.first_name||null,d.last_name||null,d.gender||null,d.phone||null,d.email||null,d.qualification||null,d.experience_years?Number(d.experience_years):null,d.joining_date?new Date(d.joining_date):null,d.department||null,d.designation||null,d.salary?Number(d.salary):null,d.address||null,u,_))[0];if(!T)return(0,o.validationError)("Teacher not found or outside the selected school.");if(y.length>0)for(let e of(g&&await i.prisma.$executeRawUnsafe(`
          UPDATE teacher_class_assignments
          SET status = 'INACTIVE',
              updated_at = CURRENT_TIMESTAMP
          WHERE teacher_id = $1
            AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
          `,u,h),y))await i.prisma.$executeRawUnsafe(`
        INSERT INTO teacher_class_assignments (
          school_id,
          academic_year_id,
          teacher_id,
          class_id,
          section_id,
          subject_id,
          assignment_type,
          status,
          assigned_by,
          assigned_at,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'ACTIVE',$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        ON CONFLICT (
          teacher_id,
          academic_year_id,
          class_id,
          (COALESCE(section_id, 0)),
          (COALESCE(subject_id, 0)),
          assignment_type
        )
        WHERE status = 'ACTIVE'
        DO UPDATE SET
          section_id = EXCLUDED.section_id,
          subject_id = EXCLUDED.subject_id,
          status = 'ACTIVE',
          assigned_by = EXCLUDED.assigned_by,
          updated_at = CURRENT_TIMESTAMP
        `,Number(T.school_id)||_,h,u,e.class_id,e.section_id,e.subject_id,e.assignment_type,c.id||null);else g&&await i.prisma.$executeRawUnsafe(`
        UPDATE teacher_class_assignments
        SET status = 'INACTIVE',
            updated_at = CURRENT_TIMESTAMP
        WHERE teacher_id = $1
          AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
        `,u,h);return await (0,l.recordEvent)({school_id:Number(T.school_id)||null,academic_year_id:h,user_id:c.id,actor_role:c.role,module_name:"teachers",event_type:"TEACHER_UPDATED",action:"update",entity_type:"teacher",entity_id:u,summary:"Teacher record updated",payload:{assignments:y}}),n.NextResponse.json(T)}catch(e){return console.error("Teacher update error:",e),(0,o.apiError)(e,"Failed to update teacher")}}[i,r,s,l]=c.then?(await c)():c;let h=["teacher_attendance","teacher_timelines","teacher_class_assignments","dining_attendance","dining_meal_assignments","dining_special_diets","homework_assignments","timetable_entries"];async function p(e,t){try{let{id:e}=await t.params,a=await (0,r.getCurrentUser)();if(!a)return(0,o.validationError)("Login required before deleting a teacher.");let s=Number(e),d="SUPER_ADMIN"===a.role?null:Number(a.school_id),c=(await i.prisma.$queryRawUnsafe(`
        SELECT id, school_id, first_name, last_name, employee_id
        FROM teachers
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        `,s,d))[0];if(!c)return(0,o.validationError)("Teacher not found or outside the selected school.");return await i.prisma.$transaction(async e=>{for(let t of(await e.$executeRawUnsafe(`
          UPDATE classes
          SET class_teacher_id = NULL
          WHERE class_teacher_id = $1
          `,s),await e.$executeRawUnsafe(`
          UPDATE exam_schedule
          SET invigilator_teacher_id = NULL
          WHERE invigilator_teacher_id = $1
          `,s),h))await e.$executeRawUnsafe(`DELETE FROM ${t} WHERE teacher_id = $1`,s);await e.$executeRawUnsafe(`
          DELETE FROM event_ledger
          WHERE entity_type = 'teacher'
            AND entity_id = $1
          `,s),await e.$executeRawUnsafe("DELETE FROM teachers WHERE id = $1",s)}),await (0,l.recordEvent)({school_id:Number(c.school_id)||null,user_id:a.id,actor_role:a.role,module_name:"teachers",event_type:"TEACHER_DELETED",action:"delete",entity_type:"school",entity_id:Number(c.school_id)||null,summary:"Teacher record hard deleted",payload:{teacher_id:s,employee_id:c.employee_id}}),n.NextResponse.json({success:!0})}catch(e){return console.error("Teacher delete error:",e),(0,o.apiError)(e,"Failed to delete teacher")}}e.s(["DELETE",0,p,"GET",0,u,"PUT",0,_]),a()}catch(e){a(e)}},!1),39549,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),s=e.i(759756),o=e.i(561916),l=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),_=e.i(995169),p=e.i(47587),h=e.i(666012),E=e.i(570101),m=e.i(626937),R=e.i(10372),g=e.i(193695);e.i(52474);var y=e.i(600220),T=e.i(366799),N=t([T]);[T]=N.then?(await N)():N;let w=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/teachers/[id]/route",pathname:"/api/teachers/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/teachers/[id]/route.ts",nextConfigOutput:"",userland:T,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:A,serverHooks:$}=w;async function f(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),w.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/teachers/[id]/route";n=n.replace(/\/index$/,"")||"/";let r=await w.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:T,deploymentId:N,params:f,nextConfig:C,parsedUrl:A,isDraftMode:$,prerenderManifest:v,routerServerContext:U,isOnDemandRevalidate:S,revalidateOnlyGenerated:b,resolvedPathname:I,clientReferenceManifest:D,serverActionsManifest:M}=r,x=(0,d.normalizeAppPath)(n),L=!!(v.dynamicRoutes[x]||v.routes[I]),O=async()=>((null==U?void 0:U.render404)?await U.render404(e,t,A,!1):t.end("This page could not be found"),null);if(L&&!$){let e=!!v.routes[I],t=v.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await O();throw new g.NoFallbackError}}let P=null;!L||w.isDev||$||(P=I,P="/index"===P?"/":P);let H=!0===w.isDev||!L,q=L&&!H;M&&D&&(0,l.setManifestsSingleton)({page:n,clientReferenceManifest:D,serverActionsManifest:M});let j=e.method||"GET",F=(0,o.getTracer)(),W=F.getActiveScopeSpan(),k=!!(null==U?void 0:U.isWrappedByNextServer),V=!!(0,s.getRequestMeta)(e,"minimalMode"),B=(0,s.getRequestMeta)(e,"incrementalCache")||await w.getIncrementalCache(e,C,v,V);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let G={params:f,previewProps:v.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:H,incrementalCache:B,cacheLifeProfiles:C.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>w.onRequestError(e,t,n,i,U)},sharedContext:{buildId:T,deploymentId:N}},K=new c.NodeNextRequest(e),X=new c.NodeNextResponse(t),J=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t));try{let r,s=async e=>w.handle(J,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${j} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${j} ${n}`)}),l=async r=>{var o,l;let d=async({previousCacheEntry:i})=>{try{if(!V&&S&&b&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(r);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=G.renderOpts.collectedTags;if(!L)return await (0,h.sendResponse)(K,X,n,G.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,i=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:S})},!1,U),t}},c=await w.handleResponse({req:e,nextConfig:C,cacheKey:P,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:b,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:V});if(!L)return null;if((null==c||null==(o=c.value)?void 0:o.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});V||t.setHeader("x-nextjs-cache",S?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),$&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,E.fromNodeOutgoingHttpHeaders)(c.value.headers);return V&&L||u.delete(R.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,m.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(K,X,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};k&&W?await l(W):(r=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(_.BaseServerSpan.handleRequest,{spanName:`${j} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},l),void 0,!k))}catch(t){if(t instanceof g.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:S})},!1,U),L)throw t;return await (0,h.sendResponse)(K,X,new Response(null,{status:500})),null}}e.s(["handler",0,f,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:A})},"routeModule",0,w,"serverHooks",0,$,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,A]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0~a-q-4._.js.map