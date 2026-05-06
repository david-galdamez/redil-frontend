import { apiFetch } from "./client";

export const getTeacherDetails = (id: string, cookie?: string | null) =>
    apiFetch<TeacherDetailsDto>(`api/teacher/${id}`, { cookie });

export const getRedils = () =>
    apiFetch<RedilDto[]>("api/redil");

export const getTeachers = (cookie?: string | null, params?: URLSearchParams | null) =>
    apiFetch<PaginatedResponse<TeacherDto[]>>(`api/teacher?${params}`, { cookie })