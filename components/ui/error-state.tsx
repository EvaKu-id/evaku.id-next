"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div role="alert" className={cn("rounded-[12px] border border-status-cut/30 bg-status-cut/5 px-4 py-4", className)}>
      <p className="text-sm font-semibold text-ink">Data belum bisa dimuat</p>
      <p className="mt-1 text-sm text-ink-2">{message ?? "Coba lagi sebentar lagi."}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          <RotateCw /> Coba lagi
        </Button>
      ) : null}
    </div>
  );
}
