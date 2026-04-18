import { atom } from "jotai";
import type { DashboardState } from "@/features/dashboard/domain/state/dashboardState";

export const dashboardAtom = atom<DashboardState>({ status: "LOADING" });
