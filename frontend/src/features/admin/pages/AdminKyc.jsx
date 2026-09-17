 import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import {
  getCustomers,
  updateKycStatus,
} from "../api/adminApi";

import { useNotification } from "../../../components/common/NotificationProvider";
import ConfirmModal from "../../../components/common/ConfirmModal";

function AdminKyc() {
  const { showNotification } = useNotification();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] =
    useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    customerId: null,
    status: null,
    customerName: "",
  });

  const loadCustomers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getCustomers();

      setCustomers(Array.isArray(data) ? data : []);

      if (isRefresh) {
        showNotification(
          "KYC information refreshed successfully.",
          "success"
        );
      }
    } catch (err) {
      console.error(
        "Failed to load KYC customers:",
        err
      );

      let message =
        "Failed to load KYC information.";

      if (err?.response?.status === 401) {
        message =
          "Unauthorized. Please login again.";
      } else if (err?.response?.status === 403) {
        message =
          "Access denied. Admin permission is required.";
      } else if (err?.response?.data?.message) {
        message =
          err.response.data.message;
      }

      setError(message);
      showNotification(message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleRefresh = () => {
    loadCustomers(true);
  };

  const openKycConfirmation = (
    customer,
    status
  ) => {
    setConfirmModal({
      open: true,
      customerId: customer.id,
      status,
      customerName:
        customer.user?.name || "this customer",
    });
  };

  const closeKycConfirmation = () => {
    if (updatingId !== null) return;

    setConfirmModal({
      open: false,
      customerId: null,
      status: null,
      customerName: "",
    });
  };

  const handleKycUpdate = async (
    customerId,
    status
  ) => {
    try {
      setUpdatingId(customerId);
      setError("");

      await updateKycStatus(
        customerId,
        status
      );

      const data = await getCustomers();

      setCustomers(
        Array.isArray(data) ? data : []
      );

      setSelectedCustomer(null);

      setConfirmModal({
        open: false,
        customerId: null,
        status: null,
        customerName: "",
      });

      if (status === "VERIFIED") {
        showNotification(
          "KYC has been verified successfully.",
          "success"
        );
      } else {
        showNotification(
          "KYC has been rejected successfully.",
          "success"
        );
      }
    } catch (err) {
      console.error(
        "KYC update failed:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Failed to update KYC status.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmKycUpdate = () => {
    if (
      !confirmModal.customerId ||
      !confirmModal.status
    ) {
      return;
    }

    handleKycUpdate(
      confirmModal.customerId,
      confirmModal.status
    );
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(customer.id || "")
          .toLowerCase()
          .includes(searchText) ||
        String(customer.user?.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(customer.user?.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(customer.phone || "")
          .toLowerCase()
          .includes(searchText) ||
        String(customer.address || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        String(
          customer.kycStatus || ""
        ).toUpperCase() === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    customers,
    search,
    statusFilter,
  ]);

  const pendingCount = customers.filter(
    (customer) =>
      String(
        customer.kycStatus
      ).toUpperCase() === "PENDING"
  ).length;

  const verifiedCount = customers.filter(
    (customer) =>
      String(
        customer.kycStatus
      ).toUpperCase() === "VERIFIED"
  ).length;

  const rejectedCount = customers.filter(
    (customer) =>
      String(
        customer.kycStatus
      ).toUpperCase() === "REJECTED"
  ).length;

  const getStatusStyle = (status) => {
    switch (
      String(status).toUpperCase()
    ) {
      case "VERIFIED":
        return "border-green-200 bg-green-50 text-green-700";

      case "REJECTED":
        return "border-red-200 bg-red-50 text-red-700";

      case "PENDING":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (
      String(status).toUpperCase()
    ) {
      case "VERIFIED":
        return <CheckCircle size={14} />;

      case "REJECTED":
        return <XCircle size={14} />;

      case "PENDING":
        return <Clock size={14} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading KYC information...
          </p>
        </div>
      </div>
    );
  }

  const isVerifying =
    confirmModal.status === "VERIFIED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
              <ShieldCheck
                size={22}
                className="text-orange-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#17202A]">
                KYC Management
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage customer KYC
                verification.
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
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Customers
          </p>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#17202A]">
              {customers.length}
            </h2>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <User
                size={21}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Review
          </p>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#17202A]">
              {pendingCount}
            </h2>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50">
              <Clock
                size={21}
                className="text-yellow-600"
              />
            </div>
          </div>
        </div>

        {/* Verified */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            VERIFIED
          </p>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#17202A]">
              {verifiedCount}
            </h2>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <CheckCircle
                size={21}
                className="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Rejected
          </p>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#17202A]">
              {rejectedCount}
            </h2>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <XCircle
                size={21}
                className="text-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customer name, email, phone..."
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

            <option value="PENDING">
              Pending
            </option>

            <option value="VERIFIED">
              VERIFIED
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>
      </div>

      {/* KYC Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-[#17202A]">
            KYC Applications
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Showing{" "}
            {filteredCustomers.length} of{" "}
            {customers.length} customers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Contact
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Address
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  KYC Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No KYC records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-50 transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                            <User
                              size={17}
                              className="text-blue-600"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {customer.user
                                ?.name ||
                                "N/A"}
                            </p>

                            <p className="text-xs text-gray-400">
                              Customer ID:{" "}
                              {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail
                              size={14}
                              className="text-gray-400"
                            />

                            {customer.user
                              ?.email ||
                              "N/A"}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone
                              size={13}
                              className="text-gray-400"
                            />

                            {customer.phone ||
                              "N/A"}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex max-w-[240px] items-start gap-2 text-sm text-gray-600">
                          <MapPin
                            size={15}
                            className="mt-0.5 shrink-0 text-gray-400"
                          />

                          <span>
                            {customer.address ||
                              "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                            customer.kycStatus
                          )}`}
                        >
                          {getStatusIcon(
                            customer.kycStatus
                          )}

                          {customer.kycStatus ||
                            "UNKNOWN"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => {
                            setSelectedCustomer(
                              customer
                            );

                            showNotification(
                              "KYC review opened.",
                              "info"
                            );
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye size={15} />
                          Review
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="font-semibold text-[#17202A]">
                  Review KYC
                </h2>

                <p className="text-xs text-gray-400">
                  Customer ID:{" "}
                  {selectedCustomer.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedCustomer(null)
                }
                disabled={
                  updatingId !== null
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Information */}
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <User
                    size={21}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedCustomer.user
                      ?.name || "N/A"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {selectedCustomer.user
                      ?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={14} />
                    Phone
                  </div>

                  <p className="mt-2 text-sm font-medium text-gray-800">
                    {selectedCustomer.phone ||
                      "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={14} />
                    KYC Status
                  </div>

                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                      selectedCustomer.kycStatus
                    )}`}
                  >
                    {getStatusIcon(
                      selectedCustomer.kycStatus
                    )}

                    {selectedCustomer.kycStatus ||
                      "UNKNOWN"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={14} />
                  Address
                </div>

                <p className="mt-2 text-sm text-gray-700">
                  {selectedCustomer.address ||
                    "N/A"}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Update KYC Status
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={
                      updatingId ===
                        selectedCustomer.id ||
                      selectedCustomer.kycStatus ===
                        "VERIFIED"
                    }
                    onClick={() =>
                      openKycConfirmation(
                        selectedCustomer,
                        "VERIFIED"
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle size={17} />

                    Verified
                  </button>

                  <button
                    disabled={
                      updatingId ===
                        selectedCustomer.id ||
                      selectedCustomer.kycStatus ===
                        "REJECTED"
                    }
                    onClick={() =>
                      openKycConfirmation(
                        selectedCustomer,
                        "REJECTED"
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={17} />

                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-100 px-6 py-4">
              <button
                onClick={() =>
                  setSelectedCustomer(null)
                }
                disabled={
                  updatingId !== null
                }
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Confirmation Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={
          isVerifying
            ? "Verify Customer KYC?"
            : "Reject Customer KYC?"
        }
        message={
          isVerifying
            ? `Are you sure you want to verify the KYC for ${confirmModal.customerName}? This will mark the customer's KYC status as VERIFIED.`
            : `Are you sure you want to reject the KYC for ${confirmModal.customerName}? This will mark the customer's KYC status as REJECTED.`
        }
        confirmText={
          isVerifying
            ? "Verify KYC"
            : "Reject KYC"
        }
        cancelText="Cancel"
        type={
          isVerifying
            ? "success"
            : "danger"
        }
        loading={updatingId !== null}
        onConfirm={confirmKycUpdate}
        onCancel={closeKycConfirmation}
      />
    </div>
  );
}

export default AdminKyc;