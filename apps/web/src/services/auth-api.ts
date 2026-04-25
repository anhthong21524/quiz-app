import { AuthTokens, GoogleAuthStatus, LoginPayload, RegisterPayload } from "@quiz-app/shared";
import { httpClient } from "./http";

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const response = await httpClient.post<AuthTokens>("/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<AuthTokens> {
  const response = await httpClient.post<AuthTokens>("/auth/register", payload);
  return response.data;
}

export async function refreshToken(token: string): Promise<AuthTokens> {
  const response = await httpClient.post<AuthTokens>("/auth/refresh", { refreshToken: token });
  return response.data;
}

export async function logout(token: string): Promise<void> {
  await httpClient.post("/auth/logout", { refreshToken: token });
}

export async function getGoogleAuthStatus(): Promise<GoogleAuthStatus> {
  const response = await httpClient.get<GoogleAuthStatus>("/auth/google/status");
  return response.data;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
  passwordLastChangedAt: string;
}

export async function getMe(): Promise<{ email: string; avatarUrl?: string }> {
  const response = await httpClient.get<{ email: string; avatarUrl?: string }>("/auth/me");
  return response.data;
}

export async function uploadAvatar(avatarUrl: string): Promise<{ avatarUrl: string }> {
  const response = await httpClient.patch<{ avatarUrl: string }>("/auth/me/avatar", { avatarUrl });
  return response.data;
}

export async function updatePassword(
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordResponse> {
  // TODO: Replace with a real API call when the backend exposes a password update endpoint.
  await Promise.resolve(payload);
  return {
    message: "Password updated successfully.",
    passwordLastChangedAt: new Date().toISOString()
  };
}
