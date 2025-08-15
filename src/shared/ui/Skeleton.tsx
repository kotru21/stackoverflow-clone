import { memo } from "react";

export type SkeletonProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  rounded?: boolean | string;
};

export const Skeleton = memo(function Skeleton({
  className = "",
  width = "100%",
  height = 16,
  rounded = true,
}: SkeletonProps) {
  const style: React.CSSProperties = { width, height };
  const roundedClass =
    typeof rounded === "string" ? rounded : rounded ? "rounded" : "";
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-neutral-700 ${roundedClass} ${className}`}
      style={style}
    />
  );
});

export default Skeleton;
