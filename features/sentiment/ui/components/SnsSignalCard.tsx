"use client";

import { useSnsSignal } from "@/features/sentiment/application/hooks/useSnsSignal";
import type {
  SnsSignal,
  SnsSentimentLabel,
  SnsPerPlatform,
  SnsEvidence,
} from "@/features/sentiment/domain/model/snsSignal";

// ── 상수 ──────────────────────────────────────────────────────────────────────

/** 플랫폼 한국어 라벨 */
const PLATFORM_LABELS: Record<string, string> = {
  reddit: "Reddit",
  naver_finance: "네이버 종목토론",
  toss_community: "토스 커뮤니티",
  stocktwits: "StockTwits",
};

/** 시그널 한국어 라벨 */
const SIGNAL_LABELS: Record<SnsSignal, string> = {
  bullish: "상승",
  bearish: "하락",
  neutral: "중립",
};

/**
 * 시그널 배지 Tailwind 클래스.
 * SignalBadge 컴포넌트는 stock-recommendation 도메인 타입에 의존하므로
 * 크로스 피처 import 없이 동일 스타일을 인라인 정의.
 */
const SIGNAL_BADGE: Record<SnsSignal, string> = {
  bullish:
    "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400",
  bearish:
    "inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400",
  neutral:
    "inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
};

/** 감정 레이블별 왼쪽 색상 바 (근거 게시물) */
const SENTIMENT_BAR: Record<SnsSentimentLabel, string> = {
  positive: "bg-green-400",
  negative: "bg-red-400",
  neutral: "bg-zinc-300 dark:bg-zinc-600",
};

/** 감정 레이블 한국어 */
const SENTIMENT_LABELS: Record<SnsSentimentLabel, string> = {
  positive: "긍정",
  negative: "부정",
  neutral: "중립",
};

/** 데이터 품질 등급 색상 */
const SOURCE_TIER_COLOR: Record<string, string> = {
  "상": "text-green-600 dark:text-green-400",
  "중": "text-blue-600 dark:text-blue-400",
  "중하": "text-yellow-600 dark:text-yellow-400",
  "하": "text-red-600 dark:text-red-400",
};

/** BusinessOverviewCard와 동일한 카드 골격 클래스 */
const CARD =
  "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

// ── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

/**
 * 신뢰도 바.
 * ConfidenceBar 컴포넌트는 stock-recommendation 스타일 객체에 의존하므로
 * 동일 로직을 인라인 정의.
 */
