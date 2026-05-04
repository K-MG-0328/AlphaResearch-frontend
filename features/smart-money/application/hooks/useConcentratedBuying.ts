"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

import { concentratedBuyingAtom } from "@/features/smart-money/application/atoms/concentratedBuyingAtom";
import { investorFlowRefreshAtom } from "@/features/smart-money/application/atoms/smartMoneyBootstrapAtom";
import type { ConcentratedBuyingDays } from "@/features/smart-money/domain/model/concentratedBuyingItem";
import { fetchConcentratedBuying } from "@/features/smart-money/infrastructure/api/smartMoneyApi";

export function useConcentratedBuying(days: ConcentratedBuyingDays) {
  const [concentratedBuyingState, setConcentratedBuyingState] = useAtom(concentratedBuyingAtom);
  const refreshKey = useAtomValue(investorFlowRefreshAtom);

  useEffect(() => {
    setConcentratedBuyingState({ status: "LOADING" });

    fetchConcentratedBuying(days)
      .then((items) => {
        setConcentratedBuyingState({ status: "SUCCESS", items });
      })
      .catch(() => {
        setConcentratedBuyingState({ status: "ERROR", message: "집중 매수 데이터를 불러오는데 실패했습니다." });
      });
  }, [days, refreshKey, setConcentratedBuyingState]);

  return { concentratedBuyingState };
}
