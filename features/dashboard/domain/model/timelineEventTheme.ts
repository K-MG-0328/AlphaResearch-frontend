import type { TimelineEvent } from "@/features/dashboard/domain/model/timelineEvent";

// 타임라인 이벤트의 시각적 톤(색·크기) 결정 규칙.
// 각 클래스 값은 Tailwind JIT 컴파일러가 정적으로 발견할 수 있도록 반드시 리터럴 문자열로 둔다.
// 동적 보간(`bg-${color}-500` 등) 금지.

export type TimelineColorTokens = {
  /** 점(dot) 배경 — `bg-* dark:bg-*` 페어 */
  dot: string;
  /** 카드 좌측 보더 — `border-l-* dark:border-l-*` 페어 */
  borderLeft: string;
  /** 세부 type 칩 배경 — `bg-* dark:bg-*` 페어 (투명도 포함) */
  chipBg: string;
  /** 세부 type 칩 텍스트 — `text-* dark:text-*` 페어 */
  chipText: string;
};

const COLOR_BLUE: TimelineColorTokens = {
  dot: "bg-blue-500 dark:bg-blue-400",
  borderLeft: "border-l-blue-500 dark:border-l-blue-400",
  chipBg: "bg-blue-500/10 dark:bg-blue-400/10",
  chipText: "text-blue-600 dark:text-blue-300",
};

const COLOR_VIOLET: TimelineColorTokens = {
  dot: "bg-violet-500 dark:bg-violet-400",
  borderLeft: "border-l-violet-500 dark:border-l-violet-400",
  chipBg: "bg-violet-500/10 dark:bg-violet-400/10",
  chipText: "text-violet-600 dark:text-violet-300",
};

const COLOR_ORANGE: TimelineColorTokens = {
  dot: "bg-orange-500 dark:bg-orange-400",
  borderLeft: "border-l-orange-500 dark:border-l-orange-400",
  chipBg: "bg-orange-500/10 dark:bg-orange-400/10",
  chipText: "text-orange-600 dark:text-orange-300",
};

const COLOR_AMBER: TimelineColorTokens = {
  dot: "bg-amber-600 dark:bg-amber-500",
  borderLeft: "border-l-amber-600 dark:border-l-amber-500",
  chipBg: "bg-amber-600/10 dark:bg-amber-500/10",
  chipText: "text-amber-700 dark:text-amber-300",
};

const COLOR_TEAL: TimelineColorTokens = {
  dot: "bg-teal-500 dark:bg-teal-400",
  borderLeft: "border-l-teal-500 dark:border-l-teal-400",
  chipBg: "bg-teal-500/10 dark:bg-teal-400/10",
  chipText: "text-teal-600 dark:text-teal-300",
};

const COLOR_ROSE: TimelineColorTokens = {
  dot: "bg-rose-700 dark:bg-rose-500",
  borderLeft: "border-l-rose-700 dark:border-l-rose-500",
  chipBg: "bg-rose-700/10 dark:bg-rose-500/10",
  chipText: "text-rose-700 dark:text-rose-300",
};

const COLOR_SLATE: TimelineColorTokens = {
  dot: "bg-slate-500 dark:bg-slate-400",
  borderLeft: "border-l-slate-500 dark:border-l-slate-400",
  chipBg: "bg-slate-500/10 dark:bg-slate-400/10",
  chipText: "text-slate-600 dark:text-slate-300",
};

const COLOR_INDIGO: TimelineColorTokens = {
  dot: "bg-indigo-500 dark:bg-indigo-400",
  borderLeft: "border-l-indigo-500 dark:border-l-indigo-400",
  chipBg: "bg-indigo-500/10 dark:bg-indigo-400/10",
  chipText: "text-indigo-600 dark:text-indigo-300",
};

