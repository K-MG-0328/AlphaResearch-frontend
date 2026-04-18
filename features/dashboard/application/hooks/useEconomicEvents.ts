"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { periodAtom } from "@/features/dashboard/application/atoms/periodAtom";
import { economicEventAtom } from "@/features/dashboard/application/atoms/economicEventAtom";
import { fetchEconomicEvents } from "@/features/dashboard/infrastructure/api/economicEventApi";

export function useEconomicEvents() {
  const period = useAtomValue(periodAtom);
  const setEvents = useSetAtom(economicEventAtom);

  useEffect(() => {
    setEvents({ status: "LOADING" });

    fetchEconomicEvents(period)
      .then((events) => {
        setEvents({ status: "SUCCESS", events });
      })
      .catch(() => {
        setEvents({ status: "ERROR", message: "이벤트 데이터를 불러오는데 실패했습니다." });
      });
  }, [period, setEvents]);
}
