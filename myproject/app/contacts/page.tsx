import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, FileDown } from "lucide-react";
import { site } from "@/content/site";
import CopyEmail from "./CopyEmail";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Manav Acharya: email, GitHub, LinkedIn and more.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-ink px-5 pb-28 pt-36 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-zinc-50 sm:text-7xl">Get in touch</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">Email is the fastest way to reach me. I&apos;m also on the usual places.</p>

        <div className="mt-12 rounded-2xl border border-white/10 p-6 sm:p-8">
          <div className="text-sm text-zinc-500">Email</div>
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a href={`mailto:${site.email}`} className="break-all font-display text-2xl font-semibold text-zinc-50 transition-colors hover:text-amber-200 sm:text-3xl">
              {site.email}
            </a>
            <div className="flex gap-2">
              <CopyEmail email={site.email} />
              <a href={`mailto:${site.email}`} className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-amber-200">
                Send mail
              </a>
            </div>
          </div>
        </div>

        <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          {site.socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-center gap-4 bg-ink p-5 transition-colors hover:bg-ink-2"
              >
                <Image src={s.icon} alt="" width={26} height={26} className="size-[26px] opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="flex-1">
                  <span className="block font-medium text-zinc-100">{s.name}</span>
                  <span className="block text-[13px] text-zinc-500">{s.handle}</span>
                </span>
                <ArrowUpRight className="size-5 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-200" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href={site.resume}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-flex items-center gap-2 text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition hover:text-white hover:decoration-zinc-300"
        >
          <FileDown className="size-4" /> Download my résumé (PDF)
        </a>
      </div>
    </main>
  );
}
