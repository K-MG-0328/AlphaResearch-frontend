import { atom } from "jotai";

import type { GlobalPortfolioState, GlobalInvestorsState } from "@/features/smart-money/domain/state/globalPortfolioState";

export const globalPortfolioAtom = atom<GlobalPortfolioState>({ status: "IDLE" });
export const globalInvestorsAtom = atom<GlobalInvestorsState>({ status: "LOADING" });
