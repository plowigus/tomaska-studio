import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google"; // Using Inter as clean sans-serif
import { Navigation } from "@/app/src/components/sections/Navigation";
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
};

export const metadata: Metadata = {
  title: {
    template: "%s | Joanna Tomaska",
    default: "Joanna Tomaska - Interior Design Studio",
  },
  description:
    "Premium interior design studio by Joanna Tomaska. Creating spaces that reflect personality and individual needs with a focus on aesthetics and functionality.",
  keywords: ["Interior Design", "Joanna Tomaska", "Architecture", "Luxury Interiors", "Design Studio"],
  authors: [{ name: "Joanna Tomaska" }],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://tomaska-studio.com",
    siteName: "TOMASKA STUDIO",
    title: "Joanna Tomaska - Interior Design Studio",
    description:
      "Creating spaces that reflect personality and individual needs. Explore the portfolio of Joanna Tomaska.",
    images: [
      {
        url: "/og-image.jpg", // Assumed default OG image
        width: 1200,
        height: 630,
        alt: "TOMASKA STUDIO Interior Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joanna Tomaska - Interior Design Studio",
    description: "Premium interior design studio creating personalized spaces.",
    creator: "@tomaskastudio", // Example handle
  },
  robots: {
    index: true,
    follow: true,
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
        <Navigation />
        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
