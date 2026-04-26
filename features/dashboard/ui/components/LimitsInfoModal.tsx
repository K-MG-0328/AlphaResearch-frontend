"use client";

import { useEffect } from "react";

interface LimitsInfoModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * KR5 한계 안내 모달.
 *
 * 인과 분석 도구의 신뢰도 등급, 계층 의미, 데이터 소스, 미구현 항목을 카테고리별로 안내.
 * 사용자가 LLM 추정의 한계를 명확히 이해하고 본인 판단으로 재해석할 수 있도록 한다.
 */
export default function LimitsInfoModal({ open, onClose }: LimitsInfoModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="limits-info-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2
              id="limits-info-title"
              className="text-base font-bold text-zinc-900 dark:text-zinc-50"
            >
              ⓘ 분석 한계 안내
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              본 도구는 LLM 추정이며 투자 추천이 아닙니다. 의사 결정 전 반드시 1차 출처를 확인하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="닫기"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">
          <section>
            <h3 className="mb-1.5 font-semibold">신뢰도 등급</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <span className="mr-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  신뢰도 상
                </span>
                1차 출처(공시/실적 발표/중앙은행 결정문) + 정량 근거 + 시점 일치
              </li>
              <li>
                <span className="mr-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  신뢰도 중
                </span>
                신뢰 매체 보도 + 일부 정량 근거 일치
              </li>
              <li>
                <span className="mr-1.5 rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  ⚠ 신뢰도 하
                </span>
                추정·간접 증거·미확인 보도. <span className="font-semibold">카드 전체가 회색</span>으로 표시됩니다.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 font-semibold">계층(layer)</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <span className="mr-1.5 rounded-full bg-zinc-200/60 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700/60 dark:text-zinc-300">
                  직접
                </span>
                종목 고유 사건이 직접 원인 (실적·공시·인수합병·제품 리콜)
              </li>
              <li>
                <span className="mr-1.5 rounded-full bg-zinc-200/60 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700/60 dark:text-zinc-300">
                  보조
                </span>
                보조 컨텍스트 (섹터 동반 움직임, 경쟁사 동향)
              </li>
              <li>
                <span className="mr-1.5 rounded-full bg-zinc-200/60 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700/60 dark:text-zinc-300">
                  시장
                </span>
                시장 전체/매크로 영향 (지수 동반·금리·지정학)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 font-semibold">데이터 소스</h3>
            <ul className="space-y-1 text-xs">
              <li>· 시세/거래량: yfinance (일봉 OHLCV)</li>
              <li>· 미국 공시: SEC EDGAR 8-K</li>
              <li>· 한국 뉴스: Naver News API</li>
              <li>· 글로벌 뉴스: Finnhub + GDELT + yfinance fallback</li>
              <li>· 분석가 추천: Finnhub recommendation trend (미국 한정)</li>
              <li>· 시장 비교: 한국 ^KS11(KOSPI), 미국 ^GSPC(S&P 500)</li>
              <li>· 섹터 비교: 미국 SPDR 11 섹터 ETF (XLK/XLV/XLF/...)</li>
              <li>· 매크로: FRED, GPR, VIX/원유/금/미국채/엔화</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 font-semibold">현재 한계 / 미구현 항목</h3>
            <ul className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <li>· 분봉 데이터 미수집 — 갭/장중 구분은 일봉 OHLC 근사</li>
              <li>· 이후 전개(+1d/+5d/+20d)는 raw cumulative return — benchmark 차감 미적용</li>
              <li>· 한국 공시(DART) — corp_code 매핑 인프라 작업 후 추가 예정</li>
              <li>· 수급 정보(외인/기관/개인) · 옵션/파생 만기 — 데이터 도메인 부재</li>
              <li>· 경쟁사 비교 — Finnhub peers 등 매핑 인프라 후속</li>
              <li>· 유사 과거 사건 — 단순 |return| 거리 기반. 시계열 클러스터링 미적용</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 font-semibold">올바른 사용</h3>
            <ul className="space-y-1 text-xs">
              <li>1. 가설을 출발점으로만 사용. 자동 정답 X.</li>
              <li>2. 출처 링크를 직접 열어 1차 자료 확인.</li>
              <li>3. 신뢰도 ‘하’ 가설은 회색 — 추가 검증 없이 의사 결정 금지.</li>
              <li>4. 한 가지 layer 만 보고 판단하지 말고 직접/보조/시장 가설을 함께 비교.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
