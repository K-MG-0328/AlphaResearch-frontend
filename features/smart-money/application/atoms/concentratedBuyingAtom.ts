import { atom } from "jotai";
import type { ConcentratedBuyingState } from "@/features/smart-money/domain/state/concentratedBuyingState";

export const concentratedBuyingAtom = atom<ConcentratedBuyingState>({ status: "LOADING" });
