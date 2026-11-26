"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import { Camera, Pause, Play, RotateCcw, Zap, Orbit } from "lucide-react";
import { PRESETS, DEFAULT_GAINS, type Gains } from "@/lib/pid/sim";
import { usePidSim } from "./usePidSim";

const LabScene = dynamic(() => import("./LabScene"), {
  ssr: false,
  loading: () => <SceneFallback label="Loading simulation…" />,
});

function SceneFallback({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#060608]">
      <div className="font-mono text-xs text-zinc-500">{label}</div>
    </div>
  );
}

/** If WebGL is unavailable (old GPU, disabled hardware acceleration) show the real thing instead. */
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="absolute inset-0">
        <video src="/media/pid-line-follower.mp4" poster="/media/pid-line-follower.webp" autoPlay muted loop playsInline className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-16 text-sm text-zinc-300">
          Your browser couldn&apos;t start 3D rendering, so here&apos;s the real robot instead. Try enabling hardware acceleration to play with the simulation.
        </div>
      </div>
    );
  }
}

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const SLIDERS: { key: keyof Gains; label: string; sub: string; min: number; max: number; step: number }[] = [
  { key: "kp", label: "Kp", sub: "proportional: reacts to the error now", min: 0, max: 3, step: 0.05 },
  { key: "ki", label: "Ki", sub: "integral: corrects accumulated drift", min: 0, max: 1, step: 0.01 },
  { key: "kd", label: "Kd", sub: "derivative: damps how fast error changes", min: 0, max: 0.6, step: 0.005 },
  { key: "speed", label: "Speed", sub: "base motor power", min: 0.3, max: 1, step: 0.01 },
];

function GuardedScene(props: React.ComponentProps<typeof LabScene>) {
  const [ok] = useState(() => webglAvailable());
  if (!ok) throw new Error("WebGL unavailable");
  return <LabScene {...props} />;
}

const fmt = (t: number | null) => (t === null ? "--.--" : t.toFixed(2));

