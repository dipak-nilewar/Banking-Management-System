import axiosInstance from "../../api/axiosInstance";

export const withdrawMoney = async (accountId, amount) => {
  const response = await axiosInstance.post(
    `/api/accounts/${accountId}/withdraw`,
    {
      amount,
    }
  );

  return response.data;
};