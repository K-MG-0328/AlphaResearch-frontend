import { atom } from "jotai";
import type { SnsSignalResult } from "@/features/sentiment/domain/model/snsSignal";

/** SNS 감정분석 상태 */
export type SnsSignalState =
  | { status: "IDLE" }
  | { status: "LOADING"; ticker: string }
  | { status: "SUCCESS"; ticker: string; data: SnsSignalResult }
  | { status: "ERROR"; ticker: string; message: string };

/** SNS 감정분석 결과 atom */
export const snsSignalAtom = atom<SnsSignalState>({ status: "IDLE" });
