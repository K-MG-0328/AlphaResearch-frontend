import { atom } from "jotai";

import type { ChartInterval } from "@/features/dashboard/domain/model/chartInterval";

export const chartIntervalAtom = atom<ChartInterval>("1M");
