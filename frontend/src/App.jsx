 import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";

// Customer
import Dashboard from "./features/dashboard/Dashboard";
import Accounts from "./features/accounts/pages/Accounts";
import Deposit from "./features/deposit/pages/Deposit";
import Withdrawal from "./features/withdrawal/pages/Withdrawal";
import Transfer from "./features/transfer/pages/Transfer";
import Transactions from "./features/transactions/pages/Transactions";
import Beneficiaries from "./features/beneficiaries/pages/Beneficiaries";
import Profile from "./features/profile/Profile";
import Settings from "./features/settings/Settings";
import MainLayout from "./components/layout/MainLayout";

// Admin
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminCustomers from "./features/admin/pages/AdminCustomers";
import AdminAccounts from "./features/admin/pages/AdminAccounts";
import AdminKyc from "./features/admin/pages/AdminKyc";
import AdminTransactions from "./features/admin/pages/AdminTransactions";
import AdminAuditLogs from "./features/admin/pages/AdminAuditLogs";
import AdminUsers from "./features/admin/pages/AdminUsers";

import AdminProtectedRoute from "./features/admin/components/AdminProtectedRoute";
import AdminLayout from "./features/admin/components/AdminLayout";
import { NotificationProvider } from "./components/common/NotificationProvider";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
 <NotificationProvider>
      <BrowserRouter>
        <Routes>

        {/* ============================== */}
        {/* Login */}
        {/* ============================== */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* ============================== */}
        {/* CUSTOMER ROUTES */}
        {/* ============================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Accounts />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Deposit />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Withdrawal />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transfer />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transactions />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/beneficiaries"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Beneficiaries />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ============================== */}
        {/* ADMIN ROUTES */}
        {/* ============================== */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >

          {/* Default Admin Page */}
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          {/* Customers */}
          <Route
            path="customers"
            element={<AdminCustomers />}
          />

          {/* Accounts */}
          <Route
            path="accounts"
            element={<AdminAccounts />}
          />

          {/* KYC */}
          <Route
            path="kyc"
            element={<AdminKyc />}
          />

          {/* Transactions */}
          <Route
            path="transactions"
            element={<AdminTransactions />}
          />

          {/* Users */}
          <Route
            path="users"
            element={<AdminUsers />}
          />

          {/* Audit Logs */}
          <Route
            path="audit-logs"
            element={<AdminAuditLogs />}
          />

        </Route>
    </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;