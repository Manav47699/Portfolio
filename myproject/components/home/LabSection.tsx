import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Wave from "@/components/Wave";
import Reveal from "@/components/Reveal";
import PIDLab from "@/components/lab/PIDLab";

export default function LabSection() {
  return (
    <section id="lab" className="grain relative overflow-hidden bg-ink pb-28 pt-36 text-white sm:pt-44">
      <Wave fill="var(--color-paper)" position="top" />
      <div aria-hidden className="absolute left-1/2 top-40 -z-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.18),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-300/80">03 · play</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
              Drive the robot that <span className="text-amber-300">won Delta 5.0</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-zinc-400">
              My 1st-place line follower steered with a PID loop. This is a physics simulation of one: the same five IR sensors, motor lag
              and control loop. Pick a preset, drag the gains, hit <span className="font-mono text-amber-200">⚡ nudge</span>, and watch the trail tell
              you whether it&apos;s tuned.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <PIDLab variant="compact" />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["P", "Proportional", "Steers harder the further the line is from centre. Alone, it overshoots."],
            ["I", "Integral", "Adds up error over time to remove steady drift. Too much and it winds up."],
            ["D", "Derivative", "Brakes the correction as the error shrinks. This is what kills the wobble."],
          ].map(([k, n, d], i) => (
            <Reveal key={k} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-extrabold text-amber-300">{k}</span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">{n}</span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/lab" className="group inline-flex items-center gap-2 text-[15px] font-medium text-amber-200 hover:text-amber-100">
            Open the full lab, with the control code explained <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
