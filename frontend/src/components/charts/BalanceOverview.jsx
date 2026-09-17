import {
  BarChart3,
  TrendingUp,
} from "lucide-react";

function BalanceOverview({ accounts = [] }) {
  const totalBalance = accounts.reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Balance Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your current account balance
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0F3D56] flex items-center justify-center">
          <BarChart3 size={20} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Total Balance
        </p>

        <div className="flex items-end gap-3 mt-1">
          <h3 className="text-3xl font-bold text-gray-900">
            ₹
            {totalBalance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>

          <div className="flex items-center gap-1 text-green-600 text-sm font-medium mb-1">
            <TrendingUp size={16} />
            <span>Active</span>
          </div>
        </div>
      </div>

      <div className="mt-8 h-40 rounded-xl bg-[#F6F8FB] flex items-center justify-center">
        <div className="text-center">
          <BarChart3
            size={42}
            className="mx-auto text-gray-300"
          />

          <p className="text-sm font-medium text-gray-500 mt-3">
            Balance analytics
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Detailed chart will be added next
          </p>
        </div>
      </div>
    </div>
  );
}

export default BalanceOverview;