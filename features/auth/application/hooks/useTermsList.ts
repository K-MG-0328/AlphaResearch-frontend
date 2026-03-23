"use client";

import { TERM_ITEMS } from "@/features/auth/domain/model/termItem";
import type { TermItem } from "@/features/auth/domain/model/termItem";

export function useTermsList(): TermItem[] {
  return TERM_ITEMS;
}
