import { apiClient } from "./client";

export const getPublicProfileRequest = async () => {
  const { data } = await apiClient.get("/profile/public");
  return data;
};

export const getMyProfileRequest = async () => {
  const { data } = await apiClient.get("/profile/me");
  return data;
};

export const updateMyProfileRequest = async (payload) => {
  const { data } = await apiClient.put("/profile/me", payload);
  return data;
};

