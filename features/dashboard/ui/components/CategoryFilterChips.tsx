"use client";

import type { TimelineCategory } from "@/features/dashboard/domain/model/timelineEvent";

export type CategoryFilter = "ALL" | TimelineCategory;

const FILTER_ORDER: CategoryFilter[] = [
  "ALL",
  "CORPORATE",
  "ANNOUNCEMENT",
  "MACRO",
];

const LABEL: Record<CategoryFilter, string> = {
  ALL: "전체",
  CORPORATE: "기업",
  ANNOUNCEMENT: "공시",
  MACRO: "매크로",
};

const ACTIVE_STYLE: Record<CategoryFilter, string> = {
  ALL: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
  CORPORATE: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  ANNOUNCEMENT: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  MACRO: "bg-violet-500/20 text-violet-600 dark:text-violet-400",
};

interface Props {
  selected: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  counts?: Partial<Record<CategoryFilter, number>>;
}

export default function CategoryFilterChips({ selected, onChange, counts }: Props) {
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {FILTER_ORDER.map((key) => {
        const isActive = selected === key;
        const count = counts?.[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
              isActive
                ? ACTIVE_STYLE[key]
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {LABEL[key]}
            {count !== undefined && count > 0 && (
              <span className="ml-1 text-[10px] opacity-60">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
