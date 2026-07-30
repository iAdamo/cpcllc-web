"use client";

interface VideoPlayerProps {
  /** Real, playable video file URL (not the poster/thumbnail). */
  src: string;
  /** Optional poster image shown before playback. */
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

/**
 * A plain, reusable HTML5 video player. Nothing exotic — the browser's native
 * `<video>` handles mp4/webm/mov playback, seeking and fullscreen. Use the real
 * file URL for `src` and the thumbnail for `poster`.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
}) => {
  return (
    <video
      className={className}
      src={src}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="metadata"
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
