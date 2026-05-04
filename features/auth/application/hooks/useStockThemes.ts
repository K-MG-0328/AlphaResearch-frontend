"use client";

import { useEffect, useState } from "react";

import type { StockTheme } from "@/features/auth/domain/model/stockTheme";
import { fetchStockThemes } from "@/features/auth/infrastructure/api/stockThemesApi";

export function useStockThemes() {
  const [themes, setThemes] = useState<StockTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStockThemes()
      .then(setThemes)
      .catch(() => setError("종목 목록을 불러오는 데 실패했습니다."))
      .finally(() => setIsLoading(false));
  }, []);

  return { themes, isLoading, error };
}
