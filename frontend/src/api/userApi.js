import axiosInstance from "./axiosInstance";

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/api/users/me");
  return response.data;
};