interface Props {
  marks: any[];
}

export default function SubjectPerformance({
  marks,
}: Props) {

  const subjectTotals: Record<
    string,
    {
      total: number;
      count: number;
    }
  > = {};

  marks.forEach((m) => {

    const subject =
      m.subject_name ||
      "Unknown";

    if (!subjectTotals[subject]) {

      subjectTotals[subject] = {
        total: 0,
        count: 0,
      };

    }

    subjectTotals[subject].total +=
      Number(
        m.obtained_marks || 0
      );

    subjectTotals[subject].count += 1;

  });

  const subjects =
    Object.entries(subjectTotals)
      .map(([name, value]) => ({
        name,
        average:
          value.total /
          value.count,
      }))
      .sort(
        (a, b) =>
          b.average -
          a.average
      );

  const topSubject =
    subjects[0];

  const weakSubject =
    subjects[
      subjects.length - 1
    ];

  return (

    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-green-50 rounded-3xl p-6">

        <h3 className="font-black text-xl">
          Top Subject
        </h3>

        <p className="mt-3 text-3xl">
          {topSubject?.name ||
            "No Data"}
        </p>

      </div>

      <div className="bg-red-50 rounded-3xl p-6">

        <h3 className="font-black text-xl">
          Weak Subject
        </h3>

        <p className="mt-3 text-3xl">
          {weakSubject?.name ||
            "No Data"}
        </p>

      </div>

    </div>

  );
}
