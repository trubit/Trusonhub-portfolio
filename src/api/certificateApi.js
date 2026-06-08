import { apiClient } from "./client";

export const getCertificatesRequest = async () => {
  const { data } = await apiClient.get("/certificates");
  return data;
};

export const createCertificateRequest = async (payload) => {
  const { data } = await apiClient.post("/certificates", payload);
  return data;
};

export const updateCertificateRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/certificates/${id}`, payload);
  return data;
};

export const deleteCertificateRequest = async (id) => {
  await apiClient.delete(`/certificates/${id}`);
};
