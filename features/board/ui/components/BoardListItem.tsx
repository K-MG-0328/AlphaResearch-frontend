"use client";

import Link from "next/link";

import type { BoardPost } from "@/features/board/domain/model/boardPost";
import { boardListStyles as s } from "@/features/board/ui/components/boardListStyles";

interface BoardListItemProps {
  post: BoardPost;
  index: number;
  page: number;
}

const PAGE_SIZE = 10;

export default function BoardListItem({ post, index, page }: BoardListItemProps) {
  const rowNumber = (page - 1) * PAGE_SIZE + index + 1;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <>
      {/* 데스크탑 테이블 행 */}
      <Link href={`/board/read/${post.boardId}`} className={s.table.row}>
        <span className={s.table.colNum}>{rowNumber}</span>
        <span className={s.table.colTitle}>{post.title}</span>
        <span className={s.table.colAuthor}>{post.nickname}</span>
        <span className={s.table.colDate}>{formattedDate}</span>
      </Link>

      {/* 모바일 카드 행 */}
      <Link href={`/board/read/${post.boardId}`} className={s.mobileList.card}>
        <span className={s.mobileList.title}>{post.title}</span>
        <div className={s.mobileList.meta}>
          <span>{post.nickname}</span>
          <span className={s.mobileList.metaDot} />
          <span>{formattedDate}</span>
        </div>
      </Link>
    </>
  );
}
