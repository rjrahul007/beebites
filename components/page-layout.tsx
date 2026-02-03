import { ReactNode } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

interface PageLayoutProps {
  children: ReactNode;
  containerClassName?: string;
  showBottomNav?: boolean;
  showHeader?: boolean;
}

export default function PageLayout({
  children,
  containerClassName = "container mx-auto px-4 py-8",
  showBottomNav = true,
  showHeader = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {showHeader && <Header />}
      <main className={containerClassName}>{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
