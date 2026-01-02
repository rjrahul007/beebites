import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PWAPrompt } from "@/components/pwa-prompt";
import "./globals.css";
import { cookies } from "next/headers";
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeeBites - Food Delivery",
  description:
    "Order delicious food late at night. Pizza, burgers, chicken, and more delivered to your door.",
  generator: "v0.app",
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Late Night Cravings",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD700",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  cookies(); // to make sure cookies are available in the client components
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <PWAPrompt />
        <Analytics />
      </body>
    </html>
  );
}
