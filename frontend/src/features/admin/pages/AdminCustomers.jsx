  import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Eye,
  RefreshCw,
  X,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { getCustomers } from "../api/adminApi";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load customers:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin permission is required.");
      } else {
        setError("Failed to load customers.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = customer.user?.name || "";
      const email = customer.user?.email || "";
      const phone = customer.phone || "";
      const address = customer.address || "";
      const kycStatus = customer.kycStatus || "";

      return (
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        phone.toLowerCase().includes(searchValue) ||
        address.toLowerCase().includes(searchValue) ||
        kycStatus.toLowerCase().includes(searchValue) ||
        String(customer.id).includes(searchValue)
      );
    });
  }, [customers, search]);

  // KYC status styling
  const getKycStyle = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17202A]">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and view all banking customers
          </p>
        </div>

        <button
          onClick={loadCustomers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Customers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#17202A]">
                {customers.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Users size={21} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Verified KYC */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Verified KYC
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#17202A]">
                {
                  customers.filter(
                    (customer) => customer.kycStatus === "VERIFIED"
                  ).length
                }
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <ShieldCheck size={21} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending KYC */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending KYC
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#17202A]">
                {
                  customers.filter(
                    (customer) => customer.kycStatus === "PENDING"
                  ).length
                }
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50">
              <ShieldCheck size={21} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, address or KYC status..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Customer Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Address
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  KYC Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Users
                        size={36}
                        className="mb-3 text-gray-300"
                      />

                      <p className="text-sm font-medium text-gray-600">
                        No customers found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try changing your search.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-700">
                        #{customer.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                          {customer.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {customer.user?.name || "N/A"}
                          </p>

                          <p className="text-xs text-gray-400">
                            User ID: {customer.user?.id || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {customer.user?.email || "N/A"}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {customer.phone || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-5 py-4">
                      <div className="flex max-w-[220px] items-start gap-2 text-sm text-gray-600">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <span className="truncate">
                          {customer.address || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* KYC */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getKycStyle(
                          customer.kycStatus
                        )}`}
                      >
                        {customer.kycStatus || "PENDING"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          setSelectedCustomer(customer)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filteredCustomers.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredCustomers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {customers.length}
              </span>{" "}
              customers
            </p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#17202A]">
                  Customer Details
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Customer ID #{selectedCustomer.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  {selectedCustomer.user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedCustomer.user?.name || "N/A"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    User ID: {selectedCustomer.user?.id || "N/A"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                    {selectedCustomer.user?.email || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {selectedCustomer.phone || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                  <p className="text-xs font-medium text-gray-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {selectedCustomer.address || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-400">
                    KYC Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getKycStyle(
                      selectedCustomer.kycStatus
                    )}`}
                  >
                    {selectedCustomer.kycStatus || "PENDING"}
                  </span>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-400">
                    User Role
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {selectedCustomer.user?.role || "CUSTOMER"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-6 py-4 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-xl bg-[#17202A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;