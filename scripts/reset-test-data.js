require("dotenv").config();

const { Client } = require("pg");

const q = (name) =>
  `"${name.replace(/"/g, '""')}"`;

const truncateCandidates = [
  "academic_years",
  "admission_leads",
  "ai_action_approvals",
  "ai_action_requests",
  "ai_grounding_sources",
  "ai_health_checks",
  "ai_knowledge_queries",
  "ai_observability_events",
  "ai_student_analysis",
  "ai_usage_logs",
  "attendance",
  "attendance_master",
  "audit_logs",
  "automation_rules",
  "automation_runs",
  "billing_automations",
  "branding_settings",
  "change_impact_reports",
  "class_timelines",
  "classes",
  "communication_logs",
  "concession_audit_logs",
  "concession_requests",
  "customer_onboarding",
  "dining_attendance",
  "dining_consumption_logs",
  "dining_inventory_items",
  "dining_meal_assignments",
  "dining_meal_plans",
  "dining_production_sheets",
  "dining_purchases",
  "dining_special_diets",
  "dining_wastage_logs",
  "dining_weekly_menus",
  "event_ledger",
  "exam_schedule",
  "exam_types",
  "exams",
  "fee_categories",
  "fee_payments",
  "fees",
  "finance_approval_ledger",
  "homework_assignments",
  "homework_submissions",
  "hostel_allocations",
  "hostel_attendance",
  "hostel_beds",
  "hostel_movement_history",
  "hostel_rooms",
  "hostel_students",
  "hostel_warden_tracking",
  "hostel_wardens",
  "hostels",
  "import_jobs",
  "invoice_audit_logs",
  "invoice_installments",
  "invoice_line_items",
  "invoices",
  "lead_followups",
  "marks",
  "notification_registrations",
  "notifications",
  "operation_backups",
  "operation_health_checks",
  "payment_receipts",
  "payments",
  "profit_analytics",
  "promotion_workflow_students",
  "promotion_workflows",
  "question_bank",
  "question_paper_questions",
  "question_papers",
  "refunds",
  "renewals",
  "report_exports",
  "revenue_analytics",
  "scholarships",
  "school_lifecycle_events",
  "school_profile",
  "school_subscriptions",
  "school_timelines",
  "sections",
  "smtp_settings",
  "storage_metering",
  "student_exam_analysis",
  "student_exam_answers",
  "student_fee_assignments",
  "student_marks_entry",
  "student_promotions",
  "student_timelines",
  "student_year_enrollments",
  "students",
  "subjects",
  "teacher_attendance",
  "teacher_class_assignments",
  "teacher_timelines",
  "teachers",
  "teachers_backup",
  "timetable_entries",
  "transport_assignments",
  "transport_attendance",
  "transport_pickup_drop_history",
  "transport_routes",
  "transport_stops",
  "transport_vehicles",
  "usage_metering",
  "whatsapp_metering",
];

async function insert(client, sql, params = []) {
  const result = await client.query(
    `${sql} RETURNING id`,
    params
  );
  return result.rows[0].id;
}

