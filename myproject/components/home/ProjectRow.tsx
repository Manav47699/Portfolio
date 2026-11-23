"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectRow({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current!;
    const on = () =>
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      el.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const by = (dir: number) => ref.current?.scrollBy({ left: dir * Math.min(420, ref.current.clientWidth * 0.85), behavior: "smooth" });
  const scrollable = !(edge.start && edge.end);

  return (
    <div className="relative">
      <div
        ref={ref}
        role="list"
        aria-label={label}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-8 pt-2 sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        {children}
      </div>
      {scrollable && (
        <div className="absolute -top-16 right-0 hidden gap-2 md:flex">
          {[
            [-1, ChevronLeft, edge.start, "Scroll left"],
            [1, ChevronRight, edge.end, "Scroll right"],
          ].map(([d, Icon, disabled, l]) => {
            const I = Icon as typeof ChevronLeft;
            return (
              <button
                key={l as string}
                onClick={() => by(d as number)}
                disabled={disabled as boolean}
                aria-label={l as string}
                className="grid size-10 place-items-center rounded-full border border-black/15 bg-white text-zinc-800 shadow-sm transition hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <I className="size-5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
