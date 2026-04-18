import { env } from "@/infrastructure/config/env";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    statusText: string,
    public readonly body: unknown = null
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("user_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function httpClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`;

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      const token = localStorage.getItem("user_token");
      if (token) {
        // 토큰은 있지만 세션 만료 → 토큰 제거 후 로그인으로 이동
        localStorage.removeItem("user_token");
        window.location.replace("/login");
      }
    }
    let body: unknown = null;
    try { body = await response.json(); } catch { /* ignore */ }
    throw new HttpError(response.status, response.statusText, body);
  }

  return response.json() as Promise<T>;
}