async function main() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query("BEGIN");

  try {
    const tableRows =
      await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
      `);
    const existing = new Set(
      tableRows.rows.map(
        (row) => row.table_name
      )
    );
    const tables =
      truncateCandidates.filter((table) =>
        existing.has(table)
      );

    await client.query(
      `TRUNCATE ${tables
        .map(q)
        .join(", ")} CASCADE`
    );

    const schoolId = 1;
    const adminUserId = 1;

    const previousYearId = await insert(
      client,
      `INSERT INTO academic_years
       (school_id, academic_year, start_date, end_date, is_current, created_at)
       VALUES ($1,'2024-2025','2024-06-01','2025-04-30',false,CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    const currentYearId = await insert(
      client,
      `INSERT INTO academic_years
       (school_id, academic_year, start_date, end_date, is_current, created_at)
       VALUES ($1,'2025-2026','2025-06-01','2026-04-30',true,CURRENT_TIMESTAMP)`,
      [schoolId]
    );

    const teacherId = await insert(
      client,
      `INSERT INTO teachers
       (school_id, academic_year_id, employee_id, first_name, last_name, gender, phone, email,
        qualification, experience_years, joining_date, department, designation, salary, address,
        is_active, created_at, updated_at)
       VALUES ($1,$2,'EMP1001','Anita','Rao','FEMALE','9000001001','anita.rao@test.tottech',
        'M.Sc Mathematics',8,'2024-06-10','Academics','Mathematics Teacher',45000,'Kakatheeya Campus',
        true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [schoolId, currentYearId]
    );
    const scienceTeacherId = await insert(
      client,
      `INSERT INTO teachers
       (school_id, academic_year_id, employee_id, first_name, last_name, gender, phone, email,
        qualification, experience_years, joining_date, department, designation, salary, address,
        is_active, created_at, updated_at)
       VALUES ($1,$2,'EMP1002','Ravi','Kumar','MALE','9000001002','ravi.kumar@test.tottech',
        'M.Sc Physics',7,'2024-06-12','Academics','Physics Teacher',43000,'Kakatheeya Campus',
        true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [schoolId, currentYearId]
    );

    const class5Id = await insert(
      client,
      `INSERT INTO classes (school_id, class_name, class_teacher_id, created_at)
       VALUES ($1,'Class 5',$2,CURRENT_TIMESTAMP)`,
      [schoolId, teacherId]
    );
    const class6Id = await insert(
      client,
      `INSERT INTO classes (school_id, class_name, class_teacher_id, created_at)
       VALUES ($1,'Class 6',$2,CURRENT_TIMESTAMP)`,
      [schoolId, teacherId]
    );
    const class7Id = await insert(
      client,
      `INSERT INTO classes (school_id, class_name, class_teacher_id, created_at)
       VALUES ($1,'Class 7',$2,CURRENT_TIMESTAMP)`,
      [schoolId, scienceTeacherId]
    );
    const section5A = await insert(
      client,
      `INSERT INTO sections (school_id, class_id, section_name, created_at)
       VALUES ($1,$2,'A',CURRENT_TIMESTAMP)`,
      [schoolId, class5Id]
    );
    const section6A = await insert(
      client,
      `INSERT INTO sections (school_id, class_id, section_name, created_at)
       VALUES ($1,$2,'A',CURRENT_TIMESTAMP)`,
      [schoolId, class6Id]
    );
    const section6B = await insert(
      client,
      `INSERT INTO sections (school_id, class_id, section_name, created_at)
       VALUES ($1,$2,'B',CURRENT_TIMESTAMP)`,
      [schoolId, class6Id]
    );
    const section7A = await insert(
      client,
      `INSERT INTO sections (school_id, class_id, section_name, created_at)
       VALUES ($1,$2,'A',CURRENT_TIMESTAMP)`,
      [schoolId, class7Id]
    );

    const mathSubject = await insert(
      client,
      `INSERT INTO subjects (school_id, subject_name, subject_code, created_at)
       VALUES ($1,'Mathematics','MATH',CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    const physicsSubject = await insert(
      client,
      `INSERT INTO subjects (school_id, subject_name, subject_code, created_at)
       VALUES ($1,'Physics','PHY',CURRENT_TIMESTAMP)`,
      [schoolId]
    );

    await client.query(
      `INSERT INTO teacher_class_assignments
       (school_id, academic_year_id, teacher_id, class_id, section_id, subject_id, assignment_type,
        status, assigned_by, assigned_at, created_at, updated_at, metadata)
       VALUES
       ($1,$2,$3,$4,$5,$6,'SUBJECT','ACTIVE',$7,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'{}'),
       ($1,$2,$8,$9,$10,$11,'SUBJECT','ACTIVE',$7,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'{}')`,
      [
        schoolId,
        currentYearId,
        teacherId,
        class6Id,
        section6A,
        mathSubject,
        adminUserId,
        scienceTeacherId,
        class7Id,
        section7A,
        physicsSubject,
      ]
    );

    async function student({
      first,
      last,
      admission,
      enrollment,
      phone,
      classId,
      sectionId,
      roll,
    }) {
      const id = await insert(
        client,
        `INSERT INTO students
         (school_id, academic_year_id, enrollment_number, admission_number, name, first_name, last_name,
          gender, phone, father_name, mother_name, roll_number, section_id, current_class_id,
          current_section_id, is_active, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'FEMALE',$8,$9,$10,$11,$12,$13,$12,true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
        [
          schoolId,
          currentYearId,
          enrollment,
          admission,
          `${first} ${last}`,
          first,
          last,
          phone,
          `${last} Father`,
          `${last} Mother`,
          roll,
          sectionId,
          classId,
        ]
      );

      await client.query(
        `INSERT INTO student_year_enrollments
         (school_id, student_id, academic_year_id, class_id, section_id, roll_number, status, source, metadata, created_at, updated_at)
         VALUES
         ($1,$2,$3,$4,$5,$6,'ACTIVE','reset-seed','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
         ($1,$2,$7,$8,$9,$6,'PROMOTED','reset-seed','{"history":"previous academic year"}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
        [
          schoolId,
          id,
          currentYearId,
          classId,
          sectionId,
          roll,
          previousYearId,
          class5Id,
          section5A,
        ]
      );

      return id;
    }

    const student1 = await student({
      first: "Lokesh",
      last: "Varma",
      admission: "ADM1001",
      enrollment: "ENR1001",
      phone: "9229163969",
      classId: class6Id,
      sectionId: section6A,
      roll: "01",
    });
    const student2 = await student({
      first: "Sindhu",
      last: "Kumar",
      admission: "ADM1002",
      enrollment: "ENR1002",
      phone: "9579204696",
      classId: class6Id,
      sectionId: section6A,
      roll: "02",
    });
    const student3 = await student({
      first: "Sravani",
      last: "Kumar",
      admission: "ADM1003",
      enrollment: "ENR1003",
      phone: "9577259591",
      classId: class6Id,
      sectionId: section6B,
      roll: "03",
    });
    const student4 = await student({
      first: "Deepika",
      last: "Rao",
      admission: "ADM1004",
      enrollment: "ENR1004",
      phone: "9918833677",
      classId: class7Id,
      sectionId: section7A,
      roll: "04",
    });

    await client.query(
      `INSERT INTO attendance_master
       (school_id, academic_year_id, class_id, section_id, student_id, attendance_date, status, remarks, created_at)
       VALUES
       ($1,$2,$3,$4,$5,CURRENT_DATE,'PRESENT','Seed present',CURRENT_TIMESTAMP),
       ($1,$2,$3,$4,$6,CURRENT_DATE,'ABSENT','Seed absent',CURRENT_TIMESTAMP),
       ($1,$2,$3,$7,$8,CURRENT_DATE,'LATE','Seed late',CURRENT_TIMESTAMP),
       ($1,$2,$9,$10,$11,CURRENT_DATE,'PRESENT','Seed present',CURRENT_TIMESTAMP),
       ($1,$12,$13,$14,$5,CURRENT_DATE - INTERVAL '370 days','PRESENT','Previous year history',CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        student1,
        student2,
        section6B,
        student3,
        class7Id,
        section7A,
        student4,
        previousYearId,
        class5Id,
        section5A,
      ]
    );

    const tuitionFee = await insert(
      client,
      `INSERT INTO fee_categories
       (school_id, academic_year_id, class_id, section_id, fee_name, fee_code, amount, frequency, billing_cycle, description, is_active, created_at, metadata)
       VALUES ($1,$2,$3,$4,'Tuition Fee','TUT-Q1',12000,'QUARTERLY','QUARTERLY','Quarterly tuition fee',true,CURRENT_TIMESTAMP,'{}')`,
      [schoolId, currentYearId, class6Id, section6A]
    );
    const diningFee = await insert(
      client,
      `INSERT INTO fee_categories
       (school_id, academic_year_id, class_id, fee_name, fee_code, amount, frequency, billing_cycle, description, is_active, created_at, metadata)
       VALUES ($1,$2,$3,'Dining Plan','DIN-M1',1800,'MONTHLY','MONTHLY','Monthly dining fee',true,CURRENT_TIMESTAMP,'{}')`,
      [schoolId, currentYearId, class6Id]
    );

    const invoice1 = await insert(
      client,
      `INSERT INTO invoices
       (school_id, academic_year_id, class_id, section_id, student_id, invoice_number, invoice_date, due_date,
        total_amount, paid_amount, balance_amount, status, billing_scope, billing_period, installment_count, source, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'INV-TEST-1001',CURRENT_DATE,CURRENT_DATE + INTERVAL '30 days',
        13800,5000,8800,'PARTIAL','STUDENT','Q1',2,'reset-seed','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        student1,
      ]
    );
    const invoice2 = await insert(
      client,
      `INSERT INTO invoices
       (school_id, academic_year_id, class_id, section_id, student_id, invoice_number, invoice_date, due_date,
        total_amount, paid_amount, balance_amount, status, billing_scope, billing_period, installment_count, source, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'INV-TEST-1002',CURRENT_DATE,CURRENT_DATE + INTERVAL '30 days',
        13800,0,13800,'PENDING','STUDENT','Q1',2,'reset-seed','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        student2,
      ]
    );
    await client.query(
      `INSERT INTO invoice_line_items
       (invoice_id, fee_category_id, fee_name, amount, metadata, created_at)
       VALUES
       ($1,$2,'Tuition Fee',12000,'{}',CURRENT_TIMESTAMP),
       ($1,$3,'Dining Plan',1800,'{}',CURRENT_TIMESTAMP),
       ($4,$2,'Tuition Fee',12000,'{}',CURRENT_TIMESTAMP),
       ($4,$3,'Dining Plan',1800,'{}',CURRENT_TIMESTAMP)`,
      [invoice1, tuitionFee, diningFee, invoice2]
    );
    await client.query(
      `INSERT INTO invoice_installments
       (invoice_id, part_number, part_label, due_date, amount, paid_amount, balance_amount, status, metadata, created_at, updated_at)
       VALUES
       ($1,1,'Part 1',CURRENT_DATE + INTERVAL '15 days',6900,5000,1900,'PARTIAL','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
       ($1,2,'Part 2',CURRENT_DATE + INTERVAL '30 days',6900,0,6900,'PENDING','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
       ($2,1,'Part 1',CURRENT_DATE + INTERVAL '15 days',6900,0,6900,'PENDING','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
       ($2,2,'Part 2',CURRENT_DATE + INTERVAL '30 days',6900,0,6900,'PENDING','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [invoice1, invoice2]
    );
    const paymentId = await insert(
      client,
      `INSERT INTO payments
       (school_id, academic_year_id, class_id, section_id, invoice_id, student_id, payment_date, payment_method,
        amount, reference_number, remarks, receipt_number, received_by, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,CURRENT_DATE,'UPI',5000,'UPI-TEST-1001','Seed partial payment','RCPT-TEST-1001',$7,'{}',CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        invoice1,
        student1,
        adminUserId,
      ]
    );
    await client.query(
      `INSERT INTO payment_receipts
       (receipt_number, payment_id, receipt_date, amount, created_at)
       VALUES ('RCPT-TEST-1001',$1,CURRENT_DATE,5000,CURRENT_TIMESTAMP)`,
      [paymentId]
    );

    const concessionId = await insert(
      client,
      `INSERT INTO concession_requests
       (school_id, academic_year_id, student_id, invoice_id, fee_category_id, academic_year, requested_amount, reason, status, requested_by, requested_at, metadata)
       VALUES ($1,$2,$3,$4,$5,'2025-2026',1500,'Sibling concession test request','PENDING',$6,CURRENT_TIMESTAMP,'{}')`,
      [
        schoolId,
        currentYearId,
        student2,
        invoice2,
        tuitionFee,
        adminUserId,
      ]
    );
    await client.query(
      `INSERT INTO finance_approval_ledger
       (school_id, academic_year_id, entity_type, entity_id, workflow_type, requested_amount, status, requested_by, reason, metadata, created_at, updated_at)
       VALUES ($1,$2,'concession_request',$3,'CONCESSION',1500,'PENDING',$4,'Seed concession approval flow','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        concessionId,
        adminUserId,
      ]
    );

    const mealPlanId = await insert(
      client,
      `INSERT INTO dining_meal_plans
       (school_id, academic_year_id, plan_name, meal_type, price, status, metadata, created_by, created_at, updated_at)
       VALUES ($1,$2,'Monthly Lunch Plan','LUNCH',1800,'ACTIVE','{}',$3,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [schoolId, currentYearId, adminUserId]
    );
    await client.query(
      `INSERT INTO dining_weekly_menus
       (school_id, academic_year_id, week_start, day_of_week, meal_type, menu_items, nutrition_notes, created_by, created_at, updated_at)
       VALUES ($1,$2,CURRENT_DATE,'MONDAY','LUNCH',$3::jsonb,'Balanced lunch',$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        JSON.stringify([
          "Rice",
          "Dal",
          "Vegetable Curry",
          "Curd",
        ]),
        adminUserId,
      ]
    );
    await client.query(
      `INSERT INTO dining_meal_assignments
       (school_id, academic_year_id, meal_plan_id, student_id, start_date, end_date, status, metadata, created_at)
       VALUES ($1,$2,$3,$4,CURRENT_DATE,CURRENT_DATE + INTERVAL '30 days','ACTIVE','{}',CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        mealPlanId,
        student1,
      ]
    );
    await client.query(
      `INSERT INTO dining_attendance
       (school_id, academic_year_id, class_id, section_id, student_id, meal_type, attendance_date, status, recorded_by, source, remarks, metadata, created_at, recorded_at)
       VALUES
       ($1,$2,$3,$4,$5,'LUNCH',CURRENT_DATE,'TAKEN',$6,'reset-seed','Meal taken','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
       ($1,$2,$3,$4,$7,'LUNCH',CURRENT_DATE,'MISSED',$6,'reset-seed','Meal missed','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        student1,
        adminUserId,
        student2,
      ]
    );
    const inventoryId = await insert(
      client,
      `INSERT INTO dining_inventory_items
       (school_id, item_name, unit, current_quantity, reorder_level, metadata, created_at, updated_at)
       VALUES ($1,'Rice','KG',120,30,'{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    await client.query(
      `INSERT INTO dining_purchases
       (school_id, academic_year_id, item_id, purchase_date, quantity, unit_cost, total_cost, vendor_name, created_by, created_at)
       VALUES ($1,$2,$3,CURRENT_DATE,50,45,2250,'Test Vendor',$4,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        inventoryId,
        adminUserId,
      ]
    );
    await client.query(
      `INSERT INTO dining_consumption_logs
       (school_id, academic_year_id, item_id, consumption_date, quantity, meal_type, recorded_by, metadata, created_at)
       VALUES ($1,$2,$3,CURRENT_DATE,8,'LUNCH',$4,'{}',CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        inventoryId,
        adminUserId,
      ]
    );
    const productionId = await insert(
      client,
      `INSERT INTO dining_production_sheets
       (school_id, academic_year_id, production_date, meal_type, expected_count, produced_count, served_count, cost_amount, metadata, created_by, created_at)
       VALUES ($1,$2,CURRENT_DATE,'LUNCH',120,118,116,3200,'{}',$3,CURRENT_TIMESTAMP)`,
      [schoolId, currentYearId, adminUserId]
    );
    await client.query(
      `INSERT INTO dining_wastage_logs
       (school_id, academic_year_id, production_sheet_id, wastage_date, quantity, cost_amount, reason, recorded_by, created_at)
       VALUES ($1,$2,$3,CURRENT_DATE,2,54,'Seed wastage test',$4,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        productionId,
        adminUserId,
      ]
    );

    const vehicleId = await insert(
      client,
      `INSERT INTO transport_vehicles
       (school_id, vehicle_number, vehicle_type, capacity, driver_name, driver_phone, created_at)
       VALUES ($1,'AP39TT1001','BUS',40,'Ramesh','9000010001',CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    const routeId = await insert(
      client,
      `INSERT INTO transport_routes
       (school_id, route_name, vehicle_number, driver_name, driver_phone, created_at)
       VALUES ($1,'North Campus Route','AP39TT1001','Ramesh','9000010001',CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    await client.query(
      `INSERT INTO transport_stops
       (school_id, stop_name, stop_time, created_at)
       VALUES ($1,'Main Gate','08:10',CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    await client.query(
      `INSERT INTO transport_assignments
       (school_id, academic_year_id, student_id, route_id, pickup_point, drop_point, assigned_to_type, status, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,'Main Gate','Main Gate','STUDENT','ACTIVE',$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        student1,
        routeId,
        adminUserId,
      ]
    );
    await client.query(
      `INSERT INTO transport_attendance
       (school_id, academic_year_id, student_id, route_id, vehicle_id, trip_type, attendance_date, status, pickup_point, drop_point, recorded_by, remarks, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,'PICKUP',CURRENT_DATE,'BOARDED','Main Gate','School',$6,'Seed transport attendance','{}',CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        student1,
        routeId,
        vehicleId,
        adminUserId,
      ]
    );

    const hostelId = await insert(
      client,
      `INSERT INTO hostels
       (school_id, hostel_name, hostel_type, warden_name, warden_phone, created_at)
       VALUES ($1,'Kakatheeya Boys Hostel','BOYS','Suresh','9000020001',CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    const roomId = await insert(
      client,
      `INSERT INTO hostel_rooms
       (school_id, room_number, hostel_name, capacity, created_at)
       VALUES ($1,'B-101','Kakatheeya Boys Hostel',4,CURRENT_TIMESTAMP)`,
      [schoolId]
    );
    const bedId = await insert(
      client,
      `INSERT INTO hostel_beds
       (school_id, hostel_id, room_id, bed_number, status, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,'B-101-01','OCCUPIED','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [schoolId, hostelId, roomId]
    );
    await client.query(
      `INSERT INTO hostel_allocations
       (school_id, academic_year_id, student_id, hostel_id, room_id, bed_number, allocation_date, created_at)
       VALUES ($1,$2,$3,$4,$5,'B-101-01',CURRENT_DATE,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        student1,
        hostelId,
        roomId,
      ]
    );
    await client.query(
      `INSERT INTO hostel_attendance
       (school_id, academic_year_id, student_id, hostel_id, room_id, attendance_date, status, recorded_by, remarks, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,'PRESENT',$6,'Night roll-call seed','{}',CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        student1,
        hostelId,
        roomId,
        adminUserId,
      ]
    );
    await client.query(
      `INSERT INTO hostel_movement_history
       (school_id, academic_year_id, student_id, hostel_id, room_id, bed_id, movement_type, movement_at, recorded_by, notes, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,'CHECK_IN',CURRENT_TIMESTAMP,$7,'Seed hostel check-in','{}',CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        student1,
        hostelId,
        roomId,
        bedId,
        adminUserId,
      ]
    );

    const examTypeId = await insert(
      client,
      `INSERT INTO exam_types
       (exam_name, description, is_active, created_at)
       VALUES ('Unit Test','Seed unit test type',true,CURRENT_TIMESTAMP)`
    );
    const examId = await insert(
      client,
      `INSERT INTO exams
       (school_id, academic_year_id, exam_name, exam_type, start_date, end_date, created_at)
       VALUES ($1,$2,'Unit Test 1','UNIT_TEST',CURRENT_DATE + INTERVAL '7 days',CURRENT_DATE + INTERVAL '10 days',CURRENT_TIMESTAMP)`,
      [schoolId, currentYearId]
    );
    const questionId = await insert(
      client,
      `INSERT INTO question_bank
       (school_id, academic_year_id, class_id, section_id, subject_id, chapter_name, topic_name,
        learning_outcome, difficulty_level, bloom_level, question_type, question_text, answer_text,
        max_marks, created_by, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'Algebra','Linear Equations','Solve equations','MEDIUM','APPLY','TEXT',
        'Solve: 2x + 5 = 17. Show each step.','x = 6',5,$6,$7::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        mathSubject,
        adminUserId,
        JSON.stringify({
          scribble_enabled: true,
          formula_support: true,
        }),
      ]
    );
    const paperId = await insert(
      client,
      `INSERT INTO question_papers
       (school_id, academic_year_id, exam_id, exam_type_id, class_id, section_id, subject_id, paper_name,
        total_marks, exam_date, instructions, duration_minutes, metadata, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'Mathematics Unit Test Paper',5,CURRENT_DATE + INTERVAL '7 days',
        'Answer all questions. Scribble area enabled for formulas and diagrams.',60,$8::jsonb,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        examId,
        examTypeId,
        class6Id,
        section6A,
        mathSubject,
        JSON.stringify({
          scribble_enabled: true,
        }),
        adminUserId,
      ]
    );
    await client.query(
      `INSERT INTO question_paper_questions
       (question_paper_id, question_id, display_order, section_name, question_marks, is_optional, metadata, created_at)
       VALUES ($1,$2,1,'Section A',5,false,'{}',CURRENT_TIMESTAMP)`,
      [paperId, questionId]
    );
    const scheduleId = await insert(
      client,
      `INSERT INTO exam_schedule
       (school_id, academic_year_id, exam_id, exam_type_id, question_paper_id, class_id, section_id, subject_id,
        exam_date, start_time, end_time, room_no, invigilator_teacher_id, status, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE + INTERVAL '7 days','09:30','10:30','Room 101',$9,'SCHEDULED','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        examId,
        examTypeId,
        paperId,
        class6Id,
        section6A,
        mathSubject,
        teacherId,
      ]
    );
    await client.query(
      `INSERT INTO student_marks_entry
       (school_id, academic_year_id, class_id, section_id, student_id, exam_schedule_id, question_paper_id, question_id,
        obtained_marks, max_marks, grade, remarks, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,4,5,'A','Good algebra steps',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        student1,
        scheduleId,
        paperId,
        questionId,
      ]
    );
    await client.query(
      `INSERT INTO homework_assignments
       (school_id, academic_year_id, class_id, section_id, subject_id, teacher_id, title, description, due_date,
        status, created_by, assignment_type, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,'Algebra Practice','Complete worksheet questions 1 to 10. Scribble rough work is allowed.',
        CURRENT_DATE + INTERVAL '3 days','ASSIGNED',$7,'HOMEWORK',$8::jsonb,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        class6Id,
        section6A,
        mathSubject,
        teacherId,
        adminUserId,
        JSON.stringify({
          scribble_enabled: true,
        }),
      ]
    );

    const eventId = await insert(
      client,
      `INSERT INTO event_ledger
       (school_id, academic_year_id, user_id, actor_role, module_name, event_type, action, entity_type, entity_id,
        severity, summary, payload, metadata, occurred_at, created_at)
       VALUES ($1,$2,$3,'SUPER_ADMIN','recovery','TEST_DATA_SEEDED','seed','school',$1,'INFO',
        'Fresh post-clear test dataset created',$4::jsonb,'{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        currentYearId,
        adminUserId,
        JSON.stringify({
          students: 4,
          teachers: 2,
          invoices: 2,
        }),
      ]
    );
    await client.query(
      `INSERT INTO school_timelines
       (school_id, event_id, academic_year_id, title, description, source_module, visibility, metadata, occurred_at, created_at)
       VALUES ($1,$2,$3,'Fresh Test Dataset Created','Database cleared and a new functional test dataset was seeded.','recovery','SCHOOL','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [schoolId, eventId, currentYearId]
    );
    await client.query(
      `INSERT INTO student_timelines
       (school_id, student_id, event_id, academic_year_id, title, description, source_module, visibility, metadata, occurred_at, created_at)
       VALUES ($1,$2,$3,$4,'Student Test Journey Started','Student has attendance, invoice, dining, hostel, transport and exam records.','recovery','SCHOOL','{}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        student1,
        eventId,
        currentYearId,
      ]
    );
    await client.query(
      `INSERT INTO report_exports
       (school_id, report_key, format, status, filter_json, created_by, created_at)
       VALUES ($1,'principal-daily-command','json','READY',$2::jsonb,$3,CURRENT_TIMESTAMP)`,
      [
        schoolId,
        JSON.stringify({
          seeded: true,
          generated_from:
            "post_clear_seed",
        }),
        adminUserId,
      ]
    );

    await client.query("COMMIT");

    const counts = await client.query(`
      SELECT 'academic_years' AS table_name, COUNT(*)::int AS count FROM academic_years UNION ALL
      SELECT 'classes', COUNT(*)::int FROM classes UNION ALL
      SELECT 'sections', COUNT(*)::int FROM sections UNION ALL
      SELECT 'subjects', COUNT(*)::int FROM subjects UNION ALL
      SELECT 'students', COUNT(*)::int FROM students UNION ALL
      SELECT 'teachers', COUNT(*)::int FROM teachers UNION ALL
      SELECT 'attendance_master', COUNT(*)::int FROM attendance_master UNION ALL
      SELECT 'invoices', COUNT(*)::int FROM invoices UNION ALL
      SELECT 'payments', COUNT(*)::int FROM payments UNION ALL
      SELECT 'dining_meal_plans', COUNT(*)::int FROM dining_meal_plans UNION ALL
      SELECT 'dining_attendance', COUNT(*)::int FROM dining_attendance UNION ALL
      SELECT 'transport_routes', COUNT(*)::int FROM transport_routes UNION ALL
      SELECT 'transport_assignments', COUNT(*)::int FROM transport_assignments UNION ALL
      SELECT 'hostels', COUNT(*)::int FROM hostels UNION ALL
      SELECT 'hostel_allocations', COUNT(*)::int FROM hostel_allocations UNION ALL
      SELECT 'question_papers', COUNT(*)::int FROM question_papers UNION ALL
      SELECT 'exam_schedule', COUNT(*)::int FROM exam_schedule UNION ALL
      SELECT 'homework_assignments', COUNT(*)::int FROM homework_assignments UNION ALL
      SELECT 'event_ledger', COUNT(*)::int FROM event_ledger
      ORDER BY table_name
    `);
    console.table(counts.rows);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
