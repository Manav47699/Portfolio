// Tiny event bus so any component (hero, header, project pages) can open Lucky
// or ask it a question without prop drilling or a global store.

export const LUCKY_EVENT = "lucky:open";

export type LuckyDetail = { question?: string };

export function openLucky(question?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<LuckyDetail>(LUCKY_EVENT, { detail: { question } }));
}
