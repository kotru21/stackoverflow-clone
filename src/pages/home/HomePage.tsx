import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useQuestions } from "../../entities/question/api";
import type { Question } from "../../entities/question/types";
import { useSnippets } from "../../entities/snippet/api";
import type { Snippet } from "../../entities/snippet/types";
import { ItemCard } from "./ui/ItemCard.tsx";
import HomePageView from "./ui/HomePageView";

export default function HomePage() {
  const [mode, setMode] = useState<"questions" | "snippets">("questions");
  // Queries
  const q = useQuestions({ enabled: mode === "questions" });
  const s = useSnippets({ enabled: mode === "snippets" });

  const isQuestions = mode === "questions";
  const fetchNextPage = isQuestions ? q.fetchNextPage : s.fetchNextPage;
  const hasNextPage = isQuestions ? q.hasNextPage : s.hasNextPage;
  const isFetchingNextPage = isQuestions
    ? q.isFetchingNextPage
    : s.isFetchingNextPage;
  const status = isQuestions ? q.status : s.status;
  const itemsQ = (q.data?.pages.flatMap((p) => p.data) ?? []) as Question[];
  const itemsS = (s.data?.pages.flatMap((p) => p.data) ?? []) as Snippet[];
  const items = (isQuestions ? itemsQ : itemsS) as (Question | Snippet)[];
  const rowVirtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => 220,
    overscan: 6,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const navigate = useNavigate();
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
    const itemQ = isQuestions
      ? (itemsQ[v.index] as Question | undefined)
      : undefined;
    const itemS = !isQuestions
      ? (itemsS[v.index] as Snippet | undefined)
      : undefined;
    const key = ((itemQ?.id ?? itemS?.id) as React.Key) ?? v.index;
    return {
      key,
      start: v.start,
      index: v.index,
      ref: rowVirtualizer.measureElement,
      content: isQuestions ? (
        itemQ ? (
          <ItemCard
            type="question"
            item={itemQ}
            onMoreClick={() => navigate(`/questions/${itemQ.id}`)}
          />
        ) : null
      ) : itemS ? (
        <ItemCard
          type="snippet"
          item={itemS}
          onCommentsClick={() => navigate(`/snippets/${itemS.id}`)}
        />
      ) : null,
    };
  });

  return (
    <HomePageView
      title={isQuestions ? "Вопросы" : "Сниппеты"}
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
