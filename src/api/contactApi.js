import { apiClient } from "./client";

export const submitContactRequest = async (payload) => {
  const { data } = await apiClient.post("/contact", payload);
  return data;
};

export const getAdminContactMessagesRequest = async () => {
  const { data } = await apiClient.get("/contact/admin");
  return data;
};

export const updateAdminContactMessageRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/contact/admin/${id}`, payload);
  return data;
};

export const deleteAdminContactMessageRequest = async (id) => {
  await apiClient.delete(`/contact/admin/${id}`);
};
