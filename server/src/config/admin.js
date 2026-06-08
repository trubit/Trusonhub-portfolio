export const normalizeEmail = (value = "") => String(value).toLowerCase().trim();

// Lazy read — dotenv is loaded before any route handler runs
export const getAdminEmail = () => {
  const email = process.env.ADMIN_EMAIL;
  if (!email) throw new Error("ADMIN_EMAIL environment variable is required");
  return email.toLowerCase().trim();
};

export const isAdminEmail = (value = "") => {
  try {
    return normalizeEmail(value) === getAdminEmail();
  } catch {
    return false;
  }
};
