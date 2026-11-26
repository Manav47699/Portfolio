import Image from "next/image";
import { GraduationCap, Languages, MapPin } from "lucide-react";
import Wave from "@/components/Wave";
import Reveal from "@/components/Reveal";
import { site, techStack } from "@/content/site";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-bone text-zinc-900">
      <Wave fill="var(--color-ink)" position="top" />

      <div className="relative z-[5] mx-auto max-w-6xl px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40">
        <div className="grid gap-14 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <div>
            <Reveal>
              <h2 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">About me</h2>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-zinc-700">
                I am an undergraduate studying Computer Engineering (BCT) at {site.college.name}, also popularly known as{" "}
                {site.college.alias}.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="mt-8 grid max-w-2xl gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
                {[
                  [GraduationCap, "Studying", "BCT, Purwanchal Campus"],
                  [MapPin, "Based in", site.location],
                  [Languages, "Speaks", site.languages.join(", ")],
                ].map(([Icon, k, v]) => {
                  const I = Icon as typeof MapPin;
                  return (
                    <div key={k as string} className="bg-bone p-4">
                      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                        <I className="size-3.5" /> {k as string}
                      </dt>
                      <dd className="mt-1 text-[15px] font-medium text-zinc-900">{v as string}</dd>
                    </div>
                  );
                })}
              </dl>
            </Reveal>

            <div className="mt-14">
              <Reveal>
                <h3 className="font-display text-2xl font-bold tracking-tight">Tech stack</h3>
              </Reveal>
              <div className="mt-6 space-y-7">
                {techStack.map((group, gi) => (
                  <Reveal key={group.group} delay={gi * 0.05}>
                    <div className="mb-3 text-[13px] font-medium text-zinc-500">{group.group}</div>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((t) => (
                        <li
                          key={t.name}
                          className="flex items-center gap-2 rounded-lg border border-rule bg-white/70 py-1.5 pl-2 pr-3 transition-colors hover:border-zinc-400 hover:bg-white"
                        >
                          <Image src={t.icon} alt="" width={20} height={20} className="size-5 object-contain" />
                          <span className="text-[14px] font-medium">{t.name}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <Reveal delay={0.12} className="mx-auto w-full max-w-sm lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-rule bg-zinc-200">
              <Image
                src="/images/about_me_photo.jpeg"
                alt="Manav Acharya"
                fill
                sizes="(min-width: 1024px) 384px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <Wave fill="var(--color-ink)" position="bottom" />
    </section>
  );
}
