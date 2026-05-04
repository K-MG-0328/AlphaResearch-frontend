"use client";

import type { IChartApi } from "lightweight-charts";
import { useCallback, useSyncExternalStore } from "react";

// KR7 — 차트 줌 레벨에 따라 visible bar 개수를 추적.
// `subscribeVisibleLogicalRangeChange` 은 외부 store(차트 라이브러리) 이벤트 → useSyncExternalStore 패턴.
// chartApi 가 null 이면 null 반환 → 호출처는 "필터 없음" 으로 fallback.
export function useVisibleBarCount(chartApi: IChartApi | null): number | null {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!chartApi) return () => {};
      const timeScale = chartApi.timeScale();
      timeScale.subscribeVisibleLogicalRangeChange(notify);
      return () => timeScale.unsubscribeVisibleLogicalRangeChange(notify);
    },
    [chartApi],
  );

  const getSnapshot = useCallback(() => {
    if (!chartApi) return null;
    const range = chartApi.timeScale().getVisibleLogicalRange();
    return range ? Math.floor(range.to - range.from) : null;
  }, [chartApi]);

  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
