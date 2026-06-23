"use client";

import { useEffect, useState } from "react";

export default function CurrentSchoolBanner() {

  const [school, setSchool] =
    useState<any>(null);

  useEffect(() => {

    fetch("/api/my-school")
      .then((r) => r.json())
      .then(setSchool);

  }, []);

  if (!school) return null;

  return (

    <div className="tt-accent-panel mb-6 flex flex-wrap items-center gap-2 p-4 text-sm">
      <span className="font-bold">Current School/College</span>

      <span className="font-black">
        {school.school_name}
      </span>

      <span className="opacity-80">
        ({school.school_code})
      </span>

    </div>

  );

}
