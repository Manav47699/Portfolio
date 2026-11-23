"use client";

import { useSyncExternalStore } from "react";

/**
 * Read a browser-only value without hydration mismatches: the server (and the
 * first client render) get `fallback`, then the real value. `subscribe` decides
 * when it is re-read (timer, scroll, etc.). The snapshot must be a primitive.
 */
export function useClientValue<T extends string | number | boolean | null>(
  read: () => T,
  fallback: T,
  subscribe: (onChange: () => void) => () => void = () => () => {},
) {
  return useSyncExternalStore(subscribe, read, () => fallback);
}

export const everyMs = (ms: number) => (cb: () => void) => {
  const id = setInterval(cb, ms);
  return () => clearInterval(id);
};
