import type { AgentSignal } from "@/features/stock-recommendation/domain/model/stockAnalysis";
import ConfidenceBar from "@/features/stock-recommendation/ui/components/ConfidenceBar";
import SignalBadge from "@/features/stock-recommendation/ui/components/SignalBadge";
import { stockAnalysisStyles } from "@/features/stock-recommendation/ui/components/stockAnalysisStyles";

interface Props {
  ticker: string;
  answer: string;
  overallSignal: AgentSignal;
  overallConfidence: number;
}

export default function AnalysisResultHeader({
  ticker,
  answer,
  overallSignal,
  overallConfidence,
}: Props) {
  const s = stockAnalysisStyles.resultHeader;

  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        <span className={s.ticker}>{ticker}</span>
        <SignalBadge signal={overallSignal} />
      </div>
      <ConfidenceBar confidence={overallConfidence} />
      <p className={s.answer}>{answer}</p>
    </div>
  );
}
