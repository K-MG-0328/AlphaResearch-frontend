"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { savedInterestArticleAtom } from "@/features/news/application/atoms/savedInterestArticleAtom";
import { getInterestArticle } from "@/features/news/infrastructure/api/newsApi";
import { HttpError } from "@/infrastructure/http/httpClient";
import type { SavedInterestArticle } from "@/features/news/domain/model/savedInterestArticle";

function hasContent(a: SavedInterestArticle) {
  return !!a.content;
}

export type InterestArticleState = {
  article: SavedInterestArticle | null;
  status: "loading" | "done" | "error";
};

/**
 * id로 관심 기사를 단건 조회. atom에 content가 이미 있으면 fetch를 생략한다.
 * fetch 실패 시 atom의 기본 정보(제목·링크 등)를 폴백으로 표시.
 */
export function useInterestArticle(articleId: number | null): InterestArticleState {
  const atomState = useAtomValue(savedInterestArticleAtom);
  const router = useRouter();

  const atomArticle =
    atomState.status === "SUCCESS" && hasContent(atomState.article)
      ? atomState.article
      : null;

  const [article, setArticle] = useState<SavedInterestArticle | null>(atomArticle);
  const [status, setStatus] = useState<"loading" | "done" | "error">(
    atomArticle ? "done" : "loading"
  );

  useEffect(() => {
    if (atomArticle) return;

    if (atomState.status === "UNAUTHENTICATED") {
      router.replace("/login");
      return;
    }

    if (!articleId) {
      setStatus("error");
      return;
    }

    const base = atomState.status === "SUCCESS" ? atomState.article : null;

    getInterestArticle(articleId)
      .then((result) => {
        setArticle({
          id: result.id,
          title: result.title,
          source: result.source,
          link: result.link,
          publishedAt: result.published_at,
          content: result.content,
        });
        setStatus("done");
      })
      .catch((e: unknown) => {
        if (e instanceof HttpError && e.status === 401) {
          router.replace("/login");
        } else if (base) {
          setArticle(base);
          setStatus("done");
        } else {
          setStatus("error");
        }
      });
    // 첫 마운트 시 1회만 — atom 기본 의존성 변화로 재실행되지 않도록
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  return { article, status };
}
