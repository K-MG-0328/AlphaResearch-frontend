"use client";

import { useState } from "react";
import { useGlobalInvestors, useGlobalPortfolio } from "@/features/smart-money/application/hooks/useGlobalPortfolio";
import type { GlobalPortfolioItem } from "@/features/smart-money/domain/model/globalPortfolioItem";
import InvestorSelector from "@/features/smart-money/ui/components/InvestorSelector";
import ChangeTypeBadge from "@/features/smart-money/ui/components/ChangeTypeBadge";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

function formatMarketValue(value: number): string {
  const uk = Math.round(value / 100_000_000);
  return `${uk.toLocaleString("ko-KR")}억`;
}

function filterItems(items: GlobalPortfolioItem[], onlyIncreasing: boolean): GlobalPortfolioItem[] {
  if (!onlyIncreasing) return items;
  return items.filter((item) => item.changeType === "NEW" || item.changeType === "INCREASED");
}

export default function GlobalPortfolioTable() {
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);
  const [onlyIncreasing, setOnlyIncreasing] = useState(false);

  const { investorsState } = useGlobalInvestors();
  const { portfolioState } = useGlobalPortfolio(selectedInvestorId);

  const investors = investorsState.status === "SUCCESS" ? investorsState.investors : [];

  return (
    <div>
      <div className={s.portfolio.toolbar}>
        <InvestorSelector
          investors={investors}
          selectedId={selectedInvestorId}
          onChange={setSelectedInvestorId}
        />

        <div className={s.portfolio.toggleWrap}>
          <span className={s.portfolio.toggleLabel}>신규편입·비중확대만 보기</span>
          <button
            role="switch"
            aria-checked={onlyIncreasing}
            onClick={() => setOnlyIncreasing((prev) => !prev)}
            className={`${s.portfolio.toggle} ${onlyIncreasing ? s.portfolio.toggleOn : s.portfolio.toggleOff}`}
          >
            <span
              className={`${s.portfolio.toggleThumb} ${onlyIncreasing ? s.portfolio.toggleThumbOn : s.portfolio.toggleThumbOff}`}
            />
          </button>
        </div>
      </div>

      {portfolioState.status === "SUCCESS" && portfolioState.reportedAt && (
        <p className={`mb-3 ${s.portfolio.reportedAt}`}>
          기준일: {portfolioState.reportedAt} (SEC 13F 분기 공시)
        </p>
      )}

      <div className={s.card}>
        {portfolioState.status === "IDLE" && (
          <div className={s.portfolio.idle}>투자자를 선택하면 포트폴리오가 표시됩니다.</div>
        )}

        {portfolioState.status === "LOADING" && (
          <div className={s.portfolio.loading}>데이터를 불러오는 중입니다...</div>
        )}

        {portfolioState.status === "ERROR" && (
          <div className={s.portfolio.error}>{portfolioState.message}</div>
        )}

        {portfolioState.status === "SUCCESS" && (() => {
          const filtered = filterItems(portfolioState.items, onlyIncreasing);
          if (filtered.length === 0) {
            return <div className={s.portfolio.empty}>표시할 종목이 없습니다.</div>;
          }
          return (
            <div className={s.portfolio.table.wrap}>
              <div className={s.portfolio.table.header}>
                <span>종목명</span>
                <span>티커</span>
                <span className="text-right">보유수량</span>
                <span className="text-right">시장가치</span>
                <span className="text-right">비중</span>
                <span className="text-right">변동</span>
              </div>
              {filtered.map((item, i) => (
                <div key={`${item.ticker}-${i}`} className={s.portfolio.table.row}>
                  <span className={s.portfolio.table.colName}>{item.stockName}</span>
                  <span className={s.portfolio.table.colTicker}>{item.ticker}</span>
                  <span className={s.portfolio.table.colNumber}>{item.sharesHeld.toLocaleString("en-US")}</span>
                  <span className={s.portfolio.table.colNumber}>{formatMarketValue(item.marketValue)}</span>
                  <span className={s.portfolio.table.colWeight}>{item.portfolioWeight.toFixed(2)}%</span>
                  <span className={s.portfolio.table.colBadge}>
                    <ChangeTypeBadge changeType={item.changeType} />
                  </span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
