module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},215619,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(368105),n=e.i(15270),s=t([i,n]);[i,n]=s.then?(await s)():s;let p=e=>e.trim().toUpperCase();async function o(e){if(!e)return new Set;let t=await n.prisma.roles.findFirst({where:{role_name:e}});if(!t)return new Set;let a=(await n.prisma.role_permissions.findMany({where:{role_id:t.id}})).map(e=>e.permission_id).filter(e=>"number"==typeof e);if(!a.length)return new Set;let r=await n.prisma.permissions.findMany({where:{id:{in:a}}});return new Set(r.filter(e=>e.module_name&&e.action_name).map(e=>`${p(e.module_name)}.${p(e.action_name)}`))}async function c(e,t){if(!e?.role)return!1;let a="string"==typeof t?p(t):`${p(t.module)}.${p(t.action)}`;return(await o(e.role)).has(a)}async function l(){let e=await (0,i.getCurrentUser)();return e?{user:e,response:null}:{user:null,response:r.NextResponse.json({error:"Unauthorized"},{status:401})}}async function d(e){let t=await l();return t.user?await c(t.user,e)?{user:t.user,response:null}:{user:t.user,response:r.NextResponse.json({error:"Forbidden"},{status:403})}:t}async function u(e){return"SUPER_ADMIN"===String(e?.role||"").trim().toUpperCase()}async function _(e){return await u(e)?{}:{school_id:e?.school_id??-1}}async function m(e){return e?n.prisma.academic_years.findFirst({where:{school_id:e,is_current:!0},orderBy:{id:"desc"}}):null}async function S(e){let[t,a,r,i]=await Promise.all([o(e.role),m(e.school_id),n.prisma.governance_settings.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{setting_key:"asc"}}),n.prisma.feature_flags.findMany({where:{OR:[{school_id:null},{school_id:e.school_id??void 0}]},orderBy:{flag_key:"asc"}})]);return{user:{id:e.id,school_id:e.school_id,school_name:e.school_name},activeAcademicYear:a,permissions:Array.from(t).sort(),settings:r,flags:i}}e.s(["getActiveAcademicYear",0,m,"getGovernanceSnapshot",0,S,"getRolePermissionCodes",0,o,"requireCurrentUser",0,l,"requirePermission",0,d,"scopedSchoolWhere",0,_,"userHasPermission",0,c]),a()}catch(e){a(e)}},!1),922799,e=>{"use strict";function t(e){return String(e||"").trim().toUpperCase().replaceAll(" ","_")}function a(e){let a=t(e);return"ADMIN"===a||"SCHOOL_ADMIN"===a}e.s(["canManageRecord",0,function(e,r,i){let n=t(e);return"SUPER_ADMIN"===n||("delete"===i?"school"!==r&&"class"!==r&&"section"!==r&&a(n):"school"===r||"class"===r?a(n):"section"===r?["ADMIN","SCHOOL_ADMIN","PRINCIPAL"].includes(n):"subject"===r||"timetable"===r||"exam"===r||"exam_schedule"===r?["ADMIN","SCHOOL_ADMIN","PRINCIPAL","TEACHER"].includes(n):("transport"===r||"transport_route"===r||"transport_vehicle"===r||"hostel"===r||"dining_menu"===r||"meal_plan"===r)&&a(n))},"isSuperAdmin",0,function(e){return"SUPER_ADMIN"===t(e)},"managementError",0,function(e,t){return`Your role does not have access to ${t} ${e.replaceAll("_"," ")} records.`}])},599683,e=>e.a(async(t,a)=>{try{var r=e.i(493458),i=e.i(15270),n=t([i]);async function s(e){let t=await (0,r.cookies)(),a=t.get("active_academic_year_id")?.value,n=String(a||"").trim().toLowerCase();if("all"===n||"0"===n)return null;let s=a?Number(a):null;if(s&&Number.isFinite(s)){let t=await i.prisma.academic_years.findFirst({where:{id:s,...e?{OR:[{school_id:e},{school_id:null}]}:{}}});if(t)return t}return i.prisma.academic_years.findFirst({where:{is_current:!0,...e?{OR:[{school_id:e},{school_id:null}]}:{}},orderBy:{id:"desc"}})}[i]=n.then?(await n)():n,e.s(["getSelectedAcademicYear",0,s]),a()}catch(e){a(e)}},!1),19754,e=>e.a(async(t,a)=>{try{var r=e.i(493458),i=e.i(599683),n=e.i(922799),s=e.i(368105),o=e.i(15270),c=t([i,s,o]);[i,s,o]=c.then?(await c)():c;let u=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},_=e=>{let t=String(e||"").trim().toLowerCase();return"all"===t||"0"===t};async function l(e){let t,a,o=await (0,s.getCurrentUser)();if(!o)return null;let c=e?new URL(e.url):null;try{let e=await (0,r.cookies)();t=e.get("active_school_id")?.value,a=e.get("active_academic_year_id")?.value}catch{t=void 0,a=void 0}let l=c?.searchParams.get("school_id")??c?.searchParams.get("selected_school_id")??t,d=c?.searchParams.get("academic_year_id")??c?.searchParams.get("selected_academic_year_id")??a,m=(0,n.isSuperAdmin)(o.role),S=u(l),p=Number(o.school_id)||null,E=m?_(l)?null:S??p??null:p,y=m&&!E,R=null,N="current";if(_(d))N="all";else{let e=u(d);if(e)R=e,N="selected";else if("all"===o.academic_year_scope)N="all";else if(Number(o.academic_year_id))R=Number(o.academic_year_id),N="selected";else{let e=await (0,i.getSelectedAcademicYear)(E);R=Number(e?.id)||null,N="current"}}return{user:o,schoolId:E,academicYearId:R,allSchools:y,allYears:"all"===N,schoolScope:y?"all":m?"selected":"assigned",academicYearScope:N}}let m=(e,t)=>{let a=e?.[t],r="string"==typeof a||"number"==typeof a?Number(a):null;return Number.isFinite(r)&&Number(r)>0?Number(r):null};async function d(e,t=null){let a=await l(e);if(!a)return{context:null,error:"Login required before saving records."};let r=m(t,"school_id")??m(t,"selected_school_id")??a.schoolId;if(!r)return{context:null,error:"Select a school before saving this record."};if(!a.allSchools&&a.schoolId&&r!==a.schoolId)return{context:null,error:"You cannot save records outside the selected or assigned school."};if(!await o.prisma.schools.findFirst({where:{id:r,is_active:!0},select:{id:!0}}))return{context:null,error:"Selected school was not found or is inactive."};let i=m(t,"academic_year_id")??m(t,"selected_academic_year_id")??m(t,"source_academic_year_id")??a.academicYearId;return i?await o.prisma.academic_years.findFirst({where:{id:i,OR:[{school_id:r},{school_id:null}]},select:{id:!0}})?{context:{...a,requiredSchoolId:r,requiredAcademicYearId:i,createdBy:Number(a.user.id)||null,updatedBy:Number(a.user.id)||null},error:null}:{context:null,error:"Selected academic year does not belong to the selected school context."}:{context:null,error:"Select an academic year before saving this record."}}e.s(["resolveMutationContext",0,d,"resolvePlatformContext",0,l]),a()}catch(e){a(e)}},!1),410325,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(368105),n=e.i(15270),s=e.i(556995),o=t([i,n,s]);[i,n,s]=o.then?(await o)():o;let y=["STUDENTS","TEACHERS","ACADEMICS","FINANCE","OPERATIONS","DINING","TRANSPORT","HOSTEL","REPORTS","ANALYTICS","AI","USER_MANAGEMENT","PARENT_PORTAL","MOBILE_APP"],R=["STUDENTS","TEACHERS","ACADEMICS","ATTENDANCE","HOMEWORK","QUESTION_BANK","QUESTION_PAPERS","EXAMS","MARKS_ENTRY","STUDENT_360","TEACHER_360","SCHOOL_360","FINANCE","CONCESSIONS","INVOICES","PAYMENTS","DINING","TRANSPORT","HOSTEL","OPERATIONS","REPORTS","ANALYTICS","GOVERNANCE","WAR_ROOM","TOTTECH_AI","SCHOOLGPT","SETTINGS","USER_MANAGEMENT","PARENT_PORTAL","MOBILE_APP"],N=[{module_key:"STUDENTS",module_name:"Students",category:"Academics",sort_order:1},{module_key:"TEACHERS",module_name:"Teachers",category:"Academics",sort_order:2},{module_key:"ACADEMICS",module_name:"Academics",category:"Academics",sort_order:3},{module_key:"ATTENDANCE",module_name:"Attendance",category:"Operations",sort_order:4},{module_key:"HOMEWORK",module_name:"Homework",category:"Academics",sort_order:5},{module_key:"QUESTION_BANK",module_name:"Question Bank",category:"Academics",sort_order:6},{module_key:"QUESTION_PAPERS",module_name:"Question Papers",category:"Academics",sort_order:7},{module_key:"EXAMS",module_name:"Exams",category:"Academics",sort_order:8},{module_key:"MARKS_ENTRY",module_name:"Marks Entry",category:"Academics",sort_order:9},{module_key:"STUDENT_360",module_name:"Student 360",category:"Insights",sort_order:10},{module_key:"TEACHER_360",module_name:"Teacher 360",category:"Insights",sort_order:11},{module_key:"SCHOOL_360",module_name:"School 360",category:"Insights",sort_order:12},{module_key:"FINANCE",module_name:"Finance",category:"Finance",sort_order:13},{module_key:"CONCESSIONS",module_name:"Concessions",category:"Finance",sort_order:14},{module_key:"INVOICES",module_name:"Invoices",category:"Finance",sort_order:15},{module_key:"PAYMENTS",module_name:"Payments",category:"Finance",sort_order:16},{module_key:"DINING",module_name:"Dining",category:"Operations",sort_order:17},{module_key:"TRANSPORT",module_name:"Transport",category:"Operations",sort_order:18},{module_key:"HOSTEL",module_name:"Hostel",category:"Operations",sort_order:19},{module_key:"OPERATIONS",module_name:"Operations",category:"Operations",sort_order:20},{module_key:"REPORTS",module_name:"Reports",category:"Governance",sort_order:21},{module_key:"ANALYTICS",module_name:"Analytics",category:"Governance",sort_order:22},{module_key:"GOVERNANCE",module_name:"Governance",category:"Governance",sort_order:23},{module_key:"WAR_ROOM",module_name:"War Room",category:"Governance",sort_order:24},{module_key:"TOTTECH_AI",module_name:"TOTTECH AI",category:"AI",sort_order:25},{module_key:"SCHOOLGPT",module_name:"SchoolGPT",category:"AI",sort_order:26},{module_key:"SETTINGS",module_name:"Settings",category:"Administration",sort_order:27},{module_key:"USER_MANAGEMENT",module_name:"User Management",category:"Administration",sort_order:28},{module_key:"PARENT_PORTAL",module_name:"Parent Portal",category:"Parent",sort_order:29},{module_key:"MOBILE_APP",module_name:"Mobile App",category:"Platform",sort_order:30}],O={STARTER:["STUDENTS","TEACHERS","ACADEMICS"],PROFESSIONAL:["STUDENTS","TEACHERS","ACADEMICS","FINANCE","OPERATIONS","REPORTS"],ENTERPRISE:[...y],CUSTOM:["STUDENTS","TEACHERS","ACADEMICS"]};function c(e){return O[String(e||"STARTER").trim().toUpperCase()]||O.STARTER}function l(e){let t=new Set(e.filter(e=>e.enabled).map(e=>String(e.module_key||"").toUpperCase()));return y.reduce((e,a)=>({...e,[a]:t.has(a)}),{})}async function d(e,t,a){let r=new Set(c(t));await n.prisma.$transaction(y.map(t=>n.prisma.school_module_access.upsert({where:{school_id_module_key:{school_id:e,module_key:t}},create:{school_id:e,module_key:t,enabled:r.has(t),enabled_by:a??null,enabled_at:r.has(t)?new Date:null},update:{}})))}async function u(e){if(!e)return l(y.map(e=>({module_key:e,enabled:!0})));let t=await n.prisma.schools.findUnique({where:{id:Number(e)},select:{id:!0,subscription_plan:!0}});if(!t)return l([]);await d(t.id,t.subscription_plan);let a=await n.prisma.school_module_access.findMany({where:{school_id:t.id},select:{module_key:!0,enabled:!0}});return l(a)}async function _(){await n.prisma.$transaction(N.map(e=>n.prisma.module_master.upsert({where:{module_key:e.module_key},create:{module_key:e.module_key,module_name:e.module_name,category:e.category,sort_order:e.sort_order,is_active:!0},update:{module_name:e.module_name,category:e.category,sort_order:e.sort_order,is_active:!0}})))}async function m(e,t){if(!e||!t){var a;let e;return a=N.map(e=>({module_key:e.module_key,enabled:!0})),e=new Set(a.filter(e=>e.enabled).map(e=>String(e.module_key||"").toUpperCase())),R.reduce((t,a)=>({...t,[a]:e.has(a)}),{})}await _();let r=await u(t),i=await n.prisma.user_module_access.findMany({where:{user_id:Number(e),school_id:Number(t),is_active:!0,module_master:{is_active:!0}},select:{is_active:!0,module_master:{select:{module_key:!0}}}}),s=new Set(i.filter(e=>e.is_active).map(e=>String(e.module_master?.module_key||"").toUpperCase()));return R.reduce((e,t)=>({...e,[t]:i.length?s.has(t)&&!1!==r[t]:!1!==r[t]}),{})}async function S(e){await _();let t=Array.from(new Set(e.moduleKeys.map(e=>String(e||"").trim().toUpperCase()).filter(Boolean))),a=await n.prisma.module_master.findMany({where:{module_key:{in:t},is_active:!0},select:{id:!0,module_key:!0}}),r=new Map(a.map(e=>[e.module_key,e.id]));await n.prisma.user_module_access.updateMany({where:{user_id:e.userId,school_id:e.schoolId},data:{is_active:!1}}),await n.prisma.$transaction(t.filter(e=>r.has(e)).map(t=>n.prisma.user_module_access.upsert({where:{uq_user_module_access_scope:{user_id:e.userId,school_id:e.schoolId,module_id:r.get(t)}},create:{user_id:e.userId,school_id:e.schoolId,module_id:r.get(t),created_by:e.createdBy??null,is_active:!0},update:{is_active:!0}})))}async function p(e){let t=await (0,i.getCurrentUser)();if(!t)return{user:null,response:r.NextResponse.json({error:"Unauthorized"},{status:401})};if((0,s.isSuperAdminRole)(t.role))return{user:t,response:null};let a=Number(t.school_id)||null;if(!a)return{user:t,response:r.NextResponse.json({error:"Select a school before using this module."},{status:403})};let n=await u(a),o=await m(Number(t.id)||null,a);return n[e]&&!1!==o[e]?{user:t,response:null}:{user:t,response:r.NextResponse.json({error:"This module is not enabled for the selected school subscription.",module_key:e},{status:403})}}async function E(e,t,a){if((0,s.isSuperAdminRole)(t))return JSON.stringify(l(y.map(e=>({module_key:e,enabled:!0}))));let r=await u(e),i=await m(a,e);return JSON.stringify(R.reduce((e,t)=>({...e,[t]:!1!==r[t]&&!1!==i[t]}),{}))}e.s(["MODULE_KEYS",0,y,"getSchoolModuleAccess",0,u,"getUserModuleAccess",0,m,"moduleCookieValue",0,E,"modulesForPlan",0,c,"normalizeModuleKey",0,function(e){let t=String(e||"").trim().toUpperCase();return y.includes(t)?t:null},"replaceUserModuleAccess",0,S,"requireSchoolModule",0,p]),a()}catch(e){a(e)}},!1),948556,e=>e.a(async(t,a)=>{try{var r=e.i(89171),i=e.i(15270),n=e.i(19754),s=e.i(215619),o=e.i(410325),c=t([i,n,s,o]);[i,n,s,o]=c.then?(await c)():c;let u=e=>{let t=Number(e??0);return Number.isFinite(t)?t:0},_=(e,t)=>t>0?Math.round(e/t*100):0;async function l(e){let t=await (0,o.requireSchoolModule)("REPORTS");if(t.response)return t.response;let a=await (0,s.requirePermission)({module:"reports",action:"read"});if(a.response)return a.response;let c=await (0,n.resolvePlatformContext)(e);if(!c)return r.NextResponse.json({error:"Unauthorized"},{status:401});let l=c.schoolId,d=c.academicYearId,m=l?{OR:[{school_id:l},{school_id:null}]}:{},[S,p,E,y,R,N,O,L,h,A,C]=await Promise.all([i.prisma.report_exports.findMany({where:m,orderBy:{created_at:"desc"},take:100}),i.prisma.$queryRawUnsafe(`
      SELECT
        s.id,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        s.enrollment_number,
        s.phone,
        c.class_name,
        sec.section_name,
        ay.academic_year,
        s.created_at
      FROM students s
      LEFT JOIN classes c ON c.id = s.current_class_id
      LEFT JOIN sections sec ON sec.id = COALESCE(s.current_section_id, s.section_id)
      LEFT JOIN academic_years ay ON ay.id = s.academic_year_id
      WHERE ($1::int IS NULL OR s.school_id = $1::int)
        AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)
      ORDER BY s.created_at DESC NULLS LAST, s.id DESC
      LIMIT 40
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        t.id,
        TRIM(COALESCE(t.first_name, '') || ' ' || COALESCE(t.last_name, '')) AS teacher_name,
        t.employee_id,
        t.department,
        t.designation,
        t.phone,
        t.email,
        ay.academic_year,
        t.created_at
      FROM teachers t
      LEFT JOIN academic_years ay ON ay.id = t.academic_year_id
      WHERE ($1::int IS NULL OR t.school_id = $1::int)
        AND ($2::int IS NULL OR t.academic_year_id = $2::int OR t.academic_year_id IS NULL)
      ORDER BY t.created_at DESC NULLS LAST, t.id DESC
      LIMIT 40
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        am.id,
        am.attendance_date,
        am.status,
        am.remarks,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name
      FROM attendance_master am
      LEFT JOIN students s ON s.id = am.student_id
      LEFT JOIN classes c ON c.id = am.class_id
      LEFT JOIN sections sec ON sec.id = am.section_id
      WHERE ($1::int IS NULL OR COALESCE(am.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR am.academic_year_id = $2::int OR am.academic_year_id IS NULL)
      ORDER BY am.attendance_date DESC NULLS LAST, am.id DESC
      LIMIT 80
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        i.id,
        i.invoice_number,
        i.invoice_date,
        i.due_date,
        i.total_amount,
        i.paid_amount,
        i.balance_amount,
        i.status,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      WHERE ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
      ORDER BY i.created_at DESC NULLS LAST, i.id DESC
      LIMIT 80
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        p.id,
        p.receipt_number,
        p.payment_date,
        p.payment_method,
        p.amount,
        p.reference_number,
        i.invoice_number,
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
      ORDER BY p.created_at DESC NULLS LAST, p.id DESC
      LIMIT 60
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        fc.id,
        fc.fee_name,
        fc.fee_code,
        fc.amount,
        fc.frequency,
        c.class_name,
        sec.section_name,
        fc.is_active,
        fc.created_at
      FROM fee_categories fc
      LEFT JOIN classes c ON c.id = fc.class_id
      LEFT JOIN sections sec ON sec.id = fc.section_id
      WHERE ($1::int IS NULL OR fc.school_id = $1::int OR fc.school_id IS NULL)
        AND ($2::int IS NULL OR fc.academic_year_id = $2::int OR fc.academic_year_id IS NULL)
      ORDER BY fc.created_at DESC NULLS LAST, fc.id DESC
      LIMIT 60
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT 'Exam Schedules' AS record_type, COUNT(*)::int AS total
      FROM exam_schedule es
      WHERE ($1::int IS NULL OR es.school_id = $1::int)
        AND ($2::int IS NULL OR es.academic_year_id = $2::int OR es.academic_year_id IS NULL)
      UNION ALL
      SELECT 'Question Papers' AS record_type, COUNT(*)::int AS total
      FROM question_papers qp
      WHERE ($1::int IS NULL OR qp.school_id = $1::int)
        AND ($2::int IS NULL OR qp.academic_year_id = $2::int OR qp.academic_year_id IS NULL)
      UNION ALL
      SELECT 'Marks Entries' AS record_type, COUNT(*)::int AS total
      FROM student_marks_entry sme
      WHERE ($1::int IS NULL OR sme.school_id = $1::int)
        AND ($2::int IS NULL OR sme.academic_year_id = $2::int OR sme.academic_year_id IS NULL)
      UNION ALL
      SELECT 'Homework' AS record_type, COUNT(*)::int AS total
      FROM homework_assignments ha
      WHERE ($1::int IS NULL OR ha.school_id = $1::int)
        AND ($2::int IS NULL OR ha.academic_year_id = $2::int OR ha.academic_year_id IS NULL)
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        id,
        module_name,
        event_type,
        action,
        entity_type,
        entity_id,
        severity,
        summary,
        occurred_at
      FROM event_ledger
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      ORDER BY occurred_at DESC NULLS LAST, id DESC
      LIMIT 80
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        da.id,
        da.attendance_date,
        da.meal_type,
        da.status,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        c.class_name,
        sec.section_name
      FROM dining_attendance da
      LEFT JOIN students s ON s.id = da.student_id
      LEFT JOIN classes c ON c.id = da.class_id
      LEFT JOIN sections sec ON sec.id = da.section_id
      WHERE ($1::int IS NULL OR COALESCE(da.school_id, s.school_id) = $1::int)
        AND ($2::int IS NULL OR da.academic_year_id = $2::int OR da.academic_year_id IS NULL)
      ORDER BY da.attendance_date DESC NULLS LAST, da.id DESC
      LIMIT 60
      `,l,d),i.prisma.$queryRawUnsafe(`
      SELECT
        (SELECT COUNT(*)::int FROM students s WHERE ($1::int IS NULL OR s.school_id = $1::int) AND ($2::int IS NULL OR s.academic_year_id = $2::int OR s.academic_year_id IS NULL)) AS students,
        (SELECT COUNT(*)::int FROM teachers t WHERE ($1::int IS NULL OR t.school_id = $1::int) AND ($2::int IS NULL OR t.academic_year_id = $2::int OR t.academic_year_id IS NULL)) AS teachers,
        (SELECT COUNT(*)::int FROM classes c WHERE ($1::int IS NULL OR c.school_id = $1::int) AND ($2::int IS NULL OR c.academic_year_id = $2::int OR c.academic_year_id IS NULL)) AS classes,
        (SELECT COUNT(*)::int FROM sections sec WHERE ($1::int IS NULL OR sec.school_id = $1::int) AND ($2::int IS NULL OR sec.academic_year_id = $2::int OR sec.academic_year_id IS NULL)) AS sections,
        (SELECT COUNT(*)::int FROM attendance_master am WHERE ($1::int IS NULL OR am.school_id = $1::int) AND ($2::int IS NULL OR am.academic_year_id = $2::int OR am.academic_year_id IS NULL)) AS attendance,
        (SELECT COUNT(*)::int FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS invoices,
        (SELECT COALESCE(SUM(i.total_amount),0)::numeric FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS total_fees,
        (SELECT COALESCE(SUM(i.paid_amount),0)::numeric FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS collected_fees,
        (SELECT COALESCE(SUM(i.balance_amount),0)::numeric FROM invoices i WHERE ($1::int IS NULL OR i.school_id = $1::int) AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)) AS pending_fees,
        (SELECT COUNT(*)::int FROM event_ledger el WHERE ($1::int IS NULL OR el.school_id = $1::int) AND ($2::int IS NULL OR el.academic_year_id = $2::int OR el.academic_year_id IS NULL)) AS events,
        (SELECT COUNT(*)::int FROM dining_attendance da WHERE ($1::int IS NULL OR da.school_id = $1::int) AND ($2::int IS NULL OR da.academic_year_id = $2::int OR da.academic_year_id IS NULL)) AS dining_attendance
      `,l,d)]),I=C[0]||{},T=u(I.total_fees),f=u(I.collected_fees),v=u(I.pending_fees),g=y.length,U=y.filter(e=>String(e.status||"").toUpperCase().includes("PRESENT")).length,w=y.filter(e=>String(e.status||"").toUpperCase().includes("ABSENT")).length,b=[{key:"principal-daily-command",title:"Principal Daily Command",metrics:[{label:"Students",value:u(I.students)},{label:"Teachers",value:u(I.teachers)},{label:"Collection %",value:_(f,T)},{label:"Events",value:u(I.events)}],chart:[{label:"Students",value:u(I.students)},{label:"Teachers",value:u(I.teachers)},{label:"Classes",value:u(I.classes)},{label:"Sections",value:u(I.sections)}],details:[...p.slice(0,8),...E.slice(0,8),...h.slice(0,8)]},{key:"attendance-risk-summary",title:"Attendance Risk Summary",metrics:[{label:"Records",value:u(I.attendance)},{label:"Present",value:U},{label:"Absent",value:w},{label:"Present %",value:_(U,g)}],chart:[{label:"Present",value:U},{label:"Absent",value:w},{label:"Other",value:g-U-w}],details:y},{key:"finance-collection-summary",title:"Finance Collection Summary",metrics:[{label:"Total Fees",value:T,currency:!0},{label:"Collected",value:f,currency:!0},{label:"Pending",value:v,currency:!0},{label:"Invoices",value:u(I.invoices)}],chart:[{label:"Total",value:T},{label:"Collected",value:f},{label:"Pending",value:v}],details:[...R,...N.slice(0,30),...O.slice(0,20)]},{key:"academic-performance-summary",title:"Academic Performance Summary",metrics:L.map(e=>({label:String(e.record_type||"Record"),value:u(e.total)})),chart:L.map(e=>({label:String(e.record_type||"Record"),value:u(e.total)})),details:L},{key:"operations-audit-summary",title:"Operations Audit Summary",metrics:[{label:"Ledger Events",value:u(I.events)},{label:"Dining Attendance",value:u(I.dining_attendance)},{label:"Recent Events",value:h.length}],chart:[{label:"Events",value:u(I.events)},{label:"Dining",value:u(I.dining_attendance)}],details:[...h,...A]},{key:"student-360-summary",title:"Student 360 Summary",metrics:[{label:"Students",value:u(I.students)},{label:"Attendance Records",value:u(I.attendance)},{label:"Invoices",value:u(I.invoices)},{label:"Dining Records",value:u(I.dining_attendance)}],chart:[{label:"Attendance",value:u(I.attendance)},{label:"Invoices",value:u(I.invoices)},{label:"Dining",value:u(I.dining_attendance)}],details:[...p,...y.slice(0,30),...R.slice(0,30),...A.slice(0,30)]}];return r.NextResponse.json({exports:S,summary:{students:u(I.students),teachers:u(I.teachers),classes:u(I.classes),sections:u(I.sections),attendance:u(I.attendance),invoices:u(I.invoices),totalFees:T,collectedFees:f,pendingFees:v,events:u(I.events),diningAttendance:u(I.dining_attendance),collectionHealth:_(f,T)},datasets:{students:p,teachers:E,attendance:y,invoices:R,payments:N,feeCategories:O,academics:L,events:h,dining:A},reports:b})}async function d(e){let t=await (0,o.requireSchoolModule)("REPORTS");if(t.response)return t.response;let a=await (0,s.requirePermission)({module:"reports",action:"read"});if(a.response)return a.response;let c=await (0,n.resolvePlatformContext)(e);if(!c)return r.NextResponse.json({error:"Unauthorized"},{status:401});let l=await e.json(),d=l.filters&&"object"==typeof l.filters?l.filters:{},u=await i.prisma.report_exports.create({data:{school_id:c.schoolId??a.user?.school_id??null,report_key:String(l.report_key??"custom-report"),format:l.format??"json",status:"READY",filter_json:{...d,active_school_id:c.schoolId,active_academic_year_id:c.academicYearId},created_by:a.user?.id??null}});return r.NextResponse.json({export:u})}e.s(["GET",0,l,"POST",0,d]),a()}catch(e){a(e)}},!1),507452,e=>e.a(async(t,a)=>{try{var r=e.i(747909),i=e.i(174017),n=e.i(996250),s=e.i(759756),o=e.i(561916),c=e.i(174677),l=e.i(869741),d=e.i(316795),u=e.i(487718),_=e.i(995169),m=e.i(47587),S=e.i(666012),p=e.i(570101),E=e.i(626937),y=e.i(10372),R=e.i(193695);e.i(52474);var N=e.i(600220),O=e.i(948556),L=t([O]);[O]=L.then?(await L)():L;let A=new r.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/reports/route",pathname:"/api/reports",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/reports/route.ts",nextConfigOutput:"",userland:O,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:I,serverHooks:T}=A;async function h(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),A.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/reports/route";r=r.replace(/\/index$/,"")||"/";let n=await A.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:O,deploymentId:L,params:h,nextConfig:C,parsedUrl:I,isDraftMode:T,prerenderManifest:f,routerServerContext:v,isOnDemandRevalidate:g,revalidateOnlyGenerated:U,resolvedPathname:w,clientReferenceManifest:b,serverActionsManifest:$}=n,M=(0,l.normalizeAppPath)(r),P=!!(f.dynamicRoutes[M]||f.routes[w]),D=async()=>((null==v?void 0:v.render404)?await v.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!T){let e=!!f.routes[w],t=f.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await D();throw new R.NoFallbackError}}let k=null;!P||A.isDev||T||(k=w,k="/index"===k?"/":k);let x=!0===A.isDev||!P,F=P&&!x;$&&b&&(0,c.setManifestsSingleton)({page:r,clientReferenceManifest:b,serverActionsManifest:$});let H=e.method||"GET",q=(0,o.getTracer)(),W=q.getActiveScopeSpan(),j=!!(null==v?void 0:v.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),Y=(0,s.getRequestMeta)(e,"incrementalCache")||await A.getIncrementalCache(e,C,f,B);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let G={params:h,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:x,incrementalCache:Y,cacheLifeProfiles:C.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,i)=>A.onRequestError(e,t,r,i,v)},sharedContext:{buildId:O,deploymentId:L}},J=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(t));try{let n,s=async e=>A.handle(V,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=q.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",i),n.updateName(t))}else e.updateName(`${H} ${r}`)}),c=async n=>{var o,c;let l=async({previousCacheEntry:i})=>{try{if(!B&&g&&U&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(n);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let c=G.renderOpts.collectedTags;if(!P)return await (0,S.sendResponse)(J,K,r,G.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(r.headers);c&&(t[y.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,i=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,v),t}},d=await A.handleResponse({req:e,nextConfig:C,cacheKey:k,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:g,revalidateOnlyGenerated:U,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!P)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",g?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,p.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&P||u.delete(y.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,E.getCacheControlHeader)(d.cacheControl)),await (0,S.sendResponse)(J,K,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};j&&W?await c(W):(n=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(_.BaseServerSpan.handleRequest,{spanName:`${H} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},c),void 0,!j))}catch(t){if(t instanceof R.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:g})},!1,v),P)throw t;return await (0,S.sendResponse)(J,K,new Response(null,{status:500})),null}}e.s(["handler",0,h,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:I})},"routeModule",0,A,"serverHooks",0,T,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,I]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__13b05eu._.js.map