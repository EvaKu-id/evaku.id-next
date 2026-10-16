import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
