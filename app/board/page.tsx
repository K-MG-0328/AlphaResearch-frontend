import Link from "next/link";
import { Suspense } from "react";

import BoardList from "@/features/board/ui/components/BoardList";
import { boardListStyles as s } from "@/features/board/ui/components/boardListStyles";

export default function BoardPage() {
  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.header.wrap}>
          <h1 className={s.header.title}>게시판</h1>
          <div className={s.header.right}>
            <span className={s.header.badge}>Antelligen</span>
            <Link href="/board/create" className={s.header.createButton}>
              <span aria-hidden="true">+</span>
              <span>게시물 작성</span>
            </Link>
          </div>
        </div>
        <Suspense
          fallback={
            <div className={s.card}>
              <div className={s.loading}>데이터를 불러오는 중입니다...</div>
            </div>
          }
        >
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
}
