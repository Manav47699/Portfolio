import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import PIDLab from "@/components/lab/PIDLab";
import Reveal from "@/components/Reveal";
import { highlight } from "@/lib/blog";

export const metadata: Metadata = {
  title: "PID Lab",
  description:
    "An interactive 3D physics simulation of Manav Acharya's award-winning PID line-follower robot. Tune Kp, Ki and Kd and watch it drive.",
  alternates: { canonical: "/lab" },
};

const CODE = `// Simplified PID line-following loop (Arduino-style C++).
// Same structure the simulation above runs at 100 Hz.

float Kp = 1.0, Ki = 0.02, Kd = 0.05;
float integral = 0, lastError = 0;
const float base = 0.8;            // base motor power (0..1)

void loop() {
  // 1. Read 5 IR sensors → weighted line position in -1..1
  float error = readLinePosition();  // 0 = centred, +1 = line far right

  // 2. PID
  integral = constrain(integral + error * dt, -1.5, 1.5); // anti-windup
  float derivative = (error - lastError) / dt;
  float correction = Kp * error + Ki * integral + Kd * derivative;
  lastError = error;

  // 3. Differential drive: speed up one wheel, slow the other
  setMotors(base + correction,   // left
            base - correction);  // right
}`;

const STEPS = [
  {
    t: "Sense",
    d: "Five IR reflectance sensors sit a few centimetres ahead of the wheels. Each reports how much black tape is under it. A weighted average turns them into one number: where the line is, from −1 (far left) to +1 (far right).",
  },
  {
    t: "Decide",
    d: "The PID controller converts that error into a steering correction. P pushes in proportion to the error, I removes slow drift, and D reacts to how fast the error is changing, damping the overshoot that makes robots snake.",
  },
  {
    t: "Act",
    d: "The correction is added to one motor and subtracted from the other. Real motors don't respond instantly: the simulation models that lag and the 100 Hz loop rate, which is exactly why untuned gains oscillate.",
  },
];

export default async function LabPage() {
  const code = await highlight(CODE, "cpp");
  return (
    <main className="grain relative bg-ink pb-24 pt-32 text-white">
      <div aria-hidden className="absolute left-1/2 top-0 h-[70vh] w-[110vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <header className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Link
              href="/projects/pid-line-follower"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 py-1 pl-1 pr-3 text-sm text-amber-100 transition hover:border-amber-300/60"
            >
              <span className="grid size-6 place-items-center rounded-full bg-amber-300 text-black">
                <Trophy className="size-3.5" />
              </span>
              1st Place · Delta 5.0 Robothon
            </Link>
            <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
              PID <span className="text-amber-300">Lab</span>
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-zinc-400">
            A real-time physics simulation of the line follower that won Delta 5.0. Change the gains, nudge the robot off course, switch
            cameras, and watch the error plot to see control theory happen.
          </p>
        </header>

        <div className="mt-12">
          <PIDLab variant="full" />
        </div>

        <section className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-300/80">how it works</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">Sense → decide → act, a hundred times a second</h2>
            </Reveal>
            <ol className="mt-10 space-y-8">
              {STEPS.map((s, i) => (
                <Reveal key={s.t} delay={i * 0.06} as="li">
                  <div className="flex gap-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-amber-300/40 font-display text-lg font-bold text-amber-300">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{s.t}</h3>
                      <p className="mt-1.5 leading-relaxed text-zinc-400">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal delay={0.1}>
            <div className="prose-blog !text-zinc-300 [&_pre]:!m-0 [&_pre]:!text-[13px]" dangerouslySetInnerHTML={{ __html: code }} />
            <p className="mt-3 font-mono text-xs text-zinc-500">Illustrative code. The simulation implements the same loop in TypeScript.</p>
          </Reveal>
        </section>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div>
            <div className="font-display text-xl font-semibold">See the real robot</div>
            <p className="text-zinc-400">Competition footage, tech and story on the project page.</p>
          </div>
          <Link href="/projects/pid-line-follower" className="group inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-black transition hover:bg-amber-200">
            PID Line Follower <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
