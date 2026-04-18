import { atom } from "jotai";
import type { EconomicEventState } from "@/features/dashboard/domain/state/economicEventState";
import type { EconomicEvent } from "@/features/dashboard/domain/model/economicEvent";

export const economicEventAtom = atom<EconomicEventState>({ status: "LOADING" });

export const selectedEventAtom = atom<EconomicEvent | null>(null);
