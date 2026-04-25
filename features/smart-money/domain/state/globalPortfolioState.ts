import type { GlobalPortfolioItem, GlobalInvestor } from "@/features/smart-money/domain/model/globalPortfolioItem";

export type GlobalPortfolioState =
  | { status: "IDLE" }
  | { status: "LOADING" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; items: GlobalPortfolioItem[]; reportedAt: string | null };

export type GlobalInvestorsState =
  | { status: "LOADING" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; investors: GlobalInvestor[] };
