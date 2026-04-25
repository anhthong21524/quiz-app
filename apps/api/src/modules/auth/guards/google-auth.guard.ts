import { ExecutionContext, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { getGoogleOAuthConfig } from "../google-oauth.config";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (!getGoogleOAuthConfig(this.configService).enabled) {
      throw new ServiceUnavailableException(
        "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
      );
    }

    return super.canActivate(context);
  }
}
