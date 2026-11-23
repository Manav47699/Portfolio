// Provider chain for any OpenAI-compatible chat API. Tries each configured
// provider in order and falls through on errors, timeouts or rate limits,
// so one free tier running out never takes the bot down.

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type Provider = { name: string; url: string; key: string; model: string };

export function configuredProviders(): Provider[] {
  const env = process.env;
  const list: Provider[] = [];
  if (env.GROQ_API_KEY) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    list.push({ name: "groq", url, key: env.GROQ_API_KEY, model: env.GROQ_MODEL || "llama-3.3-70b-versatile" });
    list.push({ name: "groq-fast", url, key: env.GROQ_API_KEY, model: env.GROQ_FALLBACK_MODEL || "llama-3.1-8b-instant" });
  }
  if (env.GEMINI_API_KEY) {
    list.push({
      name: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      key: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL || "gemini-2.5-flash",
    });
  }
  if (env.LLM_API_KEY && env.LLM_BASE_URL) {
    list.push({
      name: "custom",
      url: env.LLM_BASE_URL.replace(/\/$/, "") + "/chat/completions",
      key: env.LLM_API_KEY,
      model: env.LLM_MODEL || "gpt-4o-mini",
    });
  }
  return list;
}

async function openStream(p: Provider, messages: ChatMessage[], signal: AbortSignal) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000); // time to first byte
  signal.addEventListener("abort", () => ctrl.abort());
  try {
    const res = await fetch(p.url, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.key}` },
      body: JSON.stringify({ model: p.model, messages, stream: true, temperature: 0.4, max_tokens: 600 }),
    });
    if (!res.ok || !res.body) {
      throw new Error(`${p.name} ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
    }
    return { res, done: () => clearTimeout(timer) };
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

/** Yields text deltas from the first provider that answers. */
export async function* streamCompletion(messages: ChatMessage[], signal: AbortSignal) {
  const providers = configuredProviders();
  let lastErr: unknown = new Error("No LLM provider configured");

  for (const p of providers) {
    let opened;
    try {
      opened = await openStream(p, messages, signal);
    } catch (e) {
      lastErr = e;
      console.warn(`[lucky] provider ${p.name} failed:`, (e as Error).message);
      continue;
    }
    opened.done();
    const reader = opened.res.body!.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let yielded = false;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") return;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (delta) {
              yielded = true;
              yield delta as string;
            }
          } catch {
            /* keep-alive or partial line */
          }
        }
      }
      return;
    } catch (e) {
      lastErr = e;
      if (yielded) throw e; // can't silently switch providers mid-answer
    }
  }
  throw lastErr;
}
