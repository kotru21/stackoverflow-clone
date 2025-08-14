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
};

export default function HomePageView({
  title = "Вопросы",
  status,
  hasItems,
  containerHeight,
  rows,
  isFetchingNextPage,
}: HomePageViewProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {status === "pending" && <p>Загрузка...</p>}
      {!hasItems && status === "success" && (
        <p className="text-gray-500">Нет вопросов.</p>
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
