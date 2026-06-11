import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans_KR } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { DashboardFilterProvider } from "@/context/DashboardFilterContext";
import "./globals.css";

const notoFont = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans",
});

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
    <html lang="ko" className="h-full scroll-smooth antialiased">
      <body className={`${notoFont.variable} font-sans bg-[#EBF1FA] text-blue-900 min-h-screen flex`}>
        <DashboardFilterProvider>
          <div className="flex w-full min-h-screen">
            <Suspense fallback={<div className="w-[220px] min-w-[220px] bg-white border-r border-[#E5E7EB]" />}>
              <Sidebar />
            </Suspense>
            <div className="flex-1 flex flex-col min-h-screen overflow-auto pt-14 md:pt-0">
              {children}
              <Footer />
            </div>
          </div>
        </DashboardFilterProvider>
      </body>
    </html>
  );
}
