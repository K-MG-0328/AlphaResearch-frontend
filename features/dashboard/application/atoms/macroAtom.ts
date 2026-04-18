import { atom } from "jotai";
import type { MacroState } from "@/features/dashboard/domain/state/macroState";

export const macroAtom = atom<MacroState>({ status: "LOADING" });
