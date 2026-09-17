 import {
  Users,
  CreditCard,
  ArrowLeftRight,
  ShieldAlert,
  TrendingUp,
  UserPlus,
  RefreshCw,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AdminStatCard from "../components/AdminStatCard";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUsers,
  getAccounts,
  getTransactions,
  getCustomers,
} from "../api/adminApi";

import { useNotification } from "../../../components/common/NotificationProvider";

function AdminDashboard() {
  const { showNotification } = useNotification();

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPendingKyc, setTotalPendingKyc] = useState(0);

  const [recentTransactions, setRecentTransactions] =
    useState([]);

  const [transactionStats, setTransactionStats] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // =========================
      // Load Users
      // =========================
      const usersData = await getUsers();

      const users = Array.isArray(usersData)
        ? usersData
        : [];

      const customers = users.filter(
        (user) => user.role === "CUSTOMER"
      );

      setTotalCustomers(customers.length);

      // =========================
      // Load Accounts
      // =========================
      const accountsData = await getAccounts();

      const accounts = Array.isArray(accountsData)
        ? accountsData
        : [];

      setTotalAccounts(accounts.length);

      // =========================
      // Load Transactions
      // =========================
      const transactionsData = await getTransactions();

      const transactions = Array.isArray(
        transactionsData
      )
        ? transactionsData
        : [];

      setTotalTransactions(transactions.length);

      // Latest 5 transactions
      const latestTransactions = [...transactions]
        .sort(
          (a, b) =>
            new Date(b.transactionDate) -
            new Date(a.transactionDate)
        )
        .slice(0, 5);

      setRecentTransactions(latestTransactions);

      // =========================
      // Transaction Statistics
      // =========================
      const depositCount = transactions.filter(
        (transaction) =>
          transaction.type === "DEPOSIT"
      ).length;

      const withdrawCount = transactions.filter(
        (transaction) =>
          transaction.type === "WITHDRAW"
      ).length;

      const transferCount = transactions.filter(
        (transaction) =>
          transaction.type === "TRANSFER"
      ).length;

      setTransactionStats([
        {
          name: "Deposits",
          count: depositCount,
        },
        {
          name: "Withdrawals",
          count: withdrawCount,
        },
        {
          name: "Transfers",
          count: transferCount,
        },
      ]);

      // =========================
      // Load Customers / KYC
      // =========================
      const customersDataResponse =
        await getCustomers();

      const customersData = Array.isArray(
        customersDataResponse
      )
        ? customersDataResponse
        : [];

      const pendingCustomers =
        customersData.filter(
          (customer) =>
            customer.kycStatus === "PENDING"
        );

      setTotalPendingKyc(
        pendingCustomers.length
      );

      // =========================
      // Success Notification
      // =========================
      if (isRefresh) {
        showNotification(
          "Dashboard refreshed successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );

      let message =
        "Failed to load dashboard data.";

      if (error?.response?.status === 401) {
        message =
          "Your session has expired. Please login again.";
      } else if (error?.response?.status === 403) {
        message =
          "Access denied. Admin permission is required.";
      } else if (
        error?.response?.data?.message
      ) {
        message =
          error.response.data.message;
      }

      showNotification(message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Page Content */}
      <main className="px-8 pb-8">
        {/* =========================
            Page Header
        ========================= */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#17202A]">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Monitor your banking system and manage
              operations.
            </p>
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading || refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* =========================
            Statistics
        ========================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Customers */}
          <AdminStatCard
            title="Total Customers"
            value={
              loading ? "..." : totalCustomers
            }
            description="Registered customers"
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          {/* Total Accounts */}
          <AdminStatCard
            title="Total Accounts"
            value={
              loading ? "..." : totalAccounts
            }
            description="Total bank accounts"
            icon={CreditCard}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          {/* Transactions */}
          <AdminStatCard
            title="Transactions"
            value={
              loading
                ? "..."
                : totalTransactions
            }
            description="Total transactions"
            icon={ArrowLeftRight}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          {/* Pending KYC */}
          <AdminStatCard
            title="Pending KYC"
            value={
              loading
                ? "..."
                : totalPendingKyc
            }
            description="Require verification"
            icon={ShieldAlert}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* =========================
            Main Dashboard Area
        ========================= */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* =========================
              Transaction Overview
          ========================= */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#17202A]">
                  Transaction Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Banking transaction activity
                </p>
              </div>

              <TrendingUp
                size={22}
                className="text-[#0F3D56]"
              />
            </div>

            {/* Chart */}
            <div className="mt-6 h-64 w-full">
              {transactionStats.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={transactionStats}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Transactions"
                      fill="#0F3D56"
                      radius={[6, 6, 0, 0]}
                      barSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      {loading
                        ? "Loading transaction data..."
                        : "No transaction data"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {loading
                        ? "Please wait while dashboard data is loaded."
                        : "Transaction data will appear here"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =========================
              Quick Actions
          ========================= */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#17202A]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Common administrative tasks
            </p>

            <div className="mt-6 space-y-3">
              {/* Manage Customers */}
              <button
                onClick={() =>
                  navigate("/admin/customers")
                }
                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <UserPlus size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Manage Customers
                  </p>

                  <p className="text-xs text-gray-500">
                    View customer accounts
                  </p>
                </div>
              </button>

              {/* Manage Accounts */}
              <button
                onClick={() =>
                  navigate("/admin/accounts")
                }
                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
              >
                <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                  <CreditCard size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Manage Accounts
                  </p>

                  <p className="text-xs text-gray-500">
                    Review bank accounts
                  </p>
                </div>
              </button>

              {/* Review KYC */}
              <button
                onClick={() =>
                  navigate("/admin/kyc")
                }
                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
              >
                <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                  <ShieldAlert size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Review KYC
                  </p>

                  <p className="text-xs text-gray-500">
                    Check pending verification
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            Recent Activity
        ========================= */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#17202A]">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest banking system activity
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
            {recentTransactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentTransactions.map(
                  (transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between px-5 py-4 transition hover:bg-gray-50"
                    >
                      {/* Transaction Information */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            transaction.type ===
                            "DEPOSIT"
                              ? "bg-green-50 text-green-600"
                              : transaction.type ===
                                "WITHDRAW"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          <ArrowLeftRight
                            size={18}
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {transaction.type}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Reference:{" "}
                            {
                              transaction.referenceNumber
                            }
                          </p>
                        </div>
                      </div>

                      {/* Amount and Status */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">
                          ₹
                          {Number(
                            transaction.amount
                          ).toLocaleString("en-IN")}
                        </p>

                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                            transaction.status ===
                            "SUCCESS"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-400">
                  {loading
                    ? "Loading recent transactions..."
                    : "No recent transactions found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;