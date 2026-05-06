import { apiFetch } from "./client"

export const getClassDetails = (id: string, cookie?: string | null) =>
    apiFetch<ClassDetailsDto>(`api/class/${id}`, { cookie })

export const getClasses = (cookie: string | null, params: URLSearchParams) =>
    apiFetch<PaginatedResponse<ClassDto[]>>(`api/class?${params}`, { cookie });