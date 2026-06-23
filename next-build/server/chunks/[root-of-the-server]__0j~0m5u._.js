module.exports=[193695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},274173,e=>{"use strict";let t="tottech_clinical_services";e.s(["dashboardForProject",0,function(e){return e===t?"/clinical-services":"/"},"isClinicalServicesEmail",0,function(e){let t=String(e||"").trim().toLowerCase();return"cs-superadmin@erp.com"===t||t.startsWith("cs-")},"projectForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?t:"tottech_one"},"projectTypeForPlatform",0,function(e){return"CLINICAL"===String(e||"").trim().toUpperCase()?"CLINICAL":"ERP"}])},503031,e=>{"use strict";let t=[{startsWith:"/clinical-services/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patients",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/patient-lookup",moduleCode:"PATIENTS"},{startsWith:"/api/clinical/global-search",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/patient-timeline",moduleCode:"PATIENTS"},{startsWith:"/clinical-services/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/api/clinical/appointments",moduleCode:"APPOINTMENTS"},{startsWith:"/clinical-services/doctors",moduleCode:"OP"},{startsWith:"/api/clinical/doctors",moduleCode:"OP"},{startsWith:"/clinical-services/operations",moduleCode:"OP"},{startsWith:"/api/clinical/operations/vitals",moduleCode:"OP"},{includes:"/hms/ip",moduleCode:"IP"},{includes:"/ip",moduleCode:"IP"},{includes:"/admission",moduleCode:"IP"},{includes:"/discharge",moduleCode:"IP"},{includes:"/bed",moduleCode:"IP"},{includes:"/ward",moduleCode:"IP"},{startsWith:"/api/clinical/operations/rooms",moduleCode:"IP"},{includes:"/hms/er",moduleCode:"ER"},{includes:"/emergency",moduleCode:"ER"},{includes:"/icu",moduleCode:"ICU"},{includes:"/ventilator",moduleCode:"ICU"},{includes:"/ot",moduleCode:"OT"},{startsWith:"/api/clinical/operations/ot-schedules",moduleCode:"OT"},{startsWith:"/clinical-services/ivf",moduleCode:"IVF"},{startsWith:"/api/clinical/ivf",moduleCode:"IVF"},{startsWith:"/clinical-services/laboratory",moduleCode:"LAB"},{startsWith:"/api/clinical/operations/lab",moduleCode:"LAB"},{startsWith:"/clinical-services/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/api/clinical/radiology",moduleCode:"RADIOLOGY"},{startsWith:"/clinical-services/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/pharmacy",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/medicines",moduleCode:"PHARMACY"},{startsWith:"/api/clinical/operations/pharmacy-dispense",moduleCode:"PHARMACY"},{includes:"/inventory",moduleCode:"INVENTORY"},{includes:"/stock",moduleCode:"INVENTORY"},{includes:"/warehouse",moduleCode:"INVENTORY"},{includes:"/asset",moduleCode:"INVENTORY"},{includes:"/procurement",moduleCode:"PROCUREMENT"},{includes:"/purchase",moduleCode:"PROCUREMENT"},{includes:"/grn",moduleCode:"PROCUREMENT"},{startsWith:"/api/clinical/billing",moduleCode:"BILLING"},{includes:"/billing",moduleCode:"BILLING"},{startsWith:"/api/clinical/operations/payments",moduleCode:"BILLING"},{includes:"/insurance",moduleCode:"INSURANCE"},{includes:"/claim",moduleCode:"INSURANCE"},{includes:"/preauth",moduleCode:"INSURANCE"},{includes:"/referral",moduleCode:"REFERRAL"},{startsWith:"/clinical-services/finance",moduleCode:"FINANCE"},{startsWith:"/api/clinical/finance",moduleCode:"FINANCE"},{startsWith:"/clinical-services/hr",moduleCode:"HR"},{startsWith:"/api/clinical/hr",moduleCode:"HR"},{startsWith:"/clinical-services/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/analytics",moduleCode:"ANALYTICS"},{startsWith:"/api/clinical/ai",moduleCode:"AI"},{includes:"/ai",moduleCode:"AI"}];e.s(["CLINICAL_MODULE_CODES",0,["PATIENTS","APPOINTMENTS","OP","IP","ER","ICU","OT","IVF","LAB","RADIOLOGY","PHARMACY","INVENTORY","PROCUREMENT","BILLING","INSURANCE","REFERRAL","FINANCE","HR","ANALYTICS","AI"],"CLINICAL_MODULE_LABELS",0,{PATIENTS:"Patients",APPOINTMENTS:"Appointments",OP:"Outpatient / Doctors",IP:"Inpatient",ER:"Emergency",ICU:"ICU",OT:"Operation Theatre",IVF:"IVF & Fertility",LAB:"Laboratory",RADIOLOGY:"Radiology",PHARMACY:"Pharmacy",INVENTORY:"Inventory",PROCUREMENT:"Procurement",BILLING:"Billing",INSURANCE:"Insurance",REFERRAL:"Referral",FINANCE:"Finance",HR:"HR",ANALYTICS:"Analytics",AI:"AI"},"isModuleLicensed",0,function(e,t){return!(e&&Array.isArray(t)&&0!==t.length)||t.includes(e)},"moduleCodeForClinicalPath",0,function(e){let a=e.split("?")[0].split("#")[0].toLowerCase(),i=t.find(e=>!!(e.startsWith&&a.startsWith(e.startsWith)||e.includes&&a.includes(e.includes)));return i?.moduleCode??null}])},780907,e=>e.a(async(t,a)=>{try{var i=e.i(493458),n=e.i(89171),r=e.i(368105),o=e.i(15270),l=e.i(274173),s=e.i(503031),c=t([r,o]);[r,o]=c.then?(await c)():c;let h=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null},C=e=>e&&"object"==typeof e?e:{},y=(...e)=>e.map(e=>String(e||"").trim()).find(Boolean)||"",b=new Set(["tottech_super_admin","clinical_super_admin","organization_admin"]);async function d(e,t){return(await o.prisma.$queryRawUnsafe(`
      SELECT module_code
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
        AND COALESCE(enabled, false) = true
      ORDER BY module_code ASC
      `,e,t)).map(e=>String(e.module_code||"")).filter(e=>Object.prototype.hasOwnProperty.call(s.CLINICAL_MODULE_LABELS,e))}async function u(e,t){let a=await o.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS count
      FROM hospital_module_access
      WHERE tenant_id = $1
        AND hospital_id = $2
      `,e,t);return Number(a[0]?.count||0)>0}async function p(e){let t=await (0,r.getCurrentUser)();if(!t||!(t?.project==="tottech_clinical_services"||"CLINICAL"===String(t?.projectType||"").trim().toUpperCase()||"CLINICAL"===String(t?.platform_type||"").trim().toUpperCase()||(0,l.isClinicalServicesEmail)(t?.email)))return null;let a=await (0,i.cookies)(),n=h(a.get("active_clinic_id")?.value),s=h(a.get("active_hospital_id")?.value),c=h(a.get("active_branch_id")?.value),u=e?new URL(e.url):null,p=h(u?.searchParams.get("clinic_id")),_=h(u?.searchParams.get("hospital_id")),m=h(u?.searchParams.get("branch_id")),g=(await o.prisma.$queryRawUnsafe(`
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
      `,t.id??null,p??n,_??s,m??c))[0];if(!g&&s&&t.id&&(g=(await o.prisma.$queryRawUnsafe(`
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
        `,t.id,s,Array.from(b),c,n))[0]),!g)return null;let E=C(g.organization_branding),A=C(g.hospital_branding),N=C(g.branch_branding),R=C(g.clinic_branding),f={...E,...A,...N,...R},S=y(f.logoUrl,f.logo_url,f.logo,f.hospital_logo,f.image),I=y(f.name,f.hospitalName,f.hospital_name,g.hospital_name,g.branch_name,g.clinic_name,g.organization_name),O=await d(Number(g.tenant_id),Number(g.hospital_id));return{user:t,tenantId:Number(g.tenant_id),hospitalId:Number(g.hospital_id),branchId:Number(g.branch_id),clinicId:Number(g.clinic_id),organizationId:h(g.organization_id),organizationName:String(g.organization_name||""),tenantName:String(g.tenant_name||""),hospitalName:String(g.hospital_name||""),hospitalAddress:String(g.hospital_address||""),hospitalPhone:String(g.hospital_phone||""),hospitalEmail:String(g.hospital_email||""),hospitalLicenseNumber:String(g.hospital_license_number||""),branchName:String(g.branch_name||""),clinicName:String(g.clinic_name||""),roleKey:String(g.role_key||"clinical_user"),roleName:String(g.role_name||"Clinical User"),permissions:g.permissions||{},licensedModules:O,branding:{name:I||"Hospital",logoUrl:S||null,primaryColor:y(f.primaryColor,f.primary_color)||"#04142E",accentColor:y(f.accentColor,f.accent_color)||"#D4AF37",source:S?"hospital":"generated"}}}async function _(e){let t=await p(e);if(!t)return{context:null,response:function(e="Clinical Services login required."){return n.NextResponse.json({error:e},{status:401})}()};if(e){let a=new URL(e.url).pathname,i=(0,s.moduleCodeForClinicalPath)(a);if(i&&!(!await u(t.tenantId,t.hospitalId)||(t.licensedModules||[]).includes(i)))return{context:null,response:n.NextResponse.json({error:"Module Not Licensed",module_code:i,module_name:s.CLINICAL_MODULE_LABELS[i]},{status:403})}}return{context:t,response:null}}async function m(e,t){await o.prisma.$executeRawUnsafe(`
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
    `,e.tenantId,e.clinicId,e.hospitalId,e.branchId,e.user.id??null,t.moduleName,t.action,t.entityType??null,t.entityId??null,t.summary??null,JSON.stringify(t.payload??{}))}e.s(["recordClinicalAudit",0,m,"requireClinicalContext",0,_]),a()}catch(e){a(e)}},!1),961806,e=>{"use strict";let t={employees:{key:"employees",label:"Employee Master",table:"clinical_hr_employees",category:"HRMS",dateColumn:"created_at",description:"Hospital workforce master for doctors, nurses, embryologists, technicians, pharmacists, finance, HR, and corporate teams.",primaryColumns:["employee_id","first_name","department","designation","employee_status"]},recruitment:{key:"recruitment",label:"Job Requisitions",table:"clinical_hr_requisitions",category:"Recruitment",dateColumn:"created_at",description:"Approved hiring demand, department vacancies, requested positions, and requisition workflow.",primaryColumns:["requisition_number","department","position","vacancies","approval_status"]},candidates:{key:"candidates",label:"Candidates",table:"clinical_hr_candidates",category:"Recruitment",dateColumn:"created_at",description:"Candidate pipeline from application, screening, interview, offer, acceptance, and joining.",primaryColumns:["candidate_id","candidate_name","qualification","experience_years","workflow_stage"]},onboarding:{key:"onboarding",label:"Onboarding",table:"clinical_hr_onboarding_checklists",category:"Onboarding",dateColumn:"created_at",description:"ID verification, background verification, medical checkup, document submission, system access, and training assignment.",primaryColumns:["checklist_item","checklist_category","status","due_date"]},attendance:{key:"attendance",label:"Attendance",table:"clinical_hr_attendance",category:"Attendance",dateColumn:"attendance_date",description:"Biometric, mobile, web, RFID, and face recognition attendance with geo validation.",primaryColumns:["attendance_date","source","in_time","out_time","attendance_status","geo_validated"]},"geo-attendance":{key:"geo-attendance",label:"Geo Attendance Policy",table:"clinical_hr_geo_attendance_policies",category:"Attendance",dateColumn:"created_at",description:"Hospital coordinate and one-meter mobile attendance radius policy managed by hospital administrators.",primaryColumns:["policy_key","latitude","longitude","allowed_radius_meters","mobile_attendance_enabled"]},biometric:{key:"biometric",label:"Biometric Devices",table:"clinical_hr_biometric_devices",category:"Biometric",dateColumn:"created_at",description:"ZKTeco, eSSL, Matrix, Realtime, and Mantra device registry with sync status.",primaryColumns:["device_id","vendor","device_location","ip_address","sync_status"]},"biometric-logs":{key:"biometric-logs",label:"Biometric Logs",table:"clinical_hr_biometric_logs",category:"Biometric",dateColumn:"punch_time",description:"Raw biometric punch log ingestion and sync status evidence.",primaryColumns:["punch_time","punch_type","sync_status","raw_payload"]},shifts:{key:"shifts",label:"Shift Master",table:"clinical_hr_shifts",category:"Roster",dateColumn:"created_at",description:"Morning, evening, night, general, and rotational shift definitions with grace time.",primaryColumns:["shift_code","shift_name","shift_type","start_time","end_time","grace_minutes"]},roster:{key:"roster",label:"Roster Management",table:"clinical_hr_rosters",category:"Roster",dateColumn:"roster_date",description:"Nurse and staff rosters by ward, department, employee, shift, and date.",primaryColumns:["roster_date","ward","department","roster_status"]},leave:{key:"leave",label:"Leave Requests",table:"clinical_hr_leave_requests",category:"Leave",dateColumn:"created_at",description:"Casual, sick, earned, maternity, paternity, and compensatory leave approval workflow.",primaryColumns:["start_date","end_date","reason","approval_status"]},"leave-types":{key:"leave-types",label:"Leave Types",table:"clinical_hr_leave_types",category:"Leave",dateColumn:"created_at",description:"Leave quota master with carry-forward controls.",primaryColumns:["leave_code","leave_name","annual_quota","carry_forward"]},payroll:{key:"payroll",label:"Payroll",table:"clinical_hr_payroll",category:"Payroll",dateColumn:"created_at",description:"Payroll lines generated from attendance, overtime, deductions, salary calculation, approval, and payslip.",primaryColumns:["attendance_days","overtime_hours","gross_salary","deductions","net_salary","approval_status"]},"payroll-runs":{key:"payroll-runs",label:"Payroll Runs",table:"clinical_hr_payroll_runs",category:"Payroll",dateColumn:"created_at",description:"Monthly payroll processing workflow from attendance capture to approval.",primaryColumns:["payroll_month","workflow_status","total_employees","total_gross","total_net"]},credentialing:{key:"credentialing",label:"Doctor Credentialing",table:"clinical_hr_doctor_credentials",category:"Clinical Governance",dateColumn:"created_at",description:"Medical council number, qualification, specialization, super specialization, documents, and expiry tracking.",primaryColumns:["medical_council_number","qualification","specialization","license_expiry_date","credential_status"]},privileges:{key:"privileges",label:"Doctor Privileging",table:"clinical_hr_doctor_privileges",category:"Clinical Governance",dateColumn:"created_at",description:"Procedure privileges for IVF, surgery, endoscopy, ICU, and emergency procedures with committee review.",primaryColumns:["privilege_category","procedure_name","committee_review_status","approval_status","expires_at"]},performance:{key:"performance",label:"Performance Reviews",table:"clinical_hr_performance_reviews",category:"Performance",dateColumn:"created_at",description:"Doctor, nurse, lab, and staff KPI reviews with clinical, revenue, satisfaction, TAT, and productivity metrics.",primaryColumns:["review_period","kpi_category","rating","review_status"]},lms:{key:"lms",label:"LMS Courses",table:"clinical_hr_lms_courses",category:"Learning",dateColumn:"created_at",description:"Clinical, IVF, safety, compliance, technology, and HR course catalog.",primaryColumns:["course_id","course_name","category","duration_hours","mandatory"]},training:{key:"training",label:"Training Records",table:"clinical_hr_training_records",category:"Learning",dateColumn:"created_at",description:"Mandatory training completion, score, certificate, and compliance tracking.",primaryColumns:["completion_date","score","certificate_url","compliance_training","training_status"]},cme:{key:"cme",label:"CME Records",table:"clinical_hr_cme_records",category:"Learning",dateColumn:"created_at",description:"Continuing medical education programs, credit hours, completion, and renewal support.",primaryColumns:["program_name","credit_hours","completion_date","credits_required","renewal_date"]},licenses:{key:"licenses",label:"License Management",table:"clinical_hr_licenses",category:"Credentialing",dateColumn:"expiry_date",description:"Doctor, nurse, and staff license expiry with 30/60/90 day alerts.",primaryColumns:["license_type","license_number","expiry_date","authority"]},workforce:{key:"workforce",label:"Workforce Planning",table:"clinical_hr_workforce_plans",category:"Analytics",dateColumn:"created_at",description:"Doctor availability, nurse availability, department staffing, vacancy analysis, hiring forecasts, attrition risk, and skill gaps.",primaryColumns:["department","role_group","current_headcount","required_headcount","attrition_risk"]},screens:{key:"screens",label:"Screen Catalog",table:"clinical_hr_screens",category:"Architecture",dateColumn:"created_at",description:"150+ HRMS screen definitions across desktop and mobile workflows.",primaryColumns:["screen_key","module_key","screen_name","route_path","screen_type"]},"api-catalog":{key:"api-catalog",label:"API Catalog",table:"clinical_hr_api_catalog",category:"Architecture",dateColumn:"created_at",description:"300+ HRMS REST API contract definitions with permissions and audit events.",primaryColumns:["api_key","module_key","method","route_path","action_name"]},reports:{key:"reports",label:"Report Catalog",table:"clinical_hr_reports",category:"Reporting",dateColumn:"created_at",description:"250+ HR, attendance, leave, payroll, recruitment, training, credentialing, LMS, and CME reports.",primaryColumns:["report_key","report_name","report_category","output_formats","evidence_source"]},"table-blueprints":{key:"table-blueprints",label:"Table Blueprints",table:"clinical_hr_table_blueprints",category:"Database",dateColumn:"created_at",description:"120+ workforce database table blueprints for future HRMS expansion.",primaryColumns:["table_name","module_key","purpose","implementation_status"]}};Object.values(t),e.s(["getHrmsModuleConfig",0,function(e){return t[e]}])},810138,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(780907),r=e.i(961806),o=e.i(15270),l=t([n,o]);async function s(e,{params:t}){let a=await (0,n.requireClinicalContext)(e);if(a.response)return a.response;let l=a.context,{module:c}=await t,d=(0,r.getHrmsModuleConfig)(c);if(!d)return i.NextResponse.json({error:"Unknown clinical HRMS module."},{status:404});let[u,p]=await Promise.all([o.prisma.$queryRawUnsafe(`
        SELECT t.*
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        ORDER BY t.${d.dateColumn} DESC NULLS LAST, t.id DESC
        LIMIT 500
        `,l.tenantId,l.hospitalId,l.branchId),o.prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE t.${d.dateColumn}::date = CURRENT_DATE)::int AS today
        FROM ${d.table} t
        WHERE t.tenant_id = $1
          AND t.hospital_id = $2
          AND t.branch_id = $3
          AND COALESCE(t.is_deleted,false) = false
        `,l.tenantId,l.hospitalId,l.branchId)]);return i.NextResponse.json({context:l,module:d,metrics:p[0]||{},rows:u})}[n,o]=l.then?(await l)():l,e.s(["GET",0,s]),a()}catch(e){a(e)}},!1),788441,e=>e.a(async(t,a)=>{try{var i=e.i(810138),n=t([i]);[i]=n.then?(await n)():n,e.s([]),a()}catch(e){a(e)}},!1),948420,e=>e.a(async(t,a)=>{try{var i=e.i(788441),n=e.i(810138),r=t([i,n]);[i,n]=r.then?(await r)():r,e.s(["GET",()=>n.GET]),a()}catch(e){a(e)}},!1),802943,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),r=e.i(996250),o=e.i(759756),l=e.i(561916),s=e.i(174677),c=e.i(869741),d=e.i(316795),u=e.i(487718),p=e.i(995169),_=e.i(47587),m=e.i(666012),h=e.i(570101),C=e.i(626937),y=e.i(10372),b=e.i(193695);e.i(52474);var g=e.i(600220),E=e.i(948420),A=t([E]);[E]=A.then?(await A)():A;let R=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/hr/[module]/route",pathname:"/api/clinical/hr/[module]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/hr/[module]/route.ts",nextConfigOutput:"",userland:E,...{}}),{workAsyncStorage:f,workUnitAsyncStorage:S,serverHooks:I}=R;async function N(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),R.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/hr/[module]/route";i=i.replace(/\/index$/,"")||"/";let r=await R.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:E,deploymentId:A,params:N,nextConfig:f,parsedUrl:S,isDraftMode:I,prerenderManifest:O,routerServerContext:L,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,resolvedPathname:w,clientReferenceManifest:P,serverActionsManifest:k}=r,x=(0,c.normalizeAppPath)(i),M=!!(O.dynamicRoutes[x]||O.routes[w]),D=async()=>((null==L?void 0:L.render404)?await L.render404(e,t,S,!1):t.end("This page could not be found"),null);if(M&&!I){let e=!!O.routes[w],t=O.dynamicRoutes[x];if(t&&!1===t.fallback&&!e){if(f.adapterPath)return await D();throw new b.NoFallbackError}}let U=null;!M||R.isDev||I||(U=w,U="/index"===U?"/":U);let $=!0===R.isDev||!M,H=M&&!$;k&&P&&(0,s.setManifestsSingleton)({page:i,clientReferenceManifest:P,serverActionsManifest:k});let F=e.method||"GET",W=(0,l.getTracer)(),q=W.getActiveScopeSpan(),B=!!(null==L?void 0:L.isWrappedByNextServer),j=!!(0,o.getRequestMeta)(e,"minimalMode"),Y=(0,o.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,f,O,j);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let z={params:N,previewProps:O.preview,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:$,incrementalCache:Y,cacheLifeProfiles:f.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>R.onRequestError(e,t,i,n,L)},sharedContext:{buildId:E,deploymentId:A}},J=new d.NodeNextRequest(e),G=new d.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(J,(0,u.signalFromNodeResponse)(t));try{let r,o=async e=>R.handle(V,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=W.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${F} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",n),r.updateName(t))}else e.updateName(`${F} ${i}`)}),s=async r=>{var l,s;let c=async({previousCacheEntry:n})=>{try{if(!j&&v&&T&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(r);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let s=z.renderOpts.collectedTags;if(!M)return await (0,m.sendResponse)(J,G,i,z.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(i.headers);s&&(t[y.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:v})},!1,L),t}},d=await R.handleResponse({req:e,nextConfig:f,cacheKey:U,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:T,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:j});if(!M)return null;if((null==d||null==(l=d.value)?void 0:l.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});j||t.setHeader("x-nextjs-cache",v?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return j&&M||u.delete(y.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,C.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(J,G,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};B&&q?await s(q):(r=W.getActiveScopeSpan(),await W.withPropagatedContext(e.headers,()=>W.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${i}`,kind:l.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},s),void 0,!B))}catch(t){if(t instanceof b.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:v})},!1,L),M)throw t;return await (0,m.sendResponse)(J,G,new Response(null,{status:500})),null}}e.s(["handler",0,N,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:S})},"routeModule",0,R,"serverHooks",0,I,"workAsyncStorage",0,f,"workUnitAsyncStorage",0,S]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0j~0m5u._.js.map