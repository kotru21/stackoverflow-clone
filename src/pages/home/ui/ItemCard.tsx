import { memo } from "react";
import type { Question } from "../../../entities/question/types";
import type { Snippet } from "../../../entities/snippet/types";
import { CodeBlock } from "../../../shared/ui/CodeBlock";
import { Clamp } from "../../../shared/ui/Clamp";
import { ExpandableText } from "../../../shared/ui/ExpandableText";
import { useAuth } from "../../../app/providers/useAuth";
import { useMarkSnippet } from "../../../entities/snippet/api";

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
    <article className="border rounded p-3 space-y-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
      <div className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="text-base font-semibold text-black dark:text-white">
          {item.title}
        </h2>
        <span className="shrink-0">@{item.user.username}</span>
      </div>
      <ExpandableText
        text={item.description}
        mode={onMoreClick ? "navigate" : "toggle"}
        onMoreClick={onMoreClick}
        className="text-sm"
      />
      {item.attachedCode && (
        <CodeBlock code={item.attachedCode} className="max-h-64" />
      )}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {Array.isArray(item.answers) && (
          <span>Answers: {item.answers.length}</span>
        )}
      </div>
      {onMoreClick && (
        <div className="flex items-center">
          <button
            type="button"
            onClick={onMoreClick}
            className="ml-auto px-2 py-1 border rounded">
            Answers →
          </button>
        </div>
      )}
    </article>
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
    <article className="border rounded p-3 space-y-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
      <div className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
            {item.language}
          </span>
        </div>
        <span className="shrink-0">@{item.user.username}</span>
      </div>
      <Clamp
        maxHeight={220}
        onMoreClick={onCommentsClick}
        moreLabel="Показать весь код">
        <CodeBlock code={item.code} />
      </Clamp>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {typeof item.likesCount !== "undefined" && (
          <span>Likes: {item.likesCount}</span>
        )}
        {typeof item.dislikesCount !== "undefined" && (
          <span>Dislikes: {item.dislikesCount}</span>
        )}
        {typeof item.commentsCount !== "undefined" && (
          <button
            type="button"
            className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={onCommentsClick}>
            Comments: {item.commentsCount}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          disabled={!canInteract || isPending}
          onClick={() => mark("like")}
          className="px-2 py-1 border rounded disabled:opacity-50">
          Like
        </button>
        <button
          type="button"
          disabled={!canInteract || isPending}
          onClick={() => mark("dislike")}
          className="px-2 py-1 border rounded disabled:opacity-50">
          Dislike
        </button>
        {onCommentsClick && (
          <button
            type="button"
            onClick={onCommentsClick}
            className="ml-2 px-2 py-1 border rounded">
            Comments →
          </button>
        )}
      </div>
      {!canInteract && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Войдите, чтобы ставить лайки/дизлайки и комментировать.
        </p>
      )}
    </article>
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
