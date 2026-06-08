import { create } from "zustand";

import { getMediaCenterRequest, upsertMediaCenterRequest } from "../api/mediaApi";
import { deleteMediaAssetRequest, uploadMediaDocumentRequest, uploadMediaImageRequest, uploadMediaVideoRequest } from "../api/uploadApi";
import { resolveMediaUrl } from "../utils/mediaUrl";

const normalise = (payload = {}) => ({
  profilePhoto: resolveMediaUrl(payload.profilePhoto),
  coverImage: resolveMediaUrl(payload.coverImage),
  galleryImages: Array.isArray(payload.galleryImages)
    ? payload.galleryImages.map(resolveMediaUrl).filter(Boolean)
    : [],
  interviewVideos: Array.isArray(payload.interviewVideos)
    ? payload.interviewVideos
        .map((item) => {
          // backward compat: legacy data may be a bare URL string
          if (typeof item === "string") return { url: resolveMediaUrl(item), title: "" };
          return { url: resolveMediaUrl(item?.url), title: item?.title || "" };
        })
        .filter((item) => item.url)
    : [],
  youtubeInterviews: Array.isArray(payload.youtubeInterviews)
    ? payload.youtubeInterviews.map((item) => ({
        url: item?.url || "",
        embedUrl: item?.embedUrl || "",
      })).filter((item) => item.url && item.embedUrl)
    : [],
  featuredInterview: payload.featuredInterview
    ? {
        ...payload.featuredInterview,
        url:
          payload.featuredInterview.type === "youtube"
            ? payload.featuredInterview.url
            : resolveMediaUrl(payload.featuredInterview.url),
      }
    : null,
  cvPdf: resolveMediaUrl(payload.cvPdf),
  resumePdf: resolveMediaUrl(payload.resumePdf),
});

