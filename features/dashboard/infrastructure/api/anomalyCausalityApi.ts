import type { HypothesisResult } from "@/features/dashboard/domain/model/timelineEvent";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import { httpClient } from "@/infrastructure/http/httpClient";

export interface AnomalyCausalityResponse {
  ticker: string;
  date: string;
  hypotheses: HypothesisResult[];
  cached: boolean;
}

export async function fetchAnomalyCausality(
  ticker: string,
  barDate: string,
  detectionType?: string,
  signal?: AbortSignal,
): Promise<AnomalyCausalityResponse> {
  // KR6 — detectionType 전달 시 backend 가 type별 LLM 프롬프트 분기 + 캐시 키 분리.
  const query = detectionType ? `?detectionType=${encodeURIComponent(detectionType)}` : "";
  const res = await httpClient<ApiResponse<AnomalyCausalityResponse>>(
    `/api/v1/history-agent/anomaly-bars/${encodeURIComponent(ticker)}/${barDate}/causality${query}`,
    { signal },
  );
  return res.data;
}
