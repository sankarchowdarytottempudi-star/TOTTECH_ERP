import { prisma } from "../../../lib/prisma";

function randomBetween(
  min: number,
  max: number
) {
  return (
    Math.floor(
      Math.random() *
      (max - min + 1)
    ) + min
  );
}

export async function createFeeCategories() {

  console.log(
    "Creating Fee Categories..."
  );

  const schools =
    await prisma.schools.findMany();

  const categories = [
    {
      fee_name: "Tuition Fee",
      fee_code: "TUITION",
      amount: 25000,
    },
    {
      fee_name: "Transport Fee",
      fee_code: "TRANSPORT",
      amount: 12000,
    },
    {
      fee_name: "Hostel Fee",
      fee_code: "HOSTEL",
      amount: 30000,
    },
    {
      fee_name: "Exam Fee",
      fee_code: "EXAM",
      amount: 3000,
    },
    {
      fee_name: "Library Fee",
      fee_code: "LIBRARY",
      amount: 2000,
    },
  ];

  for (const school of schools) {

    for (const cat of categories) {

      await prisma.fee_categories.create({
        data: {

          school_id:
            school.id,

          fee_name:
            cat.fee_name,

          fee_code:
            cat.fee_code,

          amount:
            cat.amount,

          frequency:
            "YEARLY",

          description:
            cat.fee_name,

          is_active:
            true,

        },
      });

    }

  }

  console.log(
    "Fee Categories Created"
  );

}
export async function createFees() {

  console.log(
    "Creating Fees..."
  );

  const classes =
    await prisma.classes.findMany();

  for (const cls of classes) {

    const amount =
      cls.school_id === 3
        ? randomBetween(
            25000,
            45000
          )
        : randomBetween(
            35000,
            60000
          );

    await prisma.fees.create({
      data: {

        school_id:
          cls.school_id,

        class_id:
          cls.id,

        fee_type:
          "Annual Fee",

        amount,

        due_date:
          new Date(
            "2026-03-31"
          ),

      },
    });

  }

  console.log(
    "Fees Created"
  );

}

export async function createStudentFeeAssignments() {

  console.log(
    "Creating Student Fee Assignments..."
  );

  const students =
    await prisma.students.findMany();

  const categories =
    await prisma.fee_categories.findMany();

  for (const student of students) {

    const schoolCategories =
      categories.filter(
        c =>
          c.school_id ===
          student.school_id
      );

    for (
      const category of schoolCategories
    ) {

      const discount =
        student.id % 20 === 0
          ? 5000
          : 0;

      await prisma.student_fee_assignments.create({
        data: {

          student_id:
            student.id,

          fee_category_id:
            category.id,

          assigned_amount:
            category.amount,

          discount_amount:
            discount,

          academic_year:
            "2025-2026",

        },
      });

    }

  }

  console.log(
    "Student Fee Assignments Created"
  );

}

export async function createInvoices() {

  console.log(
    "Creating Invoices..."
  );

  const students =
    await prisma.students.findMany();

  let counter = 1;

  for (const student of students) {

    const totalFee =
      student.school_id === 3
        ? 35000
        : 50000;

    await prisma.invoices.create({
      data: {

        invoice_number:
          `INV-${counter}`,

        student_id:
          student.id,

        invoice_date:
          new Date(
            "2025-06-01"
          ),

        due_date:
          new Date(
            "2025-07-01"
          ),

        total_amount:
          totalFee,

        paid_amount:
          0,

        balance_amount:
          totalFee,

        status:
          "PENDING",

      },
    });

    counter++;

  }

  console.log(
    "Invoices Created"
  );

}
export async function financePartA() {

  await createFeeCategories();

  await createFees();

  await createStudentFeeAssignments();

  await createInvoices();

  console.log(
    "Finance Part A Completed"
  );

}
export async function createPayments() {

  console.log(
    "Creating Payments..."
  );

  const invoices =
    await prisma.invoices.findMany();

  let receiptCounter = 1;

  for (const invoice of invoices) {

    const bucket =
      invoice.student_id! % 100;

    let paidAmount = 0;
    let status = "PENDING";

    if (bucket < 75) {

      paidAmount =
        Number(invoice.total_amount);

      status = "PAID";

    } else if (
      bucket < 90
    ) {

      paidAmount =
        Math.round(
          Number(invoice.total_amount) *
          0.5
        );

      status =
        "PARTIAL";

    }

    await prisma.payments.create({
      data: {

        invoice_id:
          invoice.id,

student_id:
  invoice.student_id,

        payment_date:
          new Date(),

        amount:
          paidAmount,

         payment_method:
  "ONLINE",

reference_number:
  `TXN-${invoice.id}`,

        remarks:
          status,

      },
    });

    await prisma.payment_receipts.create({
      data: {

        payment_id:
          invoice.id,

        receipt_number:
          `RCPT-${receiptCounter}`,

        receipt_date:
          new Date(),

amount:
      paidAmount,

      },
    });

    await prisma.invoices.update({
      where: {
        id:
          invoice.id,
      },
      data: {

        paid_amount:
          paidAmount,

        balance_amount:
          Number(
            invoice.total_amount
          ) - paidAmount,

        status,

      },
    });

    receiptCounter++;

  }

  console.log(
    "Payments Created"
  );

}

export async function createFeePayments() {

  console.log(
    "Creating Fee Payments..."
  );

  const students =
    await prisma.students.findMany();

  const fees =
    await prisma.fees.findMany();

  for (const student of students) {

    const fee =
      fees.find(
        f =>
          f.school_id ===
          student.school_id
      );

    if (!fee) continue;

    await prisma.fee_payments.create({
      data: {

        school_id:
          student.school_id,

        student_id:
          student.id,

        fee_id:
          fee.id,

        paid_amount:
          fee.amount,

        payment_date:
          new Date(),

        payment_mode:
          "ONLINE",

        transaction_id:
          `FP-${student.id}`,

      },
    });

  }

  console.log(
    "Fee Payments Created"
  );

}

export async function financePartB() {

  await createPayments();

  await createFeePayments();

  console.log(
    "Finance Part B Completed"
  );

}
