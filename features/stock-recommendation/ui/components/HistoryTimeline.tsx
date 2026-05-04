"use client";

import { useState } from "react";

import type { AnalysisHistoryItem } from "@/features/stock-recommendation/domain/model/stockAnalysis";
import SignalBadge from "@/features/stock-recommendation/ui/components/SignalBadge";
import { stockAnalysisStyles } from "@/features/stock-recommendation/ui/components/stockAnalysisStyles";

interface Props {
  history: AnalysisHistoryItem[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function HistoryTimeline({ history }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const s = stockAnalysisStyles.historyTimeline;

  if (history.length === 0) return null;

  return (
    <div className={s.wrapper}>
      <h3 className={s.title}>분석 이력</h3>
      <ul className={s.list}>
        {history.map((item, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <li
              key={i}
              className={s.item}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className={s.itemHeader}>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.ticker}
                </span>
                <SignalBadge signal={item.overallSignal} />
                <span className={s.itemDate}>{formatDate(item.createdAt)}</span>
              </div>

              <p className={s.itemQuery}>{item.query}</p>

              {isExpanded && (
                <div className={s.expandedContent}>
                  {item.summary && (
                    <p className={s.expandedSummary}>{item.summary}</p>
                  )}
                  {item.keyPoints.length > 0 && (
                    <ul className={s.expandedPoints}>
                      {item.keyPoints.map((point, j) => (
                        <li key={j} className={s.expandedPoint}>
                          • {point}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-xs text-zinc-400">
                    처리 시간: {item.executionTimeMs.toLocaleString()}ms
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
