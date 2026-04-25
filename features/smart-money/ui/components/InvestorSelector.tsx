import type { GlobalInvestor } from "@/features/smart-money/domain/model/globalPortfolioItem";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

interface Props {
  investors: GlobalInvestor[];
  selectedId: string | null;
  onChange: (id: string) => void;
}

export default function InvestorSelector({ investors, selectedId, onChange }: Props) {
  return (
    <select
      value={selectedId ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className={s.portfolio.selector}
    >
      <option value="" disabled>
        투자자 선택
      </option>
      {investors.map((investor) => (
        <option key={investor.id} value={investor.id}>
          {investor.name}
        </option>
      ))}
    </select>
  );
}
