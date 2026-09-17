 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  WalletCards,
  CheckCircle,
  Ban,
  CreditCard,
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

import AccountCard from "../../../components/cards/AccountCard";
import { getMyAccounts } from "../accountsApi";

import { useNotification } from "../../../components/common/NotificationProvider";

function Accounts() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
      }

      setError("");

      const data = await getMyAccounts();

      const safeAccounts = Array.isArray(data)
        ? data
        : [];

      setAccounts(safeAccounts);

      if (isRefresh) {
        showNotification(
          "Accounts refreshed successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error("Accounts API error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load accounts.";

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
    loadAccounts();
  }, []);

  // ==========================================
  // Statistics
  // ==========================================

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  );

  const activeAccounts = accounts.filter(
    (account) => account.status === "ACTIVE"
  ).length;

  const blockedAccounts = accounts.filter(
    (account) => account.status === "BLOCKED"
  ).length;

  // ==========================================
  // Account Actions
  // ==========================================

  const handleDeposit = (account) => {
    console.log("Deposit:", account);

    navigate("/deposit");
  };

  const handleWithdraw = (account) => {
    console.log("Withdraw:", account);

    navigate("/withdraw");
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ==========================================
          Page Header
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            My Accounts
          </h1>

          <p className="mt-2 text-gray-500">
            Manage and monitor all your bank accounts.
          </p>
        </div>

        {/* Refresh Button */}

        <button
          type="button"
          onClick={() => loadAccounts(true)}
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
            onClick={() => loadAccounts(true)}
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
            Loading your accounts...
          </p>

        </div>

      ) : (

        <>

          {/* ==========================================
              Summary Cards
          ========================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {/* Total Balance */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Balance
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    ₹
                    {totalBalance.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#0F3D56]">
                  <WalletCards size={21} />
                </div>

              </div>

            </div>

            {/* Active Accounts */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Accounts
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {activeAccounts}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <CheckCircle size={21} />
                </div>

              </div>

            </div>

            {/* Blocked Accounts */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Blocked Accounts
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {blockedAccounts}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Ban size={21} />
                </div>

              </div>

            </div>

          </div>

          {/* ==========================================
              Quick Account Actions
          ========================================== */}

          <section>

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-800">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Quickly access your banking services.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <button
                type="button"
                onClick={() => navigate("/deposit")}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                  <ArrowDownToLine size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Deposit Money
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Add money to your account
                  </p>
                </div>

              </button>

              <button
                type="button"
                onClick={() => navigate("/withdraw")}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  <ArrowUpFromLine size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Withdraw Money
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Withdraw money from your account
                  </p>
                </div>

              </button>

            </div>

          </section>

          {/* ==========================================
              Account List
          ========================================== */}

          <section>

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Account Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your available banking accounts
                </p>
              </div>

              <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
                <CreditCard size={18} />
                {accounts.length} Accounts
              </div>

            </div>

            {accounts.length === 0 ? (

              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">

                <CreditCard
                  size={45}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-4 font-medium text-gray-700">
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
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                  />

                ))}

              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}

export default Accounts;