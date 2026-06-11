import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap"
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Pinmark | Aotearoa Explorer",
  description:
    "Discover Aotearoa New Zealand through photos and maps. A geography game for Year 8-9 students.",
  openGraph: {
    title: "Pinmark | Aotearoa Explorer",
    description: "Discover Aotearoa New Zealand through photos and maps.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
