import Image from "next/image";

import type { YoutubeVideo } from "@/features/youtube/domain/model/youtubeVideo";
import { youtubeListStyles as s } from "@/features/youtube/ui/components/youtubeListStyles";

interface YoutubeCardProps {
  video: YoutubeVideo;
}

export default function YoutubeCard({ video }: YoutubeCardProps) {
  const formattedDate = new Date(video.publishedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={s.card.wrap}
    >
      <div className={s.card.thumbnail}>
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={s.card.img}
        />
      </div>
      <div className={s.card.body}>
        <p className={s.card.title}>{video.title}</p>
        <div className={s.card.meta}>
          <span className={s.card.channel}>{video.channelName}</span>
          <span className={s.card.date}>{formattedDate}</span>
        </div>
      </div>
    </a>
  );
}
