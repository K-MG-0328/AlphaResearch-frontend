import type { EconomicEvent } from "@/features/dashboard/domain/model/economicEvent";
import type { Period } from "@/features/dashboard/infrastructure/api/nasdaqApi";

const ALL_EVENTS: EconomicEvent[] = [
  { id: "cpi-2025-01", type: "CPI",           label: "CPI",   date: "2025-01-15", value: 3.1, previous: 3.2, forecast: 3.0 },
  { id: "rate-2025-01", type: "INTEREST_RATE", label: "기준금리", date: "2025-01-29", value: 5.25, previous: 5.25, forecast: 5.25 },
  { id: "unemp-2025-02", type: "UNEMPLOYMENT", label: "실업률", date: "2025-02-07", value: 4.0, previous: 4.1, forecast: 4.0 },
  { id: "cpi-2025-02", type: "CPI",           label: "CPI",   date: "2025-02-12", value: 3.0, previous: 3.1, forecast: 2.9 },
  { id: "rate-2025-03", type: "INTEREST_RATE", label: "기준금리", date: "2025-03-19", value: 5.00, previous: 5.25, forecast: 5.00 },
  { id: "unemp-2025-03", type: "UNEMPLOYMENT", label: "실업률", date: "2025-03-07", value: 3.9, previous: 4.0, forecast: 3.9 },
  { id: "cpi-2025-03", type: "CPI",           label: "CPI",   date: "2025-03-12", value: 2.8, previous: 3.0, forecast: 2.9 },
  { id: "rate-2025-05", type: "INTEREST_RATE", label: "기준금리", date: "2025-05-07", value: 5.00, previous: 5.00, forecast: 5.00 },
  { id: "unemp-2025-05", type: "UNEMPLOYMENT", label: "실업률", date: "2025-05-02", value: 3.8, previous: 3.9, forecast: 3.8 },
  { id: "cpi-2025-05", type: "CPI",           label: "CPI",   date: "2025-05-13", value: 2.6, previous: 2.8, forecast: 2.7 },
  { id: "rate-2025-06", type: "INTEREST_RATE", label: "기준금리", date: "2025-06-11", value: 4.75, previous: 5.00, forecast: 4.75 },
  { id: "unemp-2025-06", type: "UNEMPLOYMENT", label: "실업률", date: "2025-06-06", value: 4.1, previous: 3.8, forecast: 3.9 },
  { id: "cpi-2025-06", type: "CPI",           label: "CPI",   date: "2025-06-11", value: 2.7, previous: 2.6, forecast: 2.6 },
  { id: "rate-2025-07", type: "INTEREST_RATE", label: "기준금리", date: "2025-07-30", value: 4.75, previous: 4.75, forecast: 4.75 },
  { id: "unemp-2025-08", type: "UNEMPLOYMENT", label: "실업률", date: "2025-08-01", value: 4.2, previous: 4.1, forecast: 4.1 },
  { id: "cpi-2025-08", type: "CPI",           label: "CPI",   date: "2025-08-13", value: 2.9, previous: 2.7, forecast: 2.8 },
  { id: "rate-2025-09", type: "INTEREST_RATE", label: "기준금리", date: "2025-09-17", value: 4.50, previous: 4.75, forecast: 4.50 },
  { id: "unemp-2025-09", type: "UNEMPLOYMENT", label: "실업률", date: "2025-09-05", value: 4.2, previous: 4.2, forecast: 4.2 },
  { id: "cpi-2025-09", type: "CPI",           label: "CPI",   date: "2025-09-10", value: 2.5, previous: 2.9, forecast: 2.6 },
  { id: "rate-2025-11", type: "INTEREST_RATE", label: "기준금리", date: "2025-11-05", value: 4.50, previous: 4.50, forecast: 4.50 },
  { id: "unemp-2025-11", type: "UNEMPLOYMENT", label: "실업률", date: "2025-11-07", value: 4.1, previous: 4.2, forecast: 4.1 },
  { id: "cpi-2025-11", type: "CPI",           label: "CPI",   date: "2025-11-12", value: 2.6, previous: 2.5, forecast: 2.5 },
  { id: "rate-2025-12", type: "INTEREST_RATE", label: "기준금리", date: "2025-12-17", value: 4.25, previous: 4.50, forecast: 4.25 },
  { id: "unemp-2025-12", type: "UNEMPLOYMENT", label: "실업률", date: "2025-12-05", value: 4.2, previous: 4.1, forecast: 4.1 },
  { id: "cpi-2025-12", type: "CPI",           label: "CPI",   date: "2025-12-10", value: 2.7, previous: 2.6, forecast: 2.6 },
  { id: "rate-2026-01", type: "INTEREST_RATE", label: "기준금리", date: "2026-01-28", value: 4.25, previous: 4.25, forecast: 4.25 },
  { id: "unemp-2026-02", type: "UNEMPLOYMENT", label: "실업률", date: "2026-02-06", value: 4.0, previous: 4.2, forecast: 4.1 },
  { id: "cpi-2026-02", type: "CPI",           label: "CPI",   date: "2026-02-11", value: 2.8, previous: 2.7, forecast: 2.7 },
  { id: "rate-2026-03", type: "INTEREST_RATE", label: "기준금리", date: "2026-03-18", value: 4.00, previous: 4.25, forecast: 4.00 },
  { id: "unemp-2026-03", type: "UNEMPLOYMENT", label: "실업률", date: "2026-03-06", value: 3.9, previous: 4.0, forecast: 4.0 },
  { id: "cpi-2026-03", type: "CPI",           label: "CPI",   date: "2026-03-11", value: 2.5, previous: 2.8, forecast: 2.6 },
  { id: "rate-2026-04", type: "INTEREST_RATE", label: "기준금리", date: "2026-04-29", value: 4.00, previous: 4.00, forecast: 4.00 },
  { id: "unemp-2026-04", type: "UNEMPLOYMENT", label: "실업률", date: "2026-04-03", value: 3.8, previous: 3.9, forecast: 3.9 },
  { id: "cpi-2026-04", type: "CPI",           label: "CPI",   date: "2026-04-10", value: 2.4, previous: 2.5, forecast: 2.5 },
];

const periodDaysMap: Record<Period, number> = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "1Y": 365,
};

export async function fetchEconomicEvents(period: Period): Promise<EconomicEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const now = new Date();
  const days = periodDaysMap[period];
  const from = new Date(now);
  from.setDate(from.getDate() - days);

  return ALL_EVENTS
    .filter((e) => {
      const d = new Date(e.date);
      return d >= from && d <= now;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
