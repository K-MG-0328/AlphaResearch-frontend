import type { EconomicIndicator, MacroData } from "@/features/dashboard/domain/model/economicIndicator";
import type { Period } from "@/features/dashboard/infrastructure/api/nasdaqApi";

const monthCountMap: Record<Period, number> = {
  "1D": 1,
  "1W": 3,
  "1M": 6,
  "1Y": 24,
};

function generateMonthlyData(baseValue: number, volatility: number, months: number): EconomicIndicator[] {
  const data: EconomicIndicator[] = [];
  const now = new Date();
  let value = baseValue;

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    value = Math.max(0, value + (Math.random() - 0.5) * volatility);

    data.push({
      date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`,
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
}

export async function fetchMacroData(period: Period): Promise<MacroData> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const months = monthCountMap[period];

  return {
    interestRate: generateMonthlyData(5.25, 0.25, months),
    cpi: generateMonthlyData(3.2, 0.3, months),
    unemployment: generateMonthlyData(3.9, 0.2, months),
  };
}
