"use client";

import { useRef } from "react";
import NasdaqChart from "@/features/dashboard/ui/components/NasdaqChart";
import MacroPanel from "@/features/dashboard/ui/components/MacroPanel";
import EventTimeline from "@/features/dashboard/ui/components/EventTimeline";
import ConnectorOverlay from "@/features/dashboard/ui/components/ConnectorOverlay";

export default function DashboardLayout() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* 차트 + 타임라인 연결선 오버레이 영역 */}
      <div ref={wrapperRef} className="relative mb-6">
        <ConnectorOverlay wrapperRef={wrapperRef} />

        {/* 메인 차트 영역 */}
        <section className="mb-6">
          <NasdaqChart />
        </section>

        {/* 경제 이벤트 타임라인 */}
        <section>
          <EventTimeline />
        </section>
      </div>

      {/* 거시경제 지표 패널 영역 */}
      <section>
        <MacroPanel />
      </section>
    </div>
  );
}
