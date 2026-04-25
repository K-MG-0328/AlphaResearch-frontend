import type { InvestorFlowTrend } from "@/features/smart-money/domain/model/investorFlowTrendItem";

export type SmartMoneyTrendState =
  | { status: "IDLE" }
  | { status: "LOADING" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; trend: InvestorFlowTrend };
