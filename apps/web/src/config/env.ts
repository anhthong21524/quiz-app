const fallbackApiUrl = "http://localhost:3001/api";
const fallbackSiteUrl = "http://localhost:3000";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiUrl,
  siteUrl: trimTrailingSlash(import.meta.env.VITE_SITE_URL ?? fallbackSiteUrl)
};
