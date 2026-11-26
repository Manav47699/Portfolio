"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { PostMeta } from "@/lib/blog";

const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

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
    <div className="mt-12">
      <div className="flex flex-col gap-3 border-y border-rule py-4 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search blogs</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search blogs…"
            className="w-full rounded-lg border border-rule bg-white py-2.5 pl-10 pr-4 text-zinc-800 transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
        </label>
        <button
          onClick={() => setOrder((o) => (o === "latest" ? "oldest" : "latest"))}
          className="rounded-lg border border-rule bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-900"
        >
          {order === "latest" ? "Latest first" : "Oldest first"}
        </button>
      </div>

      {list.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-medium text-zinc-700">No blogs found</h2>
          <p className="mt-1 text-zinc-500">Try a different search term.</p>
        </div>
      ) : (
        <ol className="divide-y divide-rule">
          {list.map((p) => (
            <li key={p.slug} className="group relative grid gap-4 py-9 sm:grid-cols-[4.5rem_1fr]">
              <span className="font-mono text-sm text-zinc-400">{String(p.number).padStart(2, "0")}</span>
              <div>
                <div className="flex flex-wrap gap-x-3 text-sm text-zinc-500">
                  <time dateTime={p.date}>{fmt(p.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{p.readingMinutes} min read</span>
                </div>
                <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  <Link href={`/blogs/${p.slug}`} className="decoration-zinc-400 underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-zinc-600">{p.description}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] text-zinc-600 ring-1 ring-rule">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                    Read <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
