import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  async redirects() {
    // keep links to the old blog URLs working
    return [
      { source: "/blogs/blog1", destination: "/blogs/nextjs-cpanel-deployment", permanent: true },
      { source: "/blogs/blog2", destination: "/blogs/local-rag-chatbot", permanent: true },
      { source: "/blogs/blog3", destination: "/blogs/whisper-speech-to-text", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
