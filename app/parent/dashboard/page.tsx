"use client";

import ParentPortalView from "../_components/ParentPortalView";

export default function ParentDashboardPage() {
  return (
    <ParentPortalView
      view="dashboard"
      title="Student 360"
      subtitle="Read-only access to your linked student’s attendance, marks, homework, timetable, syllabus, exams, fees, PTM, and parent declarations."
    />
  );
}
