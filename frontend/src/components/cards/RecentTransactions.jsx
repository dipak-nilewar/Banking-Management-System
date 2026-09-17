import TransactionCard from "./TransactionCard";

function RecentTransactions({
  transactions = [],
  loading = false,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your latest account activity
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-[#0F3D56] hover:underline"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-gray-600">
            No transactions found
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Your recent transactions will appear here.
          </p>
        </div>
      ) : (
        <div>
          {transactions.slice(0, 5).map((transaction, index) => (
            <TransactionCard
              key={
                transaction.id ||
                transaction.referenceId ||
                transaction.referenceNumber ||
                index
              }
              transaction={transaction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;