module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let a=e.split("?")[0].split("#")[0].toLowerCase(),n=t.find(e=>!!(e.startsWith&&a.startsWith(e.startsWith)||e.includes&&a.includes(e.includes)));return n?.moduleCode??null}])},780907,e=>e.a(async(t,a)=>{try{var n=e.i(493458),i=e.i(89171),r=e.i(368105),o=e.i(15270),s=e.i(274173),l=e.i(503031),d=t([r,o]);[r,o]=d.then?(await d)():d;let h=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},E=e=>e&&"object"==typeof e?e:{},N=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",b=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function c(e,t){return(await o.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(l.CLINICAL_MODULE_LABELS,e))}async function p(e,t){let a=await o.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(a[0]?.count||0)>0}async function u(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,s.isClinicalServicesEmail)(t?.email)))return null;let a=await (0,n.cookies)(),i=h(a.get("active_clinic_id")?.value),l=h(a.get("active_hospital_id")?.value),d=h(a.get("active_branch_id")?.value),p=e?new URL(e.url):null,u=h(p?.searchParams.get("clinic_id")),m=h(p?.searchParams.get("hospital_id")),_=h(p?.searchParams.get("branch_id")),A=(await o.prisma.$queryRawUnsafe(`
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
      `,t.id??null,u??i,m??l,_??d))[0];if(!A&&l&&t.id&&(A=(await o.prisma.$queryRawUnsafe(`
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
        `,t.id,l,Array.from(b),d,i))[0]),!A)return null;let C=E(A.organization_branding),I=E(A.hospital_branding),y=E(A.branch_branding),T=E(A.clinic_branding),S={...C,...I,...y,...T},R=N(S.logoUrl,S.logo_url,S.logo,S.hospital_logo,S.image),f=N(S.name,S.hospitalName,S.hospital_name,A.hospital_name,A.branch_name,A.clinic_name,A.organization_name),L=await c(Number(A.tenant_id),Number(A.hospital_id));return{user:t,tenantId:Number(A.tenant_id),hospitalId:Number(A.hospital_id),branchId:Number(A.branch_id),clinicId:Number(A.clinic_id),organizationId:h(A.organization_id),organizationName:String(A.organization_name||""),tenantName:String(A.tenant_name||""),hospitalName:String(A.hospital_name||""),hospitalAddress:String(A.hospital_address||""),hospitalPhone:String(A.hospital_phone||""),hospitalEmail:String(A.hospital_email||""),hospitalLicenseNumber:String(A.hospital_license_number||""),branchName:String(A.branch_name||""),clinicName:String(A.clinic_name||""),roleKey:String(A.role_key||"clinical_user"),roleName:String(A.role_name||"Clinical User"),permissions:A.permissions||{},licensedModules:L,branding:{name:f||"Hospital",logoUrl:R||null,primaryColor:N(S.primaryColor,S.primary_color)||"#04142E",accentColor:N(S.accentColor,S.accent_color)||"#D4AF37",source:R?"hospital":"generated"}}}async function m(e){let t=await u(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return i.NextResponse.json({error:e},{status:401})}()};if(e){let a=new URL(e.url).pathname,n=(0,l.moduleCodeForClinicalPath)(a);if(n&&!(!await p(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(n)))return{context:null,response:i.NextResponse.json({error:"Module Not Licensed",module_code:n,module_name:l.CLINICAL_MODULE_LABELS[n]},{status:403})}}return{context:t,response:null}}async function _(e,t){await o.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,_,"requireClinicalContext",0,m]),a()}catch(e){a(e)}},!1),155876,e=>e.a(async(t,a)=>{try{var n=e.i(15270),i=t([n]);[n]=i.then?(await i)():i;let o=e=>String(e||"").trim();async function r(e,t){await n.prisma.$executeRawUnsafe(`
    INSERT INTO clinical_patient_workflow_events (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      patient_id,
      appointment_id,
      workflow_stage,
      status,
      summary,
      metadata,
      created_by,
      created_at,
      is_deleted
    )
	    VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::int,$7::varchar,$8::varchar,$9::text,$10::jsonb,$11::int,CURRENT_TIMESTAMP,false)
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId??null,t.appointmentId??null,t.workflowStage,t.status,t.summary,JSON.stringify(t.metadata||{}),e.user.id??null),t.patientId&&await n.prisma.$executeRawUnsafe(`
      INSERT INTO clinical_patient_timeline (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        patient_id,
        event_type,
        event_title,
        event_summary,
        source_table,
        source_id,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
	      VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::varchar,$7::varchar,$8::text,$9::varchar,$10::int,$11::jsonb,$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId,t.workflowStage,t.status,t.summary,t.sourceTable||"clinical_patient_workflow_events",t.sourceId??null,JSON.stringify({appointment_id:t.appointmentId??null,...t.metadata||{}}),e.user.id??null)}e.s(["nullableText",0,e=>o(e)||null,"recordWorkflowEvent",0,r,"serialize",0,e=>JSON.parse(JSON.stringify(e,(e,t)=>"bigint"==typeof t?Number(t):t)),"text",0,o,"toDecimal",0,e=>{let t=Number(e);return Number.isFinite(t)?t:null},"toNumber",0,e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null}]),a()}catch(e){a(e)}},!1),679504,e=>e.a(async(t,a)=>{try{var n=e.i(780907),i=e.i(15270),r=e.i(155876),o=t([n,i,r]);[n,i,r]=o.then?(await o)():o;let E=e=>String(e??"").trim(),N=(e,t=[])=>{let a=Array.from(e.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)).map(e=>e[1]);return Array.from(new Set(a.length?a:t))},b={patient_registration_success:{templateName:"Patient Registration Success",subject:"Patient registration completed",body:"Dear {{patient_name}},\n\nWelcome to {{hospital_name}}.\n\nYour patient registration has been completed successfully.\n\nUHID: {{uhid}}\n\nRegistered On:\n{{registration_date}}\n\nFor assistance please contact:\n{{hospital_phone}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","hospital_name","uhid","registration_date","hospital_phone"]},appointment_booked:{templateName:"Appointment Booked",subject:"Appointment confirmed",body:"Dear {{patient_name}},\n\nYour appointment has been confirmed.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nAppointment No:\n{{appointment_number}}\n\nPlease arrive 15 minutes before your scheduled time.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","department","appointment_date","appointment_time","appointment_number","hospital_name"]},appointment_checked_in:{templateName:"Appointment Check-In",subject:"Appointment checked in",body:"Dear {{patient_name}},\n\nYou have successfully checked in.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nToken Number:\n{{token_number}}\n\nPlease wait for your consultation.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","department","token_number","hospital_name"]},vitals_completed:{templateName:"Vitals Completed",subject:"Vitals recorded",body:"Dear {{patient_name}},\n\nYour vitals have been recorded successfully.\n\nYou will be called shortly for consultation with:\n\nDr. {{doctor_name}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","hospital_name"]},consultation_completed:{templateName:"Consultation Completed",subject:"Consultation completed",body:"Dear {{patient_name}},\n\nYour consultation with\nDr. {{doctor_name}}\nhas been completed.\n\nDiagnosis:\n{{diagnosis_summary}}\n\nPrescription and investigation details are available at the hospital.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","diagnosis_summary","hospital_name"]},lab_test_ordered:{templateName:"Lab Test Ordered",subject:"Lab test ordered",body:"Dear {{patient_name}},\n\nYour doctor has requested the following laboratory investigations:\n\n{{lab_tests}}\n\nPlease proceed to the laboratory department.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},lab_sample_collected:{templateName:"Lab Sample Collected",subject:"Lab sample collected",body:"Dear {{patient_name}},\n\nYour laboratory sample has been collected successfully.\n\nTests:\n{{lab_tests}}\n\nYou will receive a notification once results are available.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},lab_report_ready:{templateName:"Lab Report Ready",subject:"Lab report ready",body:"Dear {{patient_name}},\n\nYour laboratory report is now available.\n\nTests:\n{{lab_tests}}\n\nPlease collect the report from the hospital or access it through the patient portal.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},prescription_generated:{templateName:"Prescription Generated",subject:"Prescription generated",body:"Dear {{patient_name}},\n\nYour prescription has been generated.\n\nDoctor:\n{{doctor_name}}\n\nMedicines:\n{{medicine_count}}\n\nPlease proceed to the pharmacy counter.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","medicine_count","hospital_name"]},medicines_dispensed:{templateName:"Medicines Dispensed",subject:"Medicines dispensed",body:"Dear {{patient_name}},\n\nYour medicines have been dispensed successfully.\n\nPrescription Number:\n{{prescription_number}}\n\nAmount:\n₹{{amount}}\n\nPlease follow the prescribed dosage instructions.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","prescription_number","amount","hospital_name"]},bill_generated:{templateName:"Bill Generated",subject:"Bill generated",body:"Dear {{patient_name}},\n\nInvoice generated successfully.\n\nInvoice Number:\n{{invoice_number}}\n\nAmount:\n₹{{amount}}\n\nDepartment:\n{{department}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","invoice_number","amount","department","hospital_name"]},payment_received:{templateName:"Payment Received",subject:"Payment received",body:"Dear {{patient_name}},\n\nPayment received successfully.\n\nAmount:\n₹{{amount}}\n\nPayment Mode:\n{{payment_mode}}\n\nReceipt Number:\n{{receipt_number}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","amount","payment_mode","receipt_number","hospital_name"]},ip_admission_confirmed:{templateName:"IP Admission Confirmed",subject:"Admission confirmed",body:"Dear {{patient_name}},\n\nYour admission has been confirmed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAdmission Date:\n{{admission_date}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","ward","room","bed","admission_date","hospital_name"]},bed_allocated:{templateName:"Bed Allocated",subject:"Bed allocated",body:"Dear {{patient_name}},\n\nYour bed allocation has been completed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAllocation Time:\n{{allocation_time}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","ward","room","bed","allocation_time","hospital_name"]},patient_transferred:{templateName:"Patient Transferred",subject:"Patient transferred",body:"Dear {{patient_name}},\n\nYour ward/bed transfer has been recorded.\n\nFrom:\n{{from_location}}\n\nTo:\n{{to_location}}\n\nReason:\n{{reason}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","from_location","to_location","reason","hospital_name"]},discharge_initiated:{templateName:"Discharge Initiated",subject:"Discharge initiated",body:"Dear {{patient_name}},\n\nYour discharge process has been initiated.\n\nPlease complete billing and pharmacy formalities.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","hospital_name"]},discharge_completed:{templateName:"Discharge Completed",subject:"Discharge completed",body:"Dear {{patient_name}},\n\nYou have been discharged successfully.\n\nDischarge Date:\n{{discharge_date}}\n\nFollow-up Date:\n{{followup_date}}\n\nWe wish you a speedy recovery.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","discharge_date","followup_date","hospital_name"]},followup_reminder:{templateName:"Follow-Up Reminder",subject:"Follow-up reminder",body:"Dear {{patient_name}},\n\nThis is a reminder for your follow-up consultation.\n\nDoctor:\n{{doctor_name}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","appointment_date","appointment_time","hospital_name"]},payment_due_reminder:{templateName:"Payment Due Reminder",subject:"Payment due reminder",body:"Dear {{patient_name}},\n\nAn outstanding amount of ₹{{due_amount}} is pending.\n\nInvoice:\n{{invoice_number}}\n\nPlease contact the billing desk for assistance.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","due_amount","invoice_number","hospital_name"]}};async function s(e,t,a){return(await i.prisma.$queryRawUnsafe(`
    SELECT *
    FROM clinical_notification_templates
    WHERE tenant_id=$1
      AND hospital_id=$2
      AND branch_id=$3
      AND template_key=$4
      AND channel=$5
      AND COALESCE(status,'ACTIVE')='ACTIVE'
      AND COALESCE(is_deleted,false)=false
    ORDER BY id DESC
    LIMIT 1
    `,e.tenantId,e.hospitalId,e.branchId,t,a))[0]||null}async function l(e,t,a){let n=b[t],r=n?.body||"Dear {{patient_name}}, {{message}} - {{hospital_name}}";return(await i.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_notification_templates (
      tenant_id,hospital_id,branch_id,template_key,channel,template_name,subject,body,variables,status,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,'ACTIVE',$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,t,a,n?.templateName||t.replace(/_/g," "),n?.subject||"TOTTECH Clinical Services",r,JSON.stringify(n?.variables||["patient_name","message","hospital_name"]),e.user.id??null))[0]}async function d(e,t,a,n,i,r){if("WHATSAPP"===e&&!["true","1","yes","enabled"].includes(E(process.env.CLINICAL_WHATSAPP_ENABLED||process.env.WHATSAPP_ENABLED).toLowerCase()))return{status:"QUEUED",provider:"whatsapp",reason:"WHATSAPP_ENABLED/CLINICAL_WHATSAPP_ENABLED is not true."};if("WHATSAPP"===e){let e=process.env.CLINICAL_WHATSAPP_API_KEY||process.env.INTERAKT_API_KEY||process.env.WHATSAPP_API_KEY,a=process.env.CLINICAL_WHATSAPP_BASE_URL||process.env.INTERAKT_BASE_URL||process.env.WHATSAPP_BASE_URL;if(!e||!a)return{status:"QUEUED",provider:"whatsapp",reason:"WhatsApp provider credentials are not configured."};try{let o,s,l,d=(s=(o=E(process.env.CLINICAL_WHATSAPP_DEFAULT_COUNTRY_CODE||process.env.WHATSAPP_DEFAULT_COUNTRY_CODE)||"+91").replace(/\D/g,""),l=t.replace(/\D/g,""),s&&l.startsWith(s)&&l.length>10&&(l=l.slice(s.length)),l=l.replace(/^0+/,""),{countryCode:o.startsWith("+")?o:`+${o}`,phoneNumber:l}),c=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Basic ${e}`},body:JSON.stringify({countryCode:d.countryCode,phoneNumber:d.phoneNumber,type:"Template",callbackData:JSON.stringify({source:"tottech_clinical_services",templateKey:n}).slice(0,512),template:{name:n,languageCode:process.env.CLINICAL_WHATSAPP_LANGUAGE||process.env.WHATSAPP_TEMPLATE_LANGUAGE||"en",bodyValues:r&&r.length?r:Object.values(i||{}).map(e=>E(e))}})}),p=await c.text(),u=null;try{u=JSON.parse(p)}catch{u=null}return{status:c.ok&&u?.result!==!1?"SENT":"QUEUED",provider:"whatsapp",httpStatus:c.status,response:p.slice(0,1e3),messageId:u?.id||null}}catch(e){return{status:"QUEUED",provider:"whatsapp",error:e instanceof Error?e.message:"WhatsApp dispatch failed."}}}return"SMS"===e&&"true"!==process.env.CLINICAL_SMS_ENABLED?{status:"QUEUED",provider:"sms",reason:"CLINICAL_SMS_ENABLED is not true."}:"EMAIL"===e&&"true"!==process.env.CLINICAL_EMAIL_ENABLED?{status:"QUEUED",provider:"email",reason:"CLINICAL_EMAIL_ENABLED is not true."}:{status:"SENT",provider:e.toLowerCase(),recipient:t,length:a.length,simulated:!0}}async function c(e,t){let a,o,c=await s(e,t.templateKey,t.channel)||await l(e,t.templateKey,t.channel),p=(a=E(c.body),o={...t.variables,hospital_name:e.hospitalName||e.branding.name,branch_name:e.branchName},a.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g,(e,t)=>E(o[t])||"-")),u=N(E(c.body),b[t.templateKey]?.variables||[]).map(a=>E({...t.variables,hospital_name:e.hospitalName||e.branding.name,branch_name:e.branchName}[a])),m=await d(t.channel,t.recipient,p,t.templateKey,t.variables,u),_="SENT"===m.status?"SENT":"QUEUED",h=await i.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_notification_queue (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,invoice_id,
      source_module,source_record_id,channel,template_key,recipient,subject,message_body,payload,
      status,scheduled_at,sent_at,provider_response,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,COALESCE($17::timestamp,CURRENT_TIMESTAMP),
      CASE WHEN $16='SENT' THEN CURRENT_TIMESTAMP ELSE NULL END,$18::jsonb,$19,$19,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId??null,t.appointmentId??null,t.invoiceId??null,t.sourceModule??null,t.sourceRecordId??null,t.channel,t.templateKey,t.recipient,E(c.subject)||null,p,JSON.stringify(t.variables),_,t.scheduledAt??null,JSON.stringify(m),e.user.id??null);return await (0,n.recordClinicalAudit)(e,{moduleName:"clinical_notifications",action:"queue",entityType:"clinical_notification_queue",entityId:Number(h[0]?.id),summary:`${t.channel} notification ${_.toLowerCase()} for ${t.templateKey}`,payload:{channel:t.channel,templateKey:t.templateKey,status:_,sourceModule:t.sourceModule,sourceRecordId:t.sourceRecordId}}),t.patientId&&await (0,r.recordWorkflowEvent)(e,{patientId:t.patientId,appointmentId:t.appointmentId??null,workflowStage:"NOTIFICATION",status:_,summary:`${t.channel} ${_.toLowerCase()} for ${t.templateKey}.`,sourceTable:"clinical_notification_queue",sourceId:Number(h[0]?.id),metadata:{channel:t.channel,template_key:t.templateKey,recipient:t.recipient,source_module:t.sourceModule,source_record_id:t.sourceRecordId,provider_response:m}}),h[0]}async function p(e){for(let t of Object.keys(b))await l(e,t,"WHATSAPP").catch(async()=>null)}async function u(e,t){let a=(await i.prisma.$queryRawUnsafe(`
    SELECT *
    FROM clinical_notification_queue
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
      AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,t,e.tenantId,e.hospitalId,e.branchId))[0];if(!a)return null;let n="string"==typeof a.payload?JSON.parse(String(a.payload||"{}")):a.payload||{},o=E(a.message_body),c=await s(e,E(a.template_key),E(a.channel))||await l(e,E(a.template_key),E(a.channel)),p=N(E(c.body),b[E(a.template_key)]?.variables||[]).map(e=>E(n[e])),u=await d(E(a.channel),E(a.recipient),o,E(a.template_key),n,p),m="SENT"===u.status?"SENT":"QUEUED",_=await i.prisma.$queryRawUnsafe(`
    UPDATE clinical_notification_queue
    SET status=$5,
        sent_at=CASE WHEN $5='SENT' THEN CURRENT_TIMESTAMP ELSE sent_at END,
        provider_response=$6::jsonb,
        retry_count=COALESCE(retry_count,0)+1,
        updated_by=$7,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
    RETURNING *
    `,t,e.tenantId,e.hospitalId,e.branchId,m,JSON.stringify(u),e.user.id??null);return a.patient_id&&await (0,r.recordWorkflowEvent)(e,{patientId:Number(a.patient_id),appointmentId:a.appointment_id?Number(a.appointment_id):null,workflowStage:"NOTIFICATION",status:m,summary:`${a.channel} retry ${m.toLowerCase()} for ${a.template_key}.`,sourceTable:"clinical_notification_queue",sourceId:t,metadata:{channel:a.channel,template_key:a.template_key,recipient:a.recipient,provider_response:u}}),_[0]||null}async function m(e,t){return(await i.prisma.$queryRawUnsafe(`
    SELECT
      p.id,
      COALESCE(NULLIF(TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')), ''), p.patient_uid, p.uhid) AS patient_name,
      p.patient_uid,
      p.uhid,
      p.phone,
      p.whatsapp_number,
      p.alternate_mobile
    FROM patients p
    WHERE p.id=$1
      AND p.tenant_id=$2
      AND p.hospital_id=$3
      AND p.branch_id=$4
      AND COALESCE(p.is_deleted,false)=false
    LIMIT 1
    `,t,e.tenantId,e.hospitalId,e.branchId))[0]||null}async function _(e,t){let a=await i.prisma.$queryRawUnsafe(`
    SELECT d.full_name AS doctor_name
    FROM appointments a
    LEFT JOIN doctors d ON d.id = a.doctor_id
    WHERE a.tenant_id=$1
      AND a.hospital_id=$2
      AND a.branch_id=$3
      AND COALESCE(a.is_deleted,false)=false
      AND (
        ($4::int IS NOT NULL AND a.id=$4::int)
        OR ($4::int IS NULL AND $5::int IS NOT NULL AND a.patient_id=$5::int)
      )
    ORDER BY
      CASE WHEN $4::int IS NOT NULL AND a.id=$4::int THEN 0 ELSE 1 END,
      a.appointment_date DESC NULLS LAST,
      a.created_at DESC,
      a.id DESC
    LIMIT 1
    `,e.tenantId,e.hospitalId,e.branchId,t.appointmentId??null,t.patientId??null);return E(a[0]?.doctor_name)||"Assigned Doctor"}async function h(e,t){var a;let n;if(!t.patientId&&!t.recipient)return null;let i=t.patientId?await m(e,t.patientId):null,r=E(t.recipient||i?.whatsapp_number||i?.phone||i?.alternate_mobile);if(!r)return null;let o=(a=t.variables?.doctor_name,!(n=E(a))||/^doctor( #\d+)?$/i.test(n)||/^assigned doctor$/i.test(n))?await _(e,{appointmentId:t.appointmentId??null,patientId:t.patientId??null}):E(t.variables?.doctor_name);return c(e,{channel:"WHATSAPP",templateKey:t.templateKey,recipient:r,patientId:t.patientId??null,appointmentId:t.appointmentId??null,invoiceId:t.invoiceId??null,sourceModule:t.sourceModule,sourceRecordId:t.sourceRecordId,variables:{patient_name:i?.patient_name||"Patient",uhid:i?.uhid||i?.patient_uid||"-",hospital_name:e.hospitalName||e.branding.name,hospital_phone:"-",...t.variables,doctor_name:o||"Assigned Doctor"}})}e.s(["clinicalNotificationDefaults",0,b,"ensureClinicalNotificationTemplates",0,p,"queueClinicalNotification",0,c,"queueClinicalWorkflowNotification",0,h,"retryClinicalNotification",0,u]),a()}catch(e){a(e)}},!1),820472,e=>e.a(async(t,a)=>{try{var n=e.i(89171),i=e.i(780907),r=e.i(679504),o=e.i(155876),s=e.i(15270),l=t([i,r,o,s]);async function d(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,r=await s.prisma.$queryRawUnsafe(`
    SELECT pay.*, COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name
    FROM clinical_operational_payments pay
    LEFT JOIN patients p ON p.id = pay.patient_id
    WHERE pay.tenant_id = $1 AND pay.hospital_id = $2 AND pay.branch_id = $3
      AND COALESCE(pay.is_deleted,false) = false
    ORDER BY pay.created_at DESC, pay.id DESC
    LIMIT 250
    `,a.tenantId,a.hospitalId,a.branchId);return n.NextResponse.json((0,o.serialize)({rows:r}))}async function c(e){let t=await (0,i.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,l=await e.json(),d=(0,o.toNumber)(l.patient_id),c=(0,o.toNumber)(l.appointment_id),p=(0,o.toNumber)(l.lab_order_id),u=(0,o.text)(l.payment_type)||"CONSULTATION_FEE";if(!d)return n.NextResponse.json({error:"Patient is required for payment collection."},{status:400});let m=await s.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_operational_payments (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,payment_type,amount,
      payment_method,reference_number,payment_date,status,notes,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,COALESCE($11::date,CURRENT_DATE),$12,$13,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,d,c,u,(0,o.toDecimal)(l.amount)??0,(0,o.nullableText)(l.payment_method),(0,o.nullableText)(l.reference_number),(0,o.nullableText)(l.payment_date),(0,o.text)(l.status)||"PAID",(0,o.nullableText)(l.notes),a.user.id??null);return"LAB_PAYMENT"===u&&await s.prisma.$executeRawUnsafe(`
      UPDATE lab_orders
      SET status = 'BILL_PAID',
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
        AND (
          ($4::int IS NOT NULL AND id = $4::int)
          OR ($4::int IS NULL AND $5::int IS NOT NULL AND appointment_id = $5::int AND patient_id = $7::int AND status IN ('ORDERED','PENDING_PAYMENT'))
        )
      `,a.tenantId,a.hospitalId,a.branchId,p,c,a.user.id??null,d),await (0,o.recordWorkflowEvent)(a,{patientId:d,appointmentId:c,workflowStage:"BILLING",status:(0,o.text)(l.status)||"PAID",summary:`${u} collected: ${(0,o.toDecimal)(l.amount)??0}`,sourceTable:"clinical_operational_payments",sourceId:Number(m[0].id),metadata:m[0]}),await (0,i.recordClinicalAudit)(a,{moduleName:"front_desk_collections",action:"collect",entityType:"clinical_operational_payments",entityId:Number(m[0].id),summary:"Clinical operational payment collected",payload:m[0]}),await (0,r.queueClinicalWorkflowNotification)(a,{templateKey:"payment_received",patientId:d,appointmentId:c,sourceModule:"clinical_operational_payments",sourceRecordId:Number(m[0].id),variables:{amount:(0,o.toDecimal)(l.amount)??0,payment_mode:(0,o.nullableText)(l.payment_method)||"Cash",receipt_number:m[0].reference_number||m[0].id}}),n.NextResponse.json((0,o.serialize)(m[0]),{status:201})}[i,r,o,s]=l.then?(await l)():l,e.s(["GET",0,d,"POST",0,c]),a()}catch(e){a(e)}},!1),380067,e=>e.a(async(t,a)=>{try{var n=e.i(747909),i=e.i(174017),r=e.i(996250),o=e.i(759756),s=e.i(561916),l=e.i(174677),d=e.i(869741),c=e.i(316795),p=e.i(487718),u=e.i(995169),m=e.i(47587),_=e.i(666012),h=e.i(570101),E=e.i(626937),N=e.i(10372),b=e.i(193695);e.i(52474);var A=e.i(600220),C=e.i(820472),I=t([C]);[C]=I.then?(await I)():I;let T=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/clinical/operations/payments/route",pathname:"/api/clinical/operations/payments",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/operations/payments/route.ts",nextConfigOutput:"",userland:C,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:R,serverHooks:f}=T;async function y(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),T.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/clinical/operations/payments/route";n=n.replace(/\/index$/,"")||"/";let r=await T.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,deploymentId:I,params:y,nextConfig:S,parsedUrl:R,isDraftMode:f,prerenderManifest:L,routerServerContext:g,isOnDemandRevalidate:O,revalidateOnlyGenerated:v,resolvedPathname:$,clientReferenceManifest:D,serverActionsManifest:w}=r,P=(0,d.normalizeAppPath)(n),U=!!(L.dynamicRoutes[P]||L.routes[$]),M=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,R,!1):t.end("This page could not be found"),null);if(U&&!f){let e=!!L.routes[$],t=L.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await M();throw new b.NoFallbackError}}let x=null;!U||T.isDev||f||(x=$,x="/index"===x?"/":x);let W=!0===T.isDev||!U,k=U&&!W;w&&D&&(0,l.setManifestsSingleton)({page:n,clientReferenceManifest:D,serverActionsManifest:w});let H=e.method||"GET",F=(0,s.getTracer)(),j=F.getActiveScopeSpan(),q=!!(null==g?void 0:g.isWrappedByNextServer),Y=!!(0,o.getRequestMeta)(e,"minimalMode"),B=(0,o.getRequestMeta)(e,"incrementalCache")||await T.getIncrementalCache(e,S,L,Y);null==B||B.resetRequestCache(),globalThis.__incrementalCache=B;let J={params:y,previewProps:L.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:W,incrementalCache:B,cacheLifeProfiles:S.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>T.onRequestError(e,t,n,i,g)},sharedContext:{buildId:C,deploymentId:I}},z=new c.NodeNextRequest(e),K=new c.NodeNextResponse(t),V=p.NextRequestAdapter.fromNodeNextRequest(z,(0,p.signalFromNodeResponse)(t));try{let r,o=async e=>T.handle(V,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${H} ${n}`)}),l=async r=>{var s,l;let d=async({previousCacheEntry:i})=>{try{if(!Y&&O&&v&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(r);e.fetchMetrics=J.renderOpts.fetchMetrics;let s=J.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=J.renderOpts.collectedTags;if(!U)return await (0,_.sendResponse)(z,K,n,J.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[N.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,i=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:O})},!1,g),t}},c=await T.handleResponse({req:e,nextConfig:S,cacheKey:x,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:L,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:v,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:Y});if(!U)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});Y||t.setHeader("x-nextjs-cache",O?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return Y&&U||p.delete(N.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,E.getCacheControlHeader)(c.cacheControl)),await (0,_.sendResponse)(z,K,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};q&&j?await l(j):(r=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${H} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l),void 0,!q))}catch(t){if(t instanceof b.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:O})},!1,g),U)throw t;return await (0,_.sendResponse)(z,K,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:R})},"routeModule",0,T,"serverHooks",0,f,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,R]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0nnmnml._.js.map