"use client";

import { useAtomValue } from "jotai";
import TimelineEventCard from "@/features/dashboard/ui/components/TimelineEventCard";
import { titleOverrideAtomFamily, titleLoadingAtomFamily } from "@/features/dashboard/application/atoms/lazyTitleAtoms";
import type { TimelineEvent } from "@/features/dashboard/domain/model/timelineEvent";

interface Props {
  event: TimelineEvent;
  eventIdx: number;
  eventKey: string;
  isLast?: boolean;
  isSelected?: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
  onClick?: (idx: number, event: TimelineEvent) => void;
}

export default function LazyTimelineEventCard({ eventKey, event, cardRef, ...rest }: Props) {
  const titleOverride = useAtomValue(titleOverrideAtomFamily(eventKey));
  const isTitleLoading = useAtomValue(titleLoadingAtomFamily(eventKey));

  const showConstituent = Boolean(event.constituent_ticker);
  const weightLabel =
    typeof event.weight_pct === "number" ? `${event.weight_pct.toFixed(2)}%` : null;

  return (
    <div className="relative">
      {showConstituent && (
        <div
          className="absolute top-2 right-2 z-10 rounded-md bg-indigo-600/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm"
          title={weightLabel ? `비중 ${weightLabel}` : undefined}
        >
          {event.constituent_ticker}
          {weightLabel && <span className="ml-1 opacity-80">{weightLabel}</span>}
        </div>
      )}
      <TimelineEventCard
        {...rest}
        event={event}
        cardRef={cardRef}
        titleOverride={titleOverride}
        isTitleLoading={isTitleLoading}
      />
    </div>
  );
}
