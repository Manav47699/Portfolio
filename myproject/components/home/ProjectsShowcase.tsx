import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import ProjectRow from "./ProjectRow";
import { projects, categoryMeta, byDateDesc, type ProjectCategory } from "@/content/projects";

const ORDER: { cat: ProjectCategory; border: string; blurb: string }[] = [
  { cat: "robotics", border: "border-zinc-800", blurb: "Award-winning builds where code meets motors and sensors." },
  { cat: "webapp", border: "border-blue-500", blurb: "Full-stack platforms and sites for real clients." },
  { cat: "application", border: "border-green-500", blurb: "Offline desktop apps you can download and run." },
];

export default function ProjectsShowcase() {
  return (
    <section id="projects" className="relative bg-paper pb-36 pt-16 text-zinc-900 sm:pt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">02 · work</p>
          <h2 className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-display text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
            PROJECTS
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">Things I&apos;ve designed, wired, trained and shipped.</p>
          <Link
            href="/projects"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(37,99,235,0.7)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:text-black hover:shadow-[0_14px_34px_-10px_rgba(245,158,11,0.7)]"
          >
            View all projects <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-20 space-y-16">
          {ORDER.map(({ cat, border, blurb }, i) => {
            const list = projects.filter((p) => p.category === cat).sort((a, b) => Number(!!a.archived) - Number(!!b.archived) || byDateDesc(a, b));
            return (
              <div key={cat}>
                {i > 0 && <div className="mb-16 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />}
                <Reveal>
                  <div className={`mb-8 border-l-4 pl-4 ${border}`}>
                    <h3 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{categoryMeta[cat].label}</h3>
                    <p className="mt-1 text-zinc-500">{blurb}</p>
                  </div>
                </Reveal>
                <ProjectRow label={categoryMeta[cat].label}>
                  {list.map((p) => (
                    <div role="listitem" key={p.slug} className="w-[85vw] max-w-[380px] shrink-0 snap-start">
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
