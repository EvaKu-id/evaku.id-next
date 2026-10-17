import { cn } from "@/lib/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  blocks: readonly string[];
  className?: string;
}

// Suspense fallback for client pages: one skeleton block per class list, top to bottom.
export function PageSkeleton({ blocks, className }: PageSkeletonProps) {
  return (
    <div className={cn("mx-auto w-full space-y-4 px-4 py-10 sm:px-6", className)}>
      {blocks.map((block, index) => (
        <Skeleton key={index} className={block} />
      ))}
    </div>
  );
}
