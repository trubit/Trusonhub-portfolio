import { apiClient } from "./client";

const uploadFile = async (url, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 120_000,
  });

  return data;
};

export const uploadAvatarRequest = (file) => uploadFile("/uploads/avatar", file);
export const uploadProjectMediaRequest = (file) => uploadFile("/uploads/project-media", file);
export const uploadMediaImageRequest = (file) => uploadFile("/uploads/media/image", file);
export const uploadMediaVideoRequest = (file) => uploadFile("/uploads/media/video", file);
export const uploadMediaDocumentRequest = (file) => uploadFile("/uploads/media/document", file);

export const deleteMediaAssetRequest = async ({ url, assetType }) => {
  const { data } = await apiClient.delete("/uploads/media", {
    data: {
      url,
      assetType,
    },
    timeout: 60_000,
  });

  return data;
};
