import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Latent — Make your effort visible",
  description:
    "Latent turns the work you do into something you can see, share, and build on. Put your phone down, do the work, and watch your effort compound.",
  openGraph: {
    title: "Latent — Make your effort visible",
    description:
      "Put your phone down. Do the work. Latent turns your effort into something you can see, share, and build on.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="grain font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
