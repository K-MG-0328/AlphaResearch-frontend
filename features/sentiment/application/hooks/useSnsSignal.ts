"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { snsSignalAtom } from "@/features/sentiment/application/atoms/snsSignalAtom";
import { sentimentApi } from "@/features/sentiment/infrastructure/api/sentimentApi";

export function useSnsSignal() {
  const [state, setState] = useAtom(snsSignalAtom);

  /** 지정 종목의 SNS 감정 분석을 요청하고 atom 상태를 갱신 */
  const fetchSignal = useCallback(
    async (ticker: string): Promise<void> => {
      // 1. 로딩 시작
      setState({ status: "LOADING", ticker });

      try {
        // 2. API 호출 (lookbackLimit 기본값 100 고정)
        const data = await sentimentApi.analyze({ ticker, lookbackLimit: 100 });

        // 3. 성공 상태로 전이
        setState({ status: "SUCCESS", ticker, data });
      } catch (err) {
        // 4. 에러 상태로 전이
        const message =
          err instanceof Error ? err.message : "SNS 감정 분석 중 오류가 발생했습니다.";
        setState({ status: "ERROR", ticker, message });
      }
    },
    [setState]
  );

  return { state, fetchSignal };
}
