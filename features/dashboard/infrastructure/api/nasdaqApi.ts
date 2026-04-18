import type { NasdaqBar } from "@/features/dashboard/domain/model/nasdaqBar";

export type Period = "1D" | "1W" | "1M" | "1Y";

function generateMockBars(period: Period): NasdaqBar[] {
  const countMap: Record<Period, number> = {
    "1D": 78,
    "1W": 5,
    "1M": 22,
    "1Y": 252,
  };

  const count = countMap[period];
  const bars: NasdaqBar[] = [];
  const now = new Date();
  let price = 17500;

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);

    if (period === "1D") {
      date.setMinutes(date.getMinutes() - i * 5);
    } else {
      date.setDate(date.getDate() - i);
    }

    const change = (Math.random() - 0.48) * 200;
    const open = price;
    const close = Math.max(open + change, 1000);
    const high = Math.max(open, close) + Math.random() * 80;
    const low = Math.min(open, close) - Math.random() * 80;
    price = close;

    const pad = (n: number) => String(n).padStart(2, "0");
    const time: string | number =
      period === "1D"
        ? Math.floor(date.getTime() / 1000) // Unix timestamp (초) — 분봉용
        : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; // yyyy-mm-dd — 일봉용

    bars.push({
      time,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 5000000 + 1000000),
    });
  }

  return bars;
}

export async function fetchNasdaqBars(period: Period): Promise<NasdaqBar[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return generateMockBars(period);
}
