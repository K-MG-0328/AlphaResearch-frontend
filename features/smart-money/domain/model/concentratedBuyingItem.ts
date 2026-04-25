export type ConcentratedBuyingDays = 3 | 5 | 10;

export interface ConcentratedBuyingItem {
  stockName: string;
  stockCode: string;
  foreignerNetBuy: number;
  institutionNetBuy: number;
  concentrationScore: number;
}
