 import { useEffect, useState } from "react";

import {
  Users,
  UserPlus,
  Trash2,
  Send,
  CreditCard,
  AlertCircle,
  X,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  WalletCards,
} from "lucide-react";

import {
  getBeneficiaries,
  addBeneficiary,
  deleteBeneficiary,
  transferToBeneficiary,
} from "../beneficiariesApi";

import { getMyAccounts } from "../../accounts/accountsApi";

import ConfirmModal from "../../../components/common/ConfirmModal";
import { useNotification } from "../../../components/common/NotificationProvider";

function Beneficiaries() {
  const { showNotification } = useNotification();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);

  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState(null);

  const [beneficiaryToDelete, setBeneficiaryToDelete] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [senderAccountId, setSenderAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [beneficiaryData, accountData] =
        await Promise.all([
          getBeneficiaries(),
          getMyAccounts(),
        ]);

      const safeBeneficiaries = Array.isArray(
        beneficiaryData
      )
        ? beneficiaryData
        : [];

      const safeAccounts = Array.isArray(accountData)
        ? accountData
        : [];

      const activeAccounts = safeAccounts.filter(
        (account) => account.status === "ACTIVE"
      );

      setBeneficiaries(safeBeneficiaries);
      setAccounts(activeAccounts);

      if (activeAccounts.length > 0) {
        const currentAccountExists = activeAccounts.some(
          (account) =>
            String(account.id) ===
            String(senderAccountId)
        );

        if (!currentAccountExists) {
          setSenderAccountId(
            String(activeAccounts[0].id)
          );
        }
      } else {
        setSenderAccountId("");
      }

      if (isRefresh) {
        showNotification(
          "Beneficiary information is up to date.",
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Beneficiary loading error:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to load beneficiary information.",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetAddForm = () => {
    setName("");
    setAccountNumber("");
    setShowAddForm(false);
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedAccountNumber =
      accountNumber.trim();

    if (!trimmedName) {
      showNotification(
        "Please enter the beneficiary name.",
        "warning"
      );
      return;
    }

    if (trimmedName.length < 2) {
      showNotification(
        "Beneficiary name must contain at least 2 characters.",
        "warning"
      );
      return;
    }

    if (!trimmedAccountNumber) {
      showNotification(
        "Please enter the beneficiary account number.",
        "warning"
      );
      return;
    }

    if (!/^[0-9]+$/.test(trimmedAccountNumber)) {
      showNotification(
        "Account number should contain only numbers.",
        "warning"
      );
      return;
    }

    try {
      setSubmitting(true);

      await addBeneficiary({
        name: trimmedName,
        accountNumber: trimmedAccountNumber,
      });

      resetAddForm();

      showNotification(
        "Beneficiary has been added successfully.",
        "success"
      );

      await loadData();
    } catch (error) {
      console.error(
        "Add beneficiary error:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to add beneficiary.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (beneficiary) => {
    setBeneficiaryToDelete(beneficiary);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!beneficiaryToDelete) {
      return;
    }

    try {
      setSubmitting(true);

      await deleteBeneficiary(
        beneficiaryToDelete.id
      );

      showNotification(
        "Beneficiary has been deleted successfully.",
        "success"
      );

      setShowDeleteModal(false);
      setBeneficiaryToDelete(null);

      await loadData();
    } catch (error) {
      console.error(
        "Delete beneficiary error:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to delete beneficiary.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openTransferForm = (beneficiary) => {
    if (accounts.length === 0) {
      showNotification(
        "No active account is available for transfer.",
        "warning"
      );
      return;
    }

    setSelectedBeneficiary(beneficiary);
    setAmount("");

    const currentAccountExists = accounts.some(
      (account) =>
        String(account.id) ===
        String(senderAccountId)
    );

    if (!currentAccountExists) {
      setSenderAccountId(
        String(accounts[0].id)
      );
    }

    setShowTransferForm(true);
  };

  const closeTransferForm = () => {
    if (submitting) {
      return;
    }

    setShowTransferForm(false);
    setSelectedBeneficiary(null);
    setAmount("");
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!selectedBeneficiary) {
      showNotification(
        "Please select a beneficiary.",
        "warning"
      );
      return;
    }

    if (!senderAccountId) {
      showNotification(
        "Please select a sender account.",
        "warning"
      );
      return;
    }

    const transferAmount = Number(amount);

    if (!amount || !Number.isFinite(transferAmount)) {
      showNotification(
        "Please enter a valid transfer amount.",
        "warning"
      );
      return;
    }

    if (transferAmount <= 0) {
      showNotification(
        "Transfer amount must be greater than zero.",
        "warning"
      );
      return;
    }

    if (transferAmount > 10000000) {
      showNotification(
        "Transfer amount cannot exceed ₹1,00,00,000.",
        "warning"
      );
      return;
    }

    const selectedAccount = accounts.find(
      (account) =>
        String(account.id) ===
        String(senderAccountId)
    );

    if (!selectedAccount) {
      showNotification(
        "Selected sender account could not be found.",
        "error"
      );
      return;
    }

    const availableBalance = Number(
      selectedAccount.balance || 0
    );

    if (transferAmount > availableBalance) {
      showNotification(
        "Transfer amount cannot exceed your available balance.",
        "warning"
      );
      return;
    }

    try {
      setSubmitting(true);

      await transferToBeneficiary(
        selectedBeneficiary.id,
        senderAccountId,
        transferAmount
      );

      showNotification(
        `₹${transferAmount.toLocaleString(
          "en-IN"
        )} transferred successfully to ${selectedBeneficiary.name}.`,
        "success"
      );

      setAmount("");
      setShowTransferForm(false);
      setSelectedBeneficiary(null);

      await loadData();
    } catch (error) {
      console.error(
        "Beneficiary transfer error:",
        error
      );

      showNotification(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to complete the transfer.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatBalance = (balance) => {
    return Number(balance || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) {
      return "••••";
    }

    const value = String(accountNumber);

    if (value.length <= 4) {
      return `•••• ${value}`;
    }

    return `•••• ${value.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-80 bg-gray-100 rounded mt-3 animate-pulse" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">

          <div className="flex flex-col items-center justify-center">

            <RefreshCw
              size={30}
              className="animate-spin text-[#0F3D56]"
            />

            <p className="text-sm text-gray-500 mt-4">
              Loading your beneficiaries...
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-2xl lg:text-3xl font-bold text-[#17202A]">
            Beneficiaries
          </h1>

          <p className="text-gray-500 mt-1.5">
            Manage saved accounts and make secure transfers.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <button
            onClick={() => {
              setShowAddForm(true);
              setName("");
              setAccountNumber("");
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#0F3D56] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0B3044] transition"
          >
            <UserPlus size={18} />
            Add Beneficiary
          </button>

        </div>

      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users
                size={21}
                className="text-[#0F3D56]"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Saved Beneficiaries
              </p>

              <p className="text-xl font-bold text-[#17202A] mt-0.5">
                {beneficiaries.length}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
              <WalletCards
                size={21}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Active Accounts
              </p>

              <p className="text-xl font-bold text-[#17202A] mt-0.5">
                {accounts.length}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Add Beneficiary */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-start justify-between gap-4 mb-6">

            <div>

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <UserPlus
                    size={18}
                    className="text-[#0F3D56]"
                  />
                </div>

                <h2 className="text-lg font-semibold text-[#17202A]">
                  Add Beneficiary
                </h2>

              </div>

              <p className="text-sm text-gray-500 mt-2">
                Save an account for faster future transfers.
              </p>

            </div>

            <button
              onClick={resetAddForm}
              disabled={submitting}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <X size={19} />
            </button>

          </div>

          <form
            onSubmit={handleAddBeneficiary}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter full name"
                disabled={submitting}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0F3D56] focus:border-transparent disabled:bg-gray-50"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="Enter account number"
                disabled={submitting}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0F3D56] focus:border-transparent disabled:bg-gray-50"
              />

            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3">

              <button
                type="button"
                onClick={resetAddForm}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F3D56] text-white text-sm font-medium hover:bg-[#0B3044] transition disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Save Beneficiary
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* No Beneficiaries */}
      {beneficiaries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center">
            <Users
              size={30}
              className="text-gray-400"
            />
          </div>

          <h2 className="text-lg font-semibold text-[#17202A] mt-5">
            No Beneficiaries Yet
          </h2>

          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Add a trusted account to make future transfers
            faster and easier.
          </p>

          <button
            onClick={() => setShowAddForm(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F3D56] text-white text-sm font-medium hover:bg-[#0B3044] transition"
          >
            <UserPlus size={17} />
            Add Beneficiary
          </button>

        </div>
      ) : (
        <>
          {/* Section Header */}
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-[#17202A]">
                Saved Beneficiaries
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {beneficiaries.length} saved account
                {beneficiaries.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

          </div>

          {/* Beneficiary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4 min-w-0">

                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F3D56] flex items-center justify-center shrink-0">
                      <Users size={22} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-[#17202A] truncate">
                        {beneficiary.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1.5">

                        <CreditCard
                          size={14}
                          className="text-gray-400"
                        />

                        <p className="text-sm text-gray-500">
                          {maskAccountNumber(
                            beneficiary.accountNumber
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      openDeleteModal(
                        beneficiary
                      )
                    }
                    disabled={submitting}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                    title="Delete beneficiary"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">

                  <button
                    onClick={() =>
                      openTransferForm(
                        beneficiary
                      )
                    }
                    disabled={accounts.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0F3D56] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#0B3044] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send size={17} />
                    Transfer Money
                    <ArrowRight size={16} />
                  </button>

                  {accounts.length === 0 && (
                    <p className="flex items-center justify-center gap-1.5 text-xs text-amber-600 mt-3">
                      <AlertCircle size={14} />
                      No active account available
                    </p>
                  )}

                </div>

              </div>
            ))}

          </div>
        </>
      )}

      {/* Transfer Modal */}
      {showTransferForm && selectedBeneficiary && (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold text-[#17202A]">
                  Transfer Money
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Send money securely to your beneficiary.
                </p>

              </div>

              <button
                onClick={closeTransferForm}
                disabled={submitting}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleTransfer}
              className="p-6 space-y-5"
            >

              {/* Beneficiary */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <Users
                      size={19}
                      className="text-[#0F3D56]"
                    />
                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Beneficiary
                    </p>

                    <p className="text-sm font-semibold text-[#17202A] mt-0.5">
                      {selectedBeneficiary.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {maskAccountNumber(
                        selectedBeneficiary.accountNumber
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* From Account */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Account
                </label>

                <select
                  value={senderAccountId}
                  onChange={(e) =>
                    setSenderAccountId(
                      e.target.value
                    )
                  }
                  disabled={submitting}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0F3D56] focus:border-transparent disabled:bg-gray-50"
                >

                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.accountType} •{" "}
                      {maskAccountNumber(
                        account.accountNumber
                      )}{" "}
                      • ₹
                      {formatBalance(
                        account.balance
                      )}
                    </option>
                  ))}

                </select>

              </div>

              {/* Amount */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Amount
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    placeholder="0.00"
                    disabled={submitting}
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0F3D56] focus:border-transparent disabled:bg-gray-50"
                  />

                </div>

              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-100 p-3">

                <ShieldCheck
                  size={18}
                  className="text-blue-600 mt-0.5 shrink-0"
                />

                <p className="text-xs leading-5 text-blue-700">
                  Please verify the beneficiary and
                  transfer amount before submitting.
                </p>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">

                <button
                  type="button"
                  onClick={closeTransferForm}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0F3D56] text-white text-sm font-medium hover:bg-[#0B3044] transition disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Transfer
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Beneficiary?"
        message={
          beneficiaryToDelete
            ? `Are you sure you want to remove ${beneficiaryToDelete.name} from your saved beneficiaries?`
            : "Are you sure you want to delete this beneficiary?"
        }
        confirmText="Delete Beneficiary"
        cancelText="Cancel"
        type="danger"
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!submitting) {
            setShowDeleteModal(false);
            setBeneficiaryToDelete(null);
          }
        }}
      />

    </div>
  );
}

export default Beneficiaries;