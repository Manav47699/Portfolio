import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-6 text-center text-white">
      <svg aria-hidden className="absolute inset-x-0 top-[72%] -z-0 h-40 w-full -translate-y-1/2 opacity-30" viewBox="0 0 1200 160" preserveAspectRatio="none">
        <path d="M0,80 C200,20 300,140 520,80 L560,80" stroke="#fcd34d" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M700,80 C900,20 1000,140 1200,80" stroke="#fcd34d" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="2 14" />
      </svg>
      <div className="relative">
        <p className="font-mono text-sm text-zinc-500">404</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">The robot lost the line.</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-zinc-400">
          All five sensors read white. This page doesn&apos;t exist, or it moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-black transition-colors hover:bg-amber-200">
            Back to the track
          </Link>
          <Link href="/projects" className="rounded-full border border-white/20 px-6 py-3 font-medium transition hover:border-white/50">
            See projects
          </Link>
        </div>
      </div>
    </main>
  );
}
