import { atom } from "jotai";

import type { YoutubeState } from "@/features/youtube/domain/state/youtubeState";

export const youtubeAtom = atom<YoutubeState>({ status: "LOADING" });
