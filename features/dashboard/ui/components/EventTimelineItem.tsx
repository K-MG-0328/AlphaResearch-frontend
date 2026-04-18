import type { EconomicEvent, EconomicEventType } from "@/features/dashboard/domain/model/economicEvent";

const TYPE_STYLE: Record<EconomicEventType, { bg: string; text: string; border: string }> = {
  CPI:           { bg: "bg-amber-500/10",  text: "text-amber-500",  border: "border-amber-500/30" },
  INTEREST_RATE: { bg: "bg-blue-500/10",   text: "text-blue-500",   border: "border-blue-500/30" },
  UNEMPLOYMENT:  { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" },
};

interface EventTimelineItemProps {
  event: EconomicEvent;
  isSelected: boolean;
  onClick: (event: EconomicEvent) => void;
}

export default function EventTimelineItem({ event, isSelected, onClick }: EventTimelineItemProps) {
  const style = TYPE_STYLE[event.type];
  const diff = event.value - event.previous;
  const diffSign = diff > 0 ? "+" : "";

  return (
    <button
      type="button"
      data-event-id={event.id}
      onClick={() => onClick(event)}
      className={[
        "w-full rounded-xl border p-3 text-left transition-all",
        isSelected
          ? `${style.bg} ${style.border} ring-1 ring-inset ${style.border.replace("border-", "ring-")}`
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700",
      ].join(" ")}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}>
          {event.label}
        </span>
        <span className="text-xs text-zinc-400">{event.date}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          {event.value}%
        </span>
        <span className={`text-xs font-medium ${diff > 0 ? "text-red-500" : diff < 0 ? "text-blue-500" : "text-zinc-400"}`}>
          {diffSign}{diff.toFixed(2)}
        </span>
        <span className="ml-auto text-xs text-zinc-400">
          이전 {event.previous}%
        </span>
      </div>
      <div className="mt-1 text-xs text-zinc-400">
        예상 {event.forecast}%
      </div>
    </button>
  );
}
