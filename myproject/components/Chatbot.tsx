"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, RotateCcw, X, FileText } from "lucide-react";
import { LUCKY_EVENT, type LuckyDetail } from "@/lib/lucky-events";

type Source = { title: string; href: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[]; error?: boolean };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm **Lucky**, Manav's portfolio assistant. Ask me about his projects, tech stack, or how to reach him.",
};

const SUGGESTIONS = [
  "What competitions has Manav won?",
  "How does BINFINITY work?",
  "What's his tech stack?",
  "What has he built with AI?",
];

const STORE = "lucky:v2";

/** Minimal, safe markdown: escapes HTML first, then bold/italic/code/links/lists. */
function renderMarkdown(src: string) {
  const esc = src.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  const inline = (s: string) =>
    s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/(?!\/)|mailto:)[^)\s]+)\)/g, (_, t, u) => {
        const ext = /^https?:/.test(u);
        return `<a href="${u}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ' data-internal="1"'}>${t}</a>`;
      });
  const lines = esc.split("\n");
  let html = "", list: "ul" | "ol" | null = null;
  for (const raw of lines) {
    const line = raw.trimEnd();
    const ul = line.match(/^\s*[-*•]\s+(.*)/), ol = line.match(/^\s*\d+[.)]\s+(.*)/);
    if (ul || ol) {
      const kind = ul ? "ul" : "ol";
      if (list !== kind) { if (list) html += `</${list}>`; html += `<${kind}>`; list = kind; }
      html += `<li>${inline((ul ?? ol)![1])}</li>`;
      continue;
    }
    if (list) { html += `</${list}>`; list = null; }
    if (line.trim()) html += `<p>${inline(line)}</p>`;
  }
  if (list) html += `</${list}>`;
  return html;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);
  const restored = useRef(false);

  // restore conversation for this tab
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
    restored.current = true;
  }, []);

  useEffect(() => {
    if (!restored.current || busy) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages, busy]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: busy ? "auto" : "smooth" });
  }, [messages, busy]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      setInput("");
      const history = [...messages.filter((m) => m !== GREETING && !m.error), { role: "user" as const, content: q }];
      setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "" }]);
      setBusy(true);
      abort.current = new AbortController();

      const patchLast = (fn: (m: Msg) => Msg) =>
        setMessages((all) => {
          const copy = all.slice();
          copy[copy.length - 1] = fn(copy[copy.length - 1]);
          return copy;
        });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-8).map(({ role, content }) => ({ role, content })) }),
          signal: abort.current.signal,
        });
        let sources: Source[] = [];
        try {
          sources = JSON.parse(decodeURIComponent(res.headers.get("X-Sources") ?? "%5B%5D"));
        } catch {}
        if (!res.ok || !res.body) {
          const msg = await res.text().catch(() => "");
          patchLast(() => ({ role: "assistant", content: msg || "Something went wrong. Please try again.", error: true }));
          return;
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          const snapshot = acc;
          patchLast((m) => ({ ...m, content: snapshot }));
        }
        patchLast((m) => ({ ...m, content: acc.trim() || "Hmm, I drew a blank. Try rephrasing?", sources }));
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        patchLast(() => ({ role: "assistant", content: "I couldn't reach the server. Check your connection and try again.", error: true }));
      } finally {
        setBusy(false);
        abort.current = null;
      }
    },
    [busy, messages],
  );

  // open from anywhere: header, hero, project pages, ⌘K
  useEffect(() => {
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent<LuckyDetail>).detail?.question;
      setOpen(true);
      if (q) setTimeout(() => send(q), 120);
      else setTimeout(() => inputRef.current?.focus(), 150);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 150);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener(LUCKY_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(LUCKY_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [send]);

  const reset = () => {
    abort.current?.abort();
    setMessages([GREETING]);
    setBusy(false);
  };

  const showSuggestions = messages.length <= 1 && !busy;

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Lucky, the portfolio assistant"
        inert={open}
        className={`fixed bottom-5 right-5 z-50 hidden size-14 overflow-hidden sm:block rounded-full ring-2 ring-white/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] transition duration-300 hover:scale-105 ${
          open ? "pointer-events-none scale-75 opacity-0" : "opacity-100"
        }`}
      >
        <Image src="/images/mascot.jpeg" alt="" width={56} height={56} className="size-full object-cover" />
      </button>

      <section
        role="dialog"
        aria-label="Chat with Lucky"
        inert={!open}
        className={`fixed inset-0 z-[70] flex origin-bottom-right flex-col overflow-hidden bg-white text-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] transition duration-300 ease-[cubic-bezier(.2,.8,.2,1)] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(640px,calc(100dvh-2.5rem))] sm:w-[400px] sm:rounded-2xl sm:border sm:border-zinc-200 ${
          open ? "opacity-100" : "pointer-events-none translate-y-4 scale-[0.97] opacity-0"
        }`}
      >
        <header className="flex items-center gap-3 bg-ink px-4 py-3 text-white">
          <Image src="/images/mascot.jpeg" alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[16px] font-semibold leading-tight">Lucky</div>
            <div className="text-xs text-zinc-400">Answers questions about Manav&apos;s work</div>
          </div>
          <button onClick={reset} aria-label="New conversation" title="New conversation" className="grid size-9 place-items-center rounded-full hover:bg-white/10">
            <RotateCcw className="size-4" />
          </button>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="grid size-9 place-items-center rounded-full hover:bg-white/10">
            <X className="size-5" />
          </button>
        </header>

        <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-4 py-4" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-zinc-900 text-white"
                    : m.error
                      ? "rounded-bl-md border border-red-200 bg-red-50 text-red-800"
                      : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800"
                }`}
              >
                {m.role === "assistant" && !m.content && busy && i === messages.length - 1 ? (
                  <span className="flex gap-1 py-1.5" aria-label="Lucky is typing">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="size-1.5 animate-pulse rounded-full bg-zinc-400" style={{ animationDelay: `${d * 0.2}s` }} />
                    ))}
                  </span>
                ) : m.role === "assistant" ? (
                  <div
                    className="chat-md"
                    onClick={(e) => {
                      const a = (e.target as HTMLElement).closest("a[data-internal]");
                      if (a && window.innerWidth < 640) setOpen(false);
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                  />
                ) : (
                  m.content
                )}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-2">
                    {m.sources.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={() => window.innerWidth < 640 && setOpen(false)}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11.5px] font-medium text-zinc-700 transition hover:bg-zinc-200"
                      >
                        <FileText className="size-3" />
                        {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[13px] text-zinc-700 transition hover:border-zinc-500"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="border-t border-zinc-200 bg-white p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="flex items-end gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 transition-colors focus-within:border-zinc-900">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={600}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about projects, skills, awards…"
              aria-label="Message Lucky"
              className="max-h-28 flex-1 resize-none bg-transparent py-1 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              aria-label="Send"
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-zinc-900 text-white transition hover:bg-zinc-700 disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-zinc-400">Lucky can make mistakes. For anything important, email Manav.</p>
        </form>
      </section>
    </>
  );
}
