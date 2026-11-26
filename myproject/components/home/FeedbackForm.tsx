"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import Wave from "@/components/Wave";
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
        setStatus({ kind: "error", msg: "The mail service is unavailable right now.", mailto: true });
      } else {
        setStatus({ kind: "error", msg: data.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", msg: "Network error. Please try again.", mailto: true });
    }
  };

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(form.feedback)}`;
  const field =
    "w-full rounded-lg border border-rule bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none";

  return (
    <section id="contact" className="relative overflow-hidden bg-bone px-5 pb-36 pt-36 text-zinc-900 sm:px-8 sm:pb-44 sm:pt-40">
      <Wave fill="var(--color-ink)" position="top" />
      <div className="relative z-[5] mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Suggestions or inquiries</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-zinc-600">
            Feedback on the site, a project idea, or an opportunity. It goes straight to my inbox.
          </p>
          <p className="mt-6 text-[15px] text-zinc-600">
            Or email me at{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-4 hover:decoration-zinc-900">
              {site.email}
            </a>
          </p>
        </div>

        {status.kind === "sent" ? (
          <div className="flex flex-col items-start justify-center rounded-xl border border-rule bg-white p-8" role="status">
            <span className="grid size-10 place-items-center rounded-full bg-zinc-900 text-white">
              <Check className="size-5" />
            </span>
            <p className="mt-4 font-display text-xl font-semibold">Message sent. Thank you!</p>
            <p className="mt-1 text-zinc-600">I&apos;ll get back to you soon.</p>
            <button onClick={() => setStatus({ kind: "idle" })} className="mt-5 text-sm font-medium underline underline-offset-4">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input aria-label="Your name" placeholder="Your name (optional)" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              <input
                aria-label="Your email"
                type="email"
                required
                maxLength={200}
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
              />
            </div>
            <textarea
              aria-label="Your message"
              required
              rows={6}
              maxLength={5000}
              placeholder="Your message…"
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              className={`${field} resize-none`}
            />
            {/* honeypot */}
            <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />

            {status.kind === "error" && (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {status.msg}{" "}
                {status.mailto && (
                  <a href={mailtoHref} className="font-semibold underline underline-offset-4">
                    Email me directly instead
                  </a>
                )}
              </p>
            )}

            <button
              type="submit"
              disabled={status.kind === "sending"}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-70"
            >
              {status.kind === "sending" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message <Send className="size-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
      <Wave fill="var(--color-ink)" position="bottom" />
    </section>
  );
}
