import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateOrganizationSchema, generateWebsiteSchema, siteConfig } from "@/lib/seo";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ZakladUA - B2B платформа для ресторанного бізнесу",
    template: "%s | ZakladUA",
  },
  description: siteConfig.description,
  keywords: [
    "ресторан",
    "кафе",
    "ресторанний бізнес",
    "POS-система",
    "обладнання для ресторану",
    "постачальники",
    "доставка їжі",
    "автоматизація ресторану",
    "Україна",
    "HoReCa",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: "ZakladUA - B2B платформа для ресторанного бізнесу",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZakladUA - платформа для ресторанного бізнесу",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZakladUA - B2B платформа для ресторанного бізнесу",
    description: siteConfig.description,
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "uk-UA": siteConfig.url,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <JsonLd data={[generateOrganizationSchema(), generateWebsiteSchema()]} />
        {/* Prevent theme flash - apply theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var settings = JSON.parse(localStorage.getItem('zakladua-settings') || '{}');
                  var root = document.documentElement;
                  
                  // Apply color theme
                  if (settings.primaryColor && settings.primaryColor !== 'amber') {
                    root.setAttribute('data-theme-color', settings.primaryColor);
                  }
                  
                  // Apply dark/light mode
                  if (settings.darkTheme === false) {
                    root.classList.remove('dark');
                    root.classList.add('light');
                    document.addEventListener('DOMContentLoaded', function() {
                      document.body.style.background = 'linear-gradient(180deg, #f4f4f5 0%, #e4e4e7 100%)';
                      document.body.style.color = '#18181b';
                    });
                  }
                  
                  // Apply animations preference
                  if (settings.enableAnimations === false) {
                    root.classList.add('no-animations');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-zinc-950 text-zinc-100`}
      >
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
