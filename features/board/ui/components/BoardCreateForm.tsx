"use client";

import Link from "next/link";

import { useBoardCreate } from "@/features/board/application/hooks/useBoardCreate";
import { boardCreateStyles as s } from "@/features/board/ui/components/boardCreateStyles";

export default function BoardCreateForm() {
  const { title, setTitle, content, setContent, isSubmitting, error, submit } = useBoardCreate();

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
        <Link href="/board" className={s.cancelButton}>
          취소
        </Link>
        <button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className={s.submitButton}
        >
          {isSubmitting ? "저장 중..." : "작성 완료"}
        </button>
      </div>
    </div>
  );
}
