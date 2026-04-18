import type { NasdaqBar } from "@/features/dashboard/domain/model/nasdaqBar";

export type NasdaqState =
  | { status: "LOADING" }
  | { status: "SUCCESS"; bars: NasdaqBar[] }
  | { status: "ERROR"; message: string };
