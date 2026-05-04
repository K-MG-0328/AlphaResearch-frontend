"use client";

import { useAtom } from "jotai";

import {
  floorPctOverrideAtom,
  FLOOR_PCT_MIN,
  FLOOR_PCT_MAX,
  FLOOR_PCT_STEP,
} from "@/features/dashboard/application/atoms/chart/floorPctOverrideAtom";

// KR7 — z-score floor 임계값 사용자 조정 슬라이더.
// null = backend 기본 (KOSPI 5% / KOSDAQ 7% / US 5%) 사용.
// 값 지정 시 backend `floorPct` query 로 흘러가 종목 군 분류 무시하고 override.

export default function FloorPctSlider() {
  const [value, setValue] = useAtom(floorPctOverrideAtom);

  const handleSlide = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const handleReset = () => setValue(null);

  const display = value == null ? "자동 (KOSPI 5% · KOSDAQ 7%)" : `${value.toFixed(1)}%`;

  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-zinc-500 dark:text-zinc-400">floor</span>
      <input
        type="range"
        min={FLOOR_PCT_MIN}
        max={FLOOR_PCT_MAX}
        step={FLOOR_PCT_STEP}
        value={value ?? 5}
        onChange={handleSlide}
        className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-zinc-200 accent-indigo-500 dark:bg-zinc-700"
        aria-label="이상치 floor 임계값"
      />
      <span className="min-w-[140px] font-medium tabular-nums text-zinc-700 dark:text-zinc-200">
        {display}
      </span>
      {value != null && (
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full px-2 py-0.5 text-[10px] text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          자동
        </button>
      )}
    </div>
  );
}
