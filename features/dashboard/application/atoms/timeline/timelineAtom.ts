import { atom } from "jotai";

import type { TimelineEvent } from "@/features/dashboard/domain/model/timelineEvent";
import type { TimelineState } from "@/features/dashboard/domain/state/timelineState";

export const timelineAtom = atom<TimelineState>({ status: "IDLE" });

export const selectedTimelineEventAtom = atom<{ idx: number; event: TimelineEvent } | null>(null);
