import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Navigation } from "@/app/src/components/sections/Navigation";
import { LenisProvider } from "@/app/src/components/providers/LenisProvider";
import { GoogleAnalytics } from "@/app/src/components/providers/GoogleAnalytics";
import { CookieConsent } from "@/app/src/components/ui/CookieConsent";
import "./globals.css";


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fcfbf9",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tomaska-studio.com"),
  title: {
    template: "%s | Joanna Tomaska | Architekt Wnętrz",
    default: "Joanna Tomaska | Architekt Wnętrz | Projektowanie Wnętrz",
  },
  description:
    "Ekskluzywne projektowanie wnętrz przez Joannę Tomaską. Tworzymy przestrzenie odzwierciedlające Twoją osobowość. Profesjonalna architektura wnętrz, funkcjonalność i ponadczasowa estetyka.",
  keywords: ["Projektant Wnętrz", "Architekt Wnętrz", "Projektowanie Wnętrz", "Joanna Tomaska", "Ekskluzywne Wnętrza", "Aranżacja Wnętrz"],
  authors: [{ name: "Joanna Tomaska" }],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "TOMASKA STUDIO",
    title: "Joanna Tomaska | Architekt Wnętrz | Projektowanie Wnętrz",
    description:
      "Ekskluzywne projektowanie wnętrz. Tworzymy przestrzenie odzwierciedlające Twoją osobowość. Poznaj portfolio Joanny Tomaskiej.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TOMASKA STUDIO Projektowanie Wnętrz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joanna Tomaska | Architekt Wnętrz | Projektowanie Wnętrz",
    description: "Premium projektowanie wnętrz i architektura tworząca spersonalizowane przestrzenie.",
    creator: "@tomaskastudio",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-alabaster text-foreground antialiased selection:bg-gray-200 selection:text-black">
        <LenisProvider>
          <Navigation />
          <main className="flex min-h-screen flex-col">{children}</main>
        </LenisProvider>
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
