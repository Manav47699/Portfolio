"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, FileDown, Trophy } from "lucide-react";
import { site } from "@/content/site";
import { openLucky } from "@/lib/lucky-events";

const LINES = ["Hi there,", "I am Manav Acharya"];

function useTypewriter(reduce: boolean | null) {
  const [typed, setTyped] = useState<string[]>(reduce ? LINES : ["", ""]);
  const [rot, setRot] = useState(reduce ? site.rotatingLines[0] : "");
  const [phase, setPhase] = useState<"intro" | "rotate">(reduce ? "rotate" : "intro");

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await sleep(450);
      for (let l = 0; l < LINES.length; l++) {
        for (let i = 1; i <= LINES[l].length; i++) {
          if (cancelled) return;
          setTyped((t) => t.map((s, k) => (k === l ? LINES[l].slice(0, i) : s)));
          await sleep(l === 0 ? 70 : 55 + Math.random() * 40);
        }
        await sleep(300);
      }
      setPhase("rotate");
      let k = 0;
      while (!cancelled) {
        const word = site.rotatingLines[k % site.rotatingLines.length];
        for (let i = 1; i <= word.length && !cancelled; i++) {
          setRot(word.slice(0, i));
          await sleep(38 + Math.random() * 30);
        }
        await sleep(2200);
        for (let i = word.length; i >= 0 && !cancelled; i--) {
          setRot(word.slice(0, i));
          await sleep(18);
        }
        await sleep(250);
        k++;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reduce]);

  return { typed, rot, phase };
}

const QUICK = ["What did Manav win?", "Show me his robots", "Is he open to internships?"];

export default function Hero() {
  const reduce = useReducedMotion();
  const { typed, rot, phase } = useTypewriter(reduce);

  // photo tilts toward the cursor
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 14 });

  return (
    <section
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pb-24 pt-28"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[110vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(37,99,235,0.35),transparent)]" />
        <div className="absolute bottom-[-30%] left-[10%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(252,211,77,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        {/* photo with the signature white glow */}
        <div className="flex justify-center lg:justify-end lg:pr-10" ref={ref}>
          <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} className="relative">
            <div aria-hidden className="absolute -inset-6 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(252,211,77,0.55),transparent_35%,rgba(59,130,246,0.6),transparent_70%)] blur-md" />
            <div className="relative size-[230px] rounded-full bg-zinc-200 p-1 sm:size-[290px]">
              <div aria-hidden className="absolute inset-0 animate-glow-pulse rounded-full border-4 border-white" />
              <Image
                src="/images/glowboxpic.jpg"
                alt="Manav Acharya"
                fill
                priority
                sizes="(min-width: 640px) 290px, 230px"
                className="relative z-10 rounded-full object-cover p-1"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, type: "spring" }}
              className="absolute -bottom-2 -right-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 font-mono text-[11px] text-zinc-200 backdrop-blur sm:-right-8"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-lime" />
              </span>
              Open to internships
            </motion.div>
          </motion.div>
        </div>

        {/* words */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-400"
          >
            Computer Engineer · {site.location}
          </motion.p>

          <h1 className="sr-only">Hi there, I am Manav Acharya: {site.tagline}</h1>
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

          <p aria-hidden className="mt-5 min-h-[1.6em] text-xl text-zinc-300 sm:text-2xl">
            I build <span className="font-medium text-white">{rot}</span>
            {phase === "rotate" && <Caret thin />}
          </p>

          <motion.ul
            initial="h"
            animate="s"
            variants={{ s: { transition: { staggerChildren: 0.12, delayChildren: 1.1 } } }}
            className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start"
          >
            {site.awards.map((a) => (
              <motion.li key={a.event} variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0 } }}>
                <Link
                  href={`/projects/${a.project}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-amber-300/25 bg-amber-300/[0.07] py-1.5 pl-1.5 pr-4 text-sm text-amber-50 transition hover:border-amber-300/60 hover:bg-amber-300/15"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-amber-300 text-black">
                    <Trophy className="size-3.5" />
                  </span>
                  <span>
                    <strong className="font-semibold text-amber-200">{a.place}</strong> · {a.event} {a.year}
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          {/* Ask Lucky bar */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="mx-auto mt-8 max-w-xl lg:mx-0">
            <button
              onClick={() => openLucky()}
              className="group flex w-full items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-2 pr-2.5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_-25px_rgba(99,102,241,0.6)] backdrop-blur transition hover:border-indigo-300/40 hover:bg-white/[0.07]"
            >
              <Image src="/images/mascot.jpeg" alt="" width={40} height={40} className="size-10 rounded-xl object-cover" />
              <span className="flex-1 text-[15px] text-zinc-400 transition group-hover:text-zinc-300">Ask Lucky anything about Manav…</span>
              <span className="flex items-center gap-1 rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition group-hover:bg-indigo-400">
                Ask <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm lg:justify-start"
          >
            <Link href="/projects" className="group inline-flex items-center gap-1.5 font-medium text-white">
              See the work <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <a href={site.resume} target="_blank" className="inline-flex items-center gap-1.5 text-zinc-400 transition hover:text-white">
              <FileDown className="size-4" /> Résumé
            </a>
            <Link href="/lab" className="inline-flex items-center gap-1.5 text-zinc-400 transition hover:text-white">
              Drive my robot →
            </Link>
          </motion.div>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About me"
        className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 transition hover:text-zinc-300 sm:flex"
      >
        scroll
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}

function Caret({ thin }: { thin?: boolean }) {
  return <span className={`ml-1 inline-block animate-caret bg-white align-[-0.1em] ${thin ? "h-[1em] w-[2px]" : "h-[0.9em] w-[4px]"}`} />;
}
