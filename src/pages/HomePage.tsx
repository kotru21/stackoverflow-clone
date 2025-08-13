import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useQuestions } from "../entities/question/api";
import type { Question } from "../entities/question/types";
import { CodeBlock } from "../shared/ui/CodeBlock";
import { ExpandableText } from "../shared/ui/ExpandableText";
import { useNavigate } from "react-router-dom";

type QuestionCardProps = {
  id: string | number;
  title: string;
  description: string;
  attachedCode?: string;
  user: { username: string };
  answersCount?: number;
};

function QuestionCard({
  id,
  title,
  description,
  attachedCode,
  user,
  answersCount,
}: QuestionCardProps) {
  const navigate = useNavigate();
  return (
    <article className="border rounded p-3 space-y-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
      <div className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="text-base font-semibold text-black dark:text-white">
          {title}
        </h2>
        <span className="shrink-0">@{user.username}</span>
      </div>
      <ExpandableText
        text={description}
        mode="navigate"
        onMoreClick={() => navigate(`/questions/${id}`)}
        className="text-sm"
      />
      {attachedCode && <CodeBlock code={attachedCode} className="max-h-64" />}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {typeof answersCount !== "undefined" && (
          <span>Answers: {answersCount}</span>
        )}
      </div>
      <div className="flex items-center">
        <Link
          to={`/questions/${id}`}
          className="ml-auto px-2 py-1 border rounded">
          Answers →
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useQuestions({});

  const items = (data?.pages.flatMap((p) => p.data) ?? []) as Question[];
  const rowVirtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => 220,
    overscan: 6,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || items.length === 0) return;
    const last = virtualItems[virtualItems.length - 1];
    if (last && last.index >= items.length - 1) {
      void fetchNextPage();
    }
  }, [
    virtualItems,
    hasNextPage,
    isFetchingNextPage,
    items.length,
    fetchNextPage,
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Вопросы</h1>
      {status === "pending" && <p>Загрузка...</p>}
      {items.length === 0 && status === "success" && (
        <p className="text-gray-500">Нет вопросов.</p>
      )}
      <div
        className="relative"
        style={{ height: rowVirtualizer.getTotalSize() }}>
        {virtualItems.map((v) => {
          const s = items[v.index];
          return (
            <div
              key={s?.id ?? v.index}
              ref={rowVirtualizer.measureElement}
              data-index={v.index}
              className="absolute left-0 w-full pb-4"
              style={{
                transform: `translateY(${v.start}px)`,
              }}>
              {s && (
                <QuestionCard
                  id={s.id}
                  title={s.title}
                  description={s.description}
                  attachedCode={s.attachedCode}
                  user={s.user}
                  answersCount={
                    Array.isArray(s.answers) ? s.answers.length : undefined
                  }
                />
              )}
            </div>
          );
        })}
      </div>
      {isFetchingNextPage && <p>Загрузка...</p>}
    </div>
  );
}
