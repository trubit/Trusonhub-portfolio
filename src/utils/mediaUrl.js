const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const uploadOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

// Matches old URLs saved with a hardcoded localhost/127.0.0.1 host before the
// relative-path fix. Rewrites them using the current VITE_API_URL origin so
// they work regardless of where the app is served from.
const LOCAL_GRIDFS_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/uploads\//i;

export const resolveMediaUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  if (LOCAL_GRIDFS_RE.test(value)) {
    return `${uploadOrigin}${value.replace(/^https?:\/\/[^/]+/, "")}`;
  }
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${uploadOrigin}${value}`;
  return `${uploadOrigin}/${value}`;
};
