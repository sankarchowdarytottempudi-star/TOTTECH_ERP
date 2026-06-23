"use client";

import ParentPortalView from "../_components/ParentPortalView";

export default function ParentAttendancePage() {
  return (
    <ParentPortalView
      view="attendance"
      title="Attendance"
      subtitle="View attendance history and parent declarations for your linked student only."
    />
  );
}
