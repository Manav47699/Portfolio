import Link from "next/link";
import { ArrowUpRight, Globe, Trophy } from "lucide-react";
import VideoPreview from "./VideoPreview";
import { categoryMeta, formatMonth, type Project } from "@/content/projects";
import { GithubIcon } from "./icons";

export default function ProjectCard({ project, className = "" }: { project: Project; className?: string }) {
  const meta = categoryMeta[project.category];
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_20px_50px_-30px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="relative m-2 mb-0 aspect-video overflow-hidden rounded-[16px] bg-zinc-900">
        <VideoPreview src={project.video} poster={project.poster} contain={project.contain} label={`${project.title} demo`} />
        <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-inset ring-black/10" />
        {project.award && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-2.5 py-1 text-[11.5px] font-semibold text-black shadow-lg">
            <Trophy className="size-3.5" /> {project.award.split("·")[0].trim()}
          </span>
        )}
        <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10.5px] text-white/90 backdrop-blur">
          {formatMonth(project.date)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${meta.accent}`} />
          <span className={`font-mono text-[10.5px] uppercase tracking-[0.18em] ${meta.text}`}>{meta.short}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-zinc-900">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-zinc-600">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <li key={t} className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-600">
              {t}
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex items-center justify-between pt-5">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-900">
            Case study <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <span className="flex gap-1.5">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                className="grid size-9 place-items-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                <Globe className="size-4" />
              </a>
            )}
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="grid size-9 place-items-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              <GithubIcon className="size-4" />
            </a>
          </span>
        </div>
      </div>
    </article>
  );
}
