import AcademicPerformanceChart from "./AcademicPerformanceChart";
import SubjectPerformance from "./SubjectPerformance";

interface Props {
  marks: any[];
}

export default function StudentAcademics({
  marks,
}: Props) {

  return (

    <div className="space-y-6">

      <SubjectPerformance
        marks={marks}
      />

      <AcademicPerformanceChart
        marks={marks}
      />

      <div className="bg-white rounded-3xl p-8 shadow">

        <h2 className="text-2xl font-black mb-6">
          Marks History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th>Exam</th>

                <th>Marks</th>

              </tr>

            </thead>

            <tbody>

              {marks.map((m) => (

                <tr
                  key={m.id}
                  className="border-b"
                >

                  <td>
                    {m.exam_name ||
                      "-"}
                  </td>

                  <td>
                    {
                      m.obtained_marks
                    }
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}
