import { atomWithStorage } from "jotai/utils";

// KR7 — 사용자 임계값 슬라이더. null = backend 기본(KOSPI 5/KOSDAQ 7/US 5) 사용.
// 명시적으로 값을 지정하면 backend `_floor_pct_for` 가 종목 군 분류 무시하고 override.
export const FLOOR_PCT_MIN = 1.0;
export const FLOOR_PCT_MAX = 15.0;
export const FLOOR_PCT_STEP = 0.1;

export const floorPctOverrideAtom = atomWithStorage<number | null>(
  "antelligen.dashboard.floorPctOverride",
  null,
);
