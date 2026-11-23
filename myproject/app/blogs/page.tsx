import type { Metadata } from "next";
import { getPosts } from "@/lib/blog";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Hands-on guides by Manav Acharya: deploying Next.js, local RAG chatbots, Whisper speech-to-text and more.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  const posts = getPosts();
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 pb-28 pt-32 text-zinc-900">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 size-[26rem] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-20 size-[28rem] rounded-full bg-blue-200/30 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <header className="text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700/70">notes from the workbench</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">Blogs</h1>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-600">Step-by-step guides for things I had to figure out the hard way.</p>
        </header>
        <BlogList posts={posts} />
      </div>
    </main>
  );
}
