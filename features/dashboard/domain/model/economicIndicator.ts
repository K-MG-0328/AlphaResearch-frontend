export interface EconomicIndicator {
  date: string; // "yyyy-mm-dd"
  value: number;
}

export interface MacroData {
  interestRate: EconomicIndicator[];
  cpi: EconomicIndicator[];
  unemployment: EconomicIndicator[];
}
