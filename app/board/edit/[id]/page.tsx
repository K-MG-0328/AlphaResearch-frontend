import { boardCreateStyles as s } from "@/features/board/ui/components/boardCreateStyles";
import BoardEditForm from "@/features/board/ui/components/BoardEditForm";

interface BoardEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardEditPage({ params }: BoardEditPageProps) {
  const { id } = await params;

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.header.wrap}>
          <h1 className={s.header.title}>게시물 수정</h1>
        </div>
        <BoardEditForm postId={Number(id)} />
      </div>
    </div>
  );
}
