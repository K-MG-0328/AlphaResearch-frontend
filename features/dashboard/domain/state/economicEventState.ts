import type { EconomicEvent } from "@/features/dashboard/domain/model/economicEvent";

export type EconomicEventState =
  | { status: "LOADING" }
  | { status: "SUCCESS"; events: EconomicEvent[] }
  | { status: "ERROR"; message: string };
