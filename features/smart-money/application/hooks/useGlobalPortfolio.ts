"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { globalPortfolioAtom, globalInvestorsAtom } from "@/features/smart-money/application/atoms/globalPortfolioAtom";
import { fetchGlobalPortfolio, fetchGlobalInvestors } from "@/features/smart-money/infrastructure/api/smartMoneyApi";

export function useGlobalInvestors() {
  const [investorsState, setInvestorsState] = useAtom(globalInvestorsAtom);

  useEffect(() => {
    fetchGlobalInvestors()
      .then((investors) => {
        setInvestorsState({ status: "SUCCESS", investors });
      })
      .catch(() => {
        setInvestorsState({ status: "ERROR", message: "투자자 목록을 불러오는데 실패했습니다." });
      });
  }, [setInvestorsState]);

  return { investorsState };
}

export function useGlobalPortfolio(investorId: string | null) {
  const [portfolioState, setPortfolioState] = useAtom(globalPortfolioAtom);

  useEffect(() => {
    if (!investorId) {
      setPortfolioState({ status: "IDLE" });
      return;
    }

    setPortfolioState({ status: "LOADING" });

    fetchGlobalPortfolio(investorId)
      .then((items) => {
        const reportedAt = items.length > 0 ? items[0].reportedAt : null;
        setPortfolioState({ status: "SUCCESS", items, reportedAt });
      })
      .catch(() => {
        setPortfolioState({ status: "ERROR", message: "포트폴리오 데이터를 불러오는데 실패했습니다." });
      });
  }, [investorId, setPortfolioState]);

  return { portfolioState };
}
