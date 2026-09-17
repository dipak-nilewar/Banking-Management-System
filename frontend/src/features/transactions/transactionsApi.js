import axiosInstance from "../../api/axiosInstance";

export const getAccountTransactions = async (accountId) => {
  const response = await axiosInstance.get(
    `/api/accounts/${accountId}/transactions`
  );

  return response.data;
};
