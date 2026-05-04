import { Suspense } from "react";

import NewsList from "@/features/news/ui/components/NewsList";
import { newsListStyles as s } from "@/features/news/ui/components/newsListStyles";

export default function NewsPage() {
  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.header.wrap}>
          <h1 className={s.header.title}>주식 뉴스</h1>
        </div>
        <Suspense
          fallback={
            <div className={s.card}>
              <div className={s.loading}>데이터를 불러오는 중입니다...</div>
            </div>
          }
        >
          <NewsList />
        </Suspense>
      </div>
    </div>
  );
}
