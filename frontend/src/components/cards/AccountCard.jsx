import {
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

function AccountCard({
  account,
  onDeposit,
  onWithdraw,
}) {
  const isActive = account.status === "ACTIVE";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#0F3D56] flex items-center justify-center">
            <CreditCard size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              {account.accountType}
            </h3>

            <p className="text-xs text-gray-500">
              Account
            </p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {account.status}
        </span>

      </div>

      {/* Account Number */}
      <div className="mt-6">
        <p className="text-xs text-gray-500">
          Account Number
        </p>

        <p className="font-semibold text-gray-800 mt-1 tracking-wide">
          **** **** {account.accountNumber?.slice(-4)}
        </p>
      </div>

      {/* Balance */}
      <div className="mt-5">
        <p className="text-xs text-gray-500">
          Available Balance
        </p>

        <p className="text-2xl font-bold text-gray-900 mt-1">
          ₹{Number(account.balance).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">

        <button
          disabled={!isActive}
          onClick={() => onDeposit(account)}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ArrowDownToLine size={17} />
          Deposit
        </button>

        <button
          disabled={!isActive}
          onClick={() => onWithdraw(account)}
          className="flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ArrowUpFromLine size={17} />
          Withdraw
        </button>

      </div>

    </div>
  );
}

export default AccountCard;