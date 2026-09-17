import axiosInstance from "../../api/axiosInstance";

export const transferMoney = async (
  senderAccountId,
  receiverAccountNumber,
  amount
) => {
  const response = await axiosInstance.post(
    `/api/accounts/${senderAccountId}/transfer`,
    {
      receiverAccountNumber,
      amount,
    }
  );

  return response.data;
};