import type { StockTheme } from "@/features/auth/domain/model/stockTheme";
import { httpClient } from "@/infrastructure/http/httpClient";

interface RawStock {
  code: string;
  name: string;
  theme_name: string;
}

interface RawTheme {
  theme_name: string;
  stocks: RawStock[];
}

interface RawThemesResponse {
  themes: RawTheme[];
}

export async function fetchStockThemes(): Promise<StockTheme[]> {
  const raw = await httpClient<RawThemesResponse>("/api/v1/stocks/themes");

  const list = raw?.themes ?? [];
  return list.map((t) => ({
    theme: t.theme_name,
    stocks: t.stocks.map((s) => ({ code: s.code, name: s.name })),
  }));
}
