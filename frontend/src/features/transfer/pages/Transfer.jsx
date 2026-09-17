 import { useEffect, useState } from "react";

import {
  ArrowLeftRight,
  Send,
  AlertCircle,
  WalletCards,
  RefreshCw,
} from "lucide-react";

import { getMyAccounts } from "../../accounts/accountsApi";
import { transferMoney } from "../transferApi";

import { useNotification } from "../../../components/common/NotificationProvider";

function Transfer() {
  const { showNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");

  const [receiverAccountNumber, setReceiverAccountNumber] =
    useState("");

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

      const selectedStillExists = activeAccounts.some(
        (account) =>
          String(account.id) === String(accountId)
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
      setAccounts([]);

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
  // Selected Account
  // ==========================================

  const selectedAccount = accounts.find(
    (account) =>
      String(account.id) === String(accountId)
  );

  // ==========================================
  // Handle Transfer
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Sender account validation
    if (!accountId) {
      const message =
        "Please select a sender account.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    // Receiver account validation
    const receiverNumber =
      receiverAccountNumber.trim();

    if (!receiverNumber) {
      const message =
        "Please enter the receiver account number.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    // Prevent self-transfer
    if (
      selectedAccount &&
      selectedAccount.accountNumber === receiverNumber
    ) {
      const message =
        "Sender and receiver account cannot be the same.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    // Amount validation
    const transferAmount = Number(amount);

    if (
      !amount ||
      Number.isNaN(transferAmount) ||
      transferAmount <= 0
    ) {
      const message =
        "Please enter a valid transfer amount.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    // Maximum amount validation
    if (transferAmount > 10000000) {
      const message =
        "Transfer amount cannot exceed ₹1,00,00,000.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    // Balance validation
    if (
      selectedAccount &&
      transferAmount >
        Number(selectedAccount.balance || 0)
    ) {
      const message =
        "Transfer amount cannot exceed your available balance.";

      setError(message);
      showNotification(message, "warning");

      return;
    }

    try {
      setLoading(true);

      await transferMoney(
        Number(accountId),
        receiverNumber,
        transferAmount
      );

      // Clear form
      setReceiverAccountNumber("");
      setAmount("");

      // Refresh account balances
      await loadAccounts();

      // Success notification
      showNotification(
        `₹${transferAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} transferred successfully.`,
        "success"
      );
    } catch (error) {
      console.error("Transfer error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Transfer failed.";

      setError(message);

      showNotification(message, "error");
    } finally {
      setLoading(false);
    }
  };

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
            Transfer Money
          </h1>

          <p className="mt-2 text-gray-500">
            Transfer money securely to another bank account.
          </p>
        </div>

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
            onClick={() => loadAccounts(true)}
            disabled={refreshing}
            className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Retry
          </button>

        </div>
      )}

      {/* ==========================================
          Main Card
      ========================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">

        {/* Card Header */}

        <div className="mb-8 flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0F3D56]">
            <ArrowLeftRight size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Make a Transfer
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select your account and enter the receiver details.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==========================================
              Sender Account
          ========================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              From Account
            </label>

            {accountsLoading ? (

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">

                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#0F3D56]" />

                Loading accounts...

              </div>

            ) : accounts.length === 0 ? (

              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

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

          {/* ==========================================
              Available Balance
          ========================================== */}

          {selectedAccount && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Available Balance
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900">
                    ₹
                    {Number(
                      selectedAccount.balance || 0
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#0F3D56]">
                  <WalletCards size={20} />
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              Receiver Account
          ========================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Receiver Account Number
            </label>

            <input
              type="text"
              value={receiverAccountNumber}
              onChange={(e) => {
                setReceiverAccountNumber(
                  e.target.value
                );
                setError("");
              }}
              placeholder="Enter receiver account number"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#0F3D56] focus:ring-2 focus:ring-[#0F3D56]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

            <p className="mt-2 text-xs text-gray-400">
              Enter the account number of the person receiving the money.
            </p>

          </div>

          {/* ==========================================
              Transfer Amount
          ========================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Transfer Amount
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
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                placeholder="Enter transfer amount"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#0F3D56] focus:ring-2 focus:ring-[#0F3D56]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            <p className="mt-2 text-xs text-gray-400">
              Transfer amount cannot exceed your available balance.
            </p>

          </div>

          {/* ==========================================
              Submit
          ========================================== */}

          <button
            type="submit"
            disabled={
              loading ||
              accountsLoading ||
              refreshing ||
              accounts.length === 0 ||
              !receiverAccountNumber.trim() ||
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
                <Send size={19} />

                Transfer Money
              </>
            )}

          </button>

        </form>

      </div>

      {/* ==========================================
          Transfer Information
      ========================================== */}

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

        <div className="flex gap-3">

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-[#0F3D56]"
          />

          <div>

            <h3 className="text-sm font-semibold text-[#0F3D56]">
              Transfer Information
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Transfers are processed securely. Make sure the
              receiver account number is correct before submitting
              the transaction. You cannot transfer money to your
              own account.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Transfer;