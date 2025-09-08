import { BackLink } from "@/shared/ui/BackLink";
import { Skeleton } from "@/shared/ui/Skeleton";

interface LoadingSkeletonProps {
  mode: string;
}

export function LoadingSkeleton({ mode }: LoadingSkeletonProps) {
  const config =
    mode === "question"
      ? [{ w: 240, h: 28 }, { h: 80 }, { h: 180 }]
      : [{ w: 180, h: 28 }, { h: 80 }, { h: 220 }];
  return (
    <div className="space-y-4">
      <BackLink />
      <div className="space-y-3">
        {config.map((b, i) => (
          <Skeleton
            key={i}
            width={b.w}
            height={b.h}
            className={b.h && b.h > 30 ? "rounded" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
