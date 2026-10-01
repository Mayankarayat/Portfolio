import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { profile } from "@/content/profile";
import { instrumentSerif, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${profile.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: profile.name, url: siteConfig.url }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: siteConfig.title,
    description: profile.headline,
    locale: siteConfig.locale,
    firstName: profile.firstName,
    lastName: "Karayat",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: profile.headline,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
