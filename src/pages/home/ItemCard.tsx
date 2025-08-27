import { memo, useCallback } from "react";
import type { Question } from "@/entities/question/types";
import type { Snippet } from "@/entities/snippet/types";
import { useAuth } from "@/app/providers/useAuth";
import { useMarkSnippet } from "@/entities/snippet/api";
import { ItemCommonCardView } from "./ui/ItemCommonCardView";

type BaseProps = {
  onMoreClick?: () => void;
  onCommentsClick?: () => void;
};

type QuestionProps = BaseProps & {
  type: "question";
  item: Question;
};

type SnippetProps = BaseProps & {
  type: "snippet";
  item: Snippet;
};

export type ItemCardProps = QuestionProps | SnippetProps;

function QuestionView({
  item,
  onMoreClick,
}: {
  item: Question;
  onMoreClick?: () => void;
}) {
  const resolved = Boolean(
    item.isResolved ||
      (Array.isArray(item.answers) && item.answers.some((a) => a.isCorrect))
  );
  return (
    <ItemCommonCardView
      mode="question"
      title={item.title}
      userName={item.user.username}
      description={item.description}
      code={item.attachedCode}
      answersCount={
        Array.isArray(item.answers) ? item.answers.length : undefined
      }
      resolved={resolved}
      onMoreClick={onMoreClick}
    />
  );
}

function SnippetView({
  item,
  onCommentsClick,
}: {
  item: Snippet;
  onCommentsClick?: () => void;
}) {
  const { user: authUser } = useAuth();
  const { mutate: mark, isPending } = useMarkSnippet(item.id);
  const canInteract = !!authUser;
  const like = useCallback(() => mark("like"), [mark]);
  const dislike = useCallback(() => mark("dislike"), [mark]);
  return (
    <ItemCommonCardView
      mode="snippet"
      language={item.language}
      userName={item.user.username}
      code={item.code}
      likesCount={item.likesCount}
      dislikesCount={item.dislikesCount}
      commentsCount={item.commentsCount}
      onCommentsClick={onCommentsClick}
      onMoreClick={onCommentsClick}
      onLike={like}
      onDislike={dislike}
      canInteract={canInteract}
      isPending={isPending}
    />
  );
}

export const ItemCard = memo(function ItemCard(props: ItemCardProps) {
  if (props.type === "question") {
    return <QuestionView item={props.item} onMoreClick={props.onMoreClick} />;
  }
  return (
    <SnippetView item={props.item} onCommentsClick={props.onCommentsClick} />
  );
});

export default ItemCard;
