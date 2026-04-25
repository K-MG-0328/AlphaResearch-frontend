import { atom } from "jotai";
import type { SmartMoneyState } from "@/features/smart-money/domain/state/smartMoneyState";

export const smartMoneyAtom = atom<SmartMoneyState>({ status: "LOADING" });
