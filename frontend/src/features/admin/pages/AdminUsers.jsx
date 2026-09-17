 import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  Users,
  ShieldCheck,
  UserRound,
  UserCheck,
  UserX,
} from "lucide-react";

import {
  getUsers,
  createUser,
  updateUserStatus,
} from "../api/adminApi";

import { useNotification } from "../../../components/common/NotificationProvider";
import ConfirmModal from "../../../components/common/ConfirmModal";

function AdminUsers() {
  const { showNotification } = useNotification();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedUser, setSelectedUser] = useState(null);

  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    user: null,
    newStatus: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  // ==============================
  // Load Users
  // ==============================

  const loadUsers = async () => {
    try {
      setError("");

      const data = await getUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load users.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ==============================
  // Refresh Users
  // ==============================

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const data = await getUsers();

      setUsers(Array.isArray(data) ? data : []);

      showNotification(
        "Users refreshed successfully.",
        "success"
      );
    } catch (err) {
      console.error("Failed to refresh users:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to refresh users.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  // ==============================
  // User Helpers
  // ==============================

  const getRole = (user) => {
    return String(user.role ?? user.authority ?? "")
      .replace("ROLE_", "")
      .toUpperCase();
  };

  const getStatus = (user) => {
    return String(user.status ?? "ACTIVE").toUpperCase();
  };

  const getName = (user) => {
    return user.name ?? user.fullName ?? "N/A";
  };

  const getEmail = (user) => {
    return user.email ?? "N/A";
  };

  // ==============================
  // Search + Filter
  // ==============================

  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return users.filter((user) => {
      const role = getRole(user);
      const status = getStatus(user);

      const matchesSearch =
        !searchText ||
        String(user.id ?? "")
          .toLowerCase()
          .includes(searchText) ||
        getName(user).toLowerCase().includes(searchText) ||
        getEmail(user).toLowerCase().includes(searchText) ||
        role.toLowerCase().includes(searchText) ||
        status.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "ALL" || role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // ==============================
  // Statistics
  // ==============================

  const adminCount = users.filter(
    (user) => getRole(user) === "ADMIN"
  ).length;

  const customerCount = users.filter(
    (user) => getRole(user) === "CUSTOMER"
  ).length;

  const activeCount = users.filter(
    (user) => getStatus(user) === "ACTIVE"
  ).length;

  const inactiveCount = users.filter(
    (user) => getStatus(user) === "INACTIVE"
  ).length;

  // ==============================
  // Date Helpers
  // ==============================

  const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN");
  };

  const getCreatedDate = (user) => {
    return (
      user.createdAt ??
      user.createdDate ??
      user.createdOn ??
      user.registrationDate
    );
  };

  // ==============================
  // Create User
  // ==============================

  const handleCreateUser = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      showNotification("Name is required.", "warning");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      showNotification("Email is required.", "warning");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      showNotification("Password is required.", "warning");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      showNotification(
        "Password must be at least 6 characters long.",
        "warning"
      );
      return;
    }

    try {
      setCreating(true);

      await createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      await loadUsers();

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
      });

      setShowCreateModal(false);

      showNotification(
        `${formData.name.trim()} created successfully.`,
        "success"
      );
    } catch (err) {
      console.error("Failed to create user:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create user.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setCreating(false);
    }
  };

  // ==============================
  // Open Status Confirmation
  // ==============================

  const handleStatusChange = (user) => {
    const currentStatus = getStatus(user);

    const newStatus =
      currentStatus === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    setConfirmModal({
      open: true,
      user,
      newStatus,
    });
  };

  // ==============================
  // Execute Status Change
  // ==============================

  const executeStatusChange = async () => {
    const { user, newStatus } = confirmModal;

    if (!user || !newStatus) return;

    try {
      setError("");
      setUpdatingStatusId(user.id);

      const updatedUser = await updateUserStatus(
        user.id,
        newStatus
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                ...updatedUser,
                status: newStatus,
              }
            : currentUser
        )
      );

      if (
        selectedUser &&
        selectedUser.id === user.id
      ) {
        setSelectedUser((current) => ({
          ...current,
          ...updatedUser,
          status: newStatus,
        }));
      }

      setConfirmModal({
        open: false,
        user: null,
        newStatus: null,
      });

      showNotification(
        `${getName(user)} has been ${
          newStatus === "INACTIVE"
            ? "deactivated"
            : "activated"
        } successfully.`,
        "success"
      );
    } catch (err) {
      console.error(
        "Failed to update user status:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update user status.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ==============================
  // Close Confirmation Modal
  // ==============================

  const handleCloseConfirmModal = () => {
    if (updatingStatusId !== null) return;

    setConfirmModal({
      open: false,
      user: null,
      newStatus: null,
    });
  };

  // ==============================
  // Close Create Modal
  // ==============================

  const handleCloseCreateModal = () => {
    if (creating) return;

    setShowCreateModal(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    });

    setError("");
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
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  const confirmUser = confirmModal.user;

  const confirmIsDeactivate =
    confirmModal.newStatus === "INACTIVE";

  return (
    <div className="space-y-6">

      {/* ==============================
          Header
      ============================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Users
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#17202A]">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage registered banking system users.
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          <button
            onClick={() => {
              setShowCreateModal(true);
              setError("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Users size={17} />
            Create User
          </button>

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        {/* Total */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
                {users.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Users
                size={21}
                className="text-blue-600"
              />
            </div>

          </div>
        </div>

        {/* Admin */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Administrators
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
                {adminCount}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <ShieldCheck
                size={21}
                className="text-purple-600"
              />
            </div>

          </div>
        </div>

        {/* Customer */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Customers
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#17202A]">
                {customerCount}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <UserRound
                size={21}
                className="text-green-600"
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

              <h2 className="mt-3 text-2xl font-bold text-green-600">
                {activeCount}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <UserCheck
                size={21}
                className="text-green-600"
              />
            </div>

          </div>
        </div>

        {/* Inactive */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Inactive
              </p>

              <h2 className="mt-3 text-2xl font-bold text-red-600">
                {inactiveCount}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <UserX
                size={21}
                className="text-red-600"
              />
            </div>

          </div>
        </div>

      </div>

      {/* ==============================
          Search + Filter
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
              placeholder="Search by name, email, ID or role..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">
              All Roles
            </option>

            <option value="ADMIN">
              Admin
            </option>

            <option value="CUSTOMER">
              Customer
            </option>
          </select>

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

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

        </div>
      </div>

      {/* ==============================
          Users Table
      ============================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">

          <h2 className="font-semibold text-[#17202A]">
            Registered Users
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50 text-left">

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>

                </tr>

              ) : (

                filteredUsers.map((user, index) => {

                  const role = getRole(user);
                  const status = getStatus(user);

                  const isUpdating =
                    updatingStatusId === user.id;

                  return (

                    <tr
                      key={user.id ?? index}
                      className="border-b border-gray-50 transition hover:bg-gray-50"
                    >

                      {/* User */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">

                            <UserRound
                              size={18}
                              className="text-blue-600"
                            />

                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {getName(user)}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID: {user.id ?? "N/A"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-gray-600">
                          {getEmail(user)}
                        </span>

                      </td>

                      {/* Role */}

                      <td className="px-5 py-4">

                        {role === "ADMIN" ? (

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">

                            <ShieldCheck size={14} />

                            Admin

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">

                            <UserRound size={14} />

                            Customer

                          </span>

                        )}

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        {status === "ACTIVE" ? (

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">

                            <UserCheck size={14} />

                            Active

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">

                            <UserX size={14} />

                            Inactive

                          </span>

                        )}

                      </td>

                      {/* Created */}

                      <td className="px-5 py-4">

                        <span className="text-xs text-gray-500">
                          {formatDate(
                            getCreatedDate(user)
                          )}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >

                            <Eye size={15} />

                            View

                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(user)
                            }
                            disabled={isUpdating}
                            className={
                              status === "ACTIVE"
                                ? "inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                : "inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                            }
                          >

                            <RefreshCw
                              size={14}
                              className={
                                isUpdating
                                  ? "animate-spin"
                                  : ""
                              }
                            />

                            {isUpdating
                              ? "Updating..."
                              : status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}

                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==============================
          Create User Modal
      ============================== */}

      {showCreateModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>

                <h2 className="text-lg font-semibold text-[#17202A]">
                  Create User
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Create a new banking system user.
                </p>

              </div>

              <button
                onClick={handleCloseCreateModal}
                disabled={creating}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleCreateUser}
              className="space-y-5 p-6"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  disabled={creating}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter email address"
                  disabled={creating}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Minimum 6 characters"
                  disabled={creating}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  disabled={creating}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                >

                  <option value="CUSTOMER">
                    Customer
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>

                </select>

              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  disabled={creating}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {creating && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {creating
                    ? "Creating..."
                    : "Create User"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==============================
          User Details Modal
      ============================== */}

      {selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

              <div>

                <h2 className="font-semibold text-[#17202A]">
                  User Details
                </h2>

                <p className="text-xs text-gray-400">
                  User ID: {selectedUser.id ?? "N/A"}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-4 p-6">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs text-gray-500">
                  Name
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {getName(selectedUser)}
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                  {getEmail(selectedUser)}
                </p>

              </div>

              <div className="rounded-xl border border-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Role
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {getRole(selectedUser) || "N/A"}
                </p>

              </div>

              <div className="rounded-xl border border-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Status
                </p>

                <p
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    getStatus(selectedUser) ===
                    "ACTIVE"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {getStatus(selectedUser)}
                </p>

              </div>

              <div className="rounded-xl border border-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Created
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {formatDate(
                    getCreatedDate(selectedUser)
                  )}
                </p>

              </div>

            </div>

            <div className="flex justify-between border-t border-gray-100 px-6 py-4">

              <button
                onClick={() =>
                  handleStatusChange(selectedUser)
                }
                disabled={
                  updatingStatusId ===
                  selectedUser.id
                }
                className={
                  getStatus(selectedUser) ===
                  "ACTIVE"
                    ? "rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    : "rounded-xl border border-green-200 px-4 py-2.5 text-sm font-medium text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                }
              >
                {updatingStatusId ===
                selectedUser.id
                  ? "Updating..."
                  : getStatus(selectedUser) ===
                    "ACTIVE"
                  ? "Deactivate User"
                  : "Activate User"}
              </button>

              <button
                onClick={() =>
                  setSelectedUser(null)
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
          Status Confirmation Modal
      ============================== */}

      <ConfirmModal
        open={confirmModal.open}
        title={
          confirmIsDeactivate
            ? "Deactivate User?"
            : "Activate User?"
        }
        message={
          confirmUser
            ? `Are you sure you want to ${
                confirmIsDeactivate
                  ? "deactivate"
                  : "activate"
              } ${getName(confirmUser)}?`
            : ""
        }
        confirmText={
          confirmIsDeactivate
            ? "Deactivate"
            : "Activate"
        }
        cancelText="Cancel"
        type={
          confirmIsDeactivate
            ? "block"
            : "success"
        }
        loading={updatingStatusId !== null}
        onConfirm={executeStatusChange}
        onCancel={handleCloseConfirmModal}
      />

    </div>
  );
}

export default AdminUsers;