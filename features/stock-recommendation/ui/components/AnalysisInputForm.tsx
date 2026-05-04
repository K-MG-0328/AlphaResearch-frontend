"use client";

import { useState } from "react";

import { stockAnalysisStyles } from "@/features/stock-recommendation/ui/components/stockAnalysisStyles";

interface Props {
  onSubmit: (ticker: string, query: string) => void;
  isDisabled?: boolean;
  initialTicker?: string;
  initialQuery?: string;
}

export default function AnalysisInputForm({
  onSubmit,
  isDisabled = false,
  initialTicker = "",
  initialQuery = "",
}: Props) {
  const [ticker, setTicker] = useState(initialTicker);
  const [query, setQuery] = useState(initialQuery);
  const s = stockAnalysisStyles.inputForm;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticker.trim() || !query.trim() || isDisabled) return;
    onSubmit(ticker.trim(), query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1 sm:w-36 shrink-0">
        <label className={s.label}>종목 코드</label>
        <input
          type="text"
          className={s.input}
          placeholder="예: 005930"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          disabled={isDisabled}
          maxLength={10}
        />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label className={s.label}>질문</label>
        <input
          type="text"
          className={s.input}
          placeholder="예: 삼성전자 투자해도 될까요?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isDisabled}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shrink-0"
        disabled={isDisabled || !ticker.trim() || !query.trim()}
      >
        {isDisabled ? "분석 중..." : "분석하기"}
      </button>
    </form>
  );
}
