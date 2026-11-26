import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import LocalTime from "./LocalTime";

const LINKS: [string, string][] = [
  ["About", "/#about"],
  ["Projects", "/projects"],
  ["Blogs", "/blogs"],
  ["Contact", "/contacts"],
  ["Résumé (PDF)", site.resume],
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-10 pt-16 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight text-zinc-50">{site.name}</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-zinc-400">
            Computer engineering student working on AI, robotics and the web.
          </p>
          <a href={`mailto:${site.email}`} className="mt-5 inline-block text-[15px] text-zinc-200 underline decoration-zinc-600 underline-offset-4 transition hover:decoration-amber-300">
            {site.email}
          </a>
        </div>

        <div>
          <h2 className="text-sm font-medium text-zinc-500">Elsewhere</h2>
          <ul className="mt-4 space-y-2.5">
            {site.socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-zinc-300 transition hover:text-white">
                  <Image src={s.icon} alt="" width={18} height={18} className="size-[18px] opacity-70 transition group-hover:opacity-100" />
                  {s.name}
                  <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-medium text-zinc-500">Site</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
            {LINKS.map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="text-zinc-300 transition hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/10 px-5 py-6 text-[13px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>
          {site.location} · <LocalTime />
        </span>
        <span>
          © {new Date().getFullYear()} {site.name} ·{" "}
          <a href="https://github.com/Manav47699/Portfolio" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-zinc-200 hover:underline">
            source
          </a>
        </span>
      </div>
    </footer>
  );
}
