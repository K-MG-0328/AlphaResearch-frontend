import type { BoardCreateResponse } from "@/features/board/domain/model/boardCreateResponse";
import type { BoardDetailResponse } from "@/features/board/domain/model/boardDetailResponse";
import type { BoardListResponse } from "@/features/board/domain/model/boardListResponse";
import type { BoardPost } from "@/features/board/domain/model/boardPost";
import type { BoardPostDetail } from "@/features/board/domain/model/boardPostDetail";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import { httpClient } from "@/infrastructure/http/httpClient";

export async function fetchBoardList(page: number, size: number): Promise<{ posts: BoardPost[]; totalCount: number; page: number }> {
  const { data } = await httpClient<ApiResponse<BoardListResponse>>(
    `/api/v1/board/list?page=${page}&size=${size}`
  );

  const posts: BoardPost[] = data.boards.map((item) => ({
    boardId: item.board_id,
    title: item.title,
    nickname: item.nickname,
    createdAt: item.created_at,
  }));

  return { posts, totalCount: data.total_count, page: data.page };
}

export async function fetchBoardPost(postId: number): Promise<BoardPostDetail> {
  try {
    const { data } = await httpClient<ApiResponse<BoardDetailResponse>>(`/api/v1/board/read/${postId}`);

    return {
      postId: data.board_id,
      title: data.title,
      content: data.content,
      nickname: data.nickname,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes("404")) {
      const notFound = new Error("게시물을 찾을 수 없습니다.");
      notFound.name = "NotFoundError";
      throw notFound;
    }
    throw err;
  }
}

export async function deleteBoardPost(postId: number): Promise<void> {
  await httpClient<ApiResponse<null>>(`/api/v1/board/delete/${postId}`, {
    method: "DELETE",
  });
}

export async function updateBoardPost(postId: number, title: string, content: string): Promise<BoardPostDetail> {
  const { data } = await httpClient<ApiResponse<BoardDetailResponse>>(`/api/v1/board/edit/${postId}`, {
    method: "PUT",
    body: JSON.stringify({ title, content }),
  });

  return {
    postId: data.board_id,
    title: data.title,
    content: data.content,
    nickname: data.nickname,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createBoardPost(title: string, content: string): Promise<BoardCreateResponse> {
  const { data } = await httpClient<ApiResponse<BoardCreateResponse>>("/api/v1/board/register", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
  return data;
}
