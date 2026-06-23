"use client";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  "Overview",
  "Attendance",
  "Academics",
  "Exams",
  "Fees",
  "Homework",
  "Documents",
  "Communication",
  "AI Insights",
"Student DNA",
];

export default function StudentTabs({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-3 shadow">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition font-semibold ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
