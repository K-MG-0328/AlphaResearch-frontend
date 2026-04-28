// SNS 감정 분석 도메인 타입
// 백엔드 SnsSignalResult.to_dict() 응답 구조에 대응 (snake_case → camelCase 변환은 infrastructure 레이어에서 수행)

/** 종목에 대한 SNS 감정 방향 */
export type SnsSignal = "bullish" | "bearish" | "neutral";

/** 개별 감정 레이블 (근거 게시물 단위) */
export type SnsSentimentLabel = "positive" | "negative" | "neutral";

/** 데이터 품질 등급 (표본 규모 및 플랫폼 신뢰도 기반) */
export type SnsSourceTier = "상" | "중" | "중하" | "하";

// ── 플랫폼별 분석 결과 ────────────────────────────────────────────────────────

export interface SnsPerPlatform {
  /** 플랫폼명 (예: "reddit", "x", "stocktwits") */
  platform: string;
  signal: SnsSignal;
  confidence: number;
  sampleSize: number;
  positiveRatio: number;
  negativeRatio: number;
  neutralRatio: number;
}

// ── 근거 게시물 ───────────────────────────────────────────────────────────────

export interface SnsEvidence {
  /** 게시물 본문 텍스트 */
  text: string;
  sentiment: SnsSentimentLabel;
  /** 감정 점수 (0.0 ~ 1.0) */
  score: number;
  platform: string;
  /** 원문 링크 (없을 수 있음) */
  url: string | null;
}

// ── 종목 단위 종합 결과 ───────────────────────────────────────────────────────

export interface SnsSignalResult {
  ticker: string;
  signal: SnsSignal;
  /** 신뢰도 (0.0 ~ 1.0) */
  confidence: number;
  /** 데이터 품질 등급 */
  sourceTier: SnsSourceTier;
  /** 섹터 가중치 적용 여부 */
  sectorWeightApplied: boolean;
  overallPositiveRatio: number;
  overallNegativeRatio: number;
  overallNeutralRatio: number;
  /** 분석에 사용된 총 게시물 수 */
  totalSampleSize: number;
  /** 플랫폼별 세부 결과 */
  perPlatform: SnsPerPlatform[];
  /** 시그널 판단 근거 게시물 목록 */
  evidence: SnsEvidence[];
  /** 분석 요약 설명 */
  reasoning: string;
  /** 분석 시각 (ISO 8601) */
  analyzedAt: string;
  /** 분석 소요 시간 (ms) */
  elapsedMs: number;
}
