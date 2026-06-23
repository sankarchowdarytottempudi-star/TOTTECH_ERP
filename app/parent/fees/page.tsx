"use client";

import ParentPortalView from "../_components/ParentPortalView";

export default function ParentFeesPage() {
  return (
    <ParentPortalView
      view="fees"
      title="Fees"
      subtitle="View fee rows, paid amounts, and outstanding balance for the linked student."
    />
  );
}
