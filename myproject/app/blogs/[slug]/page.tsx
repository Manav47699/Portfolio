import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getPost, getPosts } from "@/lib/blog";
import { GithubIcon } from "@/components/icons";
import { site } from "@/content/site";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPosts().find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blogs/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description, publishedTime: p.date, authors: [site.name] },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { meta, html } = post;

  const chrono = getPosts().sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const i = chrono.findIndex((p) => p.slug === slug);
  const prev = chrono[i - 1], next = chrono[i + 1];

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: `${site.url}/blogs/${slug}`,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 pb-24 pt-32 text-zinc-900">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link href="/blogs" className="group inline-flex items-center gap-2 font-medium text-amber-700 transition hover:text-amber-900">
          <ArrowLeft className="size-5 transition group-hover:-translate-x-1" /> Back to Blogs
        </Link>

        <header className="relative mt-8 overflow-hidden rounded-[28px] border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/60 p-8 shadow-[0_30px_70px_-40px_rgba(180,83,9,0.5)] sm:p-12">
          <span aria-hidden className="absolute -right-3 -top-10 font-display text-[10rem] font-extrabold leading-none text-amber-100">
            {String(meta.number).padStart(2, "0")}
          </span>
          <div className="relative">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-wider text-amber-700">
              <BookOpen className="size-5" /> BLOG #{String(meta.number).padStart(2, "0")}
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{meta.title}</h1>
            <p className="mt-4 text-lg text-zinc-600">{meta.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {new Date(meta.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" /> {meta.readingMinutes} min read
              </span>
              {meta.repo && (
                <a href={meta.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-medium text-zinc-800 hover:text-blue-700">
                  <GithubIcon className="size-4" /> Source code
                </a>
              )}
            </div>
          </div>
        </header>

        <article
          className="prose-blog mt-8 rounded-[28px] border border-amber-200/60 bg-white/80 p-7 shadow-[0_30px_70px_-45px_rgba(180,83,9,0.45)] backdrop-blur sm:p-12"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="More posts">
          {prev ? (
            <Link href={`/blogs/${prev.slug}`} className="group rounded-2xl border border-blue-200 bg-white/70 p-5 transition hover:border-blue-400 hover:bg-white">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <ChevronLeft className="size-4 transition group-hover:-translate-x-1" /> Previous
              </span>
              <span className="mt-1.5 block font-medium text-zinc-900">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/blogs/${next.slug}`} className="group rounded-2xl border border-amber-200 bg-white/70 p-5 text-right transition hover:border-amber-400 hover:bg-white">
              <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
                Next <ChevronRight className="size-4 transition group-hover:translate-x-1" />
              </span>
              <span className="mt-1.5 block font-medium text-zinc-900">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}
