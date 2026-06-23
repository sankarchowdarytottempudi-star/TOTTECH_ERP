module.exports=[836553,e=>e.a(async(t,a)=>{try{var i=e.i(89171),n=e.i(449632),s=e.i(780907),l=e.i(503031),r=e.i(155876),o=e.i(15270),d=t([s,r,o]);[s,r,o]=d.then?(await d)():d;let m=e=>e.toUpperCase().replace(/[^A-Z0-9]+/g,"").slice(0,8),C=e=>["tottech_super_admin","clinical_super_admin","organization_admin"].includes(e),R=e=>{let t=(0,r.text)(e.hospital_name),a={name:t,logoUrl:(0,r.text)(e.logo_url),logo_url:(0,r.text)(e.logo_url),primaryColor:(0,r.text)(e.primary_color)||"#04142E",accentColor:(0,r.text)(e.accent_color)||"#D4AF37"},i={plan_type:(0,r.nullableText)(e.plan_type)||"STANDARD",start_date:(0,r.nullableText)(e.start_date),end_date:(0,r.nullableText)(e.end_date),maximum_users:(0,r.toNumber)(e.maximum_users)||25,maximum_doctors:(0,r.toNumber)(e.maximum_doctors)||10,maximum_branches:(0,r.toNumber)(e.maximum_branches)||1},n={client_id:(0,r.nullableText)(e.abha_client_id),facility_id:(0,r.nullableText)(e.abha_facility_id)},s={number:(0,r.nullableText)(e.nabh_number)},l={subscription:i,abha_integration:n,timezone:(0,r.nullableText)(e.timezone)||"Asia/Kolkata",currency:(0,r.nullableText)(e.currency)||"INR"};return{hospitalName:t,branding:a,subscription:i,abhaIntegration:n,nabhDetails:s,platformSettings:l}};async function u(e,t,a){let i=await e.$queryRawUnsafe(`
    SELECT id
    FROM clinical_roles
    WHERE tenant_id = $1
      AND role_key = ANY($2::text[])
      AND COALESCE(is_deleted,false) = false
    ORDER BY id ASC
    LIMIT 1
    `,t,a);return i[0]?.id?Number(i[0].id):null}async function c(e){if(!e.email||!e.password||!e.fullName)return null;let t=e.db||o.prisma,a=await n.default.hash(e.password,10),i=(await t.$queryRawUnsafe(`
    INSERT INTO users (school_id, full_name, email, username, platform_type, status, phone, password_hash, role, is_active, created_at)
    VALUES (NULL,$1,$2,$3,'CLINICAL','ACTIVE',$4,$5,$6,true,CURRENT_TIMESTAMP)
    ON CONFLICT (email) DO UPDATE
      SET full_name = EXCLUDED.full_name,
          username = EXCLUDED.username,
          platform_type = 'CLINICAL',
          status = 'ACTIVE',
          phone = EXCLUDED.phone,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          is_active = true
    RETURNING id, full_name, email, phone, role, is_active
    `,e.fullName,e.email,e.email.split("@")[0].replace(/^cs-/i,"").toLowerCase(),e.phone||null,a,e.role.toUpperCase()))[0];return await t.$executeRawUnsafe(`
    INSERT INTO clinical_user_profiles (
      tenant_id,hospital_id,branch_id,clinic_id,user_id,clinical_role_id,project_type,
      display_name,settings,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,'tottech_clinical_services',$7,$8::jsonb,$9,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    ON CONFLICT DO NOTHING
    `,e.tenantId,e.hospitalId,e.branchId,e.clinicId,i.id,e.roleId,e.fullName,JSON.stringify({source:"hospital_creation",role:e.role}),e.createdBy||null),i}async function _(e,t){return(await e.$queryRawUnsafe(`
    SELECT
      h.*,
      creator.full_name AS created_by_name,
      COUNT(DISTINCT b.id)::int AS branch_count,
      COUNT(DISTINCT c.id)::int AS clinic_count,
      COUNT(DISTINCT d.id)::int AS doctor_count,
      COUNT(DISTINCT cup.user_id)::int AS staff_count,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', b2.id,
            'branch_name', b2.branch_name,
            'branch_code', b2.branch_code,
            'phone', b2.phone,
            'email', b2.email,
            'status', b2.status
          ) ORDER BY b2.created_at DESC, b2.id DESC)
          FROM branches b2
          WHERE b2.hospital_id = h.id
            AND COALESCE(b2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS branches,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', d2.id,
            'full_name', d2.full_name,
            'specialization', d2.specialization,
            'phone', d2.phone,
            'email', d2.email,
            'status', d2.status
          ) ORDER BY d2.full_name)
          FROM doctors d2
          WHERE d2.hospital_id = h.id
            AND COALESCE(d2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS doctors,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', cup2.id,
            'user_id', u2.id,
            'full_name', COALESCE(u2.full_name, cup2.display_name),
            'email', u2.email,
            'role', u2.role,
            'profile_name', cup2.display_name
          ) ORDER BY cup2.created_at DESC, cup2.id DESC)
          FROM clinical_user_profiles cup2
          LEFT JOIN users u2 ON u2.id = cup2.user_id
          WHERE cup2.hospital_id = h.id
            AND COALESCE(cup2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS staff
    FROM hospitals h
    LEFT JOIN branches b ON b.hospital_id = h.id AND COALESCE(b.is_deleted,false) = false
    LEFT JOIN clinics c ON c.hospital_id = h.id AND COALESCE(c.is_deleted,false) = false
    LEFT JOIN doctors d ON d.hospital_id = h.id AND COALESCE(d.is_deleted,false) = false
    LEFT JOIN clinical_user_profiles cup ON cup.hospital_id = h.id AND COALESCE(cup.is_deleted,false) = false
    LEFT JOIN users creator ON creator.id = h.created_by
    WHERE h.id = $1
    GROUP BY h.id, creator.full_name
    LIMIT 1
    `,t))[0]||null}async function p(e){let t=await (0,s.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context;if(!C(a.roleKey))return i.NextResponse.json({error:"Only platform super admins can view hospital onboarding."},{status:403});let{searchParams:n}=new URL(e.url),l=(0,r.text)(n.get("search")),d=(0,r.text)(n.get("status")),u="tottech_super_admin"===a.roleKey,c=[],_=[];if(u||(c.push(a.tenantId),_.push("h.tenant_id = $1")),"DELETED"===d?_.push("COALESCE(h.is_deleted,false) = true"):(_.push("COALESCE(h.is_deleted,false) = false"),("ACTIVE"===d||"INACTIVE"===d)&&(c.push(d),_.push(`h.status = $${c.length}`))),l){c.push(`%${l.toLowerCase()}%`);let e=c.length;_.push(`
      (
        LOWER(COALESCE(h.hospital_name,'')) LIKE $${e}
        OR LOWER(COALESCE(h.hospital_code,'')) LIKE $${e}
        OR LOWER(COALESCE(h.phone,'')) LIKE $${e}
        OR LOWER(COALESCE(h.email,'')) LIKE $${e}
      )
    `)}let p=await o.prisma.$queryRawUnsafe(`
    SELECT
      h.*,
      creator.full_name AS created_by_name,
      COUNT(DISTINCT b.id)::int AS branch_count,
      COUNT(DISTINCT c.id)::int AS clinic_count,
      COUNT(DISTINCT d.id)::int AS doctor_count,
      COUNT(DISTINCT cup.user_id)::int AS staff_count,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', b2.id,
            'branch_name', b2.branch_name,
            'branch_code', b2.branch_code,
            'phone', b2.phone,
            'email', b2.email,
            'status', b2.status
          ) ORDER BY b2.created_at DESC, b2.id DESC)
          FROM branches b2
          WHERE b2.hospital_id = h.id
            AND COALESCE(b2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS branches,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', d2.id,
            'full_name', d2.full_name,
            'specialization', d2.specialization,
            'phone', d2.phone,
            'email', d2.email,
            'status', d2.status
          ) ORDER BY d2.full_name)
          FROM doctors d2
          WHERE d2.hospital_id = h.id
            AND COALESCE(d2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS doctors,
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', cup2.id,
            'user_id', u2.id,
            'full_name', COALESCE(u2.full_name, cup2.display_name),
            'email', u2.email,
            'role', u2.role,
            'profile_name', cup2.display_name
          ) ORDER BY cup2.created_at DESC, cup2.id DESC)
          FROM clinical_user_profiles cup2
          LEFT JOIN users u2 ON u2.id = cup2.user_id
          WHERE cup2.hospital_id = h.id
            AND COALESCE(cup2.is_deleted,false) = false
        ),
        '[]'::jsonb
      ) AS staff
    FROM hospitals h
    LEFT JOIN branches b ON b.hospital_id = h.id AND COALESCE(b.is_deleted,false) = false
    LEFT JOIN clinics c ON c.hospital_id = h.id AND COALESCE(c.is_deleted,false) = false
    LEFT JOIN doctors d ON d.hospital_id = h.id AND COALESCE(d.is_deleted,false) = false
    LEFT JOIN clinical_user_profiles cup ON cup.hospital_id = h.id AND COALESCE(cup.is_deleted,false) = false
    LEFT JOIN users creator ON creator.id = h.created_by
    WHERE ${_.join(" AND ")}
    GROUP BY h.id, creator.full_name
    ORDER BY h.created_at DESC, h.id DESC
    LIMIT 300
    `,...c);return i.NextResponse.json((0,r.serialize)({rows:p}))}async function E(e){let t=await (0,s.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context;if(!C(a.roleKey))return i.NextResponse.json({error:"Only platform super admins can create hospitals."},{status:403});let n=await e.json();console.info("CREATE_HOSPITAL_START",{user_id:a.user.id,tenant_id:a.tenantId});let d=(0,r.text)(n.hospital_name),p=(0,r.text)(n.owner_email),E=(0,r.text)(n.admin_email);if(!d)return i.NextResponse.json({error:"Hospital name is required."},{status:400});if(!(0,r.text)(n.logo_url))return i.NextResponse.json({error:"Hospital logo URL/path is required."},{status:400});if(!(0,r.text)(n.email)||!(0,r.text)(n.phone)||!(0,r.text)(n.address)||!(0,r.text)(n.city)||!(0,r.text)(n.state)||!(0,r.text)(n.country))return i.NextResponse.json({error:"Hospital email, phone, address, city, state and country are required."},{status:400});let h=m(d)||"HOSP",T=m((0,r.text)(n.hospital_code))||`${h}-${Date.now().toString().slice(-5)}`,{branding:N,nabhDetails:f,platformSettings:S}=R(n);try{console.info("REQUEST_RECEIVED",{hospital_name:d,requested_code:T,tenant_id:a.tenantId}),console.info("VALIDATION_PASSED",{hospital_name:d,hospital_code:T});let e=await o.prisma.$queryRawUnsafe("SELECT id, COALESCE(is_deleted,false) AS is_deleted FROM hospitals WHERE tenant_id = $1 AND hospital_code = $2 LIMIT 1",a.tenantId,T);if(e&&e.length)return console.warn("CREATE_HOSPITAL_DUPLICATE_CODE",{hospital_code:T,is_deleted:e[0].is_deleted}),i.NextResponse.json({error:"Hospital code already exists for this tenant."},{status:409});let t=await o.prisma.$transaction(async e=>{let t=(await e.$queryRawUnsafe(`
    INSERT INTO hospitals (
      tenant_id,hospital_name,hospital_code,legal_name,license_number,gst_number,email,phone,
      address,city,state,country,status,branding,settings,nabh_details,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb,$16::jsonb,$17,$17,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,d,T,(0,r.nullableText)(n.legal_name)||d,(0,r.nullableText)(n.license_number)||(0,r.nullableText)(n.nabh_number),(0,r.nullableText)(n.gst_number),(0,r.text)(n.email),(0,r.text)(n.phone),(0,r.text)(n.address),(0,r.text)(n.city),(0,r.text)(n.state),(0,r.text)(n.country),(0,r.text)(n.status)||"ACTIVE",JSON.stringify(N),JSON.stringify(S),JSON.stringify(f),a.user.id??null))[0];console.info("HOSPITAL_INSERT_SUCCESS",{hospital_id:t?.id,hospital_code:t?.hospital_code}),console.info("CREATE_BRANCH_START",{hospital_id:t?.id});let i=(await e.$queryRawUnsafe(`
    INSERT INTO branches (
      tenant_id,hospital_id,branch_name,branch_code,branch_type,email,phone,address,city,state,country,
      status,branding,settings,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,'MAIN',$5,$6,$7,$8,$9,$10,'ACTIVE',$11::jsonb,$12::jsonb,$13,$13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,t.id,`${d} Main Branch`,`${T}-MAIN`,(0,r.text)(n.email),(0,r.text)(n.phone),(0,r.text)(n.address),(0,r.text)(n.city),(0,r.text)(n.state),(0,r.text)(n.country),JSON.stringify(N),JSON.stringify({auto_created:!0}),a.user.id??null))[0];console.info("BRANCH_INSERT_SUCCESS",{hospital_id:t?.id,branch_id:i?.id}),console.info("CREATE_CLINIC_START",{hospital_id:t?.id,branch_id:i?.id});let s=(await e.$queryRawUnsafe(`
    INSERT INTO clinics (
      tenant_id,hospital_id,branch_id,organization_id,clinic_name,clinic_code,clinic_type,email,phone,
      address,city,state,country,branding,settings,created_by,updated_by,created_at,updated_at,is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,'HMS',$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb,$15,$15,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
    RETURNING *
    `,a.tenantId,t.id,i.id,a.organizationId,d,`${T}-HMS`,(0,r.text)(n.email),(0,r.text)(n.phone),(0,r.text)(n.address),(0,r.text)(n.city),(0,r.text)(n.state),(0,r.text)(n.country),JSON.stringify(N),JSON.stringify({auto_created:!0}),a.user.id??null))[0];console.info("CLINIC_INSERT_SUCCESS",{hospital_id:t?.id,branch_id:i?.id,clinic_id:s?.id}),console.info("FIND_ROLE_IDS_START");let o=await u(e,a.tenantId,["hospital_owner","owner","hospital_admin","clinic_admin"]),_=await u(e,a.tenantId,["hospital_admin","clinic_admin","branch_admin"]);console.info("CREATE_OWNER_START");let h=await c({db:e,tenantId:a.tenantId,hospitalId:Number(t.id),branchId:Number(i.id),clinicId:Number(s.id),roleId:o,fullName:(0,r.text)(n.owner_name),email:p,phone:(0,r.nullableText)(n.owner_phone),password:(0,r.text)(n.owner_password),role:"hospital_owner",createdBy:a.user.id??null});console.info("OWNER_INSERT_SUCCESS",{user_id:h?.id||null,email:h?.email||p||null}),console.info("CREATE_ADMIN_START");let m=await c({db:e,tenantId:a.tenantId,hospitalId:Number(t.id),branchId:Number(i.id),clinicId:Number(s.id),roleId:_,fullName:(0,r.text)(n.admin_name),email:E,phone:(0,r.nullableText)(n.admin_phone),password:(0,r.text)(n.admin_password),role:"hospital_admin",createdBy:a.user.id??null});for(let i of(console.info("ADMIN_INSERT_SUCCESS",{user_id:m?.id||null,email:m?.email||E||null}),console.info("SUBSCRIPTION_INSERT_START",{hospital_id:t?.id}),await e.$executeRawUnsafe(`
      INSERT INTO hospital_subscriptions (
        tenant_id,hospital_id,plan_name,start_date,status,created_by,updated_by,created_at,updated_at,is_deleted
      )
      VALUES ($1,$2,$3,CURRENT_DATE,'ACTIVE',$4,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      `,a.tenantId,t.id,S.subscription?.plan_type||"ENTERPRISE",a.user.id??null),console.info("SUBSCRIPTION_INSERT_SUCCESS",{hospital_id:t?.id}),l.CLINICAL_MODULE_CODES))await e.$executeRawUnsafe(`
        INSERT INTO hospital_module_access (
          tenant_id,hospital_id,module_code,enabled,created_at,updated_at,enabled_by,updated_by
        )
        VALUES ($1,$2,$3,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$4,$4)
        ON CONFLICT (tenant_id,hospital_id,module_code) DO NOTHING
        `,a.tenantId,t.id,i,a.user.id??null);return console.info("MODULE_ACCESS_INSERT_SUCCESS",{hospital_id:t?.id,module_count:l.CLINICAL_MODULE_CODES.length}),{hospital:t,branch:i,clinic:s,owner:h,admin:m}});console.info("TRANSACTION_COMMITTED",{hospital_id:t.hospital?.id});let{hospital:h,branch:m,clinic:C,owner:R,admin:b}=t;console.info("RECORD_AUDIT_START",{hospital_id:h?.id}),await (0,s.recordClinicalAudit)(a,{moduleName:"platform_hospitals",action:"create",entityType:"hospital",entityId:Number(h.id),summary:"White-label hospital tenant created",payload:{hospital:h,branch:m,clinic:C,owner_user_id:R?.id||null,admin_user_id:b?.id||null}});let A=await _(o.prisma,Number(h.id));return console.info("REGISTRY_REFRESH_SUCCESS",{hospital_id:h?.id,found:!!A}),console.info("RESPONSE_SENT",{hospital_id:h?.id,found_in_registry:!!A}),i.NextResponse.json((0,r.serialize)({hospital:A||h,rawHospital:h,branch:m,clinic:C,owner:R,admin:b}),{status:201})}catch(t){console.error("CREATE_HOSPITAL_ERROR",t);let e=t?.meta?.driverAdapterError?.message||t?.message||String(t);if(/duplicate key|unique constraint|23505/i.test(String(e)))return i.NextResponse.json({error:"Hospital code already exists for this tenant."},{status:409});if(/invalid.*email|email/i.test(String(e)))return i.NextResponse.json({error:"Invalid Email",details:e},{status:400});return i.NextResponse.json({error:"Database Transaction Failed",details:e},{status:500})}}async function h(e){let t=await (0,s.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context;if(!C(a.roleKey))return i.NextResponse.json({error:"Only platform super admins can update hospitals."},{status:403});let n=await e.json(),l=(0,r.toNumber)(n.id),d=(0,r.text)(n.action);if(!l)return i.NextResponse.json({error:"Hospital id is required."},{status:400});if(["ACTIVATE","DEACTIVATE"].includes(d)){let e="ACTIVATE"===d?"ACTIVE":"INACTIVE",t="tottech_super_admin"===a.roleKey,n=`
      UPDATE hospitals
      SET status = $${t?2:3},
          updated_by = $${t?3:4},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      ${t?"":"AND tenant_id = $2"}
        AND COALESCE(is_deleted,false) = false
      RETURNING *
    `,u=[l,e,a.user.id??null];t||u.splice(1,0,a.tenantId);let c=await o.prisma.$queryRawUnsafe(n,...u);if(!c.length)return i.NextResponse.json({error:"Hospital not found."},{status:404});await (0,s.recordClinicalAudit)(a,{moduleName:"platform_hospitals",action:e.toLowerCase(),entityType:"hospital",entityId:l,summary:`Hospital ${e.toLowerCase()}`,payload:c[0]});let p=await _(o.prisma,l);return i.NextResponse.json((0,r.serialize)({hospital:p||c[0]}))}let u=(0,r.text)(n.hospital_name);if(!u)return i.NextResponse.json({error:"Hospital name is required."},{status:400});if(!(0,r.text)(n.logo_url))return i.NextResponse.json({error:"Hospital logo URL/path is required."},{status:400});if(!(0,r.text)(n.email)||!(0,r.text)(n.phone)||!(0,r.text)(n.address))return i.NextResponse.json({error:"Hospital email, phone and address are required."},{status:400});let c=m((0,r.text)(n.hospital_code)),{branding:p,nabhDetails:E,platformSettings:h}=R(n),T="tottech_super_admin"===a.roleKey,N=`
    UPDATE hospitals
    SET hospital_name = $3,
        hospital_code = COALESCE(NULLIF($4,''), hospital_code),
        legal_name = $5,
        license_number = $6,
        gst_number = $7,
        email = $8,
        phone = $9,
        address = $10,
        city = $11,
        state = $12,
        country = $13,
        status = $14,
        branding = $15::jsonb,
        settings = $16::jsonb,
        nabh_details = $17::jsonb,
        updated_by = $18,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      ${T?"":"AND tenant_id = $2"}
      AND COALESCE(is_deleted,false) = false
    RETURNING *
    `,f=[l,...T?[]:[a.tenantId],u,c,(0,r.nullableText)(n.legal_name)||u,(0,r.nullableText)(n.license_number)||(0,r.nullableText)(n.nabh_number),(0,r.nullableText)(n.gst_number),(0,r.text)(n.email),(0,r.text)(n.phone),(0,r.text)(n.address),(0,r.nullableText)(n.city),(0,r.nullableText)(n.state),(0,r.nullableText)(n.country)||"India",(0,r.text)(n.status)||"ACTIVE",JSON.stringify(p),JSON.stringify(h),JSON.stringify(E),a.user.id??null],S=await o.prisma.$queryRawUnsafe(N,...f);if(!S.length)return i.NextResponse.json({error:"Hospital not found."},{status:404});await (0,s.recordClinicalAudit)(a,{moduleName:"platform_hospitals",action:"update",entityType:"hospital",entityId:l,summary:"Hospital details updated",payload:S[0]});let b=await _(o.prisma,l);return i.NextResponse.json((0,r.serialize)({hospital:b||S[0]}))}async function T(e){let t=await (0,s.requireClinicalContext)(e);if(t.response)return t.response;let a=t.context;if(!C(a.roleKey))return i.NextResponse.json({error:"Only platform super admins can delete hospitals."},{status:403});let{searchParams:n}=new URL(e.url),l=(0,r.toNumber)(n.get("id"));if(!l)return i.NextResponse.json({error:"Hospital id is required."},{status:400});let d="tottech_super_admin"===a.roleKey,u=`
    UPDATE hospitals
    SET is_deleted = true,
        status = 'DELETED',
        updated_by = $${d?2:3},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      ${d?"":"AND tenant_id = $2"}
      AND COALESCE(is_deleted,false) = false
    RETURNING *
    `,c=[l,...d?[]:[a.tenantId],a.user.id??null],_=await o.prisma.$queryRawUnsafe(u,...c);return _.length?(await (0,s.recordClinicalAudit)(a,{moduleName:"platform_hospitals",action:"delete",entityType:"hospital",entityId:l,summary:"Hospital soft deleted",payload:_[0]}),i.NextResponse.json({success:!0,hospital:(0,r.serialize)(_[0])})):i.NextResponse.json({error:"Hospital not found."},{status:404})}e.s(["DELETE",0,T,"GET",0,p,"PATCH",0,h,"POST",0,E]),a()}catch(e){a(e)}},!1),545149,e=>e.a(async(t,a)=>{try{var i=e.i(747909),n=e.i(174017),s=e.i(996250),l=e.i(759756),r=e.i(561916),o=e.i(174677),d=e.i(869741),u=e.i(316795),c=e.i(487718),_=e.i(995169),p=e.i(47587),E=e.i(666012),h=e.i(570101),T=e.i(626937),m=e.i(10372),C=e.i(193695);e.i(52474);var R=e.i(600220),N=e.i(836553),f=t([N]);[N]=f.then?(await f)():f;let b=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinical/platform/hospitals/route",pathname:"/api/clinical/platform/hospitals",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/clinical/platform/hospitals/route.ts",nextConfigOutput:"",userland:N,...{}}),{workAsyncStorage:A,workUnitAsyncStorage:I,serverHooks:O}=b;async function S(e,t,a){a.requestMeta&&(0,l.setRequestMeta)(e,a.requestMeta),b.isDev&&(0,l.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/clinical/platform/hospitals/route";i=i.replace(/\/index$/,"")||"/";let s=await b.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:N,deploymentId:f,params:S,nextConfig:A,parsedUrl:I,isDraftMode:O,prerenderManifest:y,routerServerContext:$,isOnDemandRevalidate:x,revalidateOnlyGenerated:L,resolvedPathname:w,clientReferenceManifest:g,serverActionsManifest:D}=s,U=(0,d.normalizeAppPath)(i),M=!!(y.dynamicRoutes[U]||y.routes[w]),j=async()=>((null==$?void 0:$.render404)?await $.render404(e,t,I,!1):t.end("This page could not be found"),null);if(M&&!O){let e=!!y.routes[w],t=y.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(A.adapterPath)return await j();throw new C.NoFallbackError}}let H=null;!M||b.isDev||O||(H=w,H="/index"===H?"/":H);let v=!0===b.isDev||!M,P=M&&!v;D&&g&&(0,o.setManifestsSingleton)({page:i,clientReferenceManifest:g,serverActionsManifest:D});let q=e.method||"GET",F=(0,r.getTracer)(),V=F.getActiveScopeSpan(),B=!!(null==$?void 0:$.isWrappedByNextServer),J=!!(0,l.getRequestMeta)(e,"minimalMode"),W=(0,l.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,A,y,J);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let K={params:S,previewProps:y.preview,renderOpts:{experimental:{authInterrupts:!!A.experimental.authInterrupts},cacheComponents:!!A.cacheComponents,supportsDynamicResponse:v,incrementalCache:W,cacheLifeProfiles:A.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>b.onRequestError(e,t,i,n,$)},sharedContext:{buildId:N,deploymentId:f}},k=new u.NodeNextRequest(e),G=new u.NodeNextResponse(t),z=c.NextRequestAdapter.fromNodeNextRequest(k,(0,c.signalFromNodeResponse)(t));try{let s,l=async e=>b.handle(z,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${q} ${i}`)}),o=async s=>{var r,o;let d=async({previousCacheEntry:n})=>{try{if(!J&&x&&L&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await l(s);e.fetchMetrics=K.renderOpts.fetchMetrics;let r=K.renderOpts.pendingWaitUntil;r&&a.waitUntil&&(a.waitUntil(r),r=void 0);let o=K.renderOpts.collectedTags;if(!M)return await (0,E.sendResponse)(k,G,i,K.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(i.headers);o&&(t[m.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,n=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:x})},!1,$),t}},u=await b.handleResponse({req:e,nextConfig:A,cacheKey:H,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:L,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:J});if(!M)return null;if((null==u||null==(r=u.value)?void 0:r.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});J||t.setHeader("x-nextjs-cache",x?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return J&&M||c.delete(m.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,T.getCacheControlHeader)(u.cacheControl)),await (0,E.sendResponse)(k,G,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};B&&V?await o(V):(s=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(_.BaseServerSpan.handleRequest,{spanName:`${q} ${i}`,kind:r.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},o),void 0,!B))}catch(t){if(t instanceof C.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:x})},!1,$),M)throw t;return await (0,E.sendResponse)(k,G,new Response(null,{status:500})),null}}e.s(["handler",0,S,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:I})},"routeModule",0,b,"serverHooks",0,O,"workAsyncStorage",0,A,"workUnitAsyncStorage",0,I]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0ipb.wv._.js.map