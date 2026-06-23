module.exports=[849858,e=>{"use strict";let t="/clinical-services",i={key:"patient_id",label:"Patient",type:"patient",required:!0,section:"Patient"},a={key:"notes",label:"Notes",type:"textarea",section:"Notes"},n=new Map([{key:"nursing",title:"Nursing Station",subtitle:"Vitals entry, nursing notes, medication administration, and shift handover.",route:`${t}/nursing`,audience:"Nurses and ward teams",primaryAction:"Save Nursing Record",statuses:["PRESENT","VITALS_ENTERED","MEDICATION_GIVEN","HANDOVER_DONE"],defaultStatus:"PRESENT",titleFields:["patient_id","temperature","blood_pressure"],printTitle:"Nursing Station Record",fields:[i,{key:"temperature",label:"Temperature",type:"number",section:"Vitals"},{key:"pulse",label:"Pulse",type:"number",section:"Vitals"},{key:"respiratory_rate",label:"Respiratory Rate",type:"number",section:"Vitals"},{key:"blood_pressure",label:"Blood Pressure",type:"text",section:"Vitals",placeholder:"120/80"},{key:"spo2",label:"SpO2",type:"number",section:"Vitals"},{key:"weight",label:"Weight",type:"number",section:"Vitals"},{key:"height",label:"Height",type:"number",section:"Vitals"},{key:"bmi",label:"BMI",type:"number",section:"Vitals"},{key:"medicine_id",label:"Medicine",type:"medicine",section:"Medication"},{key:"dose",label:"Dose",type:"text",section:"Medication"},{key:"administration_time",label:"Time",type:"time",section:"Medication"},{key:"nurse_name",label:"Nurse",type:"text",section:"Medication"},{key:"handover_to",label:"Handover To",type:"text",section:"Shift Handover"},a]},{key:"consultations",title:"Doctor Consultation",subtitle:"Clinical notes, diagnosis, medicine orders, lab/radiology orders, and prescription generation.",route:`${t}/consultations`,audience:"Doctors",primaryAction:"Save Consultation",statuses:["DRAFT","IN_CONSULTATION","CONSULTATION_COMPLETED","FOLLOW_UP_REQUIRED"],defaultStatus:"DRAFT",titleFields:["patient_id","chief_complaint","diagnosis"],printTitle:"Doctor Consultation Sheet",fields:[i,{key:"doctor_id",label:"Doctor",type:"doctor",required:!0,section:"Doctor"},{key:"chief_complaint",label:"Chief Complaint",type:"textarea",required:!0,section:"Clinical"},{key:"symptoms",label:"Symptoms",type:"textarea",section:"Clinical"},{key:"diagnosis",label:"Diagnosis",type:"textarea",section:"Clinical"},{key:"clinical_notes",label:"Clinical Notes",type:"textarea",section:"Clinical"},{key:"follow_up_date",label:"Follow-Up Date",type:"date",section:"Follow-Up"},{key:"medicine_id",label:"Medicine Order",type:"medicine",section:"Orders"},{key:"lab_test_id",label:"Lab Test Order",type:"lab_test",section:"Orders"},{key:"radiology_modality",label:"Radiology",type:"select",options:["X-Ray","CT","MRI","Ultrasound","ECG","Echo"],section:"Orders"},{key:"procedure",label:"Procedure",type:"text",section:"Orders"},a]},{key:"laboratory",title:"Laboratory Operations",subtitle:"Sample collection, tracking, result entry, validation, approval, and report release.",route:`${t}/laboratory`,audience:"Lab technicians and lab managers",primaryAction:"Save Lab Record",statuses:["ORDERED","SAMPLE_COLLECTED","PROCESSING","COMPLETED","APPROVED","RELEASED"],defaultStatus:"ORDERED",titleFields:["patient_id","lab_test_id","sample_number"],printTitle:"Laboratory Order / Result",fields:[i,{key:"lab_test_id",label:"Lab Test",type:"lab_test",required:!0,section:"Order"},{key:"sample_number",label:"Sample Number",type:"text",section:"Sample"},{key:"sample_type",label:"Sample Type",type:"text",section:"Sample"},{key:"collection_time",label:"Collection Time",type:"time",section:"Sample"},{key:"result_value",label:"Result Value",type:"text",section:"Result"},{key:"critical_value",label:"Critical Value",type:"select",options:["NO","YES"],section:"Result"},{key:"validated_by",label:"Validated By",type:"text",section:"Approval"},a]},{key:"radiology",title:"Radiology",subtitle:"Radiology orders, scheduling, technician entry, report entry, approval, and release.",route:`${t}/radiology`,audience:"Radiology technicians and radiologists",primaryAction:"Save Radiology Record",statuses:["ORDERED","SCHEDULED","IMAGING_DONE","REPORT_ENTERED","APPROVED","RELEASED"],defaultStatus:"ORDERED",titleFields:["patient_id","modality","study_name"],printTitle:"Radiology Order / Report",fields:[i,{key:"modality",label:"Modality",type:"select",required:!0,options:["X-Ray","CT","MRI","Ultrasound","ECG","Echo"],section:"Order"},{key:"study_name",label:"Study Name",type:"text",required:!0,section:"Order"},{key:"scheduled_date",label:"Scheduled Date",type:"date",section:"Schedule"},{key:"technician",label:"Technician",type:"text",section:"Technician"},{key:"findings",label:"Findings",type:"textarea",section:"Report"},{key:"impression",label:"Impression",type:"textarea",section:"Report"},{key:"approved_by",label:"Approved By",type:"text",section:"Approval"},a]},{key:"bed-management",title:"Bed Management",subtitle:"Building, ward, room, bed status, admissions, transfers, discharges, and live occupancy.",route:`${t}/bed-management`,audience:"Reception, admission desk, nursing supervisors",primaryAction:"Save Bed Action",statuses:["AVAILABLE","OCCUPIED","RESERVED","CLEANING","MAINTENANCE","DISCHARGED"],defaultStatus:"AVAILABLE",titleFields:["room_id","bed_number","patient_id"],printTitle:"Bed Management Record",fields:[{key:"building",label:"Building",type:"text",section:"Location"},{key:"ward",label:"Ward",type:"text",section:"Location"},{key:"room_id",label:"Room",type:"room",section:"Location"},{key:"bed_number",label:"Bed Number",type:"text",required:!0,section:"Bed"},{...i,required:!1},{key:"action",label:"Action",type:"select",options:["Admit","Transfer","Discharge","Reserve","Cleaning","Maintenance"],section:"Action"},a]},{key:"ipd",title:"IPD Management",subtitle:"Admission, bed allocation, daily rounds, nursing notes, medication, transfer, and discharge.",route:`${t}/ipd`,audience:"Admission, ward, doctors, nursing teams",primaryAction:"Save IPD Record",statuses:["ADMITTED","BED_ALLOCATED","DAILY_ROUND_DONE","TRANSFERRED","DISCHARGE_PLANNED","DISCHARGED"],defaultStatus:"ADMITTED",titleFields:["patient_id","room_id","admission_reason"],printTitle:"IPD Admission / Daily Record",fields:[i,{key:"doctor_id",label:"Treating Doctor",type:"doctor",section:"Admission"},{key:"room_id",label:"Bed / Room",type:"room",section:"Admission"},{key:"admission_date",label:"Admission Date",type:"date",section:"Admission"},{key:"admission_reason",label:"Admission Reason",type:"textarea",required:!0,section:"Admission"},{key:"daily_round_notes",label:"Daily Round Notes",type:"textarea",section:"Rounds"},{key:"nursing_notes",label:"Nursing Notes",type:"textarea",section:"Nursing"},{key:"discharge_summary",label:"Discharge Summary",type:"textarea",section:"Discharge"},a]},{key:"ot",title:"Operation Theatre",subtitle:"OT scheduling, surgeon assignment, anaesthesia, procedure notes, and OT billing.",route:`${t}/ot`,audience:"OT coordinators, surgeons, anaesthesia teams",primaryAction:"Save OT Schedule",statuses:["SCHEDULED","IN_PROGRESS","COMPLETED","CANCELLED"],defaultStatus:"SCHEDULED",titleFields:["patient_id","procedure","surgeon_id"],printTitle:"Operation Theatre Schedule",fields:[i,{key:"procedure",label:"Procedure",type:"text",required:!0,section:"Procedure"},{key:"surgeon_id",label:"Surgeon",type:"doctor",section:"Team"},{key:"assistant_surgeon",label:"Assistant Surgeon",type:"text",section:"Team"},{key:"anaesthetist",label:"Anaesthetist",type:"text",section:"Team"},{key:"ot_room",label:"OT Room",type:"room",section:"Room"},{key:"procedure_date",label:"Date",type:"date",section:"Schedule"},{key:"start_time",label:"Start Time",type:"time",section:"Schedule"},{key:"end_time",label:"End Time",type:"time",section:"Schedule"},{key:"billing_notes",label:"Billing Notes",type:"textarea",section:"Billing"},a]},{key:"icu",title:"ICU Management",subtitle:"ICU admission, hourly monitoring, ventilator tracking, and critical care notes.",route:`${t}/icu`,audience:"ICU doctors and nurses",primaryAction:"Save ICU Record",statuses:["ADMITTED","HOURLY_MONITORING","CRITICAL","STABLE","TRANSFERRED","DISCHARGED"],defaultStatus:"ADMITTED",titleFields:["patient_id","pulse","ventilator_mode"],printTitle:"ICU Monitoring Record",fields:[i,{key:"pulse",label:"Pulse",type:"number",section:"Vitals"},{key:"bp",label:"BP",type:"text",section:"Vitals"},{key:"spo2",label:"SpO2",type:"number",section:"Vitals"},{key:"ventilator_mode",label:"Ventilator Mode",type:"text",section:"Ventilator"},{key:"fio2",label:"FiO2",type:"number",section:"Ventilator"},{key:"peep",label:"PEEP",type:"number",section:"Ventilator"},{key:"respiratory_rate",label:"Respiratory Rate",type:"number",section:"Vitals"},{key:"critical_notes",label:"Critical Care Notes",type:"textarea",section:"Notes"},a]},{key:"ivf",title:"IVF Management",subtitle:"Cycle workflow, investigations, stimulation, retrieval, embryology, transfer, pregnancy test, cryo, billing, and reports.",route:`${t}/ivf`,audience:"IVF doctors, embryologists, coordinators",primaryAction:"Save IVF Workflow",statuses:["CONSULTATION","INVESTIGATIONS","STIMULATION","RETRIEVAL","EMBRYO_CULTURE","TRANSFER","PREGNANCY_TEST","FOLLOW_UP","CLOSED"],defaultStatus:"CONSULTATION",titleFields:["patient_id","cycle_number","workflow_stage"],printTitle:"IVF Cycle Record",fields:[i,{key:"cycle_number",label:"Cycle Number",type:"text",required:!0,section:"Cycle"},{key:"workflow_stage",label:"Workflow Stage",type:"select",options:["Consultation","Investigations","Stimulation","Follicular Monitoring","Trigger","Egg Retrieval","Sperm Collection","Fertilization","Embryo Culture","Embryo Transfer","Pregnancy Test","Follow-Up"],section:"Cycle"},{key:"amh",label:"AMH",type:"number",section:"Female Profile"},{key:"fsh",label:"FSH",type:"number",section:"Female Profile"},{key:"lh",label:"LH",type:"number",section:"Female Profile"},{key:"estradiol",label:"Estradiol",type:"number",section:"Female Profile"},{key:"afc",label:"AFC",type:"number",section:"Female Profile"},{key:"sperm_count",label:"Sperm Count",type:"text",section:"Male Profile"},{key:"motility",label:"Motility",type:"text",section:"Male Profile"},{key:"morphology",label:"Morphology",type:"text",section:"Male Profile"},{key:"embryo_grade",label:"Embryo Grade",type:"text",section:"Embryology"},{key:"storage_tank",label:"Storage Tank",type:"text",section:"Cryopreservation"},{key:"canister",label:"Canister",type:"text",section:"Cryopreservation"},{key:"straw_number",label:"Straw Number",type:"text",section:"Cryopreservation"},{key:"freeze_date",label:"Freeze Date",type:"date",section:"Cryopreservation"},{key:"package_billing",label:"Package Billing",type:"number",section:"Billing"},a]},{key:"pharmacy",title:"Pharmacy Operations",subtitle:"Inventory, batch, expiry, purchase orders, goods receipt, dispensing, returns, and alerts.",route:`${t}/pharmacy`,audience:"Pharmacy staff",primaryAction:"Save Pharmacy Record",statuses:["STOCK","PO_CREATED","GOODS_RECEIVED","PRESCRIPTION_QUEUE","DISPENSED","RETURNED","LOW_STOCK","EXPIRING"],defaultStatus:"STOCK",titleFields:["medicine_id","batch_number","patient_id"],printTitle:"Pharmacy Operation Record",fields:[{key:"medicine_id",label:"Medicine",type:"medicine",required:!0,section:"Medicine"},{key:"batch_number",label:"Batch",type:"text",section:"Inventory"},{key:"expiry_date",label:"Expiry Date",type:"date",section:"Inventory"},{key:"quantity",label:"Quantity",type:"number",section:"Inventory"},{key:"purchase_order",label:"Purchase Order",type:"text",section:"Purchase"},{key:"goods_receipt",label:"Goods Receipt",type:"text",section:"Purchase"},{...i,required:!1},{key:"dispense_notes",label:"Dispense Notes",type:"textarea",section:"Dispensing"},{key:"return_reason",label:"Return Reason",type:"textarea",section:"Returns"},a]},{key:"inventory",title:"Inventory Management",subtitle:"OT, ICU, lab, and general medical supplies purchase, stock entry, issue, return, and consumption tracking.",route:`${t}/inventory`,audience:"Stores and procurement teams",primaryAction:"Save Inventory Record",statuses:["PURCHASED","STOCK_ENTERED","ISSUED","RETURNED","CONSUMED"],defaultStatus:"STOCK_ENTERED",titleFields:["item_name","category","quantity"],printTitle:"Inventory Operation Record",fields:[{key:"category",label:"Category",type:"select",required:!0,options:["OT Consumables","ICU Consumables","Lab Consumables","General Medical Supplies"],section:"Item"},{key:"item_name",label:"Item Name",type:"text",required:!0,section:"Item"},{key:"quantity",label:"Quantity",type:"number",required:!0,section:"Stock"},{key:"supplier",label:"Supplier",type:"text",section:"Purchase"},{key:"purchase_date",label:"Purchase Date",type:"date",section:"Purchase"},{key:"issued_to",label:"Issued To",type:"text",section:"Issue"},{key:"consumption_area",label:"Consumption Area",type:"text",section:"Consumption"},a]}].map(e=>[e.key,e]));e.s(["getPhase2Module",0,function(e){return n.get(e)},"titleForRecord",0,function(e,t,i={}){return e.titleFields.map(e=>{let a=t[e];return i[e]||String(a||"").trim()}).filter(Boolean).join(" | ")||`${e.title} Record`}])},223091,e=>e.a(async(t,i)=>{try{var a=e.i(780907),n=e.i(849858),s=e.i(57446),o=e.i(15270),d=t([a,s,o]);[a,s,o]=d.then?(await d)():d;let y=e=>String(e??"").trim(),b=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},E=e=>{let t=Number(e);return Number.isFinite(t)?t:null},h=e=>["YES","TRUE","1","CRITICAL"].includes(y(e).toUpperCase()),C=e=>`${e}-${Date.now()}-${Math.floor(9e3*Math.random()+1e3)}`,f={nursing:{table:"nursing_vitals",idColumn:"id",uidColumn:"record_uid",uidPrefix:"NUR",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.record_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'temperature', t.temperature,
        'pulse', t.pulse,
        'respiratory_rate', t.respiratory_rate,
        'blood_pressure', t.blood_pressure,
        'spo2', t.spo2,
        'weight', t.weight,
        'height', t.height,
        'bmi', t.bmi,
        'medicine_id', mar.medicine_id,
        'dose', mar.dose,
        'administration_time', mar.administration_time,
        'nurse_name', mar.nurse_name,
        'handover_to', sh.handover_to,
        'notes', COALESCE(nn.note_text, sh.notes)
      )
    `},consultations:{table:"consultations",idColumn:"id",uidColumn:"consultation_uid",uidPrefix:"CON",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.consultation_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.chief_complaint,'')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'doctor_id', t.doctor_id,
        'chief_complaint', t.chief_complaint,
        'symptoms', t.symptoms,
        'diagnosis', COALESCE(cd.diagnosis_text, t.diagnosis_summary),
        'clinical_notes', t.clinical_notes,
        'follow_up_date', t.follow_up_date,
        'medicine_id', cp.medicine_id,
        'dose', cp.dose,
        'lab_test_id', clo.lab_test_id,
        'radiology_modality', cro.modality,
        'procedure', cro.study_name,
        'notes', t.clinical_notes
      )
    `},laboratory:{table:"lab_orders",idColumn:"id",uidColumn:"order_uid",uidPrefix:"LAB",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.order_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(lt.test_name, lt.lab_test_name, '')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'lab_test_id', t.lab_test_id,
        'sample_number', COALESCE(ls.sample_number, t.sample_number),
        'sample_type', ls.sample_type,
        'collection_time', ls.collection_time,
        'result_value', COALESCE(lr.result_value, t.result_value),
        'critical_value', CASE WHEN COALESCE(lr.critical_value, t.critical_value, false) THEN 'YES' ELSE 'NO' END,
        'validated_by', COALESCE(lra.approved_by, t.validated_by),
        'notes', t.notes
      )
    `},radiology:{table:"consultation_radiology_orders",idColumn:"id",uidColumn:"order_uid",uidPrefix:"RAD",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.order_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.modality,'') || ' ' || COALESCE(t.study_name,'')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'modality', t.modality,
        'study_name', t.study_name,
        'scheduled_date', t.scheduled_date,
        'technician', t.technician,
        'findings', t.findings,
        'impression', t.impression,
        'approved_by', t.approved_by,
        'notes', t.findings
      )
    `},"bed-management":{table:"bed_allocations",idColumn:"id",uidColumn:"allocation_uid",uidPrefix:"BED",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.allocation_uid,'') || ' | Bed ' || COALESCE(t.bed_number,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",dataSql:`
      jsonb_build_object(
        'building', t.building,
        'ward', t.ward,
        'room_id', t.room_id,
        'bed_number', t.bed_number,
        'patient_id', t.patient_id,
        'action', t.action,
        'notes', t.notes
      )
    `},ipd:{table:"admissions",idColumn:"id",uidColumn:"admission_uid",uidPrefix:"IPD",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.admission_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.admission_reason,'')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'doctor_id', t.doctor_id,
        'admission_date', t.admission_date,
        'admission_reason', t.admission_reason,
        'daily_round_notes', nn.note_text,
        'nursing_notes', nn.note_text,
        'discharge_summary', d.discharge_summary,
        'room_id', ba.room_id,
        'notes', t.admission_reason
      )
    `},ot:{table:"ot_schedules",idColumn:"id",uidColumn:"schedule_uid",uidPrefix:"OT",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.schedule_uid,'') || ' | ' || COALESCE(t.procedure_name,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'procedure', t.procedure_name,
        'surgeon_id', t.surgeon_id,
        'assistant_surgeon', t.assistant_surgeon,
        'anaesthetist', t.anaesthetist,
        'ot_room', t.ot_room_id,
        'procedure_date', t.scheduled_date,
        'start_time', t.start_time,
        'end_time', t.end_time,
        'billing_notes', op.billing_notes,
        'notes', t.notes
      )
    `},icu:{table:"icu_admissions",idColumn:"id",uidColumn:"admission_uid",uidPrefix:"ICU",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.admission_uid,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'pulse', im.pulse,
        'bp', im.bp,
        'spo2', im.spo2,
        'respiratory_rate', im.respiratory_rate,
        'ventilator_mode', vt.ventilator_mode,
        'fio2', vt.fio2,
        'peep', vt.peep,
        'critical_notes', im.critical_notes,
        'notes', im.critical_notes
      )
    `},ivf:{table:"ivf_cycles",idColumn:"id",uidColumn:"cycle_number",uidPrefix:"IVF",patientColumn:"patient_id",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.cycle_number,'') || ' | ' || COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') || ' | ' || COALESCE(t.workflow_stage,'')",dataSql:`
      jsonb_build_object(
        'patient_id', t.patient_id,
        'cycle_number', t.cycle_number,
        'workflow_stage', t.workflow_stage,
        'amh', ist.amh,
        'fsh', ist.fsh,
        'lh', ist.lh,
        'estradiol', ist.estradiol,
        'afc', ist.afc,
        'sperm_count', ie.sperm_count,
        'motility', ie.motility,
        'morphology', ie.morphology,
        'embryo_grade', ie.embryo_grade,
        'storage_tank', ic.storage_tank,
        'canister', ic.canister,
        'straw_number', ic.straw_number,
        'freeze_date', ic.freeze_date,
        'package_billing', t.notes,
        'notes', t.notes
      )
    `},pharmacy:{table:"pharmacy_stock",idColumn:"id",uidColumn:"stock_uid",uidPrefix:"PHR",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.stock_uid,'') || ' | ' || COALESCE(cm.medicine_name,'')",dataSql:`
      jsonb_build_object(
        'medicine_id', t.medicine_id,
        'batch_number', pb.batch_number,
        'expiry_date', pb.expiry_date,
        'quantity', COALESCE(pb.quantity, t.quantity),
        'purchase_order', ppo.purchase_order,
        'goods_receipt', ppo.goods_receipt,
        'patient_id', pd.patient_id,
        'dispense_notes', pd.dispense_notes,
        'return_reason', pd.return_reason,
        'notes', t.notes
      )
    `},inventory:{table:"inventory_items",idColumn:"id",uidColumn:"item_uid",uidPrefix:"INV",statusColumn:"status",dateColumn:"updated_at",titleSql:"COALESCE(t.item_uid,'') || ' | ' || COALESCE(t.item_name,'')",dataSql:`
      jsonb_build_object(
        'category', t.category,
        'item_name', t.item_name,
        'quantity', t.quantity,
        'supplier', t.supplier,
        'purchase_date', it.transaction_date,
        'issued_to', ii.issued_to,
        'consumption_area', ii.consumption_area,
        'notes', it.notes
      )
    `}};async function r(e,t,i,a){let n=f[t];if(!n)throw Error("Unknown normalized healthcare module.");let s=i?`%${i.toLowerCase()}%`:null;return o.prisma.$queryRawUnsafe(`
    SELECT DISTINCT ON (t.${n.idColumn})
      t.${n.idColumn} AS id,
      t.${n.uidColumn} AS record_uid,
      ${n.titleSql} AS title,
      ${n.patientColumn?`t.${n.patientColumn}`:"NULL"} AS patient_id,
      COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '') AS patient_name,
      p.patient_uid,
      p.uhid,
      t.${n.statusColumn} AS status,
      COALESCE(t.priority, 'NORMAL') AS priority,
      ${n.dataSql} AS data,
      t.updated_at
    FROM ${n.table} t
    ${n.patientColumn?`LEFT JOIN patients p ON p.id = t.${n.patientColumn}`:"LEFT JOIN patients p ON false"}
    ${"nursing"===t?`
      LEFT JOIN nursing_notes nn ON nn.vital_id = t.id AND COALESCE(nn.is_deleted,false) = false
      LEFT JOIN medication_administration_records mar ON mar.vital_id = t.id AND COALESCE(mar.is_deleted,false) = false
      LEFT JOIN shift_handovers sh ON sh.vital_id = t.id AND COALESCE(sh.is_deleted,false) = false
    `:"consultations"===t?`
      LEFT JOIN consultation_diagnoses cd ON cd.consultation_id = t.id AND COALESCE(cd.is_deleted,false) = false
      LEFT JOIN consultation_prescriptions cp ON cp.consultation_id = t.id AND COALESCE(cp.is_deleted,false) = false
      LEFT JOIN consultation_lab_orders clo ON clo.consultation_id = t.id AND COALESCE(clo.is_deleted,false) = false
      LEFT JOIN consultation_radiology_orders cro ON cro.consultation_id = t.id AND COALESCE(cro.is_deleted,false) = false
    `:"laboratory"===t?`
      LEFT JOIN clinical_lab_test_master lt ON lt.id = t.lab_test_id
      LEFT JOIN lab_samples ls ON ls.lab_order_id = t.id AND COALESCE(ls.is_deleted,false) = false
      LEFT JOIN lab_results lr ON lr.lab_order_id = t.id AND COALESCE(lr.is_deleted,false) = false
      LEFT JOIN lab_result_approvals lra ON lra.lab_result_id = lr.id AND COALESCE(lra.is_deleted,false) = false
    `:"ipd"===t?`
      LEFT JOIN bed_allocations ba ON ba.admission_id = t.id AND COALESCE(ba.is_deleted,false) = false
      LEFT JOIN nursing_notes nn ON nn.admission_id = t.id AND COALESCE(nn.is_deleted,false) = false
      LEFT JOIN discharges d ON d.admission_id = t.id AND COALESCE(d.is_deleted,false) = false
    `:"ot"===t?`
      LEFT JOIN ot_procedures op ON op.ot_schedule_id = t.id AND COALESCE(op.is_deleted,false) = false
    `:"icu"===t?`
      LEFT JOIN icu_monitoring im ON im.icu_admission_id = t.id AND COALESCE(im.is_deleted,false) = false
      LEFT JOIN ventilator_tracking vt ON vt.icu_admission_id = t.id AND COALESCE(vt.is_deleted,false) = false
    `:"ivf"===t?`
      LEFT JOIN ivf_stimulation ist ON ist.ivf_cycle_id = t.id AND COALESCE(ist.is_deleted,false) = false
      LEFT JOIN ivf_embryos ie ON ie.ivf_cycle_id = t.id AND COALESCE(ie.is_deleted,false) = false
      LEFT JOIN ivf_cryostorage ic ON ic.ivf_cycle_id = t.id AND COALESCE(ic.is_deleted,false) = false
    `:"pharmacy"===t?`
      LEFT JOIN clinical_medicine_master cm ON cm.id = t.medicine_id
      LEFT JOIN pharmacy_batches pb ON pb.stock_id = t.id AND COALESCE(pb.is_deleted,false) = false
      LEFT JOIN pharmacy_purchase_orders ppo ON ppo.stock_id = t.id AND COALESCE(ppo.is_deleted,false) = false
      LEFT JOIN pharmacy_dispensing pd ON pd.stock_id = t.id AND COALESCE(pd.is_deleted,false) = false
    `:"inventory"===t?`
      LEFT JOIN inventory_transactions it ON it.inventory_item_id = t.id AND COALESCE(it.is_deleted,false) = false
      LEFT JOIN inventory_issues ii ON ii.inventory_item_id = t.id AND COALESCE(ii.is_deleted,false) = false
    `:""}
    WHERE t.tenant_id = $1
      AND t.hospital_id = $2
      AND t.branch_id = $3
      AND COALESCE(t.is_deleted,false) = false
      AND ($4::text IS NULL OR t.${n.statusColumn} = $4::text)
      AND (
        $5::text IS NULL
        OR lower(COALESCE(t.${n.uidColumn}::text,'')) LIKE $5::text
        OR lower((${n.titleSql})::text) LIKE $5::text
        OR lower(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) LIKE $5::text
        OR lower(COALESCE(p.phone,'')) LIKE $5::text
        OR lower(COALESCE(p.patient_uid,'')) LIKE $5::text
        OR lower(COALESCE(p.uhid,'')) LIKE $5::text
      )
    ORDER BY t.${n.idColumn}, t.${n.dateColumn} DESC NULLS LAST
    LIMIT 300
    `,e.tenantId,e.hospitalId,e.branchId,a||null,s)}async function l(e,t){let i=Object.keys(t),a=i.map((e,t)=>`$${t+1}`),n=i.map(e=>t[e]);return(await o.prisma.$queryRawUnsafe(`
      INSERT INTO ${e} (${i.join(",")})
      VALUES (${a.join(",")})
      RETURNING *
      `,...n))[0]}async function u(e,t,i,a){let n=Object.keys(a),s=n.map((e,t)=>`${e} = $${t+5}`),d=n.map(e=>a[e]);return(await o.prisma.$queryRawUnsafe(`
      UPDATE ${e}
      SET ${s.join(",")},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      RETURNING *
      `,t,i.tenantId,i.hospitalId,i.branchId,...d))[0]}async function _(e,t,i){await o.prisma.$executeRawUnsafe(`
    UPDATE ${e}
    SET is_deleted = true,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,t,i.tenantId,i.hospitalId,i.branchId,i.user.id??null)}async function c(e,t,i,a){await o.prisma.$executeRawUnsafe(`
    UPDATE ${e}
    SET is_deleted = true
    WHERE ${t} = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,i,a.tenantId,a.hospitalId,a.branchId)}async function p(e,t,i,o){let d,r=(0,n.getPhase2Module)(t),_=f[t];if(!r||!_)throw Error("Unknown normalized healthcare module.");let p=y(i.status)||r.defaultStatus,m=y(i.priority)||"NORMAL",A={tenant_id:e.tenantId,clinic_id:e.clinicId,hospital_id:e.hospitalId,branch_id:e.branchId,created_by:e.user.id??null,updated_by:e.user.id??null};if("consultations"===t){let t={...A,patient_id:b(i.patient_id),doctor_id:b(i.doctor_id),consultation_uid:y(i.consultation_uid)||C("CON"),status:p,chief_complaint:y(i.chief_complaint),symptoms:y(i.symptoms),diagnosis_summary:y(i.diagnosis),clinical_notes:y(i.clinical_notes)||y(i.notes),follow_up_date:y(i.follow_up_date)||null,priority:m};d=o?await u("consultations",o,e,t):await l("consultations",t),await c("consultation_diagnoses","consultation_id",Number(d.id),e),await c("consultation_prescriptions","consultation_id",Number(d.id),e),await c("consultation_lab_orders","consultation_id",Number(d.id),e),await c("consultation_radiology_orders","consultation_id",Number(d.id),e),y(i.diagnosis)&&await l("consultation_diagnoses",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,consultation_id:d.id,diagnosis_text:y(i.diagnosis),diagnosis_type:"CLINICAL",created_by:e.user.id??null}),b(i.medicine_id)&&await l("consultation_prescriptions",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,consultation_id:d.id,medicine_id:b(i.medicine_id),dose:y(i.dose),instructions:y(i.notes),created_by:e.user.id??null}),b(i.lab_test_id)&&await l("consultation_lab_orders",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,consultation_id:d.id,lab_test_id:b(i.lab_test_id),order_notes:y(i.notes),status:"ORDERED",created_by:e.user.id??null})}else if("laboratory"===t){let t={...A,patient_id:b(i.patient_id),lab_test_id:b(i.lab_test_id),order_uid:y(i.order_uid)||C("LAB"),order_type:"LAB",priority:m,status:p,sample_number:y(i.sample_number),result_value:y(i.result_value),critical_value:h(i.critical_value),validated_by:y(i.validated_by),notes:y(i.notes)};if(d=o?await u("lab_orders",o,e,t):await l("lab_orders",t),await c("lab_samples","lab_order_id",Number(d.id),e),await c("lab_results","lab_order_id",Number(d.id),e),await l("lab_samples",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,lab_order_id:d.id,sample_number:y(i.sample_number),sample_type:y(i.sample_type),collection_time:y(i.collection_time)||null,collected_by:e.user.id??null,status:"ORDERED"===p?"PENDING":"COLLECTED"}),y(i.result_value)){let t=await l("lab_results",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,lab_order_id:d.id,patient_id:b(i.patient_id),result_uid:C("LRES"),result_status:p,result_value:y(i.result_value),critical_value:h(i.critical_value),entered_by:e.user.id??null,created_by:e.user.id??null});await l("lab_result_approvals",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,lab_result_id:t.id,approved_by:y(i.validated_by),approval_status:"APPROVED"===p?"APPROVED":"PENDING"})}}else if("nursing"===t){let t={...A,patient_id:b(i.patient_id),record_uid:y(i.record_uid)||C("NUR"),temperature:E(i.temperature),pulse:E(i.pulse),respiratory_rate:E(i.respiratory_rate),blood_pressure:y(i.blood_pressure),spo2:E(i.spo2),weight:E(i.weight),height:E(i.height),bmi:E(i.bmi),status:p,priority:m};d=o?await u("nursing_vitals",o,e,t):await l("nursing_vitals",t),await c("nursing_notes","vital_id",Number(d.id),e),await c("medication_administration_records","vital_id",Number(d.id),e),await c("shift_handovers","vital_id",Number(d.id),e),y(i.notes)&&await l("nursing_notes",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,clinic_id:e.clinicId,patient_id:b(i.patient_id),vital_id:d.id,note_text:y(i.notes),observation:y(i.notes),created_by:e.user.id??null}),(b(i.medicine_id)||y(i.dose))&&await l("medication_administration_records",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,vital_id:d.id,patient_id:b(i.patient_id),medicine_id:b(i.medicine_id),dose:y(i.dose),administration_time:y(i.administration_time)||null,nurse_name:y(i.nurse_name),created_by:e.user.id??null}),y(i.handover_to)&&await l("shift_handovers",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,vital_id:d.id,patient_id:b(i.patient_id),handover_to:y(i.handover_to),notes:y(i.notes),created_by:e.user.id??null})}else if("radiology"===t){let t={tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,patient_id:b(i.patient_id),order_uid:y(i.order_uid)||C("RAD"),modality:y(i.modality),study_name:y(i.study_name),scheduled_date:y(i.scheduled_date)||null,technician:y(i.technician),findings:y(i.findings),impression:y(i.impression),approved_by:y(i.approved_by),status:p,priority:m,created_by:e.user.id??null,updated_by:e.user.id??null};d=o?await u("consultation_radiology_orders",o,e,t):await l("consultation_radiology_orders",t)}else if("bed-management"===t){let t={...A,patient_id:b(i.patient_id),room_id:b(i.room_id),allocation_uid:y(i.allocation_uid)||C("BED"),building:y(i.building),ward:y(i.ward),bed_number:y(i.bed_number),action:y(i.action),status:p,priority:m,notes:y(i.notes)};d=o?await u("bed_allocations",o,e,t):await l("bed_allocations",t)}else if("ipd"===t){let t={...A,patient_id:b(i.patient_id),doctor_id:b(i.doctor_id),admission_uid:y(i.admission_uid)||C("IPD"),admission_date:y(i.admission_date)||null,admission_reason:y(i.admission_reason),status:p,priority:m};d=o?await u("admissions",o,e,t):await l("admissions",t),await c("bed_allocations","admission_id",Number(d.id),e),await c("nursing_notes","admission_id",Number(d.id),e),await c("discharges","admission_id",Number(d.id),e),b(i.room_id)&&await l("bed_allocations",{tenant_id:e.tenantId,clinic_id:e.clinicId,hospital_id:e.hospitalId,branch_id:e.branchId,admission_id:d.id,patient_id:b(i.patient_id),room_id:b(i.room_id),allocation_uid:C("BED"),bed_number:y(i.room_id),status:"OCCUPIED",created_by:e.user.id??null,updated_by:e.user.id??null}),(y(i.nursing_notes)||y(i.daily_round_notes))&&await l("nursing_notes",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,clinic_id:e.clinicId,admission_id:d.id,patient_id:b(i.patient_id),note_text:y(i.nursing_notes)||y(i.daily_round_notes),observation:y(i.daily_round_notes),created_by:e.user.id??null}),y(i.discharge_summary)&&await l("discharges",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,admission_id:d.id,patient_id:b(i.patient_id),discharge_summary:y(i.discharge_summary),status:"DISCHARGE_PLANNED",created_by:e.user.id??null,updated_by:e.user.id??null})}else if("ot"===t){let t={...A,schedule_uid:y(i.schedule_uid)||C("OT"),procedure_name:y(i.procedure),patient_id:b(i.patient_id),surgeon_id:b(i.surgeon_id),assistant_surgeon:y(i.assistant_surgeon),anaesthetist:y(i.anaesthetist),ot_room_id:b(i.ot_room),scheduled_date:y(i.procedure_date)||null,start_time:y(i.start_time)||null,end_time:y(i.end_time)||null,status:p,priority:m,notes:y(i.notes)};d=o?await u("ot_schedules",o,e,t):await l("ot_schedules",t),await c("ot_procedures","ot_schedule_id",Number(d.id),e),await c("ot_staff_assignments","ot_schedule_id",Number(d.id),e),await l("ot_procedures",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,ot_schedule_id:d.id,procedure_name:y(i.procedure),procedure_notes:y(i.notes),billing_notes:y(i.billing_notes),created_by:e.user.id??null})}else if("icu"===t){let t={...A,patient_id:b(i.patient_id),admission_uid:y(i.admission_uid)||C("ICU"),status:p,priority:m};d=o?await u("icu_admissions",o,e,t):await l("icu_admissions",t),await c("icu_monitoring","icu_admission_id",Number(d.id),e),await c("ventilator_tracking","icu_admission_id",Number(d.id),e),await l("icu_monitoring",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,icu_admission_id:d.id,pulse:E(i.pulse),bp:y(i.bp),spo2:E(i.spo2),respiratory_rate:E(i.respiratory_rate),critical_notes:y(i.critical_notes)||y(i.notes),created_by:e.user.id??null}),await l("ventilator_tracking",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,icu_admission_id:d.id,ventilator_mode:y(i.ventilator_mode),fio2:E(i.fio2),peep:E(i.peep),created_by:e.user.id??null})}else if("ivf"===t){let t={...A,patient_id:b(i.patient_id),cycle_number:y(i.cycle_number)||C("IVF"),cycle_type:"IVF",workflow_stage:y(i.workflow_stage),status:p,priority:m,notes:y(i.notes)||y(i.package_billing)};d=o?await u("ivf_cycles",o,e,t):await l("ivf_cycles",t),await c("ivf_stimulation","ivf_cycle_id",Number(d.id),e),await c("ivf_embryos","ivf_cycle_id",Number(d.id),e),await c("ivf_cryostorage","ivf_cycle_id",Number(d.id),e),await l("ivf_stimulation",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,ivf_cycle_id:d.id,amh:E(i.amh),fsh:E(i.fsh),lh:E(i.lh),estradiol:E(i.estradiol),afc:E(i.afc)}),await l("ivf_embryos",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,clinic_id:e.clinicId,ivf_cycle_id:d.id,embryo_id:C("EMB"),cycle_id:d.id,embryo_grade:y(i.embryo_grade),sperm_count:y(i.sperm_count),motility:y(i.motility),morphology:y(i.morphology)}),await l("ivf_cryostorage",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,ivf_cycle_id:d.id,storage_tank:y(i.storage_tank),canister:y(i.canister),straw_number:y(i.straw_number),freeze_date:y(i.freeze_date)||null})}else if("pharmacy"===t){let t={...A,medicine_id:b(i.medicine_id),stock_uid:y(i.stock_uid)||C("PHR"),quantity:E(i.quantity),status:p,priority:m,notes:y(i.notes)};d=o?await u("pharmacy_stock",o,e,t):await l("pharmacy_stock",t),await c("pharmacy_batches","stock_id",Number(d.id),e),await c("pharmacy_purchase_orders","stock_id",Number(d.id),e),await c("pharmacy_dispensing","stock_id",Number(d.id),e),await l("pharmacy_batches",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,clinic_id:e.clinicId,stock_id:d.id,medicine_id:b(i.medicine_id),batch_number:y(i.batch_number),expiry_date:y(i.expiry_date)||null,quantity:E(i.quantity),created_by:e.user.id??null,updated_by:e.user.id??null}),await l("pharmacy_purchase_orders",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,clinic_id:e.clinicId,stock_id:d.id,po_number:y(i.purchase_order)||C("PO"),purchase_order:y(i.purchase_order),goods_receipt:y(i.goods_receipt),supplier:y(i.supplier),created_by:e.user.id??null,updated_by:e.user.id??null}),b(i.patient_id)&&await l("pharmacy_dispensing",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,stock_id:d.id,patient_id:b(i.patient_id),quantity:E(i.quantity),dispense_notes:y(i.dispense_notes),return_reason:y(i.return_reason),created_by:e.user.id??null})}else if("inventory"===t){let t={...A,item_uid:y(i.item_uid)||C("INV"),category:y(i.category),item_name:y(i.item_name),quantity:E(i.quantity),supplier:y(i.supplier),status:p,priority:m};d=o?await u("inventory_items",o,e,t):await l("inventory_items",t),await c("inventory_transactions","inventory_item_id",Number(d.id),e),await c("inventory_issues","inventory_item_id",Number(d.id),e),await l("inventory_transactions",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,inventory_item_id:d.id,transaction_type:p,quantity:E(i.quantity),transaction_date:y(i.purchase_date)||null,notes:y(i.notes),created_by:e.user.id??null}),await l("inventory_issues",{tenant_id:e.tenantId,hospital_id:e.hospitalId,branch_id:e.branchId,inventory_item_id:d.id,issued_to:y(i.issued_to),consumption_area:y(i.consumption_area),quantity:E(i.quantity),created_by:e.user.id??null})}if(!d)throw Error("Domain record was not saved.");return await (0,a.recordClinicalAudit)(e,{moduleName:t,action:o?"update":"create",entityType:_.table,entityId:Number(d.id),summary:`${r.title} saved in normalized table ${_.table}`,payload:{table:_.table,id:d.id,status:p,title:(0,n.titleForRecord)(r,i)}}),await (0,s.recordWorkflowSpineEffects)(e,{moduleKey:t,record:d,body:i}),d}async function m(e,t,i){let s=(0,n.getPhase2Module)(t),o=f[t];if(!s||!o)throw Error("Unknown normalized healthcare module.");await _(o.table,i,e),await (0,a.recordClinicalAudit)(e,{moduleName:t,action:"delete",entityType:o.table,entityId:i,summary:`${s.title} deleted from normalized table ${o.table}`})}e.s(["deleteDomainRecord",0,m,"listDomainRecords",0,r,"saveDomainRecord",0,p]),i()}catch(e){i(e)}},!1),497854,e=>e.a(async(t,i)=>{try{var a=e.i(89171),n=e.i(780907),s=e.i(849858),o=e.i(223091),d=e.i(15270),r=t([n,o,d]);[n,o,d]=r.then?(await r)():r;let m=e=>String(e||"").trim(),y=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},b=e=>{let t=String(e??"");return t.includes(",")||t.includes('"')||t.includes("\n")?`"${t.replaceAll('"','""')}"`:t};async function l(e){let[t,i,a,n,s,o]=await Promise.all([d.prisma.$queryRawUnsafe(`
      SELECT id, patient_uid, uhid, first_name, last_name, phone
      FROM patients
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC
      LIMIT 300
      `,e.tenantId,e.hospitalId,e.branchId),d.prisma.$queryRawUnsafe(`
      SELECT id, full_name, specialization, department_id
      FROM doctors
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY full_name
      LIMIT 200
      `,e.tenantId,e.hospitalId,e.branchId),d.prisma.$queryRawUnsafe(`
      SELECT id, department_name, department_code
      FROM departments
      WHERE tenant_id = $1
        AND (hospital_id IS NULL OR hospital_id = $2)
        AND (branch_id IS NULL OR branch_id = $3)
        AND COALESCE(is_deleted,false) = false
      ORDER BY department_name
      LIMIT 200
      `,e.tenantId,e.hospitalId,e.branchId),d.prisma.$queryRawUnsafe(`
      SELECT id, medicine_name, generic_name, strength, stock_quantity
      FROM clinical_medicine_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY medicine_name
      LIMIT 300
      `,e.tenantId,e.hospitalId,e.branchId),d.prisma.$queryRawUnsafe(`
      SELECT id, COALESCE(test_name, lab_test_name) AS test_name, category, sample_type
      FROM clinical_lab_test_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY COALESCE(test_name, lab_test_name)
      LIMIT 300
      `,e.tenantId,e.hospitalId,e.branchId),d.prisma.$queryRawUnsafe(`
      SELECT id, room_number, room_type, status
      FROM clinical_room_master
      WHERE tenant_id = $1 AND hospital_id = $2 AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
      ORDER BY room_number
      LIMIT 300
      `,e.tenantId,e.hospitalId,e.branchId)]);return{patients:t,doctors:i,departments:a,medicines:n,labTests:s,rooms:o}}async function u(e,{params:t}){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let d=i.context,{module:r}=await t,_=(0,s.getPhase2Module)(r);if(!_)return a.NextResponse.json({error:"Unknown operational module."},{status:404});let{searchParams:c}=new URL(e.url),p=c.get("q")?.trim()||"",m=c.get("status")?.trim()||"",y=c.get("export"),[E,h]=await Promise.all([(0,o.listDomainRecords)(d,_.key,p,m||""),l(d)]);if("csv"===y){let e=["Record UID,Module,Title,Patient,Status,Priority,Updated At",...E.map(e=>[e.record_uid,_.title,e.title,e.patient_name,e.status,e.priority,e.updated_at].map(b).join(","))];return new Response(e.join("\n"),{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="${_.key}-records.csv"`}})}return a.NextResponse.json({module:_,records:E,lookups:h})}async function _(e,{params:t}){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let d=i.context,{module:r}=await t,l=await e.json(),u=function(e,t){let i=(0,s.getPhase2Module)(e);if(!i)return{error:"Unknown operational module.",module:null};for(let e of i.fields)if(e.required&&!m(t[e.key]))return{error:`${e.label} is required.`,module:i};return{error:null,module:i}}(r,l);if(u.error)return a.NextResponse.json({error:u.error},{status:400});let c=u.module,p=await (0,o.saveDomainRecord)(d,c.key,l);return a.NextResponse.json(p,{status:201})}async function c(e,{params:t}){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let d=i.context,{module:r}=await t,l=(0,s.getPhase2Module)(r);if(!l)return a.NextResponse.json({error:"Unknown operational module."},{status:404});let u=await e.json(),_=y(u.id);if(!_)return a.NextResponse.json({error:"Record id is required."},{status:400});let p={...u};delete p.id;let m=await (0,o.saveDomainRecord)(d,l.key,p,_);return a.NextResponse.json(m)}async function p(e,{params:t}){let i=await (0,n.requireClinicalContext)(e);if(i.response)return i.response;let d=i.context,{module:r}=await t,l=(0,s.getPhase2Module)(r);if(!l)return a.NextResponse.json({error:"Unknown operational module."},{status:404});let{searchParams:u}=new URL(e.url),_=y(u.get("id"));return _?(await (0,o.deleteDomainRecord)(d,l.key,_),a.NextResponse.json({success:!0})):a.NextResponse.json({error:"Record id is required."},{status:400})}e.s(["DELETE",0,p,"GET",0,u,"PATCH",0,c,"POST",0,_]),i()}catch(e){i(e)}},!1),664497,e=>e.a(async(t,i)=>{try{var a=e.i(747909),n=e.i(174017),s=e.i(996250),o=e.i(759756),d=e.i(561916),r=e.i(174677),l=e.i(869741),u=e.i(316795),_=e.i(487718),c=e.i(995169),p=e.i(47587),m=e.i(666012),y=e.i(570101),b=e.i(626937),E=e.i(10372),h=e.i(193695);e.i(52474);var C=e.i(600220),f=e.i(497854),A=t([f]);[f]=A.then?(await A)():A;let O=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/phase2/[module]/route",pathname:"/api/clinical/phase2/[module]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/phase2/[module]/route.ts",nextConfigOutput:"",userland:f,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:I,serverHooks:g}=O;async function N(e,t,i){i.requestMeta&&(0,o.setRequestMeta)(e,i.requestMeta),O.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/clinical/phase2/[module]/route";a=a.replace(/\/index$/,"")||"/";let s=await O.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==i.waitUntil||i.waitUntil.call(i,Promise.resolve()),null;let{buildId:f,deploymentId:A,params:N,nextConfig:S,parsedUrl:I,isDraftMode:g,prerenderManifest:R,routerServerContext:L,isOnDemandRevalidate:v,revalidateOnlyGenerated:w,resolvedPathname:D,clientReferenceManifest:T,serverActionsManifest:k}=s,x=(0,l.normalizeAppPath)(a),P=!!(R.dynamicRoutes[x]||R.routes[D]),$=async()=>((null==L?void 0:L.render404)?await L.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!g){let e=!!R.routes[D],t=R.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await $();throw new h.NoFallbackError}}let q=null;!P||O.isDev||g||(q=D,q="/index"===q?"/":q);let U=!0===O.isDev||!P,M=P&&!U;k&&T&&(0,r.setManifestsSingleton)({page:a,clientReferenceManifest:T,serverActionsManifest:k});let F=e.method||"GET",j=(0,d.getTracer)(),H=j.getActiveScopeSpan(),V=!!(null==L?void 0:L.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),G=(0,o.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,S,R,B);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let J={params:N,previewProps:R.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:U,incrementalCache:G,cacheLifeProfiles:S.cacheLife,waitUntil:i.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,a,n)=>O.onRequestError(e,t,a,n,L)},sharedContext:{buildId:f,deploymentId:A}},W=new u.NodeNextRequest(e),K=new u.NodeNextResponse(t),z=_.NextRequestAdapter.fromNodeNextRequest(W,(0,_.signalFromNodeResponse)(t));try{let s,o=async e=>O.handle(z,J).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=j.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${F} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${F} ${a}`)}),r=async s=>{var d,r;let l=async({previousCacheEntry:n})=>{try{if(!B&&v&&w&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await o(s);e.fetchMetrics=J.renderOpts.fetchMetrics;let d=J.renderOpts.pendingWaitUntil;d&&i.waitUntil&&(i.waitUntil(d),d=void 0);let r=J.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(W,K,a,J.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,y.toNodeOutgoingHttpHeaders)(a.headers);r&&(t[E.NEXT_CACHE_TAGS_HEADER]=r),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==J.renderOpts.collectedRevalidate&&!(J.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&J.renderOpts.collectedRevalidate,n=void 0===J.renderOpts.collectedExpire||J.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:J.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:v})},!1,L),t}},u=await O.handleResponse({req:e,nextConfig:S,cacheKey:q,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:R,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:w,responseGenerator:l,waitUntil:i.waitUntil,isMinimalMode:B});if(!P)return null;if((null==u||null==(d=u.value)?void 0:d.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(r=u.value)?void 0:r.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",v?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let _=(0,y.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&P||_.delete(E.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||_.get("Cache-Control")||_.set("Cache-Control",(0,b.getCacheControlHeader)(u.cacheControl)),await (0,m.sendResponse)(W,K,new Response(u.value.body,{headers:_,status:u.value.status||200})),null};V&&H?await r(H):(s=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(c.BaseServerSpan.handleRequest,{spanName:`${F} ${a}`,kind:d.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},r),void 0,!V))}catch(t){if(t instanceof h.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:v})},!1,L),P)throw t;return await (0,m.sendResponse)(W,K,new Response(null,{status:500})),null}}e.s(["handler",0,N,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:I})},"routeModule",0,O,"serverHooks",0,g,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,I]),i()}catch(e){i(e)}},!1)];

//# sourceMappingURL=_06n2n4a._.js.map