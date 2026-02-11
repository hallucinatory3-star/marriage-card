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

const mundanDate = new Date("2026-02-18T12:00:00");

// UPDATE THIS to your actual Vercel URL
const siteUrl = "https://mundan-card-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mundan Ceremony Invitation | Celebration",
  description: `You're cordially invited to celebrate the Mundan ceremony of Mayank. Join us for this auspicious occasion filled with blessings and celebration.`,
  keywords: [
    "mundan",
    "ceremony",
    "invitation",
    "celebration",
    "auspicious",
    "festivities",
    "mayank",
  ],
  openGraph: {
    title: "Tap to open your invitation.",
    description: `Join us in the auspicious celebration of the Mundan ceremony.`,
    type: "website",
    siteName: "Mundan Ceremony Invitation",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Mundan Ceremony Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tap to open your invitation.",
    description: `Join us in the auspicious celebration of the Mundan ceremony.`,
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
