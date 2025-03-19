import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function TableSkeleton() {
  return (
    <div className="p-4 max-w-full mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Skeleton className="h-10 w-full sm:w-[280px]" />
          <Skeleton className="h-10 w-full sm:w-[150px]" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
