import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers"; // Restore Providers
import ModernBackground from "@/components/effects/ModernBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSR Particle Formation Visualization", // Restore original title
  description: "An interactive website visualizing Gunshot Residue (GSR) particle formation, discharge, and dispersion.", // Restore original description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModernBackground />
        <Providers>
          {children} {/* Restore children */}
        </Providers>
      </body>
    </html>
  );
}
