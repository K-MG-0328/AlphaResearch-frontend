"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { boardAtom } from "@/features/board/application/atoms/boardAtom";
import { fetchBoardList } from "@/features/board/infrastructure/api/boardApi";

const PAGE_SIZE = 10;

export function useBoardList() {
  const [boardState, setBoardState] = useAtom(boardAtom);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setBoardState({ status: "LOADING" });

    fetchBoardList(page, PAGE_SIZE)
      .then(({ posts, totalCount, page: currentPage }) => {
        setBoardState({ status: "SUCCESS", posts, totalCount, page: currentPage });
      })
      .catch(() => {
        setBoardState({ status: "ERROR", message: "게시물을 불러오는데 실패했습니다." });
      });
  }, [page, setBoardState]);

  function goToPage(nextPage: number) {
    setPage(nextPage);
  }

  return { boardState, page, goToPage };
}
