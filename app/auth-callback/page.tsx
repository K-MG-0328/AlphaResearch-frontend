"use client";

import { Suspense } from "react";

import { useAuthCallback } from "@/features/auth/application/hooks/useAuthCallback";

function AuthCallbackContent() {
  const { authState } = useAuthCallback();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4 text-center">
        {authState.status === "LOADING" && (
          <>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">로그인 처리 중입니다...</p>
          </>
        )}
        {authState.status === "UNAUTHENTICATED" && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">로그인 페이지로 이동합니다...</p>
        )}
        {authState.status === "TEMPORARY_TOKEN" && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">약관 동의 페이지로 이동합니다...</p>
        )}
        {authState.status === "AUTHENTICATED" && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">로그인 완료. 홈으로 이동합니다...</p>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
