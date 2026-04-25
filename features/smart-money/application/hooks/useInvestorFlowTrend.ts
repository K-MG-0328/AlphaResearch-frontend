"use client";

import { useAtom } from "jotai";
import { smartMoneyTrendAtom } from "@/features/smart-money/application/atoms/smartMoneyTrendAtom";
import { fetchInvestorFlowTrend } from "@/features/smart-money/infrastructure/api/smartMoneyApi";

export function useInvestorFlowTrend() {
  const [trendState, setTrendState] = useAtom(smartMoneyTrendAtom);

  function loadTrend(stockCode: string) {
    setTrendState({ status: "LOADING" });

    fetchInvestorFlowTrend(stockCode)
      .then((trend) => {
        setTrendState({ status: "SUCCESS", trend });
      })
      .catch(() => {
        setTrendState({ status: "ERROR", message: "차트 데이터를 불러오는데 실패했습니다." });
      });
  }

  function clearTrend() {
    setTrendState({ status: "IDLE" });
  }

  return { trendState, loadTrend, clearTrend };
}
