import type { ConcentratedBuyingItem } from "@/features/smart-money/domain/model/concentratedBuyingItem";

export type ConcentratedBuyingState =
  | { status: "LOADING" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; items: ConcentratedBuyingItem[] };
