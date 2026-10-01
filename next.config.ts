import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Story clips aren't content-hashed: cache for a week, revalidate in the background.
        source: "/story/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
    ];
  },
  async redirects() {
    // Paths the previous react-router build exposed; the site is now a single page.
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/projects", destination: "/#projects", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/Mayank_Karayat_Resume.docx", destination: "/Mayank-Karayat-Resume.docx", permanent: true },
    ];
  },
};

export default nextConfig;
