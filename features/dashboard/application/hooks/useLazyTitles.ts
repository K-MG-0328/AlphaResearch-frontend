"use client";

import { useStore } from "jotai";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { titleOverrideAtomFamily, titleLoadingAtomFamily } from "@/features/dashboard/application/atoms/lazyTitleAtoms";
import type { TimelineEvent } from "@/features/dashboard/domain/model/timelineEvent";
import { fetchEventTitles } from "@/features/dashboard/infrastructure/api/lazyTitleApi";

const BATCH_SIZE = 50;
const DEBOUNCE_MS = 500;

export function useLazyTitles({
  events,
  ticker,
  chartInterval,
}: {
  events: TimelineEvent[];
  ticker: string;
  chartInterval: string;
}) {
  const store = useStore();

  const pendingRef = useRef<Set<number>>(new Set());
  const inFlightRef = useRef<Set<number>>(new Set());
  const visibleAtRef = useRef<Map<number, number>>(new Map());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const cardRefCallbacks = useRef<Map<number, (el: HTMLDivElement | null) => void>>(new Map());

  // Keep latest values accessible in stable callbacks.
  // Ref 할당은 렌더 중 수행 금지 (React 19 엄격 모드) — commit 이후 useLayoutEffect
  // 에서 동기 업데이트. 이후 첫 paint 전 observer/flush 콜백에 최신값이 보임.
  const eventsRef = useRef(events);
  const tickerRef = useRef(ticker);
  const chartIntervalRef = useRef(chartInterval);
  useLayoutEffect(() => {
    eventsRef.current = events;
    tickerRef.current = ticker;
    chartIntervalRef.current = chartInterval;
  }, [events, ticker, chartInterval]);

  // Reset pending state on ticker/chartInterval change
  useEffect(() => {
    pendingRef.current.clear();
    inFlightRef.current.clear();
    visibleAtRef.current.clear();
    cardRefCallbacks.current.clear();
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [ticker, chartInterval]);

  useEffect(() => {
    const flush = async () => {
      const t = tickerRef.current;
      const p = chartIntervalRef.current;
      const evts = eventsRef.current;

      const batch = [...pendingRef.current].filter(
        (idx) => !inFlightRef.current.has(idx) && idx < evts.length
      );
      pendingRef.current.clear();
      if (batch.length === 0) return;

      for (let i = 0; i < batch.length; i += BATCH_SIZE) {
        const chunk = batch.slice(i, i + BATCH_SIZE);
        chunk.forEach((idx) => {
          inFlightRef.current.add(idx);
          store.set(titleLoadingAtomFamily(`${t}:${p}:${idx}`), true);
        });

        try {
          const results = await fetchEventTitles(
            t,
            chunk.map((idx) => ({
              eventIdx: idx,
              date: evts[idx].date,
              category: evts[idx].category,
              type: evts[idx].type,
              detail: evts[idx].detail,
            }))
          );
          results.forEach(({ eventIdx, title }) => {
            store.set(titleOverrideAtomFamily(`${t}:${p}:${eventIdx}`), title);
            store.set(titleLoadingAtomFamily(`${t}:${p}:${eventIdx}`), false);
            inFlightRef.current.delete(eventIdx);

            const visibleAt = visibleAtRef.current.get(eventIdx);
            if (visibleAt != null) {
              const elapsed = performance.now() - visibleAt;
              performance.mark(`lazy-title-resolved:${eventIdx}`);
              try {
                performance.measure(
                  `lazy-title-delay:${eventIdx}`,
                  `lazy-title-visible:${eventIdx}`,
                  `lazy-title-resolved:${eventIdx}`,
                );
              } catch { /* marks may not exist if observer fired after page reload */ }
              console.debug(`[LazyTitles] title delay idx=${eventIdx} elapsed=${elapsed.toFixed(0)}ms`);
              visibleAtRef.current.delete(eventIdx);
            }
          });
        } catch {
          // Fail silently — rule-based title remains visible
          chunk.forEach((idx) => {
            store.set(titleLoadingAtomFamily(`${t}:${p}:${idx}`), false);
            inFlightRef.current.delete(idx);
          });
        }
      }
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        let shouldSchedule = false;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = parseInt(
            (entry.target as HTMLElement).dataset.lazyTitleIdx ?? "-1"
          );
          if (idx < 0) return;
          const key = `${tickerRef.current}:${chartIntervalRef.current}:${idx}`;
          if (inFlightRef.current.has(idx)) return;
          if (store.get(titleOverrideAtomFamily(key)) !== null) return;
          visibleAtRef.current.set(idx, performance.now());
          performance.mark(`lazy-title-visible:${idx}`);
          pendingRef.current.add(idx);
          shouldSchedule = true;
        });

        if (shouldSchedule) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(flush, DEBOUNCE_MS);
        }
      },
      { threshold: 0 }
    );

    // Observe any elements that mounted before this effect ran
    pendingElementsRef.current.forEach((el) => {
      observerRef.current!.observe(el);
    });
    pendingElementsRef.current.clear();

    return () => {
      observerRef.current?.disconnect();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [store]);

  const getCardRef = useCallback((idx: number) => {
    if (!cardRefCallbacks.current.has(idx)) {
      const cb = (el: HTMLDivElement | null) => {
        if (!el) return;
        el.dataset.lazyTitleIdx = String(idx);
        if (observerRef.current) {
          observerRef.current.observe(el);
        } else {
          pendingElementsRef.current.set(idx, el);
        }
      };
      cardRefCallbacks.current.set(idx, cb);
    }
    return cardRefCallbacks.current.get(idx)!;
  }, []);

  return { getCardRef };
}
