module.exports=[193695,(e,n,a)=>{n.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,n,a)=>{n.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,n,a)=>{n.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,n,a)=>{n.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,n,a)=>{n.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,n,a)=>{n.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let n="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===n?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let n=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===n||n.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?n:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let n=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,n){return!(e&&Array.isArray(n)&&0!==n.length)||n.includes(e)},"moduleCodeForClinicalPath",0,function(e){let a=e.split("?")[0].split("#")[0].toLowerCase(),t=n.find(e=>!!(e.startsWith&&a.startsWith(e.startsWith)||e.includes&&a.includes(e.includes)));return t?.moduleCode??null}])},780907,e=>e.a(async(n,a)=>{try{var t=e.i(493458),i=e.i(89171),o=e.i(368105),r=e.i(15270),s=e.i(274173),l=e.i(503031),c=n([o,r]);[o,r]=c.then?(await c)():c;let h=e=>{let n=Number(e);return Number.isFinite(n)&&n>0?n:null},b=e=>e&&"object"==typeof e?e:{},E=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",N=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,n){return(await r.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,n)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(l.CLINICAL_MODULE_LABELS,e))}async function p(e,n){let a=await r.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,n);return Number(a[0]?.count||0)>0}async function m(e){let n=await (0,o.getCurrentUser)();if(!n||!(n?.project==="tottech_clinical_services"||"CLINICAL"===String(n?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(n?.platform_type||"").trim().toUpperCase()||(0,s.isClinicalServicesEmail)(n?.email)))return null;let a=await (0,t.cookies)(),i=h(a.get("active_clinic_id")?.value),l=h(a.get("active_hospital_id")?.value),c=h(a.get("active_branch_id")?.value),p=e?new URL(e.url):null,m=h(p?.searchParams.get("clinic_id")),_=h(p?.searchParams.get("hospital_id")),u=h(p?.searchParams.get("branch_id")),A=(await r.prisma.$queryRawUnsafe(`
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
      `,n.id??null,m??i,_??l,u??c))[0];if(!A&&l&&n.id&&(A=(await r.prisma.$queryRawUnsafe(`
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
        `,n.id,l,Array.from(N),c,i))[0]),!A)return null;let I=b(A.organization_branding),C=b(A.hospital_branding),y=b(A.branch_branding),S=b(A.clinic_branding),T={...I,...C,...y,...S},L=E(T.logoUrl,T.logo_url,T.logo,T.hospital_logo,T.image),f=E(T.name,T.hospitalName,T.hospital_name,A.hospital_name,A.branch_name,A.clinic_name,A.organization_name),O=await d(Number(A.tenant_id),Number(A.hospital_id));return{user:n,tenantId:Number(A.tenant_id),hospitalId:Number(A.hospital_id),branchId:Number(A.branch_id),clinicId:Number(A.clinic_id),organizationId:h(A.organization_id),organizationName:String(A.organization_name||""),tenantName:String(A.tenant_name||""),hospitalName:String(A.hospital_name||""),hospitalAddress:String(A.hospital_address||""),hospitalPhone:String(A.hospital_phone||""),hospitalEmail:String(A.hospital_email||""),hospitalLicenseNumber:String(A.hospital_license_number||""),branchName:String(A.branch_name||""),clinicName:String(A.clinic_name||""),roleKey:String(A.role_key||"clinical_user"),roleName:String(A.role_name||"Clinical User"),permissions:A.permissions||{},licensedModules:O,branding:{name:f||"Hospital",logoUrl:L||null,primaryColor:E(T.primaryColor,T.primary_color)||"#04142E",accentColor:E(T.accentColor,T.accent_color)||"#D4AF37",source:L?"hospital":"generated"}}}async function _(e){let n=await m(e);if(!n)return{context:null,response:function(e="Clinical Services login required."){return i.NextResponse.json({error:e},{status:401})}()};if(e){let a=new URL(e.url).pathname,t=(0,l.moduleCodeForClinicalPath)(a);if(t&&!(!await p(n.tenantId,n.hospitalId)||(n.licensedModules||[]).includes(t)))return{context:null,response:i.NextResponse.json({error:"Module Not Licensed",module_code:t,module_name:l.CLINICAL_MODULE_LABELS[t]},{status:403})}}return{context:n,response:null}}async function u(e,n){await r.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,n.moduleName,n.action,n.entityType??null,n.entityId??null,n.summary??null,JSON.stringify(n.payload??{}))}e.s(["recordClinicalAudit",0,u,"requireClinicalContext",0,_]),a()}catch(e){a(e)}},!1),155876,e=>e.a(async(n,a)=>{try{var t=e.i(15270),i=n([t]);[t]=i.then?(await i)():i;let r=e=>String(e||"").trim();async function o(e,n){await t.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,n.patientId??null,n.appointmentId??null,n.workflowStage,n.status,n.summary,JSON.stringify(n.metadata||{}),e.user.id??null),n.patientId&&await t.prisma.$executeRawUnsafe(`
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
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,n.patientId,n.workflowStage,n.status,n.summary,n.sourceTable||"clinical_patient_workflow_events",n.sourceId??null,JSON.stringify({appointment_id:n.appointmentId??null,...n.metadata||{}}),e.user.id??null)}e.s(["nullableText",0,e=>r(e)||null,"recordWorkflowEvent",0,o,"serialize",0,e=>JSON.parse(JSON.stringify(e,(e,n)=>"bigint"==typeof n?Number(n):n)),"text",0,r,"toDecimal",0,e=>{let n=Number(e);return Number.isFinite(n)?n:null},"toNumber",0,e=>{let n=Number(e);return Number.isFinite(n)&&n>0?n:null}]),a()}catch(e){a(e)}},!1),679504,e=>e.a(async(n,a)=>{try{var t=e.i(780907),i=e.i(15270),o=e.i(155876),r=n([t,i,o]);[t,i,o]=r.then?(await r)():r;let b=e=>String(e??"").trim(),E=(e,n=[])=>{let a=Array.from(e.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)).map(e=>e[1]);return Array.from(new Set(a.length?a:n))},N={patient_registration_success:{templateName:"Patient Registration Success",subject:"Patient registration completed",body:"Dear {{patient_name}},\n\nWelcome to {{hospital_name}}.\n\nYour patient registration has been completed successfully.\n\nUHID: {{uhid}}\n\nRegistered On:\n{{registration_date}}\n\nFor assistance please contact:\n{{hospital_phone}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","hospital_name","uhid","registration_date","hospital_phone"]},appointment_booked:{templateName:"Appointment Booked",subject:"Appointment confirmed",body:"Dear {{patient_name}},\n\nYour appointment has been confirmed.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nAppointment No:\n{{appointment_number}}\n\nPlease arrive 15 minutes before your scheduled time.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","department","appointment_date","appointment_time","appointment_number","hospital_name"]},appointment_checked_in:{templateName:"Appointment Check-In",subject:"Appointment checked in",body:"Dear {{patient_name}},\n\nYou have successfully checked in.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nToken Number:\n{{token_number}}\n\nPlease wait for your consultation.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","department","token_number","hospital_name"]},vitals_completed:{templateName:"Vitals Completed",subject:"Vitals recorded",body:"Dear {{patient_name}},\n\nYour vitals have been recorded successfully.\n\nYou will be called shortly for consultation with:\n\nDr. {{doctor_name}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","hospital_name"]},consultation_completed:{templateName:"Consultation Completed",subject:"Consultation completed",body:"Dear {{patient_name}},\n\nYour consultation with\nDr. {{doctor_name}}\nhas been completed.\n\nDiagnosis:\n{{diagnosis_summary}}\n\nPrescription and investigation details are available at the hospital.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","diagnosis_summary","hospital_name"]},lab_test_ordered:{templateName:"Lab Test Ordered",subject:"Lab test ordered",body:"Dear {{patient_name}},\n\nYour doctor has requested the following laboratory investigations:\n\n{{lab_tests}}\n\nPlease proceed to the laboratory department.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},lab_sample_collected:{templateName:"Lab Sample Collected",subject:"Lab sample collected",body:"Dear {{patient_name}},\n\nYour laboratory sample has been collected successfully.\n\nTests:\n{{lab_tests}}\n\nYou will receive a notification once results are available.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},lab_report_ready:{templateName:"Lab Report Ready",subject:"Lab report ready",body:"Dear {{patient_name}},\n\nYour laboratory report is now available.\n\nTests:\n{{lab_tests}}\n\nPlease collect the report from the hospital or access it through the patient portal.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},prescription_generated:{templateName:"Prescription Generated",subject:"Prescription generated",body:"Dear {{patient_name}},\n\nYour prescription has been generated.\n\nDoctor:\n{{doctor_name}}\n\nMedicines:\n{{medicine_count}}\n\nPlease proceed to the pharmacy counter.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","medicine_count","hospital_name"]},medicines_dispensed:{templateName:"Medicines Dispensed",subject:"Medicines dispensed",body:"Dear {{patient_name}},\n\nYour medicines have been dispensed successfully.\n\nPrescription Number:\n{{prescription_number}}\n\nAmount:\n₹{{amount}}\n\nPlease follow the prescribed dosage instructions.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","prescription_number","amount","hospital_name"]},bill_generated:{templateName:"Bill Generated",subject:"Bill generated",body:"Dear {{patient_name}},\n\nInvoice generated successfully.\n\nInvoice Number:\n{{invoice_number}}\n\nAmount:\n₹{{amount}}\n\nDepartment:\n{{department}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","invoice_number","amount","department","hospital_name"]},payment_received:{templateName:"Payment Received",subject:"Payment received",body:"Dear {{patient_name}},\n\nPayment received successfully.\n\nAmount:\n₹{{amount}}\n\nPayment Mode:\n{{payment_mode}}\n\nReceipt Number:\n{{receipt_number}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","amount","payment_mode","receipt_number","hospital_name"]},ip_admission_confirmed:{templateName:"IP Admission Confirmed",subject:"Admission confirmed",body:"Dear {{patient_name}},\n\nYour admission has been confirmed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAdmission Date:\n{{admission_date}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","ward","room","bed","admission_date","hospital_name"]},bed_allocated:{templateName:"Bed Allocated",subject:"Bed allocated",body:"Dear {{patient_name}},\n\nYour bed allocation has been completed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAllocation Time:\n{{allocation_time}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","ward","room","bed","allocation_time","hospital_name"]},patient_transferred:{templateName:"Patient Transferred",subject:"Patient transferred",body:"Dear {{patient_name}},\n\nYour ward/bed transfer has been recorded.\n\nFrom:\n{{from_location}}\n\nTo:\n{{to_location}}\n\nReason:\n{{reason}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","from_location","to_location","reason","hospital_name"]},discharge_initiated:{templateName:"Discharge Initiated",subject:"Discharge initiated",body:"Dear {{patient_name}},\n\nYour discharge process has been initiated.\n\nPlease complete billing and pharmacy formalities.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","hospital_name"]},discharge_completed:{templateName:"Discharge Completed",subject:"Discharge completed",body:"Dear {{patient_name}},\n\nYou have been discharged successfully.\n\nDischarge Date:\n{{discharge_date}}\n\nFollow-up Date:\n{{followup_date}}\n\nWe wish you a speedy recovery.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","discharge_date","followup_date","hospital_name"]},followup_reminder:{templateName:"Follow-Up Reminder",subject:"Follow-up reminder",body:"Dear {{patient_name}},\n\nThis is a reminder for your follow-up consultation.\n\nDoctor:\n{{doctor_name}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","appointment_date","appointment_time","hospital_name"]},payment_due_reminder:{templateName:"Payment Due Reminder",subject:"Payment due reminder",body:"Dear {{patient_name}},\n\nAn outstanding amount of ₹{{due_amount}} is pending.\n\nInvoice:\n{{invoice_number}}\n\nPlease contact the billing desk for assistance.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","due_amount","invoice_number","hospital_name"]}};async function s(e,n,a){return(await i.prisma.$queryRawUnsafe(`
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
    `,e.tenantId,e.hospitalId,e.branchId,n,a))[0]||null}async function l(e,n,a){let t=N[n],o=t?.body||"Dear {{patient_name}}, {{message}} - {{hospital_name}}";return(await i.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_notification_templates (
      tenant_id,hospital_id,branch_id,template_key,channel,template_name,subject,body,variables,status,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,'ACTIVE',$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,n,a,t?.templateName||n.replace(/_/g," "),t?.subject||"TOTTECH Clinical Services",o,JSON.stringify(t?.variables||["patient_name","message","hospital_name"]),e.user.id??null))[0]}async function c(e,n,a,t,i,o){if("WHATSAPP"===e&&!["true","1","yes","enabled"].includes(b(process.env.CLINICAL_WHATSAPP_ENABLED||process.env.WHATSAPP_ENABLED).toLowerCase()))return{status:"QUEUED",provider:"whatsapp",reason:"WHATSAPP_ENABLED/CLINICAL_WHATSAPP_ENABLED is not true."};if("WHATSAPP"===e){let e=process.env.CLINICAL_WHATSAPP_API_KEY||process.env.INTERAKT_API_KEY||process.env.WHATSAPP_API_KEY,a=process.env.CLINICAL_WHATSAPP_BASE_URL||process.env.INTERAKT_BASE_URL||process.env.WHATSAPP_BASE_URL;if(!e||!a)return{status:"QUEUED",provider:"whatsapp",reason:"WhatsApp provider credentials are not configured."};try{let r,s,l,c=(s=(r=b(process.env.CLINICAL_WHATSAPP_DEFAULT_COUNTRY_CODE||process.env.WHATSAPP_DEFAULT_COUNTRY_CODE)||"+91").replace(/\D/g,""),l=n.replace(/\D/g,""),s&&l.startsWith(s)&&l.length>10&&(l=l.slice(s.length)),l=l.replace(/^0+/,""),{countryCode:r.startsWith("+")?r:`+${r}`,phoneNumber:l}),d=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Basic ${e}`},body:JSON.stringify({countryCode:c.countryCode,phoneNumber:c.phoneNumber,type:"Template",callbackData:JSON.stringify({source:"tottech_clinical_services",templateKey:t}).slice(0,512),template:{name:t,languageCode:process.env.CLINICAL_WHATSAPP_LANGUAGE||process.env.WHATSAPP_TEMPLATE_LANGUAGE||"en",bodyValues:o&&o.length?o:Object.values(i||{}).map(e=>b(e))}})}),p=await d.text(),m=null;try{m=JSON.parse(p)}catch{m=null}return{status:d.ok&&m?.result!==!1?"SENT":"QUEUED",provider:"whatsapp",httpStatus:d.status,response:p.slice(0,1e3),messageId:m?.id||null}}catch(e){return{status:"QUEUED",provider:"whatsapp",error:e instanceof Error?e.message:"WhatsApp dispatch failed."}}}return"SMS"===e&&"true"!==process.env.CLINICAL_SMS_ENABLED?{status:"QUEUED",provider:"sms",reason:"CLINICAL_SMS_ENABLED is not true."}:"EMAIL"===e&&"true"!==process.env.CLINICAL_EMAIL_ENABLED?{status:"QUEUED",provider:"email",reason:"CLINICAL_EMAIL_ENABLED is not true."}:{status:"SENT",provider:e.toLowerCase(),recipient:n,length:a.length,simulated:!0}}async function d(e,n){let a,r,d=await s(e,n.templateKey,n.channel)||await l(e,n.templateKey,n.channel),p=(a=b(d.body),r={...n.variables,hospital_name:e.hospitalName||e.branding.name,branch_name:e.branchName},a.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g,(e,n)=>b(r[n])||"-")),m=E(b(d.body),N[n.templateKey]?.variables||[]).map(a=>b({...n.variables,hospital_name:e.hospitalName||e.branding.name,branch_name:e.branchName}[a])),_=await c(n.channel,n.recipient,p,n.templateKey,n.variables,m),u="SENT"===_.status?"SENT":"QUEUED",h=await i.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_notification_queue (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,invoice_id,
      source_module,source_record_id,channel,template_key,recipient,subject,message_body,payload,
      status,scheduled_at,sent_at,provider_response,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,COALESCE($17::timestamp,CURRENT_TIMESTAMP),
      CASE WHEN $16='SENT' THEN CURRENT_TIMESTAMP ELSE NULL END,$18::jsonb,$19,$19,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,n.patientId??null,n.appointmentId??null,n.invoiceId??null,n.sourceModule??null,n.sourceRecordId??null,n.channel,n.templateKey,n.recipient,b(d.subject)||null,p,JSON.stringify(n.variables),u,n.scheduledAt??null,JSON.stringify(_),e.user.id??null);return await (0,t.recordClinicalAudit)(e,{moduleName:"clinical_notifications",action:"queue",entityType:"clinical_notification_queue",entityId:Number(h[0]?.id),summary:`${n.channel} notification ${u.toLowerCase()} for ${n.templateKey}`,payload:{channel:n.channel,templateKey:n.templateKey,status:u,sourceModule:n.sourceModule,sourceRecordId:n.sourceRecordId}}),n.patientId&&await (0,o.recordWorkflowEvent)(e,{patientId:n.patientId,appointmentId:n.appointmentId??null,workflowStage:"NOTIFICATION",status:u,summary:`${n.channel} ${u.toLowerCase()} for ${n.templateKey}.`,sourceTable:"clinical_notification_queue",sourceId:Number(h[0]?.id),metadata:{channel:n.channel,template_key:n.templateKey,recipient:n.recipient,source_module:n.sourceModule,source_record_id:n.sourceRecordId,provider_response:_}}),h[0]}async function p(e){for(let n of Object.keys(N))await l(e,n,"WHATSAPP").catch(async()=>null)}async function m(e,n){let a=(await i.prisma.$queryRawUnsafe(`
    SELECT *
    FROM clinical_notification_queue
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
      AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,n,e.tenantId,e.hospitalId,e.branchId))[0];if(!a)return null;let t="string"==typeof a.payload?JSON.parse(String(a.payload||"{}")):a.payload||{},r=b(a.message_body),d=await s(e,b(a.template_key),b(a.channel))||await l(e,b(a.template_key),b(a.channel)),p=E(b(d.body),N[b(a.template_key)]?.variables||[]).map(e=>b(t[e])),m=await c(b(a.channel),b(a.recipient),r,b(a.template_key),t,p),_="SENT"===m.status?"SENT":"QUEUED",u=await i.prisma.$queryRawUnsafe(`
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
    `,n,e.tenantId,e.hospitalId,e.branchId,_,JSON.stringify(m),e.user.id??null);return a.patient_id&&await (0,o.recordWorkflowEvent)(e,{patientId:Number(a.patient_id),appointmentId:a.appointment_id?Number(a.appointment_id):null,workflowStage:"NOTIFICATION",status:_,summary:`${a.channel} retry ${_.toLowerCase()} for ${a.template_key}.`,sourceTable:"clinical_notification_queue",sourceId:n,metadata:{channel:a.channel,template_key:a.template_key,recipient:a.recipient,provider_response:m}}),u[0]||null}async function _(e,n){return(await i.prisma.$queryRawUnsafe(`
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
    `,n,e.tenantId,e.hospitalId,e.branchId))[0]||null}async function u(e,n){let a=await i.prisma.$queryRawUnsafe(`
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
    `,e.tenantId,e.hospitalId,e.branchId,n.appointmentId??null,n.patientId??null);return b(a[0]?.doctor_name)||"Assigned Doctor"}async function h(e,n){var a;let t;if(!n.patientId&&!n.recipient)return null;let i=n.patientId?await _(e,n.patientId):null,o=b(n.recipient||i?.whatsapp_number||i?.phone||i?.alternate_mobile);if(!o)return null;let r=(a=n.variables?.doctor_name,!(t=b(a))||/^doctor( #\d+)?$/i.test(t)||/^assigned doctor$/i.test(t))?await u(e,{appointmentId:n.appointmentId??null,patientId:n.patientId??null}):b(n.variables?.doctor_name);return d(e,{channel:"WHATSAPP",templateKey:n.templateKey,recipient:o,patientId:n.patientId??null,appointmentId:n.appointmentId??null,invoiceId:n.invoiceId??null,sourceModule:n.sourceModule,sourceRecordId:n.sourceRecordId,variables:{patient_name:i?.patient_name||"Patient",uhid:i?.uhid||i?.patient_uid||"-",hospital_name:e.hospitalName||e.branding.name,hospital_phone:"-",...n.variables,doctor_name:r||"Assigned Doctor"}})}e.s(["clinicalNotificationDefaults",0,N,"ensureClinicalNotificationTemplates",0,p,"queueClinicalNotification",0,d,"queueClinicalWorkflowNotification",0,h,"retryClinicalNotification",0,m]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0~b4z-g._.js.map