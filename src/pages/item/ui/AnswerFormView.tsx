import { memo } from "react";

export type AnswerFormViewProps = {
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  error?: string;
  disabled?: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export const AnswerFormView = memo(function AnswerFormView({
  textareaProps,
  error,
  disabled,
  onSubmit,
}: AnswerFormViewProps) {
  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <textarea
        className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
        rows={4}
        placeholder="Ваш ответ..."
        {...textareaProps}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        disabled={!!disabled}
        className="px-3 py-2 border rounded disabled:opacity-50 bg-white dark:bg-neutral-800">
        Отправить ответ
      </button>
    </form>
  );
});

export default AnswerFormView;
