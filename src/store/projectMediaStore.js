import { create } from "zustand";

import {
  deleteMediaAssetRequest,
  uploadMediaImageRequest,
  uploadMediaVideoRequest,
} from "../api/uploadApi";
import {
  addProjectImagesMetadataRequest,
  addProjectVideoMetadataRequest,
  deleteProjectImageMetadataRequest,
  deleteProjectVideoMetadataRequest,
  getProjectMediaStateRequest,
} from "../services/projectMediaService";
import { resolveMediaUrl } from "../utils/mediaUrl";

const normaliseAsset = (item) => ({
  _id: item?._id || "",
  url: resolveMediaUrl(item?.url),
  cloudinaryId: item?.cloudinaryId || "",
  fileName: item?.fileName || "",
  mimeType: item?.mimeType || "",
  uploadDate: item?.uploadDate || "",
  uploadedBy: item?.uploadedBy || null,
  title: item?.title || "",
});

const normaliseState = (payload = {}) => ({
  videos: Array.isArray(payload.projectVideos)
    ? payload.projectVideos.map(normaliseAsset).filter((item) => item.url)
    : [],
  images: Array.isArray(payload.projectImages)
    ? payload.projectImages.map(normaliseAsset).filter((item) => item.url)
    : [],
});

const getErrorMessage = (error, fallback) => {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return "Unauthorized. Please sign in as admin from /admin/login.";
  }

  return error?.response?.data?.message || fallback;
};

export const useProjectMediaStore = create((set) => ({
  videos: [],
  images: [],
  loading: true,
  uploadingVideo: false,
  uploadingImages: false,
  deletingVideoId: "",
  deletingImageId: "",
  status: {
    type: "",
    message: "",
  },

  clearStatus: () =>
    set({
      status: {
        type: "",
        message: "",
      },
    }),

  loadProjectMedia: async () => {
    set({ loading: true });
    try {
      const payload = await getProjectMediaStateRequest();
      const nextState = normaliseState(payload);
      set({
        ...nextState,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        status: {
          type: "error",
          message: getErrorMessage(error, "Failed to load project media."),
        },
      });
    }
  },

  uploadProjectVideo: async ({ file, title = "" }) => {
    if (!file) {
      return;
    }

    set({ uploadingVideo: true });

    try {
      const uploaded = await uploadMediaVideoRequest(file);
      const payload = await addProjectVideoMetadataRequest({
        url: uploaded.url,
        title,
        fileName: file.name,
        mimeType: file.type,
      });

      const nextState = normaliseState(payload);
      set({
        ...nextState,
        uploadingVideo: false,
        status: {
          type: "success",
          message: "Project video uploaded successfully.",
        },
      });
    } catch (error) {
      set({
        uploadingVideo: false,
        status: {
          type: "error",
          message: getErrorMessage(error, "Project video upload failed."),
        },
      });
    }
  },

  uploadProjectImages: async (files) => {
    const nextFiles = Array.from(files || []);
    if (!nextFiles.length) {
      return;
    }

    set({ uploadingImages: true });

    try {
      const uploadedAssets = await Promise.all(
        nextFiles.map(async (file) => {
          const uploaded = await uploadMediaImageRequest(file);

          return {
            url: uploaded.url,
            fileName: file.name,
            mimeType: file.type,
          };
        }),
      );

      const payload = await addProjectImagesMetadataRequest(uploadedAssets);
      const nextState = normaliseState(payload);

      set({
        ...nextState,
        uploadingImages: false,
        status: {
          type: "success",
          message: "Project images uploaded successfully.",
        },
      });
    } catch (error) {
      set({
        uploadingImages: false,
        status: {
          type: "error",
          message: getErrorMessage(error, "Project image upload failed."),
        },
      });
    }
  },

  deleteProjectVideo: async (item) => {
    if (!item?._id || !item?.url) {
      return;
    }

    set({ deletingVideoId: item._id });

    try {
      await deleteMediaAssetRequest({
        url: item.url,
        assetType: "video",
      });

      const payload = await deleteProjectVideoMetadataRequest(item._id);
      const nextState = normaliseState(payload.projectMedia || payload);

      set({
        ...nextState,
        deletingVideoId: "",
        status: {
          type: "success",
          message: "Project video deleted.",
        },
      });
    } catch (error) {
      set({
        deletingVideoId: "",
        status: {
          type: "error",
          message: getErrorMessage(error, "Failed to delete project video."),
        },
      });
    }
  },

  deleteProjectImage: async (item) => {
    if (!item?._id || !item?.url) {
      return;
    }

    set({ deletingImageId: item._id });

    try {
      await deleteMediaAssetRequest({
        url: item.url,
        assetType: "image",
      });

      const payload = await deleteProjectImageMetadataRequest(item._id);
      const nextState = normaliseState(payload.projectMedia || payload);

      set({
        ...nextState,
        deletingImageId: "",
        status: {
          type: "success",
          message: "Project image deleted.",
        },
      });
    } catch (error) {
      set({
        deletingImageId: "",
        status: {
          type: "error",
          message: getErrorMessage(error, "Failed to delete project image."),
        },
      });
    }
  },

  setStatus: (status) => set({ status }),
}));
