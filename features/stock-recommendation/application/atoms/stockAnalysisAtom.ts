import { atom } from "jotai";

import type { AnalysisHistoryItem } from "@/features/stock-recommendation/domain/model/stockAnalysis";
import type { StockAnalysisState } from "@/features/stock-recommendation/domain/state/stockAnalysisState";

export const stockAnalysisAtom = atom<StockAnalysisState>({ status: "IDLE" });

export const analysisHistoryAtom = atom<AnalysisHistoryItem[]>([]);
