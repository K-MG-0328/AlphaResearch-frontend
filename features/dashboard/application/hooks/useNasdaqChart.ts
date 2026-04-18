"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { nasdaqAtom } from "@/features/dashboard/application/atoms/nasdaqAtom";
import { dashboardAtom } from "@/features/dashboard/application/atoms/dashboardAtom";
import { periodAtom } from "@/features/dashboard/application/atoms/periodAtom";
import { fetchNasdaqBars } from "@/features/dashboard/infrastructure/api/nasdaqApi";

export function useNasdaqChart() {
  const [period, setPeriod] = useAtom(periodAtom);
  const setNasdaq = useSetAtom(nasdaqAtom);
  const setDashboard = useSetAtom(dashboardAtom);

  useEffect(() => {
    setNasdaq({ status: "LOADING" });

    fetchNasdaqBars(period)
      .then((bars) => {
        setNasdaq({ status: "SUCCESS", bars });
        setDashboard({ status: "LOADED" });
      })
      .catch(() => {
        setNasdaq({ status: "ERROR", message: "나스닥 데이터를 불러오는데 실패했습니다." });
        setDashboard({ status: "ERROR", message: "대시보드 로딩에 실패했습니다." });
      });
  }, [period, setNasdaq, setDashboard]);

  return { period, setPeriod };
}
