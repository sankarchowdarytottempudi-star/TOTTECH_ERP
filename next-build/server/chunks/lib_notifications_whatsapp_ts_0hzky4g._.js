module.exports=[527426,e=>e.a(async(t,a)=>{try{var n=e.i(15270),s=e.i(493399),i=e.i(237239),r=t([n,s]);[n,s]=r.then?(await r)():r;let D={student_created:"Student {{1}} has been created with admission number {{2}} at {{3}}.",payment_received:"Payment received for {{1}}. Invoice {{2}}, reference {{3}}, paid {{4}}, balance {{5}}. Receipt: {{6}}",invoice_created:"Invoice {{2}} for {{1}} has been generated for {{3}}. Due date / link: {{4}}.",payment_due_reminder:"Fee reminder for {{1}}. Invoice {{2}}, amount due {{3}}, due date {{4}}. {{5}} {{6}}",homework_assigned:"Homework assigned to {{1}}: {{2}} for {{3}} ({{4}}), due {{5}}. {{6}}",exam_schedule_created:"Exam scheduled for {{1}}: {{2}} - {{3}} on {{4}} at {{5}}, room {{6}}.",exam_schedule_reminder:"Exam reminder for {{1}}: {{2}} ({{3}}), first exam {{4}}. {{5}}",monthly_attendance_report:"Attendance report for {{1}} - {{2}}: {{3}}%, present {{4}}, absent {{5}}, late {{6}}, leave {{7}}.",student_absent_alert:"Dear parent, {{1}} is marked absent on {{2}} for {{3}}. Please contact {{4}} if this is incorrect.",ptm_scheduled:"Dear Parent,\n\nA Parent Teacher Meeting has been scheduled.\n\nStudent: {{1}}\nClass: {{2}}\nTeacher: {{3}}\n\nDate: {{4}}\nTime: {{5}}\n\nVenue: {{6}}\n\nPlease attend the meeting.\n\n{{7}} School",ptm_reminder:"Reminder:\n\nParent Teacher Meeting for {{1}}\n\nDate: {{2}}\nTime: {{3}}\n\nVenue: {{4}}\n\nPlease attend.\n\n{{5}} School",ptm_feedback:"Thank you for attending PTM.\n\nStudent: {{1}}\n\nTeacher Remarks:\n{{2}}\n\nAction Items:\n{{3}}\n\n{{4}} School"},U=()=>"true"===String(process.env.WHATSAPP_ENABLED||"false").trim().toLowerCase(),C=()=>String(process.env.WHATSAPP_BASE_URL||"").trim(),M=()=>String(process.env.WHATSAPP_API_KEY||"").trim(),P=()=>String(process.env.WHATSAPP_PROVIDER||"interakt").trim().toLowerCase(),F=()=>String(process.env.WHATSAPP_TEMPLATE_LANGUAGE||"en").trim();async function d(e){var t;let a=await n.prisma.$queryRawUnsafe(`
      SELECT setting_value
      FROM governance_settings
      WHERE setting_key = 'whatsapp.enabled'
        AND (school_id IS NULL OR ($1::int IS NOT NULL AND school_id = $1::int))
      ORDER BY school_id NULLS FIRST
      `,e??null);return!a.length||(t=a[a.length-1]?.setting_value,"boolean"==typeof t?t:!t||"object"!=typeof t||!("enabled"in t)||!!t.enabled)}async function l(e){let t={provider:P(),enabled:U(),hasApiKey:!!M(),hasBaseUrl:!!C(),configured:U()&&!!M()&&!!C()},a=await d(e);return{...t,envEnabled:t.enabled,databaseEnabled:a,enabled:t.enabled&&a,configured:t.configured&&a}}function _(e){let t=String(e||"").replace(/\D/g,"").trim();return t?10===t.length?`91${t}`:t:""}let W=e=>JSON.parse(JSON.stringify(e));async function o(e){let t=await n.prisma.$queryRawUnsafe(`
      SELECT is_enabled
      FROM whatsapp_templates
      WHERE template_name = $1
      LIMIT 1
      `,e);return t[0]?.is_enabled!==!1}async function u(e,t="QUEUED",a="PENDING",s=null){var i;let r,d=_(e.recipient),l=e.variables.map(e=>null==e?"":String(e)),o=e.messagePreview||(i=e.templateName,r=D[i]||i,l.forEach((e,t)=>{r=r.replaceAll(`{{${t+1}}}`,e||"-")}),r),m=await n.prisma.$queryRawUnsafe(`
      INSERT INTO whatsapp_messages (
        school_id,
        academic_year_id,
        student_id,
        user_id,
        template_name,
        recipient,
        recipient_masked,
        variables,
        payload,
        message_preview,
        status,
        delivery_status,
        last_error,
        triggered_by,
        entity_type,
        entity_id,
        created_by,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,$11,$12,$13,$14,$15,$16,$17,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING id
      `,e.schoolId??null,e.academicYearId??null,e.studentId??null,e.userId??null,e.templateName,d||null,d?d.length<=4?"****":`${"*".repeat(Math.max(0,d.length-4))}${d.slice(-4)}`:null,JSON.stringify(l),JSON.stringify({template:e.templateName,variables:l}),o,t,a,s,e.triggeredBy??null,e.entityType??null,e.entityId??null,e.userId??null);return m[0]?.id}async function m(e,t){await n.prisma.$executeRawUnsafe(`
    UPDATE whatsapp_messages
    SET status = $2,
        delivery_status = $3,
        provider_response = $4::jsonb,
        provider_message_id = COALESCE($5, provider_message_id),
        last_error = $6,
        retry_count = CASE WHEN $7::boolean THEN retry_count + 1 ELSE retry_count END,
        next_attempt_at = CASE WHEN $7::boolean THEN CURRENT_TIMESTAMP + INTERVAL '5 minutes' ELSE next_attempt_at END,
        sent_at = CASE WHEN $8::boolean THEN CURRENT_TIMESTAMP ELSE sent_at END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,e,t.status,t.deliveryStatus,JSON.stringify(W(t.providerResponse??{})),t.providerMessageId??null,t.lastError??null,!!t.retry,!!t.sent)}async function c(e,t,a,s,i){await n.prisma.$executeRawUnsafe(`
    INSERT INTO whatsapp_retry_attempts (
      message_id,
      attempt_number,
      status,
      error_message,
      provider_response,
      attempted_at
    )
    VALUES ($1,$2,$3,$4,$5::jsonb,CURRENT_TIMESTAMP)
    `,e,t,a,s,JSON.stringify(W(i??{})))}async function p(e){let t,a,s,{start:i,end:r}=(t=new Date,a=new Date(t.getFullYear(),t.getMonth(),1),s=new Date(t.getFullYear(),t.getMonth()+1,0),{start:a,end:s});await n.prisma.$executeRawUnsafe(`
    INSERT INTO whatsapp_metering (
      school_id,
      period_start,
      period_end,
      messages_sent,
      estimated_cost,
      metadata,
      created_at
    )
    VALUES ($1,$2,$3,1,0,$4::jsonb,CURRENT_TIMESTAMP)
    ON CONFLICT (school_id, period_start, period_end)
    DO UPDATE SET
      messages_sent = COALESCE(whatsapp_metering.messages_sent, 0) + 1,
      metadata = COALESCE(whatsapp_metering.metadata, '{}'::jsonb) || EXCLUDED.metadata
    `,e,i,r,JSON.stringify({source:"tottech_one_whatsapp"}))}async function E(e){var t,a;let n,s,i,r,d,_=await l(Number(e.school_id)||null);if(!_.enabled)return{ok:!1,final:!0,deliveryStatus:"DISABLED",error:"WhatsApp integration is disabled.",response:{provider:"whatsapp",enabled:!1}};if(!_.configured)return{ok:!1,final:!0,deliveryStatus:"CONFIG_REQUIRED",error:"WhatsApp provider base URL is not configured.",response:{provider:"whatsapp",hasApiKey:_.hasApiKey,hasBaseUrl:_.hasBaseUrl}};let o=P(),u=function e(t){if(Array.isArray(t))return t.map(e=>null==e?"":String(e));if("string"==typeof t)try{let a=JSON.parse(t);return e(a)}catch{return t?[t]:[]}return[]}(e.variables),m="interakt"===o?(t=e.recipient,n=String(t||"").replace(/\D/g,"").trim(),{countryCode:(r=(i=(s=String(process.env.WHATSAPP_DEFAULT_COUNTRY_CODE||"+91").trim().replace(/^\+?/,"+")).replace(/\D/g,""))&&n.startsWith(i)&&n.length>i.length?{countryCode:s,phoneNumber:n.slice(i.length)}:{countryCode:s,phoneNumber:n}).countryCode,phoneNumber:r.phoneNumber,callbackData:JSON.stringify({message_id:e.id,school_id:e.school_id,academic_year_id:e.academic_year_id}),type:"Template",template:{name:String(e.template_name||""),languageCode:F(),bodyValues:u}}):{to:e.recipient,type:"template",template:{name:e.template_name,language:{code:F()},variables:u},metadata:{message_id:e.id,school_id:e.school_id,academic_year_id:e.academic_year_id}},c=await fetch(function(){let e=C().trim(),t=e.replace(/\/+$/,"");if(!t)return"";if("interakt"===P()){if(/\/v1\/public\/message$/i.test(t))return`${t}/`;if(/\/v1\/public$/i.test(t))return`${t}/message/`}return/send|message/i.test(t)?e:`${t}/messages`}(),{method:"POST",headers:{Authorization:"interakt"===o?`Basic ${M()}`:`Bearer ${M()}`,"Content-Type":"application/json"},body:JSON.stringify(m)}),p=await c.text(),E={body:p};try{E=p?JSON.parse(p):{}}catch{E={body:p}}return c.ok?{ok:!0,final:!0,deliveryStatus:"SENT",providerMessageId:(d=(a=E).data,String(a.id||a.message_id||a.messageId||d?.id||d?.message_id||d?.messageId||"")||null),response:E}:{ok:!1,final:c.status>=400&&c.status<500,deliveryStatus:"FAILED",error:`Provider returned HTTP ${c.status}`,response:E}}async function h(e=10){let t=await n.prisma.$queryRawUnsafe(`
      SELECT *
      FROM whatsapp_messages
      WHERE (
          status IN ('QUEUED', 'RETRY')
          OR (
            status = 'FAILED'
            AND delivery_status IN ('CONFIG_REQUIRED', 'DISABLED')
          )
          OR (
            status = 'FAILED'
            AND delivery_status = 'FAILED'
            AND last_error ILIKE 'Provider returned HTTP 404%'
          )
        )
        AND COALESCE(next_attempt_at, CURRENT_TIMESTAMP) <= CURRENT_TIMESTAMP
        AND COALESCE(retry_count, 0) < COALESCE(max_retries, 3)
      ORDER BY created_at ASC
      LIMIT $1
      `,e),a=[];for(let e of t){let t=Number(e.retry_count||0)+1;try{let n=await E(e);if(n.ok)await m(Number(e.id),{status:"SENT",deliveryStatus:"SENT",providerResponse:n.response,providerMessageId:n.providerMessageId,sent:!0}),await c(Number(e.id),t,"SENT",null,n.response),await p(Number(e.school_id)||null),await (0,s.recordEvent)({school_id:Number(e.school_id)||null,academic_year_id:Number(e.academic_year_id)||null,user_id:Number(e.user_id)||null,module_name:"whatsapp",event_type:"WHATSAPP_MESSAGE_SENT",action:"send",entity_type:String(e.entity_type||"whatsapp_message"),entity_id:Number(e.entity_id||e.id)||null,summary:"WhatsApp message sent",payload:{message_id:e.id,template:e.template_name,recipient:e.recipient_masked,delivery_status:"SENT"}}),a.push({id:e.id,status:"SENT"});else{let i="CONFIG_REQUIRED"===n.deliveryStatus||"DISABLED"===n.deliveryStatus,r=!n.final&&t<Number(e.max_retries||3),d=i?"QUEUED":r?"RETRY":"FAILED",l=n.error||"WhatsApp provider failed.";await m(Number(e.id),{status:d,deliveryStatus:n.deliveryStatus,providerResponse:n.response,lastError:l,retry:r}),await c(Number(e.id),t,d,l,n.response),await (0,s.recordEvent)({school_id:Number(e.school_id)||null,academic_year_id:Number(e.academic_year_id)||null,user_id:Number(e.user_id)||null,module_name:"whatsapp",event_type:"WHATSAPP_MESSAGE_FAILED",action:"send",entity_type:String(e.entity_type||"whatsapp_message"),entity_id:Number(e.entity_id||e.id)||null,severity:"WARN",summary:"WhatsApp message failed",payload:{message_id:e.id,template:e.template_name,recipient:e.recipient_masked,delivery_status:n.deliveryStatus,error:l}}),a.push({id:e.id,status:d})}}catch(s){let n=s instanceof Error?s.message:"Unknown WhatsApp provider error";await m(Number(e.id),{status:"RETRY",deliveryStatus:"FAILED",lastError:n,providerResponse:{},retry:!0}),await c(Number(e.id),t,"RETRY",n,{}),a.push({id:e.id,status:"RETRY"})}}return a}async function y(e){let t=_(e.recipient);if(!await o(e.templateName))return{id:await u(e,"SKIPPED","TEMPLATE_DISABLED","WhatsApp template is disabled."),status:"SKIPPED"};if(!t){let t=await u(e,"FAILED","NO_RECIPIENT","No WhatsApp recipient phone number found.");return await (0,s.recordEvent)({school_id:e.schoolId??null,academic_year_id:e.academicYearId??null,user_id:e.userId??null,module_name:"whatsapp",event_type:"WHATSAPP_MESSAGE_FAILED",action:"queue",entity_type:e.entityType||"whatsapp_message",entity_id:e.entityId||t||null,severity:"WARN",summary:"WhatsApp message failed",payload:{message_id:t,template:e.templateName,delivery_status:"NO_RECIPIENT"}}),{id:t,status:"FAILED"}}let a=await u({...e,recipient:t});return await h(25),{id:a,status:"QUEUED"}}function N(e){return String(e.name||"").trim()||[e.first_name,e.middle_name,e.last_name].filter(Boolean).join(" ").trim()||"Student"}let H=e=>`Rs. ${Number(e||0).toFixed(2)}`,k=e=>e?new Date(e).toLocaleDateString("en-IN"):"-",x=e=>e?String(e):"-";async function T(e,t){let a=(await n.prisma.$queryRawUnsafe(`
      SELECT s.*, sc.school_name
      FROM students s
      LEFT JOIN schools sc ON sc.id = s.school_id
      WHERE s.id = $1
      LIMIT 1
      `,e))[0];return a?y({templateName:"student_created",schoolId:Number(a.school_id)||null,academicYearId:Number(a.academic_year_id)||null,studentId:e,userId:t??null,recipient:String(a.father_phone||a.mother_phone||a.phone||""),variables:[N(a),String(a.admission_number||"-"),String(a.school_name||"-")],triggeredBy:"STUDENT_CREATED",entityType:"student",entityId:e}):null}async function S(e,t){let a=(await n.prisma.$queryRawUnsafe(`
      SELECT
        a.*,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone,
        sc.school_name,
        sc.phone AS school_phone
      FROM attendance_master a
      LEFT JOIN students s ON s.id = a.student_id
      LEFT JOIN schools sc ON sc.id = a.school_id
      WHERE a.id = $1
        AND UPPER(COALESCE(a.status,'')) = 'ABSENT'
      LIMIT 1
      `,e))[0];return a?y({templateName:"student_absent_alert",schoolId:Number(a.school_id)||null,academicYearId:Number(a.academic_year_id)||null,studentId:Number(a.student_id)||null,userId:t??null,recipient:String(a.father_phone||a.mother_phone||a.phone||""),variables:[N(a),k(a.attendance_date),String(a.school_name||"school"),String(a.school_phone||"the school office")],triggeredBy:"STUDENT_ABSENT",entityType:"attendance",entityId:e}):null}async function I(e,t){let a=(await n.prisma.$queryRawUnsafe(`
      SELECT
        i.*,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      WHERE i.id = $1
      LIMIT 1
      `,e))[0];return a?y({templateName:"invoice_created",schoolId:Number(a.school_id)||null,academicYearId:Number(a.academic_year_id)||null,studentId:Number(a.student_id)||null,userId:t??null,recipient:String(a.father_phone||a.mother_phone||a.phone||""),variables:[N(a),String(a.invoice_number||"-"),H(a.total_amount),`${k(a.due_date)} | Invoice PDF: ${(0,i.buildPublicInvoicePdfUrl)(e)}`],triggeredBy:"INVOICE_GENERATED",entityType:"student",entityId:Number(a.student_id)||e}):null}async function R(e,t){let a=(await n.prisma.$queryRawUnsafe(`
      SELECT
        p.*,
        i.invoice_number,
        i.balance_amount,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM payments p
      LEFT JOIN invoices i ON i.id = p.invoice_id
      LEFT JOIN students s ON s.id = p.student_id
      WHERE p.id = $1
      LIMIT 1
      `,e))[0];return a?y({templateName:"payment_received",schoolId:Number(a.school_id)||null,academicYearId:Number(a.academic_year_id)||null,studentId:Number(a.student_id)||null,userId:t??null,recipient:String(a.father_phone||a.mother_phone||a.phone||""),variables:[N(a),String(a.invoice_number||"-"),String(a.reference_number||a.receipt_number||"-"),H(a.amount),H(a.balance_amount),(0,i.buildPublicPaymentReceiptUrl)(e)],triggeredBy:"PAYMENT_RECORDED",entityType:"student",entityId:Number(a.student_id)||e}):null}async function g(e,t){let a=await n.prisma.$queryRawUnsafe(`
      SELECT
        ha.*,
        sub.subject_name,
        c.class_name,
        sec.section_name,
        s.id AS student_id,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM homework_assignments ha
      LEFT JOIN subjects sub ON sub.id = ha.subject_id
      LEFT JOIN classes c ON c.id = ha.class_id
      LEFT JOIN sections sec ON sec.id = ha.section_id
      JOIN students s
        ON s.school_id = ha.school_id
       AND COALESCE(s.current_class_id, s.section_id) IS NOT NULL
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
       AND sye.academic_year_id = ha.academic_year_id
      WHERE ha.id = $1
        AND COALESCE(s.current_class_id, sye.class_id) = ha.class_id
        AND COALESCE(s.current_section_id, s.section_id, sye.section_id) = ha.section_id
      LIMIT 300
      `,e),s=[];for(let n of a)s.push(await y({templateName:"homework_assigned",schoolId:Number(n.school_id)||null,academicYearId:Number(n.academic_year_id)||null,studentId:Number(n.student_id)||null,userId:t??null,recipient:String(n.father_phone||n.mother_phone||n.phone||""),variables:[N(n),String(n.title||"-"),String(n.subject_name||"-"),`${n.class_name||"-"} / ${n.section_name||"-"}`,k(n.due_date),String(n.description||"-")],triggeredBy:"HOMEWORK_ASSIGNED",entityType:"student",entityId:Number(n.student_id)||e}));return s}async function b(e,t){let a=await n.prisma.$queryRawUnsafe(`
      SELECT
        es.*,
        COALESCE(e.exam_name, et.exam_name, 'Exam') AS exam_name,
        sub.subject_name,
        c.class_name,
        sec.section_name,
        s.id AS student_id,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM exam_schedule es
      LEFT JOIN exams e ON e.id = es.exam_id
      LEFT JOIN exam_types et ON et.id = es.exam_type_id
      LEFT JOIN subjects sub ON sub.id = es.subject_id
      LEFT JOIN classes c ON c.id = es.class_id
      LEFT JOIN sections sec ON sec.id = es.section_id
      JOIN students s ON s.school_id = es.school_id
      LEFT JOIN student_year_enrollments sye
        ON sye.student_id = s.id
       AND sye.academic_year_id = es.academic_year_id
      WHERE es.id = $1
        AND COALESCE(s.current_class_id, sye.class_id) = es.class_id
        AND COALESCE(s.current_section_id, s.section_id, sye.section_id) = es.section_id
      LIMIT 300
      `,e),s=[];for(let n of a)s.push(await y({templateName:"exam_schedule_created",schoolId:Number(n.school_id)||null,academicYearId:Number(n.academic_year_id)||null,studentId:Number(n.student_id)||null,userId:t??null,recipient:String(n.father_phone||n.mother_phone||n.phone||""),variables:[N(n),String(n.exam_name||"-"),String(n.subject_name||"-"),k(n.exam_date),`${x(n.start_time)}-${x(n.end_time)}`,String(n.room_no||"-")],triggeredBy:"EXAM_SCHEDULE_CREATED",entityType:"student",entityId:Number(n.student_id)||e}));return s}async function A(e,t,a){let s=(await n.prisma.$queryRawUnsafe(`
      SELECT
        i.*,
        s.name,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.phone,
        s.father_phone,
        s.mother_phone
      FROM invoices i
      LEFT JOIN students s ON s.id = i.student_id
      WHERE i.id = $1
      LIMIT 1
      `,e))[0];return s?y({templateName:"payment_due_reminder",schoolId:Number(s.school_id)||null,academicYearId:Number(s.academic_year_id)||null,studentId:Number(s.student_id)||null,userId:a??null,recipient:String(s.father_phone||s.mother_phone||s.phone||""),variables:[N(s),String(s.invoice_number||"-"),H(s.balance_amount),k(s.due_date),t,(0,i.buildPublicInvoicePdfUrl)(e)],triggeredBy:"PAYMENT_DUE_REMINDER",entityType:"student",entityId:Number(s.student_id)||e}):null}async function f(e){let t=(await n.prisma.$queryRawUnsafe(`
      SELECT *
      FROM students
      WHERE id = $1
      LIMIT 1
      `,e.studentId))[0];if(!t)return null;let a=e.present+e.absent+e.late+e.leave,s=a>0?Math.round(e.present/a*100):0;return y({templateName:"monthly_attendance_report",schoolId:Number(t.school_id)||null,academicYearId:Number(t.academic_year_id)||null,studentId:e.studentId,userId:e.userId??null,recipient:String(t.father_phone||t.mother_phone||t.phone||""),variables:[N(t),e.month,String(s),String(e.present),String(e.absent),String(e.late),String(e.leave)],triggeredBy:"MONTHLY_ATTENDANCE_REPORT",entityType:"student",entityId:e.studentId})}async function L(e,t,a){let s=JSON.stringify({enabled:e});if(!a){let e=await n.prisma.$queryRawUnsafe(`
        SELECT id
        FROM governance_settings
        WHERE school_id IS NULL
          AND setting_key = 'whatsapp.enabled'
        ORDER BY id DESC
        LIMIT 1
        `),a=e[0]?.id||null;if(a){await n.prisma.$executeRawUnsafe(`
        UPDATE governance_settings
        SET setting_value = $2::jsonb,
            updated_by = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,a,s,t??null),await n.prisma.$executeRawUnsafe(`
        DELETE FROM governance_settings
        WHERE school_id IS NULL
          AND setting_key = 'whatsapp.enabled'
          AND id <> $1
        `,a);return}}await n.prisma.$executeRawUnsafe(`
    INSERT INTO governance_settings (
      school_id,
      setting_key,
      setting_value,
      description,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1,'whatsapp.enabled',$2::jsonb,'WhatsApp notification enablement', $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (school_id, setting_key)
    DO UPDATE SET
      setting_value = EXCLUDED.setting_value,
      updated_by = EXCLUDED.updated_by,
      updated_at = CURRENT_TIMESTAMP
    `,a??null,s,t??null)}async function O(e,t){await n.prisma.$executeRawUnsafe(`
    UPDATE whatsapp_templates
    SET is_enabled = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE template_name = $1
    `,e,t)}async function v(e,t){let[a,s,i,r,d]=await Promise.all([l(e),n.prisma.$queryRawUnsafe(`
      SELECT
        template_name,
        trigger_event,
        description,
        variables,
        is_enabled,
        updated_at
      FROM whatsapp_templates
      ORDER BY template_name ASC
      `),n.prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*)::int AS total_messages,
        COUNT(*) FILTER (WHERE status = 'SENT')::int AS sent_messages,
        COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed_messages,
        COUNT(*) FILTER (WHERE status IN ('QUEUED','RETRY'))::int AS queued_messages,
        COUNT(*) FILTER (WHERE delivery_status = 'CONFIG_REQUIRED')::int AS config_required_messages,
        COUNT(*) FILTER (WHERE delivery_status = 'NO_RECIPIENT')::int AS no_recipient_messages
      FROM whatsapp_messages
      WHERE ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      `,e??null,t??null),n.prisma.$queryRawUnsafe(`
      SELECT
        id,
        template_name,
        recipient_masked,
        status,
        delivery_status,
        last_error,
        retry_count,
        created_at,
        updated_at
      FROM whatsapp_messages
      WHERE status = 'FAILED'
        AND ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      ORDER BY updated_at DESC
      LIMIT 50
      `,e??null,t??null),n.prisma.$queryRawUnsafe(`
      SELECT
        id,
        template_name,
        recipient_masked,
        status,
        delivery_status,
        retry_count,
        next_attempt_at,
        created_at
      FROM whatsapp_messages
      WHERE status IN ('QUEUED','RETRY')
        AND ($1::int IS NULL OR school_id = $1::int)
        AND ($2::int IS NULL OR academic_year_id = $2::int OR academic_year_id IS NULL)
      ORDER BY next_attempt_at ASC NULLS FIRST
      LIMIT 50
      `,e??null,t??null)]);return{provider:a,templates:s,stats:i[0]||{},failedMessages:r,retryQueue:d}}async function $(e){let t=(e.messageId?await n.prisma.$queryRawUnsafe(`
          SELECT *
          FROM whatsapp_messages
          WHERE id = $1
          LIMIT 1
          `,e.messageId):await n.prisma.$queryRawUnsafe(`
          SELECT *
          FROM whatsapp_messages
          WHERE provider_message_id = $1
          LIMIT 1
          `,e.providerMessageId||""))[0];return t?(await n.prisma.$executeRawUnsafe(`
    INSERT INTO whatsapp_delivery_events (
      message_id,
      delivery_status,
      provider_response,
      metadata,
      received_at
    )
    VALUES ($1,$2,$3::jsonb,$4::jsonb,CURRENT_TIMESTAMP)
    `,Number(t.id),e.deliveryStatus,JSON.stringify(W(e.providerResponse||{})),JSON.stringify(W(e.metadata||{}))),await n.prisma.$executeRawUnsafe(`
    UPDATE whatsapp_messages
    SET delivery_status = $2,
        delivered_at = CASE WHEN $2 IN ('DELIVERED','READ') THEN CURRENT_TIMESTAMP ELSE delivered_at END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,Number(t.id),e.deliveryStatus),await (0,s.recordEvent)({school_id:Number(t.school_id)||null,academic_year_id:Number(t.academic_year_id)||null,user_id:Number(t.user_id)||null,module_name:"whatsapp",event_type:"WHATSAPP_DELIVERY_UPDATED",action:"delivery",entity_type:String(t.entity_type||"whatsapp_message"),entity_id:Number(t.entity_id||t.id)||null,summary:"WhatsApp delivery status updated",payload:{message_id:t.id,template:t.template_name,recipient:t.recipient_masked,delivery_status:e.deliveryStatus}}),{id:t.id,delivery_status:e.deliveryStatus}):null}let J={ptm_scheduled:{templateName:"PTM Scheduled",subject:"Parent teacher meeting scheduled",body:"Dear Parent,\n\nA Parent Teacher Meeting has been scheduled.\n\nStudent: {{1}}\nClass: {{2}}\nTeacher: {{3}}\n\nDate: {{4}}\nTime: {{5}}\n\nVenue: {{6}}\n\nPlease attend the meeting.\n\n{{7}} School",variables:["student_name","class_name","teacher_name","date","time","venue","school_name"]},ptm_reminder:{templateName:"PTM Reminder",subject:"Parent teacher meeting reminder",body:"Reminder:\n\nParent Teacher Meeting for {{1}}\n\nDate: {{2}}\nTime: {{3}}\n\nVenue: {{4}}\n\nPlease attend.\n\n{{5}} School",variables:["student_name","date","time","venue","school_name"]},ptm_feedback:{templateName:"PTM Feedback",subject:"Thank you for attending PTM",body:"Thank you for attending PTM.\n\nStudent: {{1}}\n\nTeacher Remarks:\n{{2}}\n\nAction Items:\n{{3}}\n\n{{4}} School",variables:["student_name","teacher_remarks","action_items","school_name"]}};async function w(e,t){if(!e)return[];let a=(await n.prisma.$queryRawUnsafe(`
    SELECT school_name
    FROM schools
    WHERE id = $1::int
    LIMIT 1
    `,e))[0]||{},s=String(a.school_name||"School").trim()||"School",i=[];for(let[a,r]of Object.entries(J)){let d=await n.prisma.$queryRawUnsafe(`
      INSERT INTO whatsapp_templates (
        school_id,
        template_key,
        template_name,
        subject,
        body,
        variables,
        channel,
        is_enabled,
        created_by,
        updated_by,
        created_at,
        updated_at,
        metadata
      )
      SELECT
        $1::int,
        $2,
        $3,
        $4,
        REPLACE($5, '{{7}}', $6),
        $7::jsonb,
        'WHATSAPP',
        true,
        $8::int,
        $8::int,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        $9::jsonb
      WHERE NOT EXISTS (
        SELECT 1
        FROM whatsapp_templates
        WHERE school_id = $1::int
          AND template_key = $2
          AND channel = 'WHATSAPP'
          AND COALESCE(is_deleted,false)=false
      )
      RETURNING id, template_key
      `,e,a,r.templateName,r.subject,r.body,s,JSON.stringify(r.variables),t??null,JSON.stringify({source:"ptm_defaults"}));i.push(d[0]||null)}return i}e.s(["ensurePtmWhatsAppTemplates",0,w,"getWhatsAppDashboard",0,v,"notifyExamScheduleCreated",0,b,"notifyHomeworkAssigned",0,g,"notifyInvoiceCreated",0,I,"notifyPaymentReceived",0,R,"notifyStudentAbsent",0,S,"notifyStudentCreated",0,T,"processWhatsAppQueue",0,h,"queueMonthlyAttendanceReport",0,f,"queuePaymentDueReminder",0,A,"queueWhatsAppMessage",0,y,"registerWhatsAppDeliveryEvent",0,$,"setWhatsAppEnabled",0,L,"setWhatsAppTemplateEnabled",0,O]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=lib_notifications_whatsapp_ts_0hzky4g._.js.map