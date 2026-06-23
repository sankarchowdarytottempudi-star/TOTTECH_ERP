module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},922799,e=>{"use strict";function t(e){return String(e||"").trim().toUpperCase().replaceAll(" ","_")}function a(e){let a=t(e);return"ADMIN"===a||"SCHOOL_ADMIN"===a}e.s(["canManageRecord",0,function(e,n,r){let o=t(e);return"SUPER_ADMIN"===o||("delete"===r?"school"!==n&&"class"!==n&&"section"!==n&&a(o):"school"===n||"class"===n?a(o):"section"===n?["ADMIN","SCHOOL_ADMIN","PRINCIPAL"].includes(o):"subject"===n||"timetable"===n||"exam"===n||"exam_schedule"===n?["ADMIN","SCHOOL_ADMIN","PRINCIPAL","TEACHER"].includes(o):("transport"===n||"transport_route"===n||"transport_vehicle"===n||"hostel"===n||"dining_menu"===n||"meal_plan"===n)&&a(o))},"isSuperAdmin",0,function(e){return"SUPER_ADMIN"===t(e)},"managementError",0,function(e,t){return`Your role does not have access to ${t} ${e.replaceAll("_"," ")} records.`}])},599683,e=>e.a(async(t,a)=>{try{var n=e.i(493458),r=e.i(15270),o=t([r]);async function i(e){let t=await (0,n.cookies)(),a=t.get("active_academic_year_id")?.value,o=String(a||"").trim().toLowerCase();if("all"===o||"0"===o)return null;let i=a?Number(a):null;if(i&&Number.isFinite(i)){let t=await r.prisma.academic_years.findFirst({where:{id:i,...e?{OR:[{school_id:e},{school_id:null}]}:{}}});if(t)return t}return r.prisma.academic_years.findFirst({where:{is_current:!0,...e?{OR:[{school_id:e},{school_id:null}]}:{}},orderBy:{id:"desc"}})}[r]=o.then?(await o)():o,e.s(["getSelectedAcademicYear",0,i]),a()}catch(e){a(e)}},!1),19754,e=>e.a(async(t,a)=>{try{var n=e.i(493458),r=e.i(599683),o=e.i(922799),i=e.i(368105),s=e.i(15270),c=t([r,i,s]);[r,i,s]=c.then?(await c)():c;let u=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},m=e=>{let t=String(e||"").trim().toLowerCase();return"all"===t||"0"===t};async function l(e){let t,a,s=await (0,i.getCurrentUser)();if(!s)return null;let c=e?new URL(e.url):null;try{let e=await (0,n.cookies)();t=e.get("active_school_id")?.value,a=e.get("active_academic_year_id")?.value}catch{t=void 0,a=void 0}let l=c?.searchParams.get("school_id")??c?.searchParams.get("selected_school_id")??t,d=c?.searchParams.get("academic_year_id")??c?.searchParams.get("selected_academic_year_id")??a,_=(0,o.isSuperAdmin)(s.role),E=u(l),p=Number(s.school_id)||null,S=_?m(l)?null:E??p??null:p,A=_&&!S,h=null,C="current";if(m(d))C="all";else{let e=u(d);if(e)h=e,C="selected";else if("all"===s.academic_year_scope)C="all";else if(Number(s.academic_year_id))h=Number(s.academic_year_id),C="selected";else{let e=await (0,r.getSelectedAcademicYear)(S);h=Number(e?.id)||null,C="current"}}return{user:s,schoolId:S,academicYearId:h,allSchools:A,allYears:"all"===C,schoolScope:A?"all":_?"selected":"assigned",academicYearScope:C}}let _=(e,t)=>{let a=e?.[t],n="string"==typeof a||"number"==typeof a?Number(a):null;return Number.isFinite(n)&&Number(n)>0?Number(n):null};async function d(e,t=null){let a=await l(e);if(!a)return{context:null,error:"Login required before saving records."};let n=_(t,"school_id")??_(t,"selected_school_id")??a.schoolId;if(!n)return{context:null,error:"Select a school before saving this record."};if(!a.allSchools&&a.schoolId&&n!==a.schoolId)return{context:null,error:"You cannot save records outside the selected or assigned school."};if(!await s.prisma.schools.findFirst({where:{id:n,is_active:!0},select:{id:!0}}))return{context:null,error:"Selected school was not found or is inactive."};let r=_(t,"academic_year_id")??_(t,"selected_academic_year_id")??_(t,"source_academic_year_id")??a.academicYearId;return r?await s.prisma.academic_years.findFirst({where:{id:r,OR:[{school_id:n},{school_id:null}]},select:{id:!0}})?{context:{...a,requiredSchoolId:n,requiredAcademicYearId:r,createdBy:Number(a.user.id)||null,updatedBy:Number(a.user.id)||null},error:null}:{context:null,error:"Selected academic year does not belong to the selected school context."}:{context:null,error:"Select an academic year before saving this record."}}e.s(["resolveMutationContext",0,d,"resolvePlatformContext",0,l]),a()}catch(e){a(e)}},!1),410325,e=>e.a(async(t,a)=>{try{var n=e.i(89171),r=e.i(368105),o=e.i(15270),i=e.i(556995),s=t([r,o,i]);[r,o,i]=s.then?(await s)():s;let A=["STUDENTS","TEACHERS","ACADEMICS","FINANCE","OPERATIONS","DINING","TRANSPORT","HOSTEL","REPORTS","ANALYTICS","AI","USER_MANAGEMENT","PARENT_PORTAL","MOBILE_APP"],h=["STUDENTS","TEACHERS","ACADEMICS","ATTENDANCE","HOMEWORK","QUESTION_BANK","QUESTION_PAPERS","EXAMS","MARKS_ENTRY","STUDENT_360","TEACHER_360","SCHOOL_360","FINANCE","CONCESSIONS","INVOICES","PAYMENTS","DINING","TRANSPORT","HOSTEL","OPERATIONS","REPORTS","ANALYTICS","GOVERNANCE","WAR_ROOM","TOTTECH_AI","SCHOOLGPT","SETTINGS","USER_MANAGEMENT","PARENT_PORTAL","MOBILE_APP"],C=[{module_key:"STUDENTS",module_name:"Students",category:"Academics",sort_order:1},{module_key:"TEACHERS",module_name:"Teachers",category:"Academics",sort_order:2},{module_key:"ACADEMICS",module_name:"Academics",category:"Academics",sort_order:3},{module_key:"ATTENDANCE",module_name:"Attendance",category:"Operations",sort_order:4},{module_key:"HOMEWORK",module_name:"Homework",category:"Academics",sort_order:5},{module_key:"QUESTION_BANK",module_name:"Question Bank",category:"Academics",sort_order:6},{module_key:"QUESTION_PAPERS",module_name:"Question Papers",category:"Academics",sort_order:7},{module_key:"EXAMS",module_name:"Exams",category:"Academics",sort_order:8},{module_key:"MARKS_ENTRY",module_name:"Marks Entry",category:"Academics",sort_order:9},{module_key:"STUDENT_360",module_name:"Student 360",category:"Insights",sort_order:10},{module_key:"TEACHER_360",module_name:"Teacher 360",category:"Insights",sort_order:11},{module_key:"SCHOOL_360",module_name:"School 360",category:"Insights",sort_order:12},{module_key:"FINANCE",module_name:"Finance",category:"Finance",sort_order:13},{module_key:"CONCESSIONS",module_name:"Concessions",category:"Finance",sort_order:14},{module_key:"INVOICES",module_name:"Invoices",category:"Finance",sort_order:15},{module_key:"PAYMENTS",module_name:"Payments",category:"Finance",sort_order:16},{module_key:"DINING",module_name:"Dining",category:"Operations",sort_order:17},{module_key:"TRANSPORT",module_name:"Transport",category:"Operations",sort_order:18},{module_key:"HOSTEL",module_name:"Hostel",category:"Operations",sort_order:19},{module_key:"OPERATIONS",module_name:"Operations",category:"Operations",sort_order:20},{module_key:"REPORTS",module_name:"Reports",category:"Governance",sort_order:21},{module_key:"ANALYTICS",module_name:"Analytics",category:"Governance",sort_order:22},{module_key:"GOVERNANCE",module_name:"Governance",category:"Governance",sort_order:23},{module_key:"WAR_ROOM",module_name:"War Room",category:"Governance",sort_order:24},{module_key:"TOTTECH_AI",module_name:"TOTTECH AI",category:"AI",sort_order:25},{module_key:"SCHOOLGPT",module_name:"SchoolGPT",category:"AI",sort_order:26},{module_key:"SETTINGS",module_name:"Settings",category:"Administration",sort_order:27},{module_key:"USER_MANAGEMENT",module_name:"User Management",category:"Administration",sort_order:28},{module_key:"PARENT_PORTAL",module_name:"Parent Portal",category:"Parent",sort_order:29},{module_key:"MOBILE_APP",module_name:"Mobile App",category:"Platform",sort_order:30}],O={STARTER:["STUDENTS","TEACHERS","ACADEMICS"],PROFESSIONAL:["STUDENTS","TEACHERS","ACADEMICS","FINANCE","OPERATIONS","REPORTS"],ENTERPRISE:[...A],CUSTOM:["STUDENTS","TEACHERS","ACADEMICS"]};function c(e){return O[String(e||"STARTER").trim().toUpperCase()]||O.STARTER}function l(e){let t=new Set(e.filter(e=>e.enabled).map(e=>String(e.module_key||"").toUpperCase()));return A.reduce((e,a)=>({...e,[a]:t.has(a)}),{})}async function d(e,t,a){let n=new Set(c(t));await o.prisma.$transaction(A.map(t=>o.prisma.school_module_access.upsert({where:{school_id_module_key:{school_id:e,module_key:t}},create:{school_id:e,module_key:t,enabled:n.has(t),enabled_by:a??null,enabled_at:n.has(t)?new Date:null},update:{}})))}async function u(e){if(!e)return l(A.map(e=>({module_key:e,enabled:!0})));let t=await o.prisma.schools.findUnique({where:{id:Number(e)},select:{id:!0,subscription_plan:!0}});if(!t)return l([]);await d(t.id,t.subscription_plan);let a=await o.prisma.school_module_access.findMany({where:{school_id:t.id},select:{module_key:!0,enabled:!0}});return l(a)}async function m(){await o.prisma.$transaction(C.map(e=>o.prisma.module_master.upsert({where:{module_key:e.module_key},create:{module_key:e.module_key,module_name:e.module_name,category:e.category,sort_order:e.sort_order,is_active:!0},update:{module_name:e.module_name,category:e.category,sort_order:e.sort_order,is_active:!0}})))}async function _(e,t){if(!e||!t){var a;let e;return a=C.map(e=>({module_key:e.module_key,enabled:!0})),e=new Set(a.filter(e=>e.enabled).map(e=>String(e.module_key||"").toUpperCase())),h.reduce((t,a)=>({...t,[a]:e.has(a)}),{})}await m();let n=await u(t),r=await o.prisma.user_module_access.findMany({where:{user_id:Number(e),school_id:Number(t),is_active:!0,module_master:{is_active:!0}},select:{is_active:!0,module_master:{select:{module_key:!0}}}}),i=new Set(r.filter(e=>e.is_active).map(e=>String(e.module_master?.module_key||"").toUpperCase()));return h.reduce((e,t)=>({...e,[t]:r.length?i.has(t)&&!1!==n[t]:!1!==n[t]}),{})}async function E(e){await m();let t=Array.from(new Set(e.moduleKeys.map(e=>String(e||"").trim().toUpperCase()).filter(Boolean))),a=await o.prisma.module_master.findMany({where:{module_key:{in:t},is_active:!0},select:{id:!0,module_key:!0}}),n=new Map(a.map(e=>[e.module_key,e.id]));await o.prisma.user_module_access.updateMany({where:{user_id:e.userId,school_id:e.schoolId},data:{is_active:!1}}),await o.prisma.$transaction(t.filter(e=>n.has(e)).map(t=>o.prisma.user_module_access.upsert({where:{uq_user_module_access_scope:{user_id:e.userId,school_id:e.schoolId,module_id:n.get(t)}},create:{user_id:e.userId,school_id:e.schoolId,module_id:n.get(t),created_by:e.createdBy??null,is_active:!0},update:{is_active:!0}})))}async function p(e){let t=await (0,r.getCurrentUser)();if(!t)return{user:null,response:n.NextResponse.json({error:"Unauthorized"},{status:401})};if((0,i.isSuperAdminRole)(t.role))return{user:t,response:null};let a=Number(t.school_id)||null;if(!a)return{user:t,response:n.NextResponse.json({error:"Select a school before using this module."},{status:403})};let o=await u(a),s=await _(Number(t.id)||null,a);return o[e]&&!1!==s[e]?{user:t,response:null}:{user:t,response:n.NextResponse.json({error:"This module is not enabled for the selected school subscription.",module_key:e},{status:403})}}async function S(e,t,a){if((0,i.isSuperAdminRole)(t))return JSON.stringify(l(A.map(e=>({module_key:e,enabled:!0}))));let n=await u(e),r=await _(a,e);return JSON.stringify(h.reduce((e,t)=>({...e,[t]:!1!==n[t]&&!1!==r[t]}),{}))}e.s(["MODULE_KEYS",0,A,"getSchoolModuleAccess",0,u,"getUserModuleAccess",0,_,"moduleCookieValue",0,S,"modulesForPlan",0,c,"normalizeModuleKey",0,function(e){let t=String(e||"").trim().toUpperCase();return A.includes(t)?t:null},"replaceUserModuleAccess",0,E,"requireSchoolModule",0,p]),a()}catch(e){a(e)}},!1),477685,(e,t,a)=>{t.exports=e.x("pdfkit-d5967b64ee09fcf0",()=>require("pdfkit-d5967b64ee09fcf0"))},845713,e=>e.a(async(t,a)=>{try{var n=e.i(15270),r=t([n]);[n]=r.then?(await r)():r;let u=e=>{let t=Number(e??0);return Number.isFinite(t)?t:0},m=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},_=e=>{let t=String(e||"").trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:null},E=(e="i.invoice_date")=>`
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
`;function o(e){return[e.schoolId??null,e.academicYearId??null,e.classId??null,e.sectionId??null,e.from??null,e.to??null]}function i(e,t){return t>0?Math.round(e/t*100):0}async function s(e,t){let a=o(t),[r,s,l,d,m,_,S,A,h,C,O,R]=await Promise.all([t.schoolId?n.prisma.$queryRawUnsafe("SELECT id, school_name, school_code, logo_url FROM schools WHERE id = $1 LIMIT 1",t.schoolId):Promise.resolve([]),t.academicYearId?n.prisma.$queryRawUnsafe("SELECT id, academic_year FROM academic_years WHERE id = $1 LIMIT 1",t.academicYearId):Promise.resolve([]),n.prisma.$queryRawUnsafe(`
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
      `,...a)]),N=l[0]||{},y=u(N.generated),L=u(N.invoice_paid),f=C.reduce((e,t)=>e+u(t.amount),0)||L,g=u(N.pending),T=u(d[0]?.concessions),I=u(m[0]?.expected_fee_categories),v=y+Math.max(I-y,0),w=_.map(e=>{let t=u(e.generated),a=u(e.collected);return{...e,generated:t,collected:a,pending:u(e.pending),concessions:u(e.concessions),collection_percentage:i(a,t)}});return{context:{selectedSchool:r[0]||null,selectedAcademicYear:s[0]||null,school_id:t.schoolId??null,academic_year_id:t.academicYearId??null,all_schools:e.allSchools&&!t.schoolId,all_years:e.allYears&&!t.academicYearId,school_scope:e.schoolScope,academic_year_scope:e.academicYearScope,filters:t},kpis:{totalRevenue:y,totalInvoices:u(N.invoice_count),collectedAmount:f,pendingAmount:g,collectionPercentage:i(f,y),defaulters:u(N.defaulters),concessions:T,expectedRevenue:v,pendingInvoices:u(N.pending_invoice_count)},monthlyAnalytics:w,comparisons:{classRevenue:S.map(c),schoolRevenue:A.map(c)},charts:{collectionTrend:w.map(e=>({label:e.month,value:e.collected})),revenueTrend:w.map(e=>({label:e.month,value:e.generated})),pendingTrend:w.map(e=>({label:e.month,value:e.pending})),collectionVsTarget:w.map(e=>({label:e.month,collected:e.collected,target:e.generated}))},invoicesData:h,paymentsData:C,pendingFees:O,defaultersData:R,outstandingInvoices:O,recentCollections:C.slice(0,25),legacy:{totalFees:y,totalCollected:f,pending:g,invoices:u(N.invoice_count),payments:C.length,collectionHealth:i(f,y),pendingInvoices:u(N.pending_invoice_count),chart:[{label:"Generated",value:y},{label:"Collected",value:f},{label:"Pending",value:g}]}}}function c(e){return{...e,generated:u(e.generated),collected:u(e.collected),pending:u(e.pending),collection_percentage:i(u(e.collected),u(e.generated))}}async function l(e,t,a){var n;let r,o=await s(t,a),i=o.monthlyAnalytics,c={daily:o.paymentsData,weekly:o.paymentsData,monthly:i,"academic-year":i,"pending-fee":o.pendingFees,overdue:o.pendingFees.filter(e=>e.due_date&&new Date(String(e.due_date))<new Date),defaulter:o.defaultersData,concession:await d(a),"invoice-audit":o.invoicesData,"payment-audit":o.paymentsData}[e]||i;return{type:e,title:(n=e,(r={daily:"Daily Collection Report",weekly:"Weekly Collection Report",monthly:"Monthly Collection Report","academic-year":"Academic Year Collection Report","pending-fee":"Pending Fee Report",overdue:"Overdue Report",defaulter:"Defaulter Report",concession:"Concession Report","invoice-audit":"Invoice Audit Report","payment-audit":"Payment Audit Report"})[n]||r.monthly),context:o.context,kpis:o.kpis,rows:c,totals:c.reduce((e,t)=>({generated:e.generated+u(t.generated??t.total_amount),collected:e.collected+u(t.collected??t.amount??t.paid_amount),pending:e.pending+u(t.pending??t.balance_amount??t.pending_amount),concessions:e.concessions+u(t.concessions??t.approved_amount)}),{generated:0,collected:0,pending:0,concessions:0})}}async function d(e){return n.prisma.$queryRawUnsafe(`
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
    `,...o(e))}e.s(["filtersFromRequest",0,function(e,t){let a=new URL(e.url);return{schoolId:t.allSchools?m(a.searchParams.get("school_id")):t.schoolId,academicYearId:t.allYears?m(a.searchParams.get("academic_year_id")):t.academicYearId,classId:m(a.searchParams.get("class_id")),sectionId:m(a.searchParams.get("section_id")),from:_(a.searchParams.get("from")),to:_(a.searchParams.get("to")),allSchools:t.allSchools,allYears:t.allYears}},"getFinanceCommandCenter",0,s,"getFinanceReport",0,l,"normalizeReportType",0,function(e){let t=String(e||"").trim().toLowerCase();return["daily","weekly","monthly","academic-year","pending-fee","overdue","defaulter","concession","invoice-audit","payment-audit"].includes(t)?t:"monthly"}]),a()}catch(e){a(e)}},!1),617489,e=>{"use strict";var t=e.i(477685),a=e.i(140682);let n=e=>`Rs. ${Number(e||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`,r=(e,t="-")=>String(e??"").trim()||t,o=e=>{if(!e)return"-";let t=new Date(String(e));return Number.isNaN(t.getTime())?"-":t.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})},i=[["student_name","Student"],["admission_number","Admission No"],["invoice_number","Invoice"],["receipt_number","Receipt"],["class_name","Class"],["section_name","Section"],["month","Month"],["status","Status"],["payment_method","Payment Method"],["generated","Generated"],["total_amount","Total"],["collected","Collected"],["amount","Amount"],["pending","Pending"],["pending_amount","Pending Amount"],["balance_amount","Balance"],["concessions","Concessions"],["approved_amount","Approved Concession"],["payment_date","Payment Date"],["invoice_date","Invoice Date"],["due_date","Due Date"]];function s(e){let t=new Set(e.flatMap(e=>Object.keys(e))),a=i.filter(([e])=>t.has(e));return a.length?a:i.slice(0,8)}async function c(e){var a;let i=e.rows||[],c=s(i).slice(0,7);return a=t=>{t.fillColor("#04142E").rect(0,0,595,92).fill(),t.fillColor("#FFFFFF").fontSize(18).font("Helvetica-Bold").text(r(e.context?.selectedSchool?.school_name,e.context?.all_schools?"All Schools":"TOTTECH ONE"),36,24),t.fillColor("#D4AF37").fontSize(10).text(e.title,36,52),t.fillColor("#E5E7EB").fontSize(8).text(`Academic Year: ${r(e.context?.selectedAcademicYear?.academic_year,e.context?.all_years?"All Years":"-")} • Generated: ${o(new Date)}`,36,70),[["Generated",e.totals.generated],["Collected",e.totals.collected],["Pending",e.totals.pending],["Concessions",e.totals.concessions]].forEach(([e,a],r)=>{let o=36+130*r;t.roundedRect(o,112,118,50,6).strokeColor("#D1D5DB").lineWidth(.8).stroke(),t.fillColor("#6B7280").fontSize(8).font("Helvetica-Bold").text(String(e),o+10,122),t.fillColor("#111827").fontSize(11).text(n(a),o+10,139)});let a=190,s=[78,74,72,64,64,70,84];t.fillColor("#F3F4F6").rect(36,a,523,24).fill(),c.forEach(([,e],n)=>{t.fillColor("#111827").fontSize(7).font("Helvetica-Bold").text(e,42+s.slice(0,n).reduce((e,t)=>e+t,0),a+8,{width:s[n]})}),a+=24,i.slice(0,120).forEach(e=>{a>760&&(t.addPage(),a=48),t.strokeColor("#E5E7EB").moveTo(36,a).lineTo(559,a).stroke(),c.forEach(([i],c)=>{let l=e[i],d=i.includes("amount")||["generated","collected","pending","concessions"].includes(i)?n(l):i.includes("date")?o(l):r(l);t.fillColor("#111827").fontSize(7).font("Helvetica").text(d,42+s.slice(0,c).reduce((e,t)=>e+t,0),a+8,{width:s[c],height:22})}),a+=34})},new Promise((e,n)=>{let r=new t.default({size:"A4",margin:36,bufferPages:!0}),o=[];r.on("data",e=>o.push(Buffer.from(e))),r.on("end",()=>e(Buffer.concat(o))),r.on("error",n),a(r);let i=r.bufferedPageRange();for(let e=i.start;e<i.start+i.count;e+=1)r.switchToPage(e),r.fontSize(8).fillColor("#6B7280").text(`Generated by TOTTECH ONE • Page ${e+1} of ${i.count}`,36,805,{align:"center",width:523});r.end()})}e.s(["renderFinanceReportPdf",0,c,"renderFinanceReportXlsx",0,function(e){let t=a.utils.book_new(),n=e.rows||[],r=n.map(e=>{let t={};for(let[a,r]of s(n))t[r]=e[a]??"";return t}),o=a.utils.json_to_sheet(r);a.utils.book_append_sheet(t,o,e.title.slice(0,31));let i=a.utils.json_to_sheet([e.totals]);return a.utils.book_append_sheet(t,i,"Totals"),a.write(t,{type:"buffer",bookType:"xlsx"})}])},34673,e=>e.a(async(t,a)=>{try{var n=e.i(89171),r=e.i(19754),o=e.i(845713),i=e.i(617489),s=e.i(410325),c=t([r,o,s]);async function l(e){let t=await (0,s.requireSchoolModule)("FINANCE");if(t.response)return t.response;let a=await (0,r.resolvePlatformContext)(e);if(!a)return n.NextResponse.json({error:"Unauthorized"},{status:401});let c=new URL(e.url),l="xlsx"===c.searchParams.get("format")?"xlsx":"pdf",d=await (0,o.getFinanceReport)((0,o.normalizeReportType)(c.searchParams.get("type")),a,(0,o.filtersFromRequest)(e,a));if("xlsx"===l){let e=(0,i.renderFinanceReportXlsx)(d);return new n.NextResponse(new Uint8Array(e),{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="${d.type}-finance-report.xlsx"`}})}let u=await (0,i.renderFinanceReportPdf)(d);return new n.NextResponse(new Uint8Array(u),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${d.type}-finance-report.pdf"`}})}[r,o,s]=c.then?(await c)():c,e.s(["GET",0,l]),a()}catch(e){a(e)}},!1),98257,e=>e.a(async(t,a)=>{try{var n=e.i(747909),r=e.i(174017),o=e.i(996250),i=e.i(759756),s=e.i(561916),c=e.i(174677),l=e.i(869741),d=e.i(316795),u=e.i(487718),m=e.i(995169),_=e.i(47587),E=e.i(666012),p=e.i(570101),S=e.i(626937),A=e.i(10372),h=e.i(193695);e.i(52474);var C=e.i(600220),O=e.i(34673),R=t([O]);[O]=R.then?(await R)():R;let y=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/finance/reports/export/route",pathname:"/api/finance/reports/export",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/finance/reports/export/route.ts",nextConfigOutput:"",userland:O,...{}}),{workAsyncStorage:L,workUnitAsyncStorage:f,serverHooks:g}=y;async function N(e,t,a){a.requestMeta&&(0,i.setRequestMeta)(e,a.requestMeta),y.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/finance/reports/export/route";n=n.replace(/\/index$/,"")||"/";let o=await y.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!o)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:O,deploymentId:R,params:N,nextConfig:L,parsedUrl:f,isDraftMode:g,prerenderManifest:T,routerServerContext:I,isOnDemandRevalidate:v,revalidateOnlyGenerated:w,resolvedPathname:U,clientReferenceManifest:D,serverActionsManifest:b}=o,x=(0,l.normalizeAppPath)(n),M=!!(T.dynamicRoutes[x]||T.routes[U]),P=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,f,!1):t.end("This page could not be found"),null);if(M&&!g){let e=!!T.routes[U],t=T.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(L.adapterPath)return await P();throw new h.NoFallbackError}}let $=null;!M||y.isDev||g||($=U,$="/index"===$?"/":$);let F=!0===y.isDev||!M,k=M&&!F;b&&D&&(0,c.setManifestsSingleton)({page:n,clientReferenceManifest:D,serverActionsManifest:b});let H=e.method||"GET",q=(0,s.getTracer)(),Y=q.getActiveScopeSpan(),B=!!(null==I?void 0:I.isWrappedByNextServer),J=!!(0,i.getRequestMeta)(e,"minimalMode"),G=(0,i.getRequestMeta)(e,"incrementalCache")||await y.getIncrementalCache(e,L,T,J);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let W={params:N,previewProps:T.preview,renderOpts:{experimental:{authInterrupts:!!L.experimental.authInterrupts},cacheComponents:!!L.cacheComponents,supportsDynamicResponse:F,incrementalCache:G,cacheLifeProfiles:L.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>y.onRequestError(e,t,n,r,I)},sharedContext:{buildId:O,deploymentId:R}},j=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),z=u.NextRequestAdapter.fromNodeNextRequest(j,(0,u.signalFromNodeResponse)(t));try{let o,i=async e=>y.handle(z,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=q.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",r),o.updateName(t))}else e.updateName(`${H} ${n}`)}),c=async o=>{var s,c;let l=async({previousCacheEntry:r})=>{try{if(!J&&v&&w&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=W.renderOpts.fetchMetrics;let s=W.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let c=W.renderOpts.collectedTags;if(!M)return await (0,E.sendResponse)(j,K,n,W.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[A.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,r=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,I),t}},d=await y.handleResponse({req:e,nextConfig:L,cacheKey:$,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:w,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:J});if(!M)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(c=d.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});J||t.setHeader("x-nextjs-cache",v?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,p.fromNodeOutgoingHttpHeaders)(d.value.headers);return J&&M||u.delete(A.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,S.getCacheControlHeader)(d.cacheControl)),await (0,E.sendResponse)(j,K,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};B&&Y?await c(Y):(o=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(m.BaseServerSpan.handleRequest,{spanName:`${H} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},c),void 0,!B))}catch(t){if(t instanceof h.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:v})},!1,I),M)throw t;return await (0,E.sendResponse)(j,K,new Response(null,{status:500})),null}}e.s(["handler",0,N,"patchFetch",0,function(){return(0,o.patchFetch)({workAsyncStorage:L,workUnitAsyncStorage:f})},"routeModule",0,y,"serverHooks",0,g,"workAsyncStorage",0,L,"workUnitAsyncStorage",0,f]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__06xwmhz._.js.map