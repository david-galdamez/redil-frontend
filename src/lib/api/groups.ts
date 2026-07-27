import { apiFetch } from "./client";

export const getGroups = () => apiFetch<GroupDto[]>("api/groups");
