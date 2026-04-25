export interface InvestorFlowTrendResponseItem {
  date: string;
  foreigner_net_buy: number;
  institution_net_buy: number;
  individual_net_buy: number;
}

export interface InvestorFlowTrendResponse {
  stock_name: string;
  stock_code: string;
  trends: InvestorFlowTrendResponseItem[];
}
