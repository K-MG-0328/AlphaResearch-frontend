"use client";

import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

import { globalPortfolioRefreshAtom } from "@/features/smart-money/application/atoms/smartMoneyBootstrapAtom";
import { checkGlobalPortfolioHasData, triggerCollectGlobalPortfolio } from "@/features/smart-money/infrastructure/api/smartMoneyApi";

export default function GlobalPortfolioBootstrap() {
  const [collecting, setCollecting] = useState(false);
  const triggered = useRef(false);
  const setRefreshKey = useSetAtom(globalPortfolioRefreshAtom);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;

    checkGlobalPortfolioHasData().then((hasData) => {
      if (hasData) return;

      setCollecting(true);
      triggerCollectGlobalPortfolio()
        .then(() => {
          setRefreshKey((k) => k + 1);
        })
        .catch(() => {
          // 수집 실패 시 조용히 무시
        })
        .finally(() => {
          setCollecting(false);
        });
    });
  }, [setRefreshKey]);

  if (!collecting) return null;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      SEC EDGAR 13F 포트폴리오 데이터를 처음 수집하고 있습니다. 잠시 기다려 주세요...
    </div>
  );
}
