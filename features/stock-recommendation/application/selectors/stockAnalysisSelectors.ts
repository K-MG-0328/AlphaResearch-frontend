import { atom } from "jotai";

import {
  stockAnalysisAtom,
} from "@/features/stock-recommendation/application/atoms/stockAnalysisAtom";
import type {
  AgentSignal,
  StockAnalysisResult,
} from "@/features/stock-recommendation/domain/model/stockAnalysis";

export const isAnalyzingAtom = atom(
  (get) => get(stockAnalysisAtom).status === "ANALYZING"
);

export const analysisResultAtom = atom<StockAnalysisResult | null>((get) => {
  const s = get(stockAnalysisAtom);
  return s.status === "SUCCESS" ? s.result : null;
});

export const overallSignalAtom = atom<AgentSignal>((get) => {
  const result = get(analysisResultAtom);
  if (!result) return null;

  const signals = result.agentResults
    .map((r) => r.signal)
    .filter((s): s is NonNullable<AgentSignal> => s !== null);

  if (signals.length === 0) return "neutral";

  const counts = { bullish: 0, bearish: 0, neutral: 0 };
  for (const s of signals) counts[s]++;

  if (counts.bullish > counts.bearish && counts.bullish > counts.neutral)
    return "bullish";
  if (counts.bearish > counts.bullish && counts.bearish > counts.neutral)
    return "bearish";
  return "neutral";
});

export const overallConfidenceAtom = atom<number>((get) => {
  const result = get(analysisResultAtom);
  if (!result) return 0;

  const financeAgent = result.agentResults.find(
    (r) => r.agentName === "finance"
  );
  if (financeAgent?.confidence !== null && financeAgent?.confidence !== undefined)
    return financeAgent.confidence;

  const confidences = result.agentResults
    .map((r) => r.confidence)
    .filter((c): c is number => c !== null);

  if (confidences.length === 0) return 0;
  return confidences.reduce((a, b) => a + b, 0) / confidences.length;
});
