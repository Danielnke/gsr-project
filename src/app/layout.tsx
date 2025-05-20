import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import ModernBackground from "@/components/effects/ModernBackground";
import Script from "next/script";
import { TempoInit } from "./tempo-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSR Particle Formation Visualization",
  description:
    "An interactive website visualizing Gunshot Residue (GSR) particle formation, discharge, and dispersion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js"
          strategy="afterInteractive"
        />
        <ModernBackground />
        <Providers>
          {children}
          <TempoInit />
        </Providers>
      </body>
    </html>
  );
}
