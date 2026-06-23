module.exports=[193695,(e,t,i)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,i)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,i)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,i)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},814747,(e,t,i)=>{t.exports=e.x("path",()=>require("path"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let i=e.split("?")[0].split("#")[0].toLowerCase(),n=t.find(e=>!!(e.startsWith&&i.startsWith(e.startsWith)||e.includes&&i.includes(e.includes)));return n?.moduleCode??null}])},780907,e=>e.a(async(t,i)=>{try{var n=e.i(493458),a=e.i(89171),r=e.i(368105),o=e.i(15270),l=e.i(274173),s=e.i(503031),c=t([r,o]);[r,o]=c.then?(await c)():c;let C=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},_=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",f=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,t){return(await o.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(s.CLINICAL_MODULE_LABELS,e))}async function u(e,t){let i=await o.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(i[0]?.count||0)>0}async function p(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(t?.email)))return null;let i=await (0,n.cookies)(),a=C(i.get("active_clinic_id")?.value),s=C(i.get("active_hospital_id")?.value),c=C(i.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=C(u?.searchParams.get("clinic_id")),h=C(u?.searchParams.get("hospital_id")),m=C(u?.searchParams.get("branch_id")),A=(await o.prisma.$queryRawUnsafe(`
      SELECT
        cup.tenant_id,
        cup.clinic_id,
        COALESCE(cup.hospital_id, c.hospital_id) AS hospital_id,
        COALESCE(cup.branch_id, c.branch_id) AS branch_id,
        c.organization_id,
        ct.tenant_name,
        h.hospital_name,
        h.address AS hospital_address,
        h.phone AS hospital_phone,
        h.email AS hospital_email,
        h.license_number AS hospital_license_number,
        h.branding AS hospital_branding,
        b.branch_name,
        b.branding AS branch_branding,
        COALESCE(o.organization_name, ct.tenant_name, c.clinic_name) AS organization_name,
        o.branding AS organization_branding,
        c.clinic_name,
        c.branding AS clinic_branding,
        cr.role_key,
        cr.role_name,
        cr.permissions
      FROM clinical_user_profiles cup
      JOIN clinics c ON c.id = cup.clinic_id
      LEFT JOIN organizations o ON (
        o.tenant_id = cup.tenant_id
        OR o.id = cup.tenant_id
      )
        AND COALESCE(o.is_deleted, false) = false
      LEFT JOIN clinical_tenants ct ON ct.id = cup.tenant_id
      LEFT JOIN hospitals h ON h.id = COALESCE(cup.hospital_id, c.hospital_id)
      LEFT JOIN branches b ON b.id = COALESCE(cup.branch_id, c.branch_id)
      LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
      WHERE cup.user_id = $1
        AND COALESCE(cup.is_deleted, false) = false
        AND COALESCE(c.is_deleted, false) = false
        AND ($2::int IS NULL OR cup.clinic_id = $2::int)
        AND ($3::int IS NULL OR COALESCE(cup.hospital_id, c.hospital_id) = $3::int)
        AND ($4::int IS NULL OR COALESCE(cup.branch_id, c.branch_id) = $4::int)
      ORDER BY cup.id ASC
      LIMIT 1
      `,t.id??null,p??a,h??s,m??c))[0];if(!A&&s&&t.id&&(A=(await o.prisma.$queryRawUnsafe(`
        WITH base_profile AS (
          SELECT
            cup.tenant_id,
            cup.clinic_id AS base_clinic_id,
            COALESCE(cup.hospital_id, c.hospital_id) AS base_hospital_id,
            COALESCE(cup.branch_id, c.branch_id) AS base_branch_id,
            c.organization_id,
            cr.role_key,
            cr.role_name,
            cr.permissions
          FROM clinical_user_profiles cup
          JOIN clinics c ON c.id = cup.clinic_id
          LEFT JOIN clinical_roles cr ON cr.id = cup.clinical_role_id
          WHERE cup.user_id = $1
            AND COALESCE(cup.is_deleted, false) = false
            AND COALESCE(c.is_deleted, false) = false
          ORDER BY cup.id ASC
          LIMIT 1
        ),
        selected_hospital AS (
          SELECT h.*
          FROM hospitals h
          JOIN base_profile bp ON bp.tenant_id = h.tenant_id
          WHERE h.id = $2
            AND COALESCE(h.is_deleted, false) = false
            AND COALESCE(bp.role_key, '') = ANY($3::text[])
          LIMIT 1
        ),
        selected_branch AS (
          SELECT b.*
          FROM branches b
          JOIN selected_hospital h ON h.id = b.hospital_id
          WHERE b.tenant_id = h.tenant_id
            AND ($4::int IS NULL OR b.id = $4::int)
            AND COALESCE(b.is_deleted, false) = false
          ORDER BY
            CASE WHEN $4::int IS NOT NULL AND b.id = $4::int THEN 0 ELSE 1 END,
            b.id ASC
          LIMIT 1
        ),
        selected_clinic AS (
          SELECT c.*
          FROM clinics c
          JOIN selected_hospital h ON h.id = c.hospital_id
          LEFT JOIN selected_branch b ON b.id = c.branch_id
          WHERE c.tenant_id = h.tenant_id
            AND ($5::int IS NULL OR c.id = $5::int)
            AND (
              b.id IS NULL
              OR c.branch_id = b.id
            )
            AND COALESCE(c.is_deleted, false) = false
          ORDER BY
            CASE WHEN $5::int IS NOT NULL AND c.id = $5::int THEN 0 ELSE 1 END,
            c.id ASC
          LIMIT 1
        )
        SELECT
          bp.tenant_id,
          COALESCE(sc.id, bp.base_clinic_id) AS clinic_id,
          sh.id AS hospital_id,
          COALESCE(sb.id, sc.branch_id, bp.base_branch_id) AS branch_id,
          COALESCE(sc.organization_id, bp.organization_id) AS organization_id,
          ct.tenant_name,
          sh.hospital_name,
          sh.address AS hospital_address,
          sh.phone AS hospital_phone,
          sh.email AS hospital_email,
          sh.license_number AS hospital_license_number,
          sh.branding AS hospital_branding,
          sb.branch_name,
          sb.branding AS branch_branding,
          COALESCE(o.organization_name, ct.tenant_name, sc.clinic_name, sh.hospital_name) AS organization_name,
          o.branding AS organization_branding,
          COALESCE(sc.clinic_name, sh.hospital_name) AS clinic_name,
          sc.branding AS clinic_branding,
          bp.role_key,
          bp.role_name,
          bp.permissions
        FROM base_profile bp
        JOIN selected_hospital sh ON true
        LEFT JOIN selected_branch sb ON true
        LEFT JOIN selected_clinic sc ON true
        LEFT JOIN organizations o ON (
          o.tenant_id = bp.tenant_id
          OR o.id = bp.tenant_id
        )
          AND COALESCE(o.is_deleted, false) = false
        LEFT JOIN clinical_tenants ct ON ct.id = bp.tenant_id
        LIMIT 1
        `,t.id,s,Array.from(f),c,a))[0]),!A)return null;let N=_(A.organization_branding),b=_(A.hospital_branding),S=_(A.branch_branding),I=_(A.clinic_branding),g={...N,...b,...S,...I},R=E(g.logoUrl,g.logo_url,g.logo,g.hospital_logo,g.image),O=E(g.name,g.hospitalName,g.hospital_name,A.hospital_name,A.branch_name,A.clinic_name,A.organization_name),L=await d(Number(A.tenant_id),Number(A.hospital_id));return{user:t,tenantId:Number(A.tenant_id),hospitalId:Number(A.hospital_id),branchId:Number(A.branch_id),clinicId:Number(A.clinic_id),organizationId:C(A.organization_id),organizationName:String(A.organization_name||""),tenantName:String(A.tenant_name||""),hospitalName:String(A.hospital_name||""),hospitalAddress:String(A.hospital_address||""),hospitalPhone:String(A.hospital_phone||""),hospitalEmail:String(A.hospital_email||""),hospitalLicenseNumber:String(A.hospital_license_number||""),branchName:String(A.branch_name||""),clinicName:String(A.clinic_name||""),roleKey:String(A.role_key||"clinical_user"),roleName:String(A.role_name||"Clinical User"),permissions:A.permissions||{},licensedModules:L,branding:{name:O||"Hospital",logoUrl:R||null,primaryColor:E(g.primaryColor,g.primary_color)||"#04142E",accentColor:E(g.accentColor,g.accent_color)||"#D4AF37",source:R?"hospital":"generated"}}}async function h(e){let t=await p(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return a.NextResponse.json({error:e},{status:401})}()};if(e){let i=new URL(e.url).pathname,n=(0,s.moduleCodeForClinicalPath)(i);if(n&&!(!await u(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(n)))return{context:null,response:a.NextResponse.json({error:"Module Not Licensed",module_code:n,module_name:s.CLINICAL_MODULE_LABELS[n]},{status:403})}}return{context:t,response:null}}async function m(e,t){await o.prisma.$executeRawUnsafe(`
    INSERT INTO clinical_audit_events (
      tenant_id,
      clinic_id,
      hospital_id,
      branch_id,
      user_id,
      module_name,
      action,
      entity_type,
      entity_id,
      summary,
      payload,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,m,"requireClinicalContext",0,h]),i()}catch(e){i(e)}},!1),477685,(e,t,i)=>{t.exports=e.x("pdfkit-d5967b64ee09fcf0",()=>require("pdfkit-d5967b64ee09fcf0"))},941287,(e,t,i)=>{t.exports=e.x("qrcode-bec4019e68b97a8d",()=>require("qrcode-bec4019e68b97a8d"))},522734,(e,t,i)=>{t.exports=e.x("fs",()=>require("fs"))},826267,e=>{"use strict";var t=e.i(522734),i=e.i(814747),n=e.i(477685),a=e.i(941287);let r="#D4AF37",o="#04142E",l="#0B1F3A",s="#516176",c=e=>null==e||""===e?"-":e instanceof Date?e.toISOString().slice(0,10):String(e),d=e=>{if(!e)return"-";let t=new Date(String(e));return Number.isNaN(t.getTime())?c(e):t.toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"2-digit"})},u=e=>{if(!e||e.startsWith("http"))return null;let n=e.startsWith("/")?e.slice(1):e,a=i.default.join(process.cwd(),"public",n);return t.default.existsSync(a)?a:null},p=async(e,t,i)=>{let n=t.branding.primaryColor||o,l=t.branding.accentColor||r;e.rect(0,0,595.28,104).fill(n);let s=u(t.branding.logoUrl);if(s)try{e.image(s,42,22,{fit:[54,54],align:"center",valign:"center"})}catch{e.roundedRect(42,22,54,54,8).strokeColor(l).stroke()}else e.roundedRect(42,22,54,54,8).strokeColor(l).stroke(),e.fillColor(l).font("Helvetica-Bold").fontSize(12).text("TC",42,41,{width:54,align:"center"});e.fillColor(l).font("Helvetica-Bold").fontSize(9).text(t.branchName||"HOSPITAL DOCUMENT",110,22,{width:310}),e.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(20).text(t.hospitalName||t.branding.name||"Hospital",110,36,{width:330}),e.fillColor("#E8EEF7").font("Helvetica").fontSize(9).text(i.subtitle||`${t.hospitalAddress||t.branchName||""}${t.hospitalPhone?` | ${t.hospitalPhone}`:""}${t.hospitalEmail?` | ${t.hospitalEmail}`:""}${t.hospitalLicenseNumber?` | License ${t.hospitalLicenseNumber}`:""}`,110,62,{width:330}),e.fillColor(l).font("Helvetica-Bold").fontSize(9).text(i.title,110,88,{width:330});let c=i.qrText||`${i.title}|${i.documentNumber||""}|${t.tenantId}|${t.hospitalId}|${t.branchId}`,d=await a.default.toBuffer(c,{width:74,margin:1,color:{dark:n,light:"#FFFFFF"}});e.image(d,479.28,18,{width:74}),e.fillColor("#FFFFFF").font("Helvetica").fontSize(7).text("Scan to verify",475.28,82,{width:82,align:"center"})},h=(e,t=80)=>{e.y+t>770&&(e.addPage(),e.y=42)},m=(e,t)=>{t.forEach(([t,i])=>{h(e,22);let n=e.y;e.fillColor(s).font("Helvetica-Bold").fontSize(9).text(t.toUpperCase(),42,n,{width:150}),e.fillColor(l).font("Helvetica").fontSize(10).text(c(i),208,n,{width:345.28}),e.y=Math.max(e.y,n+18)})};async function C(e,t){let i=new n.default({size:"A4",margin:42,bufferPages:!0,info:{Title:t.title,Author:"TOTTECH Clinical Services",Producer:"TOTTECH Clinical Services"}}),a=[];return new Promise(async(n,C)=>{i.on("data",e=>a.push(e)),i.on("end",()=>n(Buffer.concat(a))),i.on("error",C);try{await p(i,e,t),i.y=124,i.fillColor(s).font("Helvetica").fontSize(8).text(`Generated ${d(t.generatedAt||new Date)} | Tenant ${e.tenantId} | Hospital ${e.hospitalId} | Branch ${e.branchId}`,42,i.y),i.moveDown(1.5),t.patient&&(i.fillColor(r).font("Helvetica-Bold").fontSize(11).text("PATIENT DETAILS"),i.moveDown(.5),m(i,[["Patient",t.patient.patient_name||t.patient.name],["UHID",t.patient.uhid||t.patient.patient_uid],["Phone",t.patient.phone||t.patient.mobile],["Gender",t.patient.gender]]),i.moveDown()),t.sections.forEach(e=>{h(i,72),i.moveDown(.4).fillColor(r).font("Helvetica-Bold").fontSize(11).text(e.title.toUpperCase()),i.moveTo(42,i.y+3).lineTo(553.28,i.y+3).strokeColor("#E6D3A1").stroke(),i.moveDown(.8),e.rows&&m(i,e.rows),e.table&&((e,t)=>{let i=Math.floor(511.28/t.columns.length),n=t.columns.map(e=>e.width||i),a=(i,a=!1)=>{h(e,32);let r=e.y,s=42;e.rect(42,r-4,511.28,24).fill(a?o:"#F7F9FC"),t.columns.forEach((t,o)=>{e.fillColor(a?"#FFFFFF":l).font(a?"Helvetica-Bold":"Helvetica").fontSize(8).text(a?t.label:c(i[t.key]),s+6,r+3,{width:n[o]-10,ellipsis:!0}),s+=n[o]}),e.y=r+28};if(a(Object.fromEntries(t.columns.map(e=>[e.key,e.label])),!0),!t.rows.length){e.fillColor(s).font("Helvetica").fontSize(10).text("No records available for this document.",42,e.y+4),e.moveDown();return}t.rows.forEach(e=>a(e))})(i,e.table),e.notes?.length&&e.notes.forEach(e=>{h(i,24),i.fillColor(l).font("Helvetica").fontSize(10).text(`- ${e}`,42,i.y,{width:511.28})})}),h(i,100),i.moveDown(2),i.strokeColor("#C9D2DF").moveTo(373.28,i.y).lineTo(553.28,i.y).stroke();let n=u(t.signatureImageUrl||null);if(n)try{i.image(n,383.28,i.y-44,{fit:[150,42],align:"center"})}catch{}i.fillColor(l).font("Helvetica-Bold").fontSize(9).text(t.signatureLabel||"Authorized Signature",373.28,i.y+6,{width:180,align:"center"});let a=i.bufferedPageRange();for(let e=0;e<a.count;e+=1)i.switchToPage(e),i.fillColor(s).font("Helvetica").fontSize(8).text(`Generated by TOTTECH Clinical Services | ${t.documentNumber||t.title} | Printed ${d(new Date)} | Page ${e+1} of ${a.count}`,42,810,{width:511.28,align:"center"});i.end()}catch(e){C(e)}})}e.s(["pdfFormatters",0,{date:d,money:e=>{let t=Number(e);return Number.isFinite(t)?`Rs. ${t.toFixed(2)}`:"Rs. 0.00"},text:c},"pdfResponse",0,function(e,t){return new Response(new Uint8Array(e),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${t.replace(/"/g,"")}"`,"Cache-Control":"private, no-store"}})},"renderClinicalPdf",0,C])},503669,e=>e.a(async(t,i)=>{try{var n=e.i(89171),a=e.i(826267),r=e.i(780907),o=e.i(15270),l=t([r,o]);async function s(e,{params:t}){let i=await (0,r.requireClinicalContext)(e);if(i.response)return i.response;let l=i.context,{id:c}=await t,d=await o.prisma.$queryRawUnsafe(`
    SELECT d.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name, p.patient_uid, p.uhid
    FROM document_repository d
    LEFT JOIN patients p ON p.id=d.patient_id
    WHERE d.id=$1
      AND d.tenant_id=$2
      AND d.hospital_id=$3
      AND d.branch_id=$4
      AND COALESCE(d.is_deleted,false)=false
    LIMIT 1
    `,Number(c),l.tenantId,l.hospitalId,l.branchId);if(!d[0])return n.NextResponse.json({error:"Document not found."},{status:404});let u=d[0],p=await (0,a.renderClinicalPdf)(l,{title:String(u.document_title||"Clinical Document"),documentNumber:String(u.id),patient:u,qrText:`document:${u.id}:tenant:${l.tenantId}:hospital:${l.hospitalId}:branch:${l.branchId}`,sections:[{title:"Document Details",rows:[["Document Type",u.document_type],["Source Module",u.source_module],["Source Record",u.source_record_id],["Version",u.version],["Generated At",a.pdfFormatters.date(u.created_at)],["File",u.file_name]]}]});return(0,a.pdfResponse)(p,String(u.file_name||`clinical-document-${c}.pdf`))}[r,o]=l.then?(await l)():l,e.s(["GET",0,s,"runtime",0,"nodejs"]),i()}catch(e){i(e)}},!1),365423,e=>e.a(async(t,i)=>{try{var n=e.i(747909),a=e.i(174017),r=e.i(996250),o=e.i(759756),l=e.i(561916),s=e.i(174677),c=e.i(869741),d=e.i(316795),u=e.i(487718),p=e.i(995169),h=e.i(47587),m=e.i(666012),C=e.i(570101),_=e.i(626937),E=e.i(10372),f=e.i(193695);e.i(52474);var A=e.i(600220),N=e.i(503669),b=t([N]);[N]=b.then?(await b)():b;let I=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/clinical/documents/[id]/pdf/route",pathname:"/api/clinical/documents/[id]/pdf",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/documents/[id]/pdf/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:R,serverHooks:O}=I;async function S(e,t,i){i.requestMeta&&(0,o.setRequestMeta)(e,i.requestMeta),I.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/clinical/documents/[id]/pdf/route";n=n.replace(/\/index$/,"")||"/";let r=await I.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:N,deploymentId:b,params:S,nextConfig:g,parsedUrl:R,isDraftMode:O,prerenderManifest:L,routerServerContext:T,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,resolvedPathname:w,clientReferenceManifest:x,serverActionsManifest:P}=r,F=(0,c.normalizeAppPath)(n),$=!!(L.dynamicRoutes[F]||L.routes[w]),D=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,R,!1):t.end("This page could not be found"),null);if($&&!O){let e=!!L.routes[w],t=L.dynamicRoutes[F];if(t&&!1===t.fallback&&!e){if(g.adapterPath)return await D();throw new f.NoFallbackError}}let U=null;!$||I.isDev||O||(U=w,U="/index"===U?"/":U);let H=!0===I.isDev||!$,M=$&&!H;P&&x&&(0,s.setManifestsSingleton)({page:n,clientReferenceManifest:x,serverActionsManifest:P});let W=e.method||"GET",k=(0,l.getTracer)(),q=k.getActiveScopeSpan(),z=!!(null==T?void 0:T.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),j=(0,o.getRequestMeta)(e,"incrementalCache")||await I.getIncrementalCache(e,g,L,B);null==j||j.resetRequestCache(),globalThis.__incrementalCache=j;let Y={params:S,previewProps:L.preview,renderOpts:{experimental:{authInterrupts:!!g.experimental.authInterrupts},cacheComponents:!!g.cacheComponents,supportsDynamicResponse:H,incrementalCache:j,cacheLifeProfiles:g.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,n,a)=>I.onRequestError(e,t,n,a,T)},sharedContext:{buildId:N,deploymentId:b}},J=new d.NodeNextRequest(e),G=new d.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(t));try{let r,o=async e=>I.handle(V,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=k.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=i.get("next.route");if(a){let t=`${W} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",a),r.updateName(t))}else e.updateName(`${W} ${n}`)}),s=async r=>{var l,s;let c=async({previousCacheEntry:a})=>{try{if(!B&&y&&v&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(r);e.fetchMetrics=Y.renderOpts.fetchMetrics;let l=Y.renderOpts.pendingWaitUntil;l&&i.waitUntil&&(i.waitUntil(l),l=void 0);let s=Y.renderOpts.collectedTags;if(!$)return await (0,m.sendResponse)(J,G,n,Y.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,C.toNodeOutgoingHttpHeaders)(n.headers);s&&(t[E.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,a=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:a}}}}catch(t){throw(null==a?void 0:a.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:y})},!1,T),t}},d=await I.handleResponse({req:e,nextConfig:g,cacheKey:U,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:L,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:v,responseGenerator:c,waitUntil:i.waitUntil,isMinimalMode:B});if(!$)return null;if((null==d||null==(l=d.value)?void 0:l.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",y?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,C.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&$||u.delete(E.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,_.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(J,G,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};z&&q?await s(q):(r=k.getActiveScopeSpan(),await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${W} ${n}`,kind:l.SpanKind.SERVER,attributes:{"http.method":W,"http.target":e.url}},s),void 0,!z))}catch(t){if(t instanceof f.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:y})},!1,T),$)throw t;return await (0,m.sendResponse)(J,G,new Response(null,{status:500})),null}}e.s(["handler",0,S,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:R})},"routeModule",0,I,"serverHooks",0,O,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,R]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0xjfyxf._.js.map