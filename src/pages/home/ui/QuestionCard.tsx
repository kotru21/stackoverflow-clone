import { memo } from "react";
import { Link } from "react-router-dom";
import { CodeBlock } from "../../../shared/ui/CodeBlock";
import { ExpandableText } from "../../../shared/ui/ExpandableText";

export type QuestionCardProps = {
  id: string | number;
  title: string;
  description: string;
  attachedCode?: string;
  user: { username: string };
  answersCount?: number;
  onMoreClick?: () => void;
};

export const QuestionCard = memo(function QuestionCard({
  id,
  title,
  description,
  attachedCode,
  user,
  answersCount,
  onMoreClick,
}: QuestionCardProps) {
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
        mode={onMoreClick ? "navigate" : "toggle"}
        onMoreClick={onMoreClick}
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
});

export default QuestionCard;
