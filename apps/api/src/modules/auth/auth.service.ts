import { ConflictException, Inject, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { USER_REPOSITORY, User, UserRepository } from "./infrastructure/persistence/user.repository";

interface TokenPayload {
  sub: string;
  email: string;
}

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keyLength: number
) => Promise<Buffer>;

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly adminEmail: string;
  private readonly adminPassword: string;
  private readonly refreshSecret: string;
  private readonly validRefreshTokens = new Set<string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
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

  async onModuleInit() {
    const existing = await this.userRepository.findByEmail(this.adminEmail);
    if (!existing) {
      const { passwordHash, passwordSalt } = await this.hashPassword(this.adminPassword);
      await this.userRepository.create({ email: this.adminEmail, passwordHash, passwordSalt });
    }
  }

  async loginWithGoogle(googleUser: { sub: string; email: string; name: string }) {
    let user = await this.userRepository.findByGoogleSub(googleUser.sub);
    if (!user) {
      const existing = await this.userRepository.findByEmail(googleUser.email);
      if (existing) {
        // Link the Google account to the existing user
        user = existing;
      } else {
        user = await this.userRepository.create({
          email: this.normalizeEmail(googleUser.email),
          googleSub: googleUser.sub
        });
      }
    }
    return this.issueTokens({ sub: user.id, email: user.email });
  }

  async getProfile(sub: string): Promise<{ email: string; avatarUrl?: string } | null> {
    const user = await this.userRepository.findById(sub);
    if (!user) return null;
    return { email: user.email, ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}) };
  }

  async register(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);

    if (normalizedEmail === this.adminEmail) {
      throw new ConflictException("An account with this email already exists.");
    }

    const existing = await this.userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictException("An account with this email already exists.");
    }

    const { passwordHash, passwordSalt } = await this.hashPassword(
      this.normalizePassword(password)
    );
    const user = await this.userRepository.create({
      email: normalizedEmail,
      passwordHash,
      passwordSalt
    });

    return this.issueTokens({ sub: user.id, email: user.email });
  }

  async login(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const normalizedPassword = this.normalizePassword(password);

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash || !user.passwordSalt) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const valid = await this.verifyPassword(normalizedPassword, user);
    if (!valid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.issueTokens({ sub: user.id, email: user.email });
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

  async updateAvatar(sub: string, avatarUrl: string): Promise<{ avatarUrl: string }> {
    await this.userRepository.updateAvatar(sub, avatarUrl);
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

    return {
      accessToken,
      refreshToken,
      user: { email: payload.email }
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

  private async verifyPassword(password: string, user: User) {
    const expectedHash = Buffer.from(user.passwordHash!, "hex");
    const actualHash = await scrypt(password, user.passwordSalt!, expectedHash.length);
    return expectedHash.length === actualHash.length && timingSafeEqual(expectedHash, actualHash);
  }
}
