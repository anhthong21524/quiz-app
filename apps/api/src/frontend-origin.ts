const defaultFrontendUrl = "http://localhost:3000";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getFrontendOrigins(frontendUrl = defaultFrontendUrl) {
  const configuredOrigins = frontendUrl
    .split(",")
    .map((origin) => trimTrailingSlash(origin.trim()))
    .filter(Boolean);

  return configuredOrigins.length > 0
    ? configuredOrigins
    : [defaultFrontendUrl];
}

export function getPrimaryFrontendUrl(frontendUrl?: string) {
  return getFrontendOrigins(frontendUrl)[0] ?? defaultFrontendUrl;
}

export function createCorsOriginResolver(frontendUrl?: string) {
  const allowedOrigins = new Set(getFrontendOrigins(frontendUrl));

  return (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    // Requests without an Origin header are allowed so local tools and server-to-server
    // calls can still reach the API.
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = trimTrailingSlash(origin);
    const isAllowed = allowedOrigins.has(normalizedOrigin);

    callback(
      isAllowed ? null : new Error(`Origin ${origin} is not allowed by CORS.`),
      isAllowed
    );
  };
}
