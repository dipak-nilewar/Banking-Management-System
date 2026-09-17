 import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ReceiptText,
} from "lucide-react";

function TransactionCard({ transaction }) {
  const type = (transaction?.type || "").toUpperCase();

  const isCredit = type === "DEPOSIT" || type === "CREDIT";
  const isDebit =
    type === "WITHDRAW" ||
    type === "WITHDRAWAL" ||
    type === "DEBIT";

  const isTransfer = type === "TRANSFER";

  const Icon = isCredit
    ? ArrowDownLeft
    : isDebit
      ? ArrowUpRight
      : isTransfer
        ? ArrowLeftRight
        : ReceiptText;

  const iconClass = isCredit
    ? "bg-green-100 text-green-600"
    : isDebit
      ? "bg-red-100 text-red-600"
      : isTransfer
        ? "bg-blue-100 text-blue-600"
        : "bg-gray-100 text-gray-600";

  const amountClass = isCredit
    ? "text-green-600"
    : isDebit
      ? "text-red-600"
      : "text-gray-800";

  const amountPrefix = isCredit ? "+" : isDebit ? "-" : "";

  const transactionLabel =
    type === "DEPOSIT"
      ? "Deposit"
      : type === "WITHDRAW" || type === "WITHDRAWAL"
        ? "Withdrawal"
        : type === "TRANSFER"
          ? "Transfer"
          : type || "Transaction";

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="font-medium text-gray-800 truncate">
            {transactionLabel}
          </p>

          <p className="text-xs text-gray-500 mt-1 truncate">
            {transaction?.referenceNumber || "No reference number"}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {transaction?.transactionDate
              ? new Date(transaction.transactionDate).toLocaleDateString(
                  "en-IN"
                )
              : ""}
          </p>
        </div>
      </div>

      <div className="text-right ml-4 shrink-0">
        <p className={`font-semibold ${amountClass}`}>
          {amountPrefix}₹
          {Number(transaction?.amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {transaction?.status || ""}
        </p>
      </div>
    </div>
  );
}

export default TransactionCard;