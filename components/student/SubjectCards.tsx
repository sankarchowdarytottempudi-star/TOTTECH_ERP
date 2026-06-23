export default function SubjectCards({
  subjects = [],
}: any) {
  if (!subjects.length) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow">
        <h3 className="text-xl font-bold">
          Subject Performance
        </h3>

        <p className="text-slate-500 mt-3">
          No academic data available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      {subjects.map((subject: any) => (
        <div
          key={subject.subject}
          className="bg-white rounded-2xl p-5 shadow"
        >
          <p className="text-slate-500">
            {subject.subject}
          </p>

          <h2 className="text-4xl font-black text-blue-600">
            {subject.average}
          </h2>
        </div>
      ))}
    </div>
  );
}
