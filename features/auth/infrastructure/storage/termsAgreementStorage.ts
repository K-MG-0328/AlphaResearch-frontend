import type { TermsAgreementResult } from "@/features/auth/domain/model/termsAgreement";

const STORAGE_KEY = "termsAgreement";

export function saveTermsAgreement(result: TermsAgreementResult): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadTermsAgreement(): TermsAgreementResult | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as TermsAgreementResult;
}
