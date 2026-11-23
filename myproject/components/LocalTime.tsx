"use client";

import { site } from "@/content/site";
import { useClientValue, everyMs } from "@/lib/use-client-value";

const read = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: site.timezone });

const tick = everyMs(15_000);

export default function LocalTime() {
  const now = useClientValue(read, null, tick);
  return <span>{now ?? "--:--"} NPT</span>;
}
