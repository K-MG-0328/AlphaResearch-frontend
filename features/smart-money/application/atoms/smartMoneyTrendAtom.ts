import { atom } from "jotai";
import type { SmartMoneyTrendState } from "@/features/smart-money/domain/state/smartMoneyTrendState";

export const smartMoneyTrendAtom = atom<SmartMoneyTrendState>({ status: "IDLE" });
