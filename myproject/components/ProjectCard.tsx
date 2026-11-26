import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import VideoPreview from "./VideoPreview";
import { categoryMeta, formatMonth, type Project } from "@/content/projects";
import { GithubIcon } from "./icons";

export default function ProjectCard({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-2 transition-colors duration-300 hover:border-white/25 ${className}`}
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        <VideoPreview src={project.video} poster={project.poster} contain={project.contain} label={`${project.title} demo`} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
          <span>{categoryMeta[project.category].short}</span>
          <span>{formatMonth(project.date)}</span>
        </div>
        <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-zinc-50">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-zinc-400">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <li key={t} className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-zinc-400">
              {t}
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex items-center justify-between pt-5">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-200 transition-colors group-hover:text-amber-200">
            Case study <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          <span className="flex gap-1.5">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/40 hover:text-white"
              >
                <Globe className="size-4" />
              </a>
            )}
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/40 hover:text-white"
            >
              <GithubIcon className="size-4" />
            </a>
          </span>
        </div>
      </div>
    </article>
  );
}
