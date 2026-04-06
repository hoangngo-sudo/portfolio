import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
import "./globals.css";

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: config.meta.name,
  description: config.meta.description,
  openGraph: {
    title: config.meta.name,
    description: config.meta.description,
    images: config.meta.ogImage ? [config.meta.ogImage] : [],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.meta.name,
    description: config.meta.description,
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
      <body className="min-h-full flex flex-col font-body" suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t==='teal'){var s=document.documentElement.style;s.setProperty('--accent','#0d9488');s.setProperty('--accent-light','#14b8a6');s.setProperty('--accent-pale','#f0fdfa');s.setProperty('--dark-bg','#0f1a1a');s.setProperty('--dark-bg-alt','#162222');s.setProperty('--light-bg','#f8fdfb');s.setProperty('--light-bg-alt','#f0f7f6')}}catch(e){}})()`,
          }}
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: config.meta.name,
              description: config.meta.description,
              url: "https://example.com",
            }),
          }}
        />
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
