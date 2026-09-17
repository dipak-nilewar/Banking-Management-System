import axiosInstance from "../../api/axiosInstance";

export const getMyAccounts = async () => {
  const response = await axiosInstance.get(
    "/api/accounts/my-accounts"
  );

  return response.data;
};

export const getAccountTransactions = async (accountId) => {
  const response = await axiosInstance.get(
    `/api/accounts/${accountId}/transactions`
  );

  return response.data;
};