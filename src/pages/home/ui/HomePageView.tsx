import { memo } from "react";
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
            <button
              type="button"
              className={`px-3 py-1 text-sm ${
                mode === "questions"
                  ? "bg-gray-200 dark:bg-neutral-700"
                  : "bg-transparent"
              }`}
              onClick={() => onModeChange("questions")}>
              Вопросы
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-sm ${
                mode === "snippets"
                  ? "bg-gray-200 dark:bg-neutral-700"
                  : "bg-transparent"
              }`}
              onClick={() => onModeChange("snippets")}>
              Сниппеты
            </button>
          </div>
        )}
      </div>
      {status === "pending" && <p>Загрузка...</p>}
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
      {isFetchingNextPage && <p>Загрузка...</p>}
    </div>
  );
}

export default memo(HomePageView);
