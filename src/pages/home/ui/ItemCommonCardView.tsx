import { memo } from "react";
import Avatar from "../../../shared/ui/Avatar";
import { ExpandableText } from "../../../shared/ui/ExpandableText";
import { Clamp } from "../../../shared/ui/Clamp";
import { CodeBlock } from "../../../shared/ui/CodeBlock";

export type ItemCommonCardViewProps = {
  mode: "question" | "snippet";
  userName: string;
  // question
  title?: string;
  description?: string;
  answersCount?: number;
  // snippet
  language?: string;
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
  // shared
  code?: string;
  onMoreClick?: () => void; // переход на детали/комменты и раскрытие кода
  onCommentsClick?: () => void; // для сниппета – переход к комментариям
  onLike?: () => void;
  onDislike?: () => void;
  canInteract?: boolean;
  isPending?: boolean;
};

export const ItemCommonCardView = memo(function ItemCommonCardView({
  mode,
  userName,
  title,
  description,
  answersCount,
  language,
  likesCount,
  dislikesCount,
  commentsCount,
  code,
  onMoreClick,
  onCommentsClick,
  onLike,
  onDislike,
  canInteract = false,
  isPending = false,
}: ItemCommonCardViewProps) {
  return (
    <article className="border rounded p-3 space-y-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
      <div className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="min-w-0">
          {mode === "question" ? (
            <h2 className="text-base font-semibold text-black dark:text-white truncate">
              {title}
            </h2>
          ) : (
            <span className="inline-flex items-center rounded bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
              {language}
            </span>
          )}
        </div>
        <span className="shrink-0 inline-flex items-center gap-2">
          <Avatar username={userName} size={20} /> @{userName}
        </span>
      </div>

      {description && (
        <ExpandableText
          text={description}
          mode={onMoreClick ? "navigate" : "toggle"}
          onMoreClick={onMoreClick}
          className="text-sm"
        />
      )}

      {code && (
        <Clamp
          maxHeight={220}
          onMoreClick={onMoreClick}
          moreLabel="Показать весь код">
          <CodeBlock code={code} language={language} />
        </Clamp>
      )}

      {mode === "question" ? (
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {typeof answersCount === "number" && (
            <span>Answers: {answersCount}</span>
          )}
          {onMoreClick && (
            <button
              type="button"
              onClick={onMoreClick}
              className="ml-auto px-2 py-1 border rounded">
              Answers →
            </button>
          )}
        </div>
      ) : (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canInteract || isPending}
                onClick={onLike}
                className="px-2 py-1 border rounded disabled:opacity-50"
                aria-label="Like">
                Like
              </button>
              <button
                type="button"
                disabled={!canInteract || isPending}
                onClick={onDislike}
                className="px-2 py-1 border rounded disabled:opacity-50"
                aria-label="Dislike">
                Dislike
              </button>
            </div>
            {typeof likesCount !== "undefined" && (
              <span>Likes: {likesCount}</span>
            )}
            {typeof dislikesCount !== "undefined" && (
              <span>Dislikes: {dislikesCount}</span>
            )}
            {(onCommentsClick || onMoreClick) && (
              <button
                type="button"
                className="ml-auto underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={onCommentsClick || onMoreClick}>
                {typeof commentsCount !== "undefined"
                  ? `Comments: ${commentsCount}`
                  : "Comments →"}
              </button>
            )}
          </div>
          {!canInteract && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Войдите, чтобы ставить лайки/дизлайки и комментировать.
            </p>
          )}
        </div>
      )}
    </article>
  );
});

export default ItemCommonCardView;
