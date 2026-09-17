 import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  Receipt,
} from "lucide-react";

import { getTransactions } from "../api/adminApi";

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    try {
      setError("");

      const data = await getTransactions();

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(transaction.id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(transaction.referenceNumber || "")
          .toLowerCase()
          .includes(searchText) ||
        String(transaction.type || "")
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "ALL" ||
        String(transaction.type || "").toUpperCase() === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        String(transaction.status || "").toUpperCase() === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const successfulCount = transactions.filter(
    (transaction) =>
      String(transaction.status).toUpperCase() === "SUCCESS"
  ).length;

  const failedCount = transactions.filter(
    (transaction) =>
      String(transaction.status).toUpperCase() === "FAILED"
  ).length;

  const totalAmount = transactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  const getTypeIcon = (type) => {
    switch (String(type).toUpperCase()) {
      case "DEPOSIT":
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
            <ArrowDownLeft size={17} className="text-green-600" />
          </div>
        );

      case "WITHDRAW":
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
            <ArrowUpRight size={17} className="text-red-600" />
          </div>
        );

      case "TRANSFER":
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <ArrowLeftRight size={17} className="text-blue-600" />
          </div>
        );

      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
            <Receipt size={17} className="text-gray-500" />
          </div>
        );
    }
  };

  const getStatusStyle = (status) => {
    switch (String(status).toUpperCase()) {
      case "SUCCESS":
        return "border-green-200 bg-green-50 text-green-700";

      case "FAILED":
        return "border-red-200 bg-red-50 text-red-700";

      case "PENDING":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (String(status).toUpperCase()) {
      case "SUCCESS":
        return <CheckCircle size={14} />;

      case "FAILED":
        return <XCircle size={14} />;

      case "PENDING":
        return <Clock size={14} />;

      default:
        return null;
    }
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Receipt size={22} className="text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#17202A]">
                Transactions
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Monitor and manage all banking transactions.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>

          <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
            {transactions.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Successful</p>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#17202A]">
              {successfulCount}
            </h2>

            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Failed</p>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#17202A]">
              {failedCount}
            </h2>

            <XCircle size={24} className="text-red-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Amount</p>

          <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
            {formatAmount(totalAmount)}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search ID, reference number, transaction type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdraw</option>
            <option value="TRANSFER">Transfer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-[#17202A]">
            Transaction History
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Showing {filteredTransactions.length} of{" "}
            {transactions.length} transactions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Transaction
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Reference
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(transaction.type)}

                        <div>
                          <p className="font-semibold text-gray-800">
                            Transaction #{transaction.id}
                          </p>

                          <p className="text-xs text-gray-400">
                            {transaction.transactionDate
                              ? new Date(
                                  transaction.transactionDate
                                ).toLocaleString("en-IN")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-gray-600">
                        {transaction.referenceNumber || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {transaction.type || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        {formatAmount(transaction.amount)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                          transaction.status
                        )}`}
                      >
                        {getStatusIcon(transaction.status)}

                        {transaction.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          setSelectedTransaction(transaction)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="font-semibold text-[#17202A]">
                  Transaction Details
                </h2>

                <p className="text-xs text-gray-400">
                  Transaction ID: {selectedTransaction.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Reference Number
                </p>

                <p className="mt-1 break-all font-mono text-sm font-medium text-gray-800">
                  {selectedTransaction.referenceNumber || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">
                    Transaction Type
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {selectedTransaction.type || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatAmount(selectedTransaction.amount)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                    selectedTransaction.status
                  )}`}
                >
                  {getStatusIcon(selectedTransaction.status)}

                  {selectedTransaction.status || "UNKNOWN"}
                </span>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500">
                  Transaction Date
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {selectedTransaction.transactionDate
                    ? new Date(
                        selectedTransaction.transactionDate
                      ).toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTransactions;