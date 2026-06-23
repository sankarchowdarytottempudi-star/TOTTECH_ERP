import AttendanceSummary from "./AttendanceSummary";
import AttendanceChart from "./AttendanceChart";

interface Props {
  attendance: any[];
}

export default function StudentAttendance({
  attendance,
}: Props) {

  return (

    <div className="space-y-6">

      <AttendanceSummary
        attendance={attendance}
      />

      <AttendanceChart
        attendance={attendance}
      />

      <div className="bg-white rounded-3xl p-8 shadow">

        <h2 className="text-2xl font-black mb-6">
          Attendance History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>

              {attendance.map(
                (item) => (

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td>
                      {new Date(
                        item.attendance_date
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {item.status}
                    </td>

                    <td>
                      {item.remarks}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}
