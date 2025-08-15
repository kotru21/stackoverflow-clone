import { memo } from "react";
import { Clamp } from "../../../shared/ui/Clamp";
import { CodeBlock } from "../../../shared/ui/CodeBlock";

export type SnippetCardViewProps = {
  language: string;
  userName: string;
  code: string;
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
  onCommentsClick?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  canInteract?: boolean;
  isPending?: boolean;
};

export const SnippetCardView = memo(function SnippetCardView({
  language,
  userName,
  code,
  likesCount,
  dislikesCount,
  commentsCount,
  onCommentsClick,
  onLike,
  onDislike,
  canInteract = false,
  isPending = false,
}: SnippetCardViewProps) {
  return (
    <article className="border rounded p-3 space-y-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
      <div className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
            {language}
          </span>
        </div>
        <span className="shrink-0">@{userName}</span>
      </div>
      <Clamp
        maxHeight={220}
        onMoreClick={onCommentsClick}
        moreLabel="Показать весь код">
        <CodeBlock code={code} />
      </Clamp>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {typeof likesCount !== "undefined" && <span>Likes: {likesCount}</span>}
        {typeof dislikesCount !== "undefined" && (
          <span>Dislikes: {dislikesCount}</span>
        )}
        {typeof commentsCount !== "undefined" && (
          <button
            type="button"
            className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={onCommentsClick}>
            Comments: {commentsCount}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          disabled={!canInteract || isPending}
          onClick={onLike}
          className="px-2 py-1 border rounded disabled:opacity-50">
          Like
        </button>
        <button
          type="button"
          disabled={!canInteract || isPending}
          onClick={onDislike}
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
});

export default SnippetCardView;
