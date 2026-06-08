const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const uploadOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

export const resolveMediaUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${uploadOrigin}${value}`;
  return `${uploadOrigin}/${value}`;
};
