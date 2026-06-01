export const API_URL = import.meta.env.API_URL || import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

type FetchOptions = {
  cookie?: string | null;
  method?: string;
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const res = await fetch(`${API_URL}/${path}`, {
      method: options.method ?? "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.cookie ? { cookie: options.cookie } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const json = (await res.json()) as ApiResponse<T>;

    if (!res.ok) {
      return { data: null, error: `${json.message}`, status: res.status };
    }

    return { data: json.data ?? null, error: null, status: res.status };
  } catch (e) {
    console.error(e)
    return { data: null, error: "Error conectando al servidor.", status: 500 };
  }
}
