import type { TimelineResponse } from "@/features/dashboard/domain/model/timelineEvent";
import type { TimelineProgress } from "@/features/dashboard/domain/state/timelineState";
import { env } from "@/infrastructure/config/env";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import { httpClient } from "@/infrastructure/http/httpClient";

export type MacroRegion = "US" | "KR" | "GLOBAL";
export type MacroLookbackRange = "1M" | "3M" | "6M" | "1Y" | "2Y" | "5Y" | "10Y";

export async function fetchMacroTimeline(
  region: MacroRegion,
  lookbackRange: MacroLookbackRange,
  limit?: number,
  signal?: AbortSignal,
): Promise<TimelineResponse> {
  const params = new URLSearchParams({ region, lookbackRange });
  if (limit !== undefined) params.set("limit", String(limit));
  const res = await httpClient<ApiResponse<TimelineResponse>>(
    `/api/v1/history-agent/macro-timeline?${params.toString()}`,
    { signal },
  );
  return res.data;
}

/**
 * 장기 period(5Y/10Y)는 SSE로 진행 상황을 받아 첫 로드 타임아웃을 회피한다.
 * 서버가 Redis 캐시 hit일 때는 progress 없이 즉시 done을 보낸다.
 */
export function streamMacroTimeline(
  region: MacroRegion,
  lookbackRange: MacroLookbackRange,
  onProgress: (progress: TimelineProgress) => void,
  limit?: number,
  signal?: AbortSignal,
): Promise<TimelineResponse> {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({ region, lookbackRange });
    if (limit !== undefined) params.set("limit", String(limit));
    const url = `${env.apiBaseUrl}/api/v1/history-agent/macro-timeline/stream?${params.toString()}`;

    fetch(url, {
      credentials: "include",
      headers: { Accept: "text/event-stream" },
      signal,
    })
      .then(async (response) => {
        if (!response.ok || !response.body) {
          reject(new Error(`HTTP ${response.status}`));
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            if (!chunk.trim()) continue;

            let eventName = "message";
            const dataLines: string[] = [];

            for (const line of chunk.split("\n")) {
              if (line.startsWith("event: ")) eventName = line.slice(7);
              // SSE 스펙: 여러 data: 라인은 \n 으로 이어 붙임.
              else if (line.startsWith("data: ")) dataLines.push(line.slice(6));
            }
            const eventData = dataLines.join("\n");
            if (!eventData) continue;

            try {
              if (eventName === "progress") {
                onProgress(JSON.parse(eventData) as TimelineProgress);
              } else if (eventName === "done") {
                resolve(JSON.parse(eventData) as TimelineResponse);
                return;
              } else if (eventName === "error") {
                const { message } = JSON.parse(eventData) as { message: string };
                reject(new Error(message));
                return;
              }
            } catch (parseErr) {
              console.warn("[streamMacroTimeline] SSE 데이터 파싱 실패", { eventName, parseErr });
            }
          }
        }
      })
      .catch(reject);
  });
}
