"use client";

import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { krPortfolioRefreshAtom } from "@/features/smart-money/application/atoms/smartMoneyBootstrapAtom";
import type { KrInvestor, KrPortfolioItem } from "@/features/smart-money/domain/model/krPortfolioItem";
import { fetchKrInvestors, fetchKrPortfolio } from "@/features/smart-money/infrastructure/api/smartMoneyApi";

type InvestorsState =
  | { status: "LOADING" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; investors: KrInvestor[] };

type PortfolioState =
  | { status: "IDLE" }
  | { status: "LOADING" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; items: KrPortfolioItem[] };

export function useKrInvestors() {
  const [state, setState] = useState<InvestorsState>({ status: "LOADING" });
  const refreshKey = useAtomValue(krPortfolioRefreshAtom);

  useEffect(() => {
    fetchKrInvestors()
      .then((investors) => setState({ status: "SUCCESS", investors }))
      .catch(() => setState({ status: "ERROR", message: "투자자 목록을 불러오지 못했습니다." }));
  }, [refreshKey]);

  return { krInvestorsState: state };
}

export function useKrPortfolio(investorName: string | null) {
  const [state, setState] = useState<PortfolioState>({ status: "IDLE" });
  const refreshKey = useAtomValue(krPortfolioRefreshAtom);

  useEffect(() => {
    // investorName/refreshKey 변경 시 IDLE/LOADING reset — single transition.
    if (!investorName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "IDLE" });
      return;
    }
    setState({ status: "LOADING" });
    fetchKrPortfolio(investorName)
      .then((items) => setState({ status: "SUCCESS", items }))
      .catch(() => setState({ status: "ERROR", message: "포트폴리오를 불러오지 못했습니다." }));
  }, [investorName, refreshKey]);

  return { krPortfolioState: state };
}
