import React from "react";

import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";

const modules = [
  "Marks Entry",
  "Exam Schedule",
  "Question Bank",
  "Question Papers",
  "Import Jobs",
  "Student AI Analysis",
];

export default function MarksScreen() {
  return (
    <ScreenShell
      title="Marks"
      subtitle="Academic records, imports, reports, and AI grounding."
    >
      {modules.map((module) => (
        <ModuleCard
          key={module}
          title={module}
          detail="Academic year aware and recorded through governed APIs."
        />
      ))}
    </ScreenShell>
  );
}
