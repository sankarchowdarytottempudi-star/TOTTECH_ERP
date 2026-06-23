"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  marks: any[];
}

export default function AcademicPerformanceChart({
  marks,
}: Props) {

  const chartData = marks.map((m, index) => ({
    exam: m.exam_name || `Exam ${index + 1}`,
    marks: Number(m.obtained_marks || 0),
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow">

      <h2 className="text-2xl font-black mb-6">
        Academic Performance
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={chartData}>

            <XAxis dataKey="exam" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="marks" />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}
