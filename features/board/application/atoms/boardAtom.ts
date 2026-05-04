import { atom } from "jotai";

import type { BoardState } from "@/features/board/domain/state/boardState";

export const boardAtom = atom<BoardState>({ status: "LOADING" });
