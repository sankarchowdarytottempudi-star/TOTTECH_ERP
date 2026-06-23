module.exports=[155876,e=>e.a(async(t,n)=>{try{var a=e.i(15270),i=t([a]);[a]=i.then?(await i)():i;let r=e=>String(e||"").trim();async function o(e,t){await a.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId??null,t.appointmentId??null,t.workflowStage,t.status,t.summary,JSON.stringify(t.metadata||{}),e.user.id??null),t.patientId&&await a.prisma.$executeRawUnsafe(`
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
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId,t.workflowStage,t.status,t.summary,t.sourceTable||"clinical_patient_workflow_events",t.sourceId??null,JSON.stringify({appointment_id:t.appointmentId??null,...t.metadata||{}}),e.user.id??null)}e.s(["nullableText",0,e=>r(e)||null,"recordWorkflowEvent",0,o,"serialize",0,e=>JSON.parse(JSON.stringify(e,(e,t)=>"bigint"==typeof t?Number(t):t)),"text",0,r,"toDecimal",0,e=>{let t=Number(e);return Number.isFinite(t)?t:null},"toNumber",0,e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null}]),n()}catch(e){n(e)}},!1),679504,e=>e.a(async(t,n)=>{try{var a=e.i(780907),i=e.i(15270),o=e.i(155876),r=t([a,i,o]);[a,i,o]=r.then?(await r)():r;let b=e=>String(e??"").trim(),y=(e,t=[])=>{let n=Array.from(e.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)).map(e=>e[1]);return Array.from(new Set(n.length?n:t))},E={patient_registration_success:{templateName:"Patient Registration Success",subject:"Patient registration completed",body:"Dear {{patient_name}},\n\nWelcome to {{hospital_name}}.\n\nYour patient registration has been completed successfully.\n\nUHID: {{uhid}}\n\nRegistered On:\n{{registration_date}}\n\nFor assistance please contact:\n{{hospital_phone}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","hospital_name","uhid","registration_date","hospital_phone"]},appointment_booked:{templateName:"Appointment Booked",subject:"Appointment confirmed",body:"Dear {{patient_name}},\n\nYour appointment has been confirmed.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nAppointment No:\n{{appointment_number}}\n\nPlease arrive 15 minutes before your scheduled time.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","department","appointment_date","appointment_time","appointment_number","hospital_name"]},appointment_checked_in:{templateName:"Appointment Check-In",subject:"Appointment checked in",body:"Dear {{patient_name}},\n\nYou have successfully checked in.\n\nDoctor:\n{{doctor_name}}\n\nDepartment:\n{{department}}\n\nToken Number:\n{{token_number}}\n\nPlease wait for your consultation.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","department","token_number","hospital_name"]},vitals_completed:{templateName:"Vitals Completed",subject:"Vitals recorded",body:"Dear {{patient_name}},\n\nYour vitals have been recorded successfully.\n\nYou will be called shortly for consultation with:\n\nDr. {{doctor_name}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","hospital_name"]},consultation_completed:{templateName:"Consultation Completed",subject:"Consultation completed",body:"Dear {{patient_name}},\n\nYour consultation with\nDr. {{doctor_name}}\nhas been completed.\n\nDiagnosis:\n{{diagnosis_summary}}\n\nPrescription and investigation details are available at the hospital.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","diagnosis_summary","hospital_name"]},lab_test_ordered:{templateName:"Lab Test Ordered",subject:"Lab test ordered",body:"Dear {{patient_name}},\n\nYour doctor has requested the following laboratory investigations:\n\n{{lab_tests}}\n\nPlease proceed to the laboratory department.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},lab_sample_collected:{templateName:"Lab Sample Collected",subject:"Lab sample collected",body:"Dear {{patient_name}},\n\nYour laboratory sample has been collected successfully.\n\nTests:\n{{lab_tests}}\n\nYou will receive a notification once results are available.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},lab_report_ready:{templateName:"Lab Report Ready",subject:"Lab report ready",body:"Dear {{patient_name}},\n\nYour laboratory report is now available.\n\nTests:\n{{lab_tests}}\n\nPlease collect the report from the hospital or access it through the patient portal.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","lab_tests","hospital_name"]},prescription_generated:{templateName:"Prescription Generated",subject:"Prescription generated",body:"Dear {{patient_name}},\n\nYour prescription has been generated.\n\nDoctor:\n{{doctor_name}}\n\nMedicines:\n{{medicine_count}}\n\nPlease proceed to the pharmacy counter.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","medicine_count","hospital_name"]},medicines_dispensed:{templateName:"Medicines Dispensed",subject:"Medicines dispensed",body:"Dear {{patient_name}},\n\nYour medicines have been dispensed successfully.\n\nPrescription Number:\n{{prescription_number}}\n\nAmount:\n₹{{amount}}\n\nPlease follow the prescribed dosage instructions.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","prescription_number","amount","hospital_name"]},bill_generated:{templateName:"Bill Generated",subject:"Bill generated",body:"Dear {{patient_name}},\n\nInvoice generated successfully.\n\nInvoice Number:\n{{invoice_number}}\n\nAmount:\n₹{{amount}}\n\nDepartment:\n{{department}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","invoice_number","amount","department","hospital_name"]},payment_received:{templateName:"Payment Received",subject:"Payment received",body:"Dear {{patient_name}},\n\nPayment received successfully.\n\nAmount:\n₹{{amount}}\n\nPayment Mode:\n{{payment_mode}}\n\nReceipt Number:\n{{receipt_number}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","amount","payment_mode","receipt_number","hospital_name"]},ip_admission_confirmed:{templateName:"IP Admission Confirmed",subject:"Admission confirmed",body:"Dear {{patient_name}},\n\nYour admission has been confirmed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAdmission Date:\n{{admission_date}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","ward","room","bed","admission_date","hospital_name"]},bed_allocated:{templateName:"Bed Allocated",subject:"Bed allocated",body:"Dear {{patient_name}},\n\nYour bed allocation has been completed.\n\nWard:\n{{ward}}\n\nRoom:\n{{room}}\n\nBed:\n{{bed}}\n\nAllocation Time:\n{{allocation_time}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","ward","room","bed","allocation_time","hospital_name"]},patient_transferred:{templateName:"Patient Transferred",subject:"Patient transferred",body:"Dear {{patient_name}},\n\nYour ward/bed transfer has been recorded.\n\nFrom:\n{{from_location}}\n\nTo:\n{{to_location}}\n\nReason:\n{{reason}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","from_location","to_location","reason","hospital_name"]},discharge_initiated:{templateName:"Discharge Initiated",subject:"Discharge initiated",body:"Dear {{patient_name}},\n\nYour discharge process has been initiated.\n\nPlease complete billing and pharmacy formalities.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","hospital_name"]},discharge_completed:{templateName:"Discharge Completed",subject:"Discharge completed",body:"Dear {{patient_name}},\n\nYou have been discharged successfully.\n\nDischarge Date:\n{{discharge_date}}\n\nFollow-up Date:\n{{followup_date}}\n\nWe wish you a speedy recovery.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","discharge_date","followup_date","hospital_name"]},followup_reminder:{templateName:"Follow-Up Reminder",subject:"Follow-up reminder",body:"Dear {{patient_name}},\n\nThis is a reminder for your follow-up consultation.\n\nDoctor:\n{{doctor_name}}\n\nDate:\n{{appointment_date}}\n\nTime:\n{{appointment_time}}\n\nThank you,\n{{hospital_name}}",variables:["patient_name","doctor_name","appointment_date","appointment_time","hospital_name"]},payment_due_reminder:{templateName:"Payment Due Reminder",subject:"Payment due reminder",body:"Dear {{patient_name}},\n\nAn outstanding amount of ₹{{due_amount}} is pending.\n\nInvoice:\n{{invoice_number}}\n\nPlease contact the billing desk for assistance.\n\nThank you,\n{{hospital_name}}",variables:["patient_name","due_amount","invoice_number","hospital_name"]}};async function s(e,t,n){return(await i.prisma.$queryRawUnsafe(`
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
    `,e.tenantId,e.hospitalId,e.branchId,t,n))[0]||null}async function l(e,t,n){let a=E[t],o=a?.body||"Dear {{patient_name}}, {{message}} - {{hospital_name}}";return(await i.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_notification_templates (
      tenant_id,hospital_id,branch_id,template_key,channel,template_name,subject,body,variables,status,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,'ACTIVE',$10,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,t,n,a?.templateName||t.replace(/_/g," "),a?.subject||"TOTTECH Clinical Services",o,JSON.stringify(a?.variables||["patient_name","message","hospital_name"]),e.user.id??null))[0]}async function d(e,t,n,a,i,o){if("WHATSAPP"===e&&!["true","1","yes","enabled"].includes(b(process.env.CLINICAL_WHATSAPP_ENABLED||process.env.WHATSAPP_ENABLED).toLowerCase()))return{status:"QUEUED",provider:"whatsapp",reason:"WHATSAPP_ENABLED/CLINICAL_WHATSAPP_ENABLED is not true."};if("WHATSAPP"===e){let e=process.env.CLINICAL_WHATSAPP_API_KEY||process.env.INTERAKT_API_KEY||process.env.WHATSAPP_API_KEY,n=process.env.CLINICAL_WHATSAPP_BASE_URL||process.env.INTERAKT_BASE_URL||process.env.WHATSAPP_BASE_URL;if(!e||!n)return{status:"QUEUED",provider:"whatsapp",reason:"WhatsApp provider credentials are not configured."};try{let r,s,l,d=(s=(r=b(process.env.CLINICAL_WHATSAPP_DEFAULT_COUNTRY_CODE||process.env.WHATSAPP_DEFAULT_COUNTRY_CODE)||"+91").replace(/\D/g,""),l=t.replace(/\D/g,""),s&&l.startsWith(s)&&l.length>10&&(l=l.slice(s.length)),l=l.replace(/^0+/,""),{countryCode:r.startsWith("+")?r:`+${r}`,phoneNumber:l}),c=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Basic ${e}`},body:JSON.stringify({countryCode:d.countryCode,phoneNumber:d.phoneNumber,type:"Template",callbackData:JSON.stringify({source:"tottech_clinical_services",templateKey:a}).slice(0,512),template:{name:a,languageCode:process.env.CLINICAL_WHATSAPP_LANGUAGE||process.env.WHATSAPP_TEMPLATE_LANGUAGE||"en",bodyValues:o&&o.length?o:Object.values(i||{}).map(e=>b(e))}})}),p=await c.text(),m=null;try{m=JSON.parse(p)}catch{m=null}return{status:c.ok&&m?.result!==!1?"SENT":"QUEUED",provider:"whatsapp",httpStatus:c.status,response:p.slice(0,1e3),messageId:m?.id||null}}catch(e){return{status:"QUEUED",provider:"whatsapp",error:e instanceof Error?e.message:"WhatsApp dispatch failed."}}}return"SMS"===e&&"true"!==process.env.CLINICAL_SMS_ENABLED?{status:"QUEUED",provider:"sms",reason:"CLINICAL_SMS_ENABLED is not true."}:"EMAIL"===e&&"true"!==process.env.CLINICAL_EMAIL_ENABLED?{status:"QUEUED",provider:"email",reason:"CLINICAL_EMAIL_ENABLED is not true."}:{status:"SENT",provider:e.toLowerCase(),recipient:t,length:n.length,simulated:!0}}async function c(e,t){let n,r,c=await s(e,t.templateKey,t.channel)||await l(e,t.templateKey,t.channel),p=(n=b(c.body),r={...t.variables,hospital_name:e.hospitalName||e.branding.name,branch_name:e.branchName},n.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g,(e,t)=>b(r[t])||"-")),m=y(b(c.body),E[t.templateKey]?.variables||[]).map(n=>b({...t.variables,hospital_name:e.hospitalName||e.branding.name,branch_name:e.branchName}[n])),u=await d(t.channel,t.recipient,p,t.templateKey,t.variables,m),_="SENT"===u.status?"SENT":"QUEUED",h=await i.prisma.$queryRawUnsafe(`
    INSERT INTO clinical_notification_queue (
      tenant_id,hospital_id,branch_id,clinic_id,patient_id,appointment_id,invoice_id,
      source_module,source_record_id,channel,template_key,recipient,subject,message_body,payload,
      status,scheduled_at,sent_at,provider_response,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,COALESCE($17::timestamp,CURRENT_TIMESTAMP),
      CASE WHEN $16='SENT' THEN CURRENT_TIMESTAMP ELSE NULL END,$18::jsonb,$19,$19,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId??null,t.appointmentId??null,t.invoiceId??null,t.sourceModule??null,t.sourceRecordId??null,t.channel,t.templateKey,t.recipient,b(c.subject)||null,p,JSON.stringify(t.variables),_,t.scheduledAt??null,JSON.stringify(u),e.user.id??null);return await (0,a.recordClinicalAudit)(e,{moduleName:"clinical_notifications",action:"queue",entityType:"clinical_notification_queue",entityId:Number(h[0]?.id),summary:`${t.channel} notification ${_.toLowerCase()} for ${t.templateKey}`,payload:{channel:t.channel,templateKey:t.templateKey,status:_,sourceModule:t.sourceModule,sourceRecordId:t.sourceRecordId}}),t.patientId&&await (0,o.recordWorkflowEvent)(e,{patientId:t.patientId,appointmentId:t.appointmentId??null,workflowStage:"NOTIFICATION",status:_,summary:`${t.channel} ${_.toLowerCase()} for ${t.templateKey}.`,sourceTable:"clinical_notification_queue",sourceId:Number(h[0]?.id),metadata:{channel:t.channel,template_key:t.templateKey,recipient:t.recipient,source_module:t.sourceModule,source_record_id:t.sourceRecordId,provider_response:u}}),h[0]}async function p(e){for(let t of Object.keys(E))await l(e,t,"WHATSAPP").catch(async()=>null)}async function m(e,t){let n=(await i.prisma.$queryRawUnsafe(`
    SELECT *
    FROM clinical_notification_queue
    WHERE id=$1
      AND tenant_id=$2
      AND hospital_id=$3
      AND branch_id=$4
      AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,t,e.tenantId,e.hospitalId,e.branchId))[0];if(!n)return null;let a="string"==typeof n.payload?JSON.parse(String(n.payload||"{}")):n.payload||{},r=b(n.message_body),c=await s(e,b(n.template_key),b(n.channel))||await l(e,b(n.template_key),b(n.channel)),p=y(b(c.body),E[b(n.template_key)]?.variables||[]).map(e=>b(a[e])),m=await d(b(n.channel),b(n.recipient),r,b(n.template_key),a,p),u="SENT"===m.status?"SENT":"QUEUED",_=await i.prisma.$queryRawUnsafe(`
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
    `,t,e.tenantId,e.hospitalId,e.branchId,u,JSON.stringify(m),e.user.id??null);return n.patient_id&&await (0,o.recordWorkflowEvent)(e,{patientId:Number(n.patient_id),appointmentId:n.appointment_id?Number(n.appointment_id):null,workflowStage:"NOTIFICATION",status:u,summary:`${n.channel} retry ${u.toLowerCase()} for ${n.template_key}.`,sourceTable:"clinical_notification_queue",sourceId:t,metadata:{channel:n.channel,template_key:n.template_key,recipient:n.recipient,provider_response:m}}),_[0]||null}async function u(e,t){return(await i.prisma.$queryRawUnsafe(`
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
    `,t,e.tenantId,e.hospitalId,e.branchId))[0]||null}async function _(e,t){let n=await i.prisma.$queryRawUnsafe(`
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
    `,e.tenantId,e.hospitalId,e.branchId,t.appointmentId??null,t.patientId??null);return b(n[0]?.doctor_name)||"Assigned Doctor"}async function h(e,t){var n;let a;if(!t.patientId&&!t.recipient)return null;let i=t.patientId?await u(e,t.patientId):null,o=b(t.recipient||i?.whatsapp_number||i?.phone||i?.alternate_mobile);if(!o)return null;let r=(n=t.variables?.doctor_name,!(a=b(n))||/^doctor( #\d+)?$/i.test(a)||/^assigned doctor$/i.test(a))?await _(e,{appointmentId:t.appointmentId??null,patientId:t.patientId??null}):b(t.variables?.doctor_name);return c(e,{channel:"WHATSAPP",templateKey:t.templateKey,recipient:o,patientId:t.patientId??null,appointmentId:t.appointmentId??null,invoiceId:t.invoiceId??null,sourceModule:t.sourceModule,sourceRecordId:t.sourceRecordId,variables:{patient_name:i?.patient_name||"Patient",uhid:i?.uhid||i?.patient_uid||"-",hospital_name:e.hospitalName||e.branding.name,hospital_phone:"-",...t.variables,doctor_name:r||"Assigned Doctor"}})}e.s(["clinicalNotificationDefaults",0,E,"ensureClinicalNotificationTemplates",0,p,"queueClinicalNotification",0,c,"queueClinicalWorkflowNotification",0,h,"retryClinicalNotification",0,m]),n()}catch(e){n(e)}},!1),57446,e=>e.a(async(t,n)=>{try{var a=e.i(780907),i=e.i(679504),o=e.i(15270),r=t([a,i,o]);[a,i,o]=r.then?(await r)():r;let u=e=>String(e??"").trim(),_=e=>{let t=Number(e);return Number.isFinite(t)?t:0},h={consultations:{itemType:"CONSULTATION",description:"Consultation Fee",rate:500,eventType:"Consultation Completed"},laboratory:{itemType:"LAB",description:"Lab Charges",rate:0,eventType:"Lab Order Released"},radiology:{itemType:"RADIOLOGY",description:"Radiology Charges",rate:1200,eventType:"Radiology Order Released"},pharmacy:{itemType:"PHARMACY",description:"Pharmacy Charges",rate:0,eventType:"Medicine Dispensed"},ipd:{itemType:"ADMISSION",description:"Admission Charges",rate:1500,eventType:"Admission"},"bed-management":{itemType:"BED",description:"Bed Charges",rate:1e3,eventType:"Bed Allocation"},ot:{itemType:"OT",description:"OT Charges",rate:5e3,eventType:"OT Procedure"},icu:{itemType:"ICU",description:"ICU Charges",rate:3e3,eventType:"ICU Admission"},ivf:{itemType:"IVF",description:"IVF Package Charges",rate:25e3,eventType:"IVF Procedure"}};async function s(e,t){return t.patientId&&(await o.prisma.$queryRawUnsafe(`
    INSERT INTO patient_timeline_events (
      patient_id,
      event_type,
      event_source,
      source_record_id,
      title,
      description,
      event_datetime,
      created_by,
      tenant_id,
      hospital_id,
      branch_id
    )
	    VALUES ($1::int,$2::varchar,$3::varchar,$4::int,$5::text,$6::text,COALESCE($7::timestamp,CURRENT_TIMESTAMP),$8::int,$9::int,$10::int,$11::int)
    ON CONFLICT ON CONSTRAINT patient_timeline_events_pkey DO NOTHING
    RETURNING *
    `,t.patientId,t.eventType,t.eventSource,t.sourceRecordId??null,t.title,t.description??null,t.eventDatetime??null,e.user.id??null,e.tenantId,e.hospitalId,e.branchId).catch(async()=>o.prisma.$queryRawUnsafe(`
      INSERT INTO patient_timeline_events (
        patient_id,
        event_type,
        event_source,
        source_record_id,
        title,
        description,
        event_datetime,
        created_by,
        tenant_id,
        hospital_id,
        branch_id
      )
	      SELECT $1::int,$2::varchar,$3::varchar,$4::int,$5::text,$6::text,COALESCE($7::timestamp,CURRENT_TIMESTAMP),$8::int,$9::int,$10::int,$11::int
      WHERE NOT EXISTS (
        SELECT 1 FROM patient_timeline_events
	        WHERE tenant_id=$9::int
	          AND hospital_id=$10::int
	          AND branch_id=$11::int
	          AND event_source=$3::varchar
	          AND source_record_id IS NOT DISTINCT FROM $4::int
	          AND event_type=$2::varchar
          AND COALESCE(is_deleted,false)=false
      )
      RETURNING *
      `,t.patientId,t.eventType,t.eventSource,t.sourceRecordId??null,t.title,t.description??null,t.eventDatetime??null,e.user.id??null,e.tenantId,e.hospitalId,e.branchId)))[0]||null}async function l(e,t,n,a){let i=await o.prisma.$queryRawUnsafe(`
    SELECT *
    FROM billing_invoices
    WHERE tenant_id=$1::int
      AND hospital_id=$2::int
      AND branch_id=$3::int
      AND patient_id=$4::int
      AND status IN ('DRAFT','OPEN','PARTIAL')
      AND COALESCE(is_deleted,false)=false
    ORDER BY created_at DESC
    LIMIT 1
    `,e.tenantId,e.hospitalId,e.branchId,t);if(i[0])return i[0];let r=`INV-${Date.now()}-${Math.floor(9e3*Math.random()+1e3)}`;return(await o.prisma.$queryRawUnsafe(`
    INSERT INTO billing_invoices (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      invoice_number,
      patient_id,
      invoice_date,
      status,
      subtotal,
      discount,
      tax,
      total,
      paid_amount,
      balance_amount,
      balance,
      invoice_type,
      source_module,
      source_record_id,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1::int,$2::int,$3::int,$4::int,$5::varchar,$6::int,CURRENT_DATE,'OPEN',0,0,0,0,0,0,0,'PATIENT',$7::varchar,$8::int,$9::int,$9::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,r,t,n,a,e.user.id??null))[0]}async function d(e,t){let n=h[t.moduleKey];if(!n||!t.patientId)return null;let a=await l(e,t.patientId,t.moduleKey,t.sourceRecordId),r=t.quantity||1,d=t.amount??("pharmacy"===t.moduleKey?0:n.rate);if("laboratory"===t.moduleKey&&(!Number.isFinite(d)||d<=0))throw Error("Lab billing amount must come from Lab Test Master and must be greater than zero.");let p=r*d;return(await o.prisma.$queryRawUnsafe(`
    SELECT id FROM billing_invoice_items
    WHERE invoice_id=$1::int
      AND item_type=$2::varchar
      AND item_reference_id=$3::int
      AND COALESCE(is_deleted,false)=false
    LIMIT 1
    `,a.id,n.itemType,t.sourceRecordId))[0]||await o.prisma.$executeRawUnsafe(`
      INSERT INTO billing_invoice_items (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        invoice_id,
        item_type,
        item_reference_id,
        item_description,
        item_name,
        quantity,
        rate,
        discount,
        tax,
        amount,
        total,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1::int,$2::int,$3::int,$4::int,$5::int,$6::varchar,$7::int,$8::text,$8::text,$9::numeric,$10::numeric,0,0,$11::numeric,$11::numeric,$12::int,$12::int,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,a.id,n.itemType,t.sourceRecordId,t.description||n.description,r,d,p,e.user.id??null),await c(a.id),await s(e,{patientId:t.patientId,eventType:"Billing Events",eventSource:"billing_invoice_items",sourceRecordId:t.sourceRecordId,title:`${n.description} added to invoice`,description:`Invoice ${a.invoice_number||a.id} updated with ${t.description||n.description}.`}),await (0,i.queueClinicalWorkflowNotification)(e,{templateKey:"bill_generated",patientId:t.patientId,invoiceId:Number(a.id),sourceModule:"billing_invoice_items",sourceRecordId:t.sourceRecordId,variables:{invoice_number:a.invoice_number||a.id,amount:p,department:t.moduleKey}}).catch(()=>null),a}async function c(e){let t=Number(e);if(!Number.isFinite(t))return;let n=await o.prisma.$queryRawUnsafe(`
    SELECT
      COALESCE(SUM(amount),0)::numeric AS subtotal,
      COALESCE(SUM(discount),0)::numeric AS discount,
      COALESCE(SUM(tax),0)::numeric AS tax,
      COALESCE(SUM(total),0)::numeric AS total
    FROM billing_invoice_items
    WHERE invoice_id=$1::int
      AND COALESCE(is_deleted,false)=false
    `,t),a=_(n[0]?.total),i=await o.prisma.$queryRawUnsafe(`
    SELECT COALESCE(SUM(amount),0)::numeric AS paid
    FROM payments
    WHERE invoice_id=$1::int
      AND COALESCE(is_deleted,false)=false
    `,t),r=_(i[0]?.paid),s=Math.max(a-r,0);await o.prisma.$executeRawUnsafe(`
    UPDATE billing_invoices
    SET subtotal=$2::numeric,
        discount=$3::numeric,
        tax=$4::numeric,
        total=$5::numeric,
        paid_amount=$6::numeric,
        balance_amount=$7::numeric,
        balance=$7::numeric,
        status=CASE
          WHEN $5::numeric = 0 THEN 'OPEN'
          WHEN $7::numeric <= 0 THEN 'PAID'
          WHEN $6::numeric > 0 THEN 'PARTIAL'
          ELSE 'OPEN'
        END,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
    `,t,_(n[0]?.subtotal),_(n[0]?.discount),_(n[0]?.tax),a,r,s)}async function p(e,t){let n=await o.prisma.$queryRawUnsafe(`
    INSERT INTO document_repository (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      patient_id,
      document_type,
      document_title,
      source_module,
      source_record_id,
      version,
      file_name,
      file_url,
      content_type,
      generated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,1,$10,$11,$12,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,t.patientId??null,t.documentType,t.title,t.sourceModule??null,t.sourceRecordId??null,t.fileName??null,t.fileUrl??null,t.contentType??"application/pdf",e.user.id??null);await s(e,{patientId:t.patientId??null,eventType:"Documents Generated",eventSource:"document_repository",sourceRecordId:Number(n[0]?.id),title:`${t.documentType}: ${t.title}`,description:t.fileName||t.fileUrl||null}),await (0,a.recordClinicalAudit)(e,{moduleName:"document_repository",action:"create",entityType:"document_repository",entityId:Number(n[0]?.id),summary:`${t.documentType} document registered`,payload:t});let i=Number(n[0]?.id);return Number.isFinite(i)&&await o.prisma.$executeRawUnsafe(`
      INSERT INTO clinical_document_verifications (
        tenant_id,
        hospital_id,
        branch_id,
        document_id,
        document_type,
        source_module,
        source_record_id,
        verification_token,
        verification_status,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'VALID',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      ON CONFLICT (verification_token) DO NOTHING
      `,e.tenantId,e.hospitalId,e.branchId,i,t.documentType,t.sourceModule??null,t.sourceRecordId??null,`DOC-${i}-${e.tenantId}-${e.hospitalId}-${e.branchId}`).catch(()=>{}),n[0]}async function m(e,t){let n=Number(t.record.patient_id||t.body.patient_id),a=Number(t.record.id);if(!Number.isFinite(a))return;let i=h[t.moduleKey],o=i?.eventType||({nursing:"Vitals","bed-management":"Bed Transfers"})[t.moduleKey]||"Clinical Event";await s(e,{patientId:Number.isFinite(n)?n:null,eventType:o,eventSource:t.moduleKey,sourceRecordId:a,title:u(t.record.title)||`${t.moduleKey} record saved`,description:u(t.body.notes)||u(t.body.clinical_notes)||u(t.body.admission_reason)||u(t.body.findings)||u(t.body.critical_notes)||null}),await d(e,{moduleKey:t.moduleKey,patientId:Number.isFinite(n)?n:null,sourceRecordId:a,description:i?.description,amount:"pharmacy"===t.moduleKey?100*_(t.body.quantity):"ivf"===t.moduleKey&&_(t.body.package_billing)||void 0})}e.s(["createBillingItemForWorkflow",0,d,"createDocumentRecord",0,p,"createPatientTimelineEvent",0,s,"recalculateInvoice",0,c,"recordWorkflowSpineEffects",0,m]),n()}catch(e){n(e)}},!1)];

//# sourceMappingURL=lib_clinical_0jd2wkg._.js.map