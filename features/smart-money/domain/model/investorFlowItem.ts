export type InvestorType = 'FOREIGN' | 'INSTITUTION' | 'INDIVIDUAL';

export interface InvestorFlowItem {
  rank: number;
  stockName: string;
  stockCode: string;
  netBuyAmount: number;
  netBuyQuantity: number;
}
