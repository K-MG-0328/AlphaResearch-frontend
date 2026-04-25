"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useInvestorFlowTrend } from "@/features/smart-money/application/hooks/useInvestorFlowTrend";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

function toUk(value: number) {
  return Math.round(value / 100_000_000);
}

interface Props {
  stockCode: string;
  stockName: string;
  onClose: () => void;
}

export default function InvestorFlowChart({ stockCode, stockName, onClose }: Props) {
  const { trendState } = useInvestorFlowTrend();

  return (
    <div className={s.chart.panel}>
      <div className={s.chart.header}>
        <div>
          <span className={s.chart.stockName}>{stockName}</span>
          <span className={s.chart.stockCode}>{stockCode}</span>
        </div>
        <button onClick={onClose} className={s.chart.closeBtn} aria-label="차트 닫기">
          ✕
        </button>
      </div>

      <div className={s.chart.body}>
        {trendState.status === "LOADING" && (
          <div className={s.chart.loading}>차트 데이터를 불러오는 중입니다...</div>
        )}

        {trendState.status === "ERROR" && (
          <div className={s.chart.error}>{trendState.message}</div>
        )}

        {trendState.status === "SUCCESS" && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={trendState.trend.trends.map((item) => ({
                date: item.date,
                외국인: toUk(item.foreignerNetBuy),
                기관: toUk(item.institutionNetBuy),
                개인: toUk(item.individualNetBuy),
              }))}
              margin={{ top: 8, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `${v}억`}
              />
              <Tooltip
                formatter={(value: number) => [`${value}억 원`]}
                labelFormatter={(label: string) => `날짜: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="외국인" stroke="#3b82f6" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="기관" stroke="#10b981" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="개인" stroke="#f59e0b" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
