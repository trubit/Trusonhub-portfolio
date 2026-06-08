import { apiClient } from "./client";

export const loginRequest = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const registerRequest = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const meRequest = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

export const updateMeRequest = async (payload) => {
  const { data } = await apiClient.patch("/auth/me", payload);
  return data;
};
