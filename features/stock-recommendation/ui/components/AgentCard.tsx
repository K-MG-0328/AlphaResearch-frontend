import type {
  AgentResult,
  DisclosureData,
  FinanceData,
} from "@/features/stock-recommendation/domain/model/stockAnalysis";
import ConfidenceBar from "@/features/stock-recommendation/ui/components/ConfidenceBar";
import DisclosureDetails from "@/features/stock-recommendation/ui/components/DisclosureDetails";
import FinanceDataTable from "@/features/stock-recommendation/ui/components/FinanceDataTable";
import SignalBadge from "@/features/stock-recommendation/ui/components/SignalBadge";
import { stockAnalysisStyles } from "@/features/stock-recommendation/ui/components/stockAnalysisStyles";

interface Props {
  result: AgentResult;
}

const AGENT_LABELS: Record<string, string> = {
  news: "뉴스",
  disclosure: "공시",
  finance: "재무",
  sentiment: "SNS 감정분석",
};

export default function AgentCard({ result }: Props) {
  const s = stockAnalysisStyles.agentCard;
  const label = AGENT_LABELS[result.agentName] ?? result.agentName;

  if (result.status === "error") {
    return (
      <div className={s.wrapper}>
        <div className={s.header}>
          <span className={s.name}>{label}</span>
        </div>
        <div className={s.errorWrapper}>
          <span>⚠</span>
          <span>분석 실패{result.errorMessage ? `: ${result.errorMessage}` : ""}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <span className={s.name}>{label}</span>
        <SignalBadge signal={result.signal} />
      </div>

      {result.confidence !== null && (
        <ConfidenceBar confidence={result.confidence} />
      )}

      {result.summary && <p className={s.summary}>{result.summary}</p>}

      {result.keyPoints.length > 0 && (
        <ul className={s.keyPointsList}>
          {result.keyPoints.map((point, i) => (
            <li key={i} className={s.keyPoint}>
              <span className={s.keyPointDot} />
              {point}
            </li>
          ))}
        </ul>
      )}

      {result.agentName === "finance" && (
        <FinanceDataTable data={result.data as FinanceData} />
      )}

      {result.agentName === "disclosure" && (
        <DisclosureDetails data={result.data as DisclosureData} />
      )}

      <p className={s.execTime}>처리 시간: {result.executionTimeMs.toLocaleString()}ms</p>
    </div>
  );
}
