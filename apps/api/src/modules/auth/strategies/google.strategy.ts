import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { getGoogleOAuthConfig } from "../google-oauth.config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(configService: ConfigService) {
    super(
      (() => {
        const googleOAuthConfig = getGoogleOAuthConfig(configService);

        return {
          clientID: googleOAuthConfig.clientID,
          clientSecret: googleOAuthConfig.clientSecret,
          callbackURL: googleOAuthConfig.callbackURL,
          scope: ["email", "profile"]
        };
      })()
    );
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
    const email = profile.emails?.[0]?.value ?? "";
    done(null, { sub: profile.id, email, name: profile.displayName });
  }
}
