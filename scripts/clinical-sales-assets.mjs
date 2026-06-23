import fs from "fs";
import path from "path";

import PDFDocument from "pdfkit";

const root = process.cwd();
const assetDir = path.join(root, "sales-assets", "clinical-services");
fs.mkdirSync(assetDir, { recursive: true });

const generatedAt = new Date().toISOString();

const documents = [
  {
    file: "HOSPITAL_BROCHURE",
    title: "TOTTECH Clinical Services - Hospital Brochure",
    subtitle: "Enterprise Hospital + IVF + Revenue Operating System",
    sections: [
      ["Positioning", "TOTTECH Clinical Services is a multi-tenant SaaS platform for hospitals, IVF centers, diagnostics, pharmacy, and multi-branch healthcare groups. It combines patient operations, clinical workflows, integrated billing, patient timeline, hospital branding, and governance in one platform."],
      ["Best-Fit Customers", "Small hospitals, IVF centers, diagnostic centers, day-care hospitals, and growing multi-speciality clinics that need enterprise-grade workflows without enterprise-grade cost."],
      ["Core Differentiators", "Multi-tenant architecture, IVF included from day one, hospital-specific branding, complete patient timeline, integrated billing and receipts, normalized clinical data model, PDF documents with QR verification, and faster deployment."],
      ["Demo Tenant", "TOTTECH Multi-Speciality Hospital is populated with realistic users, doctors, patients, consultations, lab reports, radiology reports, medicines, admissions, ICU cases, IVF cases, invoices, payments, and timeline events."],
      ["Why It Matters", "Hospitals do not buy screens. They buy operational confidence. TOTTECH Clinical Services proves the patient journey from registration to consultation, lab, pharmacy, billing, documents, and executive visibility."],
    ],
  },
  {
    file: "FEATURE_COMPARISON_SHEET",
    title: "Feature Comparison Sheet",
    subtitle: "How TOTTECH Clinical Services should be positioned",
    sections: [
      ["Against Basic HMS Products", "Most products pitch OP, IP, lab, pharmacy, and billing. TOTTECH leads with SaaS tenant isolation, IVF workflows, patient timeline, branding, and integrated revenue flow."],
      ["Against Enterprise HMS Products", "Large platforms are powerful but expensive and slow to deploy. TOTTECH is positioned as faster, simpler, affordable, and adaptable for Indian hospitals and IVF centers."],
      ["Must-Have Proof Points", "End-to-end patient workflow, no cross-tenant data leakage, PDFs with branding and QR verification, billing reconciliation, role access, audit trail, and real demo data."],
      ["Buyer Personas", "Chairman: growth and control. CEO: operational throughput. CFO: collections and receivables. CIO: security, audit, scalability. Doctor: simple patient record and reports. Front desk: fast registration and billing."],
    ],
  },
  {
    file: "PRICING_PLANS",
    title: "Pricing Plans",
    subtitle: "Draft commercial model for pilot discussions",
    sections: [
      ["Starter Clinic", "For single-branch clinics and diagnostic centers. Includes patient registration, appointments, OP consultation, billing, pharmacy basics, reports, and branding."],
      ["Hospital Standard", "For small hospitals. Adds IP, admissions, discharge, nursing, laboratory, radiology, inventory, insurance workflow, financial reports, and role governance."],
      ["IVF Enterprise", "For fertility and IVF centers. Adds IVF cycle management, embryology, cryostorage, transfer tracking, IVF billing, outcome analytics, and patient timeline."],
      ["Multi-Branch Enterprise", "For hospital chains. Adds multi-tenant/group controls, branch dashboards, subscription management, SaaS governance, integrations, backups, and priority support."],
      ["Pricing Note", "Keep pilot pricing affordable, but charge for onboarding, data migration, WhatsApp/SMS usage, custom reports, integrations, and extra branches."],
    ],
  },
  {
    file: "IMPLEMENTATION_TIMELINE",
    title: "Implementation Timeline",
    subtitle: "Recommended 2-6 week deployment path",
    sections: [
      ["Week 1 - Discovery and Setup", "Confirm hospital departments, branches, users, workflows, branding, billing items, lab tests, medicines, and existing data format."],
      ["Week 2 - Configuration", "Create tenant, hospital, branches, departments, roles, users, master data, invoice templates, document branding, and payment modes."],
      ["Week 3 - Data Migration", "Import patients, doctors, medicines, lab tests, outstanding invoices, and opening stock. Validate missing fields before final load."],
      ["Week 4 - UAT", "Receptionist, doctor, nurse, lab technician, pharmacist, finance, and admin run daily workflows. Capture extra clicks, missing fields, confusing screens, slow pages, and permission issues."],
      ["Week 5-6 - Go-Live", "Freeze old data, perform final import, verify backups, train staff, run parallel billing checks, and move to production."],
    ],
  },
  {
    file: "SECURITY_AND_COMPLIANCE_DOCUMENT",
    title: "Security & Compliance Document",
    subtitle: "Hospital-grade security posture for sales and procurement review",
    sections: [
      ["Tenant Isolation", "Every clinical record is scoped by tenant_id, hospital_id, and branch_id. UAT includes a Hospital A / Hospital B isolation fixture."],
      ["Role Access", "Receptionist, doctor, nurse, lab technician, pharmacist, finance, hospital admin, CEO, CFO, and CIO have separate operating responsibilities."],
      ["Audit Trail", "Clinical actions, billing actions, document generation, security checks, and tenant validation are logged through audit/event tables and reports."],
      ["Documents", "Prescription, lab report, invoice, receipt, and verification flows support hospital branding, QR verification, and print/download use cases."],
      ["Operational Controls", "Backups, disaster recovery documentation, role permission audit, tenant security audit, and performance certification are maintained as production readiness evidence."],
    ],
  },
  {
    file: "SALES_DEMO_VIDEO_SCRIPT",
    title: "5-10 Minute Product Demo Script",
    subtitle: "Recommended live-demo flow for hospital chairman, CEO, CFO, and CIO",
    sections: [
      ["Opening - 45 seconds", "Lead with: TOTTECH Clinical Services is a multi-tenant hospital operating system with IVF support, patient timeline, integrated billing, and hospital branding. Avoid saying only OP/IP/Lab/Pharmacy."],
      ["Demo Tenant - 60 seconds", "Open TOTTECH Multi-Speciality Hospital. Show logo/branding, departments, doctors, users, and populated patient data."],
      ["Patient Journey - 3 minutes", "Register/search patient, book appointment, collect consultation fee, open doctor view, record consultation, order lab, show lab result, prescribe medicines, dispense pharmacy, and open patient timeline."],
      ["Finance & Documents - 90 seconds", "Show invoice, receipt, lab report, prescription PDF, QR verification, collections, outstanding, and revenue evidence."],
      ["SaaS & Security - 90 seconds", "Show hospital creation, branch setup, role users, subscription status, tenant disable/reactivate concept, and data isolation fixture."],
      ["Close - 45 seconds", "Position differentiators: multi-tenant, IVF included, fast deployment, hospital branding, patient timeline, integrated billing, simple UX, and affordable enterprise readiness."],
    ],
  },
  {
    file: "VERSION_1_RELEASE_CRITERIA",
    title: "Version 1.0 Release Criteria",
    subtitle: "Pilot-readiness gate before approaching hospitals",
    sections: [
      ["Critical Workflow Gate", "Patient registration, appointment, consultation, prescription, lab order/result, radiology, pharmacy, admission, billing, payment, PDF generation, and timeline must pass UAT."],
      ["Security Gate", "No major security findings. Tenant isolation must prove Hospital A cannot view Hospital B patients, bills, reports, inventory, or users."],
      ["Finance Gate", "Invoices, payments, receipts, refunds/credit notes, shift closing, daily collections, and reconciliation must match generated transactions."],
      ["Operations Gate", "Backups and recovery must be tested. Demo environment must be ready. Role-specific permissions must not block daily work or expose sensitive data incorrectly."],
      ["Sales Gate", "Brochure, pricing, feature comparison, implementation timeline, security document, demo script, screenshots, and PDFs must be ready before pilot outreach."],
    ],
  },
];

