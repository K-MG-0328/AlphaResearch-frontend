"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { chartIntervalAtom } from "@/features/dashboard/application/atoms/chart/chartIntervalAtom";
import { companyNameAtom } from "@/features/dashboard/application/atoms/chart/companyNameAtom";
import { dashboardAtom } from "@/features/dashboard/application/atoms/chart/dashboardAtom";
import { nasdaqAtom } from "@/features/dashboard/application/atoms/chart/nasdaqAtom";
import { tickerAtom } from "@/features/dashboard/application/atoms/chart/tickerAtom";
import { fetchStockBars } from "@/features/dashboard/infrastructure/api/stockBarsApi";
import { HttpError } from "@/infrastructure/http/httpClient";

// tickerAtom 이 null 일 때 사용하는 default ticker — useTimeline / useAnomalyBars 와
// 일관된 fallback. 과거 useNasdaqChart 가 nasdaq(=^IXIC) endpoint 로 분기하던
// 흐름을 stockBars endpoint 로 통일 (chartInterval 탭이 stockBars에는 정상 반응).
const DEFAULT_TICKER = "NVDA";

export function useNasdaqChart() {
  const [chartInterval, setChartInterval] = useAtom(chartIntervalAtom);
  const tickerValue = useAtomValue(tickerAtom);
  const ticker = tickerValue ?? DEFAULT_TICKER;
  const setNasdaq = useSetAtom(nasdaqAtom);
  const setDashboard = useSetAtom(dashboardAtom);
  const setCompanyName = useSetAtom(companyNameAtom);

  useEffect(() => {
    setNasdaq({ status: "LOADING" });

    fetchStockBars(ticker, chartInterval)
      .then(({ bars, companyName }) => {
        setNasdaq({ status: "SUCCESS", bars });
        setCompanyName(companyName);
        setDashboard({ status: "LOADED" });
      })
      .catch((err) => {
        const is404 = err instanceof HttpError && err.status === 404;
        setNasdaq({
          status: "ERROR",
          message: is404
            ? `'${ticker}' 종목을 찾을 수 없습니다.`
            : `${ticker} 데이터를 불러오는데 실패했습니다.`,
        });
        setCompanyName(null);
        setDashboard({ status: "ERROR", message: "대시보드 로딩에 실패했습니다." });
      });
  }, [chartInterval, ticker, setNasdaq, setDashboard, setCompanyName]);

  return { chartInterval, setChartInterval };
}
