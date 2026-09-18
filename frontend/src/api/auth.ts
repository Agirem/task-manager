import { api } from "@/lib/api";
import type { AuthResponse } from "@/types";

export function register(email: string, password: string) {
  return api.post<AuthResponse>("/auth/register", { email, password });
}

export function login(email: string, password: string) {
  return api.post<AuthResponse>("/auth/login", { email, password });
}
