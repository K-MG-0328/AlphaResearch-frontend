"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TERM_ITEMS } from "@/features/auth/domain/model/termItem";
import { saveTermsAgreement } from "@/features/auth/infrastructure/storage/termsAgreementStorage";

export function useTermsAgreement() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>(
    () => Object.fromEntries(TERM_ITEMS.map((item) => [item.id, false]))
  );

  const allChecked = useMemo(
    () => TERM_ITEMS.every((item) => checked[item.id]),
    [checked]
  );

  const allRequiredChecked = useMemo(
    () => TERM_ITEMS.filter((item) => item.required).every((item) => checked[item.id]),
    [checked]
  );

  function toggleAll(value: boolean) {
    setChecked(Object.fromEntries(TERM_ITEMS.map((item) => [item.id, value])));
  }

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function submitAgreement(nickname: string, email: string) {
    const agreedIds = TERM_ITEMS.filter((item) => checked[item.id]).map((item) => item.id);
    saveTermsAgreement({ agreedIds, agreedAt: new Date().toISOString() });

    const params = new URLSearchParams({ nickname, email });
    router.push(`/account/signup?${params.toString()}`);
  }

  return { checked, allChecked, allRequiredChecked, toggleAll, toggle, submitAgreement };
}
