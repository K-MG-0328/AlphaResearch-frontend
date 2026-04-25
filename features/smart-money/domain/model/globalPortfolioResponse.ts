import type { PortfolioChangeType } from "@/features/smart-money/domain/model/globalPortfolioItem";

export interface GlobalPortfolioResponseItem {
  stock_name: string;
  ticker: string | null;
  shares: number;
  market_value: number;
  portfolio_weight: number;
  change_type: PortfolioChangeType;
  reported_at: string;
}

export interface GlobalPortfolioResponse {
  investor_name: string | null;
  total: number;
  items: GlobalPortfolioResponseItem[];
}

export interface GlobalInvestorsResponse {
  investors: string[];
}
