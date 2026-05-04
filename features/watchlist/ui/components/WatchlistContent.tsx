"use client";

import { useRequireAuth } from "@/features/auth/application/hooks/useRequireAuth";
import { useStockThemes } from "@/features/auth/application/hooks/useStockThemes";
import { useWatchlist } from "@/features/watchlist/application/hooks/useWatchlist";

export default function WatchlistContent() {
  const { isLoading: authLoading, isReady } = useRequireAuth();

  const {
    items,
    isLoading: watchlistLoading,
    error: watchlistError,
    addItem,
    removeItem,
    toast,
  } = useWatchlist();

  const { themes, isLoading: themesLoading, error: themesError } = useStockThemes();

  const selectedCodes = new Set(items.map((i) => i.code));

  function toggle(code: string, name: string, theme: string) {
    if (selectedCodes.has(code)) {
      removeItem(code);
    } else {
      addItem(code, name, theme);
    }
  }

  if (authLoading) return null;
  if (!isReady) return null;

  const isLoading = watchlistLoading || themesLoading;
  const error = watchlistError ?? themesError;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">관심종목 관리</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          관심 있는 종목을 선택하거나 해제하세요
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">불러오는 중...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {!isLoading && !error && (
        <>
          {selectedCodes.size > 0 && (
            <p className="mb-5 text-xs text-zinc-500 dark:text-zinc-400">
              {selectedCodes.size}개 선택됨
            </p>
          )}

          <div className="space-y-8">
            {themes.map((themeGroup) => (
              <div key={themeGroup.theme}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {themeGroup.theme}
                </p>
                <div className="flex flex-wrap gap-2">
                  {themeGroup.stocks.map((stock) => {
                    const selected = selectedCodes.has(stock.code);
                    return (
                      <button
                        key={stock.code}
                        onClick={() => toggle(stock.code, stock.name, themeGroup.theme)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                          selected
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
                        }`}
                      >
                        {stock.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
