import { memo } from "react";

export type CommentFormViewProps = {
  content: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending?: boolean;
  error?: string | null;
  ok?: string | null;
};

export const CommentFormView = memo(function CommentFormView({
  content,
  onChange,
  onSubmit,
  pending,
  error,
  ok,
}: CommentFormViewProps) {
  return (
    <div className="space-y-2 ">
      <h2 className="text-lg font-semibold">Оставить комментарий</h2>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded border p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
        placeholder="Ваш комментарий..."
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!content.trim() || !!pending}
          className="px-3 py-1.5 border rounded disabled:opacity-50">
          Отправить
        </button>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        {ok && <span className="text-green-600 text-sm">{ok}</span>}
      </div>
    </div>
  );
});

export default CommentFormView;
