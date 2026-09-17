
import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Eye,
  X,
  FileText,
  User,
  Activity,
  CheckCircle,
} from "lucide-react";

import { getAuditLogs } from "../api/adminApi";

import { useNotification } from "../../../components/common/NotificationProvider";

function AdminAuditLogs() {
  const { showNotification } = useNotification();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [error, setError] = useState("");

  // ==============================
  // Load Audit Logs
  // ==============================

  const loadAuditLogs = async () => {
    try {
      setError("");

      const data = await getAuditLogs();

      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Failed to load audit logs:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Failed to load audit logs.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  // ==============================
  // Refresh
  // ==============================

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getAuditLogs();

      setLogs(Array.isArray(data) ? data : []);

      showNotification(
        "Audit logs refreshed successfully.",
        "success"
      );
    } catch (err) {
      console.error(
        "Failed to refresh audit logs:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Failed to refresh audit logs.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  // ==============================
  // Search
  // ==============================

  const filteredLogs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return logs;
    }

    return logs.filter((log) =>
      Object.values(log).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchText)
      )
    );
  }, [logs, search]);

  // ==============================
  // Statistics
  // ==============================

  const successfulLogs = logs.length;

  // ==============================
  // Format Date
  // ==============================

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN");
  };

  // ==============================
  // Log ID
  // ==============================

  const getLogId = (log) => {
    return log.id ?? log.auditId ?? "N/A";
  };

  // ==============================
  // Action
  // ==============================

  const getAction = (log) => {
    return (
      log.action ??
      log.activity ??
      log.event ??
      "N/A"
    );
  };

  // ==============================
  // Username
  // ==============================

  const getUsername = (log) => {
    return (
      log.username ??
      log.userName ??
      log.userEmail ??
      log.email ??
      log.performedBy ??
      "N/A"
    );
  };

  // ==============================
  // Description
  // ==============================

  const getDescription = (log) => {
    return (
      log.description ??
      log.message ??
      log.details ??
      log.actionDescription ??
      "No description available"
    );
  };

  // ==============================
  // Date
  // ==============================

  const getDate = (log) => {
    return (
      log.timestamp ??
      log.createdAt ??
      log.createdDate ??
      log.date ??
      log.time
    );
  };

  // ==============================
  // View Audit Log
  // ==============================

  const handleViewLog = (log) => {
    setSelectedLog(log);

    showNotification(
      "Audit log details opened.",
      "info"
    );
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
            Loading audit logs...
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

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <FileText
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#17202A]">
              Audit Logs
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Monitor administrative and system activities.
            </p>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Logs */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Audit Logs
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
                {logs.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <FileText
                size={21}
                className="text-blue-600"
              />
            </div>

          </div>

        </div>

        {/* Recorded Activities */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Recorded Activities
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
                {successfulLogs}
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

        {/* System Activity */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                System Activity
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
                {logs.length > 0
                  ? "Active"
                  : "No Activity"}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <Activity
                size={21}
                className="text-purple-600"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ==============================
          Search
      ============================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* ==============================
          Table
      ============================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">

          <h2 className="font-semibold text-[#17202A]">
            Activity History
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Showing {filteredLogs.length} of{" "}
            {logs.length} audit logs
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50 text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLogs.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No audit logs found.
                  </td>

                </tr>

              ) : (

                filteredLogs.map((log, index) => (

                  <tr
                    key={
                      getLogId(log) !== "N/A"
                        ? getLogId(log)
                        : index
                    }
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >

                    {/* ID */}

                    <td className="px-5 py-4">

                      <span className="font-mono text-xs font-medium text-gray-600">
                        #{getLogId(log)}
                      </span>

                    </td>

                    {/* User */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                          <User
                            size={16}
                            className="text-blue-600"
                          />
                        </div>

                        <span className="text-sm font-medium text-gray-700">
                          {getUsername(log)}
                        </span>

                      </div>

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {getAction(log)}
                      </span>

                    </td>

                    {/* Description */}

                    <td className="max-w-[320px] px-5 py-4">

                      <p className="truncate text-sm text-gray-600">
                        {getDescription(log)}
                      </p>

                    </td>

                    {/* Date */}

                    <td className="px-5 py-4">

                      <span className="text-xs text-gray-500">
                        {formatDate(getDate(log))}
                      </span>

                    </td>

                    {/* View */}

                    <td className="px-5 py-4">

                      <button
                        onClick={() =>
                          handleViewLog(log)
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
          Details Modal
      ============================== */}

      {selectedLog && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>

                <h2 className="font-semibold text-[#17202A]">
                  Audit Log Details
                </h2>

                <p className="text-xs text-gray-400">
                  Log ID: {getLogId(selectedLog)}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedLog(null)
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Body */}

            <div className="max-h-[70vh] overflow-y-auto p-6">

              <div className="space-y-4">

                {Object.entries(selectedLog).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="rounded-xl border border-gray-100 p-4"
                    >

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        {key}
                      </p>

                      <p className="mt-2 break-all text-sm font-medium text-gray-800">

                        {value === null ||
                        value === undefined
                          ? "N/A"
                          : typeof value === "object"
                          ? JSON.stringify(
                              value,
                              null,
                              2
                            )
                          : String(value)}

                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-gray-100 px-6 py-4">

              <button
                onClick={() =>
                  setSelectedLog(null)
                }
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

export default AdminAuditLogs;

