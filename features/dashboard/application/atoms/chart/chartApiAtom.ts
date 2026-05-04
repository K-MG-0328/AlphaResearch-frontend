import { atom } from "jotai";
import type { IChartApi } from "lightweight-charts";

export const chartApiAtom = atom<IChartApi | null>(null);
export const chartContainerAtom = atom<HTMLDivElement | null>(null);
