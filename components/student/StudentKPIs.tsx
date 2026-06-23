interface Props {
  attendancePercent: number;
  averageMarks: number;
  riskLevel: string;
  healthScore: number;
  attendanceStreak: number;
}

export default function StudentKPIs({
  attendancePercent,
  averageMarks,
  riskLevel,
  healthScore,
  attendanceStreak,
}: Props) {
  return (
    <div className="grid lg:grid-cols-5 gap-6">

      <div className="bg-white rounded-3xl p-6 shadow">
        <p className="text-slate-500">
          Attendance Streak
        </p>

        <h2 className="text-5xl font-black text-emerald-600">
          {attendanceStreak}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow">
        <p className="text-slate-500">
          Attendance
        </p>

        <h2 className="text-5xl font-black text-blue-600">
          {attendancePercent > 0
            ? `${attendancePercent}%`
            : "No Data"}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow">
        <p className="text-slate-500">
          Average Marks
        </p>

        <h2 className="text-5xl font-black text-green-600">
          {averageMarks > 0
            ? averageMarks
            : "No Data"}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow">
        <p className="text-slate-500">
          Risk Level
        </p>

        <h2 className="text-4xl font-black text-red-600">
          {riskLevel}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow">
        <p className="text-slate-500">
          Health Score
        </p>

        <h2 className="text-5xl font-black text-purple-600">
          {healthScore}
        </h2>
      </div>

    </div>
  );
}
