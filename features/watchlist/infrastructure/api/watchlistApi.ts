import type { WatchlistItem } from "@/features/watchlist/domain/model/watchlistItem";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import { httpClient, HttpError } from "@/infrastructure/http/httpClient";

interface RawWatchlistStock {
  stock_code: string;
  stock_name: string;
  theme_name: string;
}

interface WatchlistData {
  stocks: RawWatchlistStock[];
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const { data } = await httpClient<ApiResponse<WatchlistData>>("/api/v1/users/me/watchlist");
  return (data?.stocks ?? []).map((s) => ({
    code: s.stock_code,
    name: s.stock_name,
    theme: s.theme_name,
  }));
}

export async function addToWatchlist(code: string): Promise<void> {
  await httpClient<unknown>("/api/v1/users/me/watchlist", {
    method: "POST",
    body: JSON.stringify({ stock_code: code }),
  });
}

export async function deleteFromWatchlist(code: string): Promise<void> {
  try {
    await httpClient<unknown>(`/api/v1/users/me/watchlist/${code}`, { method: "DELETE" });
  } catch (e) {
    // 204 No Content → JSON parse fails with SyntaxError → treat as success
    if (e instanceof SyntaxError) return;
    if (e instanceof HttpError && e.status === 204) return;
    throw e;
  }
}

export async function updateWatchlistItem(oldCode: string, newCode: string): Promise<void> {
  await httpClient<unknown>(`/api/v1/users/me/watchlist/${oldCode}`, {
    method: "PUT",
    body: JSON.stringify({ new_stock_code: newCode }),
  });
}
