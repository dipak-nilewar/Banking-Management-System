
import { useNotification } from "../../../components/common/NotificationProvider";
import ConfirmModal from "../../../components/common/ConfirmModal";

import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Eye,
  X,
  CreditCard,
  User,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import {
  getAccounts,
  updateAccountStatus,
} from "../api/adminApi";

function AdminAccounts() {
  const { showNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // ==============================
  // Confirmation Modal
  // ==============================

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "warning",
    title: "",
    message: "",
    confirmText: "Confirm",
    action: null,
  });

  // ==============================
  // Load Accounts
  // ==============================

  const loadAccounts = async () => {
    try {
      setError("");

      const data = await getAccounts();

      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load accounts:", err);

      const message =
        err?.response?.data?.message ||
        "Failed to load accounts.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // ==============================
  // Refresh
  // ==============================

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getAccounts();

      setAccounts(Array.isArray(data) ? data : []);

      showNotification(
        "Accounts refreshed successfully.",
        "success"
      );
    } catch (err) {
      console.error("Failed to refresh accounts:", err);

      const message =
        err?.response?.data?.message ||
        "Failed to refresh accounts.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  // ==============================
  // Open Status Confirmation
  // ==============================

  const handleStatusChange = () => {
    if (!selectedAccount) return;

    const currentStatus = String(
      selectedAccount.status || ""
    ).toUpperCase();

    const newStatus =
      currentStatus === "ACTIVE"
        ? "BLOCKED"
        : "ACTIVE";

    const isBlocking = newStatus === "BLOCKED";

    setConfirmModal({
      open: true,
      type: isBlocking ? "block" : "success",
      title: isBlocking
        ? "Block Account?"
        : "Activate Account?",
      message: isBlocking
        ? `Are you sure you want to block account ${selectedAccount.accountNumber}? The account will no longer be available for normal banking operations.`
        : `Are you sure you want to activate account ${selectedAccount.accountNumber}?`,
      confirmText: isBlocking
        ? "Block Account"
        : "Activate Account",
      action: () =>
        executeStatusChange(
          selectedAccount,
          newStatus
        ),
    });
  };

  // ==============================
  // Execute Status Change
  // ==============================

  const executeStatusChange = async (
    account,
    newStatus
  ) => {
    try {
      setUpdatingStatusId(account.id);
      setError("");

      const updatedAccount =
        await updateAccountStatus(
          account.id,
          newStatus
        );

      // Update table
      setAccounts((prevAccounts) =>
        prevAccounts.map((item) =>
          item.id === updatedAccount.id
            ? updatedAccount
            : item
        )
      );

      // Update modal
      setSelectedAccount(updatedAccount);

      // Close confirmation modal
      setConfirmModal((prev) => ({
        ...prev,
        open: false,
      }));

      // Success notification
      if (newStatus === "BLOCKED") {
        showNotification(
          `Account ${account.accountNumber} blocked successfully.`,
          "success"
        );
      } else {
        showNotification(
          `Account ${account.accountNumber} activated successfully.`,
          "success"
        );
      }
    } catch (err) {
      console.error(
        "Failed to update account status:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Failed to update account status.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ==============================
  // Filter Accounts
  // ==============================

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(account.id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(account.accountNumber || "")
          .toLowerCase()
          .includes(searchText) ||
        String(account.accountType || "")
          .toLowerCase()
          .includes(searchText) ||
        String(account.customer?.user?.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(account.customer?.user?.email || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        String(account.status || "").toUpperCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [accounts, search, statusFilter]);

  // ==============================
  // Status Style
  // ==============================

  const getStatusStyle = (status) => {
    switch (String(status).toUpperCase()) {
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200";

      case "BLOCKED":
        return "bg-red-50 text-red-700 border-red-200";

      case "CLOSED":
        return "bg-gray-100 text-gray-600 border-gray-200";

      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // ==============================
  // Status Icon
  // ==============================

  const getStatusIcon = (status) => {
    switch (String(status).toUpperCase()) {
      case "ACTIVE":
        return <CheckCircle size={14} />;

      case "BLOCKED":
      case "CLOSED":
        return <XCircle size={14} />;

      case "PENDING":
        return <Clock size={14} />;

      default:
        return null;
    }
  };

  // ==============================
  // Currency
  // ==============================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading accounts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ==============================
          Header
      ============================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">
            Accounts
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all bank accounts.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* ==============================
          Error
      ============================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ==============================
          Statistics
      ============================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Accounts
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#17202A]">
                {accounts.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <CreditCard
                size={21}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Active */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#17202A]">
                {
                  accounts.filter(
                    (account) =>
                      String(account.status).toUpperCase() ===
                      "ACTIVE"
                  ).length
                }
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <CheckCircle
                size={21}
                className="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* Blocked */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Blocked
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#17202A]">
                {
                  accounts.filter(
                    (account) =>
                      String(account.status).toUpperCase() ===
                      "BLOCKED"
                  ).length
                }
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <XCircle
                size={21}
                className="text-red-600"
              />
            </div>
          </div>
        </div>

        {/* Balance */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Balance
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#17202A]">
                {formatCurrency(
                  accounts.reduce(
                    (total, account) =>
                      total +
                      Number(account.balance || 0),
                    0
                  )
                )}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <IndianRupee
                size={21}
                className="text-purple-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==============================
          Search / Filter
      ============================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search account number, customer name, email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="BLOCKED">
              Blocked
            </option>

            <option value="CLOSED">
              Closed
            </option>

            <option value="PENDING">
              Pending
            </option>
          </select>
        </div>
      </div>

      {/* ==============================
          Accounts Table
      ============================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-[#17202A]">
            All Accounts
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Showing {filteredAccounts.length} of{" "}
            {accounts.length} accounts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Account
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Balance
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

              {filteredAccounts.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No accounts found.
                  </td>
                </tr>

              ) : (

                filteredAccounts.map((account) => (

                  <tr
                    key={account.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >

                    {/* Account */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <CreditCard
                            size={18}
                            className="text-blue-600"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {account.accountNumber ||
                              `#${account.id}`}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {account.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Customer */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                          <User
                            size={16}
                            className="text-gray-500"
                          />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {account.customer?.user?.name ||
                              "N/A"}
                          </p>

                          <p className="text-xs text-gray-400">
                            {account.customer?.user?.email ||
                              "N/A"}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Type */}

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        {account.accountType || "N/A"}
                      </span>
                    </td>

                    {/* Balance */}

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(account.balance)}
                      </p>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                          account.status
                        )}`}
                      >
                        {getStatusIcon(account.status)}

                        {account.status || "UNKNOWN"}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <button
                        onClick={() =>
                          setSelectedAccount(account)
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

      {/* ==============================
          Account Details Modal
      ============================== */}

      {selectedAccount && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>
                <h2 className="font-semibold text-[#17202A]">
                  Account Details
                </h2>

                <p className="text-xs text-gray-400">
                  Account ID: {selectedAccount.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedAccount(null)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Content */}

            <div className="space-y-4 p-6">

              {/* Account Number */}

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Account Number
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {selectedAccount.accountNumber ||
                    "N/A"}
                </p>
              </div>

              {/* Type + Balance */}

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">
                    Account Type
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {selectedAccount.accountType ||
                      "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">
                    Balance
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatCurrency(
                      selectedAccount.balance
                    )}
                  </p>
                </div>

              </div>

              {/* Customer */}

              <div className="rounded-xl border border-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Customer
                </p>

                <p className="mt-1 font-medium text-gray-800">
                  {selectedAccount.customer?.user?.name ||
                    "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedAccount.customer?.user?.email ||
                    "N/A"}
                </p>

              </div>

              {/* Status */}

              <div className="rounded-xl border border-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                    selectedAccount.status
                  )}`}
                >
                  {getStatusIcon(
                    selectedAccount.status
                  )}

                  {selectedAccount.status ||
                    "UNKNOWN"}
                </span>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">

              {/* Status Button */}

              <button
                onClick={handleStatusChange}
                disabled={
                  updatingStatusId ===
                  selectedAccount.id
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  String(
                    selectedAccount.status
                  ).toUpperCase() === "ACTIVE"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >

                {updatingStatusId ===
                selectedAccount.id
                  ? "Updating..."
                  : String(
                      selectedAccount.status
                    ).toUpperCase() === "ACTIVE"
                  ? "Block Account"
                  : "Activate Account"}

              </button>

              {/* Close */}

              <button
                onClick={() =>
                  setSelectedAccount(null)
                }
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ==============================
          Confirmation Modal
      ============================== */}

      <ConfirmModal
        open={confirmModal.open}
        type={confirmModal.type}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        loading={
          updatingStatusId !== null
        }
        onConfirm={confirmModal.action}
        onCancel={() => {
          if (updatingStatusId === null) {
            setConfirmModal((prev) => ({
              ...prev,
              open: false,
            }));
          }
        }}
      />

    </div>
  );
}

export default AdminAccounts;

