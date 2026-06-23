module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},922799,e=>{"use strict";function t(e){return String(e||"").trim().toUpperCase().replaceAll(" ","_")}function a(e){let a=t(e);return"ADMIN"===a||"SCHOOL_ADMIN"===a}e.s(["canManageRecord",0,function(e,n,r){let i=t(e);return"SUPER_ADMIN"===i||("delete"===r?"school"!==n&&"class"!==n&&"section"!==n&&a(i):"school"===n||"class"===n?a(i):"section"===n?["ADMIN","SCHOOL_ADMIN","PRINCIPAL"].includes(i):"subject"===n||"timetable"===n||"exam"===n||"exam_schedule"===n?["ADMIN","SCHOOL_ADMIN","PRINCIPAL","TEACHER"].includes(i):("transport"===n||"transport_route"===n||"transport_vehicle"===n||"hostel"===n||"dining_menu"===n||"meal_plan"===n)&&a(i))},"isSuperAdmin",0,function(e){return"SUPER_ADMIN"===t(e)},"managementError",0,function(e,t){return`Your role does not have access to ${t} ${e.replaceAll("_"," ")} records.`}])},599683,e=>e.a(async(t,a)=>{try{var n=e.i(493458),r=e.i(15270),i=t([r]);async function o(e){let t=await (0,n.cookies)(),a=t.get("active_academic_year_id")?.value,i=String(a||"").trim().toLowerCase();if("all"===i||"0"===i)return null;let o=a?Number(a):null;if(o&&Number.isFinite(o)){let t=await r.prisma.academic_years.findFirst({where:{id:o,...e?{OR:[{school_id:e},{school_id:null}]}:{}}});if(t)return t}return r.prisma.academic_years.findFirst({where:{is_current:!0,...e?{OR:[{school_id:e},{school_id:null}]}:{}},orderBy:{id:"desc"}})}[r]=i.then?(await i)():i,e.s(["getSelectedAcademicYear",0,o]),a()}catch(e){a(e)}},!1),19754,e=>e.a(async(t,a)=>{try{var n=e.i(493458),r=e.i(599683),i=e.i(922799),o=e.i(368105),s=e.i(15270),c=t([r,o,s]);[r,o,s]=c.then?(await c)():c;let u=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},m=e=>{let t=String(e||"").trim().toLowerCase();return"all"===t||"0"===t};async function d(e){let t,a,s=await (0,o.getCurrentUser)();if(!s)return null;let c=e?new URL(e.url):null;try{let e=await (0,n.cookies)();t=e.get("active_school_id")?.value,a=e.get("active_academic_year_id")?.value}catch{t=void 0,a=void 0}let d=c?.searchParams.get("school_id")??c?.searchParams.get("selected_school_id")??t,l=c?.searchParams.get("academic_year_id")??c?.searchParams.get("selected_academic_year_id")??a,_=(0,i.isSuperAdmin)(s.role),E=u(d),p=Number(s.school_id)||null,S=_?m(d)?null:E??p??null:p,A=_&&!S,O=null,C="current";if(m(l))C="all";else{let e=u(l);if(e)O=e,C="selected";else if("all"===s.academic_year_scope)C="all";else if(Number(s.academic_year_id))O=Number(s.academic_year_id),C="selected";else{let e=await (0,r.getSelectedAcademicYear)(S);O=Number(e?.id)||null,C="current"}}return{user:s,schoolId:S,academicYearId:O,allSchools:A,allYears:"all"===C,schoolScope:A?"all":_?"selected":"assigned",academicYearScope:C}}let _=(e,t)=>{let a=e?.[t],n="string"==typeof a||"number"==typeof a?Number(a):null;return Number.isFinite(n)&&Number(n)>0?Number(n):null};async function l(e,t=null){let a=await d(e);if(!a)return{context:null,error:"Login required before saving records."};let n=_(t,"school_id")??_(t,"selected_school_id")??a.schoolId;if(!n)return{context:null,error:"Select a school before saving this record."};if(!a.allSchools&&a.schoolId&&n!==a.schoolId)return{context:null,error:"You cannot save records outside the selected or assigned school."};if(!await s.prisma.schools.findFirst({where:{id:n,is_active:!0},select:{id:!0}}))return{context:null,error:"Selected school was not found or is inactive."};let r=_(t,"academic_year_id")??_(t,"selected_academic_year_id")??_(t,"source_academic_year_id")??a.academicYearId;return r?await s.prisma.academic_years.findFirst({where:{id:r,OR:[{school_id:n},{school_id:null}]},select:{id:!0}})?{context:{...a,requiredSchoolId:n,requiredAcademicYearId:r,createdBy:Number(a.user.id)||null,updatedBy:Number(a.user.id)||null},error:null}:{context:null,error:"Selected academic year does not belong to the selected school context."}:{context:null,error:"Select an academic year before saving this record."}}e.s(["resolveMutationContext",0,l,"resolvePlatformContext",0,d]),a()}catch(e){a(e)}},!1),410325,e=>e.a(async(t,a)=>{try{var n=e.i(89171),r=e.i(368105),i=e.i(15270),o=e.i(556995),s=t([r,i,o]);[r,i,o]=s.then?(await s)():s;let A=["STUDENTS","TEACHERS","ACADEMICS","FINANCE","OPERATIONS","DINING","TRANSPORT","HOSTEL","REPORTS","ANALYTICS","AI","USER_MANAGEMENT","PARENT_PORTAL","MOBILE_APP"],O=["STUDENTS","TEACHERS","ACADEMICS","ATTENDANCE","HOMEWORK","QUESTION_BANK","QUESTION_PAPERS","EXAMS","MARKS_ENTRY","STUDENT_360","TEACHER_360","SCHOOL_360","FINANCE","CONCESSIONS","INVOICES","PAYMENTS","DINING","TRANSPORT","HOSTEL","OPERATIONS","REPORTS","ANALYTICS","GOVERNANCE","WAR_ROOM","TOTTECH_AI","SCHOOLGPT","SETTINGS","USER_MANAGEMENT","PARENT_PORTAL","MOBILE_APP"],C=[{module_key:"STUDENTS",module_name:"Students",category:"Academics",sort_order:1},{module_key:"TEACHERS",module_name:"Teachers",category:"Academics",sort_order:2},{module_key:"ACADEMICS",module_name:"Academics",category:"Academics",sort_order:3},{module_key:"ATTENDANCE",module_name:"Attendance",category:"Operations",sort_order:4},{module_key:"HOMEWORK",module_name:"Homework",category:"Academics",sort_order:5},{module_key:"QUESTION_BANK",module_name:"Question Bank",category:"Academics",sort_order:6},{module_key:"QUESTION_PAPERS",module_name:"Question Papers",category:"Academics",sort_order:7},{module_key:"EXAMS",module_name:"Exams",category:"Academics",sort_order:8},{module_key:"MARKS_ENTRY",module_name:"Marks Entry",category:"Academics",sort_order:9},{module_key:"STUDENT_360",module_name:"Student 360",category:"Insights",sort_order:10},{module_key:"TEACHER_360",module_name:"Teacher 360",category:"Insights",sort_order:11},{module_key:"SCHOOL_360",module_name:"School 360",category:"Insights",sort_order:12},{module_key:"FINANCE",module_name:"Finance",category:"Finance",sort_order:13},{module_key:"CONCESSIONS",module_name:"Concessions",category:"Finance",sort_order:14},{module_key:"INVOICES",module_name:"Invoices",category:"Finance",sort_order:15},{module_key:"PAYMENTS",module_name:"Payments",category:"Finance",sort_order:16},{module_key:"DINING",module_name:"Dining",category:"Operations",sort_order:17},{module_key:"TRANSPORT",module_name:"Transport",category:"Operations",sort_order:18},{module_key:"HOSTEL",module_name:"Hostel",category:"Operations",sort_order:19},{module_key:"OPERATIONS",module_name:"Operations",category:"Operations",sort_order:20},{module_key:"REPORTS",module_name:"Reports",category:"Governance",sort_order:21},{module_key:"ANALYTICS",module_name:"Analytics",category:"Governance",sort_order:22},{module_key:"GOVERNANCE",module_name:"Governance",category:"Governance",sort_order:23},{module_key:"WAR_ROOM",module_name:"War Room",category:"Governance",sort_order:24},{module_key:"TOTTECH_AI",module_name:"TOTTECH AI",category:"AI",sort_order:25},{module_key:"SCHOOLGPT",module_name:"SchoolGPT",category:"AI",sort_order:26},{module_key:"SETTINGS",module_name:"Settings",category:"Administration",sort_order:27},{module_key:"USER_MANAGEMENT",module_name:"User Management",category:"Administration",sort_order:28},{module_key:"PARENT_PORTAL",module_name:"Parent Portal",category:"Parent",sort_order:29},{module_key:"MOBILE_APP",module_name:"Mobile App",category:"Platform",sort_order:30}],R={STARTER:["STUDENTS","TEACHERS","ACADEMICS"],PROFESSIONAL:["STUDENTS","TEACHERS","ACADEMICS","FINANCE","OPERATIONS","REPORTS"],ENTERPRISE:[...A],CUSTOM:["STUDENTS","TEACHERS","ACADEMICS"]};function c(e){return R[String(e||"STARTER").trim().toUpperCase()]||R.STARTER}function d(e){let t=new Set(e.filter(e=>e.enabled).map(e=>String(e.module_key||"").toUpperCase()));return A.reduce((e,a)=>({...e,[a]:t.has(a)}),{})}async function l(e,t,a){let n=new Set(c(t));await i.prisma.$transaction(A.map(t=>i.prisma.school_module_access.upsert({where:{school_id_module_key:{school_id:e,module_key:t}},create:{school_id:e,module_key:t,enabled:n.has(t),enabled_by:a??null,enabled_at:n.has(t)?new Date:null},update:{}})))}async function u(e){if(!e)return d(A.map(e=>({module_key:e,enabled:!0})));let t=await i.prisma.schools.findUnique({where:{id:Number(e)},select:{id:!0,subscription_plan:!0}});if(!t)return d([]);await l(t.id,t.subscription_plan);let a=await i.prisma.school_module_access.findMany({where:{school_id:t.id},select:{module_key:!0,enabled:!0}});return d(a)}async function m(){await i.prisma.$transaction(C.map(e=>i.prisma.module_master.upsert({where:{module_key:e.module_key},create:{module_key:e.module_key,module_name:e.module_name,category:e.category,sort_order:e.sort_order,is_active:!0},update:{module_name:e.module_name,category:e.category,sort_order:e.sort_order,is_active:!0}})))}async function _(e,t){if(!e||!t){var a;let e;return a=C.map(e=>({module_key:e.module_key,enabled:!0})),e=new Set(a.filter(e=>e.enabled).map(e=>String(e.module_key||"").toUpperCase())),O.reduce((t,a)=>({...t,[a]:e.has(a)}),{})}await m();let n=await u(t),r=await i.prisma.user_module_access.findMany({where:{user_id:Number(e),school_id:Number(t),is_active:!0,module_master:{is_active:!0}},select:{is_active:!0,module_master:{select:{module_key:!0}}}}),o=new Set(r.filter(e=>e.is_active).map(e=>String(e.module_master?.module_key||"").toUpperCase()));return O.reduce((e,t)=>({...e,[t]:r.length?o.has(t)&&!1!==n[t]:!1!==n[t]}),{})}async function E(e){await m();let t=Array.from(new Set(e.moduleKeys.map(e=>String(e||"").trim().toUpperCase()).filter(Boolean))),a=await i.prisma.module_master.findMany({where:{module_key:{in:t},is_active:!0},select:{id:!0,module_key:!0}}),n=new Map(a.map(e=>[e.module_key,e.id]));await i.prisma.user_module_access.updateMany({where:{user_id:e.userId,school_id:e.schoolId},data:{is_active:!1}}),await i.prisma.$transaction(t.filter(e=>n.has(e)).map(t=>i.prisma.user_module_access.upsert({where:{uq_user_module_access_scope:{user_id:e.userId,school_id:e.schoolId,module_id:n.get(t)}},create:{user_id:e.userId,school_id:e.schoolId,module_id:n.get(t),created_by:e.createdBy??null,is_active:!0},update:{is_active:!0}})))}async function p(e){let t=await (0,r.getCurrentUser)();if(!t)return{user:null,response:n.NextResponse.json({error:"Unauthorized"},{status:401})};if((0,o.isSuperAdminRole)(t.role))return{user:t,response:null};let a=Number(t.school_id)||null;if(!a)return{user:t,response:n.NextResponse.json({error:"Select a school before using this module."},{status:403})};let i=await u(a),s=await _(Number(t.id)||null,a);return i[e]&&!1!==s[e]?{user:t,response:null}:{user:t,response:n.NextResponse.json({error:"This module is not enabled for the selected school subscription.",module_key:e},{status:403})}}async function S(e,t,a){if((0,o.isSuperAdminRole)(t))return JSON.stringify(d(A.map(e=>({module_key:e,enabled:!0}))));let n=await u(e),r=await _(a,e);return JSON.stringify(O.reduce((e,t)=>({...e,[t]:!1!==n[t]&&!1!==r[t]}),{}))}e.s(["MODULE_KEYS",0,A,"getSchoolModuleAccess",0,u,"getUserModuleAccess",0,_,"moduleCookieValue",0,S,"modulesForPlan",0,c,"normalizeModuleKey",0,function(e){let t=String(e||"").trim().toUpperCase();return A.includes(t)?t:null},"replaceUserModuleAccess",0,E,"requireSchoolModule",0,p]),a()}catch(e){a(e)}},!1),845713,e=>e.a(async(t,a)=>{try{var n=e.i(15270),r=t([n]);[n]=r.then?(await r)():r;let u=e=>{let t=Number(e??0);return Number.isFinite(t)?t:0},m=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},_=e=>{let t=String(e||"").trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:null},E=(e="i.invoice_date")=>`
  ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
  AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
  AND ($3::int IS NULL OR i.class_id = $3::int)
  AND ($4::int IS NULL OR i.section_id = $4::int)
  AND ($5::date IS NULL OR ${e} >= $5::date)
  AND ($6::date IS NULL OR ${e} <= $6::date)
`,p=(e="p.payment_date")=>`
  ($1::int IS NULL OR COALESCE(p.school_id, i.school_id, s.school_id) = $1::int)
  AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
  AND ($3::int IS NULL OR p.class_id = $3::int)
  AND ($4::int IS NULL OR p.section_id = $4::int)
  AND ($5::date IS NULL OR ${e} >= $5::date)
  AND ($6::date IS NULL OR ${e} <= $6::date)
`;function i(e){return[e.schoolId??null,e.academicYearId??null,e.classId??null,e.sectionId??null,e.from??null,e.to??null]}function o(e,t){return t>0?Math.round(e/t*100):0}async function s(e,t){let a=i(t),[r,s,d,l,m,_,S,A,O,C,R,N]=await Promise.all([t.schoolId?n.prisma.$queryRawUnsafe("SELECT id, school_name, school_code, logo_url FROM schools WHERE id = $1 LIMIT 1",t.schoolId):Promise.resolve([]),t.academicYearId?n.prisma.$queryRawUnsafe("SELECT id, academic_year FROM academic_years WHERE id = $1 LIMIT 1",t.academicYearId):Promise.resolve([]),n.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(i.id)::int AS invoice_count,
        COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
        COALESCE(SUM(i.paid_amount), 0)::numeric AS invoice_paid,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending,
        COUNT(DISTINCT i.student_id) FILTER (WHERE COALESCE(i.balance_amount, 0) > 0 AND COALESCE(i.due_date, CURRENT_DATE) < CURRENT_DATE)::int AS defaulters,
        COUNT(*) FILTER (WHERE COALESCE(i.balance_amount, 0) > 0)::int AS pending_invoice_count
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      WHERE ${E()}
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT COALESCE(SUM(COALESCE(approved_amount, requested_amount, 0)), 0)::numeric AS concessions
      FROM concession_requests cr
      WHERE ($1::int IS NULL OR cr.school_id = $1::int)
        AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
        AND ($3::int IS NULL OR EXISTS (SELECT 1 FROM students s WHERE s.id = cr.student_id AND s.current_class_id = $3::int))
        AND ($4::int IS NULL OR EXISTS (SELECT 1 FROM students s WHERE s.id = cr.student_id AND COALESCE(s.current_section_id, s.section_id) = $4::int))
        AND ($5::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) >= $5::date)
        AND ($6::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) <= $6::date)
        AND UPPER(COALESCE(cr.status, '')) = 'APPROVED'
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT COALESCE(SUM(fc.amount), 0)::numeric AS expected_fee_categories
      FROM fee_categories fc
      WHERE ($1::int IS NULL OR fc.school_id = $1::int OR fc.school_id IS NULL)
        AND ($2::int IS NULL OR fc.academic_year_id = $2::int OR fc.academic_year_id IS NULL)
        AND ($3::int IS NULL OR fc.class_id = $3::int OR fc.class_id IS NULL)
        AND ($4::int IS NULL OR fc.section_id = $4::int OR fc.section_id IS NULL)
        AND COALESCE(fc.is_active, true) = true
      `,t.schoolId??null,t.academicYearId??null,t.classId??null,t.sectionId??null),n.prisma.$queryRawUnsafe(`
      WITH months AS (
        SELECT date_trunc('month', d)::date AS month_start
        FROM generate_series(
          COALESCE($5::date, date_trunc('year', CURRENT_DATE)::date),
          COALESCE($6::date, CURRENT_DATE),
          interval '1 month'
        ) d
      ),
      invoice_month AS (
        SELECT date_trunc('month', i.invoice_date)::date AS month_start,
               COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
               COALESCE(SUM(i.balance_amount), 0)::numeric AS pending
        FROM invoices i
        LEFT JOIN students s ON s.id = i.student_id
        WHERE ${E()}
        GROUP BY 1
      ),
      payment_month AS (
        SELECT date_trunc('month', p.payment_date)::date AS month_start,
               COALESCE(SUM(p.amount), 0)::numeric AS collected
        FROM payments p
        LEFT JOIN invoices i ON i.id = p.invoice_id
        LEFT JOIN students s ON s.id = p.student_id
        WHERE ${p()}
        GROUP BY 1
      ),
      concession_month AS (
        SELECT date_trunc('month', COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at))::date AS month_start,
               COALESCE(SUM(COALESCE(cr.approved_amount, cr.requested_amount, 0)), 0)::numeric AS concessions
        FROM concession_requests cr
        WHERE ($1::int IS NULL OR cr.school_id = $1::int)
          AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
          AND UPPER(COALESCE(cr.status, '')) = 'APPROVED'
        GROUP BY 1
      )
      SELECT
        m.month_start,
        to_char(m.month_start, 'Mon YYYY') AS month,
        COALESCE(im.generated, 0)::numeric AS generated,
        COALESCE(pm.collected, 0)::numeric AS collected,
        COALESCE(im.pending, 0)::numeric AS pending,
        COALESCE(cm.concessions, 0)::numeric AS concessions
      FROM months m
      LEFT JOIN invoice_month im ON im.month_start = m.month_start
      LEFT JOIN payment_month pm ON pm.month_start = m.month_start
      LEFT JOIN concession_month cm ON cm.month_start = m.month_start
      ORDER BY m.month_start
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(c.class_name, 'Unassigned') AS label,
        COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
        COALESCE(SUM(i.paid_amount), 0)::numeric AS collected,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      WHERE ${E()}
      GROUP BY c.class_name
      ORDER BY generated DESC
      LIMIT 20
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(sc.school_name, 'Unassigned') AS label,
        COALESCE(SUM(i.total_amount), 0)::numeric AS generated,
        COALESCE(SUM(i.paid_amount), 0)::numeric AS collected,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN schools sc ON sc.id = COALESCE(i.school_id, s.school_id)
      WHERE ${E()}
      GROUP BY sc.school_name
      ORDER BY generated DESC
      LIMIT 20
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT
        i.*,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name,
        ay.academic_year,
        sc.school_name
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      LEFT JOIN academic_years ay ON ay.id = i.academic_year_id
      LEFT JOIN schools sc ON sc.id = COALESCE(i.school_id, s.school_id)
      WHERE ${E()}
      ORDER BY i.invoice_date DESC NULLS LAST, i.id DESC
      LIMIT 500
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT
        p.*,
        i.invoice_number,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        s.admission_number,
        c.class_name,
        sec.section_name,
        ay.academic_year,
        sc.school_name
      FROM payments p
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN students s ON s.id = p.student_id
      LEFT JOIN classes c ON c.id = p.class_id
      LEFT JOIN sections sec ON sec.id = p.section_id
      LEFT JOIN academic_years ay ON ay.id = p.academic_year_id
      LEFT JOIN schools sc ON sc.id = COALESCE(p.school_id, i.school_id, s.school_id)
      WHERE ${p()}
      ORDER BY p.payment_date DESC NULLS LAST, p.id DESC
      LIMIT 500
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT
        i.*,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        COALESCE(s.phone, s.father_phone, s.mother_phone) AS mobile,
        s.admission_number,
        c.class_name,
        sec.section_name,
        sc.school_name
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      LEFT JOIN schools sc ON sc.id = COALESCE(i.school_id, s.school_id)
      WHERE ${E()}
        AND COALESCE(i.balance_amount, 0) > 0
      ORDER BY i.due_date ASC NULLS LAST, i.balance_amount DESC
      LIMIT 500
      `,...a),n.prisma.$queryRawUnsafe(`
      SELECT
        i.student_id,
        COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
        COALESCE(s.phone, s.father_phone, s.mother_phone) AS mobile,
        s.admission_number,
        c.class_name,
        sec.section_name,
        COUNT(i.id)::int AS overdue_invoices,
        COALESCE(SUM(i.balance_amount), 0)::numeric AS pending_amount,
        MIN(i.due_date) AS oldest_due_date
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      LEFT JOIN classes c ON c.id = i.class_id
      LEFT JOIN sections sec ON sec.id = i.section_id
      WHERE ${E()}
        AND COALESCE(i.balance_amount, 0) > 0
        AND COALESCE(i.due_date, CURRENT_DATE) < CURRENT_DATE
      GROUP BY i.student_id, student_name, COALESCE(s.phone, s.father_phone, s.mother_phone), s.admission_number, c.class_name, sec.section_name
      ORDER BY pending_amount DESC
      LIMIT 500
      `,...a)]),h=d[0]||{},y=u(h.generated),L=u(h.invoice_paid),I=C.reduce((e,t)=>e+u(t.amount),0)||L,T=u(h.pending),g=u(l[0]?.concessions),f=u(m[0]?.expected_fee_categories),v=y+Math.max(f-y,0),U=_.map(e=>{let t=u(e.generated),a=u(e.collected);return{...e,generated:t,collected:a,pending:u(e.pending),concessions:u(e.concessions),collection_percentage:o(a,t)}});return{context:{selectedSchool:r[0]||null,selectedAcademicYear:s[0]||null,school_id:t.schoolId??null,academic_year_id:t.academicYearId??null,all_schools:e.allSchools&&!t.schoolId,all_years:e.allYears&&!t.academicYearId,school_scope:e.schoolScope,academic_year_scope:e.academicYearScope,filters:t},kpis:{totalRevenue:y,totalInvoices:u(h.invoice_count),collectedAmount:I,pendingAmount:T,collectionPercentage:o(I,y),defaulters:u(h.defaulters),concessions:g,expectedRevenue:v,pendingInvoices:u(h.pending_invoice_count)},monthlyAnalytics:U,comparisons:{classRevenue:S.map(c),schoolRevenue:A.map(c)},charts:{collectionTrend:U.map(e=>({label:e.month,value:e.collected})),revenueTrend:U.map(e=>({label:e.month,value:e.generated})),pendingTrend:U.map(e=>({label:e.month,value:e.pending})),collectionVsTarget:U.map(e=>({label:e.month,collected:e.collected,target:e.generated}))},invoicesData:O,paymentsData:C,pendingFees:R,defaultersData:N,outstandingInvoices:R,recentCollections:C.slice(0,25),legacy:{totalFees:y,totalCollected:I,pending:T,invoices:u(h.invoice_count),payments:C.length,collectionHealth:o(I,y),pendingInvoices:u(h.pending_invoice_count),chart:[{label:"Generated",value:y},{label:"Collected",value:I},{label:"Pending",value:T}]}}}function c(e){return{...e,generated:u(e.generated),collected:u(e.collected),pending:u(e.pending),collection_percentage:o(u(e.collected),u(e.generated))}}async function d(e,t,a){var n;let r,i=await s(t,a),o=i.monthlyAnalytics,c={daily:i.paymentsData,weekly:i.paymentsData,monthly:o,"academic-year":o,"pending-fee":i.pendingFees,overdue:i.pendingFees.filter(e=>e.due_date&&new Date(String(e.due_date))<new Date),defaulter:i.defaultersData,concession:await l(a),"invoice-audit":i.invoicesData,"payment-audit":i.paymentsData}[e]||o;return{type:e,title:(n=e,(r={daily:"Daily Collection Report",weekly:"Weekly Collection Report",monthly:"Monthly Collection Report","academic-year":"Academic Year Collection Report","pending-fee":"Pending Fee Report",overdue:"Overdue Report",defaulter:"Defaulter Report",concession:"Concession Report","invoice-audit":"Invoice Audit Report","payment-audit":"Payment Audit Report"})[n]||r.monthly),context:i.context,kpis:i.kpis,rows:c,totals:c.reduce((e,t)=>({generated:e.generated+u(t.generated??t.total_amount),collected:e.collected+u(t.collected??t.amount??t.paid_amount),pending:e.pending+u(t.pending??t.balance_amount??t.pending_amount),concessions:e.concessions+u(t.concessions??t.approved_amount)}),{generated:0,collected:0,pending:0,concessions:0})}}async function l(e){return n.prisma.$queryRawUnsafe(`
    SELECT
      cr.*,
      COALESCE(s.name, TRIM(COALESCE(s.first_name, '') || ' ' || COALESCE(s.last_name, ''))) AS student_name,
      s.admission_number,
      i.invoice_number,
      fc.fee_name
    FROM concession_requests cr
    LEFT JOIN students s ON s.id = cr.student_id
    LEFT JOIN invoices i ON i.id = cr.invoice_id
    LEFT JOIN fee_categories fc ON fc.id = cr.fee_category_id
    WHERE ($1::int IS NULL OR cr.school_id = $1::int)
      AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
      AND ($3::int IS NULL OR COALESCE(s.current_class_id, i.class_id) = $3::int)
      AND ($4::int IS NULL OR COALESCE(s.current_section_id, s.section_id, i.section_id) = $4::int)
      AND ($5::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) >= $5::date)
      AND ($6::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) <= $6::date)
    ORDER BY COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) DESC NULLS LAST, cr.id DESC
    LIMIT 500
    `,...i(e))}e.s(["filtersFromRequest",0,function(e,t){let a=new URL(e.url);return{schoolId:t.allSchools?m(a.searchParams.get("school_id")):t.schoolId,academicYearId:t.allYears?m(a.searchParams.get("academic_year_id")):t.academicYearId,classId:m(a.searchParams.get("class_id")),sectionId:m(a.searchParams.get("section_id")),from:_(a.searchParams.get("from")),to:_(a.searchParams.get("to")),allSchools:t.allSchools,allYears:t.allYears}},"getFinanceCommandCenter",0,s,"getFinanceReport",0,d,"normalizeReportType",0,function(e){let t=String(e||"").trim().toLowerCase();return["daily","weekly","monthly","academic-year","pending-fee","overdue","defaulter","concession","invoice-audit","payment-audit"].includes(t)?t:"monthly"}]),a()}catch(e){a(e)}},!1),48246,e=>e.a(async(t,a)=>{try{var n=e.i(89171),r=e.i(19754),i=e.i(845713),o=e.i(410325),s=t([r,i,o]);async function c(e){let t=await (0,o.requireSchoolModule)("FINANCE");if(t.response)return t.response;let a=await (0,r.resolvePlatformContext)(e);if(!a)return n.NextResponse.json({error:"Unauthorized"},{status:401});let s=new URL(e.url),c=await (0,i.getFinanceReport)((0,i.normalizeReportType)(s.searchParams.get("type")),a,(0,i.filtersFromRequest)(e,a));return n.NextResponse.json(c)}[r,i,o]=s.then?(await s)():s,e.s(["GET",0,c]),a()}catch(e){a(e)}},!1),761380,e=>e.a(async(t,a)=>{try{var n=e.i(747909),r=e.i(174017),i=e.i(996250),o=e.i(759756),s=e.i(561916),c=e.i(174677),d=e.i(869741),l=e.i(316795),u=e.i(487718),m=e.i(995169),_=e.i(47587),E=e.i(666012),p=e.i(570101),S=e.i(626937),A=e.i(10372),O=e.i(193695);e.i(52474);var C=e.i(600220),R=e.i(48246),N=t([R]);[R]=N.then?(await N)():N;let y=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/finance/reports/route",pathname:"/api/finance/reports",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/finance/reports/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:L,workUnitAsyncStorage:I,serverHooks:T}=y;async function h(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),y.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/finance/reports/route";n=n.replace(/\/index$/,"")||"/";let i=await y.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:N,params:h,nextConfig:L,parsedUrl:I,isDraftMode:T,prerenderManifest:g,routerServerContext:f,isOnDemandRevalidate:v,revalidateOnlyGenerated:U,resolvedPathname:w,clientReferenceManifest:M,serverActionsManifest:D}=i,b=(0,d.normalizeAppPath)(n),P=!!(g.dynamicRoutes[b]||g.routes[w]),$=async()=>((null==f?void 0:f.render404)?await f.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!T){let e=!!g.routes[w],t=g.dynamicRoutes[b];if(t&&!1===t.fallback&&!e){if(L.adapterPath)return await $();throw new O.NoFallbackError}}let F=null;!P||y.isDev||T||(F=w,F="/index"===F?"/":F);let x=!0===y.isDev||!P,k=P&&!x;D&&M&&(0,c.setManifestsSingleton)({page:n,clientReferenceManifest:M,serverActionsManifest:D});let H=e.method||"GET",q=(0,s.getTracer)(),Y=q.getActiveScopeSpan(),J=!!(null==f?void 0:f.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),G=(0,o.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,L,g,B);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let W={params:h,previewProps:g.preview,renderOpts:{experimental:{authInterrupts:!!L.experimental.authInterrupts},cacheComponents:!!L.cacheComponents,supportsDynamicResponse:x,incrementalCache:G,cacheLifeProfiles:L.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>y.onRequestError(e,t,n,r,f)},sharedContext:{buildId:R,deploymentId:N}},j=new l.NodeNextRequest(e),K=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(j,(0,u.signalFromNodeResponse)(t));try{let i,o=async e=>y.handle(V,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=q.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",r),i.updateName(t))}else e.updateName(`${H} ${n}`)}),c=async i=>{var s,c;let d=async({previousCacheEntry:r})=>{try{if(!B&&v&&U&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(i);e.fetchMetrics=W.renderOpts.fetchMetrics;let s=W.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let c=W.renderOpts.collectedTags;if(!P)return await (0,E.sendResponse)(j,K,n,W.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[A.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,r=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,f),t}},l=await y.handleResponse({req:e,nextConfig:L,cacheKey:F,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:g,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:U,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:B});if(!P)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(c=l.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",v?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return B&&P||u.delete(A.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,S.getCacheControlHeader)(l.cacheControl)),await (0,E.sendResponse)(j,K,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};J&&Y?await c(Y):(i=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(m.BaseServerSpan.handleRequest,{spanName:`${H} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},c),void 0,!J))}catch(t){if(t instanceof O.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,f),P)throw t;return await (0,E.sendResponse)(j,K,new Response(null,{status:500})),null}}e.s(["handler",0,h,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:L,workUnitAsyncStorage:I})},"routeModule",0,y,"serverHooks",0,T,"workAsyncStorage",0,L,"workUnitAsyncStorage",0,I]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ewdzlw._.js.map