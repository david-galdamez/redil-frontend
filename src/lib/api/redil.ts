import { apiFetch } from "./client"

export const getRedilAssistInfo = (assistToken: string) =>
  apiFetch<AssisClassDetailDto>(`api/class/assist/${assistToken}`);

export const getRedilsList = (token?: string | null) =>
  apiFetch<RedilListDto[]>("api/redil", { token })

export const getRedilByCode = (redilCode: string) =>
  apiFetch<RedilDto>(`api/redil/code/${redilCode}`)

export const getRedilDetails = (id: string, token?: string | null) =>
  apiFetch<RedilDetailsDto>(`api/redil/${id}`, { token })
