import {
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

function QuickActions({
  onTransfer,
  onDeposit,
  onWithdraw,
}) {
  const actions = [
    {
      label: "Transfer",
      icon: ArrowLeftRight,
      className: "bg-[#0F3D56] hover:bg-[#0B3044]",
      onClick: onTransfer,
    },
    {
      label: "Deposit",
      icon: ArrowDownToLine,
      className: "bg-green-600 hover:bg-green-700",
      onClick: onDeposit,
    },
    {
      label: "Withdraw",
      icon: ArrowUpFromLine,
      className: "bg-red-600 hover:bg-red-700",
      onClick: onWithdraw,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Quick Actions
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage your money quickly
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 text-white rounded-xl font-medium transition ${action.className}`}
            >
              <Icon size={19} />

              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;