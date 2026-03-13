import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-56 w-full rounded-2xl" />
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
}
