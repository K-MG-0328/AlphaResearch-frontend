"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authAtom } from "@/features/auth/application/atoms/authAtom";
import { savedInterestArticleAtom } from "@/features/news/application/atoms/savedInterestArticleAtom";
import {
  deleteBookmark,
  getSavedArticles,
  type SavedArticleItem,
} from "@/features/news/infrastructure/api/newsApi";

export type SavedArticlesViewState = {
  articles: SavedArticleItem[];
  page: number;
  totalPages: number;
  status: "loading" | "success" | "error";
  deletingIds: Set<number>;
  setPage: (page: number) => void;
  handleView: (article: SavedArticleItem) => void;
  handleDelete: (articleId: number) => Promise<void>;
};

export function useSavedArticles(pageSize: number): SavedArticlesViewState {
  const authState = useAtomValue(authAtom);
  const setSavedArticle = useSetAtom(savedInterestArticleAtom);
  const router = useRouter();

  const [articles, setArticles] = useState<SavedArticleItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (authState.status === "LOADING") return;
    if (authState.status === "UNAUTHENTICATED") {
      router.replace("/login");
      return;
    }
    setStatus("loading");
    getSavedArticles(page, pageSize)
      .then((result) => {
        setArticles(result.articles);
        setTotalPages(result.totalPages);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [page, pageSize, authState.status, router]);

  function handleView(article: SavedArticleItem) {
    setSavedArticle({
      status: "SUCCESS",
      article: {
        id: article.article_id,
        title: article.title,
        source: article.source,
        link: article.link,
        publishedAt: article.published_at,
        content: article.content ?? article.snippet ?? "",
      },
    });
    router.push(`/news/article/${article.article_id}`);
  }

  async function handleDelete(articleId: number) {
    setDeletingIds((prev) => new Set(prev).add(articleId));
    try {
      await deleteBookmark(articleId);
      setArticles((prev) => prev.filter((a) => a.article_id !== articleId));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(articleId);
        return next;
      });
    }
  }

  return {
    articles,
    page,
    totalPages,
    status,
    deletingIds,
    setPage,
    handleView,
    handleDelete,
  };
}
