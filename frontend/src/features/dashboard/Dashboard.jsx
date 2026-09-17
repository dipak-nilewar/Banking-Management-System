 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  WalletCards,
  CreditCard,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import StatCard from "../../components/cards/StatCard";
import AccountCard from "../../components/cards/AccountCard";
import QuickActions from "../../components/cards/QuickActions";
import RecentTransactions from "../../components/cards/RecentTransactions";
import BalanceOverview from "../../components/charts/BalanceOverview";

import {
  getMyAccounts,
  getAccountTransactions,
} from "./dashboardApi";

import { getCurrentUser } from "../../api/userApi";
import { useNotification } from "../../components/common/NotificationProvider";

function Dashboard() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // ==========================================
  // User
  // ==========================================

  const [currentUser, setCurrentUser] = useState(null);

  // ==========================================
  // Dashboard data
  // ==========================================

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // ==========================================
  // UI state
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Load Dashboard
  // ==========================================

  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // Get logged-in user
      const userData = await getCurrentUser();

      setCurrentUser(userData);

      // Get user's accounts
      const accountData = await getMyAccounts();

      const safeAccounts = Array.isArray(accountData)
        ? accountData
        : [];

      setAccounts(safeAccounts);

      // Get transactions for all accounts
      const transactionResults = await Promise.all(
        safeAccounts.map((account) =>
          getAccountTransactions(account.id)
        )
      );

      const allTransactions = transactionResults
        .filter(Array.isArray)
        .flat();

      setTransactions(allTransactions);

      // Show notification only for manual refresh
      if (isRefresh) {
        showNotification(
          "Dashboard refreshed successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error("Dashboard API error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load dashboard data.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ==========================================
  // Calculate Total Balance
  // ==========================================

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  );

  // ==========================================
  // Count Active Accounts
  // ==========================================

  const activeAccounts = accounts.filter(
    (account) => account.status === "ACTIVE"
  ).length;

  // ==========================================
  // Current Month Transactions
  // ==========================================

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(
    (transaction) => {
      if (!transaction.transactionDate) {
        return false;
      }

      const transactionDate = new Date(
        transaction.transactionDate
      );

      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    }
  );

  // ==========================================
  // Format Currency
  // ==========================================

  const formattedBalance = `₹${totalBalance.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ==========================================
          Welcome Header
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Welcome, {currentUser?.name || "Customer"} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Here’s an overview of your banking activity.
          </p>
        </div>

        {/* Refresh */}

        <button
          type="button"
          onClick={() => loadDashboardData(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ==========================================
          Error Message
      ========================================== */}

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <p>{error}</p>

          <button
            type="button"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Retry
          </button>

        </div>
      )}

      {/* ==========================================
          Loading
      ========================================== */}

      {loading ? (

        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#0F3D56]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your banking information...
          </p>

        </div>

      ) : (

        <>

          {/* ==========================================
              Statistics
          ========================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {/* Total Balance */}

            <StatCard
              title="Total Balance"
              value={formattedBalance}
              description="Across all accounts"
              icon={<WalletCards size={21} />}
              iconBg="bg-blue-100"
              iconColor="text-[#0F3D56]"
            />

            {/* Active Accounts */}

            <StatCard
              title="Active Accounts"
              value={activeAccounts}
              description={`${accounts.length} total accounts`}
              icon={<CreditCard size={21} />}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />

            {/* Monthly Activity */}

            <StatCard
              title="Monthly Activity"
              value={monthlyTransactions.length}
              description="Transactions this month"
              icon={<TrendingUp size={21} />}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />

          </div>

          {/* ==========================================
              Balance + Quick Actions
          ========================================== */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <div className="xl:col-span-2">
              <BalanceOverview
                accounts={accounts}
              />
            </div>

            <QuickActions
              onTransfer={() => navigate("/transfer")}
              onDeposit={() => navigate("/deposit")}
              onWithdraw={() => navigate("/withdraw")}
            />

          </div>

          {/* ==========================================
              My Accounts
          ========================================== */}

          <section>

            <div className="mb-5 flex items-end justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  My Accounts
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your bank accounts
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/accounts")}
                className="text-sm font-medium text-[#0F3D56] transition hover:underline"
              >
                View all
              </button>

            </div>

            {accounts.length === 0 ? (

              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">

                <CreditCard
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-4 font-medium text-gray-600">
                  No accounts available
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Your bank accounts will appear here.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {accounts.map((account) => (

                  <AccountCard
                    key={account.id}
                    account={account}

                    onDeposit={(selectedAccount) => {
                      console.log(
                        "Deposit",
                        selectedAccount
                      );

                      navigate("/deposit");
                    }}

                    onWithdraw={(selectedAccount) => {
                      console.log(
                        "Withdraw",
                        selectedAccount
                      );

                      navigate("/withdraw");
                    }}
                  />

                ))}

              </div>

            )}

          </section>

          {/* ==========================================
              Recent Transactions
          ========================================== */}

          <RecentTransactions
            transactions={transactions}
            loading={loading}
          />

        </>

      )}

    </div>
  );
}

export default Dashboard;