const COLOR_ZINC: TimelineColorTokens = {
  dot: "bg-zinc-400 dark:bg-zinc-500",
  borderLeft: "border-l-zinc-300 dark:border-l-zinc-700",
  chipBg: "bg-zinc-500/10 dark:bg-zinc-400/10",
  chipText: "text-zinc-600 dark:text-zinc-300",
};

/** type → 색상 토큰. 매핑이 없는 type은 category fallback에서 처리한다. */
const TYPE_COLOR: Record<string, TimelineColorTokens> = {
  // ANNOUNCEMENT 8종
  MERGER_ACQUISITION: COLOR_BLUE,
  MANAGEMENT_CHANGE: COLOR_VIOLET,
  REGULATORY: COLOR_ORANGE,
  ACCOUNTING_ISSUE: COLOR_AMBER,
  PRODUCT_LAUNCH: COLOR_TEAL,
  CRISIS: COLOR_ROSE,
  CONTRACT: COLOR_BLUE,
  MAJOR_EVENT: COLOR_ZINC,
  // CORPORATE 자본행위 5종 — 모두 슬레이트
  STOCK_SPLIT: COLOR_SLATE,
  RIGHTS_OFFERING: COLOR_SLATE,
  BUYBACK: COLOR_SLATE,
  BUYBACK_CANCEL: COLOR_SLATE,
  DISCLOSURE: COLOR_SLATE,
};

/** category fallback — type이 매핑 테이블에 없을 때만 사용. */
const CATEGORY_FALLBACK_COLOR: Record<string, TimelineColorTokens> = {
  CORPORATE: COLOR_SLATE,
  ANNOUNCEMENT: COLOR_ZINC,
  MACRO: COLOR_INDIGO,
};

/** 이벤트의 시각 톤을 결정한다. type 우선, 없으면 category, 그것도 없으면 zinc. */
export function getTimelineColor(event: TimelineEvent): TimelineColorTokens {
  return TYPE_COLOR[event.type] ?? CATEGORY_FALLBACK_COLOR[event.category] ?? COLOR_ZINC;
}

// ── 크기 차등 ──────────────────────────────────────────────────────────

export type TimelineSize = "L" | "M" | "S";

export type TimelineSizeTokens = {
  dot: string;
  cardPadding: string;
  titleClass: string;
};

const SIZE_TOKENS: Record<TimelineSize, TimelineSizeTokens> = {
  L: {
    dot: "h-3.5 w-3.5",
    cardPadding: "p-4",
    titleClass: "text-base font-bold",
  },
  M: {
    dot: "h-2.5 w-2.5",
    cardPadding: "p-3",
    titleClass: "text-sm font-semibold",
  },
  S: {
    dot: "h-2 w-2",
    cardPadding: "py-2 px-3",
    titleClass: "text-xs font-medium",
  },
};

// 강제 L승급 type — importance_score가 부재라도 시각적으로 도드라지도록.
const FORCE_LARGE_TYPES = new Set(["CRISIS", "MERGER_ACQUISITION", "ACCOUNTING_ISSUE"]);

// 기본 M승급 type — score 없을 때 S로 떨어지지 않도록.
const FORCE_MEDIUM_TYPES = new Set([
  "REGULATORY",
  "MANAGEMENT_CHANGE",
  "RIGHTS_OFFERING",
  "PRODUCT_LAUNCH",
]);

const L_THRESHOLD = 0.85;
const M_THRESHOLD = 0.5;

export function getTimelineSize(event: TimelineEvent): TimelineSize {
  if (FORCE_LARGE_TYPES.has(event.type)) return "L";

  const score = event.importance_score;
  if (typeof score === "number") {
    if (score >= L_THRESHOLD) return "L";
    if (score >= M_THRESHOLD) return "M";
    return "S";
  }

  if (FORCE_MEDIUM_TYPES.has(event.type)) return "M";
  return "S";
}

export function getTimelineSizeTokens(event: TimelineEvent): TimelineSizeTokens {
  return SIZE_TOKENS[getTimelineSize(event)];
}
