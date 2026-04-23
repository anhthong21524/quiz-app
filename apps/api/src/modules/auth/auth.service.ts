export interface LoginPayload {
  email?: string;
  password?: string;
}

export class AuthService {
  async login(payload: LoginPayload) {
    return {
      message: "Authentication flow is not implemented yet.",
      user: {
        email: payload.email ?? "demo@quiz-app.local"
      }
    };
  }
}

