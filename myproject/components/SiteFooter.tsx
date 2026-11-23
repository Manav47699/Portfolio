import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/content/site";
import LocalTime from "./LocalTime";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-zinc-300">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-10 pt-16 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight text-amber-100">Let&apos;s build something that moves.</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-zinc-400">
            Open to internships, collaborations and interesting problems in AI, robotics and the web.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 font-medium text-black transition hover:bg-amber-200"
          >
            <Mail className="size-4" /> {site.email}
          </a>
        </div>

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Connect with me at</h2>
          <ul className="mt-4 space-y-2.5">
            {site.socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-zinc-300 transition hover:text-amber-200">
                  <Image src={s.icon} alt="" width={18} height={18} className="size-[18px] opacity-80 transition group-hover:opacity-100" />
                  {s.name}
                  <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Around the site</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
            {[
              ["Projects", "/projects"],
              ["PID Lab", "/lab"],
              ["Blogs", "/blogs"],
              ["Contacts", "/contacts"],
              ["Résumé (PDF)", site.resume],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="text-zinc-300 transition hover:text-amber-200">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-white/5 px-5 py-6 font-mono text-[12px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-lime" />
          </span>
          {site.location} · <LocalTime />
        </span>
        <span>
          © {new Date().getFullYear()} {site.name} ·{" "}
          <a href="https://github.com/Manav47699/Portfolio" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-amber-200 hover:underline">
            source
          </a>
        </span>
      </div>

      {/* oversized wordmark */}
      <div aria-hidden className="pointer-events-none select-none px-3 pb-2">
        <div className="bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center font-display text-[18.5vw] font-extrabold leading-[0.8] tracking-tighter text-transparent">
          MANAV
        </div>
      </div>
    </footer>
  );
}
