import { atom } from "jotai";

import type { AuthState } from "@/features/auth/domain/state/authState";

export const authAtom = atom<AuthState>({ status: "LOADING" });
