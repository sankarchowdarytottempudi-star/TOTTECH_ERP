"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2 } from "lucide-react";

type School = {
  id: number;
  school_name?: string | null;
  school_code?: string | null;
};

export default function SelectSchoolPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/schools", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((rows) => {
        const list = Array.isArray(rows) ? rows : [];
        setSchools(list);
        if (list.length === 1) {
          setSelected(String(list[0].id));
        }
      })
      .catch(console.error);
  }, []);

  const continueToDashboard = async () => {
    if (!selected) {
      alert("Select a school/college to continue.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/switch-school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: selected,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to switch school/college.");
      }
      router.push("/dashboard");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to switch school/college.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f6fb] p-5 text-[#04142E]">
      <section className="w-full max-w-3xl rounded-[8px] border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-[8px] bg-[#04142E] text-[#D4AF37]">
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9A6B00]">
              TOTTECH ONE
            </p>
            <h1 className="text-3xl font-black">
              Select School/College
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Your user has access to multiple schools/colleges. Choose the school/college context for this session.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2">
          {schools.map((school) => {
            const active = selected === String(school.id);
            return (
              <button
                key={school.id}
                type="button"
                onClick={() => setSelected(String(school.id))}
                className={[
                  "flex items-center justify-between rounded-[8px] border p-4 text-left transition",
                  active
                    ? "border-[#D4AF37] bg-[#fff8e1] shadow"
                    : "border-slate-200 bg-white hover:border-[#D4AF37]",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <p className="truncate text-lg font-black">
                    {school.school_name || `School ${school.id}`}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    {school.school_code || `ID ${school.id}`}
                  </p>
                </div>
                {active ? (
                  <CheckCircle2 className="shrink-0 text-emerald-600" />
                ) : null}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={continueToDashboard}
          className="mt-7 rounded-[8px] bg-[#04142E] px-6 py-3 text-sm font-black text-white shadow disabled:opacity-60"
        >
          {saving ? "Opening School/College..." : "Continue"}
        </button>
      </section>
    </main>
  );
}
