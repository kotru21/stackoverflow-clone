import { memo } from "react";
import { ExpandableText } from "../../../shared/ui/ExpandableText";

export type AnswerItemViewProps = {
  content: string;
  isCorrect?: boolean;
  canMark?: boolean;
  onMarkCorrect?: () => void;
  onMarkIncorrect?: () => void;
  pending?: boolean;
};

export const AnswerItemView = memo(function AnswerItemView({
  content,
  isCorrect,
  canMark,
  onMarkCorrect,
  onMarkIncorrect,
  pending,
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
        <div className="flex items-center gap-2">
          {isCorrect && <span className="text-green-600 text-xs">correct</span>}
          {canMark &&
            (isCorrect ? (
              <button
                type="button"
                onClick={onMarkIncorrect}
                disabled={!!pending}
                className="text-xs px-2 py-1 border rounded disabled:opacity-50">
                Снять метку
              </button>
            ) : (
              <button
                type="button"
                onClick={onMarkCorrect}
                disabled={!!pending}
                className="text-xs px-2 py-1 border rounded disabled:opacity-50">
                Пометить как верный
              </button>
            ))}
        </div>
      </div>
    </li>
  );
});

export default AnswerItemView;
