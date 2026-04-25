import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

interface TokenPayload {
  sub: string;
  email: string;
}

interface RegisteredUser {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
}

interface GoogleUser {
  id: string;
  email: string;
}

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keyLength: number
) => Promise<Buffer>;

@Injectable()
export class AuthService {
  private readonly adminEmail: string;
  private readonly adminPassword: string;
  private readonly refreshSecret: string;
  private readonly registeredUsers = new Map<string, RegisteredUser>();
  private readonly googleUsers = new Map<string, GoogleUser>(); // keyed by Google sub
  private readonly validRefreshTokens = new Set<string>();
  private readonly userAvatars = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.adminEmail = this.normalizeEmail(
      configService.get("AUTH_ADMIN_EMAIL") ?? "admin@quiz.app"
    );
    this.adminPassword = this.normalizePassword(
      configService.get("AUTH_ADMIN_PASSWORD") ?? "admin1234"
    );
    this.refreshSecret =
      (configService.get<string>("JWT_SECRET") ?? "default-secret-change-in-production") +
      "_refresh";
  }

  async loginWithGoogle(googleUser: { sub: string; email: string; name: string }) {
    if (!this.googleUsers.has(googleUser.sub)) {
      this.googleUsers.set(googleUser.sub, { id: googleUser.sub, email: googleUser.email });
    }
    return this.issueTokens({ sub: googleUser.sub, email: googleUser.email });
  }

  getProfile(sub: string): { email: string; avatarUrl?: string } | null {
    const avatarUrl = this.userAvatars.get(sub);

    const googleUser = this.googleUsers.get(sub);
    if (googleUser) {
      return { email: googleUser.email, ...(avatarUrl ? { avatarUrl } : {}) };
    }

    for (const user of this.registeredUsers.values()) {
      if (user.id === sub) {
        return { email: user.email, ...(avatarUrl ? { avatarUrl } : {}) };
      }
    }

    if (sub === "admin") {
      return { email: this.adminEmail, ...(avatarUrl ? { avatarUrl } : {}) };
    }

    return null;
  }

  async register(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);

    if (normalizedEmail === this.adminEmail || this.registeredUsers.has(normalizedEmail)) {
      throw new ConflictException("An account with this email already exists.");
    }

    const { passwordHash, passwordSalt } = await this.hashPassword(
      this.normalizePassword(password)
    );
    const user: RegisteredUser = {
      id: randomUUID(),
      email: normalizedEmail,
      passwordHash,
      passwordSalt
    };
    this.registeredUsers.set(normalizedEmail, user);

    return this.issueTokens({ sub: user.id, email: user.email });
  }

  async login(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const normalizedPassword = this.normalizePassword(password);

    if (normalizedEmail === this.adminEmail && normalizedPassword === this.adminPassword) {
      return this.issueTokens({ sub: "admin", email: this.adminEmail });
    }

    const registeredUser = this.registeredUsers.get(normalizedEmail);
    if (
      !registeredUser ||
      !(await this.verifyPassword(normalizedPassword, registeredUser))
    ) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.issueTokens({ sub: registeredUser.id, email: registeredUser.email });
  }

  async refresh(refreshToken: string) {
    if (!this.validRefreshTokens.has(refreshToken)) {
      throw new UnauthorizedException("Invalid or expired refresh token.");
    }

    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.refreshSecret
      });
      this.validRefreshTokens.delete(refreshToken);
      return this.issueTokens({ sub: payload.sub, email: payload.email });
    } catch {
      this.validRefreshTokens.delete(refreshToken);
      throw new UnauthorizedException("Invalid or expired refresh token.");
    }
  }

  updateAvatar(sub: string, avatarUrl: string): { avatarUrl: string } {
    this.userAvatars.set(sub, avatarUrl);
    return { avatarUrl };
  }

  logout(refreshToken: string) {
    this.validRefreshTokens.delete(refreshToken);
    return { message: "Signed out successfully." };
  }

  private issueTokens(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: "7d"
    });
    this.validRefreshTokens.add(refreshToken);

    const avatarUrl = this.userAvatars.get(payload.sub);
    return {
      accessToken,
      refreshToken,
      user: { email: payload.email, ...(avatarUrl ? { avatarUrl } : {}) }
    };
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizePassword(password: string) {
    return password.trim();
  }

  private async hashPassword(password: string) {
    const passwordSalt = randomBytes(16).toString("hex");
    const passwordHash = (await scrypt(password, passwordSalt, 64)).toString("hex");
    return { passwordHash, passwordSalt };
  }

  private async verifyPassword(password: string, user: RegisteredUser) {
    const expectedHash = Buffer.from(user.passwordHash, "hex");
    const actualHash = await scrypt(password, user.passwordSalt, expectedHash.length);
    return expectedHash.length === actualHash.length && timingSafeEqual(expectedHash, actualHash);
  }
}
