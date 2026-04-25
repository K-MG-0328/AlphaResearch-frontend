"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { smartMoneyAtom } from "@/features/smart-money/application/atoms/smartMoneyAtom";
import { fetchInvestorFlowRanking } from "@/features/smart-money/infrastructure/api/smartMoneyApi";
import type { InvestorType } from "@/features/smart-money/domain/model/investorFlowItem";

export function useInvestorFlowRanking(investorType: InvestorType) {
  const [smartMoneyState, setSmartMoneyState] = useAtom(smartMoneyAtom);

  useEffect(() => {
    setSmartMoneyState({ status: "LOADING" });

    fetchInvestorFlowRanking(investorType)
      .then((items) => {
        setSmartMoneyState({ status: "SUCCESS", items });
      })
      .catch(() => {
        setSmartMoneyState({ status: "ERROR", message: "데이터를 불러오는데 실패했습니다." });
      });
  }, [investorType, setSmartMoneyState]);

  return { smartMoneyState };
}
