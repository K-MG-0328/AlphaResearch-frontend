"use client";

import { useAtom, useAtomValue } from "jotai";
import { economicEventAtom, selectedEventAtom } from "@/features/dashboard/application/atoms/economicEventAtom";
import { useEconomicEvents } from "@/features/dashboard/application/hooks/useEconomicEvents";
import EventTimelineItem from "@/features/dashboard/ui/components/EventTimelineItem";
import type { EconomicEvent } from "@/features/dashboard/domain/model/economicEvent";

function TimelineSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-40 flex-shrink-0 animate-pulse rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-2 h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-5 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="mt-1 h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

export default function EventTimeline() {
  useEconomicEvents();

  const eventState = useAtomValue(economicEventAtom);
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom);

  const handleClick = (event: EconomicEvent) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  if (eventState.status === "LOADING") {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 h-4 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <TimelineSkeleton />
      </div>
    );
  }

  if (eventState.status === "ERROR") {
    return (
      <div className="flex h-24 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-red-500">{eventState.message}</p>
      </div>
    );
  }

  if (eventState.events.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-400">해당 기간에 경제 이벤트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        경제 핵심 이벤트
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {eventState.events.map((event) => (
          <div key={event.id} className="w-44 flex-shrink-0">
            <EventTimelineItem
              event={event}
              isSelected={selectedEvent?.id === event.id}
              onClick={handleClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
