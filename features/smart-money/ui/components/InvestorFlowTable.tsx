"use client";

import { useState } from "react";

import { useInvestorFlowRanking } from "@/features/smart-money/application/hooks/useInvestorFlowRanking";
import { useInvestorFlowTrend } from "@/features/smart-money/application/hooks/useInvestorFlowTrend";
import type { InvestorType } from "@/features/smart-money/domain/model/investorFlowItem";
import InvestorFlowChart from "@/features/smart-money/ui/components/InvestorFlowChart";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

function formatNetBuyAmount(amount: number): string {
  const uk = Math.round(amount / 100_000_000);
  return `${uk.toLocaleString("ko-KR")}억 원`;
}

interface Props {
  investorType: InvestorType;
}

export default function InvestorFlowTable({ investorType }: Props) {
  const { smartMoneyState } = useInvestorFlowRanking(investorType);
  const { loadTrend, clearTrend } = useInvestorFlowTrend();
  const [selectedStock, setSelectedStock] = useState<{ stockCode: string; stockName: string } | null>(null);

  function handleRowClick(stockCode: string, stockName: string) {
    if (selectedStock?.stockCode === stockCode) {
      setSelectedStock(null);
      clearTrend();
      return;
    }
    setSelectedStock({ stockCode, stockName });
    loadTrend(stockCode);
  }

  function handleChartClose() {
    setSelectedStock(null);
    clearTrend();
  }

  if (smartMoneyState.status === "LOADING") {
    return (
      <div className={s.card}>
        <div className={s.loading}>데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (smartMoneyState.status === "ERROR") {
    return (
      <div className={s.card}>
        <div className={s.error}>{smartMoneyState.message}</div>
      </div>
    );
  }

  const { items } = smartMoneyState;

  if (items.length === 0) {
    return (
      <div className={s.card}>
        <div className={s.empty}>
          <span className={s.emptyText}>조회된 데이터가 없습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={s.card}>
        <div className={s.table.wrap}>
          <div className={s.table.header}>
            <span>순위</span>
            <span>종목명</span>
            <span>종목코드</span>
            <span className="text-right">순매수금액</span>
            <span className="text-right">순매수수량</span>
          </div>
          {items.map((item) => {
            const isSelected = selectedStock?.stockCode === item.stockCode;
            return (
              <button
                key={item.stockCode}
                className={`w-full text-left ${isSelected ? s.tableRowSelected : s.tableRowClickable}`}
                onClick={() => handleRowClick(item.stockCode, item.stockName)}
              >
                <span className={s.table.colRank}>{item.rank}</span>
                <span className={s.table.colName}>{item.stockName}</span>
                <span className={s.table.colCode}>{item.stockCode}</span>
                <span className={s.table.colAmount}>{formatNetBuyAmount(item.netBuyAmount)}</span>
                <span className={s.table.colQuantity}>{item.netBuyQuantity.toLocaleString("ko-KR")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedStock && (
        <InvestorFlowChart
          stockCode={selectedStock.stockCode}
          stockName={selectedStock.stockName}
          onClose={handleChartClose}
        />
      )}
    </div>
  );
}
