export interface InvestorFlowTrendItem {
  date: string;
  foreignerNetBuy: number;
  institutionNetBuy: number;
  individualNetBuy: number;
}

export interface InvestorFlowTrend {
  stockName: string;
  stockCode: string;
  trends: InvestorFlowTrendItem[];
}
