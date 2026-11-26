import type { Metadata } from "next";
import ProjectsExplorer from "./ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description: "Robots, AI systems, full-stack web apps and desktop applications built by Manav Acharya.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-bone pb-28 pt-36 text-zinc-900">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="max-w-2xl">
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">Projects</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600">
            From competition robots to production websites. Search, filter, and open any project for the full story.
          </p>
        </header>
        <ProjectsExplorer />
      </div>
    </main>
  );
}
