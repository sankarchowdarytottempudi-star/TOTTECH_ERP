module.exports=[177278,e=>e.a(async(t,a)=>{try{var s=e.i(89171),i=e.i(19754),r=e.i(493399),c=e.i(215619),o=e.i(15270),_=t([i,r,c,o]);[i,r,c,o]=_.then?(await _)():_;let R=["students","classes","sections","subjects","teacher_assignments","timetable","exams","exam_schedule","question_papers","homework","transport","dining","hostel"],O=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:null};async function d(e,...t){let a=await o.prisma.$queryRawUnsafe(e,...t);return Number(a[0]?.count||0)}async function n(e,t){let[a,s,i,r,c,o,_,n,l,E,u,m,N,A,C,T,h,R,O]=await Promise.all([d("SELECT COUNT(*)::int AS count FROM student_year_enrollments WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM classes WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM sections WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM subjects WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM teacher_class_assignments WHERE school_id = $1 AND academic_year_id = $2 AND COALESCE(status, 'ACTIVE') = 'ACTIVE'",e,t),d("SELECT COUNT(*)::int AS count FROM timetable_entries WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM exams WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM exam_schedule WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM question_papers WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM homework_assignments WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM transport_routes WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM transport_vehicles WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM transport_assignments WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM hostels WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM hostel_rooms WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM hostel_allocations WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM dining_meal_plans WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM dining_weekly_menus WHERE school_id = $1 AND academic_year_id = $2",e,t),d("SELECT COUNT(*)::int AS count FROM dining_meal_assignments WHERE school_id = $1 AND academic_year_id = $2",e,t)]);return{students:a,classes:s,sections:i,subjects:r,teacherAssignments:c,timetable:o,exams:_,examSchedule:n,questionPapers:l,homework:E,transportRoutes:u,transportVehicles:m,transportAssignments:N,hostels:A,hostelRooms:C,hostelAllocations:T,diningMealPlans:h,diningMenus:R,diningAssignments:O}}async function l(e,t,a,s,i={},r=null){await o.prisma.$executeRawUnsafe(`
    INSERT INTO academic_year_rollover_items (
      rollover_id,
      entity_type,
      status,
      message,
      metadata,
      created_by,
      updated_by,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5::jsonb,$6,$6,CURRENT_TIMESTAMP)
    `,e,t,a,s,JSON.stringify(i),r)}async function E(e,...t){return(await o.prisma.$queryRawUnsafe(e,...t)).length}async function u(e,...t){return(await o.prisma.$queryRawUnsafe(e,...t)).length}async function m(e,t,a,s,i,r){let c={},o=(e,t,a,i={})=>l(r,e,t,a,i,s);return i.includes("classes")&&(c.classes=await E(`
      INSERT INTO classes (
        school_id,
        academic_year_id,
        class_name,
        class_teacher_id,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT c.school_id, $3, c.class_name, c.class_teacher_id, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM classes c
      WHERE c.school_id = $1
        AND c.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM classes existing
          WHERE existing.school_id = c.school_id
            AND existing.academic_year_id = $3
            AND lower(existing.class_name) = lower(c.class_name)
        )
      RETURNING id
      `,e,t,a,s),await o("classes","COPIED",`${c.classes} classes copied`)),i.includes("sections")&&(c.sections=await E(`
      INSERT INTO sections (
        school_id,
        academic_year_id,
        class_id,
        section_name,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT s.school_id, $3, target_class.id, s.section_name, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM sections s
      JOIN classes source_class ON source_class.id = s.class_id
      JOIN classes target_class
        ON target_class.school_id = s.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      WHERE s.school_id = $1
        AND s.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM sections existing
          WHERE existing.school_id = s.school_id
            AND existing.academic_year_id = $3
            AND existing.class_id = target_class.id
            AND lower(COALESCE(existing.section_name, '')) = lower(COALESCE(s.section_name, ''))
        )
      RETURNING id
      `,e,t,a,s),await o("sections","COPIED",`${c.sections} sections copied`)),i.includes("subjects")&&(c.subjects=await E(`
      INSERT INTO subjects (
        school_id,
        academic_year_id,
        subject_name,
        subject_code,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT s.school_id, $3, s.subject_name, s.subject_code, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM subjects s
      WHERE s.school_id = $1
        AND s.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM subjects existing
          WHERE existing.school_id = s.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.subject_code, existing.subject_name, '')) =
                lower(COALESCE(s.subject_code, s.subject_name, ''))
        )
      RETURNING id
      `,e,t,a,s),await o("subjects","COPIED",`${c.subjects} subjects copied`)),i.includes("students")&&(c.students=await E(`
      INSERT INTO student_year_enrollments (
        school_id,
        student_id,
        academic_year_id,
        class_id,
        section_id,
        roll_number,
        status,
        source,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT sye.school_id,
             sye.student_id,
             $3,
             target_class.id,
             target_section.id,
             sye.roll_number,
             COALESCE(sye.status, 'ACTIVE'),
             'academic_year_rollover',
             jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $4::int),
             $5,
             $5,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM student_year_enrollments sye
      LEFT JOIN classes source_class ON source_class.id = sye.class_id
      LEFT JOIN sections source_section ON source_section.id = sye.section_id
      LEFT JOIN classes target_class
        ON target_class.school_id = sye.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = sye.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      WHERE sye.school_id = $1
        AND sye.academic_year_id = $2
        AND COALESCE(sye.status, 'ACTIVE') = 'ACTIVE'
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM student_year_enrollments existing
          WHERE existing.student_id = sye.student_id
            AND existing.academic_year_id = $3
        )
      RETURNING id
      `,e,t,a,r,s),await o("students","COPIED",`${c.students} same-class student enrollments carried forward`,{note:"Class promotion workflow remains the primary path for class advancement."})),i.includes("teacher_assignments")&&(c.teacherAssignments=await E(`
        INSERT INTO teacher_class_assignments (
          school_id,
          academic_year_id,
          teacher_id,
          class_id,
          section_id,
          subject_id,
          assignment_type,
          status,
          assigned_by,
          assigned_at,
          created_by,
          updated_by,
          created_at,
          updated_at,
          metadata
        )
        SELECT tca.school_id,
               $3,
               tca.teacher_id,
               target_class.id,
               target_section.id,
               target_subject.id,
               COALESCE(tca.assignment_type, 'CLASS_TEACHER'),
               COALESCE(tca.status, 'ACTIVE'),
               $4,
               CURRENT_TIMESTAMP,
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP,
               COALESCE(tca.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int)
        FROM teacher_class_assignments tca
        LEFT JOIN classes source_class ON source_class.id = tca.class_id
        LEFT JOIN sections source_section ON source_section.id = tca.section_id
        LEFT JOIN subjects source_subject ON source_subject.id = tca.subject_id
        LEFT JOIN classes target_class
          ON target_class.school_id = tca.school_id
         AND target_class.academic_year_id = $3
         AND lower(target_class.class_name) = lower(source_class.class_name)
        LEFT JOIN sections target_section
          ON target_section.school_id = tca.school_id
         AND target_section.academic_year_id = $3
         AND target_section.class_id = target_class.id
         AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
        LEFT JOIN subjects target_subject
          ON target_subject.school_id = tca.school_id
         AND target_subject.academic_year_id = $3
         AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
             lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
        WHERE tca.school_id = $1
          AND tca.academic_year_id = $2
          AND COALESCE(tca.status, 'ACTIVE') = 'ACTIVE'
          AND target_class.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM teacher_class_assignments existing
            WHERE existing.school_id = tca.school_id
              AND existing.academic_year_id = $3
              AND existing.teacher_id = tca.teacher_id
              AND existing.class_id = target_class.id
              AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
              AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
              AND COALESCE(existing.assignment_type, '') = COALESCE(tca.assignment_type, '')
          )
        RETURNING id
        `,e,t,a,s,r),await o("teacher_assignments","COPIED",`${c.teacherAssignments} teacher assignments copied`)),i.includes("timetable")&&(c.timetable=await E(`
      INSERT INTO timetable_entries (
        school_id,
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        day_of_week,
        start_time,
        end_time,
        room_no,
        status,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT te.school_id,
             $3,
             target_class.id,
             target_section.id,
             target_subject.id,
             te.teacher_id,
             te.day_of_week,
             te.start_time,
             te.end_time,
             te.room_no,
             COALESCE(te.status, 'ACTIVE'),
             COALESCE(te.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
             $4,
             $4,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM timetable_entries te
      LEFT JOIN classes source_class ON source_class.id = te.class_id
      LEFT JOIN sections source_section ON source_section.id = te.section_id
      LEFT JOIN subjects source_subject ON source_subject.id = te.subject_id
      LEFT JOIN classes target_class
        ON target_class.school_id = te.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = te.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      LEFT JOIN subjects target_subject
        ON target_subject.school_id = te.school_id
       AND target_subject.academic_year_id = $3
       AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
           lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
      WHERE te.school_id = $1
        AND te.academic_year_id = $2
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM timetable_entries existing
          WHERE existing.school_id = te.school_id
            AND existing.academic_year_id = $3
            AND existing.class_id = target_class.id
            AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
            AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
            AND COALESCE(existing.teacher_id, 0) = COALESCE(te.teacher_id, 0)
            AND COALESCE(existing.day_of_week, '') = COALESCE(te.day_of_week, '')
            AND COALESCE(existing.start_time::text, '') = COALESCE(te.start_time::text, '')
        )
      RETURNING id
      `,e,t,a,s,r),await o("timetable","COPIED",`${c.timetable} timetable entries copied`)),i.includes("exams")&&(c.exams=await E(`
      INSERT INTO exams (
        school_id,
        academic_year_id,
        exam_name,
        exam_type,
        start_date,
        end_date,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT e.school_id,
             $3,
             e.exam_name,
             e.exam_type,
             e.start_date + INTERVAL '1 year',
             e.end_date + INTERVAL '1 year',
             $4,
             CURRENT_TIMESTAMP,
             $4,
             CURRENT_TIMESTAMP
      FROM exams e
      WHERE e.school_id = $1
        AND e.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM exams existing
          WHERE existing.school_id = e.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.exam_name, '')) = lower(COALESCE(e.exam_name, ''))
            AND lower(COALESCE(existing.exam_type, '')) = lower(COALESCE(e.exam_type, ''))
        )
      RETURNING id
      `,e,t,a,s),await o("exams","COPIED",`${c.exams} exams copied`)),i.includes("question_papers")&&(c.questionPapers=await E(`
        INSERT INTO question_papers (
          school_id,
          academic_year_id,
          exam_id,
          exam_type_id,
          class_id,
          section_id,
          subject_id,
          paper_name,
          total_marks,
          duration_minutes,
          instructions,
          exam_date,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT qp.school_id,
               $3,
               target_exam.id,
               qp.exam_type_id,
               target_class.id,
               target_section.id,
               target_subject.id,
               qp.paper_name,
               qp.total_marks,
               qp.duration_minutes,
               qp.instructions,
               qp.exam_date + INTERVAL '1 year',
               COALESCE(qp.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM question_papers qp
        LEFT JOIN exams source_exam ON source_exam.id = qp.exam_id
        LEFT JOIN exams target_exam
          ON target_exam.school_id = qp.school_id
         AND target_exam.academic_year_id = $3
         AND lower(COALESCE(target_exam.exam_name, '')) = lower(COALESCE(source_exam.exam_name, ''))
         AND lower(COALESCE(target_exam.exam_type, '')) = lower(COALESCE(source_exam.exam_type, ''))
        LEFT JOIN classes source_class ON source_class.id = qp.class_id
        LEFT JOIN sections source_section ON source_section.id = qp.section_id
        LEFT JOIN subjects source_subject ON source_subject.id = qp.subject_id
        LEFT JOIN classes target_class
          ON target_class.school_id = qp.school_id
         AND target_class.academic_year_id = $3
         AND lower(target_class.class_name) = lower(source_class.class_name)
        LEFT JOIN sections target_section
          ON target_section.school_id = qp.school_id
         AND target_section.academic_year_id = $3
         AND target_section.class_id = target_class.id
         AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
        LEFT JOIN subjects target_subject
          ON target_subject.school_id = qp.school_id
         AND target_subject.academic_year_id = $3
         AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
             lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
        WHERE qp.school_id = $1
          AND qp.academic_year_id = $2
          AND target_class.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM question_papers existing
            WHERE existing.school_id = qp.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.paper_name, '')) = lower(COALESCE(qp.paper_name, ''))
              AND COALESCE(existing.class_id, 0) = COALESCE(target_class.id, 0)
              AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
              AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
          )
        RETURNING id
        `,e,t,a,s,r),await o("question_papers","COPIED",`${c.questionPapers} question papers copied`)),i.includes("exam_schedule")&&(c.examSchedule=await E(`
      INSERT INTO exam_schedule (
        school_id,
        academic_year_id,
        exam_id,
        exam_type_id,
        question_paper_id,
        class_id,
        section_id,
        subject_id,
        exam_date,
        start_time,
        end_time,
        room_no,
        invigilator_teacher_id,
        status,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT es.school_id,
             $3,
             target_exam.id,
             es.exam_type_id,
             NULL,
             target_class.id,
             target_section.id,
             target_subject.id,
             es.exam_date + INTERVAL '1 year',
             es.start_time,
             es.end_time,
             es.room_no,
             es.invigilator_teacher_id,
             COALESCE(es.status, 'SCHEDULED'),
             COALESCE(es.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
             $4,
             $4,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM exam_schedule es
      LEFT JOIN exams source_exam ON source_exam.id = es.exam_id
      LEFT JOIN exams target_exam
        ON target_exam.school_id = es.school_id
       AND target_exam.academic_year_id = $3
       AND lower(COALESCE(target_exam.exam_name, '')) = lower(COALESCE(source_exam.exam_name, ''))
       AND lower(COALESCE(target_exam.exam_type, '')) = lower(COALESCE(source_exam.exam_type, ''))
      LEFT JOIN classes source_class ON source_class.id = es.class_id
      LEFT JOIN sections source_section ON source_section.id = es.section_id
      LEFT JOIN subjects source_subject ON source_subject.id = es.subject_id
      LEFT JOIN classes target_class
        ON target_class.school_id = es.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = es.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      LEFT JOIN subjects target_subject
        ON target_subject.school_id = es.school_id
       AND target_subject.academic_year_id = $3
       AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
           lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
      WHERE es.school_id = $1
        AND es.academic_year_id = $2
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM exam_schedule existing
          WHERE existing.school_id = es.school_id
            AND existing.academic_year_id = $3
            AND COALESCE(existing.exam_id, 0) = COALESCE(target_exam.id, 0)
            AND COALESCE(existing.class_id, 0) = COALESCE(target_class.id, 0)
            AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
            AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
            AND existing.exam_date = es.exam_date + INTERVAL '1 year'
        )
      RETURNING id
      `,e,t,a,s,r),await o("exam_schedule","COPIED",`${c.examSchedule} exam schedules copied`)),i.includes("homework")&&(c.homework=await E(`
      INSERT INTO homework_assignments (
        school_id,
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        title,
        description,
        due_date,
        status,
        assignment_type,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      SELECT ha.school_id,
             $3,
             target_class.id,
             target_section.id,
             target_subject.id,
             ha.teacher_id,
             ha.title,
             ha.description,
             ha.due_date + INTERVAL '1 year',
             'DRAFT',
             COALESCE(ha.assignment_type, 'CLASS_SECTION'),
             COALESCE(ha.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
             $4,
             $4,
             CURRENT_TIMESTAMP,
             CURRENT_TIMESTAMP
      FROM homework_assignments ha
      LEFT JOIN classes source_class ON source_class.id = ha.class_id
      LEFT JOIN sections source_section ON source_section.id = ha.section_id
      LEFT JOIN subjects source_subject ON source_subject.id = ha.subject_id
      LEFT JOIN classes target_class
        ON target_class.school_id = ha.school_id
       AND target_class.academic_year_id = $3
       AND lower(target_class.class_name) = lower(source_class.class_name)
      LEFT JOIN sections target_section
        ON target_section.school_id = ha.school_id
       AND target_section.academic_year_id = $3
       AND target_section.class_id = target_class.id
       AND lower(COALESCE(target_section.section_name, '')) = lower(COALESCE(source_section.section_name, ''))
      LEFT JOIN subjects target_subject
        ON target_subject.school_id = ha.school_id
       AND target_subject.academic_year_id = $3
       AND lower(COALESCE(target_subject.subject_code, target_subject.subject_name, '')) =
           lower(COALESCE(source_subject.subject_code, source_subject.subject_name, ''))
      WHERE ha.school_id = $1
        AND ha.academic_year_id = $2
        AND target_class.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM homework_assignments existing
          WHERE existing.school_id = ha.school_id
            AND existing.academic_year_id = $3
            AND COALESCE(existing.class_id, 0) = COALESCE(target_class.id, 0)
            AND COALESCE(existing.section_id, 0) = COALESCE(target_section.id, 0)
            AND COALESCE(existing.subject_id, 0) = COALESCE(target_subject.id, 0)
            AND lower(COALESCE(existing.title, '')) = lower(COALESCE(ha.title, ''))
        )
      RETURNING id
      `,e,t,a,s,r),await o("homework","COPIED",`${c.homework} homework assignments copied as drafts`)),i.includes("transport")&&(c.transportRoutes=await E(`
        INSERT INTO transport_routes (
          school_id,
          academic_year_id,
          route_name,
          vehicle_number,
          driver_name,
          driver_phone,
          created_by,
          created_at,
          updated_by,
          updated_at
        )
        SELECT tr.school_id, $3, tr.route_name, tr.vehicle_number, tr.driver_name, tr.driver_phone, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
        FROM transport_routes tr
        WHERE tr.school_id = $1
          AND tr.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM transport_routes existing
            WHERE existing.school_id = tr.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.route_name, '')) = lower(COALESCE(tr.route_name, ''))
          )
        RETURNING id
        `,e,t,a,s),c.transportVehicles=await E(`
        INSERT INTO transport_vehicles (
          school_id,
          academic_year_id,
          vehicle_number,
          vehicle_type,
          capacity,
          driver_name,
          driver_phone,
          created_by,
          created_at,
          updated_by,
          updated_at
        )
        SELECT tv.school_id, $3, tv.vehicle_number, tv.vehicle_type, tv.capacity, tv.driver_name, tv.driver_phone, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
        FROM transport_vehicles tv
        WHERE tv.school_id = $1
          AND tv.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM transport_vehicles existing
            WHERE existing.school_id = tv.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.vehicle_number, '')) = lower(COALESCE(tv.vehicle_number, ''))
          )
        RETURNING id
        `,e,t,a,s),c.transportAssignments=await E(`
        INSERT INTO transport_assignments (
          school_id,
          academic_year_id,
          assigned_to_type,
          student_id,
          teacher_id,
          staff_id,
          route_id,
          pickup_point,
          drop_point,
          status,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT ta.school_id,
               $3,
               ta.assigned_to_type,
               ta.student_id,
               ta.teacher_id,
               ta.staff_id,
               target_route.id,
               ta.pickup_point,
               ta.drop_point,
               COALESCE(ta.status, 'ACTIVE'),
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM transport_assignments ta
        LEFT JOIN transport_routes source_route ON source_route.id = ta.route_id
        LEFT JOIN transport_routes target_route
          ON target_route.school_id = ta.school_id
         AND target_route.academic_year_id = $3
         AND lower(COALESCE(target_route.route_name, '')) = lower(COALESCE(source_route.route_name, ''))
        WHERE ta.school_id = $1
          AND ta.academic_year_id = $2
          AND COALESCE(ta.status, 'ACTIVE') = 'ACTIVE'
          AND target_route.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM transport_assignments existing
            WHERE existing.school_id = ta.school_id
              AND existing.academic_year_id = $3
              AND COALESCE(existing.student_id, 0) = COALESCE(ta.student_id, 0)
              AND COALESCE(existing.teacher_id, 0) = COALESCE(ta.teacher_id, 0)
              AND existing.route_id = target_route.id
          )
        RETURNING id
        `,e,t,a,s),await o("transport","COPIED",`${c.transportRoutes} routes, ${c.transportVehicles} vehicles, ${c.transportAssignments} assignments copied`)),i.includes("dining")&&(c.diningMealPlans=await E(`
        INSERT INTO dining_meal_plans (
          school_id,
          academic_year_id,
          plan_name,
          meal_type,
          price,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT dmp.school_id, $3, dmp.plan_name, dmp.meal_type, dmp.price, COALESCE(dmp.status, 'ACTIVE'), COALESCE(dmp.metadata, '{}'::jsonb), $4, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        FROM dining_meal_plans dmp
        WHERE dmp.school_id = $1
          AND dmp.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM dining_meal_plans existing
            WHERE existing.school_id = dmp.school_id
              AND existing.academic_year_id = $3
              AND lower(COALESCE(existing.plan_name, '')) = lower(COALESCE(dmp.plan_name, ''))
              AND lower(COALESCE(existing.meal_type, '')) = lower(COALESCE(dmp.meal_type, ''))
          )
        RETURNING id
        `,e,t,a,s),c.diningMenus=await E(`
        INSERT INTO dining_weekly_menus (
          school_id,
          academic_year_id,
          week_start,
          day_of_week,
          meal_type,
          menu_items,
          nutrition_notes,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT dwm.school_id,
               $3,
               dwm.week_start + INTERVAL '1 year',
               dwm.day_of_week,
               dwm.meal_type,
               dwm.menu_items,
               dwm.nutrition_notes,
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM dining_weekly_menus dwm
        WHERE dwm.school_id = $1
          AND dwm.academic_year_id = $2
          AND NOT EXISTS (
            SELECT 1 FROM dining_weekly_menus existing
            WHERE existing.school_id = dwm.school_id
              AND existing.academic_year_id = $3
              AND existing.week_start = dwm.week_start + INTERVAL '1 year'
              AND COALESCE(existing.day_of_week, '') = COALESCE(dwm.day_of_week, '')
              AND COALESCE(existing.meal_type, '') = COALESCE(dwm.meal_type, '')
          )
        RETURNING id
        `,e,t,a,s),c.diningAssignments=await E(`
        INSERT INTO dining_meal_assignments (
          school_id,
          academic_year_id,
          meal_plan_id,
          student_id,
          teacher_id,
          staff_id,
          start_date,
          end_date,
          status,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT dma.school_id,
               $3,
               target_plan.id,
               dma.student_id,
               dma.teacher_id,
               dma.staff_id,
               dma.start_date + INTERVAL '1 year',
               dma.end_date + INTERVAL '1 year',
               COALESCE(dma.status, 'ACTIVE'),
               COALESCE(dma.metadata, '{}'::jsonb) || jsonb_build_object('sourceAcademicYearId', $2::int, 'rolloverId', $5::int),
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM dining_meal_assignments dma
        LEFT JOIN dining_meal_plans source_plan ON source_plan.id = dma.meal_plan_id
        LEFT JOIN dining_meal_plans target_plan
          ON target_plan.school_id = dma.school_id
         AND target_plan.academic_year_id = $3
         AND lower(COALESCE(target_plan.plan_name, '')) = lower(COALESCE(source_plan.plan_name, ''))
         AND lower(COALESCE(target_plan.meal_type, '')) = lower(COALESCE(source_plan.meal_type, ''))
        WHERE dma.school_id = $1
          AND dma.academic_year_id = $2
          AND COALESCE(dma.status, 'ACTIVE') = 'ACTIVE'
          AND target_plan.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM dining_meal_assignments existing
            WHERE existing.school_id = dma.school_id
              AND existing.academic_year_id = $3
              AND COALESCE(existing.student_id, 0) = COALESCE(dma.student_id, 0)
              AND COALESCE(existing.teacher_id, 0) = COALESCE(dma.teacher_id, 0)
              AND existing.meal_plan_id = target_plan.id
          )
        RETURNING id
        `,e,t,a,s,r),await o("dining","COPIED",`${c.diningMealPlans} meal plans, ${c.diningMenus} menus, ${c.diningAssignments} meal assignments copied`)),i.includes("hostel")&&(c.hostels=await E(`
      INSERT INTO hostels (
        school_id,
        academic_year_id,
        hostel_name,
        hostel_type,
        warden_name,
        warden_phone,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT h.school_id, $3, h.hostel_name, h.hostel_type, h.warden_name, h.warden_phone, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM hostels h
      WHERE h.school_id = $1
        AND h.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1 FROM hostels existing
          WHERE existing.school_id = h.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.hostel_name, '')) = lower(COALESCE(h.hostel_name, ''))
        )
      RETURNING id
      `,e,t,a,s),c.hostelRooms=await E(`
      INSERT INTO hostel_rooms (
        school_id,
        academic_year_id,
        room_number,
        hostel_name,
        capacity,
        created_by,
        created_at,
        updated_by,
        updated_at
      )
      SELECT hr.school_id, $3, hr.room_number, hr.hostel_name, hr.capacity, $4, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP
      FROM hostel_rooms hr
      WHERE hr.school_id = $1
        AND hr.academic_year_id = $2
        AND NOT EXISTS (
          SELECT 1 FROM hostel_rooms existing
          WHERE existing.school_id = hr.school_id
            AND existing.academic_year_id = $3
            AND lower(COALESCE(existing.hostel_name, '')) = lower(COALESCE(hr.hostel_name, ''))
            AND lower(COALESCE(existing.room_number, '')) = lower(COALESCE(hr.room_number, ''))
        )
      RETURNING id
      `,e,t,a,s),c.hostelAllocations=await E(`
        INSERT INTO hostel_allocations (
          school_id,
          academic_year_id,
          student_id,
          hostel_id,
          room_id,
          bed_number,
          allocation_date,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        SELECT ha.school_id,
               $3,
               ha.student_id,
               target_hostel.id,
               target_room.id,
               ha.bed_number,
               ha.allocation_date + INTERVAL '1 year',
               $4,
               $4,
               CURRENT_TIMESTAMP,
               CURRENT_TIMESTAMP
        FROM hostel_allocations ha
        LEFT JOIN hostels source_hostel ON source_hostel.id = ha.hostel_id
        LEFT JOIN hostel_rooms source_room ON source_room.id = ha.room_id
        LEFT JOIN hostels target_hostel
          ON target_hostel.school_id = ha.school_id
         AND target_hostel.academic_year_id = $3
         AND lower(COALESCE(target_hostel.hostel_name, '')) = lower(COALESCE(source_hostel.hostel_name, ''))
        LEFT JOIN hostel_rooms target_room
          ON target_room.school_id = ha.school_id
         AND target_room.academic_year_id = $3
         AND lower(COALESCE(target_room.hostel_name, '')) = lower(COALESCE(source_room.hostel_name, ''))
         AND lower(COALESCE(target_room.room_number, '')) = lower(COALESCE(source_room.room_number, ''))
        WHERE ha.school_id = $1
          AND ha.academic_year_id = $2
          AND target_hostel.id IS NOT NULL
          AND target_room.id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM hostel_allocations existing
            WHERE existing.school_id = ha.school_id
              AND existing.academic_year_id = $3
              AND existing.student_id = ha.student_id
              AND existing.hostel_id = target_hostel.id
              AND existing.room_id = target_room.id
          )
        RETURNING id
        `,e,t,a,s),await o("hostel","COPIED",`${c.hostels} hostels, ${c.hostelRooms} rooms, ${c.hostelAllocations} allocations copied`)),c.marks=0,await o("marks","PRESERVED","Marks remain historical and are not copied into the target year.",{reason:"Marks are operational history; copying them would corrupt year-specific academic evidence."}),c}async function N(e,t,a,s,i){let r={};return r.studentYearEnrollments=await u(`
      DELETE FROM student_year_enrollments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.teacherAssignments=await u(`
      DELETE FROM teacher_class_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.timetable=await u(`
      DELETE FROM timetable_entries
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.questionPapers=await u(`
      DELETE FROM question_papers
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.examSchedule=await u(`
      DELETE FROM exam_schedule
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.homework=await u(`
      DELETE FROM homework_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.transportAssignments=await u(`
      DELETE FROM transport_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.diningAssignments=await u(`
      DELETE FROM dining_meal_assignments
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.hostelAllocations=await u(`
      DELETE FROM hostel_allocations
      WHERE school_id = $1
        AND academic_year_id = $2
        AND COALESCE(metadata::text, '') LIKE '%' || $3::text || '%'
      RETURNING id
      `,e,a,i),r.exams=await u(`
      DELETE FROM exams
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,e,a,s,i),r.classes=await u(`
      DELETE FROM classes
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,e,a,s,i),r.sections=await u(`
      DELETE FROM sections
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,e,a,s,i),r.subjects=await u(`
      DELETE FROM subjects
      WHERE school_id = $1
        AND academic_year_id = $2
        AND created_by = $3
        AND created_at >= COALESCE((SELECT executed_at FROM academic_year_rollovers WHERE id = $4), created_at)
      RETURNING id
      `,e,a,s,i),await o.prisma.$executeRawUnsafe(`
    UPDATE academic_year_rollovers
    SET status = 'ROLLED_BACK',
        metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
          'rolledBackAt', CURRENT_TIMESTAMP,
          'rolledBackBy', $2::int,
          'rolledBackSourceAcademicYearId', $3::int,
          'rolledBackTargetAcademicYearId', $4::int,
          'rolledBackCounts', $5::jsonb
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,i,s,t,a,JSON.stringify(r)),r}async function A(e,t,a){if(t===a)return{error:"Source and target academic years must be different."};let s=await o.prisma.$queryRawUnsafe(`
      SELECT id, school_id, academic_year
      FROM academic_years
      WHERE id IN ($1, $2)
        AND (school_id = $3 OR school_id IS NULL)
      `,t,a,e);return 2!==s.length?{error:"Source and target academic years must exist in the selected school context."}:{error:null,years:s}}async function C(e){let t=await (0,c.requirePermission)({module:"promotions",action:"read"});if(t.response)return t.response;let a=await (0,i.resolvePlatformContext)(e);if(!a)return s.NextResponse.json({error:"Unauthorized"},{status:401});let r=await o.prisma.$queryRawUnsafe(`
      SELECT
        ayr.*,
        s.school_name,
        source_year.academic_year AS source_academic_year,
        target_year.academic_year AS target_academic_year
      FROM academic_year_rollovers ayr
      LEFT JOIN schools s ON s.id = ayr.school_id
      LEFT JOIN academic_years source_year ON source_year.id = ayr.source_academic_year_id
      LEFT JOIN academic_years target_year ON target_year.id = ayr.target_academic_year_id
      WHERE ($1::int IS NULL OR ayr.school_id = $1::int)
        AND ($2::int IS NULL OR ayr.source_academic_year_id = $2::int OR ayr.target_academic_year_id = $2::int)
      ORDER BY ayr.created_at DESC
      LIMIT 100
      `,a.schoolId,a.academicYearId);return s.NextResponse.json({rollovers:r})}async function T(e){let t=await (0,c.requirePermission)({module:"promotions",action:"create"});if(t.response)return t.response;try{let t=await e.json(),a=O(t.source_academic_year_id),c=O(t.target_academic_year_id);if(!a||!c)return s.NextResponse.json({error:"Source and target academic years are required for rollover."},{status:400});let{context:_,error:d}=await (0,i.resolveMutationContext)(e,{...t,academic_year_id:a});if(!_)return s.NextResponse.json({error:d},{status:400});let l=_.requiredSchoolId,E=await A(l,a,c);if(E.error)return s.NextResponse.json({error:E.error},{status:400});let u=(e=>{if(!Array.isArray(e))return R;let t=new Set(R),a=e.map(e=>String(e).trim().toLowerCase()).filter(e=>t.has(e));return a.length?a:R})(t.entities),N=await n(l,a),C=await n(l,c),T=[];u.includes("sections")&&N.classes>0&&N.sections>0&&!u.includes("classes")&&T.push("Sections depend on classes. Include classes before rolling over sections."),u.includes("students")&&0===C.classes&&N.students>0&&!u.includes("classes")&&T.push("Student carry-forward requires target classes. Preview or execute classes first.");let h=String(t.action||"PREVIEW").toUpperCase();if("PREVIEW"===h)return s.NextResponse.json({status:"PREVIEW",school_id:l,source_academic_year_id:a,target_academic_year_id:c,entities:u,sourceCounts:N,targetCountsBefore:C,validationErrors:T,canExecute:0===T.length});if("EXECUTE"!==h)return s.NextResponse.json({error:"Rollover action must be PREVIEW or EXECUTE."},{status:400});if(T.length)return s.NextResponse.json({error:"Rollover validation failed.",validationErrors:T},{status:400});let g=await o.prisma.$queryRawUnsafe(`
        INSERT INTO academic_year_rollovers (
          school_id,
          source_academic_year_id,
          target_academic_year_id,
          status,
          requested_by,
          approved_by,
          executed_by,
          approved_at,
          executed_at,
          source_counts,
          target_counts,
          validation_errors,
          metadata,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,'EXECUTED',$4,$4,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,$5::jsonb,$6::jsonb,$7::jsonb,$8::jsonb,$4,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING id
        `,l,a,c,_.updatedBy,JSON.stringify(N),JSON.stringify(C),JSON.stringify(T),JSON.stringify({entities:u,flow:"preview_validate_approve_execute_audit"})),S=g[0]?.id,p=await m(l,a,c,_.updatedBy,u,S),y=await n(l,c);return await o.prisma.$executeRawUnsafe(`
      UPDATE academic_year_rollovers
      SET copied_counts = $1::jsonb,
          target_counts = $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,JSON.stringify(p),JSON.stringify(y),S),await (0,r.recordEvent)({school_id:l,academic_year_id:c,user_id:_.updatedBy,actor_role:_.user.role,module_name:"academic_year",event_type:"ACADEMIC_YEAR_ROLLOVER_EXECUTED",action:"rollover",entity_type:"academic_year_rollover",entity_id:S,summary:"Academic year rollover executed",payload:{rolloverId:S,sourceAcademicYearId:a,targetAcademicYearId:c,copiedCounts:p,entities:u}}),s.NextResponse.json({status:"EXECUTED",rolloverId:S,copiedCounts:p,sourceCounts:N,targetCountsBefore:C,targetCountsAfter:y},{status:201})}catch(e){return console.error(e),s.NextResponse.json({error:"Academic year rollover failed."},{status:500})}}async function h(e){let t=await (0,c.requirePermission)({module:"promotions",action:"delete"});if(t.response)return t.response;try{let t=await e.json(),a=O(t.rollover_id);if(!a)return s.NextResponse.json({error:"Rollover identifier is required for rollback."},{status:400});let{context:c,error:_}=await (0,i.resolveMutationContext)(e,{rollover_id:a});if(!c)return s.NextResponse.json({error:_},{status:400});let d=c.requiredSchoolId,n=(await o.prisma.$queryRawUnsafe(`
        SELECT id, school_id, source_academic_year_id, target_academic_year_id, status
        FROM academic_year_rollovers
        WHERE id = $1
          AND ($2::int IS NULL OR school_id = $2::int)
        LIMIT 1
        `,a,d))[0];if(!n)return s.NextResponse.json({error:"Academic year rollover not found."},{status:404});if("EXECUTED"!==String(n.status||"").toUpperCase())return s.NextResponse.json({error:"Only executed rollovers can be rolled back."},{status:400});let l=await N(d,n.source_academic_year_id,n.target_academic_year_id,c.updatedBy,n.id);return await (0,r.recordEvent)({school_id:d,academic_year_id:n.source_academic_year_id,user_id:c.updatedBy,actor_role:c.user.role,module_name:"academic_year",event_type:"ACADEMIC_YEAR_ROLLOVER_ROLLED_BACK",action:"rollback",entity_type:"academic_year_rollover",entity_id:n.id,summary:"Academic year rollover rolled back",payload:{rolloverId:n.id,sourceAcademicYearId:n.source_academic_year_id,targetAcademicYearId:n.target_academic_year_id,rolledBackCounts:l}}),s.NextResponse.json({status:"ROLLED_BACK",rolloverId:n.id,rolledBackCounts:l},{status:200})}catch(e){return console.error(e),s.NextResponse.json({error:"Academic year rollover rollback failed."},{status:500})}}e.s(["DELETE",0,h,"GET",0,C,"POST",0,T]),a()}catch(e){a(e)}},!1),275625,e=>e.a(async(t,a)=>{try{var s=e.i(747909),i=e.i(174017),r=e.i(996250),c=e.i(759756),o=e.i(561916),_=e.i(174677),d=e.i(869741),n=e.i(316795),l=e.i(487718),E=e.i(995169),u=e.i(47587),m=e.i(666012),N=e.i(570101),A=e.i(626937),C=e.i(10372),T=e.i(193695);e.i(52474);var h=e.i(600220),R=e.i(177278),O=t([R]);[R]=O.then?(await O)():O;let S=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/academic-year-rollover/route",pathname:"/api/academic-year-rollover",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/academic-year-rollover/route.ts",nextConfigOutput:"",userland:R,...{}}),{workAsyncStorage:p,workUnitAsyncStorage:y,serverHooks:L}=S;async function g(e,t,a){a.requestMeta&&(0,c.setRequestMeta)(e,a.requestMeta),S.isDev&&(0,c.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let s="/api/academic-year-rollover/route";s=s.replace(/\/index$/,"")||"/";let r=await S.prepare(e,t,{srcPage:s,multiZoneDraftMode:!1});if(!r)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,deploymentId:O,params:g,nextConfig:p,parsedUrl:y,isDraftMode:L,prerenderManifest:I,routerServerContext:$,isOnDemandRevalidate:D,revalidateOnlyGenerated:b,resolvedPathname:x,clientReferenceManifest:w,serverActionsManifest:M}=r,j=(0,d.normalizeAppPath)(s),U=!!(I.dynamicRoutes[j]||I.routes[x]),v=async()=>((null==$?void 0:$.render404)?await $.render404(e,t,y,!1):t.end("This page could not be found"),null);if(U&&!L){let e=!!I.routes[x],t=I.dynamicRoutes[j];if(t&&!1===t.fallback&&!e){if(p.adapterPath)return await v();throw new T.NoFallbackError}}let F=null;!U||S.isDev||L||(F=x,F="/index"===F?"/":F);let f=!0===S.isDev||!U,P=U&&!f;M&&w&&(0,_.setManifestsSingleton)({page:s,clientReferenceManifest:w,serverActionsManifest:M});let H=e.method||"GET",W=(0,o.getTracer)(),q=W.getActiveScopeSpan(),k=!!(null==$?void 0:$.isWrappedByNextServer),J=!!(0,c.getRequestMeta)(e,"minimalMode"),V=(0,c.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,p,I,J);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let G={params:g,previewProps:I.preview,renderOpts:{experimental:{authInterrupts:!!p.experimental.authInterrupts},cacheComponents:!!p.cacheComponents,supportsDynamicResponse:f,incrementalCache:V,cacheLifeProfiles:p.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,s,i)=>S.onRequestError(e,t,s,i,$)},sharedContext:{buildId:R,deploymentId:O}},X=new n.NodeNextRequest(e),B=new n.NodeNextResponse(t),K=l.NextRequestAdapter.fromNodeNextRequest(X,(0,l.signalFromNodeResponse)(t));try{let r,c=async e=>S.handle(K,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=W.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==E.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),r&&r!==e&&(r.setAttribute("http.route",i),r.updateName(t))}else e.updateName(`${H} ${s}`)}),_=async r=>{var o,_;let d=async({previousCacheEntry:i})=>{try{if(!J&&D&&b&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await c(r);e.fetchMetrics=G.renderOpts.fetchMetrics;let o=G.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let _=G.renderOpts.collectedTags;if(!U)return await (0,m.sendResponse)(X,B,s,G.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,N.toNodeOutgoingHttpHeaders)(s.headers);_&&(t[C.NEXT_CACHE_TAGS_HEADER]=_),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=C.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,i=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=C.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:s,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:D})},!1,$),t}},n=await S.handleResponse({req:e,nextConfig:p,cacheKey:F,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:D,revalidateOnlyGenerated:b,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:J});if(!U)return null;if((null==n||null==(o=n.value)?void 0:o.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==n||null==(_=n.value)?void 0:_.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});J||t.setHeader("x-nextjs-cache",D?"REVALIDATED":n.isMiss?"MISS":n.isStale?"STALE":"HIT"),L&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,N.fromNodeOutgoingHttpHeaders)(n.value.headers);return J&&U||l.delete(C.NEXT_CACHE_TAGS_HEADER),!n.cacheControl||t.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,A.getCacheControlHeader)(n.cacheControl)),await (0,m.sendResponse)(X,B,new Response(n.value.body,{headers:l,status:n.value.status||200})),null};k&&q?await _(q):(r=W.getActiveScopeSpan(),await W.withPropagatedContext(e.headers,()=>W.trace(E.BaseServerSpan.handleRequest,{spanName:`${H} ${s}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},_),void 0,!k))}catch(t){if(t instanceof T.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:j,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:D})},!1,$),U)throw t;return await (0,m.sendResponse)(X,B,new Response(null,{status:500})),null}}e.s(["handler",0,g,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:y})},"routeModule",0,S,"serverHooks",0,L,"workAsyncStorage",0,p,"workUnitAsyncStorage",0,y]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0j603cn._.js.map