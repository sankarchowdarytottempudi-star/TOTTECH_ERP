"use client";

type BacklogRow = {
  subject_id?: string | number | null;
  exam_id?: string | number | null;
  backlog_status?: string | null;
  backlog_reason?: string | null;
  cleared_date?: string | null;
  remarks?: string | null;
};

export function createBacklogRow(): BacklogRow {
  return {
    subject_id: "",
    exam_id: "",
    backlog_status: "Pending",
    backlog_reason: "",
    cleared_date: "",
    remarks: "",
  };
}

type Props = {
  enabled: boolean;
  rows: BacklogRow[];
  onRowsChange: (rows: BacklogRow[]) => void;
  subjects: Array<{
    id: number;
    subject_name?: string | null;
    subject_code?: string | null;
  }>;
  exams: Array<{
    id: number;
    exam_name?: string | null;
  }>;
};

export default function StudentBacklogSection({
  enabled,
  rows,
  onRowsChange,
  subjects,
  exams,
}: Props) {
  if (!enabled) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-slate-600 md:col-span-2 xl:col-span-2">
        No backlog selected. Backlog rows will be saved as NULL.
      </div>
    );
  }

  const safeRows = rows.length ? rows : [createBacklogRow()];

  const updateRow = (index: number, patch: Partial<BacklogRow>) => {
    const nextRows = [...safeRows];
    nextRows[index] = {
      ...nextRows[index],
      ...patch,
    };
    onRowsChange(nextRows);
  };

  return (
    <div className="md:col-span-2 xl:col-span-2 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-700">
          Multiple backlog records can be tracked per student.
        </p>
        <button
          type="button"
          onClick={() =>
            onRowsChange([
              ...safeRows,
              createBacklogRow(),
            ])
          }
          className="rounded-[8px] border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-black text-amber-900"
        >
          Add Backlog Row
        </button>
      </div>

      <div className="space-y-4">
        {safeRows.map((row, index) => (
          <div
            key={`backlog-${index}`}
            className="rounded-[8px] border border-amber-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Backlog #{index + 1}
              </h4>
              <button
                type="button"
                onClick={() =>
                  onRowsChange(
                    safeRows.filter((_, itemIndex) => itemIndex !== index)
                  )
                }
                className="rounded-[8px] border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700"
              >
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Subject
                </span>
                <select
                  className="input"
                  value={String(row.subject_id || "")}
                  onChange={(event) =>
                    updateRow(index, {
                      subject_id: event.target.value,
                    })
                  }
                >
                  <option value="">Select Subject</option>
                  {subjects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subject_name || item.subject_code || `Subject ${item.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Exam
                </span>
                <select
                  className="input"
                  value={String(row.exam_id || "")}
                  onChange={(event) =>
                    updateRow(index, {
                      exam_id: event.target.value,
                    })
                  }
                >
                  <option value="">Select Exam</option>
                  {exams.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.exam_name || `Exam ${item.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Status
                </span>
                <select
                  className="input"
                  value={row.backlog_status || "Pending"}
                  onChange={(event) =>
                    updateRow(index, {
                      backlog_status: event.target.value,
                    })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                </select>
              </label>

              <label className="min-w-0">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Cleared Date
                </span>
                <input
                  type="date"
                  className="input"
                  value={row.cleared_date || ""}
                  onChange={(event) =>
                    updateRow(index, {
                      cleared_date: event.target.value,
                    })
                  }
                />
              </label>

              <label className="min-w-0 md:col-span-2 xl:col-span-2">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Backlog Reason
                </span>
                <textarea
                  className="input min-h-[90px]"
                  value={row.backlog_reason || ""}
                  onChange={(event) =>
                    updateRow(index, {
                      backlog_reason: event.target.value,
                    })
                  }
                />
              </label>

              <label className="min-w-0 md:col-span-2 xl:col-span-2">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Remarks
                </span>
                <textarea
                  className="input min-h-[90px]"
                  value={row.remarks || ""}
                  onChange={(event) =>
                    updateRow(index, {
                      remarks: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
