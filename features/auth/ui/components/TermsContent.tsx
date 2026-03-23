"use client";

import { useTermsAccess } from "@/features/auth/application/hooks/useTermsAccess";
import { useTermsAgreement } from "@/features/auth/application/hooks/useTermsAgreement";
import TermsItemList from "@/features/auth/ui/components/TermsItemList";

export default function TermsContent() {
  const { nickname, email, isReady } = useTermsAccess();
  const { checked, allChecked, allRequiredChecked, toggleAll, toggle, submitAgreement } = useTermsAgreement();

  if (!isReady) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          약관 동의
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          서비스 이용을 위해 약관에 동의해 주세요
        </p>

        {(nickname || email) && (
          <div className="mb-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
            {nickname && (
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{nickname}</p>
            )}
            {email && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{email}</p>
            )}
          </div>
        )}

        <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleAll(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-zinc-900 dark:accent-zinc-50"
          />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">전체 동의</span>
        </label>

        <TermsItemList checked={checked} onToggle={toggle} />

        <button
          disabled={!allRequiredChecked}
          onClick={() => submitAgreement(nickname, email)}
          className="mt-6 h-12 w-full rounded-xl bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
        >
          동의하고 시작하기
        </button>
      </div>
    </div>
  );
}
