 import { useState } from "react";

import {
  Bell,
  ShieldCheck,
  LockKeyhole,
  Mail,
  Smartphone,
  Moon,
  Globe,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import ConfirmModal from "../../components/common/ConfirmModal";
import { useNotification } from "../../components/common/NotificationProvider";

function Settings() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [transactionAlerts, setTransactionAlerts] =
    useState(true);

  const [loginAlerts, setLoginAlerts] =
    useState(true);

  const [emailNotifications, setEmailNotifications] =
    useState(false);

  const [logoutModalOpen, setLogoutModalOpen] =
    useState(false);

  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setLogoutModalOpen(false);

    showNotification(
      "You have been logged out successfully.",
      "success"
    );

    navigate("/", { replace: true });
  };

  // ==========================================
  // Notification Toggle
  // ==========================================

  const handleTransactionAlerts = () => {
    const newValue = !transactionAlerts;

    setTransactionAlerts(newValue);

    showNotification(
      newValue
        ? "Transaction alerts enabled."
        : "Transaction alerts disabled.",
      "success"
    );
  };

  const handleLoginAlerts = () => {
    const newValue = !loginAlerts;

    setLoginAlerts(newValue);

    showNotification(
      newValue
        ? "Login alerts enabled."
        : "Login alerts disabled.",
      "success"
    );
  };

  const handleEmailNotifications = () => {
    const newValue = !emailNotifications;

    setEmailNotifications(newValue);

    showNotification(
      newValue
        ? "Email notifications enabled."
        : "Email notifications disabled.",
      "success"
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* ==========================================
          Header
      ========================================== */}

      <div>
        <h1 className="text-2xl font-bold text-[#17202A]">
          Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your security, notifications and application
          preferences.
        </p>
      </div>

      {/* ==========================================
          Security
      ========================================== */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <ShieldCheck
                size={21}
                className="text-[#0F3D56]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#17202A]">
                Security
              </h2>

              <p className="text-sm text-gray-500">
                Manage your account security.
              </p>
            </div>

          </div>

        </div>

        <div className="divide-y divide-gray-100">

          {/* Change Password */}

          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="flex w-full items-center justify-between p-5 text-left transition hover:bg-gray-50"
          >

            <div className="flex items-center gap-4">

              <LockKeyhole
                size={20}
                className="text-gray-500"
              />

              <div>
                <p className="font-medium text-[#17202A]">
                  Change Password
                </p>

                <p className="text-sm text-gray-500">
                  Update your account password.
                </p>
              </div>

            </div>

            <ChevronRight
              size={20}
              className="text-gray-400"
            />

          </button>

          {/* Two Factor Authentication */}

          <div className="flex items-center justify-between p-5">

            <div className="flex items-center gap-4">

              <ShieldCheck
                size={20}
                className="text-gray-500"
              />

              <div>
                <p className="font-medium text-[#17202A]">
                  Two-Factor Authentication
                </p>

                <p className="text-sm text-gray-500">
                  Additional protection for your account.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Coming Soon
            </span>

          </div>

        </div>

      </section>

      {/* ==========================================
          Notifications
      ========================================== */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Bell
                size={21}
                className="text-green-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#17202A]">
                Notifications
              </h2>

              <p className="text-sm text-gray-500">
                Choose which alerts you want to receive.
              </p>
            </div>

          </div>

        </div>

        <div className="divide-y divide-gray-100">

          {/* Transaction Alerts */}

          <div className="flex items-center justify-between gap-4 p-5">

            <div className="flex items-center gap-4">

              <Smartphone
                size={20}
                className="shrink-0 text-gray-500"
              />

              <div>
                <p className="font-medium text-[#17202A]">
                  Transaction Alerts
                </p>

                <p className="text-sm text-gray-500">
                  Receive alerts for deposits, withdrawals and
                  transfers.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleTransactionAlerts}
              aria-label="Toggle transaction alerts"
              className={`h-6 w-11 shrink-0 rounded-full transition ${
                transactionAlerts
                  ? "bg-[#0F3D56]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  transactionAlerts
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }`}
              />
            </button>

          </div>

          {/* Login Alerts */}

          <div className="flex items-center justify-between gap-4 p-5">

            <div className="flex items-center gap-4">

              <ShieldCheck
                size={20}
                className="shrink-0 text-gray-500"
              />

              <div>
                <p className="font-medium text-[#17202A]">
                  Login Alerts
                </p>

                <p className="text-sm text-gray-500">
                  Get notified when your account is accessed.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleLoginAlerts}
              aria-label="Toggle login alerts"
              className={`h-6 w-11 shrink-0 rounded-full transition ${
                loginAlerts
                  ? "bg-[#0F3D56]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  loginAlerts
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }`}
              />
            </button>

          </div>

          {/* Email Notifications */}

          <div className="flex items-center justify-between gap-4 p-5">

            <div className="flex items-center gap-4">

              <Mail
                size={20}
                className="shrink-0 text-gray-500"
              />

              <div>
                <p className="font-medium text-[#17202A]">
                  Email Notifications
                </p>

                <p className="text-sm text-gray-500">
                  Receive important banking updates by email.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleEmailNotifications}
              aria-label="Toggle email notifications"
              className={`h-6 w-11 shrink-0 rounded-full transition ${
                emailNotifications
                  ? "bg-[#0F3D56]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  emailNotifications
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }`}
              />
            </button>

          </div>

        </div>

      </section>

      {/* ==========================================
          Application Preferences
      ========================================== */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 p-6">

          <h2 className="font-semibold text-[#17202A]">
            Application Preferences
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Customize your banking experience.
          </p>

        </div>

        <div className="divide-y divide-gray-100">

          {/* Appearance */}

          <div className="flex items-center justify-between gap-4 p-5">

            <div className="flex items-center gap-4">

              <Moon
                size={20}
                className="text-gray-500"
              />

              <div>
                <p className="font-medium text-[#17202A]">
                  Appearance
                </p>

                <p className="text-sm text-gray-500">
                  Choose your application theme.
                </p>
              </div>

            </div>

            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
              Light
            </span>

          </div>

          {/* Language */}

          <div className="flex items-center justify-between gap-4 p-5">

            <div className="flex items-center gap-4">

              <Globe
                size={20}
                className="text-gray-500"
              />

              <div>
                <p className="font-medium text-[#17202A]">
                  Language
                </p>

                <p className="text-sm text-gray-500">
                  Application display language.
                </p>
              </div>

            </div>

            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
              English
            </span>

          </div>

        </div>

      </section>

      {/* ==========================================
          Account Actions
      ========================================== */}

      <section className="rounded-2xl border border-red-100 bg-white shadow-sm">

        <div className="p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <LogOut
                size={20}
                className="text-red-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#17202A]">
                Account Actions
              </h2>

              <p className="text-sm text-gray-500">
                Manage your current session.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </section>

      {/* ==========================================
          Logout Confirmation
      ========================================== */}

      <ConfirmModal
        open={logoutModalOpen}
        title="Logout from your account?"
        message="You will need to sign in again to access your banking account."
        confirmText="Logout"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />

      {/* ==========================================
          Change Password Placeholder
      ========================================== */}

      <ConfirmModal
        open={passwordModalOpen}
        title="Change Password"
        message="The change password feature will be connected to the banking backend in the next security module."
        confirmText="Okay"
        cancelText="Close"
        type="warning"
        onConfirm={() => setPasswordModalOpen(false)}
        onCancel={() => setPasswordModalOpen(false)}
      />

    </div>
  );
}

export default Settings;