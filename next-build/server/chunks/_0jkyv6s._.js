module.exports=[636570,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),d=e.i(679504),r=e.i(57446),s=e.i(155876),o=e.i(15270),l=t([n,d,r,s,o]);[n,d,r,s,o]=l.then?(await l)():l;let p=e=>JSON.parse(JSON.stringify(e,(e,t)=>"bigint"==typeof t?Number(t):t)),u=e=>String(e||"").trim(),E=e=>Array.isArray(e)?e.map(e=>"string"==typeof e?{name:e}:e).filter(Boolean):"string"==typeof e?e.split(/\n|,/).map(e=>e.trim()).filter(Boolean).map(e=>({name:e})):[],m=e=>{let t=u(e);return!t||/^doctor( #\d+)?$/i.test(t)?"Assigned Doctor":t};async function _(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let d=a.context,{id:r}=await t,s=Number(r);if(!Number.isFinite(s))return i.NextResponse.json({error:"Valid appointment id is required."},{status:400});let l=(await o.prisma.$queryRawUnsafe(`
      SELECT
        a.*,
        p.patient_uid,
        p.uhid,
        p.abha_id,
        p.phone,
        p.alternate_mobile,
        p.whatsapp_number,
        p.gender,
        p.date_of_birth,
        p.age_years,
        p.blood_group,
        p.allergies,
        p.medical_history,
        p.insurance_provider,
        p.insurance_number,
        p.emergency_relationship,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        d.full_name AS doctor_name,
        dep.department_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      LEFT JOIN departments dep ON dep.id = a.department_id
      WHERE a.id = $1
        AND a.tenant_id = $2
        AND a.hospital_id = $3
        AND a.branch_id = $4
        AND COALESCE(a.is_deleted,false) = false
      LIMIT 1
      `,s,d.tenantId,d.hospitalId,d.branchId))[0];if(!l)return i.NextResponse.json({error:"Appointment not found."},{status:404});let c=[Number(l.patient_id),d.tenantId,d.hospitalId,d.branchId],[u,E,m,N,$,R,A,h,C,I,b,D,f,T,S,y,O]=await Promise.all([o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM medical_records
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM prescriptions
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM lab_orders
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY ordered_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
	      SELECT
	        lr.*,
	        lo.appointment_id,
	        lo.order_uid,
	        lo.order_type,
	        lo.status AS order_status,
	        COALESCE(lt.lab_test_name, lo.order_type) AS lab_test_name,
	        COALESCE(lt.unit, (lr.result_data ->> 'unit')) AS result_unit,
	        COALESCE(lt.reference_range, lt.normal_value, (lr.result_data ->> 'reference_range')) AS reference_range,
	        COALESCE(u.full_name, validator.full_name) AS released_by_name,
	        lr.validated_at AS released_at
	      FROM lab_results lr
	      LEFT JOIN lab_orders lo ON lo.id = lr.lab_order_id
	      LEFT JOIN clinical_lab_test_master lt
	        ON (
	          lt.id = lo.lab_test_id
	          OR lower(lt.lab_test_name) = lower(lo.order_type)
	        )
	        AND lt.tenant_id = lr.tenant_id
	        AND lt.hospital_id = lr.hospital_id
	        AND lt.branch_id = lr.branch_id
	        AND COALESCE(lt.is_deleted,false) = false
	      LEFT JOIN users u ON u.id = lr.updated_by
	      LEFT JOIN users validator ON validator.id = lr.validated_by
	      WHERE lr.patient_id = $1
	        AND lr.tenant_id = $2
	        AND lr.hospital_id = $3
	        AND lr.branch_id = $4
	        AND COALESCE(lr.is_deleted,false) = false
	        AND lr.result_status = 'RELEASED'
	      ORDER BY lr.created_at DESC, lr.id DESC
	      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM radiology_orders
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM radiology_reports
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM radiology_uploads
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY uploaded_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM ip_admissions
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY admission_date DESC, id DESC
      LIMIT 50
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT ds.*
      FROM discharge_summaries ds
      JOIN ip_admissions ip ON ip.id = ds.admission_id
      WHERE ip.patient_id = $1
        AND ds.tenant_id = $2
        AND ds.hospital_id = $3
        AND ds.branch_id = $4
        AND COALESCE(ds.is_deleted,false) = false
      ORDER BY ds.discharge_date DESC NULLS LAST, ds.id DESC
      LIMIT 50
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM ivf_couples
      WHERE (female_patient_id = $1 OR male_patient_id = $1)
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 50
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT cyc.*
      FROM ivf_cycles cyc
      JOIN ivf_couples c ON c.id = cyc.couple_id
      WHERE (c.female_patient_id = $1 OR c.male_patient_id = $1)
        AND cyc.tenant_id = $2
        AND cyc.hospital_id = $3
        AND cyc.branch_id = $4
        AND COALESCE(cyc.is_deleted,false) = false
      ORDER BY cyc.start_date DESC NULLS LAST, cyc.id DESC
      LIMIT 50
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM ot_schedules
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY scheduled_date DESC NULLS LAST, id DESC
      LIMIT 50
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM medical_documents
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_patient_timeline
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY event_time DESC NULLS LAST, created_at DESC, id DESC
      LIMIT 100
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM clinical_vitals
      WHERE patient_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY created_at DESC, id DESC
      LIMIT 20
      `,...c),o.prisma.$queryRawUnsafe(`
      SELECT id, lab_test_name, category, normal_value, unit, reference_range, cost, status
      FROM clinical_lab_test_master
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
        AND status = 'ACTIVE'
      ORDER BY lab_test_name ASC
      LIMIT 250
      `,d.tenantId,d.hospitalId,d.branchId),o.prisma.$queryRawUnsafe(`
      SELECT id, medicine_name, generic_name, brand_name, medicine_type, strength, unit, selling_price, stock_quantity, reorder_level, expiry_date, status
      FROM clinical_medicine_master
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND COALESCE(is_deleted,false) = false
        AND status = 'ACTIVE'
      ORDER BY medicine_name ASC
      LIMIT 300
      `,d.tenantId,d.hospitalId,d.branchId)]),g=u.find(e=>Number(e.appointment_id)===s)||null;return i.NextResponse.json(p({context:d,appointment:l,currentRecord:g,patientSummary:{patient_id:l.patient_id,patient_name:l.patient_name,mrn:l.uhid||l.patient_uid,age:l.age_years,gender:l.gender,mobile:l.phone,blood_group:l.blood_group,allergies:l.allergies,insurance:l.insurance_provider||l.insurance_number,current_visit:l.appointment_uid,last_visit:u.find(e=>Number(e.appointment_id)!==s)?.created_at||null,primary_doctor:l.doctor_name},history:{previousConsultations:u.filter(e=>Number(e.appointment_id)!==s),previousPrescriptions:E,previousDiagnoses:u.filter(e=>e.diagnosis),previousAdmissions:h,previousDischarges:C,previousLabReports:N,previousRadiologyReports:[...$,...R,...A],previousIvfCycles:[...I,...b],previousProcedures:D,previousSurgeries:D,previousAllergies:l.allergies,previousChronicDiseases:l.medical_history,documents:f,timeline:T},vitals:S,masters:{labTests:y,medicines:O,radiologyStudies:["X-Ray","2D Echo","3D Echo","Ultrasound","CT Scan","MRI","Doppler","Custom"]}}))}async function c(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let l=a.context,{id:_}=await t,N=Number(_),$=await e.json();if(!Number.isFinite(N))return i.NextResponse.json({error:"Valid appointment id is required."},{status:400});let R=(await o.prisma.$queryRawUnsafe(`
      SELECT
        a.*,
        p.phone,
        COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'') AS patient_name,
        d.full_name AS doctor_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.id = $1
        AND a.tenant_id = $2
        AND a.hospital_id = $3
        AND a.branch_id = $4
        AND COALESCE(a.is_deleted,false) = false
      LIMIT 1
      `,N,l.tenantId,l.hospitalId,l.branchId))[0];if(!R)return i.NextResponse.json({error:"Appointment not found."},{status:404});let A=!0===$.complete||"COMPLETED"===$.status,h=E($.medications),C=E($.lab_orders),I=E($.radiology_orders),b=[];for(let e of h){let t=Number(e.medicine_master_id||e.medicine_id),a=u(e.name||e.medicine_name),i=(await o.prisma.$queryRawUnsafe(`
      SELECT id, medicine_name, generic_name, brand_name, medicine_type, strength, stock_quantity, unit
      FROM clinical_medicine_master
      WHERE tenant_id=$1
        AND hospital_id=$2
        AND branch_id=$3
        AND COALESCE(is_deleted,false)=false
        AND (
          ($4::int IS NOT NULL AND id=$4::int)
          OR ($5::text <> '' AND lower(medicine_name)=lower($5::text))
          OR ($5::text <> '' AND lower(generic_name)=lower($5::text))
          OR ($5::text <> '' AND lower(brand_name)=lower($5::text))
        )
      ORDER BY CASE WHEN $4::int IS NOT NULL AND id=$4::int THEN 0 ELSE 1 END, id DESC
      LIMIT 1
      `,l.tenantId,l.hospitalId,l.branchId,Number.isFinite(t)&&t>0?t:null,a))[0]||{};b.push({...e,medicine_master_id:i.id||e.medicine_master_id||e.medicine_id||null,medicine_id:i.id||e.medicine_id||e.medicine_master_id||null,name:i.medicine_name||e.name||e.medicine_name||"",medicine_name:i.medicine_name||e.medicine_name||e.name||"",generic_name:i.generic_name||e.generic_name||"",brand_name:i.brand_name||e.brand_name||"",strength:i.strength||e.strength||"",dosage_form:i.medicine_type||e.dosage_form||e.medicine_type||"",medicine_type:i.medicine_type||e.medicine_type||e.dosage_form||"",available_stock:i.stock_quantity??e.available_stock??null,unit:i.unit||e.unit||""})}let D=await o.prisma.$queryRawUnsafe(`
      SELECT *
      FROM medical_records
      WHERE appointment_id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      ORDER BY id DESC
      LIMIT 1
      `,N,l.tenantId,l.hospitalId,l.branchId),f=(D=D.length?await o.prisma.$queryRawUnsafe(`
        UPDATE medical_records
        SET chief_complaint = $5,
            history = $6,
            diagnosis = $7,
            treatment_plan = $8,
            clinical_notes = $9,
            advice = $10,
            follow_up_date = $11::date,
            status = $12,
            metadata = $13::jsonb,
            updated_by = $14,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
        RETURNING *
        `,D[0].id,l.tenantId,l.hospitalId,l.branchId,u($.chief_complaint)||null,u($.history)||null,u($.diagnosis)||null,u($.treatment_plan)||u($.advice)||null,u($.clinical_notes)||null,u($.advice)||null,u($.follow_up_date)||null,A?"COMPLETED":"ACTIVE",JSON.stringify({lab_orders:C,radiology_orders:I,medication_scribble:u($.medication_scribble)||null,study_notes_scribble:u($.study_notes_scribble)||null,doctor_notes_scribble:u($.doctor_notes_scribble)||null,source:"doctor_consultation_save"}),l.user.id??null):await o.prisma.$queryRawUnsafe(`
        INSERT INTO medical_records (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          patient_id,
          doctor_id,
          appointment_id,
          record_type,
          chief_complaint,
          history,
          diagnosis,
          treatment_plan,
          clinical_notes,
          advice,
          follow_up_date,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'OPD_CONSULTATION',$8,$9,$10,$11,$12,$13,$14::date,$15,$16::jsonb,$17,$17,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,l.tenantId,l.hospitalId,l.branchId,l.clinicId,R.patient_id,R.doctor_id,N,u($.chief_complaint)||null,u($.history)||null,u($.diagnosis)||null,u($.treatment_plan)||u($.advice)||null,u($.clinical_notes)||null,u($.advice)||null,u($.follow_up_date)||null,A?"COMPLETED":"ACTIVE",JSON.stringify({lab_orders:C,radiology_orders:I,medication_scribble:u($.medication_scribble)||null,study_notes_scribble:u($.study_notes_scribble)||null,doctor_notes_scribble:u($.doctor_notes_scribble)||null,source:"doctor_consultation_save"}),l.user.id??null))[0],T=null;if(b.length){let e=await o.prisma.$queryRawUnsafe(`
        SELECT *
        FROM prescriptions
        WHERE appointment_id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY id DESC
        LIMIT 1
        `,N,l.tenantId,l.hospitalId,l.branchId);if(e.length)T=(await o.prisma.$queryRawUnsafe(`
          UPDATE prescriptions
          SET medical_record_id = $5,
              medications = $6::jsonb,
              instructions = $7,
              chief_complaint = $8,
              diagnosis = $9,
              advice = $10,
              follow_up_date = $11::date,
              pharmacy_status = 'PENDING',
              status = 'ACTIVE',
              updated_by = $12,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND tenant_id = $2
            AND hospital_id = $3
            AND branch_id = $4
          RETURNING *
          `,e[0].id,l.tenantId,l.hospitalId,l.branchId,f.id,JSON.stringify(b),u($.instructions)||u($.advice)||null,u($.chief_complaint)||null,u($.diagnosis)||null,u($.advice)||null,u($.follow_up_date)||null,l.user.id??null))[0];else{let e=`RX-${Date.now()}`;T=(await o.prisma.$queryRawUnsafe(`
          INSERT INTO prescriptions (
            tenant_id,
            hospital_id,
            branch_id,
            clinic_id,
            patient_id,
            doctor_id,
            appointment_id,
            medical_record_id,
            prescription_uid,
            medications,
            instructions,
            chief_complaint,
            diagnosis,
            advice,
            follow_up_date,
            pharmacy_status,
            status,
            created_by,
            updated_by,
            created_at,
            updated_at,
            is_deleted
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13,$14,$15::date,'PENDING','ACTIVE',$16,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
          RETURNING *
          `,l.tenantId,l.hospitalId,l.branchId,l.clinicId,R.patient_id,R.doctor_id,N,f.id,e,JSON.stringify(b),u($.instructions)||u($.advice)||null,u($.chief_complaint)||null,u($.diagnosis)||null,u($.advice)||null,u($.follow_up_date)||null,l.user.id??null))[0]}let t=await o.prisma.$queryRawUnsafe(`
        SELECT *
        FROM pharmacy_prescription_queue
        WHERE prescription_id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
          AND COALESCE(is_deleted,false) = false
        LIMIT 1
        `,T.id,l.tenantId,l.hospitalId,l.branchId);t.length?await o.prisma.$executeRawUnsafe(`
        UPDATE pharmacy_prescription_queue
        SET medications = $5::jsonb,
            status = 'PENDING',
            patient_name = $6,
            patient_mobile = $7,
            updated_by = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
        `,t[0].id,l.tenantId,l.hospitalId,l.branchId,JSON.stringify(b),R.patient_name||null,R.phone||null,l.user.id??null):await o.prisma.$executeRawUnsafe(`
        INSERT INTO pharmacy_prescription_queue (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          queue_number,
          prescription_id,
          appointment_id,
          medical_record_id,
          patient_id,
          doctor_id,
          prescription_uid,
          patient_name,
          patient_mobile,
          medications,
          status,
          notes,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,'PENDING',$15,$16,$16,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        `,l.tenantId,l.hospitalId,l.branchId,l.clinicId,`RXQ-${Date.now()}`,T.id,N,f.id,R.patient_id,R.doctor_id,T.prescription_uid,R.patient_name||null,R.phone||null,JSON.stringify(b),"Created automatically from doctor consultation",l.user.id??null),T?.id&&(await (0,s.recordWorkflowEvent)(l,{patientId:Number(R.patient_id),appointmentId:N,workflowStage:"PRESCRIPTION",status:"PRESCRIPTION_GENERATED",summary:`Prescription generated by ${m(R.doctor_name)}.`,sourceTable:"prescriptions",sourceId:Number(T.id),metadata:{prescription_uid:T.prescription_uid,doctor_name:m(R.doctor_name),medicine_count:b.length,medications:b}}),await (0,d.queueClinicalWorkflowNotification)(l,{templateKey:"prescription_generated",patientId:Number(R.patient_id),appointmentId:N,sourceModule:"prescriptions",sourceRecordId:Number(T.id),variables:{doctor_name:m(R.doctor_name),medicine_count:b.length}}).catch(()=>null))}let S=[];for(let e of C){let t=u(e.name||e);if(!t)continue;let a=await o.prisma.$queryRawUnsafe(`
      SELECT id, COALESCE(cost, price) AS amount
      FROM clinical_lab_test_master
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND branch_id = $3
        AND (
          lower(lab_test_name) = lower($4)
          OR lower(COALESCE(test_name,'')) = lower($4)
          OR lower(COALESCE(test_code,'')) = lower($4)
        )
        AND COALESCE(is_deleted,false) = false
        AND status = 'ACTIVE'
      ORDER BY id DESC
      LIMIT 1
      `,l.tenantId,l.hospitalId,l.branchId,t),n=Number(a[0]?.amount);if(!a.length||!Number.isFinite(n)||n<=0)return i.NextResponse.json({error:`Lab test "${t}" is missing from Lab Test Master or has no valid cost. Please configure the test cost before billing.`},{status:400});let d=await o.prisma.$queryRawUnsafe(`
        INSERT INTO lab_orders (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          patient_id,
          doctor_id,
          appointment_id,
          medical_record_id,
          lab_test_id,
          order_uid,
          order_type,
          priority,
          status,
          ordered_at,
          notes,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'BILL_GENERATED',CURRENT_TIMESTAMP,$13,$14::jsonb,$15,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,l.tenantId,l.hospitalId,l.branchId,l.clinicId,R.patient_id,R.doctor_id,N,f.id,Number(a[0].id),`LAB-${Date.now()}-${S.length+1}`,t,u(e.priority)||"NORMAL",u(e.notes)||u($.clinical_notes)||null,JSON.stringify({source:"doctor_consultation",test:e}),l.user.id??null);S.push(d[0]),await (0,r.createBillingItemForWorkflow)(l,{moduleKey:"laboratory",patientId:Number(R.patient_id),sourceRecordId:Number(d[0].id),description:`${t} Lab Charge`,amount:n})}S.length&&await (0,d.queueClinicalWorkflowNotification)(l,{templateKey:"lab_test_ordered",patientId:Number(R.patient_id),appointmentId:N,sourceModule:"lab_orders",sourceRecordId:Number(S[0].id),variables:{doctor_name:m(R.doctor_name),lab_tests:S.map(e=>e.order_type).join(", ")}}).catch(()=>null);let y=[];for(let e of I){let t=u(e.name||e);if(!t)continue;let a=await o.prisma.$queryRawUnsafe(`
        INSERT INTO radiology_orders (
          tenant_id,
          hospital_id,
          branch_id,
          clinic_id,
          order_number,
          patient_id,
          doctor_id,
          appointment_id,
          medical_record_id,
          study_type,
          priority,
          clinical_notes,
          order_status,
          order_date,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at,
          is_deleted
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'CREATED',CURRENT_DATE,$13::jsonb,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
        RETURNING *
        `,l.tenantId,l.hospitalId,l.branchId,l.clinicId,`RAD-${Date.now()}-${y.length+1}`,R.patient_id,R.doctor_id,N,f.id,t,u(e.priority)||"ROUTINE",u(e.notes)||u($.clinical_notes)||null,JSON.stringify({source:"doctor_consultation",study:e}),l.user.id??null);y.push(a[0]),await (0,r.createBillingItemForWorkflow)(l,{moduleKey:"radiology",patientId:Number(R.patient_id),sourceRecordId:Number(a[0].id),description:`${t} Radiology Charge`,amount:Number(e.amount||e.cost||1200)})}let O=A?"CONSULTATION_COMPLETED":S.length||y.length?"LAB_ORDERED":"IN_CONSULTATION",g=A?T?"AWAITING_PHARMACY":"AWAITING_BILLING":S.length||y.length?"LAB_ORDERED":"IN_CONSULTATION";return await o.prisma.$executeRawUnsafe(`
    UPDATE appointments
    SET status = $5::varchar,
        queue_status = $6::varchar,
        updated_by = $7::int,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,N,l.tenantId,l.hospitalId,l.branchId,O,g,l.user.id??null),A&&(await (0,r.createBillingItemForWorkflow)(l,{moduleKey:"consultations",patientId:Number(R.patient_id),sourceRecordId:Number(f.id),description:"OP Consultation Fee",amount:Number(R.consultation_fee||$.consultation_fee||500)}),await (0,s.recordWorkflowEvent)(l,{patientId:Number(R.patient_id),appointmentId:N,workflowStage:"CONSULTATION",status:"CONSULTATION_COMPLETED",summary:"Doctor consultation completed.",sourceTable:"medical_records",sourceId:Number(f.id),metadata:{prescription_id:T?.id||null,lab_order_ids:S.map(e=>e.id),radiology_order_ids:y.map(e=>e.id)}}),await (0,d.queueClinicalWorkflowNotification)(l,{templateKey:"consultation_completed",patientId:Number(R.patient_id),appointmentId:N,sourceModule:"medical_records",sourceRecordId:Number(f.id),variables:{doctor_name:m(R.doctor_name),diagnosis_summary:u($.diagnosis)||"Consultation completed"}}).catch(()=>null)),await o.prisma.$executeRawUnsafe(`
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
    VALUES ($1,$2,$3,$4,$5,'CONSULTATION_SAVED','Consultation saved',$6,'medical_records',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,l.tenantId,l.hospitalId,l.branchId,l.clinicId,R.patient_id,`Consultation saved with ${b.length} medicines, ${S.length} lab orders, and ${y.length} radiology orders.`,f.id,JSON.stringify({appointment_id:N,prescription_id:T?.id||null,lab_order_ids:S.map(e=>e.id),radiology_order_ids:y.map(e=>e.id)}),l.user.id??null),await (0,n.recordClinicalAudit)(l,{moduleName:"doctor_consultation",action:"save",entityType:"medical_record",entityId:Number(f.id),summary:"Doctor consultation saved",payload:{appointment_id:N,prescription_id:T?.id||null,lab_orders:S.length,radiology_orders:y.length,completed:A}}),i.NextResponse.json(p({medical_record:f,prescription:T,lab_orders:S,radiology_orders:y}))}e.s(["GET",0,_,"POST",0,c]),a()}catch(e){a(e)}},!1),73070,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),d=e.i(996250),r=e.i(759756),s=e.i(561916),o=e.i(174677),l=e.i(869741),_=e.i(316795),c=e.i(487718),p=e.i(995169),u=e.i(47587),E=e.i(666012),m=e.i(570101),N=e.i(626937),$=e.i(10372),R=e.i(193695);e.i(52474);var A=e.i(600220),h=e.i(636570),C=t([h]);[h]=C.then?(await C)():C;let b=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/doctors/consultations/[id]/route",pathname:"/api/clinical/doctors/consultations/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/doctors/consultations/[id]/route.ts",nextConfigOutput:"",userland:h,...{}}),{workAsyncStorage:D,workUnitAsyncStorage:f,serverHooks:T}=b;async function I(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),b.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/doctors/consultations/[id]/route";i=i.replace(/\/index$/,"")||"/";let d=await b.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!d)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:h,deploymentId:C,params:I,nextConfig:D,parsedUrl:f,isDraftMode:T,prerenderManifest:S,routerServerContext:y,isOnDemandRevalidate:O,revalidateOnlyGenerated:g,resolvedPathname:w,clientReferenceManifest:L,serverActionsManifest:v}=d,M=(0,l.normalizeAppPath)(i),U=!!(S.dynamicRoutes[M]||S.routes[w]),P=async()=>((null==y?void 0:y.render404)?await y.render404(e,t,f,!1):t.end("This page could not be found"),null);if(U&&!T){let e=!!S.routes[w],t=S.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(D.adapterPath)return await P();throw new R.NoFallbackError}}let q=null;!U||b.isDev||T||(q=w,q="/index"===q?"/":q);let x=!0===b.isDev||!U,F=U&&!x;v&&L&&(0,o.setManifestsSingleton)({page:i,clientReferenceManifest:L,serverActionsManifest:v});let H=e.method||"GET",W=(0,s.getTracer)(),B=W.getActiveScopeSpan(),k=!!(null==y?void 0:y.isWrappedByNextServer),j=!!(0,r.getRequestMeta)(e,"minimalMode"),J=(0,r.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,D,S,j);null==J||J.resetRequestCache(),globalThis.__incrementalCache=J;let Y={params:I,previewProps:S.preview,renderOpts:{experimental:{authInterrupts:!!D.experimental.authInterrupts},cacheComponents:!!D.cacheComponents,supportsDynamicResponse:x,incrementalCache:J,cacheLifeProfiles:D.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>b.onRequestError(e,t,i,n,y)},sharedContext:{buildId:h,deploymentId:C}},G=new _.NodeNextRequest(e),V=new _.NodeNextResponse(t),K=c.NextRequestAdapter.fromNodeNextRequest(G,(0,c.signalFromNodeResponse)(t));try{let d,r=async e=>b.handle(K,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=W.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),d&&d!==e&&(d.setAttribute("http.route",n),d.updateName(t))}else e.updateName(`${H} ${i}`)}),o=async d=>{var s,o;let l=async({previousCacheEntry:n})=>{try{if(!j&&O&&g&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await r(d);e.fetchMetrics=Y.renderOpts.fetchMetrics;let s=Y.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let o=Y.renderOpts.collectedTags;if(!U)return await (0,E.sendResponse)(G,V,i,Y.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(i.headers);o&&(t[$.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=$.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,n=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=$.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:A.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:O})},!1,y),t}},_=await b.handleResponse({req:e,nextConfig:D,cacheKey:q,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:g,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:j});if(!U)return null;if((null==_||null==(s=_.value)?void 0:s.kind)!==A.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==_||null==(o=_.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",O?"REVALIDATED":_.isMiss?"MISS":_.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,m.fromNodeOutgoingHttpHeaders)(_.value.headers);return j&&U||c.delete($.NEXT_CACHE_TAGS_HEADER),!_.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,N.getCacheControlHeader)(_.cacheControl)),await (0,E.sendResponse)(G,V,new Response(_.value.body,{headers:c,status:_.value.status||200})),null};k&&B?await o(B):(d=W.getActiveScopeSpan(),await W.withPropagatedContext(e.headers,()=>W.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${i}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!k))}catch(t){if(t instanceof R.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:O})},!1,y),U)throw t;return await (0,E.sendResponse)(G,V,new Response(null,{status:500})),null}}e.s(["handler",0,I,"patchFetch",0,function(){return(0,d.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:f})},"routeModule",0,b,"serverHooks",0,T,"workAsyncStorage",0,D,"workUnitAsyncStorage",0,f]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0jkyv6s._.js.map