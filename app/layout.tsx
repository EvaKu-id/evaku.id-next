import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { MswProvider } from "@/components/msw-provider";

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
      <body className="p-4 flex min-h-full flex-col">
        <MswProvider>
          <ThemeProvider
          attribute="class"  
          defaultTheme="system"
          enableSystem
        >
        {children}
        </ThemeProvider>
        </MswProvider>
      </body>
    </html>
  );
}
