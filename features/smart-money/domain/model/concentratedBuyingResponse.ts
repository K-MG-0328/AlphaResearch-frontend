export interface ConcentratedBuyingResponseItem {
  stock_name: string;
  stock_code: string;
  foreigner_net_buy: number;
  institution_net_buy: number;
  concentration_score: number;
}

export interface ConcentratedBuyingResponse {
  items: ConcentratedBuyingResponseItem[];
}
