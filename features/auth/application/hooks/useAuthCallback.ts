"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAuthMe } from "@/features/auth/infrastructure/api/authApi";
import type { AuthState } from "@/features/auth/domain/state/authState";

export function useAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<AuthState>({ status: "LOADING" });

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) return;

    fetchAuthMe(token)
      .then((meResponse) => {
        if (!meResponse.is_registered) {
          setAuthState({ status: "TEMPORARY_TOKEN" });
          const params = new URLSearchParams({
            nickname: meResponse.nickname,
            email: meResponse.email,
          });
          router.replace(`/terms?${params.toString()}`);
        } else {
          setAuthState({
            status: "AUTHENTICATED",
            user: { id: meResponse.email, email: meResponse.email, nickname: meResponse.nickname },
          });
          router.replace("/");
        }
      })
      .catch(() => {
        setAuthState({ status: "UNAUTHENTICATED" });
        router.replace("/login");
      });
  }, [router, searchParams]);

  return { authState };
}
