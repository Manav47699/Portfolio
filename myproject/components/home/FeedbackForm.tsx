"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Send } from "lucide-react";
import { site } from "@/content/site";

type Status = { kind: "idle" | "sending" | "sent" | "error"; msg?: string; mailto?: boolean };

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: "", email: "", feedback: "", website: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ kind: "sent" });
        setForm({ name: "", email: "", feedback: "", website: "" });
      } else if (data.mailto) {
        setStatus({ kind: "error", msg: "The mail service is taking a break.", mailto: true });
      } else {
        setStatus({ kind: "error", msg: data.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", msg: "Network error. Please try again.", mailto: true });
    }
  };

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(form.feedback)}`;
  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-500 transition focus:border-amber-300/70 focus:outline-none focus:ring-4 focus:ring-amber-300/10";

  return (
    <section className="relative bg-gradient-to-br from-zinc-900 via-ink to-zinc-900 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-800/40 p-6 shadow-2xl backdrop-blur sm:p-10">
          <div aria-hidden className="absolute -right-24 -top-24 size-64 rounded-full bg-amber-300/10 blur-3xl" />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">04 · say hi</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Suggestions or inquiries</h2>
          <p className="mt-2 text-zinc-400">Feedback on the site, a project idea, or an opportunity. It lands straight in my inbox.</p>

          <AnimatePresence mode="wait">
            {status.kind === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex flex-col items-center rounded-2xl border border-lime/30 bg-lime/10 px-6 py-10 text-center"
              >
                <span className="grid size-14 place-items-center rounded-full bg-lime text-black">
                  <Check className="size-7" />
                </span>
                <p className="mt-4 font-display text-xl font-semibold text-white">Message sent. Thank you!</p>
                <p className="mt-1 text-zinc-400">I&apos;ll get back to you soon.</p>
                <button onClick={() => setStatus({ kind: "idle" })} className="mt-5 text-sm text-amber-200 underline-offset-4 hover:underline">
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} className="mt-8 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input aria-label="Your name" placeholder="Your name (optional)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
                  <input
                    aria-label="Your email"
                    type="email"
                    required
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={field}
                  />
                </div>
                <textarea
                  aria-label="Your message"
                  required
                  rows={5}
                  placeholder="Your feedback..."
                  value={form.feedback}
                  onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                  className={`${field} resize-none`}
                />
                {/* honeypot */}
                <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />

                {status.kind === "error" && (
                  <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {status.msg}{" "}
                    {status.mailto && (
                      <a href={mailtoHref} className="font-semibold text-amber-200 underline underline-offset-4">
                        Email me directly instead →
                      </a>
                    )}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3.5 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-70"
                >
                  {status.kind === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Submit <Send className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
