import { memo } from "react";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import type { ReactNode, RefCallback } from "react";

export type HomeRow = {
  key: React.Key;
  start: number;
  index: number;
  ref?: RefCallback<HTMLDivElement>;
  content: ReactNode;
};

export type HomePageViewProps = {
  title?: string;
  status: "idle" | "pending" | "success" | "error" | string;
  hasItems: boolean;
  containerHeight: number;
  rows: HomeRow[];
  isFetchingNextPage?: boolean;
  mode?: "questions" | "snippets";
  onModeChange?: (m: "questions" | "snippets") => void;
};

function HomePageView({
  title = "Вопросы",
  status,
  hasItems,
  containerHeight,
  rows,
  isFetchingNextPage,
  mode,
  onModeChange,
}: HomePageViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {mode && onModeChange && (
          <div className="inline-flex rounded border overflow-hidden">
            <Button
              type="button"
              size="sm"
              variant={mode === "questions" ? "outline" : "ghost"}
              onClick={() => onModeChange("questions")}
              className="rounded-none">
              Вопросы
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "snippets" ? "outline" : "ghost"}
              onClick={() => onModeChange("snippets")}
              className="rounded-none border-l">
              Сниппеты
            </Button>
          </div>
        )}
      </div>
      {status === "pending" && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="">
              <Skeleton height={160} className="rounded mb-2" />
            </div>
          ))}
        </div>
      )}
      {!hasItems && status === "success" && (
        <p className="text-gray-500">Ничего не найдено.</p>
      )}
      <div className="relative" style={{ height: containerHeight }}>
        {rows.map((row) => (
          <div
            key={row.key}
            ref={row.ref}
            data-index={row.index}
            className="absolute left-0 w-full pb-4"
            style={{ transform: `translateY(${row.start}px)` }}>
            {row.content}
          </div>
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="space-y-2">
          <Skeleton height={16} width={160} />
        </div>
      )}
    </div>
  );
}

export default memo(HomePageView);
