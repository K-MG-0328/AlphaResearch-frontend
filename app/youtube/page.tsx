import YoutubeFeedList from "@/features/youtube/ui/components/YoutubeFeedList";
import { youtubeListStyles as s } from "@/features/youtube/ui/components/youtubeListStyles";

export default function YoutubePage() {
  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.header.wrap}>
          <h1 className={s.header.title}>주식 영상 피드</h1>
          <span className={s.header.badge}>YouTube</span>
        </div>
        <YoutubeFeedList />
      </div>
    </div>
  );
}
