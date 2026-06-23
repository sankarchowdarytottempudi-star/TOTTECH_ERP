interface Props {
  risk: any;
  riskFactors: string[];
  aiInsights: {
    healthScore: number;
    promotionProbability: number;
  };
}

export default function StudentAIInsights({
  risk,
  aiInsights,
  riskFactors,
}: Props) {
  const score =
    aiInsights?.healthScore || 0;

  const probability =
    aiInsights?.promotionProbability || 0;

  return (
    <div className="space-y-6">

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-blue-50 rounded-3xl p-8">
          <p className="text-slate-600">
            Student Health Score
          </p>

          <h2 className="text-6xl font-black text-blue-600">
            {score}
          </h2>
        </div>

       <div className="bg-white rounded-3xl p-8 shadow">

  <p className="text-slate-500 mb-4">
    Promotion Prediction
  </p>

  <div
    className={`
      inline-flex
      px-6
      py-3
      rounded-full
      text-xl
      font-bold
      ${
        probability >= 80
          ? "bg-green-100 text-green-700"
          : probability >= 60
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }
    `}
  >
    {probability >= 80
      ? "LIKELY TO PROMOTE"
      : probability >= 60
      ? "AT RISK"
      : "INTERVENTION REQUIRED"}
  </div>

  <div className="mt-4 text-4xl font-black">
    {probability}%
  </div>

</div>

      </div>

      {/* Risk Factors */}

      <div className="bg-white rounded-3xl p-8 shadow">

        <h2 className="text-2xl font-black mb-6">
          Risk Factors
        </h2>

        <div className="space-y-3">

          {riskFactors?.length ? (

            riskFactors.map(
              (
                factor: string,
                index: number
              ) => (

                <div
                  key={index}
                  className="
                    bg-red-50
                    border
                    border-red-200
                    rounded-xl
                    p-4
                  "
                >
                  ⚠ {factor}
                </div>

              )
            )

          ) : (

            <div
              className="
                bg-green-50
                border
                border-green-200
                rounded-xl
                p-4
              "
            >
              ✅ No major risks detected
            </div>

          )}

        </div>

      </div>

      {/* AI Recommendations */}

      <div className="bg-white rounded-3xl p-8 shadow">

        <h2 className="text-3xl font-black mb-6">
          AI Recommendations
        </h2>

        <div className="space-y-4">

          {(risk?.reasons || []).map(
            (item: string) => (
              <div
                key={item}
                className="bg-red-50 p-4 rounded-xl"
              >
                ⚠ {item}
              </div>
            )
          )}

          {(risk?.recommendations || []).map(
            (item: string) => (
              <div
                key={item}
                className="bg-green-50 p-4 rounded-xl"
              >
                ✓ {item}
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}
