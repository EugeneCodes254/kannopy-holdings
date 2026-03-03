import type { Metadata } from "next";
import { Space_Mono, Syne } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata = {
  title: "PriceWatch — Tracking Service",
  description: "Smart price tracking with rebate intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

    <body lang="en" className={`${spaceMono.variable} ${syne.variable} antialiased`}>
    <Providers>{children}</Providers>
      </body>
    </html>
  );
}
