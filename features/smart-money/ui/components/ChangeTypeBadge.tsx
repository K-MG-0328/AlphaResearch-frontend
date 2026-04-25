import type { PortfolioChangeType } from "@/features/smart-money/domain/model/globalPortfolioItem";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

const LABELS: Record<PortfolioChangeType, string> = {
  NEW: "신규편입",
  INCREASED: "비중확대",
  DECREASED: "비중축소",
  CLOSED: "청산",
};

interface Props {
  changeType: PortfolioChangeType;
}

export default function ChangeTypeBadge({ changeType }: Props) {
  return (
    <span className={`${s.portfolio.badge.base} ${s.portfolio.badge[changeType]}`}>
      {LABELS[changeType]}
    </span>
  );
}
