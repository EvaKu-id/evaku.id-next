import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { MswProvider } from "@/components/msw-provider";
import Navbar from "./navbar/page";
import Footer from "./footer/page"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evaku.id | Simulasi Banjir",
  description: "Latihan skenario ketinggian air untuk kesiapsiagaan evakuasi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap"
        />
      </head>
      <body className="">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="pb-12">
          <Navbar />
          </div>
          <MswProvider>{children}</MswProvider>
        </ThemeProvider>
          <Footer/>
      </body>
    </html>
  );
}
