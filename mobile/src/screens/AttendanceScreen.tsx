import React from "react";

import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";

const modules = [
  "Student Attendance",
  "Staff Attendance",
  "Dining Attendance",
  "Hostel Attendance",
  "Transport Attendance",
  "Future-date Guard",
  "Timeline Events",
];

export default function AttendanceScreen() {
  return (
    <ScreenShell
      title="Attendance"
      subtitle="Daily operations with no page-level horizontal scrolling."
    >
      {modules.map((module) => (
        <ModuleCard
          key={module}
          title={module}
          detail="Attendance writes feed the event ledger and student or teacher timelines."
        />
      ))}
    </ScreenShell>
  );
}
