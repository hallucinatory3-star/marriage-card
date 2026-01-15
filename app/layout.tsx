import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const weddingDate = new Date("2026-02-03T12:00:00");

// UPDATE THIS to your actual Vercel URL
const siteUrl = "https://marriage-card-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Wedding Invitation | Celebration of Love",
  description: `You're cordially invited to celebrate a special wedding ceremony. Join us for this joyous occasion filled with love, blessings, and celebration.`,
  keywords: [
    "wedding",
    "invitation",
    "celebration",
    "love",
    "marriage",
    "ceremony",
    "festivities",
  ],
  openGraph: {
    title: "You're Invited to a Wedding Celebration!",
    description: `Join us in the celebration filled with love and blessings. Tap to open your invitation.`,
    type: "website",
    siteName: "Wedding Invitation",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "You're Invited to a Wedding Celebration!",
    description: `Join us in the celebration filled with love and blessings. Tap to open your invitation.`,
    images: [`${siteUrl}/twitter-image`],
  },
  other: {
    "theme-color": "#d4af37",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
