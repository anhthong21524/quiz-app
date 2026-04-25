import { httpClient } from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    email: string;
  };
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
  passwordLastChangedAt: string;
}

export async function login(payload: LoginPayload) {
  const response = await httpClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function updatePassword(
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordResponse> {
  // TODO: Replace this placeholder with a real API call when the backend exposes
  // a password update endpoint, for example:
  // const response = await httpClient.patch<UpdatePasswordResponse>("/auth/password", payload);
  // return response.data;
  await Promise.resolve(payload);

  return {
    message: "Password updated successfully.",
    passwordLastChangedAt: new Date().toISOString()
  };
}
