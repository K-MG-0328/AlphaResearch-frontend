import type { MacroData } from "@/features/dashboard/domain/model/economicIndicator";

export type MacroState =
  | { status: "LOADING" }
  | { status: "SUCCESS"; data: MacroData }
  | { status: "ERROR"; message: string };
