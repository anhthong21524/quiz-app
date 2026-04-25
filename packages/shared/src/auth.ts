export interface AuthUser {
  email: string;
  avatarUrl?: string;
}

export const AUTH_FIELD_LIMITS = {
  emailMaxLength: 255,
  passwordMaxLength: 72,
  nameMaxLength: 80
} as const;

export const AUTH_PASSWORD_POLICY = {
  minLength: 8,
  maxLength: AUTH_FIELD_LIMITS.passwordMaxLength,
  weakPasswords: [
    "password",
    "password1",
    "password123",
    "admin1234",
    "qwerty123",
    "letmein123",
    "quizapp123"
  ]
} as const;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {}

export interface GoogleAuthStatus {
  enabled: boolean;
}
