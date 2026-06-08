import { apiClient } from "./client";

export const getMediaCenterRequest = async () => {
  const { data } = await apiClient.get("/media");
  return data;
};

export const upsertMediaCenterRequest = async (payload) => {
  const { data } = await apiClient.put("/media", payload);
  return data;
};