export const useMediaStore = create((set, get) => ({
  media: {
    profilePhoto: "",
    coverImage: "",
    galleryImages: [],
    interviewVideos: [],
    youtubeInterviews: [],
    featuredInterview: null,
    cvPdf: "",
    resumePdf: "",
  },
  loaded: false,
  loading: false,
  uploading: {},
  error: null,
  status: "",

  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const raw = await getMediaCenterRequest();
      set({ media: normalise(raw), loaded: true, loading: false });
    } catch {
      // loaded stays false so the next mount can retry
      set({ loading: false, loaded: false, error: "Unable to load media." });
    }
  },

  _persist: async (nextMedia, successMsg = "") => {
    const prevMedia = get().media;
    const normalised = normalise(nextMedia);
    set({ media: normalised });
    try {
      const saved = await upsertMediaCenterRequest(normalised);
      set({ media: normalise(saved), status: successMsg });
      setTimeout(() => set({ status: "" }), 4000);
    } catch (err) {
      set({ media: prevMedia, status: err.response?.data?.message || "Failed to save media." });
      setTimeout(() => set({ status: "" }), 4000);
    }
  },

  _setUploading: (key, value) =>
    set((s) => ({ uploading: { ...s.uploading, [key]: value } })),

  uploadProfilePhoto: async (file) => {
    const store = get();
    store._setUploading("profilePhoto", true);
    try {
      const res = await uploadMediaImageRequest(file);
      await store._persist({ ...store.media, profilePhoto: res.url }, "Profile photo updated.");
    } catch (err) {
      set({ status: err.response?.data?.message || "Profile photo upload failed." });
      setTimeout(() => set({ status: "" }), 4000);
    } finally {
      store._setUploading("profilePhoto", false);
    }
  },

  deleteProfilePhoto: async () => {
    const store = get();
    const url = store.media.profilePhoto;
    if (!url) return;
    try {
      await deleteMediaAssetRequest({ url, assetType: "image" });
    } catch { /* best effort */ }
    await store._persist({ ...store.media, profilePhoto: "" }, "Profile photo removed.");
  },

  uploadCoverImage: async (file) => {
    const store = get();
    store._setUploading("coverImage", true);
    try {
      const res = await uploadMediaImageRequest(file);
      await store._persist({ ...store.media, coverImage: res.url }, "Cover image updated.");
    } catch (err) {
      set({ status: err.response?.data?.message || "Cover image upload failed." });
      setTimeout(() => set({ status: "" }), 4000);
    } finally {
      store._setUploading("coverImage", false);
    }
  },

  deleteCoverImage: async () => {
    const store = get();
    const url = store.media.coverImage;
    if (!url) return;
    try {
      await deleteMediaAssetRequest({ url, assetType: "image" });
    } catch { /* best effort */ }
    await store._persist({ ...store.media, coverImage: "" }, "Cover image removed.");
  },

  uploadGalleryImage: async (file) => {
    const store = get();
    store._setUploading("gallery", true);
    try {
      const res = await uploadMediaImageRequest(file);
      await store._persist(
        { ...store.media, galleryImages: [...store.media.galleryImages, res.url] },
        "Gallery image added.",
      );
    } catch (err) {
      set({ status: err.response?.data?.message || "Gallery image upload failed." });
      setTimeout(() => set({ status: "" }), 4000);
    } finally {
      store._setUploading("gallery", false);
    }
  },

  deleteGalleryImage: async (url) => {
    const store = get();
    try {
      await deleteMediaAssetRequest({ url, assetType: "image" });
    } catch { /* best effort */ }
    await store._persist(
      { ...store.media, galleryImages: store.media.galleryImages.filter((u) => u !== url) },
      "Gallery image removed.",
    );
  },

  uploadInterviewVideo: async (file, title = "") => {
    const store = get();
    store._setUploading("video", true);
    try {
      const res = await uploadMediaVideoRequest(file);
      const newEntry = { url: res.url, title: title.trim() || file.name || "Uploaded Video" };
      await store._persist(
        { ...store.media, interviewVideos: [...store.media.interviewVideos, newEntry] },
        "Interview video uploaded.",
      );
    } catch (err) {
      set({ status: err.response?.data?.message || "Video upload failed." });
      setTimeout(() => set({ status: "" }), 4000);
    } finally {
      store._setUploading("video", false);
    }
  },

  removeInterviewVideo: async (url) => {
    const store = get();
    try {
      await deleteMediaAssetRequest({ url, assetType: "video" });
    } catch { /* best effort */ }
    await store._persist(
      {
        ...store.media,
        interviewVideos: store.media.interviewVideos.filter((item) => item.url !== url),
        featuredInterview:
          store.media.featuredInterview?.url === url ? null : store.media.featuredInterview,
      },
      "Interview video removed.",
    );
  },

  addYouTubeInterview: async (url, embedUrl) => {
    const store = get();
    await store._persist(
      {
        ...store.media,
        youtubeInterviews: [...store.media.youtubeInterviews, { url, embedUrl }],
      },
      "YouTube interview added.",
    );
  },

  removeYouTubeInterview: async (url) => {
    const store = get();
    await store._persist(
      {
        ...store.media,
        youtubeInterviews: store.media.youtubeInterviews.filter((item) => item.url !== url),
        featuredInterview:
          store.media.featuredInterview?.url === url ? null : store.media.featuredInterview,
      },
      "YouTube interview removed.",
    );
  },

  setFeaturedInterview: async (item) => {
    const store = get();
    await store._persist(
      {
        ...store.media,
        featuredInterview: { type: item.type, url: item.url, embedUrl: item.embedUrl || "" },
      },
      "Featured interview updated.",
    );
  },

  clearFeaturedInterview: async () => {
    const store = get();
    await store._persist({ ...store.media, featuredInterview: null }, "Featured interview cleared.");
  },

  uploadCv: async (file) => {
    const store = get();
    store._setUploading("cv", true);
    try {
      const previous = store.media.cvPdf;
      const res = await uploadMediaDocumentRequest(file);
      await store._persist({ ...store.media, cvPdf: res.url }, "CV uploaded.");
      if (previous && previous !== res.url) {
        deleteMediaAssetRequest({ url: previous, assetType: "document" }).catch(() => {});
      }
    } catch (err) {
      set({ status: err.response?.data?.message || "CV upload failed." });
      setTimeout(() => set({ status: "" }), 4000);
    } finally {
      store._setUploading("cv", false);
    }
  },

  deleteCv: async () => {
    const store = get();
    const url = store.media.cvPdf;
    if (!url) return;
    try {
      await deleteMediaAssetRequest({ url, assetType: "document" });
    } catch { /* best effort */ }
    await store._persist({ ...store.media, cvPdf: "" }, "CV removed.");
  },

  uploadResume: async (file) => {
    const store = get();
    store._setUploading("resume", true);
    try {
      const previous = store.media.resumePdf;
      const res = await uploadMediaDocumentRequest(file);
      await store._persist({ ...store.media, resumePdf: res.url }, "Resume uploaded.");
      if (previous && previous !== res.url) {
        deleteMediaAssetRequest({ url: previous, assetType: "document" }).catch(() => {});
      }
    } catch (err) {
      set({ status: err.response?.data?.message || "Resume upload failed." });
      setTimeout(() => set({ status: "" }), 4000);
    } finally {
      store._setUploading("resume", false);
    }
  },

  deleteResume: async () => {
    const store = get();
    const url = store.media.resumePdf;
    if (!url) return;
    try {
      await deleteMediaAssetRequest({ url, assetType: "document" });
    } catch { /* best effort */ }
    await store._persist({ ...store.media, resumePdf: "" }, "Resume removed.");
  },
}));
