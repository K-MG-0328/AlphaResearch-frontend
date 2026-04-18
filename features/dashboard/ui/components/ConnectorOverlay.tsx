"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useAtomValue } from "jotai";
import { selectedEventAtom } from "@/features/dashboard/application/atoms/economicEventAtom";
import { chartApiAtom, chartContainerAtom } from "@/features/dashboard/application/atoms/chartApiAtom";
import { periodAtom } from "@/features/dashboard/application/atoms/periodAtom";
import type { Time } from "lightweight-charts";

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ConnectorOverlayProps {
  wrapperRef: RefObject<HTMLDivElement | null>;
}

export default function ConnectorOverlay({ wrapperRef }: ConnectorOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [line, setLine] = useState<Line | null>(null);

  const selectedEvent = useAtomValue(selectedEventAtom);
  const chartApi = useAtomValue(chartApiAtom);
  const chartContainer = useAtomValue(chartContainerAtom);
  const period = useAtomValue(periodAtom);

  const recalculate = () => {
    if (!selectedEvent || !chartApi || !chartContainer || !wrapperRef.current || period === "1D") {
      setLine(null);
      return;
    }

    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    // 차트 마커 x 좌표
    const chartX = chartApi.timeScale().timeToCoordinate(selectedEvent.date as Time);
    if (chartX === null) {
      setLine(null);
      return;
    }

    // 차트 컨테이너의 wrapper 기준 상대 위치
    const chartRect = chartContainer.getBoundingClientRect();
    const markerX = chartRect.left - wrapperRect.left + chartX;
    const markerY = chartRect.bottom - wrapperRect.top; // 차트 하단

    // 타임라인 아이템 DOM 좌표
    const itemEl = wrapperRef.current.querySelector<HTMLElement>(
      `[data-event-id="${selectedEvent.id}"]`
    );
    if (!itemEl) {
      setLine(null);
      return;
    }

    const itemRect = itemEl.getBoundingClientRect();
    const itemCenterX = itemRect.left + itemRect.width / 2 - wrapperRect.left;
    const itemY = itemRect.top - wrapperRect.top;

    setLine({
      x1: markerX,
      y1: markerY,
      x2: itemCenterX,
      y2: itemY,
    });
  };

  // 선택 이벤트 / 차트 준비 상태 변경 시 좌표 재계산 (double RAF로 레이아웃 완료 후 실행)
  useEffect(() => {
    if (!selectedEvent) {
      setLine(null);
      return;
    }

    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        recalculate();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, chartApi, period]);

  // 리사이즈 시 좌표 재계산
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver(() => {
      recalculate();
    });
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, chartApi, period]);

  if (!line) return null;

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        stroke="#a1a1aa"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        strokeLinecap="round"
      />
      <circle cx={line.x1} cy={line.y1} r={3} fill="#a1a1aa" />
      <circle cx={line.x2} cy={line.y2} r={3} fill="#a1a1aa" />
    </svg>
  );
}
