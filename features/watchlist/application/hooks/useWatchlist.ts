"use client";

import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { watchlistVersionAtom } from "@/features/watchlist/application/atoms/watchlistVersionAtom";
import type { WatchlistItem } from "@/features/watchlist/domain/model/watchlistItem";
import {
  fetchWatchlist,
  addToWatchlist,
  deleteFromWatchlist,
  updateWatchlistItem,
} from "@/features/watchlist/infrastructure/api/watchlistApi";

interface Toast {
  message: string;
  type: "success" | "error";
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const bumpVersion = useSetAtom(watchlistVersionAtom);

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetchWatchlist()
      .then(setItems)
      .catch(() => setError("관심종목을 불러오는 데 실패했습니다."))
      .finally(() => setIsLoading(false));
  }, []);

  async function addItem(code: string, name: string, theme: string) {
    setItems((prev) => [...prev, { code, name, theme }]);
    setAddError(null);
    try {
      await addToWatchlist(code);
      bumpVersion((v) => v + 1);
      showToast("관심종목에 추가되었습니다.", "success");
    } catch {
      setItems((prev) => prev.filter((i) => i.code !== code));
      setAddError("종목 추가에 실패했습니다. 다시 시도해 주세요.");
      showToast("추가에 실패했습니다. 다시 시도해 주세요.", "error");
    }
  }

  async function removeItem(code: string) {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.code !== code));
    try {
      await deleteFromWatchlist(code);
      bumpVersion((v) => v + 1);
      showToast("종목이 삭제되었습니다.", "success");
    } catch {
      setItems(snapshot);
      showToast("삭제에 실패했습니다. 다시 시도해 주세요.", "error");
    }
  }

  async function replaceItem(oldCode: string, newCode: string, newName: string, newTheme: string) {
    const snapshot = items;
    setItems((prev) =>
      prev.map((i) => (i.code === oldCode ? { code: newCode, name: newName, theme: newTheme } : i))
    );
    try {
      await updateWatchlistItem(oldCode, newCode);
      bumpVersion((v) => v + 1);
      showToast("종목이 수정되었습니다.", "success");
    } catch {
      setItems(snapshot);
      showToast("수정에 실패했습니다. 다시 시도해 주세요.", "error");
    }
  }

  return { items, isLoading, error, addItem, addError, removeItem, replaceItem, toast };
}
