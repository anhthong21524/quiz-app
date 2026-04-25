import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleAuthStatus } from "@quiz-app/shared";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";
import { getGoogleOAuthConfig } from "./google-oauth.config";
import { GoogleAuthGuard } from "./guards/google-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload.email, payload.password);
  }

  @Post("register")
  @Public()
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload.email, payload.password);
  }

  @Post("refresh")
  @Public()
  @HttpCode(HttpStatus.OK)
  refresh(@Body() payload: RefreshTokenDto) {
    return this.authService.refresh(payload.refreshToken);
  }

  @Post("logout")
  @Public()
  @HttpCode(HttpStatus.OK)
  logout(@Body() payload: RefreshTokenDto) {
    return this.authService.logout(payload.refreshToken);
  }

  @Get("me")
  async getMe(@Req() req: Request & { user: { id: string; email: string } }) {
    return (await this.authService.getProfile(req.user.id)) ?? { email: req.user.email };
  }

  @Patch("me/avatar")
  @HttpCode(HttpStatus.OK)
  updateAvatar(
    @Req() req: Request & { user: { id: string; email: string } },
    @Body() payload: UpdateAvatarDto
  ) {
    return this.authService.updateAvatar(req.user.id, payload.avatarUrl);
  }

  @Get("google/status")
  @Public()
  getGoogleAuthStatus(): GoogleAuthStatus {
    return { enabled: getGoogleOAuthConfig(this.configService).enabled };
  }

  @Get("google")
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Passport redirects to Google — no body needed
  }

  @Get("google/callback")
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.loginWithGoogle(
      req.user as { sub: string; email: string; name: string }
    );
    const frontendUrl =
      this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const params = new URLSearchParams({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      email: tokens.user.email
    });
    res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  }
}
