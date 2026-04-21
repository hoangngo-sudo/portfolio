import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";
import config from "@/config/portfolio.config";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";
import "./globals.css";

function colorsToProps(c: typeof config.themes.black): Record<string, string> {
  return {
    accent: c.accent,
    "accent-light": c.accentLight,
    "accent-pale": c.accentPale,
    "dark-bg": c.darkBg,
    "dark-bg-alt": c.darkBgAlt,
    "light-bg": c.lightBg,
    "light-bg-alt": c.lightBgAlt,
  };
}

const themeInitScript = `(function(){try{var themes=${JSON.stringify({ black: colorsToProps(config.themes.black), teal: colorsToProps(config.themes.teal) })};var t=localStorage.getItem('portfolio-theme')||'${config.themes.default}';var c=themes[t]||themes['${config.themes.default}'];var s=document.documentElement.style;for(var k in c){s.setProperty('--'+k,c[k])}}catch(e){}})()`;

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(config.meta.siteUrl),
  title: config.meta.name,
  description: config.meta.description,
  openGraph: {
    title: config.meta.name,
    description: config.meta.description,
    images: config.meta.ogImage
      ? [
          {
            url: config.meta.ogImage,
            width: 1200,
            height: 630,
            alt: config.meta.name,
          },
        ]
      : [],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.meta.name,
    description: config.meta.description,
    images: config.meta.ogImage ? [config.meta.ogImage] : [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} ${GeistPixelGrid.variable} ${GeistPixelCircle.variable} ${GeistPixelTriangle.variable} ${GeistPixelLine.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: config.meta.name,
              description: config.meta.description,
              url: config.meta.siteUrl,
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body" suppressHydrationWarning>
        {/* Theme init injected into SSR stream — avoids React 19 script-in-component warning */}
        <ThemeScript script={themeInitScript} />
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="fixed top-0 left-0 z-200 -translate-y-full bg-accent px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
