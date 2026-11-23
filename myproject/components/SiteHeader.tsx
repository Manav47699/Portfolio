"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useClientValue } from "@/lib/use-client-value";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";
import { openLucky } from "@/lib/lucky-events";

const NAV = [
  { href: "/#about", label: "About me", match: (p: string) => p === "/#about" },
  { href: "/projects", label: "Projects", match: (p: string) => p.startsWith("/projects") },
  { href: "/lab", label: "PID Lab", match: (p: string) => p.startsWith("/lab") },
  { href: "/blogs", label: "Blogs", match: (p: string) => p.startsWith("/blogs") },
  { href: "/contacts", label: "Contacts", match: (p: string) => p.startsWith("/contacts") },
];

const onScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useClientValue(() => window.scrollY > 24, false, onScroll);
  const mac = useClientValue(() => /Mac|iPhone|iPad/.test(navigator.userAgent), true);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // close the drawer on navigation (state adjustment during render, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const active = NAV.find((n) => n.match(pathname))?.href ?? null;
  const pill = hovered ?? active;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <div
          className={`pointer-events-auto relative flex items-center justify-between text-amber-100 transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
            scrolled
              ? "mt-3 w-[min(100%-1.5rem,880px)] rounded-full px-2 py-1.5 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.55)]"
              : "mt-0 w-full rounded-b-[2.5rem] px-4 py-3 shadow-[0_8px_40px_-6px_rgba(255,255,255,0.28)] sm:rounded-b-full sm:px-6"
          }`}
        >
          {/* the original blue gradient, now with depth */}
          <div
            aria-hidden
            className={`absolute inset-0 -z-10 bg-gradient-to-r from-blue-500 via-blue-950 to-blue-900 transition-all duration-500 ${
              scrolled ? "rounded-full opacity-95 backdrop-blur-xl" : "rounded-b-[2.5rem] sm:rounded-b-full"
            }`}
          />
          <div aria-hidden className={`absolute inset-x-8 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent ${scrolled ? "opacity-100" : "opacity-0"}`} />

          <Link
            href="/"
            aria-label="Manav Acharya, home"
            className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
          >
            <span className="grid size-9 place-items-center rounded-full bg-amber-300 font-display text-sm font-extrabold text-blue-950 transition-transform duration-500 group-hover:rotate-[360deg]">
              MA
            </span>
            <span className={`hidden font-display text-[15px] font-semibold tracking-tight text-amber-50 md:block ${scrolled ? "md:hidden" : ""}`}>
              Manav Acharya
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
              {NAV.map((n) => (
                <li key={n.href} className="relative">
                  <Link
                    href={n.href}
                    onMouseEnter={() => setHovered(n.href)}
                    aria-current={active === n.href ? "page" : undefined}
                    className={`relative z-10 block rounded-xl px-4 py-2 text-[15px] font-medium transition-colors duration-300 ${
                      pill === n.href ? "text-blue-950" : "text-amber-100/90 hover:text-amber-50"
                    }`}
                  >
                    {n.label}
                  </Link>
                  {pill === n.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-amber-300"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openLucky()}
              className="group hidden items-center gap-2 rounded-full border border-amber-200/25 bg-white/5 py-1.5 pl-3 pr-1.5 text-sm text-amber-50 transition hover:border-amber-200/60 hover:bg-white/10 sm:flex"
            >
              <Sparkles className="size-4 text-amber-300 transition group-hover:rotate-12" />
              Ask Lucky
              <kbd className="rounded-full bg-black/30 px-2 py-0.5 font-mono text-[11px] text-amber-100/70">{mac ? "⌘K" : "Ctrl K"}</kbd>
            </button>
            <button
              className="grid size-10 place-items-center rounded-full text-amber-100 hover:bg-white/10 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer: same gradient sidebar as before */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 left-0 z-[61] flex w-[80vw] max-w-xs flex-col bg-gradient-to-b from-blue-500 via-blue-950 to-blue-900 p-5 text-amber-100 shadow-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-amber-50">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
                  <X className="size-6" />
                </button>
              </div>
              <ul className="space-y-1">
                {[{ href: "/", label: "Home" }, ...NAV].map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-lg font-medium transition-colors ${
                        active === n.href || (n.href === "/" && pathname === "/") ? "bg-amber-300 text-blue-950" : "hover:bg-amber-300 hover:text-blue-950"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setOpen(false);
                  openLucky();
                }}
                className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-blue-950"
              >
                <Sparkles className="size-4" /> Ask Lucky
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
