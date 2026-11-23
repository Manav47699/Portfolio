"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Globe, Search, Trophy, X } from "lucide-react";
import VideoPreview from "@/components/VideoPreview";
import { GithubIcon } from "@/components/icons";
import { projects, categoryMeta, formatMonth, type ProjectCategory } from "@/content/projects";

const FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "robotics", label: "Robotics" },
  { id: "webapp", label: "Web" },
  { id: "application", label: "Apps" },
];

const tint: Record<ProjectCategory, string> = {
  robotics: "from-zinc-50 to-slate-100",
  webapp: "from-sky-50 to-blue-50",
  application: "from-green-50 to-emerald-50",
};

export default function ProjectsExplorer() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [order, setOrder] = useState<"latest" | "oldest">("latest");
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [menu]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects
      .filter((p) => filter === "all" || p.category === filter)
      .filter((p) => !needle || [p.title, p.summary, p.description, ...p.tech].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => (order === "latest" ? 1 : -1) * (+new Date(b.date) - +new Date(a.date)));
  }, [q, filter, order]);

  return (
    <div className="mt-14">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="group relative flex-1">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-blue-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, tech, anything…"
            className="w-full rounded-2xl border border-zinc-200 bg-white/80 py-3.5 pl-12 pr-10 text-zinc-800 shadow-sm backdrop-blur transition placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100">
              <X className="size-4" />
            </button>
          )}
        </label>

        <div className="flex gap-3">
          <div role="tablist" aria-label="Filter by category" className="flex flex-1 rounded-2xl border border-zinc-200 bg-white/80 p-1 shadow-sm backdrop-blur lg:flex-none">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition lg:flex-none ${filter === f.id ? "text-white" : "text-zinc-600 hover:text-zinc-900"}`}
              >
                {filter === f.id && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-xl bg-zinc-900" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenu((m) => !m)}
              aria-haspopup="listbox"
              aria-expanded={menu}
              className="flex h-full min-w-[170px] items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:from-amber-300 hover:to-amber-400"
            >
              Order: {order === "latest" ? "Latest" : "Oldest"}
              <ChevronDown className={`size-4 transition ${menu ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {menu && (
                <motion.ul
                  role="listbox"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
                >
                  {(["latest", "oldest"] as const).map((o) => (
                    <li key={o}>
                      <button
                        role="option"
                        aria-selected={order === o}
                        onClick={() => {
                          setOrder(o);
                          setMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition ${order === o ? "bg-amber-50 font-medium text-amber-700" : "text-zinc-700 hover:bg-zinc-50"}`}
                      >
                        {o === "latest" ? "Latest first" : "Oldest first"}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-zinc-500" aria-live="polite">
        Showing <span className="font-semibold text-blue-600">{list.length}</span> project{list.length === 1 ? "" : "s"}
      </p>

      <motion.div layout className="mt-8 space-y-6">
        <AnimatePresence mode="popLayout">
          {list.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-24 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-white shadow-sm">
                <Search className="size-9 text-zinc-300" />
              </div>
              <h2 className="mt-4 text-2xl font-light text-zinc-700">No projects found</h2>
              <p className="text-zinc-500">Try a different search term or filter.</p>
            </motion.div>
          ) : (
            list.map((p) => {
              const meta = categoryMeta[p.category];
              return (
                <motion.article
                  layout
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className={`group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-gradient-to-br ${tint[p.category]} shadow-sm transition-shadow duration-500 hover:shadow-xl`}
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="relative overflow-hidden bg-zinc-900 lg:min-h-[290px] lg:w-[42%]">
                      <div className="aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
                        <VideoPreview src={p.video} poster={p.poster} contain={p.contain} label={`${p.title} demo`} className="transition duration-700 group-hover:scale-[1.04]" />
                      </div>
                      {p.award && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-black shadow-lg">
                          <Trophy className="size-3.5" /> {p.award}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium ${meta.soft} ${meta.text}`}>{meta.short}</span>
                        <span className="font-mono text-xs text-zinc-500">{formatMonth(p.date)}</span>
                        {p.archived && <span className="rounded-full bg-zinc-200/70 px-2.5 py-0.5 font-mono text-[11px] text-zinc-500">archive</span>}
                      </div>
                      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-zinc-900 transition group-hover:text-blue-700 lg:text-[1.7rem]">
                        <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                          {p.title}
                        </Link>
                      </h2>
                      <div className="mt-3 h-0.5 w-12 bg-gradient-to-r from-blue-400 to-transparent transition-all duration-500 group-hover:w-24" />
                      <p className="mt-4 leading-relaxed text-zinc-700">{p.summary}</p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech.map((t) => (
                          <li key={t} className="rounded-md bg-white/80 px-2 py-0.5 font-mono text-[11.5px] text-zinc-600 ring-1 ring-zinc-200">
                            {t}
                          </li>
                        ))}
                      </ul>
                      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2.5 pt-1 lg:mt-auto">
                        <Link
                          href={`/projects/${p.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Read case study <ArrowUpRight className="size-4" />
                        </Link>
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-900"
                        >
                          <GithubIcon className="size-4" /> {p.repoLabel ?? "GitHub"}
                        </a>
                        {p.live && (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-900"
                          >
                            <Globe className="size-4" /> Live site
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 transition-transform duration-700 group-hover:scale-x-100" />
                </motion.article>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
