import type { UserDetailsDto } from "../../types/user";
import { apiFetch } from "./client";

export const getProfile = (token?: string | null) =>
  apiFetch<UserDetailsDto>("api/auth/me", { token })
