import { atom } from "jotai";
import type { Period } from "@/features/dashboard/infrastructure/api/nasdaqApi";

export const periodAtom = atom<Period>("1M");
