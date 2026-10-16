import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { MswProvider } from "@/components/msw-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { PALETTE } from "@/lib/palette";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "EvaKu · Peta akses banjir Indonesia", template: "%s · EvaKu" },
  description:
    "EvaKu memperkirakan desa yang akan terputus banjir 1–3 hari sebelumnya, jalan yang masih bisa dilewati, dan titik evakuasi terdekat.",
  icons: {
    icon: [
      { url: "/brand/evaku-mark.svg", type: "image/svg+xml" },
      { url: "/brand/evaku-mark-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/brand/evaku-mark-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: PALETTE.bg,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <NuqsAdapter>
          <QueryProvider>
            <SmoothScroll>
              <MswProvider>{children}</MswProvider>
            </SmoothScroll>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
