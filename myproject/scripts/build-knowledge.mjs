#!/usr/bin/env node
// Compiles knowledge/*.csv, knowledge/*.md and blog front-matter into
// lib/generated/knowledge.json, which the /api/chat route bundles.
// Runs automatically before `dev` and `build`; fails loudly on bad input so a
// broken knowledge file can never reach production.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const KNOWLEDGE = path.join(root, "knowledge");
const BLOG = path.join(root, "content", "blog");
const OUT_DIR = path.join(root, "lib", "generated");
const OUT = path.join(OUT_DIR, "knowledge.json");
const checkOnly = process.argv.includes("--check");

const errors = [];
const chunks = [];

/** RFC-4180-ish CSV parser (quotes, escaped quotes, commas/newlines in quotes). */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (q) throw new Error("unterminated quoted field");
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

const files = fs.existsSync(KNOWLEDGE) ? fs.readdirSync(KNOWLEDGE).sort() : [];
if (!files.length) errors.push("knowledge/ folder is empty or missing");

for (const file of files) {
  const full = path.join(KNOWLEDGE, file);
  const rel = `knowledge/${file}`;
  if (file.toLowerCase() === "readme.md" || file.startsWith(".")) continue;

  if (file.endsWith(".csv")) {
    let rows;
    try { rows = parseCSV(fs.readFileSync(full, "utf8")); }
    catch (e) { errors.push(`${rel}: ${e.message}`); continue; }
    const header = rows.shift()?.map((h) => h.trim().toLowerCase());
    if (!header || header.join(",") !== "id,title,content") {
      errors.push(`${rel}: header must be exactly "id,title,content" (got "${header?.join(",")}")`);
      continue;
    }
    const seen = new Set();
    rows.forEach((r, i) => {
      const line = i + 2;
      if (r.length !== 3) { errors.push(`${rel}:${line}: expected 3 columns, got ${r.length}. Wrap content containing commas in "quotes"`); return; }
      const [id, title, content] = r.map((s) => s.trim());
      if (!title || !content) { errors.push(`${rel}:${line}: title and content are required`); return; }
      if (seen.has(id)) errors.push(`${rel}:${line}: duplicate id "${id}"`);
      seen.add(id);
      chunks.push({ id: `${file}#${id}`, title, text: content, source: rel });
    });
  } else if (file.endsWith(".md") || file.endsWith(".txt")) {
    const body = fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n");
    const doc = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? file;
    const sections = body.split(/^##\s+/m).slice(1);
    if (!sections.length) {
      const text = body.replace(/^#.*$/m, "").trim();
      if (text) chunks.push({ id: file, title: doc, text, source: rel });
      else errors.push(`${rel}: file is empty`);
    }
    sections.forEach((s, i) => {
      const [first, ...rest] = s.split("\n");
      const text = rest.join("\n").trim();
      if (!text) { errors.push(`${rel}: section "${first.trim()}" is empty`); return; }
      chunks.push({ id: `${file}#${i}`, title: `${doc}: ${first.trim()}`, text, source: rel });
    });
  } else {
    errors.push(`${rel}: unsupported file type (use .csv or .md)`);
  }
}

// Blog posts: the bot knows they exist and what they're about.
const posts = fs.existsSync(BLOG) ? fs.readdirSync(BLOG).filter((f) => f.endsWith(".md")) : [];
for (const f of posts) {
  const { data } = matter(fs.readFileSync(path.join(BLOG, f), "utf8"));
  const slug = f.replace(/\.md$/, "");
  if (!data.title || !data.date) { errors.push(`content/blog/${f}: front-matter needs title and date`); continue; }
  chunks.push({
    id: `blog:${slug}`,
    title: `Blog post: ${data.title}`,
    text: `Manav wrote a blog post titled "${data.title}" (${new Date(data.date).toISOString().slice(0, 10)}). ${data.description ?? ""} Read it at /blogs/${slug}.`,
    source: `content/blog/${f}`,
    href: `/blogs/${slug}`,
  });
}

const totalChars = chunks.reduce((n, c) => n + c.text.length + c.title.length, 0);

if (errors.length) {
  console.error(`\n✖ Knowledge base has ${errors.length} problem(s):\n` + errors.map((e) => `  • ${e}`).join("\n") + "\n");
  process.exit(1);
}

console.log(`✓ Knowledge base OK: ${chunks.length} chunks, ~${Math.round(totalChars / 4)} tokens`);
if (totalChars > 60000) console.warn("  ⚠ Large knowledge base: only the most relevant chunks will be sent per question.");

if (!checkOnly) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ chunks }, null, 1));
}
