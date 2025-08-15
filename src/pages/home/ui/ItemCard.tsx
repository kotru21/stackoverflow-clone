import { memo } from "react";
import type { Question } from "../../../entities/question/types";
import type { Snippet } from "../../../entities/snippet/types";
import { useAuth } from "../../../app/providers/useAuth";
import { useMarkSnippet } from "../../../entities/snippet/api";
import { QuestionCardView } from "./QuestionCardView";
import { SnippetCardView } from "./SnippetCardView";

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
  return (
    <QuestionCardView
      title={item.title}
      userName={item.user.username}
      description={item.description}
      attachedCode={item.attachedCode}
      answersCount={
        Array.isArray(item.answers) ? item.answers.length : undefined
      }
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
  return (
    <SnippetCardView
      language={item.language}
      userName={item.user.username}
      code={item.code}
      likesCount={item.likesCount}
      dislikesCount={item.dislikesCount}
      commentsCount={item.commentsCount}
      onCommentsClick={onCommentsClick}
      onLike={() => mark("like")}
      onDislike={() => mark("dislike")}
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
