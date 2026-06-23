"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  attendance: any[];
}

export default function AttendanceChart({
  attendance,
}: Props) {

  const chartData =
    attendance
      .slice()
      .reverse()
      .map((item, index) => ({
        day: index + 1,
        value:
          item.status === "PRESENT"
            ? 100
            : 0,
      }));

  return (

    <div className="bg-white rounded-3xl p-6 shadow">

      <h2 className="text-2xl font-black mb-6">
        Attendance Trend
      </h2>

      <div className="h-72">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={chartData}
          >

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}
