import { apiClient } from "./client";

export const getPublicProjectsRequest = async () => {
  const { data } = await apiClient.get("/projects/public");
  return data;
};

export const getMyProjectsRequest = async () => {
  const { data } = await apiClient.get("/projects/me");
  return data;
};

export const createProjectRequest = async (payload) => {
  const { data } = await apiClient.post("/projects", payload);
  return data;
};

export const updateProjectRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/projects/${id}`, payload);
  return data;
};

export const deleteProjectRequest = async (id) => {
  await apiClient.delete(`/projects/${id}`);
};

