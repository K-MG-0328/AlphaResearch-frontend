"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { concentratedBuyingAtom } from "@/features/smart-money/application/atoms/concentratedBuyingAtom";
import { fetchConcentratedBuying } from "@/features/smart-money/infrastructure/api/smartMoneyApi";
import type { ConcentratedBuyingDays } from "@/features/smart-money/domain/model/concentratedBuyingItem";

export function useConcentratedBuying(days: ConcentratedBuyingDays) {
  const [concentratedBuyingState, setConcentratedBuyingState] = useAtom(concentratedBuyingAtom);

  useEffect(() => {
    setConcentratedBuyingState({ status: "LOADING" });

    fetchConcentratedBuying(days)
      .then((items) => {
        setConcentratedBuyingState({ status: "SUCCESS", items });
      })
      .catch(() => {
        setConcentratedBuyingState({ status: "ERROR", message: "집중 매수 데이터를 불러오는데 실패했습니다." });
      });
  }, [days, setConcentratedBuyingState]);

  return { concentratedBuyingState };
}
