# Lucky's knowledge base

Everything the chatbot knows comes from this folder **plus** `content/projects.ts`,
`content/site.ts` and the blog posts in `content/blog/`.

## How to update Lucky

1. Edit or add files here:
   - `*.csv`: columns must be exactly `id,title,content`. Wrap content in "quotes" if it contains commas.
   - `*.md`: every `## Heading` becomes its own searchable chunk. Keep each section focused on one topic.
2. Run `npm run knowledge` to check your changes (optional, CI does it too).
3. Commit and push to `main`.

GitHub Actions validates the files, then Vercel rebuilds and Lucky picks up the new knowledge in about a minute.
If a file is malformed the build fails and the **previous version stays live**, so you can't break production.

## Tips
- Write facts in the third person ("Manav built..."). Lucky answers in the third person too.
- One fact per row or section works best for retrieval.
- Don't put anything here you wouldn't want a visitor to read. Lucky may quote it.