export default function PIDLab({ variant = "full" }: { variant?: "full" | "compact" }) {
  const lab = usePidSim();
  const [gains, setGains] = useState<Gains>(DEFAULT_GAINS);
  const [preset, setPreset] = useState<string | null>("tuned");
  const [follow, setFollow] = useState(true);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const plot = useRef<HTMLCanvasElement>(null);
  const sensorEls = useRef<(HTMLSpanElement | null)[]>([]);
  // HUD text nodes, written directly each frame
  const els = useRef<Record<"lap" | "last" | "best" | "err" | "derails" | "status", HTMLElement | null>>({
    lap: null, last: null, best: null, err: null, derails: null, status: null,
  });
  const bind = (k: keyof typeof els.current) => (el: HTMLElement | null) => {
    els.current[k] = el;
  };

  // mount the WebGL scene only when it scrolls near, pause it when off-screen
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    lab.setPaused(paused);
  }, [paused, lab]);

  // HUD loop: write straight to the DOM, no React re-render per frame
  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const draw = () => {
      const s = lab.sim.state;
      const put = (el: HTMLElement | null, v: string) => {
        if (el && el.textContent !== v) el.textContent = v;
      };
      const e = els.current;
      put(e.lap, s.lapTime.toFixed(2));
      put(e.last, fmt(s.lastLap));
      put(e.best, fmt(s.bestLap));
      put(e.err, s.lapAbsErr === null ? "-" : s.lapAbsErr.toFixed(3));
      put(e.derails, String(s.derails));
      if (e.status) {
        put(e.status, s.derailedFor > 0 ? "OFF TRACK" : s.lost ? "SEARCHING" : "TRACKING");
        e.status.dataset.state = s.derailedFor > 0 ? "off" : s.lost ? "lost" : "ok";
      }
      s.sensors.forEach((v, i) => {
        const el = sensorEls.current[i];
        if (el) el.style.opacity = String(0.15 + 0.85 * v);
      });

      const c = plot.current;
      if (c) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = c.clientWidth, h = c.clientHeight;
        if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
        const g = c.getContext("2d")!;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, w, h);
        g.strokeStyle = "rgba(255,255,255,0.08)";
        g.lineWidth = 1;
        [0.25, 0.5, 0.75].forEach((f) => { g.beginPath(); g.moveTo(0, h * f); g.lineTo(w, h * f); g.stroke(); });
        const t = lab.telemetry;
        const N = t.err.length;
        const line = (arr: Float32Array, color: string, width: number) => {
          g.strokeStyle = color;
          g.lineWidth = width;
          g.beginPath();
          for (let k = 0; k < t.len; k++) {
            const idx = (t.head - t.len + k + N) % N;
            const x = (k / (N - 1)) * w + (w - (t.len / (N - 1)) * w);
            const y = h / 2 - (arr[idx] / 1.5) * (h / 2 - 4);
            if (k === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
          }
          g.stroke();
        };
        line(t.out, "rgba(96,165,250,0.65)", 1.25);
        line(t.err, "#fcd34d", 1.75);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [visible, lab]);

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id)!;
    setGains(p.gains);
    setPreset(id);
    lab.reset();
  };

  const reset = () => lab.reset();

  const activePreset = PRESETS.find((p) => p.id === preset);
  const compact = variant === "compact";

  return (
    <div
      ref={box}
      className="grid overflow-hidden rounded-[28px] border border-white/10 bg-[#060608] shadow-[0_40px_120px_-40px_rgba(59,130,246,0.35)] lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      {/* viewport */}
      <div className={`relative ${compact ? "h-[380px] sm:h-[480px] lg:h-auto lg:min-h-[600px]" : "h-[420px] sm:h-[540px] lg:h-auto lg:min-h-[680px]"}`}>
        {mounted ? (
          <SceneBoundary>
            <GuardedScene lab={lab} gains={gains} follow={follow} active={visible} />
          </SceneBoundary>
        ) : (
          <SceneFallback label="Robot parked" />
        )}

        {/* top-left status */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap items-center gap-2 sm:left-4 sm:top-4">
          <span
            ref={bind("status")}
            data-state="ok"
            className="rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-zinc-200 backdrop-blur data-[state=lost]:text-amber-300 data-[state=off]:text-red-400"
          >
            TRACKING
          </span>
          <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur">
            lap <span ref={bind("lap")} className="tabular-nums text-white">0.00</span>s
          </span>
        </div>

        {/* top-right controls */}
        <div className="absolute right-3 top-3 flex gap-1.5 sm:right-4 sm:top-4">
          {[
            { on: () => setFollow((f) => !f), icon: follow ? Orbit : Camera, label: follow ? "Overview camera" : "Chase camera" },
            { on: () => lab.sim.nudge(), icon: Zap, label: "Nudge the robot" },
            { on: () => setPaused((p) => !p), icon: paused ? Play : Pause, label: paused ? "Resume" : "Pause" },
            { on: reset, icon: RotateCcw, label: "Reset run" },
          ].map(({ on, icon: Icon, label }) => (
            <button
              key={label}
              onClick={on}
              title={label}
              aria-label={label}
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-black/60 text-white/80 backdrop-blur transition hover:border-amber-300/60 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-amber-300"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>

        {/* bottom-left: what the robot sees */}
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur sm:bottom-4 sm:left-4">
          <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">IR sensor array</div>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  sensorEls.current[i] = el;
                }}
                className="block h-3 w-6 rounded-sm bg-red-500 opacity-20 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
              />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 hidden font-mono text-[10px] text-white/35 sm:block">
          {follow ? "chase cam" : "drag to orbit · scroll to zoom"}
        </div>
      </div>

      {/* control panel */}
      <aside className="flex flex-col gap-5 border-t border-white/10 bg-white/[0.02] p-5 lg:border-l lg:border-t-0">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">Presets</div>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`rounded-xl border px-3 py-2 text-left text-[13px] transition ${
                  preset === p.id
                    ? "border-amber-300/70 bg-amber-300 text-black"
                    : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="mt-2 min-h-[2.5em] text-[12.5px] leading-snug text-white/55">
            {activePreset ? activePreset.hint : "Custom gains. Watch the trail and the error plot."}
          </p>
        </div>

        <div className="space-y-3.5">
          {SLIDERS.map((s) => (
            <label key={s.key} className="block">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-sm text-white">
                  {s.label}
                  {!compact && <span className="ml-2 font-sans text-[11px] text-white/40">{s.sub}</span>}
                </span>
                <span className="font-mono text-sm tabular-nums text-amber-200">{gains[s.key].toFixed(s.step < 0.01 ? 3 : 2)}</span>
              </div>
              <input
                type="range"
                className="range mt-1.5 w-full"
                min={s.min}
                max={s.max}
                step={s.step}
                value={gains[s.key]}
                aria-label={`${s.label}: ${s.sub}`}
                onChange={(e) => {
                  setGains((g) => ({ ...g, [s.key]: Number(e.target.value) }));
                  setPreset(null);
                }}
              />
            </label>
          ))}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            <span>Live signal · 6s</span>
            <span className="flex gap-3 normal-case tracking-normal">
              <span className="text-amber-200">— error</span>
              <span className="text-blue-300">— correction</span>
            </span>
          </div>
          <canvas ref={plot} className="h-24 w-full rounded-xl border border-white/10 bg-black/40" />
        </div>

        <dl className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          {[
            ["Last lap", "last", "s"],
            ["Best lap", "best", "s"],
            ["Avg |error|", "err", ""],
            ["Derails", "derails", ""],
          ].map(([k, r, u]) => (
            <div key={k as string} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <dt className="text-white/45">{k as string}</dt>
              <dd className="mt-0.5 text-base text-white tabular-nums">
                <span ref={bind(r as "last")}>-</span>
                <span className="text-white/40">{u as string}</span>
              </dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
