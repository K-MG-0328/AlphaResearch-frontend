"use client";

import { redirectOAuthLogin } from "@/features/auth/infrastructure/api/authApi";
import { kakaoButtonStyles } from "@/features/auth/ui/components/kakao/kakaoButtonStyles";

export default function KakaoLoginButton() {
  return (
    <button
      className={kakaoButtonStyles.button}
      onClick={() => redirectOAuthLogin("kakao")}
    >
      <svg
        className={kakaoButtonStyles.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.077 4.032 6.52l-.96 3.573a.3.3 0 0 0 .453.332L9.6 18.96A11.35 11.35 0 0 0 12 19.2c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z" />
      </svg>
      <span className={kakaoButtonStyles.label}>Kakao로 로그인</span>
    </button>
  );
}
