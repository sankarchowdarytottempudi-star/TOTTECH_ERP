interface Props {
  attendance: any[];
}

export default function AttendanceSummary({
  attendance,
}: Props) {

  const present =
    attendance.filter(
      (a) => a.status === "PRESENT"
    ).length;

  const absent =
    attendance.filter(
      (a) => a.status === "ABSENT"
    ).length;

  const total =
    attendance.length;

  const percent =
    total > 0
      ? Math.round(
          (present / total) * 100
        )
      : 0;

  return (

    <div className="grid md:grid-cols-4 gap-4">

      <div className="bg-blue-50 rounded-2xl p-5">
        <p>Total Days</p>
        <h2 className="text-3xl font-black">
          {total}
        </h2>
      </div>

      <div className="bg-green-50 rounded-2xl p-5">
        <p>Present</p>
        <h2 className="text-3xl font-black">
          {present}
        </h2>
      </div>

      <div className="bg-red-50 rounded-2xl p-5">
        <p>Absent</p>
        <h2 className="text-3xl font-black">
          {absent}
        </h2>
      </div>

      <div className="bg-purple-50 rounded-2xl p-5">
        <p>Attendance %</p>
        <h2 className="text-3xl font-black">
          {percent}%
        </h2>
      </div>

    </div>

  );
}
