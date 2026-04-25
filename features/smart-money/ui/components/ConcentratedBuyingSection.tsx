"use client";

import { useState } from "react";
import { useConcentratedBuying } from "@/features/smart-money/application/hooks/useConcentratedBuying";
import type { ConcentratedBuyingDays } from "@/features/smart-money/domain/model/concentratedBuyingItem";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

function formatUk(amount: number): string {
  const uk = Math.round(amount / 100_000_000);
  return `${uk.toLocaleString("ko-KR")}억 원`;
}

const DAY_OPTIONS: { value: ConcentratedBuyingDays; label: string }[] = [
  { value: 3, label: "최근 3일" },
  { value: 5, label: "최근 5일" },
  { value: 10, label: "최근 10일" },
];

export default function ConcentratedBuyingSection() {
  const [days, setDays] = useState<ConcentratedBuyingDays>(5);
  const { concentratedBuyingState } = useConcentratedBuying(days);

  return (
    <div className={s.concentrated.section}>
      <div className={s.concentrated.sectionHeader}>
        <h2 className={s.concentrated.sectionTitle}>스마트머니 집중 매수 종목</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value) as ConcentratedBuyingDays)}
          className={s.concentrated.dropdown}
        >
          {DAY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {concentratedBuyingState.status === "LOADING" && (
        <div className={s.concentrated.loading}>데이터를 불러오는 중입니다...</div>
      )}

      {concentratedBuyingState.status === "ERROR" && (
        <div className={s.concentrated.error}>{concentratedBuyingState.message}</div>
      )}

      {concentratedBuyingState.status === "SUCCESS" && concentratedBuyingState.items.length === 0 && (
        <div className={s.concentrated.empty}>집중 매수 종목이 없습니다.</div>
      )}

      {concentratedBuyingState.status === "SUCCESS" && concentratedBuyingState.items.length > 0 && (
        <div className={s.concentrated.grid}>
          {concentratedBuyingState.items.map((item) => (
            <div key={item.stockCode} className={s.concentrated.card}>
              <div className={s.concentrated.cardHeader}>
                <span className={s.concentrated.cardName}>{item.stockName}</span>
                <span className={s.concentrated.cardCode}>{item.stockCode}</span>
              </div>

              <div className={s.concentrated.cardAmounts}>
                <div className={s.concentrated.cardAmountRow}>
                  <span className={s.concentrated.cardAmountLabel}>외국인 순매수</span>
                  <span className={s.concentrated.cardAmountValue}>{formatUk(item.foreignerNetBuy)}</span>
                </div>
                <div className={s.concentrated.cardAmountRow}>
                  <span className={s.concentrated.cardAmountLabel}>기관 순매수</span>
                  <span className={s.concentrated.cardAmountValue}>{formatUk(item.institutionNetBuy)}</span>
                </div>
              </div>

              <div className={s.concentrated.scoreWrap}>
                <div className={s.concentrated.scoreLabel}>
                  <span className={s.concentrated.scoreLabelText}>집중도 점수</span>
                  <span className={s.concentrated.scoreLabelValue}>{item.concentrationScore}</span>
                </div>
                <div className={s.concentrated.scoreBar}>
                  <div
                    className={s.concentrated.scoreBarFill}
                    style={{ width: `${Math.min(item.concentrationScore, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
