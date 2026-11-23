import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Globe, Trophy } from "lucide-react";
import VideoPreview from "@/components/VideoPreview";
import PIDLab from "@/components/lab/PIDLab";
import Reveal from "@/components/Reveal";
import AskAbout from "@/components/AskAbout";
import { GithubIcon } from "@/components/icons";
import { projects, getProject, categoryMeta, byDateDesc } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, images: [{ url: p.poster }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  const meta = categoryMeta[p.category];
  const ordered = [...projects].sort(byDateDesc);
  const idx = ordered.findIndex((x) => x.slug === p.slug);
  const prev = ordered[(idx - 1 + ordered.length) % ordered.length];
  const next = ordered[(idx + 1) % ordered.length];
  const date = new Date(p.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <main className="bg-paper text-zinc-900">
      <section className="relative overflow-hidden pb-14 pt-32">
        <div aria-hidden className="absolute -right-40 -top-40 size-[36rem] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900">
            <ArrowLeft className="size-4 transition group-hover:-translate-x-1" /> All projects
          </Link>
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] ${meta.soft} ${meta.text}`}>{meta.label}</span>
              <span className="font-mono text-xs text-zinc-500">{date}</span>
              {p.award && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-black">
                  <Trophy className="size-3.5" /> {p.award}
                </span>
              )}
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{p.title}</h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-zinc-600">{p.summary}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className={`overflow-hidden rounded-[28px] border border-black/10 bg-zinc-900 p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)] ${p.orientation === "portrait" ? "mx-auto max-w-md" : ""}`}>
            <div className={`overflow-hidden rounded-[22px] ${p.orientation === "portrait" ? "aspect-[3/4]" : "aspect-video"}`}>
              <VideoPreview src={p.video} poster={p.poster} contain={p.contain} controls label={`${p.title} demo video`} />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Reveal>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">Overview</h2>
            <p className="mt-4 text-lg leading-[1.8] text-zinc-700">{p.description}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-12 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">Highlights</h2>
            <ul className="mt-5 space-y-3.5">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[17px] leading-relaxed text-zinc-800">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-black">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">Built with</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <li key={t} className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[12.5px] text-zinc-700">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2.5">
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                <GithubIcon className="size-4" /> {p.repoLabel ?? "View on GitHub"}
              </a>
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
                >
                  <Globe className="size-4" /> Visit live site
                </a>
              )}
            </div>
          </div>
          <AskAbout title={p.title} />
        </aside>
      </section>

      {p.slug === "pid-line-follower" && (
        <section className="bg-ink py-20 text-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-300/80">interactive</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">Tune it yourself</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">A physics simulation of this robot&apos;s control loop. Try “P only” to see why the derivative term matters.</p>
            <div className="mt-10">
              <PIDLab variant="compact" />
            </div>
          </div>
        </section>
      )}

      <nav aria-label="More projects" className="border-t border-black/10">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-2">
          {[
            { p: prev, label: "Previous", icon: ArrowLeft, align: "" },
            { p: next, label: "Next", icon: ArrowRight, align: "sm:text-right sm:border-l" },
          ].map(({ p: q, label, icon: Icon, align }) => (
            <Link key={label} href={`/projects/${q.slug}`} className={`group block border-black/10 px-5 py-10 transition hover:bg-white sm:px-8 ${align}`}>
              <span className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 ${align ? "sm:justify-end" : ""}`}>
                {label === "Previous" && <Icon className="size-3.5 transition group-hover:-translate-x-1" />}
                {label} project
                {label === "Next" && <Icon className="size-3.5 transition group-hover:translate-x-1" />}
              </span>
              <span className="mt-2 block font-display text-2xl font-bold tracking-tight text-zinc-900">{q.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
