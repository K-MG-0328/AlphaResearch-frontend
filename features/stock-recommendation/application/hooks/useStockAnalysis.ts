"use client";

import { useAtom } from "jotai";
import { useRef, useEffect } from "react";

import {
  stockAnalysisAtom,
  analysisHistoryAtom,
} from "@/features/stock-recommendation/application/atoms/stockAnalysisAtom";
import {
  queryStockAnalysis,
  fetchAnalysisHistory,
} from "@/features/stock-recommendation/infrastructure/api/stockAnalysisApi";

const STEP_INTERVAL_MS = 7000;
const MAX_STEP = 3;

export function useStockAnalysis() {
  const [state, setState] = useAtom(stockAnalysisAtom);
  const [, setHistory] = useAtom(analysisHistoryAtom);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<0 | 1 | 2 | 3>(0);

  function clearTimer() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    return () => clearTimer();
  }, []);

  function startLoadingTimer() {
    stepRef.current = 0;
    setState({ status: "ANALYZING", loadingStep: 0 });

    timerRef.current = setInterval(() => {
      stepRef.current = Math.min(stepRef.current + 1, MAX_STEP) as
        | 0
        | 1
        | 2
        | 3;
      setState({ status: "ANALYZING", loadingStep: stepRef.current });

      if (stepRef.current >= MAX_STEP) {
        clearTimer();
      }
    }, STEP_INTERVAL_MS);
  }

  async function submit(ticker: string, query: string) {
    const currentState = state;
    const sessionId =
      currentState.status === "SUCCESS"
        ? currentState.result.sessionId
        : undefined;

    startLoadingTimer();

    try {
      const result = await queryStockAnalysis({ query, ticker, sessionId });
      clearTimer();

      if (result.resultStatus === "failure") {
        setState({
          status: "ERROR",
          message: "분석 결과를 가져오지 못했습니다.",
          retryable: true,
        });
        return;
      }

      setState({
        status: "SUCCESS",
        result,
        resultStatus:
          result.resultStatus === "partial_failure"
            ? "partial_failure"
            : "success",
      });

      try {
        const history = await fetchAnalysisHistory(ticker);
        setHistory(history);
      } catch {
        // 이력 조회 실패는 조용히 무시
      }
    } catch (err) {
      clearTimer();
      const message =
        err instanceof Error ? err.message : "네트워크 오류가 발생했습니다.";
      setState({ status: "ERROR", message, retryable: true });
    }
  }

  function reset() {
    clearTimer();
    setState({ status: "IDLE" });
  }

  return { state, submit, reset };
}
