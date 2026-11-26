import { rateLimit, clientIp, badBody } from "@/lib/rate-limit";
import { site } from "@/content/site";

export const runtime = "nodejs";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const rl = rateLimit(`mail:${clientIp(req)}`, 4, 60 * 60_000);
  if (!rl.ok) return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 });

  const bad = badBody(req, 16_000);
  if (bad) return Response.json({ error: bad }, { status: bad === "Expected JSON" ? 415 : 413 });

  let data: { feedback?: string; email?: string; name?: string; website?: string };
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "website" field.
  if (data.website) return Response.json({ ok: true });

  const str = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  const feedback = str(data.feedback, 5000);
  const email = str(data.email, 200);
  const name = str(data.name, 100).replace(/[\r\n]+/g, " ");
  if (feedback.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please include a message and a valid email." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json({ error: "not-configured", mailto: site.email }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || site.email],
      reply_to: email,
      subject: `Portfolio message from ${name || email}`,
      html: `<p><strong>From:</strong> ${escape(name || "-")} &lt;${escape(email)}&gt;</p><p style="white-space:pre-wrap">${escape(feedback)}</p>`,
      text: `From: ${name || "-"} <${email}>\n\n${feedback}`,
    }),
  });

  if (!res.ok) {
    console.error("[mail] resend failed", res.status, await res.text().catch(() => ""));
    return Response.json({ error: "send-failed", mailto: site.email }, { status: 502 });
  }
  return Response.json({ ok: true });
}
