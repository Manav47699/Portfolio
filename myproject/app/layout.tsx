import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Chatbot from "@/components/Chatbot";
import { site } from "@/content/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  keywords: ["Manav Acharya", "computer engineer", "Nepal", "Dharan", "robotics", "AI", "Next.js", "Django", "FastAPI", "portfolio"],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name}: ${site.role}`,
    description: site.tagline,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.tagline },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Dharan", addressCountry: "NP" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Purwanchal Campus, Dharan" },
  sameAs: site.socials.map((s) => s.url),
  award: site.awards.map((a) => `${a.place}, ${a.event} ${a.year}`),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-ink antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-amber-300 px-4 py-2 font-medium text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main">{children}</div>
        <SiteFooter />
        <Chatbot />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  );
}
