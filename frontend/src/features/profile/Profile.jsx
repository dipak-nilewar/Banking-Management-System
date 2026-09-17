 import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  X,
  Save,
  RefreshCw,
  CheckCircle,
  Clock3,
  AlertCircle,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
} from "./profileApi";

import { useNotification } from "../../components/common/NotificationProvider";

function Profile() {
  const { showNotification } = useNotification();

  const [profile, setProfile] = useState(null);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async (showRefreshNotification = false) => {
    try {
      if (showRefreshNotification) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getMyProfile();

      setProfile(data);
      setPhone(data?.phone || "");
      setAddress(data?.address || "");

      if (showRefreshNotification) {
        showNotification(
          "Profile information refreshed successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error("Profile loading error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load your profile.";

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const validateForm = () => {
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedPhone) {
      showNotification("Phone number is required.", "warning");
      return false;
    }

    if (!/^[0-9+\-\s()]{10,15}$/.test(trimmedPhone)) {
      showNotification(
        "Please enter a valid phone number.",
        "warning"
      );
      return false;
    }

    if (!trimmedAddress) {
      showNotification("Address is required.", "warning");
      return false;
    }

    if (trimmedAddress.length < 5) {
      showNotification(
        "Address must contain at least 5 characters.",
        "warning"
      );
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updatedProfile = await updateMyProfile(
        profile.id,
        {
          phone: phone.trim(),
          address: address.trim(),
        }
      );

      setProfile(updatedProfile);
      setPhone(updatedProfile?.phone || "");
      setAddress(updatedProfile?.address || "");

      setEditing(false);

      showNotification(
        "Your profile has been updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Profile update error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to update your profile.";

      showNotification(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setPhone(profile?.phone || "");
    setAddress(profile?.address || "");
    setEditing(true);
  };

  const handleCancel = () => {
    setPhone(profile?.phone || "");
    setAddress(profile?.address || "");
    setEditing(false);
  };

  const getKycConfig = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "KYC Approved",
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle,
        };

      case "PENDING":
        return {
          label: "KYC Pending",
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: Clock3,
        };

      case "REJECTED":
        return {
          label: "KYC Rejected",
          bg: "bg-red-100",
          text: "text-red-700",
          icon: AlertCircle,
        };

      default:
        return {
          label: "KYC Not Verified",
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: ShieldCheck,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            size={28}
            className="animate-spin text-[#0F3D56]"
          />

          <p className="text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <AlertCircle
            size={42}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We could not retrieve your profile information.
          </p>

          <button
            onClick={() => loadProfile()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F3D56] text-white text-sm font-medium hover:bg-[#0b3043] transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = profile.user;

  const kyc = getKycConfig(profile.kycStatus);

  const KycIcon = kyc.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">
            My Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your personal information and account details
          </p>
        </div>

        <button
          onClick={() => loadProfile(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="bg-[#0F3D56] px-6 py-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <UserCircle
                size={52}
                className="text-white"
              />
            </div>

            {/* User Details */}
            <div className="flex-1">

              <h2 className="text-2xl font-semibold text-white">
                {user?.name || "Customer"}
              </h2>

              <p className="text-white/70 mt-1">
                Customer ID: #{profile.id}
              </p>

              {user?.email && (
                <p className="text-white/60 text-sm mt-1">
                  {user.email}
                </p>
              )}
            </div>

            {/* KYC */}
            <div>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${kyc.bg} ${kyc.text}`}
              >
                <KycIcon size={16} />
                {kyc.label}
              </span>
            </div>

          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>
              <h3 className="text-lg font-semibold text-[#17202A]">
                Personal Information
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your registered account information
              </p>
            </div>

            {!editing && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F3D56] text-white text-sm font-medium hover:bg-[#0b3043] transition"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}

          </div>

          {/* Edit Form */}
          {editing ? (
            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0F3D56] focus:border-transparent transition"
                    placeholder="Enter phone number"
                    disabled={saving}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0F3D56] focus:border-transparent transition resize-none"
                    placeholder="Enter your address"
                    disabled={saving}
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F3D56] text-white text-sm font-medium hover:bg-[#0b3043] transition disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">

                <div className="flex items-start gap-3">

                  <UserCircle
                    className="text-[#0F3D56] shrink-0"
                    size={20}
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Full Name
                    </p>

                    <p className="font-medium text-[#17202A] mt-1 break-words">
                      {user?.name || "—"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">

                <div className="flex items-start gap-3">

                  <Mail
                    className="text-[#0F3D56] shrink-0"
                    size={20}
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Email Address
                    </p>

                    <p className="font-medium text-[#17202A] mt-1 break-words">
                      {user?.email || "—"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">

                <div className="flex items-start gap-3">

                  <Phone
                    className="text-[#0F3D56] shrink-0"
                    size={20}
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Phone Number
                    </p>

                    <p className="font-medium text-[#17202A] mt-1">
                      {profile.phone || "—"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Address */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">

                <div className="flex items-start gap-3">

                  <MapPin
                    className="text-[#0F3D56] shrink-0"
                    size={20}
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Address
                    </p>

                    <p className="font-medium text-[#17202A] mt-1 break-words">
                      {profile.address || "—"}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-[#17202A]">
            Account Information
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Overview of your banking account status
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Customer ID */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">

            <p className="text-xs text-gray-500">
              Customer ID
            </p>

            <p className="font-semibold text-[#17202A] mt-1">
              #{profile.id}
            </p>

          </div>

          {/* Role */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">

            <p className="text-xs text-gray-500">
              Account Role
            </p>

            <p className="font-semibold text-[#17202A] mt-1">
              {user?.role || "CUSTOMER"}
            </p>

          </div>

          {/* KYC */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">

            <p className="text-xs text-gray-500">
              KYC Status
            </p>

            <div className="flex items-center gap-2 mt-1">

              <KycIcon
                size={17}
                className={kyc.text}
              />

              <p className="font-semibold text-[#17202A]">
                {profile.kycStatus || "NOT VERIFIED"}
              </p>

            </div>

          </div>

        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

        <div className="flex items-start gap-3">

          <ShieldCheck
            size={21}
            className="text-blue-600 mt-0.5 shrink-0"
          />

          <div>
            <h4 className="text-sm font-semibold text-blue-900">
              Your account information is protected
            </h4>

            <p className="text-sm text-blue-700 mt-1 leading-6">
              For security reasons, sensitive account information
              cannot be changed directly from this page. Contact
              your bank administrator if you need assistance.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;