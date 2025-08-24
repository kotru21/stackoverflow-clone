import { memo } from "react";
import { CodeBlock } from "@/shared/ui/CodeBlock";
import Avatar from "@/shared/ui/Avatar";

export type SnippetDetailsViewProps = {
  id: number;
  language?: string;
  authorName?: string;
  code: string;
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
};

export const SnippetDetailsView = memo(function SnippetDetailsView({
  id,
  language,
  authorName,
  code,
  likesCount,
  dislikesCount,
  commentsCount,
}: SnippetDetailsViewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Сниппет #{id}</h1>
        {language && (
          <span className="inline-flex items-center rounded bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
            {language}
          </span>
        )}
      </div>
      {authorName && (
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          Автор: <Avatar username={authorName} size={18} /> @{authorName}
        </p>
      )}
      <CodeBlock code={code} language={language} />
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {typeof likesCount !== "undefined" && <span>Likes: {likesCount}</span>}
        {typeof dislikesCount !== "undefined" && (
          <span>Dislikes: {dislikesCount}</span>
        )}
        {typeof commentsCount !== "undefined" && (
          <span>Comments: {commentsCount}</span>
        )}
      </div>
    </div>
  );
});

export default SnippetDetailsView;
