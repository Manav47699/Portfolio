"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useClientValue } from "@/lib/use-client-value";
import { openLucky } from "@/lib/lucky-events";

const NAV = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/#about", label: "About", match: () => false },
  { href: "/projects", label: "Projects", match: (p: string) => p.startsWith("/projects") },
  { href: "/blogs", label: "Blogs", match: (p: string) => p.startsWith("/blogs") },
  { href: "/contacts", label: "Contact", match: (p: string) => p.startsWith("/contacts") },
];

const onScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useClientValue(() => window.scrollY > 24, false, onScroll);
  const [open, setOpen] = useState(false);

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

  const isActive = (n: (typeof NAV)[number]) => n.match(pathname);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <div
          className={`pointer-events-auto flex items-center justify-between bg-navy text-zinc-100 transition-[width,margin,border-radius,padding] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
            scrolled
              ? "mt-3 w-[min(100%-1.5rem,760px)] rounded-full px-2 py-1.5 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
              : "mt-0 w-full rounded-b-[2.5rem] px-4 py-3 sm:rounded-b-full sm:px-10"
          }`}
        >
          <button
            className="grid size-10 place-items-center rounded-full hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" />
          </button>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n) ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors duration-200 ${
                      isActive(n) ? "bg-amber-300 text-navy" : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={() => openLucky()}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-sm font-medium text-zinc-100 ring-1 ring-white/15 transition hover:bg-white/10 hover:ring-white/30"
          >
            <Image src="/images/mascot.jpeg" alt="" width={28} height={28} className="size-7 rounded-full object-cover" />
            Ask Lucky
          </button>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-[61] flex w-[80vw] max-w-xs flex-col bg-navy p-5 text-zinc-100 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-end">
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
            <X className="size-5" />
          </button>
        </div>
        <ul className="space-y-1">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-lg font-medium transition-colors ${
                  isActive(n) ? "bg-amber-300 text-navy" : "hover:bg-white/10"
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            setOpen(false);
            openLucky();
          }}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-navy"
        >
          Ask Lucky
        </button>
      </aside>
    </>
  );
}
