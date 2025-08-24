import { memo } from "react";
import { ExpandableText } from "@/shared/ui/ExpandableText";

export type AnswerItemViewProps = {
  content: string;
  isCorrect?: boolean;
  canMark?: boolean;
  onMarkCorrect?: () => void;
  onMarkIncorrect?: () => void;
  pending?: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const AnswerItemView = memo(function AnswerItemView({
  content,
  isCorrect,
  canMark,
  onMarkCorrect,
  onMarkIncorrect,
  pending,
  canEdit,
  onEdit,
  onDelete,
}: AnswerItemViewProps) {
  const itemBase = "border rounded p-2 text-sm transition-colors";
  const itemNormal =
    "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700";
  const itemCorrect =
    "bg-green-50 border-green-400 dark:bg-green-900/30 dark:border-green-500";
  return (
    <li className={`${itemBase} ${isCorrect ? itemCorrect : itemNormal}`}>
      <div className="flex items-start justify-between gap-2">
        <ExpandableText
          text={content}
          mode="toggle"
          moreLabel="Показать весь"
          lessLabel="Показать меньше"
          className="flex-1"
          maxHeight={120}
        />
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {isCorrect && (
            <span className="text-green-700 dark:text-green-400 text-xs font-medium">
              Верный ответ
            </span>
          )}
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
          {canEdit && (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="text-xs px-2 py-1 border rounded">
                Изм.
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="text-xs px-2 py-1 border rounded border-red-600 text-red-600">
                Удал.
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
});

export default AnswerItemView;
