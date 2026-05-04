"use client";

import { useYoutubeFeed } from "@/features/youtube/application/hooks/useYoutubeFeed";
import WatchlistTagChips from "@/features/youtube/ui/components/WatchlistTagChips";
import YoutubeCard from "@/features/youtube/ui/components/YoutubeCard";
import { youtubeListStyles as s } from "@/features/youtube/ui/components/youtubeListStyles";

export default function YoutubeFeedList() {
  const { videos, keywords, nextPageToken, isLoading, isLoadingMore, error, loadMore } =
    useYoutubeFeed();

  if (isLoading) {
    return <div className={s.loading}>데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className={s.error}>{error}</div>;
  }

  if (videos.length === 0) {
    return (
      <div className={s.empty.wrap}>
        <span className={s.empty.icon}>📭</span>
        <span className={s.empty.text}>등록된 영상이 없습니다.</span>
      </div>
    );
  }

  return (
    <>
      <WatchlistTagChips keywords={keywords} />

      <div className={s.grid}>
        {videos.map((video, index) => (
          <YoutubeCard key={video.videoId ?? `video-${index}`} video={video} />
        ))}
      </div>

      {nextPageToken && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoadingMore}
            className={s.pagination.btn}
          >
            {isLoadingMore ? "불러오는 중..." : "더보기"}
          </button>
        </div>
      )}
    </>
  );
}
