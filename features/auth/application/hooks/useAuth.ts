"use client";

import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { authAtom } from "@/features/auth/application/atoms/authAtom";
import { isAuthenticatedAtom } from "@/features/auth/application/selectors/authSelectors";

export function useAuth() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const setAuth = useSetAtom(authAtom);
  const router = useRouter();

  function logout() {
    localStorage.removeItem("user_token");
    setAuth({ status: "UNAUTHENTICATED" });
    router.push("/login");
  }

  return { isAuthenticated, logout };
}
