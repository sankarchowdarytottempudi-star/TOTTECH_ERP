import type { ReactNode } from "react";

interface Props {
  student: any;
  learningGaps?: any[];
  documents?: any[];
  backlogs?: any[];
  backlogTimeline?: any[];
  backlogSummary?: {
    total?: number;
    cleared?: number;
    pending?: number;
  };
}

export default function StudentOverview({
  student,
  learningGaps = [],
  documents = [],
  backlogs = [],
  backlogTimeline = [],
  backlogSummary = {},
}: Props) {
  const hasBacklogRows =
    Array.isArray(backlogs) && backlogs.length > 0;
  const hasDocuments =
    Array.isArray(documents) && documents.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Section title="Personal Information">
        <Detail label="Gender" value={student.gender} />
        <Detail
          label="Date of Birth"
          value={student.dob ? new Date(student.dob).toLocaleDateString() : null}
        />
        <Detail label="Age" value={student.age ?? student.student_age ?? student.calculated_age} />
        <Detail label="Blood Group" value={student.blood_group} />
        <Detail label="Religion" value={student.religion} />
        <Detail label="Caste" value={student.caste} />
        <Detail label="Mother Tongue" value={student.mother_tongue} />
      </Section>

      <Section title="Admission Information">
        <Detail label="Admission Number" value={student.admission_number} />
        <Detail label="Enrollment Number" value={student.enrollment_number} />
        <Detail label="Class" value={student.class_name || student.class || student.current_class_name} />
        <Detail label="Section" value={student.section_name || student.section || student.current_section_name} />
        <Detail label="Academic Year" value={student.academic_year} />
        <Detail
          label="Date of Joining"
          value={student.date_of_joining ? new Date(student.date_of_joining).toLocaleDateString() : null}
        />
        <Detail label="Status" value={student.student_status || student.status} />
      </Section>

      <Section title="Address Information">
        <Detail label="Address Line 1" value={student.address_line_1 || student.address} />
        <Detail label="Address Line 2" value={student.address_line_2} />
        <Detail label="City / Village" value={student.city || student.village} />
        <Detail label="Mandal / Taluk" value={student.mandal || student.taluk} />
        <Detail label="District" value={student.district} />
        <Detail label="State" value={student.state} />
        <Detail label="Country" value={student.country} />
        <Detail label="Postal Code" value={student.postal_code || student.zip_code} />
        <Detail label="Landmark" value={student.landmark} />
      </Section>

      <Section title="Contact Information">
        <Detail label="Phone" value={student.phone} />
        <Detail label="Email" value={student.email} />
        <Detail label="Emergency Contact Number" value={student.emergency_contact_number} />
        <Detail label="Guardian Alternative Mobile" value={student.guardian_alternative_mobile} />
      </Section>

      <Section title="Parent Information">
        <Detail label="Father Name" value={student.father_name} />
        <Detail label="Father Phone" value={student.father_phone} />
        <Detail label="Mother Name" value={student.mother_name} />
        <Detail label="Mother Phone" value={student.mother_phone} />
        <Detail label="Emergency Contact Name" value={student.emergency_contact_name} />
        <Detail label="Relationship" value={student.relationship} />
      </Section>

      {student.has_previous_school ? (
        <Section title="Previous School / College Information">
          <Detail
            label="Previous School / College"
            value={student.previous_school_details || student.previous_school_name}
          />
          <Detail
            label="Previous Academic Performance"
            value={student.previous_academic_performance || student.previous_school_performance}
          />
        </Section>
      ) : null}

      {student.has_academic_gap ? (
        <Section title="Academic Gap Information">
          <Detail label="Has Academic Gap" value="Yes" />
          <Detail label="Gap From Year" value={student.academic_gap_from_year} />
          <Detail label="Gap To Year" value={student.academic_gap_to_year} />
          <Detail label="Gap Duration" value={student.academic_gap_duration} />
          <Detail label="Gap Reason" value={student.academic_gap_reason} />
        </Section>
      ) : null}

      <Section title="Backlog Summary">
        <Stat label="Total" value={backlogSummary.total || 0} />
        <Stat label="Cleared" value={backlogSummary.cleared || 0} />
        <Stat label="Pending" value={backlogSummary.pending || 0} />
      </Section>

      <div className="bg-white rounded-3xl p-8 shadow lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Backlog Details</h2>
          <span className="text-sm font-semibold text-slate-500">
            {hasBacklogRows ? "Tracked backlog records" : "No backlog records found"}
          </span>
        </div>

        {hasBacklogRows ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {backlogs.map((backlog, index) => {
              const status = String(backlog.backlog_status || "PENDING").toUpperCase();

              return (
                <div key={backlog.id || index} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                    {status}
                  </p>
                  <h3 className="mt-1 text-lg font-black text-slate-950">
                    {backlog.subject_name || backlog.exam_name || "General Backlog"}
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p><strong>Exam:</strong> {backlog.exam_name || "-"}</p>
                    <p><strong>Academic Year:</strong> {backlog.academic_year || "-"}</p>
                    <p><strong>Reason:</strong> {backlog.backlog_reason || "-"}</p>
                    <p><strong>Remarks:</strong> {backlog.remarks || "-"}</p>
                    <p><strong>Cleared Date:</strong> {backlog.cleared_date ? new Date(backlog.cleared_date).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
            Backlog tracking is enabled for this student, but no records have been saved yet.
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Document Information</h2>
          <span className="text-sm font-semibold text-slate-500">
            {hasDocuments ? `${documents.length} document(s)` : "No documents uploaded yet"}
          </span>
        </div>

        {hasDocuments ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc, index) => (
              <div key={doc.id || index} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                  {doc.document_type || "Document"}
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  {doc.title || doc.document_number || "Uploaded File"}
                </h3>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p><strong>File Name:</strong> {doc.file_url ? doc.file_url.split("/").pop() : "-"}</p>
                  <p><strong>Document Number:</strong> {doc.document_number || "-"}</p>
                  <p><strong>Uploaded By:</strong> {doc.uploaded_by_name || "-"}</p>
                  <p><strong>Upload Date:</strong> {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "-"}</p>
                </div>
                {doc.file_url ? (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    View / Download
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
            No student documents found.
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow lg:col-span-2">
        <h2 className="text-2xl font-black mb-4">Backlog Timeline</h2>
        {Array.isArray(backlogTimeline) && backlogTimeline.length ? (
          <div className="space-y-3">
            {backlogTimeline.map((item, index) => (
              <div key={item.id || index} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                    {String(item.event_type || "BACKLOG").replaceAll("_", " ")}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {item.occurred_at
                      ? new Date(item.occurred_at).toLocaleString()
                      : item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </span>
                </div>
                <p className="mt-2 font-bold text-slate-950">
                  {item.summary || "Backlog event"}
                </p>
                {item.payload ? (
                  <pre className="mt-3 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                    {JSON.stringify(item.payload, null, 2)}
                  </pre>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
            No backlog timeline events found yet.
          </div>
        )}
      </div>

      <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow">
        <h2 className="text-2xl font-black mb-4">Learning Gaps</h2>
        {learningGaps.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {learningGaps.map((gap, index) => (
              <div key={gap.id || index} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase text-amber-700">
                  {gap.gap_category || "Academic"}
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  {gap.subject || "General"}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {gap.description || "-"}
                </p>
                <div className="mt-3 grid gap-2 text-sm">
                  <p><strong>Severity:</strong> {gap.severity || "-"}</p>
                  <p><strong>Status:</strong> {gap.status || "-"}</p>
                  <p><strong>Identified By:</strong> {gap.identified_by || "-"}</p>
                  <p><strong>Target Date:</strong> {gap.target_date ? new Date(gap.target_date).toLocaleDateString() : "-"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">No learning gaps recorded yet.</p>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow">
      <h2 className="text-2xl font-black mb-6">{title}</h2>
      <div className="grid gap-3 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <p>
      <strong>{label}:</strong> {value ? String(value) : "-"}
    </p>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </div>
    </div>
  );
}
