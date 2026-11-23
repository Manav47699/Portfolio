import generated from "@/lib/generated/knowledge.json";
import { projects, categoryMeta } from "@/content/projects";
import { site } from "@/content/site";

export type Chunk = {
  id: string;
  title: string;
  text: string;
  source: string;
  href?: string;
};

/** Chunks derived from the same content the website renders, so the bot never drifts from the site. */
function siteChunks(): Chunk[] {
  const out: Chunk[] = projects.map((p) => ({
    id: `project:${p.slug}`,
    title: `Project: ${p.title}`,
    href: `/projects/${p.slug}`,
    source: "content/projects.ts",
    text: [
      `${p.title} is a ${categoryMeta[p.category].label.toLowerCase()} project by Manav (${new Date(p.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}).`,
      p.description,
      p.award ? `Award: ${p.award}.` : "",
      `Highlights: ${p.highlights.join("; ")}.`,
      `Tech: ${p.tech.join(", ")}.`,
      `Code: ${p.repo}.`,
      p.live ? `Live site: ${p.live}.` : "",
      p.archived ? "This is an older/archived project." : "",
    ]
      .filter(Boolean)
      .join(" "),
  }));

  site.awards.forEach((a) => {
    const proj = projects.find((p) => p.slug === a.project);
    out.push({
      id: `site:award:${a.project}`,
      title: `Award: ${a.place} at ${a.event} ${a.year}`,
      href: `/projects/${a.project}`,
      source: "content/site.ts",
      text: `Manav won ${a.place} at the ${a.event} competition (${a.year}) with ${proj?.title ?? a.project}. This is one of his competition wins and achievements.`,
    });
  });
  out.push({
    id: "site:contact",
    title: "Contact and social links",
    href: "/contacts",
    source: "content/site.ts",
    text: `Email: ${site.email}. ${site.socials.map((s) => `${s.name}: ${s.url}`).join(". ")}. Resume: ${site.resume}.`,
  });
  out.push({
    id: "site:pages",
    title: "Pages on this website",
    source: "content/site.ts",
    text: "Home (/), Projects (/projects), project case studies (/projects/<slug>), the interactive 3D PID Lab (/lab), Blogs (/blogs), Contacts (/contacts), Resume (/resume.pdf).",
  });
  return out;
}

export const allChunks: Chunk[] = [...siteChunks(), ...(generated.chunks as Chunk[])];
