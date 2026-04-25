import { ConfigService } from "@nestjs/config";

const DEFAULT_GOOGLE_CALLBACK_URL = "http://localhost:3001/api/auth/google/callback";
const MISSING_GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID_NOT_SET";
const MISSING_GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET_NOT_SET";

export interface GoogleOAuthConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  enabled: boolean;
}

function getConfigValue(configService: ConfigService, key: string) {
  return configService.get<string>(key)?.trim() ?? "";
}

export function getGoogleOAuthConfig(configService: ConfigService): GoogleOAuthConfig {
  const clientID = getConfigValue(configService, "GOOGLE_CLIENT_ID");
  const clientSecret = getConfigValue(configService, "GOOGLE_CLIENT_SECRET");
  const callbackURL =
    getConfigValue(configService, "GOOGLE_CALLBACK_URL") || DEFAULT_GOOGLE_CALLBACK_URL;

  return {
    clientID: clientID || MISSING_GOOGLE_CLIENT_ID,
    clientSecret: clientSecret || MISSING_GOOGLE_CLIENT_SECRET,
    callbackURL,
    enabled: Boolean(clientID && clientSecret)
  };
}
