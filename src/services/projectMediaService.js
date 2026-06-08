import { apiClient } from "../api/client";

export const getProjectMediaStateRequest = async () => {
  const { data } = await apiClient.get("/project-media");
  return data;
};

export const addProjectVideoMetadataRequest = async (payload) => {
  const { data } = await apiClient.post("/project-media/videos", payload);
  return data;
};

export const addProjectImagesMetadataRequest = async (items) => {
  const { data } = await apiClient.post("/project-media/images", { items });
  return data;
};

export const deleteProjectVideoMetadataRequest = async (mediaId) => {
  const { data } = await apiClient.delete(`/project-media/videos/${mediaId}`);
  return data;
};

export const deleteProjectImageMetadataRequest = async (mediaId) => {
  const { data } = await apiClient.delete(`/project-media/images/${mediaId}`);
  return data;
};
