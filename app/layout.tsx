import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PWAPrompt } from "@/components/pwa-prompt";
import "./globals.css";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeeBites - Food Delivery",
  description:
    "Order delicious food late at night. Pizza, burgers, chicken, and more delivered to your door.",
  // generator: "v0.app",
  // manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Late Night Cravings",
  },
  icons: {
    icon: [
      {
        url: "/images/logo/Bee_logo_black_transparent.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/logo/Bee_logo_black_transparent.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/images/logo/Bee_logo_black_transparent.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/images/logo/Bee_logo_black_transparent.png",
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
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <Header />
        {children}
        {/* <PWAPrompt /> */}
        <Analytics />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
