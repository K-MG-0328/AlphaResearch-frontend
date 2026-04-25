import type { InvestorFlowItem } from "@/features/smart-money/domain/model/investorFlowItem";

export type SmartMoneyState =
  | { status: "LOADING" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; items: InvestorFlowItem[] };
