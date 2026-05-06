import type { UserDetailsDto } from "../../types/user";
import { apiFetch } from "./client";

export const getProfile = (cookie?: string | null) =>
    apiFetch<UserDetailsDto>("api/auth/me", { cookie })