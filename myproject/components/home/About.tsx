"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import { GraduationCap, MapPin, Languages } from "lucide-react";
import Wave from "@/components/Wave";
import Reveal from "@/components/Reveal";
import TodayLine from "./TodayLine";
import { site, techStack } from "@/content/site";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className="group/about relative overflow-hidden bg-lime text-black [--x:70%] [--y:30%]"
    >
      {/* the old green→yellow hover, now a spotlight that follows the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700 group-hover/about:opacity-100"
        style={{ background: "radial-gradient(560px circle at var(--x) var(--y), var(--color-zest), transparent 65%)" }}
      />
      <Wave fill="var(--color-ink)" position="top" />

      <div className="relative z-[5] mx-auto max-w-6xl px-5 pb-28 pt-28 sm:px-8 sm:pb-36 sm:pt-36">
        <div className="grid gap-14 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-black/60">01 · who</p>
              <h2 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">ABOUT ME</h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/85">
                As of today (<TodayLine />), I am an undergraduate studying Computer Engineering (BCT) at {site.college.name},
                also popularly known as {site.college.alias}.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/85">
                I love the moment software leaves the screen: when a model&apos;s prediction opens a bin lid, or a control loop keeps a robot
                glued to a line. I build with <strong>Django</strong> and <strong>FastAPI</strong> on the backend, <strong>Next.js</strong> on
                the front, and microcontrollers, sensors and machine learning wherever things need to sense and move.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-7 flex flex-wrap gap-2.5 text-[13px] font-medium">
                {[
                  [MapPin, site.location],
                  [GraduationCap, "BCT · Purwanchal Campus"],
                  [Languages, site.languages.join(" · ")],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof MapPin;
                  return (
                    <li key={label as string} className="flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_#000]">
                      <I className="size-4" /> {label as string}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <div className="mt-12">
              <Reveal>
                <h3 className="font-display text-2xl font-bold">TECH STACK</h3>
                <hr className="mt-3 border-t-2 border-black/40" />
              </Reveal>
              <div className="mt-6 space-y-6">
                {techStack.map((group, gi) => (
                  <Reveal key={group.group} delay={gi * 0.05}>
                    <div className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55">{group.group}</div>
                    <ul className="flex flex-wrap gap-2.5">
                      {group.items.map((t, i) => (
                        <motion.li
                          key={t.name}
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.035, type: "spring", stiffness: 300, damping: 20 }}
                          className="group flex items-center gap-2 rounded-xl border-2 border-black bg-white/90 py-1.5 pl-1.5 pr-3 shadow-[3px_3px_0_#000] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white hover:shadow-[5px_5px_0_#000]"
                        >
                          <span className="grid size-8 place-items-center rounded-lg bg-zinc-100">
                            <Image src={t.icon} alt="" width={22} height={22} className="size-[22px] object-contain" />
                          </span>
                          <span className="text-[13.5px] font-semibold">{t.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <Reveal delay={0.15} className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28">
            <div className="relative rotate-[2deg] rounded-2xl border-2 border-black bg-white p-2.5 pb-12 shadow-[10px_10px_0_#000] transition-transform duration-500 hover:rotate-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src="/images/about_me_photo.jpeg"
                  alt="Manav Acharya overlooking Dharan"
                  fill
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="object-cover"
                />
              </div>
              <p className="absolute bottom-3.5 left-0 right-0 text-center font-mono text-[12px] text-black/70">dharan, nepal · that&apos;s me</p>
            </div>
            <div className="absolute -left-4 -top-4 -rotate-6 rounded-lg border-2 border-black bg-amber-300 px-3 py-1 font-display text-sm font-bold shadow-[3px_3px_0_#000]">
              hello!
            </div>
          </Reveal>
        </div>
      </div>

      <Wave fill="var(--color-paper)" position="bottom" />
    </section>
  );
}
