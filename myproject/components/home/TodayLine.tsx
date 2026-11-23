"use client";

import { useClientValue, everyMs } from "@/lib/use-client-value";
import NepaliDate from "nepali-date-converter";
import { site } from "@/content/site";

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function compute() {
  // "today" in Nepal, regardless of the visitor's timezone
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: site.timezone, year: "numeric", month: "numeric", day: "numeric" })
    .formatToParts(new Date())
    .reduce<Record<string, number>>((a, p) => (p.type !== "literal" ? { ...a, [p.type]: Number(p.value) } : a), {});
  const ad = new Date(parts.year, parts.month - 1, parts.day);
  const month = ad.toLocaleDateString("en-US", { month: "long" });
  let bs = "";
  try {
    const nd = new NepaliDate(ad);
    bs = `${ordinal(nd.getDate())} of ${nd.format("MMMM", "en")} ${nd.getYear()} B.S`;
  } catch {}
  return { ad: `${ordinal(parts.day)} ${month} ${parts.year} A.D`, bs };
}

/** "As of today (23rd November 2026 A.D / 7th of Mangsir 2083 B.S)": always current. */
const read = () => JSON.stringify(compute());
const hourly = everyMs(60 * 60_000);

export default function TodayLine() {
  const raw = useClientValue(read, null, hourly);
  const d = raw ? (JSON.parse(raw) as { ad: string; bs: string }) : null;
  if (!d) return <span className="inline-block h-[1em] w-64 animate-pulse rounded bg-black/10 align-middle" />;
  return (
    <span>
      {d.ad}
      {d.bs && <> / {d.bs}</>}
    </span>
  );
}
