/**
 * NasdaqChart 마커 빌드 helper.
 *
 * 이상치 봉(★/🔻/📉/🔽/🔼/⚡) + 사용자 선택 봉(보라 ●) 을 lightweight-charts
 * 의 SeriesMarker[] 로 변환. 순수 함수 — ref/atom 의존성 없음.
 */

import type { SeriesMarker, Time } from "lightweight-charts";

import type { NasdaqBar } from "@/features/dashboard/domain/model/nasdaqBar";
import type { AnomalyBar } from "@/features/dashboard/infrastructure/api/anomalyBarsApi";

const MARKER_COLOR_SELECTED = "#a855f7";
// 한국식: 상승 = 빨강, 하락 = 파랑 (ADR-0001 §4 결정)
const ANOMALY_COLOR_STAR = "#EAB308";
const ANOMALY_COLOR_CUMULATIVE_5D = "#F97316";
const ANOMALY_COLOR_CUMULATIVE_20D = "#DC2626";
const ANOMALY_COLOR_DRAWDOWN_START = "#7C3AED";
const ANOMALY_COLOR_DRAWDOWN_RECOVERY = "#10B981";
const ANOMALY_COLOR_VOLATILITY_CLUSTER = "#F59E0B";

/** OKR 다층 탐지 — backend type 별 마커 텍스트·색. */
export const ANOMALY_MARKER_BY_TYPE: Record<string, { text: string; color: string }> = {
  zscore:             { text: "★", color: ANOMALY_COLOR_STAR },
  cumulative_5d:      { text: "🔻", color: ANOMALY_COLOR_CUMULATIVE_5D },
  cumulative_20d:     { text: "📉", color: ANOMALY_COLOR_CUMULATIVE_20D },
  drawdown_start:     { text: "🔽", color: ANOMALY_COLOR_DRAWDOWN_START },
  drawdown_recovery:  { text: "🔼", color: ANOMALY_COLOR_DRAWDOWN_RECOVERY },
  volatility_cluster: { text: "⚡", color: ANOMALY_COLOR_VOLATILITY_CLUSTER },
};

/** chartBars 중 evDate 와 가장 가까운 bar.time 을 반환. bars 빈 배열이면 evDate 그대로. */
function snapToNearestBarTime(evDate: string, chartBars: NasdaqBar[]): string {
  if (chartBars.length === 0) return evDate;
  const evTs = new Date(evDate).getTime();
  let closestTime = chartBars[0].time;
  let minDiff = Math.abs(new Date(closestTime).getTime() - evTs);
  for (const bar of chartBars) {
    const diff = Math.abs(new Date(bar.time).getTime() - evTs);
    if (diff < minDiff) {
      minDiff = diff;
      closestTime = bar.time;
    }
  }
  return closestTime;
}

/** zscore 마커 줌 필터 — visibleBarCount 가 클수록 큰 변동만 노출. 다른 type 은 면제. */
function shouldFilterByZoom(
  evType: string,
  absReturn: number,
  visibleBarCount: number | null,
): boolean {
  if (evType !== "zscore" || visibleBarCount == null) return false;
  if (visibleBarCount > 500 && absReturn < 10) return true;
  if (visibleBarCount > 200 && absReturn < 7) return true;
  return false;
}

export interface BuildMarkersInput {
  anomalyEvents: AnomalyBar[];
  chartBars: NasdaqBar[];
  markerVisibility: Record<string, boolean>;
  visibleBarCount: number | null;
  selectedBarTime: string | null;
}

/**
 * 이상치 봉 + 선택된 봉 마커 배열 빌드.
 *
 * - 이상치 봉: snap to nearest bar time, 같은 봉에 여러 이벤트면 |return_pct| 최대만
 * - markerVisibility 가 false 인 type 은 표시 안 함 (KR7)
 * - zscore 는 visibleBarCount 기반 줌 필터 적용
 * - 선택된 봉: 보라 원 (size 1)
 * - 결과는 time 오름차순 정렬 (lightweight-charts 요구사항)
 */
export function buildChartMarkers(input: BuildMarkersInput): SeriesMarker<Time>[] {
  const { anomalyEvents, chartBars, markerVisibility, visibleBarCount, selectedBarTime } = input;
  const markers: SeriesMarker<Time>[] = [];

  // 1) 이상치 봉 마커 — snap + dedupe (가장 강한 이벤트만)
  if (chartBars.length > 0) {
    const strongestByBar = new Map<string, AnomalyBar>();
    for (const ev of anomalyEvents) {
      const evType = ev.type ?? "zscore";
      if (!markerVisibility[evType]) continue;
      if (shouldFilterByZoom(evType, Math.abs(ev.return_pct), visibleBarCount)) continue;

      const closestTime = snapToNearestBarTime(ev.date, chartBars);
      const existing = strongestByBar.get(closestTime);
      if (!existing || Math.abs(ev.return_pct) > Math.abs(existing.return_pct)) {
        strongestByBar.set(closestTime, ev);
      }
    }
    for (const [barTime, ev] of strongestByBar) {
      const variant = ANOMALY_MARKER_BY_TYPE[ev.type ?? "zscore"] ?? ANOMALY_MARKER_BY_TYPE.zscore;
      markers.push({
        time: barTime as Time,
        position: ev.direction === "up" ? "aboveBar" : "belowBar",
        shape: "circle",
        color: variant.color,
        size: 0,
        text: variant.text,
      });
    }
  }

  // 2) 사용자가 선택한 봉 — 보라 원 하이라이트
  if (selectedBarTime) {
    markers.push({
      time: selectedBarTime as Time,
      position: "aboveBar",
      shape: "circle",
      color: MARKER_COLOR_SELECTED,
      size: 1,
    });
  }

  // lightweight-charts 는 time 오름차순으로 정렬된 markers 를 요구
  markers.sort((a, b) => String(a.time).localeCompare(String(b.time)));
  return markers;
}