function writeMarkdown(doc) {
  const body = [
    `# ${doc.title}`,
    "",
    doc.subtitle,
    "",
    `Generated: ${generatedAt}`,
    "",
    ...doc.sections.flatMap(([heading, text]) => [`## ${heading}`, "", text, ""]),
  ].join("\n");
  fs.writeFileSync(path.join(assetDir, `${doc.file}.md`), body);
}

function writePdf(doc) {
  const pdf = new PDFDocument({ size: "A4", margin: 48 });
  const filePath = path.join(assetDir, `${doc.file}.pdf`);
  pdf.pipe(fs.createWriteStream(filePath));
  pdf.rect(0, 0, pdf.page.width, 96).fill("#04142E");
  pdf.fillColor("#D4AF37").fontSize(11).font("Helvetica-Bold").text("TOTTEMPUDI SOFTWARE SOLUTIONS", 48, 30);
  pdf.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text(doc.title, 48, 48, { width: 500 });
  pdf.moveDown(3);
  pdf.fillColor("#334155").fontSize(12).font("Helvetica").text(doc.subtitle, { width: 500 });
  pdf.moveDown(0.5);
  pdf.fillColor("#64748B").fontSize(9).text(`Generated: ${generatedAt}`);
  pdf.moveDown(1.2);

  for (const [heading, text] of doc.sections) {
    if (pdf.y > 690) pdf.addPage();
    pdf.fillColor("#04142E").fontSize(15).font("Helvetica-Bold").text(heading);
    pdf.moveDown(0.35);
    pdf.fillColor("#1F2937").fontSize(10.5).font("Helvetica").text(text, { align: "left", lineGap: 3 });
    pdf.moveDown(0.9);
  }

  pdf.fillColor("#D4AF37").fontSize(9).text("TOTTECH Clinical Services | Enterprise Hospital + IVF + ERP Platform", 48, 790);
  pdf.end();
}

for (const doc of documents) {
  writeMarkdown(doc);
  writePdf(doc);
}

const index = `# Clinical Services Sales Assets

Generated: ${generatedAt}

## Assets

${documents.map((doc) => `- ${doc.title}: \`${doc.file}.md\`, \`${doc.file}.pdf\``).join("\n")}

## Pitch Guidance

Lead with:

- Multi-tenant architecture
- IVF support included
- Fast deployment
- Hospital-specific branding
- Complete patient timeline
- Integrated billing
- Simple user experience
- Affordable compared to enterprise HMS platforms

Do not lead with generic OP/IP/Lab/Pharmacy claims. Those are table stakes.
`;

fs.writeFileSync(path.join(assetDir, "README.md"), index);
console.log(JSON.stringify({ assetDir, documents: documents.map((doc) => doc.file) }, null, 2));
