"use client";

import { useState } from "react";

import { useStockThemes } from "@/features/auth/application/hooks/useStockThemes";

interface Props {
  title?: string;
  existingCodes: string[];
  excludeCode?: string;
  actionError: string | null;
  onSelect: (code: string, name: string, theme: string) => void;
  onClose: () => void;
}

export default function AddStockModal({
  title = "종목 추가",
  existingCodes,
  excludeCode,
  actionError,
  onSelect,
  onClose,
}: Props) {
  const { themes, isLoading } = useStockThemes();
  const [selectedTheme, setSelectedTheme] = useState<string>("전체");
  const [query, setQuery] = useState("");

  const filteredThemes =
    selectedTheme === "전체" ? themes : themes.filter((t) => t.theme === selectedTheme);

  const filteredStocks = filteredThemes.flatMap((t) =>
    t.stocks
      .filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase())
      )
      .map((s) => ({ ...s, theme: t.theme }))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
          <button
            onClick={onClose}
            className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            닫기
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="종목명 또는 코드 검색"
          className="mb-4 h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50"
        />

        {!isLoading && (
          <div className="mb-4 flex flex-wrap gap-2">
            {["전체", ...themes.map((t) => t.theme)].map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTheme === theme
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className="py-8 text-center text-sm text-zinc-400">불러오는 중...</p>
        ) : (
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {filteredStocks.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-400">검색 결과가 없습니다.</p>
            ) : (
              filteredStocks.map((stock) => {
                const disabled =
                  existingCodes.includes(stock.code) && stock.code !== excludeCode;
                return (
                  <button
                    key={stock.code}
                    disabled={disabled}
                    onClick={() => onSelect(stock.code, stock.name, stock.theme)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                      disabled
                        ? "cursor-not-allowed bg-zinc-50 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {stock.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">{stock.code}</span>
                      {disabled && (
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                          추가됨
                        </span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}

        {actionError && (
          <p className="mt-3 text-center text-xs text-red-500 dark:text-red-400">{actionError}</p>
        )}
      </div>
    </div>
  );
}
