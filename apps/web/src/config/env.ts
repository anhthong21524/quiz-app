const fallbackApiUrl = "http://localhost:3001/api";

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiUrl
};
