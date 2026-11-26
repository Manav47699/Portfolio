"use client";

import Image from "next/image";
import { openLucky } from "@/lib/lucky-events";

export default function AskAbout({ title }: { title: string }) {
  const qs = [`How does ${title} work?`, `What tech does ${title} use?`];
  return (
    <div className="rounded-2xl border border-rule bg-white p-6">
      <div className="flex items-center gap-3">
        <Image src="/images/mascot.jpeg" alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
        <div>
          <div className="font-display font-semibold text-zinc-900">Curious about this one?</div>
          <div className="text-sm text-zinc-500">Ask Lucky for the details.</div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {qs.map((q) => (
          <button
            key={q}
            onClick={() => openLucky(q)}
            className="w-full rounded-lg border border-rule px-3.5 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-900"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
