"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { periodAtom } from "@/features/dashboard/application/atoms/periodAtom";
import { macroAtom } from "@/features/dashboard/application/atoms/macroAtom";
import { fetchMacroData } from "@/features/dashboard/infrastructure/api/macroApi";

export function useMacroIndicators() {
  const period = useAtomValue(periodAtom);
  const setMacro = useSetAtom(macroAtom);

  useEffect(() => {
    setMacro({ status: "LOADING" });

    fetchMacroData(period)
      .then((data) => {
        setMacro({ status: "SUCCESS", data });
      })
      .catch(() => {
        setMacro({ status: "ERROR", message: "거시경제 데이터를 불러오는데 실패했습니다." });
      });
  }, [period, setMacro]);
}
