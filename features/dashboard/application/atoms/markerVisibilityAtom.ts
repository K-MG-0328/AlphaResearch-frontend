import { atomWithStorage } from "jotai/utils";

import type { AnomalyBarType } from "@/features/dashboard/infrastructure/api/anomalyBarsApi";

// KR7 — 차트 마커 가시성 토글. 사용자 선호를 localStorage 영속화.
// 신규 탐지기(volatility_cluster) 는 default OFF — KR8 검증 단계에서 사용자가 ON 결정.
export type MarkerVisibility = Record<AnomalyBarType, boolean>;

export const DEFAULT_MARKER_VISIBILITY: MarkerVisibility = {
  zscore: true,
  cumulative_5d: true,
  cumulative_20d: true,
  drawdown_start: true,
  drawdown_recovery: true,
  volatility_cluster: false,
};

// getOnInit: false — SSR/hydration mismatch 방지. 첫 렌더는 default 로 일치시키고
// 마운트 후 localStorage 값을 읽어 갱신한다.
export const markerVisibilityAtom = atomWithStorage<MarkerVisibility>(
  "alpharesearch.dashboard.markerVisibility",
  DEFAULT_MARKER_VISIBILITY,
  undefined,
  { getOnInit: false },
);
