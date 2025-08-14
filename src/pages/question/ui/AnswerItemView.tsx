import { memo } from "react";
import { ExpandableText } from "../../../shared/ui/ExpandableText";

export type AnswerItemViewProps = {
  content: string;
  isCorrect?: boolean;
};

export const AnswerItemView = memo(function AnswerItemView({
  content,
  isCorrect,
}: AnswerItemViewProps) {
  return (
    <li className="border rounded p-2 text-sm bg-white dark:bg-neutral-800">
      <div className="flex items-start justify-between gap-2">
        <ExpandableText
          text={content}
          mode="toggle"
          moreLabel="Показать весь"
          lessLabel="Показать меньше"
          className="flex-1"
          maxHeight={120}
        />
        {isCorrect && <span className="text-green-600 text-xs">correct</span>}
      </div>
    </li>
  );
});

export default AnswerItemView;
