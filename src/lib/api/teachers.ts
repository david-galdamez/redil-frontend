import { apiFetch } from "./client";

export const getTeacherDetails = (id: string, token?: string | null) =>
  apiFetch<TeacherDetailsDto>(`api/teacher/${id}`, { token });

export const getRedils = (token?: string | null) => apiFetch<RedilDto[]>("api/redil", { token });

export const getTeachers = (token?: string | null, params?: URLSearchParams | null) =>
  apiFetch<PaginatedResponse<TeacherDto[]>>(`api/teacher?${params}`, { token });
