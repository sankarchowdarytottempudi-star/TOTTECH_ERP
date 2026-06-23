module.exports=[960090,e=>{"use strict";let t=["couple_id","cycle_id"],a={couples:{key:"couples",label:"Couple Registration",table:"ivf_couples",idPrefix:"CPL",uidColumn:"couple_number",coupleColumn:"id",dateColumn:"created_at",statusColumn:"status",createColumns:["female_patient_id","male_patient_id","marriage_date","infertility_duration_months","primary_infertility","secondary_infertility","female_name","female_age","female_height","female_weight","female_bmi","female_blood_group","female_occupation","male_name","male_age","male_height","male_weight","male_bmi","male_blood_group","referral_doctor","referral_hospital","referral_agent","campaign_source","commission_plan","status"],numericColumns:["female_patient_id","male_patient_id","infertility_duration_months","female_age","female_height","female_weight","female_bmi","male_age","male_height","male_weight","male_bmi"],booleanColumns:["primary_infertility","secondary_infertility"],dateColumns:["marriage_date"]},"female-assessment":{key:"female-assessment",label:"Female Fertility Assessment",table:"ivf_female_assessments",idPrefix:"FEMA",coupleColumn:"couple_id",patientColumn:"patient_id",dateColumn:"assessment_date",statusColumn:"status",createColumns:["couple_id","patient_id","assessment_date","menarche_age","cycle_length","cycle_regularity","lmp","previous_pregnancies","previous_ivf_cycles","previous_miscarriages","previous_abortions","previous_ectopic_pregnancy","amh","fsh","lh","estradiol","progesterone","tsh","prolactin","vitamin_d","hba1c","right_ovary_afc","left_ovary_afc","endometrial_thickness","fibroids","polyps","ovarian_cysts","pcos_findings","hsg_result","laparoscopy_result","tubal_patency","hydrosalpinx","clinical_summary","status"],numericColumns:["couple_id","patient_id","menarche_age","cycle_length","previous_pregnancies","previous_ivf_cycles","previous_miscarriages","previous_abortions","previous_ectopic_pregnancy","amh","fsh","lh","estradiol","progesterone","tsh","prolactin","vitamin_d","hba1c","right_ovary_afc","left_ovary_afc","endometrial_thickness"],dateColumns:["assessment_date","lmp"],textAreaColumns:["fibroids","polyps","ovarian_cysts","pcos_findings","hsg_result","laparoscopy_result","hydrosalpinx","clinical_summary"]},"male-assessment":{key:"male-assessment",label:"Male Fertility Assessment",table:"ivf_male_assessments",idPrefix:"MALE",coupleColumn:"couple_id",patientColumn:"patient_id",dateColumn:"assessment_date",statusColumn:"status",createColumns:["couple_id","patient_id","assessment_date","volume","liquefaction_time","sperm_count","motility","progressive_motility","morphology","vitality","ph","viscosity","dna_fragmentation","oxidative_stress","mar_test","testosterone","fsh","lh","prolactin","clinical_summary","status"],numericColumns:["couple_id","patient_id","volume","liquefaction_time","sperm_count","motility","progressive_motility","morphology","vitality","ph","dna_fragmentation","testosterone","fsh","lh","prolactin"],dateColumns:["assessment_date"],textAreaColumns:["clinical_summary"]},"treatment-plans":{key:"treatment-plans",label:"Treatment Planning",table:"ivf_treatment_plans",idPrefix:"TPL",uidColumn:"plan_number",coupleColumn:"couple_id",dateColumn:"planned_start_date",statusColumn:"status",createColumns:["couple_id","treatment_type","protocol_type","doctor_id","department_id","planned_start_date","planned_end_date","clinical_indication","donor_required","surrogate_required","insurance_required","package_id","status"],numericColumns:["couple_id","doctor_id","department_id","package_id"],booleanColumns:["donor_required","surrogate_required","insurance_required"],dateColumns:["planned_start_date","planned_end_date"],textAreaColumns:["clinical_indication"]},cycles:{key:"cycles",label:"IVF Cycles",table:"ivf_cycles",idPrefix:"CYC",uidColumn:"cycle_number",coupleColumn:"couple_id",dateColumn:"start_date",statusColumn:"status",createColumns:["couple_id","treatment_plan_id","cycle_type","protocol_type","start_date","expected_retrieval_date","expected_transfer_date","doctor_id","embryologist_id","status","outcome","outcome_date","workflow_stage","priority","notes"],numericColumns:["couple_id","treatment_plan_id","doctor_id","embryologist_id"],dateColumns:["start_date","expected_retrieval_date","expected_transfer_date","outcome_date"],textAreaColumns:["notes"]},stimulation:{key:"stimulation",label:"Stimulation Management",table:"ivf_stimulation_records",idPrefix:"STM",coupleColumn:"couple_id",dateColumn:"monitoring_date",statusColumn:"status",createColumns:[...t,"cycle_day","monitoring_date","doctor_id","medication","dose","duration","notes","status"],numericColumns:["couple_id","cycle_id","cycle_day","doctor_id"],dateColumns:["monitoring_date"],textAreaColumns:["notes"]},retrievals:{key:"retrievals",label:"Egg Retrieval",table:"ivf_retrievals",idPrefix:"RET",uidColumn:"retrieval_number",coupleColumn:"couple_id",dateColumn:"retrieval_date",statusColumn:"status",createColumns:[...t,"retrieval_date","doctor_id","anesthetist_id","procedure_duration_minutes","follicles_aspirated","oocytes_retrieved","mii","mi","gv","degenerated","bleeding","pain","ohss_risk","hospital_admission","status"],numericColumns:["couple_id","cycle_id","doctor_id","anesthetist_id","procedure_duration_minutes","follicles_aspirated","oocytes_retrieved","mii","mi","gv","degenerated"],booleanColumns:["hospital_admission"],dateColumns:["retrieval_date"],textAreaColumns:["bleeding","pain"]},embryology:{key:"embryology",label:"Embryology Lab",table:"ivf_fertilization_records",idPrefix:"FER",uidColumn:"fertilization_number",coupleColumn:"couple_id",dateColumn:"created_at",statusColumn:"status",createColumns:[...t,"patient_id","embryo_record_id","retrieval_id","doctor_id","method","oocytes_inseminated","two_pn","one_pn","three_pn","failed_fertilization","embryologist_id","notes","status"],numericColumns:["couple_id","cycle_id","patient_id","embryo_record_id","retrieval_id","doctor_id","oocytes_inseminated","two_pn","one_pn","three_pn","failed_fertilization","embryologist_id"],textAreaColumns:["notes"]},embryos:{key:"embryos",label:"Embryo Management",table:"ivf_embryos",idPrefix:"EMB",uidColumn:"embryo_id",coupleColumn:"couple_id",dateColumn:"creation_date",statusColumn:"current_status",createColumns:[...t,"creation_date","current_status","fertilization_method","day3_grade","day5_grade","pgt_status","storage_location_id","notes"],numericColumns:["couple_id","cycle_id","storage_location_id"],dateColumns:["creation_date"],textAreaColumns:["notes"]},cryo:{key:"cryo",label:"Cryopreservation",table:"ivf_freezing_records",idPrefix:"CRYO",uidColumn:"cryo_number",coupleColumn:"couple_id",dateColumn:"freezing_date",statusColumn:"status",createColumns:["embryo_id",...t,"freezing_date","method","tank_number","canister","straw_number","location_code","status"],numericColumns:["embryo_id","couple_id","cycle_id"],dateColumns:["freezing_date"]},transfers:{key:"transfers",label:"Embryo Transfer",table:"ivf_embryo_transfers",idPrefix:"TRF",uidColumn:"transfer_number",coupleColumn:"couple_id",dateColumn:"transfer_date",statusColumn:"status",createColumns:[...t,"transfer_date","doctor_id","embryologist_id","transfer_type","embryo_count","embryo_grade","embryo_age_days","catheter_type","difficulty","status"],numericColumns:["couple_id","cycle_id","doctor_id","embryologist_id","embryo_count","embryo_age_days"],dateColumns:["transfer_date"]},pregnancies:{key:"pregnancies",label:"Pregnancy Tracking",table:"ivf_pregnancies",idPrefix:"PRG",coupleColumn:"couple_id",dateColumn:"beta_hcg_date",statusColumn:"status",createColumns:[...t,"transfer_id","beta_hcg_date","beta_hcg_result","beta_hcg_status","ultrasound_date","gestational_sac","yolk_sac","heartbeat","crl","pregnancy_outcome","outcome_date","status"],numericColumns:["couple_id","cycle_id","transfer_id","beta_hcg_result","crl"],booleanColumns:["gestational_sac","yolk_sac","heartbeat"],dateColumns:["beta_hcg_date","ultrasound_date","outcome_date"]},donors:{key:"donors",label:"Donor Management",table:"ivf_donors",idPrefix:"DNR",uidColumn:"donor_number",dateColumn:"created_at",statusColumn:"availability_status",createColumns:["donor_type","age","blood_group","education","medical_history","genetic_screening","availability_status"],numericColumns:["age"],textAreaColumns:["medical_history","genetic_screening"]},surrogacy:{key:"surrogacy",label:"Surrogacy",table:"ivf_surrogates",idPrefix:"SUR",uidColumn:"surrogate_number",dateColumn:"created_at",statusColumn:"availability_status",createColumns:["age","previous_pregnancies","medical_history","legal_clearance","availability_status"],numericColumns:["age","previous_pregnancies"],booleanColumns:["legal_clearance"],textAreaColumns:["medical_history"]},billing:{key:"billing",label:"IVF Billing",table:"ivf_billing",idPrefix:"IVFINV",uidColumn:"invoice_number",coupleColumn:"couple_id",dateColumn:"created_at",statusColumn:"status",createColumns:[...t,"package_id","additional_procedures","discounts","taxes","total","paid_amount","balance_amount","status"],numericColumns:["couple_id","cycle_id","package_id","additional_procedures","discounts","taxes","total","paid_amount","balance_amount"]},referrals:{key:"referrals",label:"IVF Referral Management",table:"ivf_referrals",idPrefix:"REF",coupleColumn:"couple_id",dateColumn:"created_at",statusColumn:"approval_status",createColumns:["couple_id","referral_source","referral_doctor","referral_hospital","referral_agent","campaign","commission_type","percentage","fixed_amount","approval_status","payment_status"],numericColumns:["couple_id","percentage","fixed_amount"]},ai:{key:"ai",label:"TOTTECH IVF AI",table:"ivf_ai_summaries",idPrefix:"IVFAI",coupleColumn:"couple_id",dateColumn:"created_at",statusColumn:"clinical_review_required",createColumns:[...t,"summary_type","prompt","answer","confidence","clinical_review_required"],numericColumns:["couple_id","cycle_id","confidence"],booleanColumns:["clinical_review_required"],textAreaColumns:["prompt","answer"]}};Object.values(a),e.s(["getIvfModuleConfig",0,function(e){return a[e]},"normalizeIvfValue",0,function(e,t,a){if(void 0===a||""===a)return null;if(e.numericColumns?.includes(t)){let e=Number(a);return Number.isFinite(e)?e:null}return e.booleanColumns?.includes(t)?!0===a||"true"===a||"1"===a||"on"===a:e.dateColumns?.includes(t)?String(a):String(a).trim()}])},136094,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),r=e.i(960090),l=e.i(15270),o=t([n,l]);[n,l]=o.then?(await o)():o;let _=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},m=async e=>{let t=await l.prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = $1
    `,e);return new Set(t.map(e=>e.column_name))},p=e=>`"${e.replace(/"/g,'""')}"`,f=["tenant_id","hospital_id","branch_id"],y={couple_id:{table:"ivf_couples",label:"couple"},cycle_id:{table:"ivf_cycles",label:"IVF cycle"},treatment_plan_id:{table:"ivf_treatment_plans",label:"IVF treatment plan"},retrieval_id:{table:"ivf_retrievals",label:"egg retrieval"},embryo_id:{table:"ivf_embryos",label:"embryo"},embryo_record_id:{table:"ivf_embryos",label:"embryo"},transfer_id:{table:"ivf_embryo_transfers",label:"embryo transfer"},doctor_id:{table:"doctors",label:"doctor"},embryologist_id:{table:"doctors",label:"embryologist"},anesthetist_id:{table:"doctors",label:"anesthetist"},approved_by:{table:"doctors",label:"approver"},patient_id:{table:"patients",label:"patient"},female_patient_id:{table:"patients",label:"female patient"},male_patient_id:{table:"patients",label:"male patient"},department_id:{table:"departments",label:"department"}},h=async(e,t)=>{for(let a of t.writableColumns){let i=y[a];if(!i)continue;let n=(0,r.normalizeIvfValue)(t.config,a,t.body[a]),o=_(n);if(!o)continue;let s=await m(i.table),d=[o],u=["id = $1"];for(let t of f)s.has(t)&&(d.push(e["tenant_id"===t?"tenantId":"hospital_id"===t?"hospitalId":"branchId"]),u.push(`${t} = $${d.length}`));if(s.has("is_deleted")&&u.push("COALESCE(is_deleted,false) = false"),!(await l.prisma.$queryRawUnsafe(`
      SELECT id
      FROM ${i.table}
      WHERE ${u.join(" AND ")}
      LIMIT 1
      `,...d)).length)return`Selected ${i.label} was not found for this hospital and branch. Please select a valid ${i.label} or leave it blank.`}return null},b=async e=>{if(e.explicitPatientId)return e.explicitPatientId;if(!e.coupleId)return null;let t=await l.prisma.$queryRawUnsafe(`
    SELECT female_patient_id, male_patient_id
    FROM ivf_couples
    WHERE id = $1
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,e.coupleId);return _(t[0]?.female_patient_id)||_(t[0]?.male_patient_id)},C=e=>Array.isArray(e)?e.map(e=>{if(!e||"object"!=typeof e)return null;let t=String(e.name||e.file_name||"").trim(),a=String(e.type||e.file_type||"").trim(),i=String(e.dataUrl||e.data_url||e.url||"").trim();return t||i?{name:t,type:a,size:Number(e.size||0)||0,dataUrl:i,uploadedAt:new Date().toISOString()}:null}).filter(Boolean):[],g=async(e,t)=>{if(!t.attachments.length)return;let a=_(t.row.couple_id),i=_(t.row.patient_id),n=_(t.row.cycle_id);for(let r of t.attachments)await l.prisma.$executeRawUnsafe(`
      INSERT INTO ivf_documents (
        tenant_id,
        hospital_id,
        branch_id,
        clinic_id,
        couple_id,
        patient_id,
        cycle_id,
        record_number,
        record_date,
        title,
        status,
        payload,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE,$9,'ACTIVE',$10::jsonb,$11,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,a,i,n,`${t.config.idPrefix}-ATT-${Date.now()}`,r?.name||`${t.config.label} attachment`,JSON.stringify({...r,source_module:t.config.key,source_table:t.config.table,source_id:t.row.id}),e.user.id??null)},E=async(e,t)=>(await l.prisma.$queryRawUnsafe(`
    SELECT id
    FROM ivf_treatment_plans
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
      AND COALESCE(is_deleted,false) = false
    LIMIT 1
    `,t,e.tenantId,e.hospitalId,e.branchId)).length>0,R=async(e,t)=>{let a="id"===t.config.coupleColumn?Number(t.row.id):_(t.row[t.config.coupleColumn||""]),i=(t.config.patientColumn?_(t.row[t.config.patientColumn]):null)||_(t.row.patient_id)||_(t.row.female_patient_id),n="cycles"===t.config.key?Number(t.row.id):_(t.row.cycle_id);a&&await l.prisma.$executeRawUnsafe(`
    INSERT INTO ivf_timeline (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      couple_id,
      patient_id,
      cycle_id,
      event_type,
      event_title,
      event_summary,
      source_table,
      source_id,
      payload,
      created_by,
      updated_by,
      created_at,
      updated_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$14,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,a,i,n,t.config.key.toUpperCase(),`${t.config.label} ${t.action}`,`${t.config.label} workflow record ${t.action}`,t.config.table,Number(t.row.id),JSON.stringify(t.row),e.user.id??null)};async function s(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let o=a.context,{module:d}=await t,u=(0,r.getIvfModuleConfig)(d);if(!u)return i.NextResponse.json({error:"Unknown IVF module."},{status:404});let{searchParams:c}=new URL(e.url),m=_(c.get("couple_id")),p=_(c.get("patient_id")),f=String(c.get("search")||"").trim(),y=String(c.get("q")||f).trim(),h=Math.max(1,Number(c.get("page")||1)||1),b=Math.min(50,Math.max(1,Number(c.get("limit")||10)||10)),C=(h-1)*b,g=[o.tenantId,o.hospitalId,o.branchId],E=[];if(m&&u.coupleColumn&&("id"===u.coupleColumn?E.push("AND t.id = $4"):E.push(`AND t.${u.coupleColumn} = $4`),g.push(m)),p&&u.patientColumn&&!m&&(E.push(`AND t.${u.patientColumn} = $4`),g.push(p)),f&&"embryos"===u.key){g.push(`%${f.toLowerCase()}%`);let e=g.length;E.push(`
      AND (
        LOWER(COALESCE(t.embryo_id,'')) LIKE $${e}
        OR LOWER(COALESCE(t.embryo_grade,'')) LIKE $${e}
        OR LOWER(COALESCE(t.day3_grade,'')) LIKE $${e}
        OR LOWER(COALESCE(t.day5_grade,'')) LIKE $${e}
        OR EXISTS (
          SELECT 1
          FROM ivf_cycles cyc
          WHERE cyc.id = COALESCE(t.cycle_id, t.ivf_cycle_id)
            AND LOWER(COALESCE(cyc.cycle_number,'')) LIKE $${e}
        )
        OR EXISTS (
          SELECT 1
          FROM patients p
          LEFT JOIN ivf_couples c ON c.id = t.couple_id
          WHERE p.id = COALESCE(t.patient_id, c.female_patient_id, c.male_patient_id)
            AND LOWER(CONCAT_WS(' ', p.first_name, p.middle_name, p.last_name, p.phone, p.patient_uid, p.uhid, p.abha_id)) LIKE $${e}
        )
      )
    `)}y.length>=2&&"embryos"!==u.key&&(g.push(`%${y.toLowerCase()}%`),E.push(`AND LOWER(to_jsonb(t)::text) LIKE $${g.length}`));let R=[...g,b,C],$=g.length+1,v=g.length+2,[A,N,w,I,T,S]=await Promise.all([l.prisma.$queryRawUnsafe(`
        SELECT t.*
        FROM ${u.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted, false) = false
          ${E.join("\n")}
        ORDER BY t.${u.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT $${$}
        OFFSET $${v}
        `,...R),l.prisma.$queryRawUnsafe(`
        SELECT screen_key, screen_name, route_path, section_definitions, field_definitions, workflow_definitions
        FROM ivf_screen_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND module_key = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY screen_key
        `,o.tenantId,o.hospitalId,o.branchId,u.key),l.prisma.$queryRawUnsafe(`
        SELECT report_key, report_name, report_category, output_formats
        FROM ivf_report_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND module_key = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY report_category, report_name
        `,o.tenantId,o.hospitalId,o.branchId,u.key),l.prisma.$queryRawUnsafe(`
        SELECT endpoint_key, method, path, permission_key
        FROM ivf_api_endpoint_definitions
        WHERE tenant_id = $1
          AND hospital_id = $2
          AND branch_id = $3
          AND module_key = $4
          AND COALESCE(is_deleted,false) = false
        ORDER BY endpoint_key
        `,o.tenantId,o.hospitalId,o.branchId,u.key),l.prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE t.${u.dateColumn}::date = CURRENT_DATE)::int AS today
        FROM ${u.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        `,o.tenantId,o.hospitalId,o.branchId),l.prisma.$queryRawUnsafe(`
        SELECT COUNT(*)::int AS total_count
        FROM ${u.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
          ${E.join("\n")}
        `,...g)]);return i.NextResponse.json({context:o,module:u,metrics:T[0]||{},pagination:{page:h,limit:b,totalCount:Number(S[0]?.total_count||0)},rows:A,screens:N,reports:w,endpoints:I})}async function d(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let o=a.context,{module:s}=await t,u=(0,r.getIvfModuleConfig)(s);if(!u)return i.NextResponse.json({error:"Unknown IVF module."},{status:404});try{let t,a=await e.json(),s=_(a.id);if(u.createColumns.includes("couple_id")&&!_(a.couple_id))return i.NextResponse.json({error:"Couple selection is required for this IVF workflow."},{status:400});let d=await m(u.table),c=(t=u.createColumns.filter(e=>d.has(e)),Array.from(new Set(t))),f=await h(o,{config:u,writableColumns:c,body:a});if(f)return i.NextResponse.json({error:f},{status:400});let y=_(a.couple_id),$=_(a.patient_id),v=["cycles","embryology","embryos"].includes(u.key)?await b({coupleId:y,explicitPatientId:$}):$,A=_(a.treatment_plan_id);if("cycles"===u.key&&A&&!await E(o,A))return i.NextResponse.json({error:"Selected IVF treatment plan was not found for this hospital and branch. Please select a valid treatment plan or leave it blank."},{status:400});if(s){let e=[s,o.tenantId,o.hospitalId,o.branchId],t=[],_=new Set;for(let i of c){if(_.has(i))continue;let n=(0,r.normalizeIvfValue)(u,i,a[i]);null!==n&&(e.push(n),t.push(`${p(i)} = $${e.length}`),_.add(i))}if(["cycles","embryology","embryos"].includes(u.key)&&d.has("patient_id")&&v&&!_.has("patient_id")&&(e.push(v),t.push(`${p("patient_id")} = $${e.length}`),_.add("patient_id")),!t.length)return i.NextResponse.json({error:"No editable IVF fields were provided."},{status:400});e.push(o.user.id??null);let m=e.length,f=await l.prisma.$queryRawUnsafe(`
      UPDATE ${u.table}
      SET ${t.join(", ")},
          updated_by = $${m},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      RETURNING *
      `,...e);if(!f.length)return i.NextResponse.json({error:"IVF record not found."},{status:404});let y=f[0],h=C(a.attachments);return h.length&&d.has("attachments")&&(await l.prisma.$executeRawUnsafe(`
        UPDATE ${u.table}
        SET attachments = COALESCE(attachments, '[]'::jsonb) || $5::jsonb,
            updated_by = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND hospital_id = $3
          AND branch_id = $4
        `,Number(y.id),o.tenantId,o.hospitalId,o.branchId,JSON.stringify(h),o.user.id??null),y.attachments=[...Array.isArray(y.attachments)?y.attachments:[],...h]),await g(o,{config:u,row:y,attachments:h}),await (0,n.recordClinicalAudit)(o,{moduleName:`ivf_${u.key}`,action:"update",entityType:u.table,entityId:Number(y.id),summary:`${u.label} record updated`,payload:y}),await R(o,{config:u,row:y,action:"updated"}),i.NextResponse.json(y)}let N=["tenant_id","hospital_id","branch_id","clinic_id"],w=new Set(N),I=[o.tenantId,o.hospitalId,o.branchId,o.clinicId];for(let e of(u.uidColumn&&!w.has(u.uidColumn)&&(N.push(u.uidColumn),w.add(u.uidColumn),I.push(`${u.idPrefix}-${Date.now()}`)),c)){if(w.has(e))continue;let t=(0,r.normalizeIvfValue)(u,e,a[e]);null!==t&&(N.push(e),w.add(e),I.push(t))}["cycles","embryology","embryos"].includes(u.key)&&d.has("patient_id")&&v&&!w.has("patient_id")&&(N.push("patient_id"),w.add("patient_id"),I.push(v)),N.push("created_by","updated_by","created_at","updated_at","is_deleted"),I.push(o.user.id??null,o.user.id??null);let T=I.map((e,t)=>`$${t+1}`);T.push("CURRENT_TIMESTAMP","CURRENT_TIMESTAMP","false");let S=(await l.prisma.$queryRawUnsafe(`
      INSERT INTO ${u.table} (
        ${N.join(", ")}
      )
      VALUES (${T.join(", ")})
      RETURNING *
      `,...I))[0],x=C(a.attachments);return x.length&&d.has("attachments")&&(await l.prisma.$executeRawUnsafe(`
      UPDATE ${u.table}
      SET attachments = $5::jsonb,
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
      `,Number(S.id),o.tenantId,o.hospitalId,o.branchId,JSON.stringify(x),o.user.id??null),S.attachments=x),await g(o,{config:u,row:S,attachments:x}),await (0,n.recordClinicalAudit)(o,{moduleName:`ivf_${u.key}`,action:"create",entityType:u.table,entityId:Number(S.id),summary:`${u.label} record created`,payload:S}),await R(o,{config:u,row:S,action:"created"}),i.NextResponse.json(S,{status:201})}catch(e){return console.error("IVF record save failed",{module:u.key,error:e}),i.NextResponse.json({error:e instanceof Error?e.message:"Failed to save IVF record."},{status:500})}}async function u(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let o=a.context,{module:s}=await t,d=(0,r.getIvfModuleConfig)(s);if(!d?.statusColumn)return i.NextResponse.json({error:"This IVF module does not support status updates."},{status:400});let c=await e.json(),m=_(c.id),p=(0,r.normalizeIvfValue)(d,d.statusColumn,c.status);if(!m||null===p)return i.NextResponse.json({error:"Record id and status are required."},{status:400});let f=await l.prisma.$queryRawUnsafe(`
      UPDATE ${d.table}
      SET ${d.statusColumn} = $5,
          updated_by = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND tenant_id = $2
        AND hospital_id = $3
        AND branch_id = $4
        AND COALESCE(is_deleted,false) = false
      RETURNING *
      `,m,o.tenantId,o.hospitalId,o.branchId,p,o.user.id??null);return f.length?(await (0,n.recordClinicalAudit)(o,{moduleName:`ivf_${d.key}`,action:"update",entityType:d.table,entityId:m,summary:`${d.label} status updated`,payload:{status:p}}),i.NextResponse.json(f[0])):i.NextResponse.json({error:"Record not found."},{status:404})}async function c(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let o=a.context,{module:s}=await t,d=(0,r.getIvfModuleConfig)(s);if(!d)return i.NextResponse.json({error:"Unknown IVF module."},{status:404});let{searchParams:u}=new URL(e.url),m=_(u.get("id"));return m?(await l.prisma.$executeRawUnsafe(`
    UPDATE ${d.table}
    SET is_deleted = true,
        updated_by = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND tenant_id = $2
      AND hospital_id = $3
      AND branch_id = $4
    `,m,o.tenantId,o.hospitalId,o.branchId,o.user.id??null),await (0,n.recordClinicalAudit)(o,{moduleName:`ivf_${d.key}`,action:"delete",entityType:d.table,entityId:m,summary:`${d.label} record deleted`}),i.NextResponse.json({success:!0})):i.NextResponse.json({error:"Record id is required."},{status:400})}e.s(["DELETE",0,c,"GET",0,s,"PATCH",0,u,"POST",0,d]),a()}catch(e){a(e)}},!1),606134,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),l=e.i(759756),o=e.i(561916),s=e.i(174677),d=e.i(869741),u=e.i(316795),c=e.i(487718),_=e.i(995169),m=e.i(47587),p=e.i(666012),f=e.i(570101),y=e.i(626937),h=e.i(10372),b=e.i(193695);e.i(52474);var C=e.i(600220),g=e.i(136094),E=t([g]);[g]=E.then?(await E)():E;let $=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/ivf/[module]/route",pathname:"/api/clinical/ivf/[module]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/ivf/[module]/route.ts",nextConfigOutput:"",userland:g,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:A,serverHooks:N}=$;async function R(e,t,a){a.requestMeta&&(0,l.setRequestMeta)(e,a.requestMeta),$.isDev&&(0,l.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/ivf/[module]/route";i=i.replace(/\/index$/,"")||"/";let r=await $.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:g,deploymentId:E,params:R,nextConfig:v,parsedUrl:A,isDraftMode:N,prerenderManifest:w,routerServerContext:I,isOnDemandRevalidate:T,revalidateOnlyGenerated:S,resolvedPathname:x,clientReferenceManifest:O,serverActionsManifest:D}=r,k=(0,d.normalizeAppPath)(i),P=!!(w.dynamicRoutes[k]||w.routes[x]),L=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,A,!1):t.end("This page could not be found"),null);if(P&&!N){let e=!!w.routes[x],t=w.dynamicRoutes[k];if(t&&!1===t.fallback&&!e){if(v.adapterPath)return await L();throw new b.NoFallbackError}}let M=null;!P||$.isDev||N||(M=x,M="/index"===M?"/":M);let U=!0===$.isDev||!P,F=P&&!U;D&&O&&(0,s.setManifestsSingleton)({page:i,clientReferenceManifest:O,serverActionsManifest:D});let q=e.method||"GET",j=(0,o.getTracer)(),H=j.getActiveScopeSpan(),V=!!(null==I?void 0:I.isWrappedByNextServer),W=!!(0,l.getRequestMeta)(e,"minimalMode"),z=(0,l.getRequestMeta)(e,"incrementalCache")||await $.getIncrementalCache(e,v,w,W);null==z||z.resetRequestCache(),globalThis.__incrementalCache=z;let K={params:R,previewProps:w.preview,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:U,incrementalCache:z,cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>$.onRequestError(e,t,i,n,I)},sharedContext:{buildId:g,deploymentId:E}},B=new u.NodeNextRequest(e),G=new u.NodeNextResponse(t),Y=c.NextRequestAdapter.fromNodeNextRequest(B,(0,c.signalFromNodeResponse)(t));try{let r,l=async e=>$.handle(Y,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${q} ${i}`)}),s=async r=>{var o,s;let d=async({previousCacheEntry:n})=>{try{if(!W&&T&&S&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await l(r);e.fetchMetrics=K.renderOpts.fetchMetrics;let o=K.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let s=K.renderOpts.collectedTags;if(!P)return await (0,p.sendResponse)(B,G,i,K.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,f.toNodeOutgoingHttpHeaders)(i.headers);s&&(t[h.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,n=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:T})},!1,I),t}},u=await $.handleResponse({req:e,nextConfig:v,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:w,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:S,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:W});if(!P)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(s=u.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",T?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,f.fromNodeOutgoingHttpHeaders)(u.value.headers);return W&&P||c.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,y.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(B,G,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};V&&H?await s(H):(r=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(_.BaseServerSpan.handleRequest,{spanName:`${q} ${i}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},s),void 0,!V))}catch(t){if(t instanceof b.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:T})},!1,I),P)throw t;return await (0,p.sendResponse)(B,G,new Response(null,{status:500})),null}}e.s(["handler",0,R,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:A})},"routeModule",0,$,"serverHooks",0,N,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,A]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0~ep196._.js.map