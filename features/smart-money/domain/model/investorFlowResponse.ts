export interface InvestorFlowResponseItem {
  rank: number;
  stock_name: string;
  stock_code: string;
  net_buy_amount: number;
  net_buy_quantity: number;
}

export interface InvestorFlowResponse {
  items: InvestorFlowResponseItem[];
}
