"use client";

import type { OAuthProvider } from "@/features/auth/domain/intent/authIntent";
import { redirectOAuthLogin } from "@/features/auth/infrastructure/api/authApi";
import { loginStyles } from "@/features/auth/ui/components/loginStyles";

const providerLabel: Record<OAuthProvider, string> = {
  kakao: "카카오로 로그인",
  google: "Google로 로그인",
  naver: "네이버로 로그인",
  meta: "Meta로 로그인",
};

interface OAuthLoginButtonProps {
  provider: OAuthProvider;
}

export default function OAuthLoginButton({ provider }: OAuthLoginButtonProps) {
  return (
    <button
      className={[loginStyles.button.base, loginStyles.button[provider]].join(" ")}
      onClick={() => redirectOAuthLogin(provider)}
    >
      {providerLabel[provider]}
    </button>
  );
}
