import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import ProjectRow from "./ProjectRow";
import { projects, categoryMeta, byDateDesc, type ProjectCategory } from "@/content/projects";

const ORDER: { cat: ProjectCategory; blurb: string }[] = [
  { cat: "robotics", blurb: "Builds where code meets motors and sensors." },
  { cat: "webapp", blurb: "Full-stack platforms and sites for real clients." },
  { cat: "application", blurb: "Offline desktop apps you can download and run." },
];

export default function ProjectsShowcase() {
  return (
    <section id="projects" className="relative bg-ink pb-40 pt-20 text-zinc-100 sm:pt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Projects</h2>
            <p className="mt-3 max-w-xl text-lg text-zinc-400">Things I&apos;ve designed, wired, trained and shipped.</p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-[15px] font-medium text-zinc-100 ring-1 ring-white/20 transition hover:bg-white/5 hover:ring-white/40 sm:self-auto"
          >
            All projects <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <div className="mt-16 space-y-16">
          {ORDER.map(({ cat, blurb }) => {
            const list = projects.filter((p) => p.category === cat).sort((a, b) => Number(!!a.archived) - Number(!!b.archived) || byDateDesc(a, b));
            return (
              <div key={cat} className="border-t border-white/10 pt-8">
                <Reveal>
                  <div className="mb-7">
                    <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{categoryMeta[cat].label}</h3>
                    <p className="mt-1 text-zinc-500">{blurb}</p>
                  </div>
                </Reveal>
                <ProjectRow label={categoryMeta[cat].label}>
                  {list.map((p) => (
                    <div role="listitem" key={p.slug} className="w-[85vw] max-w-[360px] shrink-0 snap-start">
                      <ProjectCard project={p} className="h-full" />
                    </div>
                  ))}
                </ProjectRow>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
