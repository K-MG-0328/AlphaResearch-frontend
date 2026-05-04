"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { anomalyBarsAtom } from "@/features/dashboard/application/atoms/anomaly/anomalyBarsAtom";
import { chartIntervalAtom } from "@/features/dashboard/application/atoms/chart/chartIntervalAtom";
import { floorPctOverrideAtom } from "@/features/dashboard/application/atoms/chart/floorPctOverrideAtom";
import { tickerAtom } from "@/features/dashboard/application/atoms/chart/tickerAtom";
import { useDebouncedValue } from "@/features/dashboard/application/hooks/useDebouncedValue";
import { fetchAnomalyBars } from "@/features/dashboard/infrastructure/api/anomalyBarsApi";

export function useAnomalyBars() {
  const ticker = useAtomValue(tickerAtom);
  const chartInterval = useAtomValue(chartIntervalAtom);
  const floorPctOverride = useAtomValue(floorPctOverrideAtom);
  const debouncedFloorPct = useDebouncedValue(floorPctOverride, 300);
  const setState = useSetAtom(anomalyBarsAtom);

  useEffect(() => {
    const effectiveTicker = ticker ?? "NVDA";
    setState({ status: "LOADING" });

    const controller = new AbortController();
    fetchAnomalyBars(effectiveTicker, chartInterval, debouncedFloorPct, controller.signal)
      .then((data) => {
        setState({
          status: "SUCCESS",
          ticker: data.ticker,
          chart_interval: data.chart_interval,
          events: data.events,
        });
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({
          status: "ERROR",
          message: "이상치 봉 데이터를 불러오는데 실패했습니다.",
        });
      });

    return () => controller.abort();
  }, [ticker, chartInterval, debouncedFloorPct, setState]);
}
