import axiosInstance from "../../api/axiosInstance";

export const getMyAccounts = async () => {
  const response = await axiosInstance.get(
    "/api/accounts/my-accounts"
  );

  return response.data;
};