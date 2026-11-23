"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Poster-first video: shows the poster frame instantly, loads the clip lazily,
 * and plays muted while visible (works on touch devices, unlike hover-to-play).
 */
export default function VideoPreview({
  src,
  poster,
  contain,
  className = "",
  controls = false,
  label,
}: {
  src: string;
  poster: string;
  contain?: boolean;
  className?: string;
  controls?: boolean;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !controls) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.45) {
          if (!v.src) v.src = src;
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: [0, 0.45, 0.8] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, controls]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      controls={controls}
      preload="none"
      aria-label={label}
      onPlaying={() => setReady(true)}
      className={`h-full w-full bg-zinc-900 transition-opacity duration-500 ${contain ? "object-contain" : "object-cover"} ${ready ? "opacity-100" : "opacity-95"} ${className}`}
    />
  );
}
