import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { createHighlighter, type Highlighter } from "shiki";

// Blog posts are Markdown files in content/blog. Drop a new .md in, push, done.

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  number: number;
  repo?: string;
  tags: string[];
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), "content", "blog");

export function getPosts(): PostMeta[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        title: String(data.title),
        description: String(data.description ?? ""),
        date: new Date(data.date).toISOString().slice(0, 10),
        number: Number(data.number ?? 0),
        repo: data.repo ? String(data.repo) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
      };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

let hl: Promise<Highlighter> | null = null;
const LANGS = ["bash", "json", "javascript", "typescript", "tsx", "python", "cpp", "c", "html", "css", "yaml"];
const getHighlighter = () => (hl ??= createHighlighter({ themes: ["vitesse-dark"], langs: LANGS }));

export function highlight(code: string, lang: string) {
  return getHighlighter().then((h) => {
    const l = LANGS.includes(lang) ? lang : "bash";
    return h.codeToHtml(code, { lang: l, theme: "vitesse-dark" }).replace("<pre ", `<pre data-lang="${lang}" `);
  });
}

const ALERT = /^\s*\[!(NOTE|TIP|WARNING|SUCCESS|IMPORTANT)\]\s*/i;

export async function getPost(slug: string) {
  const file = path.join(DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const { content } = matter(fs.readFileSync(file, "utf8"));
  const meta = getPosts().find((p) => p.slug === slug)!;
  const h = await getHighlighter();

  const md = new Marked({
    gfm: true,
    renderer: {
      code({ text, lang }: Tokens.Code) {
        const l = (lang || "bash").split(/\s/)[0];
        const ok = LANGS.includes(l) ? l : "bash";
        return h.codeToHtml(text, { lang: ok, theme: "vitesse-dark" }).replace("<pre ", `<pre data-lang="${l}" `);
      },
      blockquote({ tokens }: Tokens.Blockquote) {
        const first = tokens[0] as Tokens.Paragraph | undefined;
        const m = first?.type === "paragraph" ? first.text.match(ALERT) : null;
        if (!m) return `<blockquote>${this.parser.parse(tokens)}</blockquote>`;
        const kind = m[1].toLowerCase();
        const cls = kind === "warning" || kind === "important" ? "warning" : kind === "success" ? "success" : "note";
        const label = { note: "Note", tip: "Tip", warning: "Heads up", important: "Important", success: "Success" }[kind];
        first!.text = first!.text.replace(ALERT, "");
        if (first!.tokens?.[0] && "text" in first!.tokens[0]) {
          (first!.tokens[0] as Tokens.Text).text = (first!.tokens[0] as Tokens.Text).text.replace(ALERT, "");
          if ("raw" in first!.tokens[0]) (first!.tokens[0] as Tokens.Text).raw = (first!.tokens[0] as Tokens.Text).text;
        }
        return `<div class="callout callout-${cls}"><div class="callout-title">${label}</div>${this.parser.parse(tokens)}</div>`;
      },
      link({ href, text }: Tokens.Link) {
        const ext = /^https?:/.test(href);
        return `<a href="${href}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
      },
    },
  });

  const html = await md.parse(content);
  return { meta, html };
}
