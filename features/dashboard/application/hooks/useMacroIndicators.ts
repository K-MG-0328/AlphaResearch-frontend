"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { chartIntervalAtom } from "@/features/dashboard/application/atoms/chartIntervalAtom";
import { macroAtom } from "@/features/dashboard/application/atoms/macroAtom";
import { fetchMacroData } from "@/features/dashboard/infrastructure/api/macroApi";

export function useMacroIndicators() {
  const chartInterval = useAtomValue(chartIntervalAtom);
  const setMacro = useSetAtom(macroAtom);

  useEffect(() => {
    setMacro({ status: "LOADING" });

    fetchMacroData(chartInterval)
      .then((data) => {
        setMacro({ status: "SUCCESS", data });
      })
      .catch(() => {
        setMacro({ status: "ERROR", message: "거시경제 데이터를 불러오는데 실패했습니다." });
      });
  }, [chartInterval, setMacro]);
}
