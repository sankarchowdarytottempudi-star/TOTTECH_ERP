export default function ExamTimeline({
  exams = [],
}: any) {

  if (!exams.length) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow">
        No Upcoming Exams
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow">

      <h2 className="text-2xl font-black mb-6">
        Upcoming Exams
      </h2>

      <div className="space-y-4">

        {exams.map((exam: any) => (

          <div
            key={exam.id}
            className="
              border-l-4
              border-blue-600
              pl-4
              py-2
            "
          >

            <div className="font-bold">
              Exam #{exam.id}
            </div>

            <div>
              Date:
              {" "}
              {new Date(
                exam.exam_date
              ).toLocaleDateString()}
            </div>

           <div>
  Time:
  {" "}
  {new Date(exam.start_time)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
</div>

            <div>
              Room:
              {" "}
              {exam.room_no}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
