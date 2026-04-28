import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import type {
  SnsSignalResult,
  SnsPerPlatform,
  SnsEvidence,
  SnsSignal,
  SnsSentimentLabel,
  SnsSourceTier,
} from "@/features/sentiment/domain/model/snsSignal";

// ── 요청 타입 ─────────────────────────────────────────────────────────────────

export interface AnalyzeSnsSignalRequest {
  ticker: string;
  /** 수집 게시물 상한 (생략 시 백엔드 기본값 사용) */
  lookbackLimit?: number;
}

// ── Raw 응답 타입 (백엔드 snake_case) ─────────────────────────────────────────

interface RawSnsPerPlatform {
  platform: string;
  signal: string;
  confidence: number;
  sample_size: number;
  positive_ratio: number;
  negative_ratio: number;
  neutral_ratio: number;
}

interface RawSnsEvidence {
  text: string;
  sentiment: string;
  score: number;
  platform: string;
  url: string | null;
}

interface RawSnsSignalResult {
  ticker: string;
  signal: string;
  confidence: number;
  source_tier: string;
  sector_weight_applied: boolean;
  overall_positive_ratio: number;
  overall_negative_ratio: number;
  overall_neutral_ratio: number;
  total_sample_size: number;
  per_platform: RawSnsPerPlatform[];
  evidence: RawSnsEvidence[];
  reasoning: string;
  analyzed_at: string;
  elapsed_ms: number;
}

// ── 매핑 함수 ─────────────────────────────────────────────────────────────────

function mapRawPerPlatform(raw: RawSnsPerPlatform): SnsPerPlatform {
  return {
    platform: raw.platform ?? "",
    signal: (raw.signal ?? "neutral") as SnsSignal,
    confidence: raw.confidence ?? 0,
    sampleSize: raw.sample_size ?? 0,
    positiveRatio: raw.positive_ratio ?? 0,
    negativeRatio: raw.negative_ratio ?? 0,
    neutralRatio: raw.neutral_ratio ?? 0,
  };
}

function mapRawEvidence(raw: RawSnsEvidence): SnsEvidence {
  return {
    text: raw.text ?? "",
    sentiment: (raw.sentiment ?? "neutral") as SnsSentimentLabel,
    score: raw.score ?? 0,
    platform: raw.platform ?? "",
    url: raw.url ?? null,
  };
}

function mapRawToSnsSignalResult(raw: unknown): SnsSignalResult {
  // raw가 null/undefined이거나 객체가 아닌 경우 안전하게 처리
  const r = (raw ?? {}) as RawSnsSignalResult;

  return {
    ticker: r.ticker ?? "",
    signal: (r.signal ?? "neutral") as SnsSignal,
    confidence: r.confidence ?? 0,
    sourceTier: (r.source_tier ?? "하") as SnsSourceTier,
    sectorWeightApplied: r.sector_weight_applied ?? false,
    overallPositiveRatio: r.overall_positive_ratio ?? 0,
    overallNegativeRatio: r.overall_negative_ratio ?? 0,
    overallNeutralRatio: r.overall_neutral_ratio ?? 0,
    totalSampleSize: r.total_sample_size ?? 0,
    perPlatform: (r.per_platform ?? []).map(mapRawPerPlatform),
    evidence: (r.evidence ?? []).map(mapRawEvidence),
    reasoning: r.reasoning ?? "",
    analyzedAt: r.analyzed_at ?? "",
    elapsedMs: r.elapsed_ms ?? 0,
  };
}

// ── 공개 API ──────────────────────────────────────────────────────────────────

export const sentimentApi = {
  /** SNS 감정 분석 실행 — POST /api/v1/sentiment/analyze */
  async analyze(req: AnalyzeSnsSignalRequest): Promise<SnsSignalResult> {
    const { data } = await httpClient<ApiResponse<unknown>>(
      "/api/v1/sentiment/analyze",
      {
        method: "POST",
        body: JSON.stringify({
          ticker: req.ticker,
          // 백엔드는 snake_case 필드명 사용
          ...(req.lookbackLimit !== undefined && {
            lookback_limit: req.lookbackLimit,
          }),
        }),
      }
    );

    return mapRawToSnsSignalResult(data);
  },
};
