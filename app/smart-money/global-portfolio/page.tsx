import GlobalPortfolioTable from "@/features/smart-money/ui/components/GlobalPortfolioTable";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

export default function GlobalPortfolioPage() {
  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.header.wrap}>
          <h1 className={s.header.title}>글로벌 저명 투자자 포트폴리오</h1>
        </div>
        <GlobalPortfolioTable />
      </div>
    </div>
  );
}
