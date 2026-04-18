"use client";

import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type CandlestickData,
  type SeriesMarker,
  type Time,
} from "lightweight-charts";
import { nasdaqAtom } from "@/features/dashboard/application/atoms/nasdaqAtom";
import { economicEventAtom, selectedEventAtom } from "@/features/dashboard/application/atoms/economicEventAtom";
import { periodAtom } from "@/features/dashboard/application/atoms/periodAtom";
import { chartApiAtom, chartContainerAtom } from "@/features/dashboard/application/atoms/chartApiAtom";
import { useNasdaqChart } from "@/features/dashboard/application/hooks/useNasdaqChart";
import ChartSkeleton from "@/features/dashboard/ui/components/skeletons/ChartSkeleton";
import PeriodTabs from "@/features/dashboard/ui/components/PeriodTabs";
import type { EconomicEventType } from "@/features/dashboard/domain/model/economicEvent";

const MARKER_COLOR: Record<EconomicEventType, string> = {
  CPI:           "#f59e0b",
  INTEREST_RATE: "#3b82f6",
  UNEMPLOYMENT:  "#10b981",
};

export default function NasdaqChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  const nasdaqState = useAtomValue(nasdaqAtom);
  const economicEventState = useAtomValue(economicEventAtom);
  const selectedEvent = useAtomValue(selectedEventAtom);
  const period = useAtomValue(periodAtom);
  const { setPeriod } = useNasdaqChart();
  const setChartApi = useSetAtom(chartApiAtom);
  const setChartContainer = useSetAtom(chartContainerAtom);

  // 차트 초기화 + 캔들스틱 데이터 바인딩
  useEffect(() => {
    if (nasdaqState.status !== "SUCCESS" || !containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#71717a",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#3f3f46" },
      timeScale: { borderColor: "#3f3f46", timeVisible: true },
      width: containerRef.current.clientWidth,
      height: 320,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#3b82f6",
      downColor: "#ef4444",
      borderUpColor: "#3b82f6",
      borderDownColor: "#ef4444",
      wickUpColor: "#3b82f6",
      wickDownColor: "#ef4444",
    });

    const data: CandlestickData<Time>[] = nasdaqState.bars.map((bar) => ({
      time: bar.time as Time,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
    }));

    series.setData(data);
    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;
    markersRef.current = createSeriesMarkers(series, []);
    setChartApi(chart);
    setChartContainer(containerRef.current);

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) chart.applyOptions({ width });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      markersRef.current = null;
      setChartApi(null);
      setChartContainer(null);
    };
  }, [nasdaqState, setChartApi, setChartContainer]);

  // 마커 바인딩 — 1D는 분봉(Unix timestamp)이라 일자 마커 미지원으로 스킵
  useEffect(() => {
    if (!markersRef.current || economicEventState.status !== "SUCCESS" || period === "1D") return;

    const markers: SeriesMarker<Time>[] = economicEventState.events
      .map((event) => ({
        time: event.date as Time,
        position: "aboveBar" as const,
        shape: "circle" as const,
        color: MARKER_COLOR[event.type],
        text: `${event.label} ${event.value}%`,
        size: selectedEvent?.id === event.id ? 2 : 1,
      }))
      .sort((a, b) => String(a.time).localeCompare(String(b.time)));

    markersRef.current.setMarkers(markers);
  }, [economicEventState, selectedEvent, period, nasdaqState]);

  // 선택된 이벤트로 차트 스크롤
  useEffect(() => {
    if (!selectedEvent || !chartRef.current || period === "1D") return;

    const eventDate = new Date(selectedEvent.date);
    const from = new Date(eventDate);
    from.setMonth(from.getMonth() - 1);
    const to = new Date(eventDate);
    to.setMonth(to.getMonth() + 1);

    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    chartRef.current.timeScale().setVisibleRange({
      from: fmt(from) as Time,
      to: fmt(to) as Time,
    });
  }, [selectedEvent, period]);

  if (nasdaqState.status === "LOADING") {
    return <ChartSkeleton />;
  }

  if (nasdaqState.status === "ERROR") {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-red-500">{nasdaqState.message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            NASDAQ Composite
          </h2>
          {period !== "1D" && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />CPI
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />금리
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />실업률
              </span>
            </div>
          )}
        </div>
        <PeriodTabs selected={period} onChange={setPeriod} />
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
