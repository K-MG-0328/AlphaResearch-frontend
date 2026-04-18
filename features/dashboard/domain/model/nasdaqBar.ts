export interface NasdaqBar {
  time: string | number; // 일봉 이상: "yyyy-mm-dd" / 분봉(1D): Unix timestamp (초)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
