import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import type { InvestorType, InvestorFlowItem } from "@/features/smart-money/domain/model/investorFlowItem";
import type { InvestorFlowResponse } from "@/features/smart-money/domain/model/investorFlowResponse";
import type { InvestorFlowTrend } from "@/features/smart-money/domain/model/investorFlowTrendItem";
import type { InvestorFlowTrendResponse } from "@/features/smart-money/domain/model/investorFlowTrendResponse";
import type { ConcentratedBuyingDays, ConcentratedBuyingItem } from "@/features/smart-money/domain/model/concentratedBuyingItem";
import type { ConcentratedBuyingResponse } from "@/features/smart-money/domain/model/concentratedBuyingResponse";
import type { PortfolioChangeType, GlobalPortfolioItem, GlobalInvestor } from "@/features/smart-money/domain/model/globalPortfolioItem";
import type { GlobalPortfolioResponse, GlobalInvestorsResponse } from "@/features/smart-money/domain/model/globalPortfolioResponse";

export async function fetchInvestorFlowRanking(investorType: InvestorType): Promise<InvestorFlowItem[]> {
  const { data } = await httpClient<ApiResponse<InvestorFlowResponse>>(
    `/api/v1/smart-money/investor-flow?investor_type=${investorType}`
  );

  return data.items.map((item) => ({
    rank: item.rank,
    stockName: item.stock_name,
    stockCode: item.stock_code,
    netBuyAmount: item.net_buy_amount,
    netBuyQuantity: item.net_buy_volume,
  }));
}

export async function fetchInvestorFlowTrend(stockCode: string): Promise<InvestorFlowTrend> {
  const { data } = await httpClient<ApiResponse<InvestorFlowTrendResponse>>(
    `/api/v1/smart-money/trend/${stockCode}`
  );

  return {
    stockName: data.stock_name,
    stockCode: data.stock_code,
    trends: data.points.map((item) => ({
      date: item.date,
      foreignerNetBuy: item.foreign,
      institutionNetBuy: item.institution,
      individualNetBuy: item.individual,
    })),
  };
}

export async function fetchConcentratedBuying(days: ConcentratedBuyingDays): Promise<ConcentratedBuyingItem[]> {
  const { data } = await httpClient<ApiResponse<ConcentratedBuyingResponse>>(
    `/api/v1/smart-money/concentrated?days=${days}`
  );

  return data.items.map((item) => ({
    stockName: item.stock_name,
    stockCode: item.stock_code,
    foreignerNetBuy: item.foreigner_net_buy,
    institutionNetBuy: item.institution_net_buy,
    concentrationScore: item.concentration_score,
  }));
}

export async function fetchGlobalInvestors(): Promise<GlobalInvestor[]> {
  const { data } = await httpClient<ApiResponse<GlobalInvestorsResponse>>(
    `/api/v1/smart-money/investors`
  );
  return data.investors.map((name) => ({ id: name, name }));
}

export async function fetchGlobalPortfolio(
  investorName: string,
  changeType?: PortfolioChangeType
): Promise<GlobalPortfolioItem[]> {
  const params = new URLSearchParams({ investor_name: investorName });
  if (changeType) params.set("change_type", changeType);

  const { data } = await httpClient<ApiResponse<GlobalPortfolioResponse>>(
    `/api/v1/smart-money/global-portfolio?${params.toString()}`
  );

  return data.items.map((item) => ({
    stockName: item.stock_name,
    ticker: item.ticker,
    sharesHeld: item.shares,
    marketValue: item.market_value,
    portfolioWeight: item.portfolio_weight,
    changeType: item.change_type,
    reportedAt: item.reported_at,
  }));
}
