# manavacharya.com.np

Personal portfolio of **Manav Acharya**, a computer engineering student from Dharan, Nepal, who builds robots, AI systems and full-stack web apps.

**Live:** https://www.manavacharya.com.np

## Highlights

- **PID Lab:** a real-time 3D physics simulation of my 1st-place (Delta 5.0) line-follower robot. Five IR sensors, motor lag and a 100 Hz control loop are modelled, so bad gains really do make it snake. Built with React Three Fiber; the robot is procedural geometry, no model files.
- **Lucky:** an AI assistant that streams answers about my work, grounded in a knowledge base kept in this repo, with source links to the relevant pages.
- **Case study page** for every project, generated from a single typed content file.
- **Markdown blog** with Shiki syntax highlighting.
- Today's date in the About section in both A.D. and B.S. (Bikram Sambat).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · three.js / React Three Fiber · Shiki · Vercel

## Project layout

```
myproject/
  app/                  routes (home, projects/[slug], lab, blogs/[slug], contacts, api/*)
  components/           UI; components/lab/* is the 3D PID simulator
  content/
    site.ts             name, socials, awards, tech stack
    projects.ts         every project (cards, case studies, chatbot all read this)
    blog/*.md           blog posts
  knowledge/            Lucky's knowledge base (CSV + Markdown)
  lib/
    pid/sim.ts          robot physics + PID controller (pure TS)
    chat/*              retrieval + LLM provider chain
  public/media/         compressed project videos + posters
```

## Updating content: just push

| I want to…               | Edit                                         |
| ------------------------ | -------------------------------------------- |
| Teach Lucky something    | `myproject/knowledge/*.csv` or `*.md`        |
| Add / change a project   | `myproject/content/projects.ts` (+ video in `public/media/`) |
| Write a blog post        | add `myproject/content/blog/<slug>.md`       |
| Change socials / awards  | `myproject/content/site.ts`                  |

Commit and push to `main`. GitHub Actions validates the knowledge base, typechecks, lints and builds; Vercel deploys automatically. If anything is malformed the build fails and the previous version stays live.

Lucky reads projects, awards and blog posts automatically, so adding a project teaches the bot about it too.

## How Lucky works

1. Knowledge files are compiled at build time (`scripts/build-knowledge.mjs`), no vector DB or embedding step.
2. Each question is ranked against the knowledge with BM25, and the most relevant facts go first in the prompt.
3. `/api/chat` streams the answer from the first available LLM provider: **Groq → Groq (fast model) → Gemini → any OpenAI-compatible API**. If one is down or rate-limited it falls through to the next.
4. With no API key at all, Lucky still answers by quoting the best-matching knowledge.

It runs as a Vercel serverless function next to the site: no separate server, no cold-start sleep.

## Running locally

```bash
cd myproject
cp .env.example .env.local   # add GROQ_API_KEY (free at console.groq.com)
npm install
npm run dev
```

Useful scripts: `npm run knowledge` (validate + compile the knowledge base), `npm run typecheck`, `npm run lint`, `npm run build`.

## Environment variables (Vercel → Settings → Environment Variables)

| Variable          | Needed for                    | Get one                         |
| ----------------- | ----------------------------- | ------------------------------- |
| `GROQ_API_KEY`    | Lucky (primary, free)         | https://console.groq.com/keys   |
| `GEMINI_API_KEY`  | Lucky (optional backup, free) | https://aistudio.google.com/apikey |
| `RESEND_API_KEY`  | Contact form emails           | https://resend.com/api-keys     |

See `myproject/.env.example` for optional overrides.

---

The previous version of this site (with the Python/FastAPI RAG backend) is preserved on the [`original`](../../tree/original) branch.
