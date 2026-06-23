interface Props {
  feeStats: {
    assignedAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    complianceScore: number;
  };
}

export default function FeeAnalytics({
  feeStats,
}: Props) {
  return (
    <div className="grid md:grid-cols-4 gap-6">

      <div className="bg-blue-50 rounded-3xl p-6">
        <p>Assigned</p>
        <h2 className="text-3xl font-black">
          ₹{feeStats.assignedAmount}
        </h2>
      </div>

      <div className="bg-green-50 rounded-3xl p-6">
        <p>Paid</p>
        <h2 className="text-3xl font-black">
          ₹{feeStats.paidAmount}
        </h2>
      </div>

      <div className="bg-red-50 rounded-3xl p-6">
        <p>Outstanding</p>
        <h2 className="text-3xl font-black">
          ₹{feeStats.outstandingAmount}
        </h2>
      </div>

      <div className="bg-purple-50 rounded-3xl p-6">
        <p>Compliance</p>
        <h2 className="text-3xl font-black">
          {feeStats.complianceScore}%
        </h2>
      </div>

    </div>
  );
}
