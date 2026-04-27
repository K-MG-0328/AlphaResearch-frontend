"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchBoardPost, deleteBoardPost } from "@/features/board/infrastructure/api/boardApi";
import type { BoardPostDetail } from "@/features/board/domain/model/boardPostDetail";

type PostState =
  | { status: "LOADING" }
  | { status: "NOT_FOUND" }
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; post: BoardPostDetail };

export function useBoardPost(postId: number) {
  const [state, setState] = useState<PostState>({ status: "LOADING" });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // postId 변경 시 LOADING 으로 reset — single transition 이라 cascading 위험 없음.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ status: "LOADING" });

    fetchBoardPost(postId)
      .then((post) => setState({ status: "SUCCESS", post }))
      .catch((err) => {
        if (err instanceof Error && err.name === "NotFoundError") {
          setState({ status: "NOT_FOUND" });
        } else {
          setState({ status: "ERROR", message: "게시물을 불러오는데 실패했습니다." });
        }
      });
  }, [postId]);

  function handleDeleteClick() {
    setDeleteError(null);
    setIsConfirming(true);
  }

  function handleDeleteCancel() {
    setIsConfirming(false);
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteBoardPost(postId);
      router.push("/board");
    } catch {
      setDeleteError("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
      setIsDeleting(false);
      setIsConfirming(false);
    }
  }

  return { state, isConfirming, isDeleting, deleteError, handleDeleteClick, handleDeleteCancel, handleDeleteConfirm };
}
