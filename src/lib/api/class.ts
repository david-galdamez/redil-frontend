import { apiFetch } from "./client";

export const getClassDetails = (id: string, token?: string | null) =>
  apiFetch<ClassDetailsDto>(`api/class/${id}`, { token });

export const getClasses = (token: string | null, params: URLSearchParams) =>
  apiFetch<PaginatedResponse<ClassDto[]>>(`api/class?${params}`, { token });
