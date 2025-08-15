import { memo } from "react";
import { ExpandableText } from "../../../shared/ui/ExpandableText";
import Avatar from "../../../shared/ui/Avatar";
import { CodeBlock } from "../../../shared/ui/CodeBlock";

export type QuestionCardViewProps = {
  title: string;
  userName: string;
  description: string;
  attachedCode?: string;
  answersCount?: number;
  onMoreClick?: () => void;
};

export const QuestionCardView = memo(function QuestionCardView({
  title,
  userName,
  description,
  attachedCode,
  answersCount,
  onMoreClick,
}: QuestionCardViewProps) {
  return (
    <article className="border rounded p-3 space-y-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
      <div className="flex items-start justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="text-base font-semibold text-black dark:text-white">
          {title}
        </h2>
        <span className="shrink-0 inline-flex items-center gap-2">
          <Avatar username={userName} size={20} /> @{userName}
        </span>
      </div>
      <ExpandableText
        text={description}
        mode={onMoreClick ? "navigate" : "toggle"}
        onMoreClick={onMoreClick}
        className="text-sm"
      />
      {attachedCode && <CodeBlock code={attachedCode} className="max-h-64" />}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {typeof answersCount === "number" && (
          <span>Answers: {answersCount}</span>
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
});

export default QuestionCardView;
