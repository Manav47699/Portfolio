"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Globe, Search, X } from "lucide-react";
import VideoPreview from "@/components/VideoPreview";
import { GithubIcon } from "@/components/icons";
import { projects, categoryMeta, formatMonth, type ProjectCategory } from "@/content/projects";

const FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "robotics", label: "Robotics" },
  { id: "webapp", label: "Web" },
  { id: "application", label: "Apps" },
];

export default function ProjectsExplorer() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [order, setOrder] = useState<"latest" | "oldest">("latest");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects
      .filter((p) => filter === "all" || p.category === filter)
      .filter((p) => !needle || [p.title, p.summary, p.description, ...p.tech].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => (order === "latest" ? 1 : -1) * (+new Date(b.date) - +new Date(a.date)));
  }, [q, filter, order]);

  return (
    <div className="mt-12">
      <div className="flex flex-col gap-3 border-y border-rule py-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, tech, anything…"
            className="w-full rounded-lg border border-rule bg-white py-2.5 pl-10 pr-10 text-zinc-800 transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100">
              <X className="size-4" />
            </button>
          )}
        </label>

        <div className="flex gap-3">
          <div role="group" aria-label="Filter by category" className="flex flex-1 rounded-lg border border-rule bg-white p-1 lg:flex-none">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors lg:flex-none ${
                  filter === f.id ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="relative">
            <span className="sr-only">Sort order</span>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as "latest" | "oldest")}
              className="h-full appearance-none rounded-lg border border-rule bg-white py-2 pl-4 pr-10 text-sm font-medium text-zinc-800 focus:border-zinc-900 focus:outline-none"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          </label>
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-500" aria-live="polite">
        {list.length} project{list.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 space-y-5">
        {list.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-medium text-zinc-700">No projects found</h2>
            <p className="mt-1 text-zinc-500">Try a different search term or filter.</p>
          </div>
        ) : (
          list.map((p) => (
            <article
              key={p.slug}
              className="group relative overflow-hidden rounded-2xl border border-rule bg-white transition-colors duration-300 hover:border-zinc-400"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="relative overflow-hidden bg-zinc-900 lg:min-h-[280px] lg:w-[42%]">
                  <div className="aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
                    <VideoPreview src={p.video} poster={p.poster} contain={p.contain} label={`${p.title} demo`} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                    <span>{categoryMeta[p.category].short}</span>
                    <span aria-hidden>/</span>
                    <span>{formatMonth(p.date)}</span>
                    {p.archived && (
                      <>
                        <span aria-hidden>/</span>
                        <span>Archive</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-zinc-900 lg:text-[1.7rem]">
                    <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-3 leading-relaxed text-zinc-700">{p.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11.5px] text-zinc-600">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2.5 lg:mt-auto lg:pt-6">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                    >
                      Read case study <ArrowUpRight className="size-4" />
                    </Link>
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-900"
                    >
                      <GithubIcon className="size-4" /> {p.repoLabel ?? "GitHub"}
                    </a>
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-900"
                      >
                        <Globe className="size-4" /> Live site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
