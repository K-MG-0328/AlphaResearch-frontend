"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { youtubeAtom } from "@/features/youtube/application/atoms/youtubeAtom";
import { fetchYoutubeList } from "@/features/youtube/infrastructure/api/youtubeApi";

export function useYoutubeList() {
  const [youtubeState, setYoutubeState] = useAtom(youtubeAtom);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [prevTokenStack, setPrevTokenStack] = useState<string[]>([]);

  useEffect(() => {
    setYoutubeState({ status: "LOADING" });

    fetchYoutubeList(pageToken)
      .then(({ videos, nextPageToken, prevPageToken, totalResults }) => {
        setYoutubeState({
          status: "SUCCESS",
          videos,
          nextPageToken,
          prevPageToken,
          totalResults,
        });
      })
      .catch(() => {
        setYoutubeState({ status: "ERROR", message: "영상 목록을 불러오는데 실패했습니다." });
      });
  }, [pageToken, setYoutubeState]);

  function goToNextPage(nextToken: string) {
    setPrevTokenStack((stack) => [...stack, pageToken ?? ""]);
    setPageToken(nextToken);
  }

  function goToPrevPage() {
    const stack = [...prevTokenStack];
    const prevToken = stack.pop();
    setPrevTokenStack(stack);
    setPageToken(prevToken === "" ? undefined : prevToken);
  }

  return { youtubeState, goToNextPage, goToPrevPage, hasPrev: prevTokenStack.length > 0 };
}
