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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"),
  title: "Wedding Invitation | You're Invited",
  description: "You're cordially invited to celebrate a beautiful union of love. Join us for our special day!",
  keywords: ["wedding", "invitation", "celebration", "love", "marriage"],
  openGraph: {
    title: "You're Invited to Our Wedding!",
    description: "Join us in celebrating a beautiful union of love. Tap to open your invitation.",
    type: "website",
    siteName: "Wedding Invitation",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "You're Invited to Our Wedding!",
    description: "Join us in celebrating a beautiful union of love. Tap to open your invitation.",
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
