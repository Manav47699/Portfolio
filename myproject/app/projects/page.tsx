import type { Metadata } from "next";
import ProjectsExplorer from "./ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description: "Robots, AI systems, full-stack web apps and desktop applications built by Manav Acharya.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-28 pt-32 text-zinc-900">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-10 size-[28rem] animate-pulse rounded-full bg-blue-300/30 blur-3xl [animation-duration:7s]" />
        <div className="absolute -right-24 top-40 size-[30rem] animate-pulse rounded-full bg-purple-300/25 blur-3xl [animation-duration:9s]" />
        <div className="absolute bottom-0 left-1/3 size-[26rem] animate-pulse rounded-full bg-amber-200/30 blur-3xl [animation-duration:11s]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <header className="text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">portfolio · all work</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl">My Projects</h1>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-600">
            From award-winning robots to production websites. Search, filter, and open any project for the full story.
          </p>
        </header>
        <ProjectsExplorer />
      </div>
    </main>
  );
}
