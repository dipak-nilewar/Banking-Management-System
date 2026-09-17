 import { useEffect, useState } from "react";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ReceiptText,
  AlertCircle,
  WalletCards,
  RefreshCw,
} from "lucide-react";

import { getMyAccounts } from "../../accounts/accountsApi";
import { getAccountTransactions } from "../transactionsApi";

import { useNotification } from "../../../components/common/NotificationProvider";

function Transactions() {
  const { showNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [accountsLoading, setAccountsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] =
    useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // Load Accounts
  // ==========================================

  const loadAccounts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setAccountsLoading(true);
      }

      setError("");

      const data = await getMyAccounts();

      const safeAccounts = Array.isArray(data)
        ? data
        : [];

      const activeAccounts = safeAccounts.filter(
        (account) => account.status === "ACTIVE"
      );

      setAccounts(activeAccounts);

      const selectedStillExists = activeAccounts.some(
        (account) =>
          String(account.id) === String(accountId)
      );

      if (!selectedStillExists) {
        if (activeAccounts.length > 0) {
          setAccountId(String(activeAccounts[0].id));
        } else {
          setAccountId("");
          setTransactions([]);
        }
      }

      if (isRefresh) {
        showNotification(
          "Accounts refreshed successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error("Accounts loading error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load accounts.";

      setError(message);
      setAccounts([]);
      setTransactions([]);

      showNotification(message, "error");
    } finally {
      setAccountsLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // Load Transactions
  // ==========================================

  const loadTransactions = async (isRefresh = false) => {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    try {
      setTransactionsLoading(true);
      setError("");

      const data = await getAccountTransactions(accountId);

      const safeTransactions = Array.isArray(data)
        ? data
        : [];

      setTransactions(safeTransactions);

      if (isRefresh) {
        showNotification(
          "Transactions refreshed successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Transactions loading error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load transactions.";

      setError(message);
      setTransactions([]);

      showNotification(message, "error");
    } finally {
      setTransactionsLoading(false);
    }
  };

  // ==========================================
  // Initial Accounts Load
  // ==========================================

  useEffect(() => {
    loadAccounts();
  }, []);

  // ==========================================
  // Load Transactions When Account Changes
  // ==========================================

  useEffect(() => {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    loadTransactions();
  }, [accountId]);

  // ==========================================
  // Refresh Everything
  // ==========================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadAccounts(true);

      if (accountId) {
        await loadTransactions();
      }
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================
  // Transaction Icon
  // ==========================================

  const getTransactionIcon = (type) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <ArrowDownToLine size={18} />
          </div>
        );

      case "WITHDRAW":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ArrowUpFromLine size={18} />
          </div>
        );

      case "TRANSFER":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0F3D56]">
            <ArrowLeftRight size={18} />
          </div>
        );

      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <ReceiptText size={18} />
          </div>
        );
    }
  };

  // ==========================================
  // Amount Styling
  // ==========================================

  const getAmountClass = (type) => {
    if (type === "DEPOSIT") {
      return "text-green-600";
    }

    return "text-red-600";
  };

  const getAmountPrefix = (type) => {
    if (type === "DEPOSIT") {
      return "+";
    }

    return "-";
  };

  // ==========================================
  // Date Formatting
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Selected Account
  // ==========================================

  const selectedAccount = accounts.find(
    (account) =>
      String(account.id) === String(accountId)
  );

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Transactions
          </h1>

          <p className="mt-2 text-gray-500">
            View and track your account transaction history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={
            refreshing ||
            accountsLoading ||
            transactionsLoading
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ==========================================
          Error
      ========================================== */}

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (accountId) {
                loadTransactions(true);
              } else {
                loadAccounts(true);
              }
            }}
            disabled={refreshing}
            className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Retry
          </button>

        </div>
      )}

      {/* ==========================================
          Account Selector
      ========================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0F3D56]">
            <WalletCards size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Select Account
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose an account to view its transactions.
            </p>
          </div>

        </div>

        {accountsLoading ? (

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">

            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#0F3D56]" />

            Loading accounts...

          </div>

        ) : accounts.length === 0 ? (

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">

            <AlertCircle size={17} />

            No active accounts available.

          </div>

        ) : (

          <select
            value={accountId}
            onChange={(e) => {
              setAccountId(e.target.value);
              setError("");
            }}
            disabled={transactionsLoading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#0F3D56] focus:ring-2 focus:ring-[#0F3D56]/20 disabled:cursor-not-allowed disabled:bg-gray-50 md:max-w-xl"
          >
            {accounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
              >
                {account.accountType} - ****
                {account.accountNumber?.slice(-4)}
                {" - ₹"}
                {Number(
                  account.balance || 0
                ).toLocaleString("en-IN")}
              </option>
            ))}
          </select>

        )}

      </div>

      {/* ==========================================
          Selected Account Summary
      ========================================== */}

      {selectedAccount && (
        <div className="rounded-2xl bg-[#0F3D56] p-6 text-white shadow-sm">

          <p className="text-sm text-white/70">
            Selected Account
          </p>

          <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-lg font-semibold">
                {selectedAccount.accountType}
              </p>

              <p className="mt-1 text-sm text-white/70">
                Account ****
                {selectedAccount.accountNumber?.slice(-4)}
              </p>
            </div>

            <div className="md:text-right">

              <p className="text-sm text-white/70">
                Current Balance
              </p>

              <p className="mt-1 text-2xl font-bold">
                ₹
                {Number(
                  selectedAccount.balance || 0
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          Transaction History
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        {/* Header */}

        <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recent transactions for the selected account.
            </p>
          </div>

          {transactions.length > 0 && (
            <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              {transactions.length}{" "}
              {transactions.length === 1
                ? "Transaction"
                : "Transactions"}
            </div>
          )}

        </div>

        {/* Loading */}

        {transactionsLoading ? (

          <div className="flex flex-col items-center justify-center p-12 text-center">

            <RefreshCw
              size={30}
              className="animate-spin text-[#0F3D56]"
            />

            <p className="mt-4 font-medium text-gray-600">
              Loading transactions...
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Please wait while we fetch your transaction history.
            </p>

          </div>

        ) : transactions.length === 0 ? (

          /* Empty State */

          <div className="p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

              <ReceiptText
                size={30}
                className="text-gray-400"
              />

            </div>

            <p className="mt-5 font-semibold text-gray-700">
              No transactions found
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm text-gray-400">
              Transactions will appear here when activity
              occurs on your account.
            </p>

          </div>

        ) : (

          /* Transaction List */

          <div className="divide-y divide-gray-100">

            {transactions.map((transaction) => (

              <div
                key={transaction.id}
                className="p-5 transition hover:bg-gray-50 lg:px-6"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  {/* Left */}

                  <div className="flex min-w-0 items-center gap-4">

                    {getTransactionIcon(
                      transaction.type
                    )}

                    <div className="min-w-0">

                      <p className="font-semibold text-gray-800">
                        {transaction.type}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        Ref:{" "}
                        {transaction.referenceNumber ||
                          "-"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(
                          transaction.transactionDate
                        )}
                      </p>

                    </div>

                  </div>

                  {/* Right */}

                  <div className="md:text-right">

                    <p
                      className={`text-lg font-bold ${getAmountClass(
                        transaction.type
                      )}`}
                    >
                      {getAmountPrefix(
                        transaction.type
                      )}
                      ₹
                      {Number(
                        transaction.amount || 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        transaction.status ===
                        "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.status ||
                        "UNKNOWN"}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Transactions;