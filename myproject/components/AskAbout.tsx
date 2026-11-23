"use client";

import Image from "next/image";
import { openLucky } from "@/lib/lucky-events";

export default function AskAbout({ title }: { title: string }) {
  const qs = [`How does ${title} work?`, `What tech does ${title} use?`];
  return (
    <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="flex items-center gap-3">
        <Image src="/images/mascot.jpeg" alt="" width={40} height={40} className="size-10 rounded-xl object-cover" />
        <div>
          <div className="font-display font-semibold text-zinc-900">Curious about this one?</div>
          <div className="text-sm text-zinc-500">Lucky knows the details.</div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {qs.map((q) => (
          <button
            key={q}
            onClick={() => openLucky(q)}
            className="w-full rounded-xl border border-indigo-200 bg-white px-3.5 py-2.5 text-left text-sm text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
