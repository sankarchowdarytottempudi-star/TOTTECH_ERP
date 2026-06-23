module.exports=[193695,(e,t,n)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,n)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,n)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},254799,(e,t,n)=>{t.exports=e.x("crypto",()=>require("crypto"))},477685,(e,t,n)=>{t.exports=e.x("pdfkit-d5967b64ee09fcf0",()=>require("pdfkit-d5967b64ee09fcf0"))},845713,e=>e.a(async(t,n)=>{try{var a=e.i(15270),i=t([a]);[a]=i.then?(await i)():i;let u=e=>{let t=Number(e??0);return Number.isFinite(t)?t:0},m=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},p=e=>{let t=String(e||"").trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:null},E=(e="i.invoice_date")=>`
  ($1::int IS NULL OR COALESCE(i.school_id, s.school_id) = $1::int)
  AND ($2::int IS NULL OR i.academic_year_id = $2::int OR i.academic_year_id IS NULL)
  AND ($3::int IS NULL OR i.class_id = $3::int)
  AND ($4::int IS NULL OR i.section_id = $4::int)
  AND ($5::date IS NULL OR ${e} >= $5::date)
  AND ($6::date IS NULL OR ${e} <= $6::date)
`,_=(e="p.payment_date")=>`
  ($1::int IS NULL OR COALESCE(p.school_id, i.school_id, s.school_id) = $1::int)
  AND ($2::int IS NULL OR p.academic_year_id = $2::int OR p.academic_year_id IS NULL)
  AND ($3::int IS NULL OR p.class_id = $3::int)
  AND ($4::int IS NULL OR p.section_id = $4::int)
  AND ($5::date IS NULL OR ${e} >= $5::date)
  AND ($6::date IS NULL OR ${e} <= $6::date)
`;function s(e){return[e.schoolId??null,e.academicYearId??null,e.classId??null,e.sectionId??null,e.from??null,e.to??null]}function r(e,t){return t>0?Math.round(e/t*100):0}async function o(e,t){let n=s(t),[i,o,d,l,m,p,S,C,O,h,L,R]=await Promise.all([t.schoolId?a.prisma.$queryRawUnsafe("SELECT id, school_name, school_code, logo_url FROM schools WHERE id = $1 LIMIT 1",t.schoolId):Promise.resolve([]),t.academicYearId?a.prisma.$queryRawUnsafe("SELECT id, academic_year FROM academic_years WHERE id = $1 LIMIT 1",t.academicYearId):Promise.resolve([]),a.prisma.$queryRawUnsafe(`
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
      `,...n),a.prisma.$queryRawUnsafe(`
      SELECT COALESCE(SUM(COALESCE(approved_amount, requested_amount, 0)), 0)::numeric AS concessions
      FROM concession_requests cr
      WHERE ($1::int IS NULL OR cr.school_id = $1::int)
        AND ($2::int IS NULL OR cr.academic_year_id = $2::int OR cr.academic_year_id IS NULL)
        AND ($3::int IS NULL OR EXISTS (SELECT 1 FROM students s WHERE s.id = cr.student_id AND s.current_class_id = $3::int))
        AND ($4::int IS NULL OR EXISTS (SELECT 1 FROM students s WHERE s.id = cr.student_id AND COALESCE(s.current_section_id, s.section_id) = $4::int))
        AND ($5::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) >= $5::date)
        AND ($6::date IS NULL OR COALESCE(cr.reviewed_at, cr.created_at, cr.requested_at) <= $6::date)
        AND UPPER(COALESCE(cr.status, '')) = 'APPROVED'
      `,...n),a.prisma.$queryRawUnsafe(`
      SELECT COALESCE(SUM(fc.amount), 0)::numeric AS expected_fee_categories
      FROM fee_categories fc
      WHERE ($1::int IS NULL OR fc.school_id = $1::int OR fc.school_id IS NULL)
        AND ($2::int IS NULL OR fc.academic_year_id = $2::int OR fc.academic_year_id IS NULL)
        AND ($3::int IS NULL OR fc.class_id = $3::int OR fc.class_id IS NULL)
        AND ($4::int IS NULL OR fc.section_id = $4::int OR fc.section_id IS NULL)
        AND COALESCE(fc.is_active, true) = true
      `,t.schoolId??null,t.academicYearId??null,t.classId??null,t.sectionId??null),a.prisma.$queryRawUnsafe(`
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
        WHERE ${_()}
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
      `,...n),a.prisma.$queryRawUnsafe(`
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
      `,...n),a.prisma.$queryRawUnsafe(`
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
      `,...n),a.prisma.$queryRawUnsafe(`
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
      `,...n),a.prisma.$queryRawUnsafe(`
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
      WHERE ${_()}
      ORDER BY p.payment_date DESC NULLS LAST, p.id DESC
      LIMIT 500
      `,...n),a.prisma.$queryRawUnsafe(`
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
      `,...n),a.prisma.$queryRawUnsafe(`
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
      `,...n)]),A=d[0]||{},f=u(A.generated),N=u(A.invoice_paid),g=h.reduce((e,t)=>e+u(t.amount),0)||N,I=u(A.pending),y=u(l[0]?.concessions),v=u(m[0]?.expected_fee_categories),T=f+Math.max(v-f,0),U=p.map(e=>{let t=u(e.generated),n=u(e.collected);return{...e,generated:t,collected:n,pending:u(e.pending),concessions:u(e.concessions),collection_percentage:r(n,t)}});return{context:{selectedSchool:i[0]||null,selectedAcademicYear:o[0]||null,school_id:t.schoolId??null,academic_year_id:t.academicYearId??null,all_schools:e.allSchools&&!t.schoolId,all_years:e.allYears&&!t.academicYearId,school_scope:e.schoolScope,academic_year_scope:e.academicYearScope,filters:t},kpis:{totalRevenue:f,totalInvoices:u(A.invoice_count),collectedAmount:g,pendingAmount:I,collectionPercentage:r(g,f),defaulters:u(A.defaulters),concessions:y,expectedRevenue:T,pendingInvoices:u(A.pending_invoice_count)},monthlyAnalytics:U,comparisons:{classRevenue:S.map(c),schoolRevenue:C.map(c)},charts:{collectionTrend:U.map(e=>({label:e.month,value:e.collected})),revenueTrend:U.map(e=>({label:e.month,value:e.generated})),pendingTrend:U.map(e=>({label:e.month,value:e.pending})),collectionVsTarget:U.map(e=>({label:e.month,collected:e.collected,target:e.generated}))},invoicesData:O,paymentsData:h,pendingFees:L,defaultersData:R,outstandingInvoices:L,recentCollections:h.slice(0,25),legacy:{totalFees:f,totalCollected:g,pending:I,invoices:u(A.invoice_count),payments:h.length,collectionHealth:r(g,f),pendingInvoices:u(A.pending_invoice_count),chart:[{label:"Generated",value:f},{label:"Collected",value:g},{label:"Pending",value:I}]}}}function c(e){return{...e,generated:u(e.generated),collected:u(e.collected),pending:u(e.pending),collection_percentage:r(u(e.collected),u(e.generated))}}async function d(e,t,n){var a;let i,s=await o(t,n),r=s.monthlyAnalytics,c={daily:s.paymentsData,weekly:s.paymentsData,monthly:r,"academic-year":r,"pending-fee":s.pendingFees,overdue:s.pendingFees.filter(e=>e.due_date&&new Date(String(e.due_date))<new Date),defaulter:s.defaultersData,concession:await l(n),"invoice-audit":s.invoicesData,"payment-audit":s.paymentsData}[e]||r;return{type:e,title:(a=e,(i={daily:"Daily Collection Report",weekly:"Weekly Collection Report",monthly:"Monthly Collection Report","academic-year":"Academic Year Collection Report","pending-fee":"Pending Fee Report",overdue:"Overdue Report",defaulter:"Defaulter Report",concession:"Concession Report","invoice-audit":"Invoice Audit Report","payment-audit":"Payment Audit Report"})[a]||i.monthly),context:s.context,kpis:s.kpis,rows:c,totals:c.reduce((e,t)=>({generated:e.generated+u(t.generated??t.total_amount),collected:e.collected+u(t.collected??t.amount??t.paid_amount),pending:e.pending+u(t.pending??t.balance_amount??t.pending_amount),concessions:e.concessions+u(t.concessions??t.approved_amount)}),{generated:0,collected:0,pending:0,concessions:0})}}async function l(e){return a.prisma.$queryRawUnsafe(`
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
    `,...s(e))}e.s(["filtersFromRequest",0,function(e,t){let n=new URL(e.url);return{schoolId:t.allSchools?m(n.searchParams.get("school_id")):t.schoolId,academicYearId:t.allYears?m(n.searchParams.get("academic_year_id")):t.academicYearId,classId:m(n.searchParams.get("class_id")),sectionId:m(n.searchParams.get("section_id")),from:p(n.searchParams.get("from")),to:p(n.searchParams.get("to")),allSchools:t.allSchools,allYears:t.allYears}},"getFinanceCommandCenter",0,o,"getFinanceReport",0,d,"normalizeReportType",0,function(e){let t=String(e||"").trim().toLowerCase();return["daily","weekly","monthly","academic-year","pending-fee","overdue","defaulter","concession","invoice-audit","payment-audit"].includes(t)?t:"monthly"}]),n()}catch(e){n(e)}},!1),818979,e=>{"use strict";var t=e.i(254799);function n(e){return t.default.createHmac("sha256",String(process.env.PUBLIC_DOCUMENT_SECRET||process.env.JWT_SECRET||"tottech-one-public-document-secret")).update(Array.from(e.entries()).filter(([e])=>"token"!==e).sort(([e],[t])=>e.localeCompare(t)).map(([e,t])=>`${e}=${t}`).join("&")).digest("base64url")}e.s(["buildPublicFinanceReportUrl",0,function(e){let t=new URLSearchParams(e.toString());return t.set("token",n(t)),`${String(process.env.APP_URL||"https://erp.tottechsolutions.com").replace(/\/+$/,"")}/api/public/finance/reports/pdf?${t.toString()}`},"verifyFinanceReportToken",0,function(e){let a=e.get("token");if(!a)return!1;let i=n(e);try{return t.default.timingSafeEqual(Buffer.from(i),Buffer.from(a))}catch{return!1}}])},617489,e=>{"use strict";var t=e.i(477685),n=e.i(140682);let a=e=>`Rs. ${Number(e||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`,i=(e,t="-")=>String(e??"").trim()||t,s=e=>{if(!e)return"-";let t=new Date(String(e));return Number.isNaN(t.getTime())?"-":t.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})},r=[["student_name","Student"],["admission_number","Admission No"],["invoice_number","Invoice"],["receipt_number","Receipt"],["class_name","Class"],["section_name","Section"],["month","Month"],["status","Status"],["payment_method","Payment Method"],["generated","Generated"],["total_amount","Total"],["collected","Collected"],["amount","Amount"],["pending","Pending"],["pending_amount","Pending Amount"],["balance_amount","Balance"],["concessions","Concessions"],["approved_amount","Approved Concession"],["payment_date","Payment Date"],["invoice_date","Invoice Date"],["due_date","Due Date"]];function o(e){let t=new Set(e.flatMap(e=>Object.keys(e))),n=r.filter(([e])=>t.has(e));return n.length?n:r.slice(0,8)}async function c(e){var n;let r=e.rows||[],c=o(r).slice(0,7);return n=t=>{t.fillColor("#04142E").rect(0,0,595,92).fill(),t.fillColor("#FFFFFF").fontSize(18).font("Helvetica-Bold").text(i(e.context?.selectedSchool?.school_name,e.context?.all_schools?"All Schools":"TOTTECH ONE"),36,24),t.fillColor("#D4AF37").fontSize(10).text(e.title,36,52),t.fillColor("#E5E7EB").fontSize(8).text(`Academic Year: ${i(e.context?.selectedAcademicYear?.academic_year,e.context?.all_years?"All Years":"-")} • Generated: ${s(new Date)}`,36,70),[["Generated",e.totals.generated],["Collected",e.totals.collected],["Pending",e.totals.pending],["Concessions",e.totals.concessions]].forEach(([e,n],i)=>{let s=36+130*i;t.roundedRect(s,112,118,50,6).strokeColor("#D1D5DB").lineWidth(.8).stroke(),t.fillColor("#6B7280").fontSize(8).font("Helvetica-Bold").text(String(e),s+10,122),t.fillColor("#111827").fontSize(11).text(a(n),s+10,139)});let n=190,o=[78,74,72,64,64,70,84];t.fillColor("#F3F4F6").rect(36,n,523,24).fill(),c.forEach(([,e],a)=>{t.fillColor("#111827").fontSize(7).font("Helvetica-Bold").text(e,42+o.slice(0,a).reduce((e,t)=>e+t,0),n+8,{width:o[a]})}),n+=24,r.slice(0,120).forEach(e=>{n>760&&(t.addPage(),n=48),t.strokeColor("#E5E7EB").moveTo(36,n).lineTo(559,n).stroke(),c.forEach(([r],c)=>{let d=e[r],l=r.includes("amount")||["generated","collected","pending","concessions"].includes(r)?a(d):r.includes("date")?s(d):i(d);t.fillColor("#111827").fontSize(7).font("Helvetica").text(l,42+o.slice(0,c).reduce((e,t)=>e+t,0),n+8,{width:o[c],height:22})}),n+=34})},new Promise((e,a)=>{let i=new t.default({size:"A4",margin:36,bufferPages:!0}),s=[];i.on("data",e=>s.push(Buffer.from(e))),i.on("end",()=>e(Buffer.concat(s))),i.on("error",a),n(i);let r=i.bufferedPageRange();for(let e=r.start;e<r.start+r.count;e+=1)i.switchToPage(e),i.fontSize(8).fillColor("#6B7280").text(`Generated by TOTTECH ONE • Page ${e+1} of ${r.count}`,36,805,{align:"center",width:523});i.end()})}e.s(["renderFinanceReportPdf",0,c,"renderFinanceReportXlsx",0,function(e){let t=n.utils.book_new(),a=e.rows||[],i=a.map(e=>{let t={};for(let[n,i]of o(a))t[i]=e[n]??"";return t}),s=n.utils.json_to_sheet(i);n.utils.book_append_sheet(t,s,e.title.slice(0,31));let r=n.utils.json_to_sheet([e.totals]);return n.utils.book_append_sheet(t,r,"Totals"),n.write(t,{type:"buffer",bookType:"xlsx"})}])},871746,e=>e.a(async(t,n)=>{try{var a=e.i(89171),i=e.i(845713),s=e.i(818979),r=e.i(617489),o=t([i]);async function c(e){let t=new URL(e.url);if(!(0,s.verifyFinanceReportToken)(t.searchParams))return a.NextResponse.json({error:"Invalid or expired finance report link."},{status:403});let n=Number(t.searchParams.get("school_id")||0)||null,o=Number(t.searchParams.get("academic_year_id")||0)||null,c=await (0,i.getFinanceReport)((0,i.normalizeReportType)(t.searchParams.get("type")),{user:{},schoolId:n,academicYearId:o,allSchools:!n,allYears:!o,schoolScope:n?"selected":"all",academicYearScope:o?"selected":"all"},{schoolId:n,academicYearId:o,classId:Number(t.searchParams.get("class_id")||0)||null,sectionId:Number(t.searchParams.get("section_id")||0)||null,from:t.searchParams.get("from"),to:t.searchParams.get("to"),allSchools:!n,allYears:!o}),d=await (0,r.renderFinanceReportPdf)(c);return new a.NextResponse(new Uint8Array(d),{headers:{"Content-Type":"application/pdf","Content-Disposition":`inline; filename="${c.type}-finance-report.pdf"`}})}[i]=o.then?(await o)():o,e.s(["GET",0,c]),n()}catch(e){n(e)}},!1),606326,e=>e.a(async(t,n)=>{try{var a=e.i(747909),i=e.i(174017),s=e.i(996250),r=e.i(759756),o=e.i(561916),c=e.i(174677),d=e.i(869741),l=e.i(316795),u=e.i(487718),m=e.i(995169),p=e.i(47587),E=e.i(666012),_=e.i(570101),S=e.i(626937),C=e.i(10372),O=e.i(193695);e.i(52474);var h=e.i(600220),L=e.i(871746),R=t([L]);[L]=R.then?(await R)():R;let f=new a.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/public/finance/reports/pdf/route",pathname:"/api/public/finance/reports/pdf",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/public/finance/reports/pdf/route.ts",nextConfigOutput:"",userland:L,...{}}),{workAsyncStorage:N,workUnitAsyncStorage:g,serverHooks:I}=f;async function A(e,t,n){n.requestMeta&&(0,r.setRequestMeta)(e,n.requestMeta),f.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/public/finance/reports/pdf/route";a=a.replace(/\/index$/,"")||"/";let s=await f.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:L,deploymentId:R,params:A,nextConfig:N,parsedUrl:g,isDraftMode:I,prerenderManifest:y,routerServerContext:v,isOnDemandRevalidate:T,revalidateOnlyGenerated:U,resolvedPathname:$,clientReferenceManifest:D,serverActionsManifest:w}=s,x=(0,d.normalizeAppPath)(a),b=!!(y.dynamicRoutes[x]||y.routes[$]),F=async()=>((null==v?void 0:v.render404)?await v.render404(e,t,g,!1):t.end("This page could not be found"),null);if(b&&!I){let e=!!y.routes[$],t=y.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(N.adapterPath)return await F();throw new O.NoFallbackError}}let P=null;!b||f.isDev||I||(P=$,P="/index"===P?"/":P);let M=!0===f.isDev||!b,q=b&&!M;w&&D&&(0,c.setManifestsSingleton)({page:a,clientReferenceManifest:D,serverActionsManifest:w});let k=e.method||"GET",H=(0,o.getTracer)(),Y=H.getActiveScopeSpan(),B=!!(null==v?void 0:v.isWrappedByNextServer),J=!!(0,r.getRequestMeta)(e,"minimalMode"),W=(0,r.getRequestMeta)(e,"incrementalCache")||await f.getIncrementalCache(e,N,y,J);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let j={params:A,previewProps:y.preview,renderOpts:{experimental:{authInterrupts:!!N.experimental.authInterrupts},cacheComponents:!!N.cacheComponents,supportsDynamicResponse:M,incrementalCache:W,cacheLifeProfiles:N.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,a,i)=>f.onRequestError(e,t,a,i,v)},sharedContext:{buildId:L,deploymentId:R}},G=new l.NodeNextRequest(e),z=new l.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let s,r=async e=>f.handle(K,j).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=H.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=n.get("next.route");if(i){let t=`${k} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",i),s.updateName(t))}else e.updateName(`${k} ${a}`)}),c=async s=>{var o,c;let d=async({previousCacheEntry:i})=>{try{if(!J&&T&&U&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await r(s);e.fetchMetrics=j.renderOpts.fetchMetrics;let o=j.renderOpts.pendingWaitUntil;o&&n.waitUntil&&(n.waitUntil(o),o=void 0);let c=j.renderOpts.collectedTags;if(!b)return await (0,E.sendResponse)(G,z,a,j.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(a.headers);c&&(t[C.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==j.renderOpts.collectedRevalidate&&!(j.renderOpts.collectedRevalidate>=C.INFINITE_CACHE)&&j.renderOpts.collectedRevalidate,i=void 0===j.renderOpts.collectedExpire||j.renderOpts.collectedExpire>=C.INFINITE_CACHE?void 0:j.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:T})},!1,v),t}},l=await f.handleResponse({req:e,nextConfig:N,cacheKey:P,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:U,responseGenerator:d,waitUntil:n.waitUntil,isMinimalMode:J});if(!b)return null;if((null==l||null==(o=l.value)?void 0:o.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(c=l.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});J||t.setHeader("x-nextjs-cache",T?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,_.fromNodeOutgoingHttpHeaders)(l.value.headers);return J&&b||u.delete(C.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,S.getCacheControlHeader)(l.cacheControl)),await (0,E.sendResponse)(G,z,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};B&&Y?await c(Y):(s=H.getActiveScopeSpan(),await H.withPropagatedContext(e.headers,()=>H.trace(m.BaseServerSpan.handleRequest,{spanName:`${k} ${a}`,kind:o.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},c),void 0,!B))}catch(t){if(t instanceof O.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:T})},!1,v),b)throw t;return await (0,E.sendResponse)(G,z,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:g})},"routeModule",0,f,"serverHooks",0,I,"workAsyncStorage",0,N,"workUnitAsyncStorage",0,g]),n()}catch(e){n(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0kz8yxm._.js.map