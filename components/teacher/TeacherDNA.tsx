interface Props {
  dna: any;
}

export default function TeacherDNA({
  dna,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="bg-blue-50 p-6 rounded-3xl">
          <h3 className="font-bold">
            Teaching Style
          </h3>

          <p className="text-3xl mt-3">
            {dna?.teachingStyle}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-3xl">
          <h3 className="font-bold">
            Classroom Management
          </h3>

          <p className="text-4xl mt-3 font-black">
            {dna?.classroomManagement}%
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-3xl">
          <h3 className="font-bold">
            Student Satisfaction
          </h3>

          <p className="text-4xl mt-3 font-black">
            {dna?.studentSatisfaction}%
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="bg-orange-50 p-6 rounded-3xl">
          <h3 className="font-bold">
            Parent Communication
          </h3>

          <p className="text-4xl mt-3 font-black">
            {dna?.parentCommunication}%
          </p>
        </div>

        <div className="bg-cyan-50 p-6 rounded-3xl">
          <h3 className="font-bold">
            Syllabus Completion
          </h3>

          <p className="text-4xl mt-3 font-black">
            {dna?.syllabusCompletion}%
          </p>
        </div>

        <div className="bg-pink-50 p-6 rounded-3xl">
          <h3 className="font-bold">
            Innovation Score
          </h3>

          <p className="text-4xl mt-3 font-black">
            {dna?.innovationScore}%
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-emerald-50 p-6 rounded-3xl">
          <h3 className="font-bold mb-4">
            Strength Areas
          </h3>

          {(dna?.strengths || []).map(
            (item: string) => (
              <p key={item}>
                ✓ {item}
              </p>
            )
          )}
        </div>

        <div className="bg-red-50 p-6 rounded-3xl">
          <h3 className="font-bold mb-4">
            Improvement Areas
          </h3>

          {(dna?.improvements || []).map(
            (item: string) => (
              <p key={item}>
                ⚠ {item}
              </p>
            )
          )}
        </div>

      </div>

      <div className="bg-white border rounded-3xl p-6">

        <h3 className="font-bold mb-3">
          AI Summary
        </h3>

        <p>
          {dna?.summary}
        </p>

      </div>

    </div>
  );
}
