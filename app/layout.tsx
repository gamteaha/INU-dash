import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { DashboardFilterProvider } from "@/context/DashboardFilterContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "INU 종합강의시간표 대시보드",
  description: "인천대학교 2026학년도 1학기 종합강의시간표 대시보드 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full scroll-smooth antialiased" suppressHydrationWarning>
      <body className="font-sans bg-[var(--color-void)] text-[var(--color-bone)] min-h-screen flex selection:bg-[var(--color-indigo-haze)] selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange={false}>
          <DashboardFilterProvider>
          {/* Left Sidebar Layout */}
          <div className="flex w-full min-h-screen relative">
            
            {/* Sidebar Container */}
            <Suspense fallback={<div className="w-[240px] min-w-[240px] bg-[var(--color-char)] border-r border-[var(--color-bone)]/10" />}>
              <Sidebar />
            </Suspense>

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col min-h-screen overflow-auto relative z-10 px-6 md:px-10 pt-10 pb-24">
            <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-[var(--section-gap)]">
                {children}
                <Footer />
              </div>
            </div>

          </div>
          </DashboardFilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