function ConfidenceBarInline({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const fillClass =
    pct > 60
      ? "h-full rounded-full bg-green-500 transition-all"
      : pct > 30
        ? "h-full rounded-full bg-yellow-400 transition-all"
        : "h-full rounded-full bg-red-400 transition-all";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>신뢰도</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className={fillClass} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** 플랫폼별 한 줄 결과 */
function PlatformRow({ item }: { item: SnsPerPlatform }) {
  const label = PLATFORM_LABELS[item.platform] ?? item.platform;
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className={SIGNAL_BADGE[item.signal]}>
          {SIGNAL_LABELS[item.signal]}
        </span>
        <span className="text-xs text-zinc-400">
          표본 {item.sampleSize.toLocaleString()}건
        </span>
      </div>
    </div>
  );
}

/** 근거 게시물 한 줄 */
function EvidenceRow({ item }: { item: SnsEvidence }) {
  const excerpt =
    item.text.length > 100 ? `${item.text.slice(0, 100)}…` : item.text;
  const platformLabel = PLATFORM_LABELS[item.platform] ?? item.platform;

  return (
    <div className="flex gap-2">
      {/* 감정 색상 바 */}
      <div
        className={`w-1 shrink-0 rounded-full ${SENTIMENT_BAR[item.sentiment]}`}
      />
      <div className="flex flex-col gap-0.5">
        <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          {excerpt}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span>{SENTIMENT_LABELS[item.sentiment]}</span>
          <span>·</span>
          <span>{platformLabel}</span>
          {item.url && (
            <>
              <span>·</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400"
              >
                원문 보기
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export interface SnsSignalCardProps {
  /** 분석할 종목 티커 (있으면 자동 fetch X, 부모가 fetchSignal 호출 트리거) */
  ticker?: string;
}

export default function SnsSignalCard({ ticker }: SnsSignalCardProps) {
  const { state } = useSnsSignal();

  // ── IDLE ─────────────────────────────────────────────────────────────────────
  if (state.status === "IDLE") {
    return (
      <section className={CARD}>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          SNS 감정분석
        </h3>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          종목을 입력하면 SNS 감정분석을 시작합니다.
        </p>
      </section>
    );
  }

  // ── LOADING ───────────────────────────────────────────────────────────────────
  if (state.status === "LOADING") {
    return (
      <section className={CARD}>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          SNS 감정분석
        </h3>
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          {state.ticker} SNS 분석 중...
        </p>
        {/* 스켈레톤 */}
        <div className="flex flex-col gap-2">
          {[80, 60, 72].map((w) => (
            <div
              key={w}
              className="h-3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </section>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────────
  if (state.status === "ERROR") {
    return (
      <section className={CARD}>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          SNS 감정분석
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      </section>
    );
  }

  // ── SUCCESS ───────────────────────────────────────────────────────────────────
  const { data } = state;
  const displayTicker = state.ticker ?? ticker ?? "";
  const evidenceTop3 = data.evidence.slice(0, 3);
  const analyzedDate = data.analyzedAt
    ? new Date(data.analyzedAt).toLocaleString("ko-KR")
    : "";

  return (
    <section className={CARD}>
      {/* (a) 헤더: 종목 + 시그널 배지 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          SNS 감정분석
          {displayTicker && (
            <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {displayTicker}
            </span>
          )}
        </h3>
        <span className={SIGNAL_BADGE[data.signal]}>
          {SIGNAL_LABELS[data.signal]}
        </span>
      </div>

      {/* 신뢰도 바 */}
      <div className="mb-4">
        <ConfidenceBarInline confidence={data.confidence} />
      </div>

      {/* (b) 전체 감정 비율 스택 바 */}
      <div className="mb-4">
        <p className="mb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          전체 감정 비율
        </p>
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-green-400"
            style={{ width: `${Math.round(data.overallPositiveRatio * 100)}%` }}
          />
          <div
            className="bg-zinc-300 dark:bg-zinc-600"
            style={{ width: `${Math.round(data.overallNeutralRatio * 100)}%` }}
          />
          <div
            className="bg-red-400"
            style={{ width: `${Math.round(data.overallNegativeRatio * 100)}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-zinc-400">
          <span>긍정 {Math.round(data.overallPositiveRatio * 100)}%</span>
          <span>중립 {Math.round(data.overallNeutralRatio * 100)}%</span>
          <span>부정 {Math.round(data.overallNegativeRatio * 100)}%</span>
        </div>
      </div>

      {/* (c) 데이터 품질 / 표본 수 / 섹터 가중치 */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        <span className="text-zinc-500 dark:text-zinc-400">
          데이터 등급:{" "}
          <span className={SOURCE_TIER_COLOR[data.sourceTier] ?? "text-zinc-600"}>
            {data.sourceTier}
          </span>
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          표본 수: {data.totalSampleSize.toLocaleString()}건
        </span>
        {data.sectorWeightApplied && (
          <span className="text-zinc-500 dark:text-zinc-400">섹터 가중치 적용</span>
        )}
      </div>

      {/* (d) 플랫폼별 결과 */}
      {data.perPlatform.length > 0 && (
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            플랫폼별 결과
          </p>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.perPlatform.map((item) => (
              <PlatformRow key={item.platform} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* (e) 근거 게시물 (최대 3건) */}
      {evidenceTop3.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            근거 게시물
          </p>
          <div className="flex flex-col gap-3">
            {evidenceTop3.map((item, i) => (
              <EvidenceRow key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* (f) AI 요약 */}
      {data.reasoning && (
        <div className="mb-3 rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
          <p className="mb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            AI 요약
          </p>
          <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
            {data.reasoning}
          </p>
        </div>
      )}

      {/* 분석 시각 */}
      {analyzedDate && (
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
          분석 시각: {analyzedDate}
        </p>
      )}
    </section>
  );
}
