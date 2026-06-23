module.exports=[261113,e=>e.a(async(t,a)=>{try{var i=e.i(15270),n=t([i]);[i]=n.then?(await n)():n;let _=[/chest pain/i,/severe breath/i,/not breathing/i,/stroke/i,/face droop/i,/unconscious/i,/seizure/i,/severe bleeding/i,/bp\s*(?:is|=)?\s*(?:1[8-9]\d|2\d\d|3\d\d)\s*\/\s*\d+/i,/spo2\s*(?:is|=)?\s*(?:[0-8]\d|9[0-1])\b/i],m=(e,t="")=>String(e??t).trim(),h=e=>{let t=Number(e);return Number.isFinite(t)?t:null},E=async(e,...t)=>{try{return await i.prisma.$queryRawUnsafe(e,...t)}catch(e){return console.error("[medical-ai] query failed",e),[]}};function s(e){return Array.from(new Set(e.toLowerCase().replace(/[^a-z0-9\s/-]/g," ").split(/\s+/).filter(e=>e.length>=3).slice(0,10)))}function r(e){let t=e.match(/\b([1-2]?\d{2})\s*\/\s*(\d{2,3})\b/);if(!t)return null;let a=Number(t[1]),i=Number(t[2]);return Number.isFinite(a)&&Number.isFinite(i)?{systolic:a,diastolic:i,formatted:`${a}/${i}`}:null}async function o(e,t,a){if(a)return(await E(`
      SELECT id, patient_uid, uhid, first_name, middle_name, last_name, gender,
             age_years, date_of_birth, phone, whatsapp_number, abha_id, address,
             blood_group, allergies, medical_history, insurance_provider
      FROM patients
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND id=$4 AND COALESCE(is_deleted,false)=false
      LIMIT 1
      `,e.tenantId,e.hospitalId,e.branchId,a))[0]||null;let i=(t.match(/(?:\+?91[-\s]?)?[6-9]\d{9}/)?.[0]||"").replace(/\D/g,"").slice(-10),n=s(t),r=n.length>0?`%${n.slice(0,3).join("%")}%`:"";return(await E(`
    SELECT id, patient_uid, uhid, first_name, middle_name, last_name, gender,
           age_years, date_of_birth, phone, whatsapp_number, abha_id, address,
           blood_group, allergies, medical_history, insurance_provider
    FROM patients
    WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
      AND COALESCE(is_deleted,false)=false
      AND (
        ($4::text <> '' AND regexp_replace(COALESCE(phone, whatsapp_number, ''), '\\D', '', 'g') LIKE '%' || $4::text || '%')
        OR ($5::text <> '' AND (
          LOWER(COALESCE(uhid, patient_uid, '')) LIKE LOWER($5::text)
          OR LOWER(CONCAT_WS(' ', first_name, middle_name, last_name)) LIKE LOWER($5::text)
          OR LOWER(COALESCE(abha_id, '')) LIKE LOWER($5::text)
        ))
      )
    ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
    LIMIT 1
    `,e.tenantId,e.hospitalId,e.branchId,i,r))[0]||null}async function l(e,t){if(!t)return{vitals:[],appointments:[],consultations:[],prescriptions:[],labResults:[],radiologyReports:[],timeline:[],invoices:[],payments:[]};let[a,i,n,s,r,o,l,d,c]=await Promise.all([E(`
      SELECT blood_pressure, systolic_bp, diastolic_bp, weight, height, bmi,
             temperature, spo2, pulse, respiration, notes, created_at
      FROM clinical_vitals
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 12
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT a.id, a.appointment_uid, a.appointment_date, a.start_time,
             a.status, a.queue_status, a.reason, d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.tenant_id=$1 AND a.hospital_id=$2 AND a.branch_id=$3
        AND a.patient_id=$4 AND COALESCE(a.is_deleted,false)=false
      ORDER BY a.appointment_date DESC, a.start_time DESC NULLS LAST
      LIMIT 10
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT c.id, c.consultation_uid, c.consultation_date, c.status,
             c.chief_complaint, c.symptoms, c.diagnosis_summary,
             c.clinical_notes, c.follow_up_date, d.full_name AS doctor_name
      FROM consultations c
      LEFT JOIN doctors d ON d.id = c.doctor_id
      WHERE c.tenant_id=$1 AND c.hospital_id=$2 AND c.branch_id=$3
        AND c.patient_id=$4 AND COALESCE(c.is_deleted,false)=false
      ORDER BY c.consultation_date DESC
      LIMIT 8
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT prescription_uid, medications, instructions, diagnosis, advice,
             follow_up_date, pharmacy_status, created_at
      FROM prescriptions
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 8
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT lo.order_uid, lo.status AS order_status, lo.ordered_at,
             COALESCE(lt.lab_test_name, lt.test_name, lo.order_type) AS test_name,
             COALESCE(lr.result_status, lr.status) AS result_status,
             lr.result_value, lr.result_data, lr.interpretation,
             lr.critical_value, lr.validated_at, lr.created_at AS result_date
      FROM lab_orders lo
      LEFT JOIN clinical_lab_test_master lt ON lt.id = lo.lab_test_id
      LEFT JOIN lab_results lr ON lr.lab_order_id = lo.id AND COALESCE(lr.is_deleted,false)=false
      WHERE lo.tenant_id=$1 AND lo.hospital_id=$2 AND lo.branch_id=$3
        AND lo.patient_id=$4 AND COALESCE(lo.is_deleted,false)=false
      ORDER BY COALESCE(lr.created_at, lo.ordered_at) DESC
      LIMIT 12
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT ro.order_number, ro.study_type, ro.order_status, ro.order_date,
             rr.report_number, rr.findings, rr.impression, rr.recommendation,
             rr.status AS report_status, rr.study_date
      FROM radiology_orders ro
      LEFT JOIN radiology_reports rr ON rr.order_id = ro.id AND COALESCE(rr.is_deleted,false)=false
      WHERE ro.tenant_id=$1 AND ro.hospital_id=$2 AND ro.branch_id=$3
        AND ro.patient_id=$4 AND COALESCE(ro.is_deleted,false)=false
      ORDER BY COALESCE(rr.created_at, ro.created_at) DESC
      LIMIT 8
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT event_type, event_source, title, description, event_datetime
      FROM patient_timeline_events
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY event_datetime DESC
      LIMIT 20
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT invoice_number, invoice_date, total, paid_amount, balance_amount,
             status, source_module
      FROM billing_invoices
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY created_at DESC
      LIMIT 10
      `,e.tenantId,e.hospitalId,e.branchId,t),E(`
      SELECT payment_number, amount, method, payment_date, status
      FROM billing_payments
      WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
        AND patient_id=$4 AND COALESCE(is_deleted,false)=false
      ORDER BY payment_date DESC
      LIMIT 10
      `,e.tenantId,e.hospitalId,e.branchId,t)]);return{vitals:a,appointments:i,consultations:n,prescriptions:s,labResults:r,radiologyReports:o,timeline:l,invoices:d,payments:c}}async function d(e){let[t,a,i,n]=await Promise.all([E(`
        SELECT
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE)::int AS appointments_today,
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND queue_status IN ('WAITING','CHECKED_IN','WAITING_FOR_VITALS','WAITING_FOR_DOCTOR'))::int AS waiting_patients,
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND status IN ('CONSULTATION_COMPLETED','COMPLETED'))::int AS consulted_today
        FROM appointments
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,e.tenantId,e.hospitalId,e.branchId),E(`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('PRESCRIBED','ORDERED','BILL_GENERATED','BILL_PAID','SAMPLE_COLLECTED','PROCESSING'))::int AS pending_tests,
          COUNT(*) FILTER (WHERE critical_value = true)::int AS critical_orders
        FROM lab_orders
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,e.tenantId,e.hospitalId,e.branchId),E(`
        SELECT
          COUNT(*) FILTER (WHERE status='ACTIVE')::int AS active_medicines,
          COUNT(*) FILTER (WHERE COALESCE(reorder_level,0) >= 0)::int AS tracked_medicines
        FROM pharmacy_medicines
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,e.tenantId,e.hospitalId,e.branchId),E(`
        SELECT
          COALESCE(SUM(total) FILTER (WHERE invoice_date = CURRENT_DATE),0)::numeric AS revenue_today,
          COALESCE(SUM(total) FILTER (WHERE date_trunc('month', invoice_date) = date_trunc('month', CURRENT_DATE)),0)::numeric AS revenue_month,
          COALESCE(SUM(balance_amount),0)::numeric AS outstanding
        FROM billing_invoices
        WHERE tenant_id=$1 AND hospital_id=$2 AND branch_id=$3
          AND COALESCE(is_deleted,false)=false
        `,e.tenantId,e.hospitalId,e.branchId)]);return{dashboard:t[0]||{},lab:a[0]||{},pharmacy:i[0]||{},revenue:n[0]||{}}}async function c(e,t){let a=s(e),i=a.length>0?`%${a.join("%")}%`:`%${t}%`;return E(`
    SELECT id, title, category, specialty, source, source_url,
           content, keywords, citations, confidence_score
    FROM clinical_medical_knowledge_documents
    WHERE COALESCE(is_deleted,false)=false
      AND status='ACTIVE'
      AND (
        LOWER(title || ' ' || content || ' ' || COALESCE(specialty,'')) LIKE LOWER($1)
        OR category = $2
      )
    ORDER BY confidence_score DESC, updated_at DESC
    LIMIT 5
    `,i,"diagnostics"===t?"lab_tests":"prescription_assistance"===t?"drugs":"research"===t?"research_papers":"guidelines")}function u(e,t,a="No records found."){return e.length?e.map((e,a)=>t(e,a)).join("\n"):a}async function p({context:e,prompt:t,patientId:a,audience:i}){let n,s=function(e,t){let a=m(t).toLowerCase();if(a)return a;let i=`${e.roleKey} ${e.roleName}`.toLowerCase();return i.includes("doctor")?"doctor":i.includes("nurse")?"nurse":i.includes("lab")?"lab_staff":i.includes("pharmac")?"pharmacist":i.includes("patient")?"patient":i.includes("admin")||i.includes("owner")||i.includes("finance")||i.includes("cfo")||i.includes("ceo")?"hospital_admin":"clinical_user"}(e,i),E=(n=t.toLowerCase(),/summary|history|last .*visits|allerg|diagnos|medications|lab results|patient record/.test(n)?"patient_summary":/bp trend|blood pressure trend|vitals|spo2|weight trend|sugar.*improv|compare current/.test(n)?"vitals_trends":/\bbp\b|blood pressure|is it normal|normal range/.test(n)?"patient_education":/prescription|medicine|dosage|dose|drug interaction|alternative medication|pregnancy safe/.test(n)?"prescription_assistance":/lab|cbc|report|abnormal|critical|diagnostic|x-ray|mri|ct|ultrasound|radiology/.test(n)?"diagnostics":/appointment|waiting|follow-up|consulted today|revenue|opd load|stock shortage|productivity/.test(n)?"operations":/soap|consultation note|discharge summary|referral letter|medical certificate|conversation/.test(n)?"clinical_documentation":/pubmed|research|systematic review|meta-analysis|thesis|dissertation|citation|literature review/.test(n)?"research":/explain|simple language|telugu|what does|what causes|avoid|side effects|missed a dose/.test(n)?"patient_education":"general_medical"),g=await o(e,t,a),f=h(g?.id)||null,[R,y,A]=await Promise.all([l(e,f),d(e),c(t,E)]),b=[..._.filter(e=>e.test(t)).map(()=>"Emergency/urgent-symptom language detected; advise immediate clinical review."),...r(t)&&(r(t).systolic>=160||r(t).diastolic>=100)?["Blood pressure reading is significantly elevated; doctor review is recommended."]:[],...function(e){let t=e[0];if(!t)return[];let a=[],i=h(t.systolic_bp),n=h(t.diastolic_bp),s=h(t.spo2),r=h(t.temperature);return null!==i&&null!==n&&(i>=180||n>=120?a.push("Hypertensive crisis range: immediate clinician review required."):(i>=160||n>=100)&&a.push("Blood pressure is significantly elevated; clinician review recommended.")),null!==s&&s<92&&a.push("SpO2 is low; urgent clinical assessment may be required."),null!==r&&r>=103&&a.push("High fever range; clinician review recommended."),a}(R.vitals)],C=Array.from(new Set(b)),$=function(e){let{prompt:t,audience:a,intent:i,patient:n,patientContext:s,operations:o,knowledge:l,safetyFlags:d}=e,c=n?m([n.first_name,n.middle_name,n.last_name].filter(Boolean).join(" "))||"Unnamed patient":"No patient selected",p=s.vitals[0]||null,_=s.labResults.slice(0,5),h=s.prescriptions[0]||null,E=l[0]?.content?m(l[0].content):"",g=[];if(g.push("Summary"),d.length&&g.push(`Safety alert: ${d.join(" ")}`),"operations"===i){let e=o.dashboard,t=o.revenue,a=o.lab,i=o.pharmacy;g.push(`Appointments today: ${e.appointments_today??0}
Waiting patients: ${e.waiting_patients??0}
Consulted today: ${e.consulted_today??0}
Pending lab tests: ${a.pending_tests??0}
Critical lab orders flagged: ${a.critical_orders??0}
Revenue today: ₹${t.revenue_today??0}
Monthly revenue: ₹${t.revenue_month??0}
Outstanding amount: ₹${t.outstanding??0}
Active medicines: ${i.active_medicines??0}`)}else if("vitals_trends"===i)g.push(n?`Patient: ${c} (${m(n.uhid||n.patient_uid)})`:"No patient was resolved from the prompt. Add patient name, mobile, UHID, or pass patientId."),g.push("Clinical Interpretation"),g.push(u(s.vitals,e=>`${new Date(m(e.created_at)).toLocaleString()}: BP ${m(e.blood_pressure,"-")}, Pulse ${m(e.pulse,"-")}, SpO2 ${m(e.spo2,"-")}, Temp ${m(e.temperature,"-")}, Weight ${m(e.weight,"-")}, BMI ${m(e.bmi,"-")}`,"No vitals found for this patient."));else if("patient_summary"===i)g.push(n?`Patient: ${c} | UHID: ${m(n.uhid||n.patient_uid,"-")} | Age/Gender: ${m(n.age_years,"-")}/${m(n.gender,"-")} | Mobile: ${m(n.phone||n.whatsapp_number,"-")}`:"No patient was resolved from the prompt. Add patient name, mobile, UHID, or pass patientId."),g.push("Clinical Interpretation"),g.push([`Allergies: ${m(n?.allergies,"No allergy recorded.")}`,`Medical history: ${m(n?.medical_history,"No medical history recorded.")}`,p?`Latest vitals: BP ${m(p.blood_pressure,"-")}, Pulse ${m(p.pulse,"-")}, SpO2 ${m(p.spo2,"-")}, Temp ${m(p.temperature,"-")}`:"Latest vitals: No vitals recorded.",h?`Latest prescription: ${m(h.prescription_uid)} | Pharmacy status ${m(h.pharmacy_status)}`:"Latest prescription: No prescription found."].join("\n")),g.push("Latest Lab Results"),g.push(u(_,e=>`${m(e.test_name,"Lab test")}: ${m(e.result_value||e.result_data,"No value")} | Status: ${m(e.result_status||e.order_status,"-")} | Critical: ${m(e.critical_value,"false")}`,"No lab results found.")),g.push("Recent Visits"),g.push(u(s.appointments.slice(0,5),e=>`${m(e.appointment_date)} ${m(e.start_time)} - ${m(e.doctor_name,"Doctor")} - ${m(e.status)} / ${m(e.queue_status)}`,"No visits found."));else if("prescription_assistance"===i)g.push("Clinical Interpretation"),g.push(n?`Use the patient context before prescribing: allergies = ${m(n.allergies,"not recorded")}; latest diagnosis = ${m(s.consultations[0]?.diagnosis_summary,"not recorded")}.`:"No patient context was resolved. Prescription drafts require clinician review and patient-specific allergy, pregnancy, renal, hepatic, and interaction checks."),g.push("Recommendations"),g.push("I can draft a prescription structure, check the patient's current medicines in the record, and flag interaction/allergy review needs. I will not independently prescribe. A licensed doctor must confirm medicine, dose, route, frequency, duration, and instructions.");else if("diagnostics"===i)g.push("Clinical Interpretation"),g.push(n?`For ${c}, latest diagnostic records are listed below. Doctor review should use released reports, symptoms, vitals, and previous values together.`:"No patient was resolved. I can still explain lab/radiology concepts, but patient-specific interpretation needs UHID/mobile/name."),g.push("Lab / Diagnostic Findings"),g.push(u(_,e=>`${m(e.test_name,"Lab test")}: ${m(e.result_value||e.result_data,"No value")} | Interpretation: ${m(e.interpretation,"-")} | Status: ${m(e.result_status||e.order_status,"-")} | Critical: ${m(e.critical_value,"false")}`,"No lab result records found.")),g.push(u(s.radiologyReports.slice(0,5),e=>`${m(e.study_type,"Study")}: ${m(e.impression||e.findings,"No report text")} | Status: ${m(e.report_status||e.order_status,"-")}`,"No radiology reports found."));else if("clinical_documentation"===i)g.push("Recommendations"),g.push(`SOAP note draft:
S: ${m(s.consultations[0]?.chief_complaint,"Chief complaint not recorded.")}
O: ${p?`BP ${m(p.blood_pressure,"-")}, Pulse ${m(p.pulse,"-")}, SpO2 ${m(p.spo2,"-")}, Temp ${m(p.temperature,"-")}`:"Vitals not recorded."}
A: ${m(s.consultations[0]?.diagnosis_summary,"Assessment/diagnosis not recorded.")}
P: ${m(s.consultations[0]?.clinical_notes||s.prescriptions[0]?.instructions,"Plan not recorded.")}`);else if("research"===i)g.push("Evidence"),g.push("Live PubMed/ClinicalTrials retrieval is not configured in this deployment yet. RAG tables are available for PubMed, guidelines, research papers, thesis material, ICD/SNOMED, drugs, diseases, and lab tests. Insufficient live evidence found for a current literature answer."),g.push("Recommendations"),g.push("Enable the external medical RAG ingestion job and provider keys before using this for current research summaries, systematic review comparison, or thesis citations.");else if("patient_education"===i){g.push("Clinical Interpretation");let e=r(t);if(e){let t=e.systolic>=140||e.diastolic>=90,a=e.systolic>=180||e.diastolic>=120;g.push(t?`No. A blood pressure reading of ${e.formatted} mmHg is above the usual normal range. ${a?"This is in a very high range and should be treated as urgent, especially with symptoms.":"It should be reviewed by your doctor, especially if repeated or associated with symptoms."}`:`A blood pressure reading of ${e.formatted} mmHg is not in the high range by usual adult thresholds, but interpretation depends on age, pregnancy status, symptoms, medicines, and previous readings.`),g.push(E||"Trend comparison with previous readings is clinically useful.")}else g.push(E||"I can explain medical reports and medicines in simple language when patient-specific records or relevant knowledge documents are available.");g.push("Recommendations"),g.push("For urgent symptoms, abnormal vitals, severe pain, breathlessness, fainting, stroke signs, pregnancy warning symptoms, or worsening condition, contact the hospital or emergency service immediately.")}else g.push("Clinical Interpretation"),g.push(E||"I can answer doctor, nurse, lab, pharmacy, patient, research, and hospital operations questions using hospital records and the medical knowledge base. Add patient name, UHID, mobile number, or patientId for patient-specific answers.");return g.push("Evidence"),g.push([n?`Hospital data: patient record, vitals (${s.vitals.length}), visits (${s.appointments.length}), consultations (${s.consultations.length}), lab records (${s.labResults.length}), prescriptions (${s.prescriptions.length}).`:"Hospital data: no patient-specific record selected.",l.length?`Knowledge retrieved: ${l.map(e=>m(e.title)).join("; ")}.`:"Knowledge retrieved: none matching the query."].join("\n")),g.push("Recommendations"),"patient"===a||"patient_education"===i?g.push("This explanation is educational and does not replace medical care. Please consult your doctor before changing medicines or treatment."):g.push("Clinical review required. Use this as decision support only; confirm diagnosis, orders, dose, and treatment plan as a licensed clinician."),g.push("References"),g.push(l.length?l.map((e,t)=>`${t+1}. ${m(e.title)} — ${m(e.source)}${e.source_url?` (${m(e.source_url)})`:""}`).join("\n"):"No external/current literature reference retrieved in this deployment."),g.join("\n\n")}({context:e,prompt:t,audience:s,intent:E,patient:g,patientContext:R,operations:y,knowledge:A,safetyFlags:C}),I=new Set(["Hospital ERP Records","Patient 360 Timeline","Clinical Medical Knowledge Base"]);A.forEach(e=>I.add(m(e.source)));let N=Math.max(45,Math.min(92,55+15*!!f+Math.min(5*A.length,15)+10*("operations"===E)-20*("research"===E)));return{answer:$,confidenceScore:N,dataSourcesUsed:Array.from(I),reasoningSummary:"Answered using tenant-isolated hospital records first, then local medical knowledge documents. Live external PubMed/guideline retrieval is RAG-ready but not enabled in this deployment.",metadata:{audience:s,intent:E,patientId:f,safetyFlags:C,retrievedKnowledge:A.map(e=>({id:Number(e.id),title:m(e.title),category:m(e.category),source:m(e.source),confidenceScore:Number(e.confidence_score)||0})),hospitalRecordSummary:{patientResolved:!!f,vitals:R.vitals.length,appointments:R.appointments.length,consultations:R.consultations.length,prescriptions:R.prescriptions.length,labResults:R.labResults.length,radiologyReports:R.radiologyReports.length,timelineEvents:R.timeline.length},providerMode:"deterministic_rag"}}}e.s(["answerMedicalAIQuestion",0,p]),a()}catch(e){a(e)}},!1),32463,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),s=e.i(261113),r=e.i(15270),o=t([n,s,r]);async function l(e){let t=await (0,n.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context,o=await e.json(),l=String(o.prompt||"").trim();if(!l)return i.NextResponse.json({error:"Ask a clinical question first."},{status:400});let d=await (0,s.answerMedicalAIQuestion)({context:a,prompt:l,patientId:o.patientId??o.patient_id??null,audience:o.audience??o.mode??null}),c=await r.prisma.$queryRawUnsafe(`
      INSERT INTO clinical_ai_logs (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        user_id,
        prompt,
        answer,
        confidence_score,
        data_sources,
        reasoning_summary,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11::jsonb,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING id
      `,a.tenantId,a.clinicId,a.hospitalId,a.branchId,a.user.id??null,l,d.answer,d.confidenceScore,JSON.stringify(d.dataSourcesUsed),d.reasoningSummary,JSON.stringify({...d.metadata,model:"MedGPT Clinical RAG",safety:"Clinical review required. AI must not independently diagnose or prescribe."})),u=Number(c[0]?.id)||null;return await r.prisma.$executeRawUnsafe(`
    INSERT INTO clinical_medical_ai_retrievals (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      ai_log_id,
      query,
      audience,
      intent,
      retrieved_documents,
      hospital_records,
      safety_flags,
      created_by,
      created_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12,CURRENT_TIMESTAMP,false)
    `,a.tenantId,a.hospitalId,a.branchId,a.clinicId,u,l,d.metadata.audience,d.metadata.intent,JSON.stringify(d.metadata.retrievedKnowledge),JSON.stringify(d.metadata.hospitalRecordSummary),JSON.stringify(d.metadata.safetyFlags),a.user.id??null),await (0,n.recordClinicalAudit)(a,{moduleName:"ai",action:"ask_medical_gpt",entityType:"clinical_ai_log",entityId:u,summary:"MedGPT Clinical answered a role-aware question",payload:{confidenceScore:d.confidenceScore,dataSourcesUsed:d.dataSourcesUsed,audience:d.metadata.audience,intent:d.metadata.intent,patientId:d.metadata.patientId,safetyFlags:d.metadata.safetyFlags}}),i.NextResponse.json({answer:d.answer,confidenceScore:d.confidenceScore,dataSourcesUsed:d.dataSourcesUsed,reasoningSummary:d.reasoningSummary,logId:u,audience:d.metadata.audience,intent:d.metadata.intent,patientId:d.metadata.patientId,safetyFlags:d.metadata.safetyFlags,retrievedKnowledge:d.metadata.retrievedKnowledge})}[n,s,r]=o.then?(await o)():o,e.s(["POST",0,l]),a()}catch(e){a(e)}},!1),323536,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),s=e.i(996250),r=e.i(759756),o=e.i(561916),l=e.i(174677),d=e.i(869741),c=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),h=e.i(570101),E=e.i(626937),g=e.i(10372),f=e.i(193695);e.i(52474);var R=e.i(600220),y=e.i(32463),A=t([y]);[y]=A.then?(await A)():A;let C=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/ai/route",pathname:"/api/clinical/ai",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/ai/route.ts",nextConfigOutput:"",userland:y,...{}}),{workAsyncStorage:$,workUnitAsyncStorage:I,serverHooks:N}=C;async function b(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),C.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/ai/route";i=i.replace(/\/index$/,"")||"/";let s=await C.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:y,deploymentId:A,params:b,nextConfig:$,parsedUrl:I,isDraftMode:N,prerenderManifest:v,routerServerContext:S,isOnDemandRevalidate:O,revalidateOnlyGenerated:w,resolvedPathname:D,clientReferenceManifest:L,serverActionsManifest:T}=s,M=(0,d.normalizeAppPath)(i),P=!!(v.dynamicRoutes[M]||v.routes[D]),U=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!N){let e=!!v.routes[D],t=v.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if($.adapterPath)return await U();throw new f.NoFallbackError}}let x=null;!P||C.isDev||N||(x=D,x="/index"===x?"/":x);let H=!0===C.isDev||!P,F=P&&!H;T&&L&&(0,l.setManifestsSingleton)({page:i,clientReferenceManifest:L,serverActionsManifest:T});let W=e.method||"GET",q=(0,o.getTracer)(),B=q.getActiveScopeSpan(),k=!!(null==S?void 0:S.isWrappedByNextServer),j=!!(0,r.getRequestMeta)(e,"minimalMode"),K=(0,r.getRequestMeta)(e,"incrementalCache")||await C.getIncrementalCache(e,$,v,j);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let G={params:b,previewProps:v.preview,renderOpts:{experimental:{authInterrupts:!!$.experimental.authInterrupts},cacheComponents:!!$.cacheComponents,supportsDynamicResponse:H,incrementalCache:K,cacheLifeProfiles:$.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>C.onRequestError(e,t,i,n,S)},sharedContext:{buildId:y,deploymentId:A}},Y=new c.NodeNextRequest(e),J=new c.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(Y,(0,u.signalFromNodeResponse)(t));try{let s,r=async e=>C.handle(V,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=q.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${W} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${W} ${i}`)}),l=async s=>{var o,l;let d=async({previousCacheEntry:n})=>{try{if(!j&&O&&w&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await r(s);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=G.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(Y,J,i,G.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,n=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:O})},!1,S),t}},c=await C.handleResponse({req:e,nextConfig:$,cacheKey:x,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:w,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:j});if(!P)return null;if((null==c||null==(o=c.value)?void 0:o.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",O?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return j&&P||u.delete(g.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,E.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(Y,J,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};k&&B?await l(B):(s=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(p.BaseServerSpan.handleRequest,{spanName:`${W} ${i}`,kind:o.SpanKind.SERVER,attributes:{"http.method":W,"http.target":e.url}},l),void 0,!k))}catch(t){if(t instanceof f.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:O})},!1,S),P)throw t;return await (0,m.sendResponse)(Y,J,new Response(null,{status:500})),null}}e.s(["handler",0,b,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:$,workUnitAsyncStorage:I})},"routeModule",0,C,"serverHooks",0,N,"workAsyncStorage",0,$,"workUnitAsyncStorage",0,I]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0ysf0~h._.js.map