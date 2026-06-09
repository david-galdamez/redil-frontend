export const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

type FetchOptions = {
  token?: string | null;
  method?: string;
  body?: unknown;
};

export interface Error {
  field: string;
  message: string;
}

export type ApiResult<T> = {
  data: T | null;
  error: string | null;
  status: number;
  errors?: Error[];
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> & {
      "Content-Type"?: string;
    } = { "Content-Type": "application/json" };

    if (options.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    const res = await fetch(`${API_URL}/${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const json = (await res.json()) as ApiResponse<T>;

    if (!res.ok) {
      return { data: null, error: json.message ?? "Error", status: res.status, errors: json.errors };
    }

    return { data: json.data ?? null, error: null, status: res.status, errors: json.errors };
  } catch (e) {
    console.error(e)
    return { data: null, error: "Error conectando al servidor.", status: 500 };
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

function clientFetch<T>(path: string, options: FetchOptions = {}): Promise<ApiResult<T>> {
  const token = options.token ?? getToken();
  return apiFetch<T>(path, { ...options, token });
}

type ApiClient = {
  get: <T>(path: string) => Promise<ApiResult<T>>;
  post: <T>(path: string, body?: unknown) => Promise<ApiResult<T>>;
  put: <T>(path: string, body?: unknown) => Promise<ApiResult<T>>;
  patch: <T>(path: string, body?: unknown) => Promise<ApiResult<T>>;
};

export const apiClient: ApiClient = {
  get: <T>(path: string) => clientFetch<T>(path),
  post: <T>(path: string, body?: unknown) => clientFetch<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => clientFetch<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => clientFetch<T>(path, { method: "PATCH", body }),
};
