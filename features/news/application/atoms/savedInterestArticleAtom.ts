import { atom } from "jotai";

import type { SavedInterestArticleState } from "@/features/news/domain/state/savedInterestArticleState";

export const savedInterestArticleAtom = atom<SavedInterestArticleState>({ status: "IDLE" });
