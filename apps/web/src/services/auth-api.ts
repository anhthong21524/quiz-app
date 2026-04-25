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

export async function login(payload: LoginPayload) {
  const response = await httpClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}
