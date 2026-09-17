 import axiosInstance from "../../api/axiosInstance";

export const getBeneficiaries = async () => {
  const response = await axiosInstance.get(
    "/api/beneficiaries"
  );

  return response.data;
};

export const addBeneficiary = async (beneficiaryData) => {
  const response = await axiosInstance.post(
    "/api/beneficiaries",
    beneficiaryData
  );

  return response.data;
};

export const deleteBeneficiary = async (id) => {
  const response = await axiosInstance.delete(
    `/api/beneficiaries/${id}`
  );

  return response.data;
};

export const transferToBeneficiary = async (
  beneficiaryId,
  senderAccountId,
  amount
) => {
  const response = await axiosInstance.post(
    `/api/beneficiaries/${beneficiaryId}/transfer`,
    null,
    {
      params: {
        senderAccountId,
        amount,
      },
    }
  );

  return response.data;
};