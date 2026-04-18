import { atom } from "jotai";
import type { NasdaqState } from "@/features/dashboard/domain/state/nasdaqState";

export const nasdaqAtom = atom<NasdaqState>({ status: "LOADING" });
