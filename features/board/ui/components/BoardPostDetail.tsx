"use client";

import Link from "next/link";

import { useBoardPost } from "@/features/board/application/hooks/useBoardPost";
import { boardReadStyles as s } from "@/features/board/ui/components/boardReadStyles";

interface BoardPostDetailProps {
  postId: number;
}

export default function BoardPostDetail({ postId }: BoardPostDetailProps) {
  const { state, isConfirming, isDeleting, deleteError, handleDeleteClick, handleDeleteCancel, handleDeleteConfirm } = useBoardPost(postId);

  if (state.status === "LOADING") {
    return (
      <div className={s.card}>
        <div className={s.loading}>데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (state.status === "NOT_FOUND") {
    return (
      <div className={s.card}>
        <div className={s.notFound}>
          <span className="text-3xl">📭</span>
          <span className={s.notFoundText}>존재하지 않는 게시물입니다.</span>
          <Link href="/board" className="mt-2 text-sm text-blue-700 hover:underline dark:text-blue-400">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "ERROR") {
    return (
      <div className={s.card}>
        <div className={s.error}>{state.message}</div>
      </div>
    );
  }

  const { post } = state;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className={s.card}>
      <div className={s.header.wrap}>
        <h2 className={s.header.title}>{post.title}</h2>
        <div className={s.header.meta}>
          <span>{post.nickname}</span>
          <span className={s.header.dot} />
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className={s.body}>{post.content}</div>
      {deleteError && <p className={s.deleteError}>{deleteError}</p>}
      {isConfirming ? (
        <div className={s.confirm.wrap}>
          <p className={s.confirm.text}>정말로 이 게시물을 삭제하시겠습니까?</p>
          <div className={s.confirm.actions}>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className={s.confirm.confirmButton}
            >
              {isDeleting ? "삭제 중..." : "삭제 확인"}
            </button>
            <button
              type="button"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className={s.confirm.cancelButton}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className={s.footer}>
          <Link href="/board" className={s.listButton}>
            ← 목록 보기
          </Link>
          <div className={s.actions}>
            <Link href={`/board/edit/${postId}`} className={s.editButton}>
              수정
            </Link>
            <button
              type="button"
              onClick={handleDeleteClick}
              className={s.deleteButton}
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
