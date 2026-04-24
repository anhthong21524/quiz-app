import { Injectable, UnauthorizedException } from "@nestjs/common";

export interface LoginPayload {
  email?: string;
  password?: string;
}

const ADMIN_EMAIL = "admin@quiz.app";
const ADMIN_PASSWORD = "admin1234";

@Injectable()
export class AuthService {
  async login(payload: LoginPayload) {
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password?.trim();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return {
      message: "Signed in successfully.",
      user: {
        email: ADMIN_EMAIL
      }
    };
  }
}
