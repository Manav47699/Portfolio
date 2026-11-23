"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BookOpen, Clock, Search } from "lucide-react";
import type { PostMeta } from "@/lib/blog";

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  const [q, setQ] = useState("");
  const [order, setOrder] = useState<"latest" | "oldest">("latest");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return posts
      .filter((p) => !n || [p.title, p.description, ...p.tags].join(" ").toLowerCase().includes(n))
      .sort((a, b) => (order === "latest" ? 1 : -1) * (+new Date(b.date) - +new Date(a.date)));
  }, [posts, q, order]);

  return (
    <div className="mt-14">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="group relative flex-1">
          <span className="sr-only">Search blogs</span>
          <Search className="pointer-events-none absolute left-5 top-1/2 z-10 size-5 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-amber-600" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search blogs..."
            className="w-full rounded-2xl border border-amber-200/70 bg-white/80 py-4 pl-14 pr-4 text-zinc-800 shadow-sm backdrop-blur transition placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100"
          />
        </label>
        <button
          onClick={() => setOrder((o) => (o === "latest" ? "oldest" : "latest"))}
          className="rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 text-sm font-semibold text-black shadow-sm transition hover:from-amber-300 hover:to-amber-400"
        >
          Order by: {order === "latest" ? "Latest" : "Oldest"}
        </button>
      </div>

      <div className="mt-10 space-y-6">
        <AnimatePresence mode="popLayout">
          {list.length === 0 && (
            <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center">
              <Search className="mx-auto size-14 text-zinc-300" />
              <h2 className="mt-3 text-2xl font-light text-zinc-700">No blogs found</h2>
              <p className="text-zinc-500">Try a different search term</p>
            </motion.div>
          )}
          {list.map((p, i) => (
            <motion.article
              layout
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/70 p-7 shadow-[0_20px_50px_-30px_rgba(180,83,9,0.45)] transition-all duration-500 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_30px_70px_-30px_rgba(180,83,9,0.55)] sm:p-9"
            >
              <span aria-hidden className="absolute -right-4 -top-8 font-display text-[9rem] font-extrabold leading-none text-amber-100 transition group-hover:text-amber-200/80">
                {String(p.number).padStart(2, "0")}
              </span>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold tracking-wider text-amber-700">
                    <BookOpen className="size-5" /> BLOG #{String(p.number).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-500">
                    {new Date(p.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Clock className="size-3.5" /> {p.readingMinutes} min read
                  </span>
                </div>
                <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight text-zinc-900 transition group-hover:text-blue-700 sm:text-3xl">
                  <Link href={`/blogs/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-zinc-600">{p.description}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full bg-amber-100/80 px-2.5 py-0.5 font-mono text-[11px] text-amber-800">
                        #{t}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
                    Read <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
