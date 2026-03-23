"use client";

import { useState } from "react";
import { useSignupAccess } from "@/features/auth/application/hooks/useSignupAccess";
import { useSignup } from "@/features/auth/application/hooks/useSignup";
import TextField from "@/ui/components/TextField";

export default function SignupContent() {
  const { nickname: initialNickname, email, isReady } = useSignupAccess();
  const [nickname, setNickname] = useState(initialNickname);
  const { submit, isLoading, error } = useSignup();

  if (!isReady) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          회원가입
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          서비스 이용을 위한 정보를 확인해 주세요
        </p>
        <div className="flex flex-col gap-4">
          <TextField
            label="닉네임"
            value={nickname}
            onChange={setNickname}
            placeholder="닉네임을 입력하세요"
          />
          <TextField
            label="이메일"
            value={email}
            onChange={() => {}}
            disabled
          />
        </div>
        {error && (
          <p className="mt-3 text-center text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
        <button
          disabled={!nickname.trim() || isLoading}
          onClick={() => submit(nickname, email)}
          className="mt-6 h-12 w-full rounded-xl bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
        >
          {isLoading ? "처리 중..." : "회원가입"}
        </button>
      </div>
    </div>
  );
}
