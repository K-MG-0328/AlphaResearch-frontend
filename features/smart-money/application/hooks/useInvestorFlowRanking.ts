"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

import { smartMoneyAtom } from "@/features/smart-money/application/atoms/smartMoneyAtom";
import { investorFlowRefreshAtom } from "@/features/smart-money/application/atoms/smartMoneyBootstrapAtom";
import type { InvestorType } from "@/features/smart-money/domain/model/investorFlowItem";
import { fetchInvestorFlowRanking } from "@/features/smart-money/infrastructure/api/smartMoneyApi";

export function useInvestorFlowRanking(investorType: InvestorType) {
  const [smartMoneyState, setSmartMoneyState] = useAtom(smartMoneyAtom);
  const refreshKey = useAtomValue(investorFlowRefreshAtom);

  useEffect(() => {
    setSmartMoneyState({ status: "LOADING" });

    fetchInvestorFlowRanking(investorType)
      .then((items) => {
        setSmartMoneyState({ status: "SUCCESS", items });
      })
      .catch(() => {
        setSmartMoneyState({ status: "ERROR", message: "데이터를 불러오는데 실패했습니다." });
      });
  }, [investorType, refreshKey, setSmartMoneyState]);

  return { smartMoneyState };
}
