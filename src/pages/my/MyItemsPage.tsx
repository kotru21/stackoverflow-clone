import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useAuth } from "@/app/providers/useAuth";
import { useQuestions } from "@/entities/question/api";
import { useSnippets } from "@/entities/snippet/api";
import type { Question } from "@/entities/question/types";
import type { Snippet } from "@/entities/snippet/types";
import { ItemCard } from "@/pages/home/ItemCard";
import HomePageView from "@/pages/home/ui/HomePageView";

// Объединённая страница: Мои вопросы / Мои сниппеты
export default function MyItemsPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = (
    searchParams.get("mode") === "snippets" ? "snippets" : "questions"
  ) as "questions" | "snippets";
  const [mode, setMode] = useState<"questions" | "snippets">(initialMode);

  // Queries
  const qQuestions = useQuestions({
    enabled: mode === "questions" && !!userId,
  });
  const qSnippets = useSnippets({
    userId: userId as number | undefined,
    enabled: mode === "snippets" && !!userId,
  });

  const myQuestions = useMemo(() => {
    const all = qQuestions.data?.pages.flatMap((p) => p.data) ?? [];
    return all.filter((qu) => String(qu.user.id) === String(userId));
  }, [qQuestions.data?.pages, userId]) as Question[];
  const mySnippets = (qSnippets.data?.pages.flatMap((p) => p.data) ??
    []) as Snippet[];

  const isQuestions = mode === "questions";
  const items = (isQuestions ? myQuestions : mySnippets) as (
    | Question
    | Snippet
  )[];

  const fetchNextPage = isQuestions
    ? qQuestions.fetchNextPage
    : qSnippets.fetchNextPage;
  const hasNextPage = isQuestions
    ? qQuestions.hasNextPage
    : qSnippets.hasNextPage;
  const isFetchingNextPage = isQuestions
    ? qQuestions.isFetchingNextPage
    : qSnippets.isFetchingNextPage;
  const status = isQuestions ? qQuestions.status : qSnippets.status;

  const rowVirtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => 220,
    overscan: 6,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  // sync URL with mode
  useEffect(() => {
    const current = searchParams.get("mode");
    if (current !== mode) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("mode", mode);
          return next;
        },
        { replace: true }
      );
    }
  }, [mode, searchParams, setSearchParams]);

  // infinite scroll
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

  const rows = virtualItems.map((v) => {
    const item = items[v.index];
    const key = (item && (item as Question | Snippet).id) ?? v.index;
    const content = isQuestions ? (
      (item as Question) ? (
        <ItemCard
          type="question"
          item={item as Question}
          onMoreClick={() =>
            navigate(`/questions/${(item as Question).id}`, {
              state: { fromMode: "my-questions" },
            })
          }
        />
      ) : null
    ) : (item as Snippet) ? (
      <ItemCard
        type="snippet"
        item={item as Snippet}
        onCommentsClick={() =>
          navigate(`/snippets/${(item as Snippet).id}`, {
            state: { fromMode: "my-snippets" },
          })
        }
      />
    ) : null;
    return {
      key,
      start: v.start,
      index: v.index,
      ref: rowVirtualizer.measureElement,
      content,
    };
  });

  return (
    <HomePageView
      title={isQuestions ? "Мои вопросы" : "Мои сниппеты"}
      mode={mode}
      onModeChange={setMode}
      status={status}
      hasItems={items.length > 0}
      containerHeight={rowVirtualizer.getTotalSize()}
      rows={rows}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
