interface Props {
  dna: any;
}

export default function StudentDNA({
  dna,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="grid md:grid-cols-3 gap-6">

        <Card
          title="Learning Style"
          value={dna.learningStyle}
        />

        <Card
          title="Learning Velocity"
          value={`${dna.learningVelocity}%`}
        />

        <Card
          title="Academic Consistency"
          value={`${dna.academicConsistency}%`}
        />

        <Card
          title="Subject Affinity"
          value={dna.subjectAffinity}
        />

        <Card
          title="Career Prediction"
          value={`${dna.career} (${dna.careerConfidence}%)`}
        />

        <Card
          title="Promotion Readiness"
          value={`${dna.promotionReadiness}%`}
        />

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-green-50 p-6 rounded-3xl">

          <h3 className="font-bold">
            Strength Areas
          </h3>

          <div className="mt-4">

            {dna.strengths.map(
              (s:string) => (
                <p key={s}>
                  ✓ {s}
                </p>
              )
            )}

          </div>

        </div>

        <div className="bg-red-50 p-6 rounded-3xl">

          <h3 className="font-bold">
            Improvement Areas
          </h3>

          <div className="mt-4">

            {dna.improvements.map(
              (s:string) => (
                <p key={s}>
                  ⚠ {s}
                </p>
              )
            )}

          </div>

        </div>

      </div>

      <div className="bg-white p-8 rounded-3xl shadow">

        <h3 className="font-bold text-xl mb-4">
          AI Summary
        </h3>

        <p>
          {dna.summary}
        </p>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow">
      <p>{title}</p>

      <h2 className="text-3xl font-black mt-3">
        {value}
      </h2>
    </div>
  );
}
