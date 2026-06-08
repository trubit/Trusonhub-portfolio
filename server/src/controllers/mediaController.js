import MediaCenter from "../models/MediaCenter.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const initialMediaState = {
  profilePhoto: "",
  coverImage: "",
  galleryImages: [],
  interviewVideos: [],
  youtubeInterviews: [],
  featuredInterview: null,
  cvPdf: "",
  resumePdf: "",
};

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

const sanitizeStringArray = (value) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim().length > 0)
    : [];

const sanitizeInterviewVideos = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      // backward compat: item may still be a bare URL string
      if (typeof item === "string") return { url: item.trim(), title: "" };
      return { url: sanitizeString(item?.url), title: sanitizeString(item?.title) };
    })
    .filter((item) => item.url.length > 0);
};

const sanitizeYoutubeInterviews = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => ({
          url: sanitizeString(item?.url),
          embedUrl: sanitizeString(item?.embedUrl),
        }))
        .filter((item) => item.url && item.embedUrl)
    : [];

const sanitizeFeaturedInterview = (value) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const type = value.type === "youtube" ? "youtube" : "video";
  const url = sanitizeString(value.url);
  const embedUrl = sanitizeString(value.embedUrl);

  if (!url) {
    return null;
  }

  return {
    type,
    url,
    embedUrl,
  };
};

const normalizeMediaPayload = (payload = {}) => ({
  profilePhoto: sanitizeString(payload.profilePhoto),
  coverImage: sanitizeString(payload.coverImage),
  galleryImages: sanitizeStringArray(payload.galleryImages),
  interviewVideos: sanitizeInterviewVideos(payload.interviewVideos),
  youtubeInterviews: sanitizeYoutubeInterviews(payload.youtubeInterviews),
  featuredInterview: sanitizeFeaturedInterview(payload.featuredInterview),
  cvPdf: sanitizeString(payload.cvPdf),
  resumePdf: sanitizeString(payload.resumePdf),
});

const getOrCreateMediaCenter = async () => {
  let mediaCenter = await MediaCenter.findOne().sort({ createdAt: 1 });

  if (!mediaCenter) {
    mediaCenter = await MediaCenter.create(initialMediaState);
  }

  return mediaCenter;
};

export const getMediaCenter = asyncHandler(async (_req, res) => {
  const mediaCenter = await getOrCreateMediaCenter();
  res.json(mediaCenter);
});

export const upsertMediaCenter = asyncHandler(async (req, res) => {
  const mediaCenter = await getOrCreateMediaCenter();
  const nextState = normalizeMediaPayload(req.body);

  Object.assign(mediaCenter, nextState);
  await mediaCenter.save();

  res.json(mediaCenter);
});
