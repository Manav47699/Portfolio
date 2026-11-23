import type { Chunk } from "./knowledge";

// Lightweight BM25 retrieval. The knowledge base is small enough that we usually
// send *all* of it to the model (no embeddings, no vector DB, nothing to sync),
// ranked so the most relevant facts come first. If it ever grows past the budget,
// only the top-scoring chunks are sent.

const STOP = new Set(
  "a an and are as at be but by can could did do does for from had has have he her him his how i if in into is it its just me my of on or our she so than that the their them then there these they this to was we were what when where which who why will with would you your about tell does manav manav's work works worked written write wrote go goes going use used know get got show give any some much many like".split(
    " ",
  ),
);

const SYN: Record<string, string[]> = {
  robot: ["robotic", "pid", "line", "follower", "hardware", "arduino"],
  award: ["won", "win", "place", "runner", "achievement", "competition", "prize"],
  win: ["award", "won", "place"],
  contact: ["email", "mail", "reach", "hire", "social"],
  hire: ["available", "internship", "availability", "contact"],
  skill: ["stack", "tech", "technology", "language", "tool"],
  ai: ["ml", "machine", "learning", "llm", "model", "cnn", "yolo"],
  web: ["website", "next", "django", "fastapi", "frontend", "backend"],
  study: ["education", "college", "campus", "degree", "university"],
  college: ["campus", "education", "degree", "purwanchal", "university"],
  university: ["campus", "education", "degree", "purwanchal"],
  stack: ["skill", "tech", "django", "fastapi", "next.js", "python"],
  internship: ["available", "availability", "open", "hire", "collaborat"],
  blog: ["post", "wrote", "guide"],
  school: ["education", "college", "campus"],
  garbage: ["binfinity", "waste", "classifier", "bin"],
};

function stem(w: string) {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  return w;
}

export function tokenize(s: string) {
  return (s.toLowerCase().match(/[a-z0-9.+#]+/g) ?? [])
    .map((w) => w.replace(/\.+$/, ""))
    .filter((w) => w && !STOP.has(w))
    .flatMap((w) => {
      // "yolov5" → also "yolo", "llama3" → also "llama"
      const base = w.match(/^([a-z]{3,}?)v?\d+(\.\d+)*$/)?.[1];
      return base ? [stem(w), base] : [stem(w)];
    });
}

type Indexed = { chunk: Chunk; tf: Map<string, number>; len: number };

let cache: { docs: Indexed[]; df: Map<string, number>; avg: number } | null = null;

function index(chunks: Chunk[]) {
  if (cache && cache.docs.length === chunks.length) return cache;
  const df = new Map<string, number>();
  const docs = chunks.map((chunk) => {
    const toks = tokenize(`${chunk.title} ${chunk.title} ${chunk.text}`);
    const tf = new Map<string, number>();
    toks.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
    tf.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1));
    return { chunk, tf, len: toks.length };
  });
  const avg = docs.reduce((n, d) => n + d.len, 0) / Math.max(docs.length, 1);
  cache = { docs, df, avg };
  return cache;
}

export function rank(chunks: Chunk[], query: string) {
  const { docs, df, avg } = index(chunks);
  const base = tokenize(query);
  const terms = new Set(base);
  base.forEach((t) => SYN[t]?.forEach((s) => terms.add(stem(s))));
  const N = docs.length, k1 = 1.4, b = 0.75;

  return docs
    .map((d) => {
      let score = 0;
      terms.forEach((t) => {
        const f = d.tf.get(t);
        if (!f) return;
        const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
        const w = base.includes(t) ? 1 : 0.45; // synonyms count for less
        score += w * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avg)));
      });
      return { chunk: d.chunk, score };
    })
    .sort((a, b) => b.score - a.score);
}

/** Returns the context block for the prompt and the sources worth showing the user. */
export function buildContext(chunks: Chunk[], query: string, budgetChars = 24000) {
  const ranked = rank(chunks, query);
  const picked: Chunk[] = [];
  let used = 0;
  for (const { chunk } of ranked) {
    const size = chunk.title.length + chunk.text.length + 8;
    if (used + size > budgetChars) continue;
    picked.push(chunk);
    used += size;
  }
  const top = ranked[0]?.score ?? 0;
  const seen = new Set<string>();
  const sources = ranked
    .slice(0, 4) // only the strongest matches can become visible sources
    .filter((r) => r.score > 0 && r.score >= top * 0.55 && r.chunk.href)
    .filter((r) => (seen.has(r.chunk.href!) ? false : (seen.add(r.chunk.href!), true)))
    .slice(0, 3)
    .map((r) => ({ title: r.chunk.title.replace(/^(Project|Blog post|Award): /, ""), href: r.chunk.href! }));

  const context = picked.map((c, i) => `[${i + 1}] ${c.title}\n${c.text}`).join("\n\n");
  return { context, sources, ranked };
}
