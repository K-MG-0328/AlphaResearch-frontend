"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";

import { anomalyBarsAtom } from "@/features/dashboard/application/atoms/anomaly/anomalyBarsAtom";
import { anomalyCausalityAtom } from "@/features/dashboard/application/atoms/anomaly/anomalyCausalityAtom";
import { selectedAnomalyBarAtom } from "@/features/dashboard/application/atoms/anomaly/selectedAnomalyBarAtom";
import { useAnomalyCausality } from "@/features/dashboard/application/hooks/useAnomalyCausality";
import type {
  HypothesisResult,
  HypothesisSource,
} from "@/features/dashboard/domain/model/timelineEvent";
import type { AnomalyBar } from "@/features/dashboard/infrastructure/api/anomalyBarsApi";

/** 모든 hypothesis 의 sources 를 (label,url) 기준 dedupe 한다. KR4 "관련 뉴스" 펼침 섹션. */
function dedupeSources(hypotheses: HypothesisResult[]): HypothesisSource[] {
  const seen = new Set<string>();
  const out: HypothesisSource[] = [];
  for (const h of hypotheses) {
    for (const s of h.sources ?? []) {
      const key = `${s.label}|${s.url ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(s);
    }
  }
  return out;
}

/** 같은 ticker 의 다른 이상치 봉 중 target 과 가장 유사한 것 Top n.
 *
 * 유사도: 같은 direction 우선 → |return_pct| 절대 차이 작은 순 → |z_score| 차이.
 * target 봉 자체는 제외. backend 추가 필드 없이 anomalyBars 응답만으로 계산.
 */
function findSimilarEvents(target: AnomalyBar, all: AnomalyBar[], n = 3): AnomalyBar[] {
  const sameDir = all.filter(
    (b) => b.date !== target.date && b.direction === target.direction,
  );
  const scored = sameDir
    .map((b) => ({
      bar: b,
      retDiff: Math.abs(Math.abs(b.return_pct) - Math.abs(target.return_pct)),
      zDiff: Math.abs(b.z_score - target.z_score),
    }))
    .sort((a, b) => a.retDiff - b.retDiff || a.zDiff - b.zDiff);
  return scored.slice(0, n).map((x) => x.bar);
}

export function useAnomalyCausalityPopup() {
  const [selected, setSelected] = useAtom(selectedAnomalyBarAtom);
  const causalityState = useAtomValue(anomalyCausalityAtom);
  const barsState = useAtomValue(anomalyBarsAtom);
  const [expanded, setExpanded] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);

  // selectedAnomalyBar 변경 → causality fetch trigger (hook 내부 effect)
  useAnomalyCausality();

  const dedupedSources = useMemo(
    () =>
      causalityState.status === "SUCCESS"
        ? dedupeSources(causalityState.hypotheses)
        : [],
    [causalityState],
  );

  // KR4 펼치기: 같은 ticker 의 다른 이상치 봉 중 유사도 Top 3
  const similarEvents = useMemo<AnomalyBar[]>(() => {
    if (!selected) return [];
    if (barsState.status !== "SUCCESS") return [];
    if (barsState.ticker !== selected.ticker) return [];
    return findSimilarEvents(selected.bar, barsState.events, 3);
  }, [selected, barsState]);

  // ESC 키로 팝업 닫기
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, setSelected]);

  return {
    selected,
    setSelected,
    causalityState,
    expanded,
    setExpanded,
    limitsOpen,
    setLimitsOpen,
    dedupedSources,
    similarEvents,
  };
}
