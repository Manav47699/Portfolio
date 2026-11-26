"use client";

import { useEffect, useRef } from "react";

// One IntersectionObserver shared by every Reveal on the page. The animation
// itself is plain CSS (see [data-reveal] in globals.css), so no motion library ships.
let io: IntersectionObserver | null = null;
function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io!.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
  }
  return io;
}

/** Fade/slide content in once as it enters the viewport. */
export default function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = observer();
    o.observe(el);
    return () => o.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={className}
      style={delay ? ({ "--d": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
