"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, FileDown } from "lucide-react";
import { site } from "@/content/site";
import { openLucky } from "@/lib/lucky-events";

const LINES = ["Hi there,", "I am Manav Acharya"];
const ROLES = site.rotatingLines;

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useTypewriter() {
  const [typed, setTyped] = useState<string[]>(["", ""]);
  const [rot, setRot] = useState("");
  const [phase, setPhase] = useState<"intro" | "rotate">("intro");

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    if (prefersReduced()) {
      // no typing, just swap the role line every few seconds
      setTyped(LINES);
      setPhase("rotate");
      let k = 0;
      setRot(ROLES[0]);
      const id = setInterval(() => setRot(ROLES[++k % ROLES.length]), 3500);
      return () => clearInterval(id);
    }

    (async () => {
      await sleep(350);
      for (let l = 0; l < LINES.length; l++) {
        for (let i = 1; i <= LINES[l].length; i++) {
          if (cancelled) return;
          setTyped((t) => t.map((s, k) => (k === l ? LINES[l].slice(0, i) : s)));
          await sleep(l === 0 ? 65 : 50 + Math.random() * 35);
        }
        await sleep(260);
      }
      setPhase("rotate");
      let k = 0;
      while (!cancelled) {
        const word = ROLES[k % ROLES.length];
        for (let i = 1; i <= word.length && !cancelled; i++) {
          setRot(word.slice(0, i));
          await sleep(45 + Math.random() * 30);
        }
        await sleep(2000);
        for (let i = word.length; i >= 0 && !cancelled; i--) {
          setRot(word.slice(0, i));
          await sleep(22);
        }
        await sleep(300);
        k++;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { typed, rot, phase };
}

const QUICK = ["What has Manav built?", "What's his tech stack?"];

export default function Hero() {
  const { typed, rot, phase } = useTypewriter();

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pb-32 pt-28">
      {/* a single track line, drawn in on load: the path a line follower would chase */}
      <svg aria-hidden className="absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <path
          className="track-draw"
          pathLength={1}
          d="M-40 690 C 180 690 260 560 420 560 S 640 720 820 650 S 1040 330 1190 360 S 1400 520 1500 470"
          stroke="#fcd34d"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="track-draw"
          pathLength={1}
          style={{ animationDelay: "0.6s" }}
          d="M-40 720 C 180 720 260 590 420 590 S 640 750 820 680 S 1040 360 1190 390 S 1400 550 1500 500"
          stroke="#ffffff"
          strokeOpacity="0.07"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-navy/50 to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="rise flex justify-center lg:justify-end lg:pr-8">
          <div className="relative size-[220px] rounded-full bg-white p-1.5 shadow-[0_0_48px_6px_rgba(255,255,255,0.22)] sm:size-[280px]">
            <Image
              src="/images/glowboxpic.jpg"
              alt="Manav Acharya"
              width={560}
              height={560}
              priority
              fetchPriority="high"
              sizes="(min-width: 640px) 280px, 220px"
              className="size-full rounded-full object-cover"
            />
          </div>
        </div>

        <div className="text-center lg:text-left">
          <p className="rise mb-5 font-mono text-xs uppercase tracking-[0.22em] text-zinc-400" style={{ "--d": "0.1s" } as React.CSSProperties}>
            Computer Engineer
          </p>

          <h1 className="sr-only">
            Hi there, I am Manav Acharya. {ROLES.join(". ")}.
          </h1>
          <div aria-hidden className="font-display font-bold tracking-tight text-amber-300">
            <div className="min-h-[1.15em] text-4xl sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              {typed[0]}
              {typed[0].length < LINES[0].length && phase === "intro" && <Caret />}
            </div>
            <div className="min-h-[1.15em] text-4xl sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              {typed[1]}
              {typed[0].length === LINES[0].length && phase === "intro" && <Caret />}
            </div>
          </div>

          <p aria-hidden className="mt-5 min-h-[1.6em] text-xl font-medium text-zinc-100 sm:text-2xl">
            {rot}
            {phase === "rotate" && <Caret thin />}
          </p>

          <div className="rise mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start" style={{ "--d": "1.2s" } as React.CSSProperties}>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-[15px] font-semibold text-black transition-colors hover:bg-amber-200"
            >
              View projects <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium text-zinc-200 ring-1 ring-white/20 transition hover:bg-white/5 hover:ring-white/40"
            >
              <FileDown className="size-4" /> Résumé
            </a>
          </div>

          <div className="rise mx-auto mt-8 max-w-lg lg:mx-0" style={{ "--d": "1.4s" } as React.CSSProperties}>
            <button
              onClick={() => openLucky()}
              className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-ink-2 p-2 pr-2.5 text-left transition hover:border-white/25"
            >
              <Image src="/images/mascot.jpeg" alt="" width={36} height={36} className="size-9 rounded-xl object-cover" />
              <span className="flex-1 text-[15px] text-zinc-400 transition group-hover:text-zinc-200">Ask Lucky anything about Manav…</span>
              <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-zinc-100 transition group-hover:bg-amber-300 group-hover:text-black">
                <ArrowRight className="size-4" />
              </span>
            </button>
            <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => openLucky(q)}
                  className="rounded-full border border-white/10 px-3 py-1 text-[13px] text-zinc-400 transition hover:border-white/30 hover:text-zinc-100"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Caret({ thin }: { thin?: boolean }) {
  return <span className={`ml-1 inline-block animate-caret bg-amber-300 align-[-0.1em] ${thin ? "h-[1em] w-[2px]" : "h-[0.9em] w-[4px]"}`} />;
}
