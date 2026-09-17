 import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowDownToLine,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

import { getMyAccounts } from "../../accounts/accountsApi";
import { depositMoney } from "../depositApi";

import { useNotification } from "../../../components/common/NotificationProvider";

function Deposit() {
  const { showNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const [accountsLoading, setAccountsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
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

      // Keep selected account if it still exists
      const selectedStillExists = activeAccounts.some(
        (account) => String(account.id) === String(accountId)
      );

      if (!selectedStillExists) {
        if (activeAccounts.length > 0) {
          setAccountId(String(activeAccounts[0].id));
        } else {
          setAccountId("");
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

      showNotification(message, "error");
    } finally {
      setAccountsLoading(false);
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
  // Submit Deposit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Account validation
    if (!accountId) {
      const message = "Please select an account.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    // Amount validation
    const depositAmount = Number(amount);

    if (
      !amount ||
      Number.isNaN(depositAmount) ||
      depositAmount <= 0
    ) {
      const message =
        "Please enter a valid deposit amount.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    // Maximum safe amount validation
    if (depositAmount > 10000000) {
      const message =
        "Deposit amount cannot exceed ₹1,00,00,000.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    try {
      setLoading(true);

      await depositMoney(
        Number(accountId),
        depositAmount
      );

      // Clear amount
      setAmount("");

      // Refresh account balance
      await loadAccounts();

      // Success notification
      showNotification(
        `₹${depositAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} deposited successfully.`,
        "success"
      );
    } catch (error) {
      console.error("Deposit error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Deposit failed.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-3xl space-y-8">

      {/* ==========================================
          Page Header
      ========================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Deposit Money
          </h1>

          <p className="mt-2 text-gray-500">
            Add money to your active bank account.
          </p>
        </div>

        {/* Refresh */}

        <button
          type="button"
          onClick={() => loadAccounts(true)}
          disabled={
            refreshing ||
            accountsLoading ||
            loading
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
          Deposit Card
      ========================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">

        {/* Card Header */}

        <div className="mb-8 flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Wallet size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Make a Deposit
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select an account and enter the amount.
            </p>
          </div>

        </div>

        {/* ==========================================
            Selected Account Preview
        ========================================== */}

        {selectedAccount && (
          <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Selected Account
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {selectedAccount.accountType}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  ****
                  {selectedAccount.accountNumber?.slice(-4)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Current Balance
                </p>

                <p className="mt-1 text-lg font-bold text-[#0F3D56]">
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
            Form
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Account */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Account
            </label>

            {accountsLoading ? (

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">

                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#0F3D56]" />

                Loading accounts...

              </div>

            ) : accounts.length === 0 ? (

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                <div className="flex items-center gap-2">
                  <CheckCircle size={17} />
                  No active accounts available.
                </div>

              </div>

            ) : (

              <select
                value={accountId}
                onChange={(e) =>
                  setAccountId(e.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#0F3D56] focus:ring-2 focus:ring-[#0F3D56]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
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

          {/* Amount */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Deposit Amount
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Enter amount"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#0F3D56] focus:ring-2 focus:ring-[#0F3D56]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            <p className="mt-2 text-xs text-gray-400">
              Enter an amount greater than ₹0.
            </p>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={
              loading ||
              accountsLoading ||
              refreshing ||
              accounts.length === 0 ||
              !amount
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F3D56] py-3 font-semibold text-white transition hover:bg-[#0B3044] disabled:cursor-not-allowed disabled:bg-gray-300"
          >

            {loading ? (
              <>
                <RefreshCw
                  size={19}
                  className="animate-spin"
                />

                Processing...
              </>
            ) : (
              <>
                <ArrowDownToLine size={19} />

                Deposit Money
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Deposit;