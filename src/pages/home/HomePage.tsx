import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useQuestions } from "../../entities/question/api";
import type { Question } from "../../entities/question/types";
import { QuestionCard } from "./ui/QuestionCard";
import HomePageView from "./ui/HomePageView";

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
    const s = items[v.index];
    return {
      key: (s?.id as React.Key) ?? v.index,
      start: v.start,
      index: v.index,
      ref: rowVirtualizer.measureElement,
      content: s ? (
        <QuestionCard
          id={s.id}
          title={s.title}
          description={s.description}
          attachedCode={s.attachedCode}
          user={s.user}
          answersCount={Array.isArray(s.answers) ? s.answers.length : undefined}
          onMoreClick={() => navigate(`/questions/${s.id}`)}
        />
      ) : null,
    };
  });

  return (
    <HomePageView
      status={status}
      hasItems={items.length > 0}
      containerHeight={rowVirtualizer.getTotalSize()}
      rows={rows}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
