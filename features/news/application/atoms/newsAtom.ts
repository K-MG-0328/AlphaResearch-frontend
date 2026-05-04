import { atom } from "jotai";

import type { NewsState } from "@/features/news/domain/state/newsState";

export const newsAtom = atom<NewsState>({ status: "LOADING" });
