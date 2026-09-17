 import axiosInstance from "../../api/axiosInstance";

export const depositMoney = async (accountId, amount) => {
  const response = await axiosInstance.post(
    `/api/accounts/${accountId}/deposit`,
    {
      amount,
    }
  );

  return response.data;
};