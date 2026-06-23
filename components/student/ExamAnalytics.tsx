interface Props {
  examStats: {
    upcomingExams: number;
    completedExams: number;
    examReadiness: number;
  };
}

export default function ExamAnalytics({
  examStats,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-blue-50 rounded-3xl p-6">
        <p>Upcoming Exams</p>
        <h2 className="text-4xl font-black">
          {examStats.upcomingExams}
        </h2>
      </div>

      <div className="bg-green-50 rounded-3xl p-6">
        <p>Completed Exams</p>
        <h2 className="text-4xl font-black">
          {examStats.completedExams}
        </h2>
      </div>

      <div className="bg-purple-50 rounded-3xl p-6">
        <p>Exam Readiness</p>
        <h2 className="text-4xl font-black">
          {examStats.examReadiness}%
        </h2>
      </div>

    </div>
  );
}
