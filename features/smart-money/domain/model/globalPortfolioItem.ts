export type PortfolioChangeType = 'NEW' | 'INCREASED' | 'DECREASED' | 'CLOSED';

export interface GlobalPortfolioItem {
  stockName: string;
  ticker: string | null;
  sharesHeld: number;
  marketValue: number;
  portfolioWeight: number;
  changeType: PortfolioChangeType;
  reportedAt: string;
}

export interface GlobalInvestor {
  id: string;
  name: string;
}
