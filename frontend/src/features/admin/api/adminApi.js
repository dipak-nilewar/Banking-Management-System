 import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==============================
// Users
// ==============================

export const getUsers = async () => {
  const response = await adminApi.get("/api/users");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await adminApi.post("/api/users", userData);
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  const response = await adminApi.put(
    `/api/users/${userId}/status?status=${status}`
  );

  return response.data;
};

// ==============================
// Accounts
// ==============================

export const getAccounts = async () => {
  const response = await adminApi.get("/api/accounts");
  return response.data;
};

export const updateAccountStatus = async (accountId, status) => {
  const response = await adminApi.put(
    `/api/accounts/${accountId}/status?status=${status}`
  );

  return response.data;
};

// ==============================
// Transactions
// ==============================

export const getTransactions = async () => {
  const response = await adminApi.get("/api/accounts/transactions");
  return response.data;
};

// ==============================
// Customers
// ==============================

export const getCustomers = async () => {
  const response = await adminApi.get("/api/customers");
  return response.data;
};

// ==============================
// KYC
// ==============================

export const updateKycStatus = async (customerId, status) => {
  const response = await adminApi.put(
    `/api/customers/${customerId}/kyc?status=${status}`
  );

  return response.data;
};

// ==============================
// Audit Logs
// ==============================

export const getAuditLogs = async () => {
  const response = await adminApi.get("/api/audit-logs");
  return response.data;
};

export default adminApi;