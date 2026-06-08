import { apiClient } from "./client";

export const getPublicBlogPostsRequest = async () => {
  const { data } = await apiClient.get("/blog/public");
  return data;
};

export const getAdminBlogPostsRequest = async () => {
  const { data } = await apiClient.get("/blog/admin");
  return data;
};

export const createBlogPostRequest = async (payload) => {
  const { data } = await apiClient.post("/blog", payload);
  return data;
};

export const updateBlogPostRequest = async ({ id, payload }) => {
  const { data } = await apiClient.patch(`/blog/${id}`, payload);
  return data;
};

export const deleteBlogPostRequest = async (id) => {
  await apiClient.delete(`/blog/${id}`);
};
