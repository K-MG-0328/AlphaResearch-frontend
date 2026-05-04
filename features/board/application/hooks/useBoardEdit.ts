"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isAuthenticatedAtom } from "@/features/auth/application/selectors/authSelectors";
import { fetchBoardPost, updateBoardPost } from "@/features/board/infrastructure/api/boardApi";

type LoadState = "LOADING" | "READY" | "ERROR";

export function useBoardEdit(postId: number) {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const router = useRouter();

  const [loadState, setLoadState] = useState<LoadState>("LOADING");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setLoadState("LOADING");

    fetchBoardPost(postId)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setLoadState("READY");
      })
      .catch(() => {
        setLoadState("ERROR");
      });
  }, [postId]);

  async function submit() {
    if (!title.trim() || !content.trim()) {
      setError("제목과 본문을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateBoardPost(postId, title.trim(), content.trim());
      router.push(`/board/read/${postId}`);
    } catch {
      setError("게시물 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { loadState, title, setTitle, content, setContent, isSubmitting, error, submit };
}
