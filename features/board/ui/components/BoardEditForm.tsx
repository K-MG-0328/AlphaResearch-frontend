"use client";

import Link from "next/link";

import { useBoardEdit } from "@/features/board/application/hooks/useBoardEdit";
import { boardCreateStyles as s } from "@/features/board/ui/components/boardCreateStyles";

interface BoardEditFormProps {
  postId: number;
}

export default function BoardEditForm({ postId }: BoardEditFormProps) {
  const { loadState, title, setTitle, content, setContent, isSubmitting, error, submit } =
    useBoardEdit(postId);

  if (loadState === "LOADING") {
    return (
      <div className={s.card}>
        <div className="flex items-center justify-center py-10 text-slate-400 dark:text-slate-500 text-sm">
          데이터를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (loadState === "ERROR") {
    return (
      <div className={s.card}>
        <div className="flex items-center justify-center py-10 text-red-500 text-sm">
          게시물을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.field.wrap}>
        <label htmlFor="board-title" className={s.field.label}>
          제목
        </label>
        <input
          id="board-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className={s.field.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={s.field.wrap}>
        <label htmlFor="board-content" className={s.field.label}>
          본문
        </label>
        <textarea
          id="board-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={12}
          className={s.field.textarea}
          disabled={isSubmitting}
        />
      </div>

      {error && <p className={s.error}>{error}</p>}

      <div className={s.actions}>
        <Link href={`/board/read/${postId}`} className={s.cancelButton}>
          취소
        </Link>
        <button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className={s.submitButton}
        >
          {isSubmitting ? "저장 중..." : "수정 완료"}
        </button>
      </div>
    </div>
  );
}
