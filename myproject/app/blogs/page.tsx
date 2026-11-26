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
    <main className="min-h-screen bg-bone pb-28 pt-36 text-zinc-900">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <header className="max-w-2xl">
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">Blogs</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600">Step-by-step guides for things I had to figure out the hard way.</p>
        </header>
        <BlogList posts={posts} />
      </div>
    </main>
  );
}
