import axiosInstance from "../../api/axiosInstance";

export const getMyProfile = async () => {
  const response = await axiosInstance.get(
    "/api/customers/me"
  );

  return response.data;
};

export const updateMyProfile = async (
  customerId,
  profileData
) => {
  const response = await axiosInstance.put(
    `/api/customers/${customerId}`,
    profileData
  );

  return response.data;
};