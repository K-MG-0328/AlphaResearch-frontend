"use client";

import { useEffect, useRef, useState } from "react";

import AssetProfilePanel from "@/features/company-profile/ui/components/AssetProfilePanel";
import AnomalyCausalityPopup from "@/features/dashboard/ui/components/AnomalyCausalityPopup";
import ConnectorOverlay from "@/features/dashboard/ui/components/ConnectorOverlay";
import HistoryPanel from "@/features/dashboard/ui/components/HistoryPanel";
import NasdaqChart from "@/features/dashboard/ui/components/NasdaqChart";
import StockSearch from "@/features/dashboard/ui/components/StockSearch";

export default function DashboardLayout() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const [leftColHeight, setLeftColHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = leftColRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setLeftColHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* 차트 + 타임라인 연결선 오버레이 영역 */}
      <div ref={wrapperRef} className="relative">
        <ConnectorOverlay wrapperRef={wrapperRef} />

        <div className="grid grid-cols-[1fr_260px] items-start gap-4">
          {/* 좌측: 시계열 차트 + 히스토리 패널 */}
          <div ref={leftColRef} className="flex flex-col gap-4">
            <NasdaqChart />
            <HistoryPanel />
          </div>

          {/* 우측: 종목 조회 + 종목 프로필 — 좌측 합산 높이를 max로 잡는다 */}
          <div
            className="flex min-h-0 flex-col gap-4"
            style={leftColHeight != null ? { height: leftColHeight } : undefined}
          >
            <StockSearch />
            <AssetProfilePanel />
          </div>
        </div>

      </div>

      <AnomalyCausalityPopup />
    </div>
  );
}
