"use client";

import { useState } from "react";

import { useSignup } from "@/features/auth/application/hooks/useSignup";
import { useSignupAccess } from "@/features/auth/application/hooks/useSignupAccess";
import { useStockThemes } from "@/features/auth/application/hooks/useStockThemes";
import WatchlistStep from "@/features/auth/ui/components/WatchlistStep";
import TextField from "@/ui/components/TextField";

type Step = "profile" | "watchlist";

export default function SignupContent() {
  const { nickname: initialNickname, email, isReady } = useSignupAccess();
  const [nickname, setNickname] = useState(initialNickname);
  const [step, setStep] = useState<Step>("profile");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const { submit, isLoading, error } = useSignup();
  const { themes, isLoading: themesLoading } = useStockThemes();

  if (!isReady) return null;

  function toggleCode(code: string) {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  if (step === "watchlist") {
    return (
      <WatchlistStep
        themes={themes}
        isLoading={themesLoading}
        selectedCodes={selectedCodes}
        onToggle={toggleCode}
        onSubmit={() => submit(nickname, email, selectedCodes)}
        onSkip={() => submit(nickname, email, [])}
        isSubmitting={isLoading}
        error={error}
      />
    );
  }

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
        <button
          disabled={!nickname.trim()}
          onClick={() => setStep("watchlist")}
          className="mt-6 h-12 w-full rounded-xl bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
        >
          다음
        </button>
      </div>
    </div>
  );
}
