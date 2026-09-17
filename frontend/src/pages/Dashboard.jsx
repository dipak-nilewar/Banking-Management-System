 import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function Dashboard() {

 const [accounts, setAccounts] = useState([]);
const [transactionCount, setTransactionCount] = useState(0);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [depositAccount, setDepositAccount] = useState(null);
const [depositAmount, setDepositAmount] = useState("");

const [withdrawAccount, setWithdrawAccount] = useState(null);
const [withdrawAmount, setWithdrawAmount] = useState("");
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/accounts/my-accounts"
    );

    console.log("My Accounts:", response.data);

    const myAccounts = response.data;

    setAccounts(myAccounts);

    let totalTransactions = 0;

    for (const account of myAccounts) {

      try {
        const transactionResponse =
          await axiosInstance.get(
            `/api/accounts/${account.id}/transactions`
          );

        totalTransactions += transactionResponse.data.length;

      } catch (error) {

        console.error(
          `Failed to load transactions for account ${account.id}`,
          error
        );
      }
    }

    setTransactionCount(totalTransactions);

  } catch (error) {

    console.error(error);

    setError(
      error.response?.data?.error ||
      "Failed to load accounts"
    );

  } finally {

    setLoading(false);

  }
};

const handleDeposit = async () => {

  if (!depositAmount || Number(depositAmount) <= 0) {
    setError("Please enter a valid amount");
    return;
  }

  try {

    await axiosInstance.post(
      `/api/accounts/${depositAccount.id}/deposit`,
      {
        amount: Number(depositAmount)
      }
    );

    setDepositAccount(null);
    setDepositAmount("");
    setError("");

    // Refresh accounts and balances
    fetchAccounts();

  } catch (error) {

    console.error(error);

    setError(
      error.response?.data?.error ||
      "Deposit failed"
    );
  }
};

const handleWithdraw = async () => {

  if (!withdrawAmount || Number(withdrawAmount) <= 0) {
    setError("Please enter a valid amount");
    return;
  }

  try {

    await axiosInstance.post(
      `/api/accounts/${withdrawAccount.id}/withdraw`,
      {
        amount: Number(withdrawAmount)
      }
    );

    setWithdrawAccount(null);
    setWithdrawAmount("");
    setError("");

    // Refresh accounts and balances
    fetchAccounts();

  } catch (error) {

    console.error(error);

    setError(
      error.response?.data?.error ||
      "Withdrawal failed"
    );
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Banking System
        </h1>

        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>

      {/* Main */}
      <main className="p-6">

        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="text-gray-500 mt-2">
  Welcome, {accounts.length > 0
    ? accounts[0].customer.user.name
    : "Customer"}
</p>
        {/* Error */}
        {error && (
          <p className="text-red-600 mt-4">
            {error} 
            
          </p>
        )}

{loading && (
  <p className="text-blue-600 mt-6">
    Loading your accounts...
  </p>
)}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* Accounts */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Accounts
            </h3>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {accounts.length}
            </p>
          </div>

          {/* Balance */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Balance
            </h3>

            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹
              {accounts
                .reduce(
                  (total, account) =>
                    total + account.balance,
                  0
                )
                .toFixed(2)}
            </p>
          </div>

          {/* Transactions */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Transactions
            </h3>

            <p className="text-3xl font-bold text-purple-600 mt-2">
  {transactionCount}
</p>
          </div>

        </div>

        {/* Account List */}
        <div className="mt-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Accounts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {accounts.map((account) => (

              <div
                key={account.id}
                className="bg-white p-6 rounded-xl shadow"
              >

                <div className="flex justify-between items-center">

                  <h3 className="font-bold text-lg">
                    {account.accountType}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      account.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {account.status}
                  </span>

                </div>

                <p className="text-gray-500 mt-4">
                  Account Number
                </p>

                <p className="font-semibold">
                  {account.accountNumber}
                </p>

                <p className="text-gray-500 mt-4">
                  Balance
                </p>

                <p className="text-2xl font-bold text-green-600">
                  ₹{account.balance.toFixed(2)}
                </p>
<div className="flex gap-3 mt-5">

 <button
  disabled={account.status !== "ACTIVE"}
  onClick={() => {
    setDepositAccount(account);
    setDepositAmount("");
  }}
  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  Deposit
</button>

  <button
  disabled={account.status !== "ACTIVE"}
  onClick={() => {
    setWithdrawAccount(account);
    setWithdrawAmount("");
  }}
  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  Withdraw
</button>

</div>

 {depositAccount?.id === account.id && (
  <div className="mt-4">

    <input
      type="number"
      min="1"
      value={depositAmount}
      onChange={(e) => setDepositAmount(e.target.value)}
      placeholder="Enter amount"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <div className="flex gap-3 mt-3">

      <button
        onClick={handleDeposit}
        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
      >
        Confirm Deposit
      </button>

      <button
        onClick={() => {
          setDepositAccount(null);
          setDepositAmount("");
        }}
        className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
      >
        Cancel
      </button>

    </div>

  </div>
)}

{withdrawAccount?.id === account.id && (
  <div className="mt-4">

    <input
      type="number"
      min="1"
      value={withdrawAmount}
      onChange={(e) => setWithdrawAmount(e.target.value)}
      placeholder="Enter amount"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
    />

    <div className="flex gap-3 mt-3">

      <button
        onClick={handleWithdraw}
        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
      >
        Confirm Withdrawal
      </button>

      <button
        onClick={() => {
          setWithdrawAccount(null);
          setWithdrawAmount("");
        }}
        className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
      >
        Cancel
      </button>

    </div>

  </div>
)}

              </div>
              

            ))}

            

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;