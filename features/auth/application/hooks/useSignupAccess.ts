"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useSignupAccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nickname = searchParams.get("nickname") ?? "";
  const email = searchParams.get("email") ?? "";

  useEffect(() => {
    if (!nickname && !email) {
      router.replace("/login");
    }
  }, [nickname, email, router]);

  return { nickname, email, isReady: !!(nickname || email) };
}
