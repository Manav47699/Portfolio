import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, FileDown, Mail } from "lucide-react";
import { site } from "@/content/site";
import CopyEmail from "./CopyEmail";

export const metadata: Metadata = {
  title: "Contacts",
  description: "Get in touch with Manav Acharya: email, GitHub, LinkedIn and more.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <main className="grain relative min-h-screen overflow-hidden bg-black px-4 pb-24 pt-32 sm:px-8">
      <div aria-hidden className="absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,120,0,0.12),transparent)]" />

      <div className="relative mx-auto max-w-5xl">
        {/* the glowing card from the original contacts page */}
        <div className="contacts-glow relative rounded-[40px] border border-white/10 bg-zinc-950/80 px-5 py-12 text-center backdrop-blur sm:rounded-[80px] sm:px-12 sm:py-16 lg:rounded-[120px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">say hello</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight text-blue-100 sm:text-7xl lg:text-8xl">MY SOCIALS</h1>
          <hr className="mx-auto mt-8 max-w-xl border-blue-100/20" />

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="group rounded-3xl border border-amber-300/30 bg-amber-300/[0.06] p-6 text-left transition hover:border-amber-300/60 sm:col-span-2">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-amber-300 text-black">
                  <Mail className="size-7" />
                </span>
                <div className="flex-1">
                  <div className="text-sm text-zinc-400">The fastest way to reach me</div>
                  <div className="mt-0.5 break-all font-display text-xl font-semibold text-white sm:text-2xl">{site.email}</div>
                </div>
                <div className="flex gap-2">
                  <CopyEmail email={site.email} />
                  <a href={`mailto:${site.email}`} className="rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-200">
                    Mail
                  </a>
                </div>
              </div>
            </div>

            {site.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-zinc-900/70 p-5 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/5 transition group-hover:scale-110 group-hover:bg-white/10">
                  <Image src={s.icon} alt="" width={30} height={30} className="size-[30px]" />
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-semibold text-white">{s.name}</span>
                  <span className="block font-mono text-[13px] text-zinc-500">{s.handle}</span>
                </span>
                <ArrowUpRight className="size-5 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            ))}

            <a
              href={site.resume}
              target="_blank"
              className="group flex items-center justify-center gap-2 rounded-3xl border border-dashed border-white/20 p-5 text-zinc-300 transition hover:border-lime/60 hover:text-lime sm:col-span-2"
            >
              <FileDown className="size-5" /> Download my résumé (PDF)
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
